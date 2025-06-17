/*
 * WordWise AI Cloud Functions
 * Grammar and style analysis powered by OpenAI GPT-4o
 */

import { onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';
import { createHash } from 'crypto';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Firestore database reference
const db = admin.firestore();

// Types for suggestions
interface WritingSuggestion {
  id: string;
  type: 'grammar' | 'style' | 'clarity' | 'tone';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  suggestion: string;
  position?: {
    start: number;
    end: number;
  };
  originalText?: string;
  suggestedText?: string;
}

interface SuggestionRequest {
  text: string;
  userId: string;
  documentId?: string;
  language?: string;
}

interface SuggestionResponse {
  suggestions: WritingSuggestion[];
  wordCount: number;
  readabilityScore: number;
  processingTime: number;
  cached: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Rate limiting configuration
const RATE_LIMIT = {
  MONTHLY_LIMIT: 100,
  DAILY_LIMIT: 25,
  HOURLY_LIMIT: 10
};

/**
 * Generate cache key for content
 */
function generateCacheKey(text: string, userId: string): string {
  console.log('[generateCacheKey] Generating cache key for user:', userId);
  
  // Create hash of text content + user preferences
  const contentHash = createHash('sha256')
    .update(text.trim().toLowerCase())
    .digest('hex');
  
  // Include user ID to account for user-specific preferences
  const cacheKey = `suggestion_${contentHash}_${userId}`;
  
  console.log('[generateCacheKey] Generated cache key:', cacheKey.substring(0, 20) + '...');
  return cacheKey;
}

/**
 * Check rate limits for user
 */
async function checkRateLimit(userId: string): Promise<boolean> {
  console.log('[checkRateLimit] Checking rate limits for user:', userId);
  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
  
  try {
    // Count monthly usage
    const monthlyQuery = await db.collection('logs')
      .where('uid', '==', userId)
      .where('eventType', '==', 'suggestion')
      .where('payload.action', '==', 'request')
      .where('timestamp', '>=', monthStart)
      .get();
    
    const monthlyCount = monthlyQuery.size;
    console.log('[checkRateLimit] Monthly usage:', monthlyCount, '/', RATE_LIMIT.MONTHLY_LIMIT);
    
    if (monthlyCount >= RATE_LIMIT.MONTHLY_LIMIT) {
      console.log('[checkRateLimit] Monthly limit exceeded');
      return false;
    }
    
    // Count daily usage
    const dailyQuery = await db.collection('logs')
      .where('uid', '==', userId)
      .where('eventType', '==', 'suggestion')
      .where('payload.action', '==', 'request')
      .where('timestamp', '>=', dayStart)
      .get();
    
    const dailyCount = dailyQuery.size;
    console.log('[checkRateLimit] Daily usage:', dailyCount, '/', RATE_LIMIT.DAILY_LIMIT);
    
    if (dailyCount >= RATE_LIMIT.DAILY_LIMIT) {
      console.log('[checkRateLimit] Daily limit exceeded');
      return false;
    }
    
    // Count hourly usage
    const hourlyQuery = await db.collection('logs')
      .where('uid', '==', userId)
      .where('eventType', '==', 'suggestion')
      .where('payload.action', '==', 'request')
      .where('timestamp', '>=', hourStart)
      .get();
    
    const hourlyCount = hourlyQuery.size;
    console.log('[checkRateLimit] Hourly usage:', hourlyCount, '/', RATE_LIMIT.HOURLY_LIMIT);
    
    if (hourlyCount >= RATE_LIMIT.HOURLY_LIMIT) {
      console.log('[checkRateLimit] Hourly limit exceeded');
      return false;
    }
    
    console.log('[checkRateLimit] Rate limit check passed');
    return true;
  } catch (error) {
    console.error('[checkRateLimit] Error checking rate limits:', error);
    return false;
  }
}

/**
 * Get cached suggestions
 */
async function getCachedSuggestions(cacheKey: string): Promise<SuggestionResponse | null> {
  console.log('[getCachedSuggestions] Checking cache for key:', cacheKey.substring(0, 20) + '...');
  
  try {
    const cacheDoc = await db.collection('suggestion_cache').doc(cacheKey).get();
    
    if (cacheDoc.exists) {
      const cachedData = cacheDoc.data();
      const cacheAge = Date.now() - cachedData?.timestamp?.toDate()?.getTime();
      
      // Cache for 1 hour
      if (cacheAge < 3600000) {
        console.log('[getCachedSuggestions] Cache hit, age:', Math.round(cacheAge / 60000), 'minutes');
        return {
          ...cachedData,
          cached: true,
          processingTime: 0
        } as SuggestionResponse;
      } else {
        console.log('[getCachedSuggestions] Cache expired, age:', Math.round(cacheAge / 60000), 'minutes');
        // Clean up expired cache
        await cacheDoc.ref.delete();
      }
    } else {
      console.log('[getCachedSuggestions] Cache miss');
    }
    
    return null;
  } catch (error) {
    console.error('[getCachedSuggestions] Error checking cache:', error);
    return null;
  }
}

/**
 * Cache suggestions
 */
async function cacheSuggestions(cacheKey: string, response: SuggestionResponse): Promise<void> {
  console.log('[cacheSuggestions] Caching suggestions for key:', cacheKey.substring(0, 20) + '...');
  
  try {
    await db.collection('suggestion_cache').doc(cacheKey).set({
      ...response,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ttl: new Date(Date.now() + 3600000) // 1 hour TTL
    });
    
    console.log('[cacheSuggestions] Suggestions cached successfully');
  } catch (error) {
    console.error('[cacheSuggestions] Error caching suggestions:', error);
  }
}

/**
 * Calculate Flesch-Kincaid readability score
 */
function calculateReadabilityScore(text: string): number {
  console.log('[calculateReadabilityScore] Calculating readability for text length:', text.length);
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((total, word) => {
    // Simple syllable counting heuristic
    const syllableCount = word.toLowerCase().replace(/[^a-z]/g, '').replace(/e$/, '').replace(/[aeiouy]{2,}/g, 'a').replace(/[aeiouy]/g, 'a').replace(/[^a]/g, '').length || 1;
    return total + syllableCount;
  }, 0);
  
  if (sentences.length === 0 || words.length === 0) {
    console.log('[calculateReadabilityScore] No sentences or words found, returning 0');
    return 0;
  }
  
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  const gradeLevel = Math.max(1, Math.min(20, Math.round((score - 100) / -10)));
  
  console.log('[calculateReadabilityScore] Readability score:', score, 'Grade level:', gradeLevel);
  return gradeLevel;
}

/**
 * Analyze text with OpenAI GPT-4o
 */
async function analyzeWithAI(text: string): Promise<{ suggestions: WritingSuggestion[], usage?: any }> {
  console.log('[analyzeWithAI] Starting AI analysis for text length:', text.length);
  
  // Initialize OpenAI client (only when function runs in cloud environment)
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const prompt = `You are a professional writing assistant. Analyze the following text and provide grammar, style, clarity, and tone suggestions. 

CRITICAL INSTRUCTIONS:
- Never use hyphens or dashes in your response
- Focus on actionable improvements
- Be specific and helpful
- Provide exact text replacements when possible

Text to analyze:
"""
${text}
"""

Please respond with a JSON array of suggestions in this exact format:
[
  {
    "id": "unique_id_1",
    "type": "grammar|style|clarity|tone",
    "severity": "low|medium|high",
    "title": "Brief descriptive title",
    "description": "Detailed explanation of the issue",
    "suggestion": "Specific recommendation for improvement",
    "originalText": "exact text that needs changing",
    "suggestedText": "suggested replacement text",
    "position": {
      "start": 0,
      "end": 10
    }
  }
]

Only return the JSON array, no additional text.`;

  try {
    console.log('[analyzeWithAI] Sending request to OpenAI GPT-4o');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional writing assistant. Respond only with valid JSON. Never use hyphens or dashes in your suggestions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    console.log('[analyzeWithAI] Received response from OpenAI, length:', response?.length);
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let suggestions: WritingSuggestion[];
    try {
      suggestions = JSON.parse(response);
      console.log('[analyzeWithAI] Parsed', suggestions.length, 'suggestions');
    } catch (parseError) {
      console.error('[analyzeWithAI] Failed to parse AI response:', parseError);
      console.error('[analyzeWithAI] Raw response:', response);
      suggestions = [];
    }

    // Validate and clean suggestions
    const validSuggestions = suggestions.filter(s => 
      s.id && s.type && s.severity && s.title && s.description && s.suggestion
    ).map((s, index) => ({
      ...s,
      id: s.id || `ai_suggestion_${index}`,
      type: ['grammar', 'style', 'clarity', 'tone'].includes(s.type) ? s.type : 'style',
      severity: ['low', 'medium', 'high'].includes(s.severity) ? s.severity : 'medium'
    }));

    console.log('[analyzeWithAI] Returning', validSuggestions.length, 'valid suggestions');
    
    return {
      suggestions: validSuggestions,
      usage: completion.usage
    };
  } catch (error) {
    console.error('[analyzeWithAI] Error calling OpenAI:', error);
    throw error;
  }
}

/**
 * Log suggestion event
 */
async function logSuggestionEvent(
  userId: string,
  action: 'request' | 'accept' | 'dismiss',
  metadata: any
): Promise<void> {
  console.log('[logSuggestionEvent] Logging event:', action, 'for user:', userId);
  
  try {
    await db.collection('logs').add({
      eventType: 'suggestion',
      uid: userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      payload: {
        action,
        metadata
      },
      ttl: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    console.log('[logSuggestionEvent] Event logged successfully');
  } catch (error) {
    console.error('[logSuggestionEvent] Error logging event:', error);
  }
}

/**
 * Main function: Analyze text and return suggestions
 */
export const analyzeSuggestions = onCall(
  { timeoutSeconds: 30, memory: '1GiB', secrets: ['OPENAI_API_KEY'] },
  async (request) => {
    const { data } = request as { data: SuggestionRequest };
    const context = request.auth;
    console.log('[analyzeSuggestions] Function called for user:', data.userId);
    
    const startTime = Date.now();
    
    try {
      // Validate authentication
      if (!context) {
        console.error('[analyzeSuggestions] Unauthenticated request');
        throw new Error('Authentication required');
      }
      
      // Validate input
      if (!data.text || !data.userId) {
        console.error('[analyzeSuggestions] Missing required fields');
        throw new Error('Text and userId are required');
      }
      
      if (data.text.length < 10) {
        console.log('[analyzeSuggestions] Text too short, returning empty suggestions');
        return {
          suggestions: [],
          wordCount: 0,
          readabilityScore: 0,
          processingTime: Date.now() - startTime,
          cached: false
        };
      }
      
      if (data.text.length > 10000) {
        console.error('[analyzeSuggestions] Text too long');
        throw new Error('Text must be less than 10,000 characters');
      }
      
      // Check rate limits
      const withinLimits = await checkRateLimit(data.userId);
      if (!withinLimits) {
        console.error('[analyzeSuggestions] Rate limit exceeded');
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      // Generate cache key
      const cacheKey = generateCacheKey(data.text, data.userId);
      
      // Check cache first
      const cachedResult = await getCachedSuggestions(cacheKey);
      if (cachedResult) {
        console.log('[analyzeSuggestions] Returning cached result');
        return cachedResult;
      }
      
      // Analyze with AI
      console.log('[analyzeSuggestions] Analyzing with AI');
      const { suggestions, usage } = await analyzeWithAI(data.text);
      
      // Calculate additional metrics
      const wordCount = data.text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
      const readabilityScore = calculateReadabilityScore(data.text);
      const processingTime = Date.now() - startTime;
      
      const response: SuggestionResponse = {
        suggestions,
        wordCount,
        readabilityScore,
        processingTime,
        cached: false,
        usage
      };
      
      // Cache the result
      await cacheSuggestions(cacheKey, response);
      
      // Log the request
      await logSuggestionEvent(data.userId, 'request', {
        textLength: data.text.length,
        wordCount,
        suggestionsCount: suggestions.length,
        processingTime,
        usage,
        documentId: data.documentId
      });
      
      console.log('[analyzeSuggestions] Analysis complete, returning', suggestions.length, 'suggestions');
      return response;
      
    } catch (error) {
      console.error('[analyzeSuggestions] Function error:', error);
      
      // Log error
      await logSuggestionEvent(data.userId, 'request', {
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      });
      
      // Re-throw errors
      throw new Error('Analysis failed');
    }
  });

/**
 * Cleanup old cache entries
 */
export const cleanupCache = onSchedule('0 2 * * *', async () => {
    console.log('[cleanupCache] Starting cache cleanup');
    
    try {
      const cutoff = new Date(Date.now() - 3600000); // 1 hour ago
      const snapshot = await db.collection('suggestion_cache')
        .where('ttl', '<', cutoff)
        .limit(100)
        .get();
      
      const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);
      
      console.log('[cleanupCache] Deleted', snapshot.docs.length, 'expired cache entries');
    } catch (error) {
      console.error('[cleanupCache] Error during cleanup:', error);
    }
  });

/**
 * Get usage statistics for a user
 */
export const getUserUsage = onCall(async (request) => {
  const { data } = request;
  const context = request.auth;
  
  console.log('[getUserUsage] Getting usage for user:', data.userId);
  
  try {
    // Validate authentication
    if (!context) {
      throw new Error('Authentication required');
    }
    
    if (!data.userId) {
      throw new Error('userId is required');
    }
      
      // Get current usage
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
      
      const [monthlySnapshot, dailySnapshot, hourlySnapshot] = await Promise.all([
        db.collection('logs')
          .where('uid', '==', data.userId)
          .where('eventType', '==', 'suggestion')
          .where('payload.action', '==', 'request')
          .where('timestamp', '>=', monthStart)
          .get(),
        db.collection('logs')
          .where('uid', '==', data.userId)
          .where('eventType', '==', 'suggestion')
          .where('payload.action', '==', 'request')
          .where('timestamp', '>=', dayStart)
          .get(),
        db.collection('logs')
          .where('uid', '==', data.userId)
          .where('eventType', '==', 'suggestion')
          .where('payload.action', '==', 'request')
          .where('timestamp', '>=', hourStart)
          .get()
      ]);
      
      const usage = {
        monthly: {
          used: monthlySnapshot.size,
          limit: RATE_LIMIT.MONTHLY_LIMIT,
          remaining: RATE_LIMIT.MONTHLY_LIMIT - monthlySnapshot.size
        },
        daily: {
          used: dailySnapshot.size,
          limit: RATE_LIMIT.DAILY_LIMIT,
          remaining: RATE_LIMIT.DAILY_LIMIT - dailySnapshot.size
        },
        hourly: {
          used: hourlySnapshot.size,
          limit: RATE_LIMIT.HOURLY_LIMIT,
          remaining: RATE_LIMIT.HOURLY_LIMIT - hourlySnapshot.size
        }
      };
      
      console.log('[getUserUsage] Usage calculated:', usage);
      return usage;
      
  } catch (error) {
    console.error('[getUserUsage] Error getting usage:', error);
    throw new Error('Failed to get usage');
  }
}); 
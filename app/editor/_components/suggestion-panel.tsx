"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Lightbulb,
  CheckCircle,
  X,
  AlertTriangle,
  BookOpen,
  Zap,
  Clock,
  Wifi,
  WifiOff
} from "lucide-react"
import {
  getAISuggestionsAction,
  logSuggestionInteractionAction,
  type WritingSuggestion,
  type SuggestionResponse
} from "@/actions/ai-suggestions-actions"

interface SuggestionPanelProps {
  content: string
  userId: string
  documentId?: string
  onSuggestionApplied?: (suggestion: WritingSuggestion) => void
}

export function SuggestionPanel({
  content,
  userId,
  documentId,
  onSuggestionApplied
}: SuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  )
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState("")
  const [processingTime, setProcessingTime] = useState<number | null>(null)
  const [isCached, setIsCached] = useState(false)
  const [readabilityScore, setReadabilityScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  console.log("[SuggestionPanel] Component mounted for user:", userId)
  console.log("[SuggestionPanel] Document ID:", documentId)

  // Debounced AI analysis function
  const analyzeContent = useCallback(
    async (textContent: string) => {
      if (!textContent || textContent.length < 10) {
        console.log("[SuggestionPanel] Text too short, clearing suggestions")
        setSuggestions([])
        setError(null)
        setProcessingTime(null)
        setIsCached(false)
        setReadabilityScore(null)
        return
      }

      if (textContent === lastAnalyzedContent) {
        console.log("[SuggestionPanel] Content unchanged, skipping analysis")
        return
      }

      console.log(
        "[SuggestionPanel] Starting AI analysis for content length:",
        textContent.length
      )
      setIsLoading(true)
      setError(null)

      try {
        const result = await getAISuggestionsAction(textContent, documentId)

        if (result.isSuccess && result.data) {
          console.log("[SuggestionPanel] AI analysis successful")
          console.log(
            "[SuggestionPanel] Found",
            result.data.suggestions.length,
            "suggestions"
          )
          console.log(
            "[SuggestionPanel] Processing time:",
            result.data.processingTime + "ms"
          )
          console.log("[SuggestionPanel] Cached:", result.data.cached)
          console.log(
            "[SuggestionPanel] Readability score:",
            result.data.readabilityScore
          )

          setSuggestions(result.data.suggestions)
          setProcessingTime(result.data.processingTime)
          setIsCached(result.data.cached)
          setReadabilityScore(result.data.readabilityScore)
          setLastAnalyzedContent(textContent)
          setError(null)

          if (result.data.suggestions.length === 0) {
            toast({
              title: "Analysis Complete",
              description: "Great job! No suggestions needed for this text."
            })
          }
        } else {
          console.error("[SuggestionPanel] AI analysis failed:", result.message)
          setError(result.message)
          setSuggestions([])

          toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: result.message
          })
        }
      } catch (error) {
        console.error(
          "[SuggestionPanel] Unexpected error during analysis:",
          error
        )
        setError("An unexpected error occurred during analysis")
        setSuggestions([])

        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to analyze text. Please try again."
        })
      } finally {
        setIsLoading(false)
      }
    },
    [lastAnalyzedContent, documentId, toast]
  )

  // Debounced effect for content analysis
  useEffect(() => {
    if (!content || content.length < 10) {
      setSuggestions([])
      setError(null)
      return
    }

    console.log("[SuggestionPanel] Content changed, scheduling analysis")

    // Debounce AI requests by 1 second
    const timeoutId = setTimeout(() => {
      analyzeContent(content)
    }, 1000)

    return () => {
      console.log("[SuggestionPanel] Clearing analysis timeout")
      clearTimeout(timeoutId)
    }
  }, [content, analyzeContent])

  const handleAcceptSuggestion = async (suggestionId: string) => {
    console.log("[SuggestionPanel] Accepting suggestion:", suggestionId)

    const suggestion = suggestions.find(s => s.id === suggestionId)
    if (!suggestion) {
      console.error("[SuggestionPanel] Suggestion not found:", suggestionId)
      return
    }

    try {
      // Log the acceptance
      await logSuggestionInteractionAction("accept", suggestionId, {
        suggestionType: suggestion.type,
        severity: suggestion.severity,
        documentId,
        textLength: content.length
      })

      // Apply suggestion to editor if callback provided
      if (onSuggestionApplied) {
        onSuggestionApplied(suggestion)
      }

      // Remove suggestion from list
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId))

      toast({
        title: "Suggestion Applied",
        description: suggestion.title
      })

      console.log(
        "[SuggestionPanel] Suggestion accepted and logged successfully"
      )
    } catch (error) {
      console.error("[SuggestionPanel] Error accepting suggestion:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply suggestion"
      })
    }
  }

  const handleDismissSuggestion = async (suggestionId: string) => {
    console.log("[SuggestionPanel] Dismissing suggestion:", suggestionId)

    const suggestion = suggestions.find(s => s.id === suggestionId)
    if (!suggestion) {
      console.error("[SuggestionPanel] Suggestion not found:", suggestionId)
      return
    }

    try {
      // Log the dismissal
      await logSuggestionInteractionAction("dismiss", suggestionId, {
        suggestionType: suggestion.type,
        severity: suggestion.severity,
        documentId,
        textLength: content.length
      })

      // Remove suggestion from list
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId))

      console.log(
        "[SuggestionPanel] Suggestion dismissed and logged successfully"
      )
    } catch (error) {
      console.error("[SuggestionPanel] Error dismissing suggestion:", error)
      // Still remove the suggestion even if logging fails
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    }
  }

  const getSeverityColor = (severity: WritingSuggestion["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: WritingSuggestion["type"]) => {
    switch (type) {
      case "grammar":
        return <BookOpen className="size-4" />
      case "style":
        return <Zap className="size-4" />
      case "clarity":
        return <Lightbulb className="size-4" />
      case "tone":
        return <AlertTriangle className="size-4" />
      default:
        return <Lightbulb className="size-4" />
    }
  }

  return (
    <Card className="border-purple-100/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Lightbulb className="size-4 text-purple-600" />
          AI Writing Assistant
          {suggestions.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {suggestions.length}
            </Badge>
          )}
          {isLoading && (
            <div className="ml-2 size-4 animate-spin rounded-full border-b-2 border-purple-600"></div>
          )}
        </CardTitle>

        {/* Performance and Cache Status */}
        {(processingTime !== null || readabilityScore !== null) && (
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {processingTime !== null && (
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>
                  {processingTime < 1000
                    ? `${processingTime}ms`
                    : `${(processingTime / 1000).toFixed(1)}s`}
                </span>
              </div>
            )}
            {isCached && (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="size-3" />
                <span>Cached</span>
              </div>
            )}
            {readabilityScore !== null && (
              <div className="flex items-center gap-1">
                <BookOpen className="size-3" />
                <span>Grade {readabilityScore}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {error ? (
          <div className="py-6 text-center">
            <WifiOff className="mx-auto mb-2 size-8 text-red-300" />
            <p className="mb-2 text-sm text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => analyzeContent(content)}
              disabled={isLoading}
            >
              Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-b-2 border-purple-600"></div>
            <span className="ml-2 text-sm text-gray-600">
              Analyzing with AI...
            </span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="py-8 text-center">
            <Lightbulb className="mx-auto mb-2 size-8 text-gray-300" />
            <p className="text-sm text-gray-500">
              {content.length < 10
                ? "Start writing to see AI suggestions"
                : "Great writing! No suggestions needed."}
            </p>
            {content.length >= 10 && (
              <p className="mt-1 text-xs text-gray-400">AI analysis complete</p>
            )}
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={suggestion.id}>
              <div className="space-y-2 rounded-lg border border-gray-100 p-3 transition-colors hover:border-purple-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="text-sm font-medium">
                      {suggestion.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getSeverityColor(suggestion.severity)}`}
                    >
                      {suggestion.severity}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="size-6 p-0 hover:bg-gray-100"
                    onClick={() => handleDismissSuggestion(suggestion.id)}
                    aria-label="Dismiss suggestion"
                  >
                    <X className="size-3" />
                  </Button>
                </div>

                <p className="text-xs text-gray-600">
                  {suggestion.description}
                </p>

                <div className="rounded bg-purple-50 p-2 text-xs text-purple-800">
                  💡 {suggestion.suggestion}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-purple-200 text-xs hover:bg-purple-50"
                    onClick={() => handleAcceptSuggestion(suggestion.id)}
                  >
                    <CheckCircle className="mr-1 size-3" />
                    Accept
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs hover:bg-gray-50"
                    onClick={() => handleDismissSuggestion(suggestion.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
              {index < suggestions.length - 1 && <Separator className="my-3" />}
            </div>
          ))
        )}

        {suggestions.length > 0 && (
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {suggestions.filter(s => s.severity === "high").length}{" "}
                critical,{" "}
                {suggestions.filter(s => s.severity === "medium").length}{" "}
                important
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs hover:bg-purple-50"
                onClick={() => setSuggestions([])}
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Clock, BarChart3, Target, BookOpen } from "lucide-react"

interface DocumentStatsProps {
  wordCount: number
  readabilityScore?: number
  characterCount?: number
  readingTime?: number
}

export function DocumentStats({
  wordCount,
  readabilityScore,
  characterCount,
  readingTime
}: DocumentStatsProps) {
  console.log("[DocumentStats] Rendering stats - wordCount:", wordCount)

  // Calculate derived stats
  const calculatedCharCount = characterCount || wordCount * 5 // Rough estimate
  const calculatedReadingTime = readingTime || Math.ceil(wordCount / 200) // 200 words per minute
  const calculatedReadability =
    readabilityScore || Math.max(1, Math.min(20, 8 + wordCount / 100))

  // Determine readability level
  const getReadabilityLevel = (score: number) => {
    if (score <= 6)
      return {
        level: "Very Easy",
        color: "bg-green-500",
        description: "5th grade"
      }
    if (score <= 9)
      return {
        level: "Easy",
        color: "bg-green-400",
        description: "8th-9th grade"
      }
    if (score <= 13)
      return {
        level: "Standard",
        color: "bg-yellow-400",
        description: "High school"
      }
    if (score <= 16)
      return {
        level: "Difficult",
        color: "bg-orange-400",
        description: "College"
      }
    return {
      level: "Very Difficult",
      color: "bg-red-400",
      description: "Graduate"
    }
  }

  const readabilityInfo = getReadabilityLevel(calculatedReadability)

  return (
    <Card className="border-purple-100/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <BarChart3 className="size-4 text-purple-600" />
          Document Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Word Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-gray-500" />
            <span className="text-sm text-gray-600">Words</span>
          </div>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700">
            {wordCount.toLocaleString()}
          </Badge>
        </div>

        {/* Character Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-500">Aa</span>
            <span className="text-sm text-gray-600">Characters</span>
          </div>
          <span className="text-sm text-gray-700">
            {calculatedCharCount.toLocaleString()}
          </span>
        </div>

        {/* Reading Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-gray-500" />
            <span className="text-sm text-gray-600">Reading time</span>
          </div>
          <span className="text-sm text-gray-700">
            {calculatedReadingTime} min
          </span>
        </div>

        {/* Readability Score */}
        {wordCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-gray-500" />
                <span className="text-sm text-gray-600">Readability</span>
              </div>
              <Badge
                variant="secondary"
                className={`${readabilityInfo.color} text-white`}
              >
                {readabilityInfo.level}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Grade {Math.round(calculatedReadability)}</span>
                <span>{readabilityInfo.description}</span>
              </div>
              <Progress
                value={Math.min(100, (calculatedReadability / 20) * 100)}
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Writing Goals */}
        <div className="border-t border-gray-100 pt-3">
          <div className="mb-2 flex items-center gap-2">
            <Target className="size-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Writing Goals
            </span>
          </div>

          <div className="space-y-2">
            {/* Daily word goal */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Daily Goal</span>
                <span>{Math.min(wordCount, 500)}/500</span>
              </div>
              <Progress
                value={Math.min(100, (wordCount / 500) * 100)}
                className="h-1.5"
              />
            </div>

            {/* Session progress */}
            {wordCount > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Session Progress</span>
                  <span>
                    {wordCount > 250
                      ? "Excellent"
                      : wordCount > 100
                        ? "Good"
                        : "Getting started"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        {wordCount === 0 && (
          <div className="border-t border-gray-100 pt-3">
            <div className="rounded-lg bg-purple-50 p-3">
              <p className="text-xs text-purple-800">
                💡 Start typing to see live statistics and writing insights
              </p>
            </div>
          </div>
        )}

        {wordCount > 0 && wordCount < 50 && (
          <div className="border-t border-gray-100 pt-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-800">
                🚀 Keep going! Write a bit more to unlock detailed analysis
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

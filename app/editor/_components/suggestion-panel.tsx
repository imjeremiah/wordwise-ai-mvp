"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Lightbulb,
  CheckCircle,
  X,
  AlertTriangle,
  BookOpen,
  Zap
} from "lucide-react"

interface SuggestionPanelProps {
  content: string
  userId: string
}

interface WritingSuggestion {
  id: string
  type: "grammar" | "style" | "clarity" | "tone"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  suggestion: string
  position?: {
    start: number
    end: number
  }
}

export function SuggestionPanel({ content, userId }: SuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  )

  console.log("[SuggestionPanel] Component mounted for user:", userId)

  // Mock suggestions for now (will be replaced with AI in Phase 4)
  useEffect(() => {
    if (!content || content.length < 10) {
      setSuggestions([])
      return
    }

    console.log("[SuggestionPanel] Analyzing content length:", content.length)

    // Generate mock suggestions based on content
    const mockSuggestions: WritingSuggestion[] = []

    // Check for common issues
    if (content.includes("very")) {
      mockSuggestions.push({
        id: "1",
        type: "style",
        severity: "medium",
        title: "Strengthen your language",
        description: "Consider replacing 'very' with a stronger word",
        suggestion: "Use more specific adjectives instead of 'very + adjective'"
      })
    }

    if (content.split(".").length > 3) {
      mockSuggestions.push({
        id: "2",
        type: "clarity",
        severity: "low",
        title: "Sentence variety",
        description: "Consider varying your sentence structure",
        suggestion: "Mix short and long sentences for better flow"
      })
    }

    if (content.length > 100 && !content.includes(",")) {
      mockSuggestions.push({
        id: "3",
        type: "grammar",
        severity: "high",
        title: "Consider punctuation",
        description: "Long sentences may benefit from commas",
        suggestion: "Break up complex ideas with proper punctuation"
      })
    }

    setSuggestions(mockSuggestions)
  }, [content])

  const handleAcceptSuggestion = (suggestionId: string) => {
    console.log("[SuggestionPanel] Accepting suggestion:", suggestionId)
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    // TODO: Apply suggestion to editor content
  }

  const handleDismissSuggestion = (suggestionId: string) => {
    console.log("[SuggestionPanel] Dismissing suggestion:", suggestionId)
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
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
          Writing Suggestions
          {suggestions.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {suggestions.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-b-2 border-purple-600"></div>
            <span className="ml-2 text-sm text-gray-600">Analyzing...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="py-8 text-center">
            <Lightbulb className="mx-auto mb-2 size-8 text-gray-300" />
            <p className="text-sm text-gray-500">
              Start writing to see suggestions
            </p>
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

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Save,
  FileText,
  ArrowLeft,
  Settings,
  MoreVertical,
  BookOpen,
  Target,
  Zap
} from "lucide-react"
import { LexicalEditor } from "./lexical-editor"
import { SuggestionPanel } from "./suggestion-panel"
import { DocumentStats } from "./document-stats"
import {
  createDocumentAction,
  updateDocumentAction,
  getDocumentAction
} from "@/actions/db/documents-actions"
import { FirebaseDocument } from "@/types/firebase-types"
import { useToast } from "@/hooks/use-toast"

interface EditorContentProps {
  userId: string
}

export function EditorContent({ userId }: EditorContentProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Document state
  const [document, setDocument] = useState<FirebaseDocument | null>(null)
  const [title, setTitle] = useState("Untitled Document")
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  console.log("[EditorContent] Component mounted for user:", userId)

  // Load document if documentId is in URL params
  useEffect(() => {
    const loadDocument = async () => {
      console.log("[EditorContent] Loading document...")
      setIsLoading(true)

      // Check if we have a document ID in URL params
      const urlParams = new URLSearchParams(window.location.search)
      const documentId = urlParams.get("id")

      if (documentId) {
        console.log("[EditorContent] Loading document with ID:", documentId)
        const result = await getDocumentAction(documentId)

        if (result.isSuccess && result.data) {
          console.log("[EditorContent] Document loaded successfully")
          setDocument(result.data)
          setTitle(result.data.title)
          setContent(result.data.content)
          setWordCount(result.data.wordCount)
          setHasUnsavedChanges(false)
        } else {
          console.error(
            "[EditorContent] Failed to load document:",
            result.message
          )
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load document"
          })
        }
      } else {
        console.log("[EditorContent] No document ID, creating new document")
        // Create a new document
        await createNewDocument()
      }

      setIsLoading(false)
    }

    loadDocument()
  }, [userId, toast])

  // Create new document
  const createNewDocument = async () => {
    console.log("[EditorContent] Creating new document")

    const result = await createDocumentAction({
      ownerUID: userId,
      title: "Untitled Document",
      content: "",
      wordCount: 0
    })

    if (result.isSuccess && result.data) {
      console.log(
        "[EditorContent] New document created with ID:",
        result.data.id
      )
      setDocument(result.data)
      setLastSaved(new Date())
      setHasUnsavedChanges(false)

      // Update URL with document ID
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set("id", result.data.id!)
      window.history.replaceState({}, "", newUrl.toString())
    } else {
      console.error(
        "[EditorContent] Failed to create document:",
        result.message
      )
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create document"
      })
    }
  }

  // Manual save document only
  const saveDocument = useCallback(async () => {
    if (!document?.id || isSaving) return

    console.log("[EditorContent] Saving document:", document.id)
    setIsSaving(true)

    try {
      const result = await updateDocumentAction(document.id, {
        title,
        content,
        wordCount
      })

      if (result.isSuccess) {
        console.log("[EditorContent] Document saved successfully")
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        toast({
          title: "Saved",
          description: "Document saved successfully"
        })
      } else {
        console.error(
          "[EditorContent] Failed to save document:",
          result.message
        )
        toast({
          variant: "destructive",
          title: "Save Error",
          description: "Failed to save document"
        })
      }
    } catch (error) {
      console.error("[EditorContent] Save error:", error)
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "An unexpected error occurred while saving"
      })
    } finally {
      setIsSaving(false)
    }
  }, [document?.id, title, content, wordCount, isSaving, toast])

  // Autosave functionality
  const autosave = useCallback(async () => {
    if (!document?.id || !hasUnsavedChanges) return

    console.log("[EditorContent] Autosaving document:", document.id)

    try {
      const result = await updateDocumentAction(document.id, {
        title,
        content,
        wordCount
      })

      if (result.isSuccess) {
        console.log("[EditorContent] Autosave successful")
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
      } else {
        console.error("[EditorContent] Autosave failed:", result.message)
      }
    } catch (error) {
      console.error("[EditorContent] Autosave error:", error)
    }
  }, [document?.id, title, content, wordCount, hasUnsavedChanges])

  // Debounced autosave effect
  useEffect(() => {
    if (!hasUnsavedChanges || !document?.id) return

    console.log("[EditorContent] Scheduling autosave in 1 second")

    // Autosave after 1 second of inactivity
    const timeoutId = setTimeout(() => {
      autosave()
    }, 1000)

    return () => {
      console.log("[EditorContent] Clearing autosave timeout")
      clearTimeout(timeoutId)
    }
  }, [hasUnsavedChanges, autosave])

  // Handle content change from Lexical editor
  const handleContentChange = useCallback(
    (newContent: string, newWordCount: number) => {
      console.log("[EditorContent] Content changed, word count:", newWordCount)
      setContent(newContent)
      setWordCount(newWordCount)
      setHasUnsavedChanges(true)
    },
    []
  )

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    console.log("[EditorContent] Title changed:", newTitle)
    setTitle(newTitle)
    setHasUnsavedChanges(true)
  }

  // Manual save
  const handleManualSave = () => {
    console.log("[EditorContent] Manual save triggered")
    saveDocument()
  }

  // Back to dashboard
  const handleBackToDashboard = () => {
    console.log("[EditorContent] Navigating back to dashboard")
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 size-8 animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></div>
          <p className="text-gray-600">Loading your document...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Grammarly Style */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>

              <div className="flex items-center gap-3">
                <FileText className="size-5 text-green-600" />
                <Input
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="border-none bg-transparent text-xl font-medium text-gray-900 placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0"
                  placeholder="Untitled Document"
                  aria-label="Document title"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live word count */}
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <FileText className="size-4" />
                <span>{wordCount} words</span>
              </div>

              {/* Autosave status */}
              {hasUnsavedChanges ? (
                <span className="text-sm font-medium text-amber-600">
                  Autosaving...
                </span>
              ) : lastSaved ? (
                <span className="text-sm text-green-600">
                  ✓ Saved {lastSaved.toLocaleTimeString()}
                </span>
              ) : null}

              <Button
                onClick={handleManualSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
                size="sm"
                aria-label="Save document"
              >
                <Save
                  className={`mr-2 size-4 ${isSaving ? "animate-spin" : ""}`}
                />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Grammarly Style */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Editor Area - Clean Grammarly Style */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <LexicalEditor
                initialContent={content}
                onContentChange={handleContentChange}
                placeholder="Start writing your document..."
              />
            </div>
          </div>

          {/* Sidebar - Grammarly Style */}
          <div className="space-y-6 lg:col-span-1">
            {/* Document Stats */}
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FileText className="size-4 text-green-600" />
                  Document Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Words</span>
                  <span className="text-sm font-medium text-gray-900">
                    {wordCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Characters</span>
                  <span className="text-sm font-medium text-gray-900">
                    {content.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reading time</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.ceil(wordCount / 200)} min
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Writing Goals */}
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Target className="size-4 text-green-600" />
                  Writing Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily Goal</span>
                    <span className="font-medium text-gray-900">
                      {wordCount}/500
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600 transition-all duration-300"
                      style={{
                        width: `${Math.min((wordCount / 500) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Writing Suggestions */}
            <SuggestionPanel
              content={content}
              userId={userId}
              documentId={document?.id}
              onSuggestionApplied={suggestion => {
                console.log(
                  "[EditorContent] Suggestion applied:",
                  suggestion.title
                )
                // Could implement automatic text replacement here
              }}
            />

            {/* Quick Actions */}
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Settings className="size-4 text-green-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Check grammar"
                >
                  <BookOpen className="mr-2 size-4" />
                  Check Grammar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  aria-label="Improve style"
                >
                  <Target className="mr-2 size-4" />
                  Improve Style
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

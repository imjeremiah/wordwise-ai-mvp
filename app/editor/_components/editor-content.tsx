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

  // Auto-save document
  const saveDocument = useCallback(
    async (forceUpdate = false) => {
      if (!document?.id || isSaving) return

      console.log("[EditorContent] Auto-saving document:", document.id)
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
          if (forceUpdate) {
            toast({
              title: "Saved",
              description: "Document saved successfully"
            })
          }
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
      } finally {
        setIsSaving(false)
      }
    },
    [document?.id, title, content, wordCount, isSaving, toast]
  )

  // Auto-save effect with debounce
  useEffect(() => {
    if (!document?.id) return

    const timer = setTimeout(() => {
      saveDocument()
    }, 1000) // Save after 1 second of inactivity

    return () => clearTimeout(timer)
  }, [title, content, saveDocument, document?.id])

  // Handle content change from Lexical editor
  const handleContentChange = useCallback(
    (newContent: string, newWordCount: number) => {
      console.log("[EditorContent] Content changed, word count:", newWordCount)
      setContent(newContent)
      setWordCount(newWordCount)
    },
    []
  )

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    console.log("[EditorContent] Title changed:", newTitle)
    setTitle(newTitle)
  }

  // Manual save
  const handleManualSave = () => {
    console.log("[EditorContent] Manual save triggered")
    saveDocument(true)
  }

  // Back to dashboard
  const handleBackToDashboard = () => {
    console.log("[EditorContent] Navigating back to dashboard")
    router.push("/dashboard")
  }

  if (isLoading) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30">
      {/* Header */}
      <div className="border-b border-purple-100/50 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 hover:bg-purple-50"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>

              <div className="flex items-center gap-2">
                <FileText className="size-5 text-purple-600" />
                <Input
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="border-none bg-transparent text-lg font-semibold focus:border-purple-300 focus:ring-0"
                  placeholder="Document title..."
                  aria-label="Document title"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}

              <Button
                variant={isSaving ? "ghost" : "purple"}
                size="sm"
                onClick={handleManualSave}
                disabled={isSaving}
                className="flex items-center gap-2"
                aria-label="Save document"
              >
                <Save className={`size-4 ${isSaving ? "animate-spin" : ""}`} />
                {isSaving ? "Saving..." : "Save"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-purple-50"
                aria-label="Document settings"
              >
                <MoreVertical className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Editor Area */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-purple-100/50 bg-white/80 shadow-sm backdrop-blur-sm">
              <LexicalEditor
                initialContent={content}
                onContentChange={handleContentChange}
                placeholder="Start writing your document..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Document Stats */}
            <DocumentStats
              wordCount={wordCount}
              readabilityScore={document?.readabilityScore}
            />

            {/* Writing Suggestions Panel */}
            <SuggestionPanel content={content} userId={userId} />

            {/* Quick Actions */}
            <Card className="border-purple-100/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Zap className="size-4 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-purple-50"
                  aria-label="Check grammar"
                >
                  <BookOpen className="mr-2 size-4" />
                  Check Grammar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-purple-50"
                  aria-label="Improve style"
                >
                  <Target className="mr-2 size-4" />
                  Improve Style
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-purple-50"
                  aria-label="Editor settings"
                >
                  <Settings className="mr-2 size-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

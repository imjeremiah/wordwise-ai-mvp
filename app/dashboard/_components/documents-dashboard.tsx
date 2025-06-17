"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Plus,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  Eye
} from "lucide-react"
import { FirebaseDocument } from "@/types/firebase-types"
import {
  getUserDocumentsAction,
  createDocumentAction,
  deleteDocumentAction,
  updateDocumentAction
} from "@/actions/db/documents-actions"
import { useToast } from "@/hooks/use-toast"

interface DocumentsDashboardProps {
  userId: string
}

export function DocumentsDashboard({ userId }: DocumentsDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()

  // State management
  const [documents, setDocuments] = useState<FirebaseDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isCreating, setIsCreating] = useState(false)
  const [editingDocument, setEditingDocument] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  console.log("[DocumentsDashboard] Component mounted for user:", userId)

  // Load documents
  useEffect(() => {
    loadDocuments()
  }, [userId])

  const loadDocuments = async () => {
    console.log("[DocumentsDashboard] Loading documents...")
    setIsLoading(true)

    try {
      const result = await getUserDocumentsAction(userId)

      if (result.isSuccess && result.data) {
        console.log(
          "[DocumentsDashboard] Loaded",
          result.data.length,
          "documents"
        )
        setDocuments(result.data)
      } else {
        console.error(
          "[DocumentsDashboard] Failed to load documents:",
          result.message
        )
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load documents"
        })
      }
    } catch (error) {
      console.error("[DocumentsDashboard] Error loading documents:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create new document
  const handleCreateDocument = async () => {
    console.log("[DocumentsDashboard] Creating new document...")
    setIsCreating(true)

    try {
      const result = await createDocumentAction({
        ownerUID: userId,
        title: "Untitled Document",
        content: "",
        wordCount: 0
      })

      if (result.isSuccess && result.data) {
        console.log(
          "[DocumentsDashboard] Document created with ID:",
          result.data.id
        )

        // Navigate to editor with new document
        router.push(`/editor?id=${result.data.id}`)

        toast({
          title: "Document Created",
          description: "New document created successfully"
        })
      } else {
        console.error(
          "[DocumentsDashboard] Failed to create document:",
          result.message
        )
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create document"
        })
      }
    } catch (error) {
      console.error("[DocumentsDashboard] Error creating document:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create document"
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Edit document title
  const handleEditTitle = async (documentId: string, newTitle: string) => {
    console.log(
      "[DocumentsDashboard] Updating document title:",
      documentId,
      newTitle
    )

    try {
      const result = await updateDocumentAction(documentId, { title: newTitle })

      if (result.isSuccess) {
        console.log("[DocumentsDashboard] Document title updated successfully")
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === documentId ? { ...doc, title: newTitle } : doc
          )
        )
        setEditingDocument(null)
        setEditTitle("")

        toast({
          title: "Title Updated",
          description: "Document title updated successfully"
        })
      } else {
        console.error(
          "[DocumentsDashboard] Failed to update title:",
          result.message
        )
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update document title"
        })
      }
    } catch (error) {
      console.error("[DocumentsDashboard] Error updating title:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update document title"
      })
    }
  }

  // Delete document
  const handleDeleteDocument = async (documentId: string) => {
    console.log("[DocumentsDashboard] Deleting document:", documentId)

    try {
      const result = await deleteDocumentAction(documentId)

      if (result.isSuccess) {
        console.log("[DocumentsDashboard] Document deleted successfully")
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))

        toast({
          title: "Document Deleted",
          description: "Document deleted successfully"
        })
      } else {
        console.error(
          "[DocumentsDashboard] Failed to delete document:",
          result.message
        )
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete document"
        })
      }
    } catch (error) {
      console.error("[DocumentsDashboard] Error deleting document:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete document"
      })
    }
  }

  // Open document in editor
  const handleOpenDocument = (documentId: string) => {
    console.log("[DocumentsDashboard] Opening document:", documentId)
    router.push(`/editor?id=${documentId}`)
  }

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(
      doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours =
      (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    } else if (diffInHours < 168) {
      // 7 days
      return new Date(date).toLocaleDateString([], { weekday: "short" })
    } else {
      return new Date(date).toLocaleDateString([], {
        month: "short",
        day: "numeric"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600">
            Create and manage your writing documents
          </p>
        </div>

        <Button
          onClick={handleCreateDocument}
          disabled={isCreating}
          className="flex items-center gap-2"
          aria-label="Create new document"
        >
          <Plus className="size-4" />
          {isCreating ? "Creating..." : "New Document"}
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search documents"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2"
            aria-label={`Sort documents ${sortOrder === "desc" ? "ascending" : "descending"}`}
          >
            {sortOrder === "desc" ? (
              <SortDesc className="size-4" />
            ) : (
              <SortAsc className="size-4" />
            )}
            Date
          </Button>
        </div>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/4 rounded bg-gray-200"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 size-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {searchQuery ? "No documents found" : "No documents yet"}
            </h3>
            <p className="mb-4 text-center text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first document to get started with WordWise AI"}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateDocument} disabled={isCreating}>
                <Plus className="mr-2 size-4" />
                Create Document
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map(document => (
            <Card
              key={document.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleOpenDocument(document.id!)}
              tabIndex={0}
              role="button"
              aria-label={`Open document: ${document.title}`}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleOpenDocument(document.id!)
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    {editingDocument === document.id ? (
                      <Input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onBlur={() => {
                          if (editTitle.trim()) {
                            handleEditTitle(document.id!, editTitle.trim())
                          } else {
                            setEditingDocument(null)
                            setEditTitle("")
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            if (editTitle.trim()) {
                              handleEditTitle(document.id!, editTitle.trim())
                            } else {
                              setEditingDocument(null)
                              setEditTitle("")
                            }
                          } else if (e.key === "Escape") {
                            setEditingDocument(null)
                            setEditTitle("")
                          }
                        }}
                        className="text-lg font-semibold"
                        autoFocus
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                        {document.title}
                      </h3>
                    )}

                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="size-4" />
                        <span>{document.wordCount} words</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>Updated {formatDate(document.updatedAt)}</span>
                      </div>
                    </div>

                    {document.content && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {document.content.substring(0, 150)}
                        {document.content.length > 150 && "..."}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={e => {
                          e.stopPropagation()
                        }}
                        aria-label="Document options"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation()
                          handleOpenDocument(document.id!)
                        }}
                      >
                        <Eye className="mr-2 size-4" />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation()
                          setEditingDocument(document.id!)
                          setEditTitle(document.title)
                        }}
                      >
                        <Edit className="mr-2 size-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={e => e.preventDefault()}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Document</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{document.title}
                              "? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteDocument(document.id!)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

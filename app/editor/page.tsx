"use server"

import { Suspense } from "react"
import { auth } from "@/lib/firebase-auth"
import { redirect } from "next/navigation"
import { EditorContent } from "./_components/editor-content"
import { Skeleton } from "@/components/ui/skeleton"

export default async function EditorPage() {
  console.log("[EditorPage] Loading editor page")

  // Check authentication
  const session = await auth()

  if (!session) {
    console.log("[EditorPage] No session found, redirecting to login")
    redirect("/login")
  }

  console.log("[EditorPage] Loading editor for user:", session.userId)

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<EditorSkeleton />}>
        <EditorContent userId={session.userId!} />
      </Suspense>
    </div>
  )
}

function EditorSkeleton() {
  console.log("[EditorSkeleton] Rendering editor skeleton")

  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Editor skeleton */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-8">
                <Skeleton className="mb-4 h-8 w-3/4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-6">
                <Skeleton className="mb-4 h-6 w-3/4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

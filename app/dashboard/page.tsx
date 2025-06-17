/*
<ai_context>
This server page displays the main dashboard with document management and user stats.
It uses Firebase Auth and Firestore to get user data.
Now includes WordWise AI document management functionality.
</ai_context>
*/

"use server"

import { Suspense } from "react"
import { auth } from "@/lib/firebase-auth"
import { redirect } from "next/navigation"
import {
  getProfileByUserIdAction,
  createProfileAction
} from "@/actions/db/profiles-actions"
import { DocumentsDashboard } from "./_components/documents-dashboard"
import FirestoreSetupNotice from "@/components/utilities/firestore-setup-notice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Settings,
  CreditCard,
  FileText,
  BarChart3,
  Clock,
  Calendar,
  TrendingUp,
  Zap
} from "lucide-react"
import Link from "next/link"

async function DashboardContent() {
  console.log("[Dashboard Page] Checking authentication")
  const { userId } = await auth()

  console.log("[Dashboard Page] Auth result - userId:", userId)
  console.log("[Dashboard Page] Auth result - userId type:", typeof userId)

  if (!userId || userId === null || userId === undefined) {
    console.log("[Dashboard Page] No user found, redirecting to login")
    console.log("[Dashboard Page] userId value:", userId)
    redirect("/login")
  }

  console.log("[Dashboard Page] Fetching profile for user:", userId)
  let profileResult = await getProfileByUserIdAction({ userId })

  // Check if Firestore is not enabled
  if (
    !profileResult.isSuccess &&
    profileResult.message.includes("collection may not exist yet")
  ) {
    console.log(
      "[Dashboard Page] Firestore might not be enabled, attempting to create profile"
    )
  }

  // If profile doesn't exist, create one
  if (!profileResult.isSuccess) {
    console.log("[Dashboard Page] Profile not found, creating new profile")

    // Get user data from auth
    const authResult = await auth()
    const user = authResult.user

    // Create profile with available data
    // Note: DecodedIdToken from session might have limited data
    const email = user?.email || ""
    const displayName =
      user?.name || user?.displayName || email.split("@")[0] || "User"

    profileResult = await createProfileAction({
      userId: userId,
      email: email,
      displayName: displayName,
      photoURL: user?.picture || user?.photoURL || "",
      membership: "free"
    })

    if (!profileResult.isSuccess) {
      console.error(
        "[Dashboard Page] Failed to create profile:",
        profileResult.message
      )

      // Check if it's a Firestore not enabled error
      if (profileResult.message.includes("Firestore is not enabled")) {
        console.log("[Dashboard Page] Showing Firestore setup notice")
        return <FirestoreSetupNotice />
      }
    } else {
      console.log("[Dashboard Page] Profile created successfully")
    }
  }

  const profile = profileResult.isSuccess ? profileResult.data : null

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{profile?.displayName ? `, ${profile.displayName}` : ""}
            !
          </h1>
          <p className="text-gray-600">
            Ready to continue your writing journey with WordWise AI?
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/billing">
              <CreditCard className="mr-2 size-4" />
              Upgrade Plan
            </Link>
          </Button>
          <Button variant="purple" asChild>
            <Link href="/editor">
              <FileText className="mr-2 size-4" />
              New Document
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-purple-100/50 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
            <FileText className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">0</div>
            <p className="text-xs text-purple-600/70">
              Start writing to see stats
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-100/50 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Written</CardTitle>
            <BarChart3 className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">0</div>
            <p className="text-xs text-blue-600/70">Track your progress</p>
          </CardContent>
        </Card>

        <Card className="border-green-100/50 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Writing Streak
            </CardTitle>
            <TrendingUp className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">0 days</div>
            <p className="text-xs text-green-600/70">Build a habit!</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100/50 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Suggestions
            </CardTitle>
            <Zap className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">0</div>
            <p className="text-xs text-orange-600/70">Coming in Phase 4</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents Dashboard */}
      {userId ? (
        <DocumentsDashboard userId={userId} />
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-800">
              Authentication Error
            </h3>
            <p className="text-red-600">
              Unable to load user session. Please refresh the page.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  console.log("[Dashboard Skeleton] Rendering loading state")

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="animate-pulse space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded bg-gray-200"></div>
            <div className="h-5 w-48 rounded bg-gray-200"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 rounded bg-gray-200"></div>
            <div className="h-10 w-32 rounded bg-gray-200"></div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 rounded-lg bg-gray-200"></div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-lg bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

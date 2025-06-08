"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface FirestoreSetupNoticeProps {
  projectId?: string
}

export function FirestoreSetupNotice({
  projectId = "aivideoeduedu"
}: FirestoreSetupNoticeProps) {
  console.log("[FirestoreSetupNotice] Rendering Firestore setup notice")

  const firestoreConsoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore`

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertCircle className="size-4 text-orange-600" />
        <AlertTitle className="text-lg font-semibold text-orange-900">
          Firestore Database Not Enabled
        </AlertTitle>
        <AlertDescription className="mt-3 space-y-4">
          <p className="text-sm text-orange-800">
            Your Firebase project needs Firestore enabled to store user data.
            This is a one-time setup that takes just a few clicks.
          </p>

          <div className="rounded-lg border border-orange-200 bg-white/80 p-4">
            <h4 className="mb-3 text-sm font-medium text-gray-900">
              Quick Setup Instructions:
            </h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-medium text-orange-600">1.</span>
                <span>Click the button below to open Firebase Console</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-orange-600">2.</span>
                <span>Click "Create database" in the Firestore section</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-orange-600">3.</span>
                <span>Choose "Start in production mode" for security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-orange-600">4.</span>
                <span>Select your preferred location (e.g., us-central1)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-orange-600">5.</span>
                <span>Click "Enable" and wait for setup to complete</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-orange-600">6.</span>
                <span>Refresh this page once Firestore is enabled</span>
              </li>
            </ol>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={firestoreConsoleUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" className="group">
                Open Firebase Console
                <ExternalLink className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="group"
            >
              Refresh Page
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

          <p className="mt-4 text-xs text-gray-600">
            <strong>Note:</strong> After enabling Firestore, it may take a
            minute for the changes to propagate. If you still see this message
            after enabling, wait a moment and refresh again.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}

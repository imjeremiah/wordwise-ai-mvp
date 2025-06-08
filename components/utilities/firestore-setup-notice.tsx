"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface FirestoreSetupNoticeProps {
  projectId?: string
}

export default function FirestoreSetupNotice({
  projectId = "aivideoeduedu"
}: FirestoreSetupNoticeProps) {
  const firestoreUrl = `https://console.firebase.google.com/project/${projectId}/firestore`

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertCircle className="size-4 text-orange-600" />
      <AlertTitle className="text-orange-900">Firestore Not Enabled</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-orange-800">
          Firestore is not enabled in your Firebase project. This is required
          for the app to function properly.
        </p>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-orange-700">To enable Firestore:</p>
          <ol className="ml-2 list-inside list-decimal space-y-1 text-sm text-orange-700">
            <li>Click the button below to open Firebase Console</li>
            <li>Click "Create database"</li>
            <li>Choose "Start in production mode" or "Start in test mode"</li>
            <li>Select your preferred location</li>
            <li>Click "Enable"</li>
          </ol>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => window.open(firestoreUrl, "_blank")}
        >
          <ExternalLink className="mr-2 size-4" />
          Enable Firestore in Firebase Console
        </Button>
      </AlertDescription>
    </Alert>
  )
}

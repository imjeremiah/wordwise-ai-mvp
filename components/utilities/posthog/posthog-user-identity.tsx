/*
<ai_context>
This client component identifies a user in PostHog with their Firebase user ID.
</ai_context>
*/

"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { usePostHog } from "posthog-js/react"

export function PostHogUserIdentify() {
  const posthog = usePostHog()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      posthog?.identify(user.uid, {
        email: user.email,
        name: user.displayName
      })
    }
  }, [user, posthog])

  return null
}

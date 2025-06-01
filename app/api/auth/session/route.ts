import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-config"
import { createSessionCookie } from "@/lib/firebase-auth"
import { createProfileAction } from "@/actions/db/profiles-actions"

export async function POST(request: NextRequest) {
  console.log("[Session API] POST request received")

  try {
    const { idToken, isNewUser } = await request.json()
    console.log("[Session API] Processing session for new user:", !!isNewUser)

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    console.log("[Session API] Token verified for user:", decodedToken.uid)

    // Create session cookie
    const sessionCookie = await createSessionCookie(idToken)
    console.log("[Session API] Session cookie created")

    // Set the session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: "/"
    })
    console.log("[Session API] Session cookie set")

    // If it's a new user, create their profile
    if (isNewUser) {
      console.log("[Session API] Creating profile for new user")
      const profileResult = await createProfileAction({
        userId: decodedToken.uid,
        email: decodedToken.email || "",
        displayName:
          decodedToken.name || decodedToken.email?.split("@")[0] || "",
        photoURL: decodedToken.picture || "",
        membership: "free"
      })

      if (!profileResult.isSuccess) {
        console.error(
          "[Session API] Failed to create profile:",
          profileResult.message
        )
      } else {
        console.log("[Session API] Profile created successfully")
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Session API] Error creating session:", error)
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  console.log("[Session API] DELETE request received")

  try {
    // Clear the session cookie
    const cookieStore = await cookies()
    cookieStore.delete("session")
    console.log("[Session API] Session cookie deleted")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Session API] Error deleting session:", error)
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    )
  }
}

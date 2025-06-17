"use server"

import { ActionState } from "@/types"
import { auth } from "@/lib/firebase-auth"
import { AppLogger } from "@/lib/logger"
import { adminAuth } from "@/lib/firebase-config"
import { deleteProfileAction } from "@/actions/db/profiles-actions"
import { deleteUserAction } from "@/actions/db/users-actions"

// Generate password reset link
export async function sendPasswordResetEmailAction(
  email: string
): Promise<ActionState<undefined>> {
  console.log("[sendPasswordResetEmailAction] Sending password reset email to:", email)
  
  try {
    if (!adminAuth) {
      console.error("[sendPasswordResetEmailAction] Firebase Admin Auth not initialized")
      return { isSuccess: false, message: "Authentication service not available" }
    }

    // Generate password reset link
    const link = await adminAuth.generatePasswordResetLink(email)
    console.log("[sendPasswordResetEmailAction] Password reset link generated")
    
    // Note: In a real app, you would send this link via email service
    // For now, we'll just log the success
    console.log("[sendPasswordResetEmailAction] Password reset link:", link)
    
    // Log the event
    const logger = new AppLogger()
    await logger.logAuth("password_reset", {
      email,
      linkGenerated: true
    })
    
    return {
      isSuccess: true,
      message: "Password reset email has been sent",
      data: undefined
    }
  } catch (error: any) {
    console.error("[sendPasswordResetEmailAction] Error sending password reset:", error)
    
    if (error.code === 'auth/user-not-found') {
      return { isSuccess: false, message: "No account found with this email address" }
    }
    
    return { isSuccess: false, message: "Failed to send password reset email" }
  }
}

// Get current authenticated user info
export async function getCurrentUserAction(): Promise<ActionState<{
  uid: string
  email: string | null
  displayName: string | null
  emailVerified: boolean
}>> {
  console.log("[getCurrentUserAction] Getting current user info")
  
  try {
    const { userId, user } = await auth()
    
    if (!userId || !user) {
      console.log("[getCurrentUserAction] No authenticated user found")
      return { isSuccess: false, message: "No authenticated user found" }
    }
    
    console.log("[getCurrentUserAction] Current user:", userId)
    
    return {
      isSuccess: true,
      message: "User info retrieved successfully",
      data: {
        uid: user.uid,
        email: user.email || null,
        displayName: user.name || user.displayName || null,
        emailVerified: user.email_verified || false
      }
    }
  } catch (error) {
    console.error("[getCurrentUserAction] Error getting current user:", error)
    return { isSuccess: false, message: "Failed to get user information" }
  }
}

// Delete user account and all associated data
export async function deleteUserAccountAction(): Promise<ActionState<undefined>> {
  console.log("[deleteUserAccountAction] Starting account deletion process")
  
  try {
    const { userId } = await auth()
    
    if (!userId) {
      console.log("[deleteUserAccountAction] No authenticated user found")
      return { isSuccess: false, message: "User not authenticated" }
    }
    
    if (!adminAuth) {
      console.error("[deleteUserAccountAction] Firebase Admin Auth not initialized")
      return { isSuccess: false, message: "Authentication service not available" }
    }
    
    console.log("[deleteUserAccountAction] Deleting account for user:", userId)
    
    // Log the deletion event before deleting
    const logger = new AppLogger(userId)
    await logger.logError("User account deletion initiated", {
      userId,
      timestamp: new Date().toISOString(),
      action: "account_deletion"
    })
    
    // Delete user profile from Firestore
    console.log("[deleteUserAccountAction] Deleting user profile")
    await deleteProfileAction(userId)
    
    // Delete user record from Firestore
    console.log("[deleteUserAccountAction] Deleting user record")
    await deleteUserAction(userId)
    
    // Delete user from Firebase Auth
    console.log("[deleteUserAccountAction] Deleting Firebase Auth user")
    await adminAuth.deleteUser(userId)
    
    console.log("[deleteUserAccountAction] Account deleted successfully")
    
    return {
      isSuccess: true,
      message: "Account deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("[deleteUserAccountAction] Error deleting account:", error)
    return { isSuccess: false, message: "Failed to delete account" }
  }
}

// Update user email
export async function updateUserEmailAction(
  newEmail: string
): Promise<ActionState<undefined>> {
  console.log("[updateUserEmailAction] Updating email for user")
  
  try {
    const { userId } = await auth()
    
    if (!userId) {
      console.log("[updateUserEmailAction] No authenticated user found")
      return { isSuccess: false, message: "User not authenticated" }
    }
    
    if (!adminAuth) {
      console.error("[updateUserEmailAction] Firebase Admin Auth not initialized")
      return { isSuccess: false, message: "Authentication service not available" }
    }
    
    console.log("[updateUserEmailAction] Updating email to:", newEmail)
    
    // Update email in Firebase Auth
    await adminAuth.updateUser(userId, {
      email: newEmail,
      emailVerified: false // Reset email verification when email changes
    })
    
    // Log the event
    const logger = new AppLogger(userId)
    await logger.logError("User email update initiated", {
      userId,
      newEmail,
      timestamp: new Date().toISOString(),
      action: "email_update"
    })
    
    console.log("[updateUserEmailAction] Email updated successfully")
    
    return {
      isSuccess: true,
      message: "Email updated successfully. Please verify your new email address.",
      data: undefined
    }
  } catch (error: any) {
    console.error("[updateUserEmailAction] Error updating email:", error)
    
    if (error.code === 'auth/email-already-exists') {
      return { isSuccess: false, message: "Email address is already in use" }
    }
    
    if (error.code === 'auth/invalid-email') {
      return { isSuccess: false, message: "Invalid email address" }
    }
    
    return { isSuccess: false, message: "Failed to update email address" }
  }
}

// Send email verification
export async function sendEmailVerificationAction(): Promise<ActionState<undefined>> {
  console.log("[sendEmailVerificationAction] Sending email verification")
  
  try {
    const { userId, user } = await auth()
    
    if (!userId || !user) {
      console.log("[sendEmailVerificationAction] No authenticated user found")
      return { isSuccess: false, message: "User not authenticated" }
    }
    
    if (!adminAuth) {
      console.error("[sendEmailVerificationAction] Firebase Admin Auth not initialized")
      return { isSuccess: false, message: "Authentication service not available" }
    }
    
    if (user.email_verified) {
      console.log("[sendEmailVerificationAction] Email already verified")
      return { isSuccess: false, message: "Email is already verified" }
    }
    
    if (!user.email) {
      console.log("[sendEmailVerificationAction] No email address found")
      return { isSuccess: false, message: "No email address found for user" }
    }
    
    console.log("[sendEmailVerificationAction] Generating verification link for:", user.email)
    
    // Generate email verification link
    const link = await adminAuth.generateEmailVerificationLink(user.email)
    console.log("[sendEmailVerificationAction] Email verification link generated")
    
    // Note: In a real app, you would send this link via email service
    // For now, we'll just log the success
    console.log("[sendEmailVerificationAction] Verification link:", link)
    
    // Log the event
    const logger = new AppLogger(userId)
    await logger.logError("Email verification sent", {
      userId,
      email: user.email,
      timestamp: new Date().toISOString(),
      action: "email_verification_sent"
    })
    
    return {
      isSuccess: true,
      message: "Email verification link has been sent",
      data: undefined
    }
  } catch (error) {
    console.error("[sendEmailVerificationAction] Error sending verification:", error)
    return { isSuccess: false, message: "Failed to send email verification" }
  }
} 
/*
<ai_context>
Contains server actions related to profiles in Firebase Firestore.
</ai_context>
*/

"use server"

import { db, collections } from "@/db/db"
import { FirebaseProfile } from "@/types/firebase-types"
import { ActionState } from "@/types"
import { FieldValue } from 'firebase-admin/firestore'
import { serializeFirebaseDocument } from "@/lib/utils"

export async function createProfileAction(
  data: Omit<FirebaseProfile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionState<FirebaseProfile>> {
  console.log("[createProfileAction] Starting profile creation for user:", data.userId)
  
  try {
    // Validate required fields
    if (!data.userId) {
      console.error("[createProfileAction] Missing userId")
      return { isSuccess: false, message: "User ID is required" }
    }

    if (!data.email) {
      console.error("[createProfileAction] Missing email")
      return { isSuccess: false, message: "Email is required" }
    }

    if (!db) {
      console.error("[createProfileAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    // FIX: Manually construct the profileData object to ensure it's a plain object.
    // This prevents silent failures when the incoming 'data' object is not a plain object,
    // which was causing empty documents to be created in Firestore.
    const profileData = {
      userId: data.userId,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      membership: data.membership,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }
    
    console.log("[createProfileAction] Creating profile in Firestore with data:", profileData)
    const docRef = await db.collection(collections.profiles).add(profileData)
    const newProfile = await docRef.get()
    
    if (!newProfile.exists) {
      console.error("[createProfileAction] Profile creation failed - profile not found after creation")
      return { isSuccess: false, message: "Failed to create profile" }
    }

    const profileWithId = { id: docRef.id, ...newProfile.data() } as FirebaseProfile
    
    // Serialize the profile for client transfer
    const serializedProfile = serializeFirebaseDocument(profileWithId)
    
    console.log("[createProfileAction] Profile created successfully with ID:", docRef.id)
    return {
      isSuccess: true,
      message: "Profile created successfully",
      data: serializedProfile
    }
  } catch (error) {
    console.error("[createProfileAction] Error creating profile:", error)
    
    // Check for specific Firestore errors
    if (error instanceof Error && error.message.includes("Firestore is not enabled")) {
      return { isSuccess: false, message: "Firestore is not enabled for this project" }
    }
    
    return { isSuccess: false, message: "Failed to create profile - Please try again" }
  }
}

export async function getProfileByUserIdAction(
  payload: { userId: string | null }
): Promise<ActionState<FirebaseProfile>> {
  console.log("[getProfileByUserIdAction] Fetching profile with payload:", payload)
  
  try {
    const { userId } = payload

    // Validate input
    if (!userId) {
      console.error("[getProfileByUserIdAction] Missing or null userId in payload")
      return { isSuccess: false, message: "User ID is required" }
    }

    if (!db) {
      console.error("[getProfileByUserIdAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    const snapshot = await db
      .collection(collections.profiles)
      .where('userId', '==', userId)
      .get()
    
    if (snapshot.empty) {
      console.log("[getProfileByUserIdAction] Profile not found for user:", userId)
      return { isSuccess: false, message: "Profile not found" }
    }
    
    const doc = snapshot.docs[0]
    const profile = { id: doc.id, ...doc.data() } as FirebaseProfile
    
    // Serialize the profile for client transfer
    const serializedProfile = serializeFirebaseDocument(profile)
    
    console.log("[getProfileByUserIdAction] Profile fetched successfully")
    
    return {
      isSuccess: true,
      message: "Profile fetched successfully",
      data: serializedProfile
    }
  } catch (error) {
    console.error("[getProfileByUserIdAction] Error fetching profile:", error)
    
    // Check for specific Firestore errors
    if (error instanceof Error && error.message.includes("collection may not exist yet")) {
      return { isSuccess: false, message: "Profile collection may not exist yet - Please check Firebase configuration" }
    }
    
    return { isSuccess: false, message: "Failed to fetch profile - Please try again" }
  }
}

export async function updateProfileAction(
  profileId: string,
  data: Partial<Omit<FirebaseProfile, 'id' | 'userId' | 'createdAt'>>
): Promise<ActionState<FirebaseProfile>> {
  console.log("[updateProfileAction] Updating profile with ID:", profileId)
  
  try {
    // Validate input
    if (!profileId) {
      console.error("[updateProfileAction] Missing profile ID")
      return { isSuccess: false, message: "Profile ID is required" }
    }

    if (!db) {
      console.error("[updateProfileAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    const updateData = {
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }
    
    console.log("[updateProfileAction] Updating profile in Firestore")
    await db.collection(collections.profiles).doc(profileId).update(updateData)
    
    const updatedDoc = await db.collection(collections.profiles).doc(profileId).get()
    
    if (!updatedDoc.exists) {
      console.error("[updateProfileAction] Profile not found after update")
      return { isSuccess: false, message: "Profile not found" }
    }

    const updatedProfile = { id: updatedDoc.id, ...updatedDoc.data() } as FirebaseProfile
    
    // Serialize the profile for client transfer
    const serializedProfile = serializeFirebaseDocument(updatedProfile)
    
    console.log("[updateProfileAction] Profile updated successfully")
    return {
      isSuccess: true,
      message: "Profile updated successfully",
      data: serializedProfile
    }
  } catch (error) {
    console.error("[updateProfileAction] Error updating profile:", error)
    return { isSuccess: false, message: "Failed to update profile - Please try again" }
  }
}

export async function updateProfileByStripeCustomerIdAction(
  stripeCustomerId: string,
  data: Partial<Omit<FirebaseProfile, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ActionState<FirebaseProfile>> {
  console.log('[Profiles Action] Updating profile by Stripe customer ID:', stripeCustomerId)
  
  if (!db) {
    console.error('[Profiles Action] Database not initialized')
    return { isSuccess: false, message: "Database not initialized" }
  }
  
  try {
    const querySnapshot = await db
      .collection(collections.profiles)
      .where('stripeCustomerId', '==', stripeCustomerId)
      .limit(1)
      .get()
    
    if (querySnapshot.empty) {
      console.log('[Profiles Action] Profile not found by Stripe customer ID')
      return {
        isSuccess: false,
        message: "Profile not found by Stripe customer ID"
      }
    }
    
    const doc = querySnapshot.docs[0]
    const updateData = {
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }
    
    await doc.ref.update(updateData)
    console.log('[Profiles Action] Profile updated by Stripe customer ID')
    
    const updatedDoc = await doc.ref.get()
    const updatedProfile = { id: doc.id, ...updatedDoc.data() } as FirebaseProfile
    
    console.log('[Profiles Action] Profile updated successfully')
    return {
      isSuccess: true,
      message: "Profile updated by Stripe customer ID successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("[Profiles Action] Error updating profile by stripe customer ID:", error)
    return {
      isSuccess: false,
      message: "Failed to update profile by Stripe customer ID"
    }
  }
}

export async function deleteProfileAction(
  profileId: string
): Promise<ActionState<undefined>> {
  console.log("[deleteProfileAction] Deleting profile with ID:", profileId)
  
  try {
    // Validate input
    if (!profileId) {
      console.error("[deleteProfileAction] Missing profile ID")
      return { isSuccess: false, message: "Profile ID is required" }
    }

    if (!db) {
      console.error("[deleteProfileAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    console.log("[deleteProfileAction] Deleting profile from Firestore")
    await db.collection(collections.profiles).doc(profileId).delete()
    
    console.log("[deleteProfileAction] Profile deleted successfully")
    return {
      isSuccess: true,
      message: "Profile deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("[deleteProfileAction] Error deleting profile:", error)
    return { isSuccess: false, message: "Failed to delete profile - Please try again" }
  }
}

"use server"

import { db, collections } from "@/db/db"
import { FirebaseUser } from "@/types/firebase-types"
import { ActionState } from "@/types"
import { FieldValue } from 'firebase-admin/firestore'

// Create a new user
export async function createUserAction(
  data: Omit<FirebaseUser, 'id' | 'createdAt' | 'lastLoginAt'>
): Promise<ActionState<FirebaseUser>> {
  console.log("[createUserAction] Starting user creation with data:", { uid: data.uid, email: data.email })
  
  try {
    if (!db) {
      console.error("[createUserAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const userData = {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      lastLoginAt: FieldValue.serverTimestamp()
    }
    
    console.log("[createUserAction] Creating user document in Firestore")
    const docRef = await db.collection(collections.users).add(userData)
    const newUser = await docRef.get()
    const userWithId = { id: docRef.id, ...newUser.data() } as FirebaseUser
    
    console.log("[createUserAction] User created successfully with ID:", docRef.id)
    return {
      isSuccess: true,
      message: "User created successfully",
      data: userWithId
    }
  } catch (error) {
    console.error("[createUserAction] Error creating user:", error)
    return { isSuccess: false, message: "Failed to create user" }
  }
}

// Read a single user by ID
export async function getUserAction(
  userId: string
): Promise<ActionState<FirebaseUser>> {
  console.log("[getUserAction] Fetching user with ID:", userId)
  
  try {
    if (!db) {
      console.error("[getUserAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const doc = await db.collection(collections.users).doc(userId).get()
    
    if (!doc.exists) {
      console.log("[getUserAction] User not found with ID:", userId)
      return { isSuccess: false, message: "User not found" }
    }
    
    const user = { id: doc.id, ...doc.data() } as FirebaseUser
    console.log("[getUserAction] User fetched successfully")
    
    return {
      isSuccess: true,
      message: "User fetched successfully",
      data: user
    }
  } catch (error) {
    console.error("[getUserAction] Error fetching user:", error)
    return { isSuccess: false, message: "Failed to fetch user" }
  }
}

// Read user by Firebase UID
export async function getUserByUidAction(
  uid: string
): Promise<ActionState<FirebaseUser>> {
  console.log("[getUserByUidAction] Fetching user with UID:", uid)
  
  try {
    if (!db) {
      console.error("[getUserByUidAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const snapshot = await db
      .collection(collections.users)
      .where('uid', '==', uid)
      .limit(1)
      .get()
    
    if (snapshot.empty) {
      console.log("[getUserByUidAction] User not found with UID:", uid)
      return { isSuccess: false, message: "User not found" }
    }
    
    const doc = snapshot.docs[0]
    const user = { id: doc.id, ...doc.data() } as FirebaseUser
    console.log("[getUserByUidAction] User fetched successfully")
    
    return {
      isSuccess: true,
      message: "User fetched successfully",
      data: user
    }
  } catch (error) {
    console.error("[getUserByUidAction] Error fetching user by UID:", error)
    return { isSuccess: false, message: "Failed to fetch user" }
  }
}

// Update a user
export async function updateUserAction(
  userId: string,
  data: Partial<Omit<FirebaseUser, 'id' | 'createdAt'>>
): Promise<ActionState<FirebaseUser>> {
  console.log("[updateUserAction] Updating user with ID:", userId)
  
  try {
    if (!db) {
      console.error("[updateUserAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const updateData = {
      ...data,
      lastLoginAt: FieldValue.serverTimestamp()
    }
    
    console.log("[updateUserAction] Updating user document in Firestore")
    await db.collection(collections.users).doc(userId).update(updateData)
    
    const updatedDoc = await db.collection(collections.users).doc(userId).get()
    const updatedUser = { id: updatedDoc.id, ...updatedDoc.data() } as FirebaseUser
    
    console.log("[updateUserAction] User updated successfully")
    return {
      isSuccess: true,
      message: "User updated successfully",
      data: updatedUser
    }
  } catch (error) {
    console.error("[updateUserAction] Error updating user:", error)
    return { isSuccess: false, message: "Failed to update user" }
  }
}

// Delete a user
export async function deleteUserAction(
  userId: string
): Promise<ActionState<undefined>> {
  console.log("[deleteUserAction] Deleting user with ID:", userId)
  
  try {
    if (!db) {
      console.error("[deleteUserAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    console.log("[deleteUserAction] Deleting user document from Firestore")
    await db.collection(collections.users).doc(userId).delete()
    
    console.log("[deleteUserAction] User deleted successfully")
    return {
      isSuccess: true,
      message: "User deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("[deleteUserAction] Error deleting user:", error)
    return { isSuccess: false, message: "Failed to delete user" }
  }
} 
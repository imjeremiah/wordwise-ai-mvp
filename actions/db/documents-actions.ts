"use server"

import { db, collections } from "@/db/db"
import { FirebaseDocument } from "@/types/firebase-types"
import { ActionState } from "@/types"
import { FieldValue } from 'firebase-admin/firestore'
import { serializeFirebaseDocument } from "@/lib/utils"

// Create a new document
export async function createDocumentAction(
  data: Omit<FirebaseDocument, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionState<FirebaseDocument>> {
  console.log("[createDocumentAction] Starting document creation for user:", data.ownerUID)
  
  try {
    // Validate required fields
    if (!data.ownerUID) {
      console.error("[createDocumentAction] Missing ownerUID")
      return { isSuccess: false, message: "User ID is required" }
    }

    if (!db) {
      console.error("[createDocumentAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    // Calculate word count from content
    const wordCount = data.content.trim().split(/\s+/).filter(word => word.length > 0).length

    const documentData = {
      ...data,
      wordCount,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }
    
    console.log("[createDocumentAction] Creating document in Firestore with word count:", wordCount)
    const docRef = await db.collection(collections.documents).add(documentData)
    const newDocument = await docRef.get()
    
    if (!newDocument.exists) {
      console.error("[createDocumentAction] Document creation failed - document not found after creation")
      return { isSuccess: false, message: "Failed to create document" }
    }

    const documentWithId = { id: docRef.id, ...newDocument.data() } as FirebaseDocument
    
    // Serialize the document for client transfer
    const serializedDocument = serializeFirebaseDocument(documentWithId)
    
    console.log("[createDocumentAction] Document created successfully with ID:", docRef.id)
    return {
      isSuccess: true,
      message: "Document created successfully",
      data: serializedDocument
    }
  } catch (error) {
    console.error("[createDocumentAction] Error creating document:", error)
    return { isSuccess: false, message: "Failed to create document - Please try again" }
  }
}

// Read a single document by ID
export async function getDocumentAction(
  documentId: string
): Promise<ActionState<FirebaseDocument>> {
  console.log("[getDocumentAction] Fetching document with ID:", documentId)
  
  try {
    // Validate input
    if (!documentId) {
      console.error("[getDocumentAction] Missing document ID")
      return { isSuccess: false, message: "Document ID is required" }
    }

    if (!db) {
      console.error("[getDocumentAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    const doc = await db.collection(collections.documents).doc(documentId).get()
    
    if (!doc.exists) {
      console.log("[getDocumentAction] Document not found with ID:", documentId)
      return { isSuccess: false, message: "Document not found" }
    }
    
    const document = { id: doc.id, ...doc.data() } as FirebaseDocument
    
    // Serialize the document for client transfer
    const serializedDocument = serializeFirebaseDocument(document)
    
    console.log("[getDocumentAction] Document fetched successfully")
    
    return {
      isSuccess: true,
      message: "Document fetched successfully",
      data: serializedDocument
    }
  } catch (error) {
    console.error("[getDocumentAction] Error fetching document:", error)
    return { isSuccess: false, message: "Failed to fetch document - Please try again" }
  }
}

// Read all documents for a user
export async function getUserDocumentsAction(
  ownerUID: string | null
): Promise<ActionState<FirebaseDocument[]>> {
  console.log("[getUserDocumentsAction] Fetching documents for user:", ownerUID)
  
  try {
    // Validate input - this fixes the "null payload" error
    if (!ownerUID) {
      console.error("[getUserDocumentsAction] Missing or null ownerUID")
      return { isSuccess: false, message: "User ID is required" }
    }

    if (!db) {
      console.error("[getUserDocumentsAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    console.log("[getUserDocumentsAction] Querying Firestore for documents...")
    const snapshot = await db
      .collection(collections.documents)
      .where('ownerUID', '==', ownerUID)
      .orderBy('updatedAt', 'desc')
      .get()
    
    console.log("[getUserDocumentsAction] Query completed, processing", snapshot.docs.length, "documents")
    
    const documents = snapshot.docs.map(doc => {
      const docData = { id: doc.id, ...doc.data() } as FirebaseDocument
      console.log("[getUserDocumentsAction] Processing document:", doc.id)
      
      // Serialize each document for client transfer
      return serializeFirebaseDocument(docData)
    })
    
    console.log("[getUserDocumentsAction] Found", documents.length, "documents for user")
    
    return {
      isSuccess: true,
      message: "Documents fetched successfully",
      data: documents
    }
  } catch (error) {
    console.error("[getUserDocumentsAction] Error fetching documents:", error)
    console.error("[getUserDocumentsAction] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      ownerUID
    })
    return { isSuccess: false, message: "Failed to fetch documents - Please try again" }
  }
}

// Update a document
export async function updateDocumentAction(
  documentId: string,
  data: Partial<Omit<FirebaseDocument, 'id' | 'ownerUID' | 'createdAt'>>
): Promise<ActionState<FirebaseDocument>> {
  console.log("[updateDocumentAction] Updating document with ID:", documentId)
  
  try {
    // Validate input
    if (!documentId) {
      console.error("[updateDocumentAction] Missing document ID")
      return { isSuccess: false, message: "Document ID is required" }
    }

    if (!db) {
      console.error("[updateDocumentAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    // Calculate word count if content is being updated
    const updateData: any = {
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }

    if (data.content) {
      updateData.wordCount = data.content.trim().split(/\s+/).filter(word => word.length > 0).length
      console.log("[updateDocumentAction] Updated word count:", updateData.wordCount)
    }
    
    console.log("[updateDocumentAction] Updating document in Firestore")
    await db.collection(collections.documents).doc(documentId).update(updateData)
    
    const updatedDoc = await db.collection(collections.documents).doc(documentId).get()
    
    if (!updatedDoc.exists) {
      console.error("[updateDocumentAction] Document not found after update")
      return { isSuccess: false, message: "Document not found" }
    }

    const updatedDocument = { id: updatedDoc.id, ...updatedDoc.data() } as FirebaseDocument
    
    // Serialize the document for client transfer
    const serializedDocument = serializeFirebaseDocument(updatedDocument)
    
    console.log("[updateDocumentAction] Document updated successfully")
    return {
      isSuccess: true,
      message: "Document updated successfully",
      data: serializedDocument
    }
  } catch (error) {
    console.error("[updateDocumentAction] Error updating document:", error)
    return { isSuccess: false, message: "Failed to update document - Please try again" }
  }
}

// Delete a document
export async function deleteDocumentAction(
  documentId: string
): Promise<ActionState<undefined>> {
  console.log("[deleteDocumentAction] Deleting document with ID:", documentId)
  
  try {
    // Validate input
    if (!documentId) {
      console.error("[deleteDocumentAction] Missing document ID")
      return { isSuccess: false, message: "Document ID is required" }
    }

    if (!db) {
      console.error("[deleteDocumentAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    console.log("[deleteDocumentAction] Deleting document from Firestore")
    await db.collection(collections.documents).doc(documentId).delete()
    
    console.log("[deleteDocumentAction] Document deleted successfully")
    return {
      isSuccess: true,
      message: "Document deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("[deleteDocumentAction] Error deleting document:", error)
    return { isSuccess: false, message: "Failed to delete document - Please try again" }
  }
} 
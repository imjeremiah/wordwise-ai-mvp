"use server"

import { db, collections } from "@/db/db"
import { FirebaseMessage } from "@/types/firebase-types"
import { ActionState } from "@/types"
import { FieldValue } from 'firebase-admin/firestore'

// Create a new message
export async function createMessageAction(
  data: Omit<FirebaseMessage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionState<FirebaseMessage>> {
  console.log("[createMessageAction] Starting message creation for chat:", data.chatId)
  
  try {
    if (!db) {
      console.error("[createMessageAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const messageData = {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }
    
    console.log("[createMessageAction] Creating message document in Firestore")
    const docRef = await db.collection(collections.messages).add(messageData)
    const newMessage = await docRef.get()
    const messageWithId = { id: docRef.id, ...newMessage.data() } as FirebaseMessage
    
    // Update the chat's updatedAt timestamp
    console.log("[createMessageAction] Updating chat timestamp")
    await db.collection(collections.chats).doc(data.chatId).update({
      updatedAt: FieldValue.serverTimestamp()
    })
    
    console.log("[createMessageAction] Message created successfully with ID:", docRef.id)
    return {
      isSuccess: true,
      message: "Message created successfully",
      data: messageWithId
    }
  } catch (error) {
    console.error("[createMessageAction] Error creating message:", error)
    return { isSuccess: false, message: "Failed to create message" }
  }
}

// Read a single message by ID
export async function getMessageAction(
  messageId: string
): Promise<ActionState<FirebaseMessage>> {
  console.log("[getMessageAction] Fetching message with ID:", messageId)
  
  try {
    if (!db) {
      console.error("[getMessageAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const doc = await db.collection(collections.messages).doc(messageId).get()
    
    if (!doc.exists) {
      console.log("[getMessageAction] Message not found with ID:", messageId)
      return { isSuccess: false, message: "Message not found" }
    }
    
    const message = { id: doc.id, ...doc.data() } as FirebaseMessage
    console.log("[getMessageAction] Message fetched successfully")
    
    return {
      isSuccess: true,
      message: "Message fetched successfully",
      data: message
    }
  } catch (error) {
    console.error("[getMessageAction] Error fetching message:", error)
    return { isSuccess: false, message: "Failed to fetch message" }
  }
}

// Read all messages for a chat
export async function getChatMessagesAction(
  chatId: string,
  limit?: number
): Promise<ActionState<FirebaseMessage[]>> {
  console.log("[getChatMessagesAction] Fetching messages for chat:", chatId, "with limit:", limit)
  
  try {
    if (!db) {
      console.error("[getChatMessagesAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    let query = db
      .collection(collections.messages)
      .where('chatId', '==', chatId)
      .orderBy('createdAt', 'asc')
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const snapshot = await query.get()
    
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseMessage[]
    
    console.log("[getChatMessagesAction] Fetched", messages.length, "messages for chat")
    
    return {
      isSuccess: true,
      message: "Messages fetched successfully",
      data: messages
    }
  } catch (error) {
    console.error("[getChatMessagesAction] Error fetching chat messages:", error)
    return { isSuccess: false, message: "Failed to fetch messages" }
  }
}

// Update a message
export async function updateMessageAction(
  messageId: string,
  data: Partial<Omit<FirebaseMessage, 'id' | 'createdAt' | 'updatedAt' | 'chatId' | 'role'>>
): Promise<ActionState<FirebaseMessage>> {
  console.log("[updateMessageAction] Updating message with ID:", messageId)
  
  try {
    if (!db) {
      console.error("[updateMessageAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const updateData = {
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }
    
    console.log("[updateMessageAction] Updating message document in Firestore")
    await db.collection(collections.messages).doc(messageId).update(updateData)
    
    const updatedDoc = await db.collection(collections.messages).doc(messageId).get()
    const updatedMessage = { id: updatedDoc.id, ...updatedDoc.data() } as FirebaseMessage
    
    // Update the chat's updatedAt timestamp
    console.log("[updateMessageAction] Updating chat timestamp")
    await db.collection(collections.chats).doc(updatedMessage.chatId).update({
      updatedAt: FieldValue.serverTimestamp()
    })
    
    console.log("[updateMessageAction] Message updated successfully")
    return {
      isSuccess: true,
      message: "Message updated successfully",
      data: updatedMessage
    }
  } catch (error) {
    console.error("[updateMessageAction] Error updating message:", error)
    return { isSuccess: false, message: "Failed to update message" }
  }
}

// Delete a message
export async function deleteMessageAction(
  messageId: string
): Promise<ActionState<undefined>> {
  console.log("[deleteMessageAction] Deleting message with ID:", messageId)
  
  try {
    if (!db) {
      console.error("[deleteMessageAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    // Get the message first to get the chatId
    const messageDoc = await db.collection(collections.messages).doc(messageId).get()
    
    if (!messageDoc.exists) {
      console.log("[deleteMessageAction] Message not found with ID:", messageId)
      return { isSuccess: false, message: "Message not found" }
    }
    
    const message = messageDoc.data() as FirebaseMessage
    
    console.log("[deleteMessageAction] Deleting message document from Firestore")
    await db.collection(collections.messages).doc(messageId).delete()
    
    // Update the chat's updatedAt timestamp
    console.log("[deleteMessageAction] Updating chat timestamp")
    await db.collection(collections.chats).doc(message.chatId).update({
      updatedAt: FieldValue.serverTimestamp()
    })
    
    console.log("[deleteMessageAction] Message deleted successfully")
    return {
      isSuccess: true,
      message: "Message deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("[deleteMessageAction] Error deleting message:", error)
    return { isSuccess: false, message: "Failed to delete message" }
  }
}

// Delete all messages in a chat
export async function deleteChatMessagesAction(
  chatId: string
): Promise<ActionState<{ deletedCount: number }>> {
  console.log("[deleteChatMessagesAction] Deleting all messages for chat:", chatId)
  
  try {
    if (!db) {
      console.error("[deleteChatMessagesAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    // Get all messages for the chat
    const messagesSnapshot = await db
      .collection(collections.messages)
      .where('chatId', '==', chatId)
      .get()
    
    console.log("[deleteChatMessagesAction] Found", messagesSnapshot.size, "messages to delete")
    
    // Use batch delete for efficiency
    const batch = db.batch()
    messagesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })
    
    console.log("[deleteChatMessagesAction] Executing batch delete")
    await batch.commit()
    
    // Update the chat's updatedAt timestamp
    console.log("[deleteChatMessagesAction] Updating chat timestamp")
    await db.collection(collections.chats).doc(chatId).update({
      updatedAt: FieldValue.serverTimestamp()
    })
    
    console.log("[deleteChatMessagesAction] All messages deleted successfully")
    return {
      isSuccess: true,
      message: `Deleted ${messagesSnapshot.size} messages successfully`,
      data: { deletedCount: messagesSnapshot.size }
    }
  } catch (error) {
    console.error("[deleteChatMessagesAction] Error deleting chat messages:", error)
    return { isSuccess: false, message: "Failed to delete messages" }
  }
}

// Get paginated messages for a chat
export async function getChatMessagesPaginatedAction(
  chatId: string,
  pageSize: number = 50,
  startAfterMessageId?: string
): Promise<ActionState<{ messages: FirebaseMessage[]; hasMore: boolean }>> {
  console.log("[getChatMessagesPaginatedAction] Fetching paginated messages for chat:", chatId)
  
  try {
    if (!db) {
      console.error("[getChatMessagesPaginatedAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    let query = db
      .collection(collections.messages)
      .where('chatId', '==', chatId)
      .orderBy('createdAt', 'asc')
      .limit(pageSize + 1) // Get one extra to check if there are more
    
    // If we have a starting point, start after that message
    if (startAfterMessageId) {
      console.log("[getChatMessagesPaginatedAction] Starting after message:", startAfterMessageId)
      const startAfterDoc = await db.collection(collections.messages).doc(startAfterMessageId).get()
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc)
      }
    }
    
    const snapshot = await query.get()
    
    const messages = snapshot.docs.slice(0, pageSize).map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseMessage[]
    
    const hasMore = snapshot.docs.length > pageSize
    
    console.log("[getChatMessagesPaginatedAction] Fetched", messages.length, "messages, hasMore:", hasMore)
    
    return {
      isSuccess: true,
      message: "Messages fetched successfully",
      data: { messages, hasMore }
    }
  } catch (error) {
    console.error("[getChatMessagesPaginatedAction] Error fetching paginated messages:", error)
    return { isSuccess: false, message: "Failed to fetch messages" }
  }
} 
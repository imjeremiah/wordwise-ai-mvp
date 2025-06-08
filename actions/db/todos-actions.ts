"use server"

import { db, collections } from "@/db/db"
import { FirebaseTodo } from "@/types/firebase-types"
import { ActionState } from "@/types"
import { FieldValue } from 'firebase-admin/firestore'

// Create a new todo
export async function createTodoAction(
  data: Omit<FirebaseTodo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionState<FirebaseTodo>> {
  console.log("[createTodoAction] Starting todo creation for user:", data.userId)
  
  try {
    if (!db) {
      console.error("[createTodoAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const todoData = {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }
    
    console.log("[createTodoAction] Creating todo document in Firestore")
    const docRef = await db.collection(collections.todos).add(todoData)
    const newTodo = await docRef.get()
    const todoWithId = { id: docRef.id, ...newTodo.data() } as FirebaseTodo
    
    console.log("[createTodoAction] Todo created successfully with ID:", docRef.id)
    return {
      isSuccess: true,
      message: "Todo created successfully",
      data: todoWithId
    }
  } catch (error) {
    console.error("[createTodoAction] Error creating todo:", error)
    return { isSuccess: false, message: "Failed to create todo" }
  }
}

// Read a single todo by ID
export async function getTodoAction(
  todoId: string
): Promise<ActionState<FirebaseTodo>> {
  console.log("[getTodoAction] Fetching todo with ID:", todoId)
  
  try {
    if (!db) {
      console.error("[getTodoAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const doc = await db.collection(collections.todos).doc(todoId).get()
    
    if (!doc.exists) {
      console.log("[getTodoAction] Todo not found with ID:", todoId)
      return { isSuccess: false, message: "Todo not found" }
    }
    
    const todo = { id: doc.id, ...doc.data() } as FirebaseTodo
    console.log("[getTodoAction] Todo fetched successfully")
    
    return {
      isSuccess: true,
      message: "Todo fetched successfully",
      data: todo
    }
  } catch (error) {
    console.error("[getTodoAction] Error fetching todo:", error)
    return { isSuccess: false, message: "Failed to fetch todo" }
  }
}

// Read all todos for a user
export async function getUserTodosAction(
  userId: string
): Promise<ActionState<FirebaseTodo[]>> {
  console.log("[getUserTodosAction] Fetching todos for user:", userId)
  
  try {
    if (!db) {
      console.error("[getUserTodosAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const snapshot = await db
      .collection(collections.todos)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()
    
    const todos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseTodo[]
    
    console.log("[getUserTodosAction] Fetched", todos.length, "todos for user")
    
    return {
      isSuccess: true,
      message: "Todos fetched successfully",
      data: todos
    }
  } catch (error) {
    console.error("[getUserTodosAction] Error fetching user todos:", error)
    return { isSuccess: false, message: "Failed to fetch todos" }
  }
}

// Update a todo
export async function updateTodoAction(
  todoId: string,
  data: Partial<Omit<FirebaseTodo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>
): Promise<ActionState<FirebaseTodo>> {
  console.log("[updateTodoAction] Updating todo with ID:", todoId)
  
  try {
    if (!db) {
      console.error("[updateTodoAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    const updateData = {
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }
    
    console.log("[updateTodoAction] Updating todo document in Firestore")
    await db.collection(collections.todos).doc(todoId).update(updateData)
    
    const updatedDoc = await db.collection(collections.todos).doc(todoId).get()
    const updatedTodo = { id: updatedDoc.id, ...updatedDoc.data() } as FirebaseTodo
    
    console.log("[updateTodoAction] Todo updated successfully")
    return {
      isSuccess: true,
      message: "Todo updated successfully",
      data: updatedTodo
    }
  } catch (error) {
    console.error("[updateTodoAction] Error updating todo:", error)
    return { isSuccess: false, message: "Failed to update todo" }
  }
}

// Delete a todo
export async function deleteTodoAction(
  todoId: string
): Promise<ActionState<undefined>> {
  console.log("[deleteTodoAction] Deleting todo with ID:", todoId)
  
  try {
    if (!db) {
      console.error("[deleteTodoAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    console.log("[deleteTodoAction] Deleting todo document from Firestore")
    await db.collection(collections.todos).doc(todoId).delete()
    
    console.log("[deleteTodoAction] Todo deleted successfully")
    return {
      isSuccess: true,
      message: "Todo deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("[deleteTodoAction] Error deleting todo:", error)
    return { isSuccess: false, message: "Failed to delete todo" }
  }
}

// Toggle todo completion status
export async function toggleTodoCompletionAction(
  todoId: string
): Promise<ActionState<FirebaseTodo>> {
  console.log("[toggleTodoCompletionAction] Toggling completion for todo:", todoId)
  
  try {
    if (!db) {
      console.error("[toggleTodoCompletionAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    // First get the current todo
    const doc = await db.collection(collections.todos).doc(todoId).get()
    
    if (!doc.exists) {
      console.log("[toggleTodoCompletionAction] Todo not found with ID:", todoId)
      return { isSuccess: false, message: "Todo not found" }
    }
    
    const currentTodo = doc.data() as FirebaseTodo
    const newCompletedStatus = !currentTodo.completed
    
    console.log("[toggleTodoCompletionAction] Toggling completed from", currentTodo.completed, "to", newCompletedStatus)
    
    // Update with toggled status
    await db.collection(collections.todos).doc(todoId).update({
      completed: newCompletedStatus,
      updatedAt: FieldValue.serverTimestamp()
    })
    
    const updatedDoc = await db.collection(collections.todos).doc(todoId).get()
    const updatedTodo = { id: updatedDoc.id, ...updatedDoc.data() } as FirebaseTodo
    
    console.log("[toggleTodoCompletionAction] Todo completion toggled successfully")
    return {
      isSuccess: true,
      message: "Todo completion toggled successfully",
      data: updatedTodo
    }
  } catch (error) {
    console.error("[toggleTodoCompletionAction] Error toggling todo completion:", error)
    return { isSuccess: false, message: "Failed to toggle todo completion" }
  }
} 
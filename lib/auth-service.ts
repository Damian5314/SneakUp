import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    type UserCredential,
  } from "firebase/auth"
  import { auth } from "./firebase"
  import { setupSupabaseWithFirebase, clearSupabaseAuth } from "./supabase"
  import { syncUserProfile } from "./profile-service"
  
  export const login = async (email: string, password: string): Promise<string> => {
    try {
      // Check if Firebase is initialized
      if (!auth) {
        throw new Error("Firebase authentication is not initialized. Please check your environment variables.")
      }
  
      // Login with Firebase
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
  
      // Get Firebase ID token
      const token = await userCredential.user.getIdToken(true) // Force refresh
  
      // Setup Supabase with Firebase token
      setupSupabaseWithFirebase(token)
  
      // Sync user profile with Supabase
      await syncUserProfile()
  
      console.log("Logged in and Supabase authenticated!")
  
      return token
    } catch (error: any) {
      console.error("Login error details:", {
        code: error.code,
        message: error.message,
        fullError: error,
      })
  
      // Provide more helpful error messages
      if (error.code === "auth/invalid-api-key") {
        throw new Error("Invalid Firebase API key. Please check your environment variables.")
      } else if (error.code === "auth/api-key-not-valid") {
        throw new Error("Firebase API key is not valid. Please check your Firebase console.")
      } else {
        throw error
      }
    }
  }
  
  export const register = async (email: string, password: string, username?: string): Promise<string> => {
    try {
      // Check if Firebase is initialized
      if (!auth) {
        throw new Error("Firebase authentication is not initialized. Please check your environment variables.")
      }
  
      // Register with Firebase
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
  
      // Get Firebase ID token
      const token = await userCredential.user.getIdToken(true) // Force refresh
  
      // Setup Supabase with Firebase token
      setupSupabaseWithFirebase(token)
  
      // Sync user profile with Supabase
      await syncUserProfile()
  
      console.log("Registered and Supabase authenticated!")
  
      return token
    } catch (error: any) {
      console.error("Registration error details:", {
        code: error.code,
        message: error.message,
        fullError: error,
      })
  
      // Provide more helpful error messages
      if (error.code === "auth/invalid-api-key") {
        throw new Error("Invalid Firebase API key. Please check your environment variables.")
      } else if (error.code === "auth/api-key-not-valid") {
        throw new Error("Firebase API key is not valid. Please check your Firebase console.")
      } else {
        throw error
      }
    }
  }
  
  export const signOut = async (): Promise<void> => {
    try {
      // Clear Supabase auth
      clearSupabaseAuth()
  
      // Check if Firebase is initialized
      if (!auth) {
        throw new Error("Firebase authentication is not initialized. Please check your environment variables.")
      }
  
      // Sign out from Firebase
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }
  
  /**
   * Refreshes the Firebase token and updates Supabase authentication
   * Call this function when you need to refresh the token
   */
  export const refreshAuthToken = async (): Promise<string | null> => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return null
      }
  
      // Force token refresh
      const token = await currentUser.getIdToken(true)
  
      // Update Supabase with new token
      setupSupabaseWithFirebase(token)
  
      return token
    } catch (error) {
      console.error("Token refresh error:", error)
      return null
    }
  }
  
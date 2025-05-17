import { getSupabaseClient } from "./supabase"
import { auth } from "./firebase"

/**
 * Gets the user profile from Supabase
 * This demonstrates that the Firebase-Supabase authentication is working
 */
export const getUserProfile = async () => {
  try {
    // Get the authenticated Supabase client
    const supabase = getSupabaseClient()

    // Get the current Firebase user
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      throw new Error("No authenticated user found")
    }

    // Query Supabase for the user profile
    const { data, error } = await supabase.from("profiles").select("*").eq("firebase_uid", firebaseUser.uid).single()

    if (error) {
      console.error("Supabase query error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

/**
 * Creates or updates the user profile in Supabase
 */
export const updateUserProfile = async (profileData: any) => {
  try {
    // Get the authenticated Supabase client
    const supabase = getSupabaseClient()

    // Get the current Firebase user
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      throw new Error("No authenticated user found")
    }

    // Prepare the profile data with Firebase UID
    const profile = {
      ...profileData,
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email,
      updated_at: new Date().toISOString(),
    }

    // Upsert the profile in Supabase
    const { data, error } = await supabase.from("profiles").upsert(profile).select()

    if (error) {
      console.error("Supabase upsert error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

/**
 * Tests the Firebase-Supabase integration
 * This function can be called after login to verify everything is working
 */
export const testFirebaseSupabaseIntegration = async () => {
  try {
    // Get the authenticated Supabase client
    const supabase = getSupabaseClient()

    // Get the current Firebase user
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      return {
        success: false,
        message: "No authenticated user found",
        firebaseUser: null,
        supabaseData: null,
      }
    }

    // Try to get the user's profile from Supabase
    const { data, error } = await supabase.from("profiles").select("*").eq("firebase_uid", firebaseUser.uid)

    // If the profile doesn't exist, create it
    if (error || !data || data.length === 0) {
      // Create a basic profile
      const newProfile = {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: firebaseUser.email?.split("@")[0] || "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Insert the profile
      const { data: insertData, error: insertError } = await supabase.from("profiles").upsert(newProfile).select()

      if (insertError) {
        return {
          success: false,
          message: "Failed to create profile",
          error: insertError,
          firebaseUser,
          supabaseData: null,
        }
      }

      return {
        success: true,
        message: "Profile created successfully",
        firebaseUser,
        supabaseData: insertData,
      }
    }

    return {
      success: true,
      message: "Profile retrieved successfully",
      firebaseUser,
      supabaseData: data,
    }
  } catch (error) {
    console.error("Integration test error:", error)
    return {
      success: false,
      message: "Integration test failed",
      error,
      firebaseUser: auth.currentUser,
      supabaseData: null,
    }
  }
}

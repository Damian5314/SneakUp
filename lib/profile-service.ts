import { getSupabaseClient } from "./supabase"
import { auth } from "./firebase"

export interface Profile {
  id?: number
  firebase_uid: string
  email?: string | null
  username?: string | null
  avatar_url?: string | null
  created_at?: string
  updated_at?: string
  last_seen?: string
}

/**
 * Synchronizes the current Firebase user's profile with Supabase
 */
export const syncUserProfile = async (): Promise<Profile | null> => {
  try {
    const user = auth.currentUser
    if (!user) return null

    const supabase = getSupabaseClient()

    // Prepare profile data
    const profileData = {
      firebase_uid: user.uid,
      email: user.email,
      updated_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    }

    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("firebase_uid", user.uid)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned" which is expected if the profile doesn't exist
      console.error("Error checking if profile exists:", fetchError)
    }

    // If profile doesn't exist, add created_at
    if (!existingProfile) {
      profileData.created_at = new Date().toISOString()
    }

    // Upsert the profile
    const { data, error } = await supabase.from("profiles").upsert(profileData).select().single()

    if (error) {
      console.error("Error syncing user profile to Supabase:", error)
      return null
    }

    console.log("User synchronized with Supabase.")
    return data as Profile
  } catch (error) {
    console.error("Error in syncUserProfile:", error)
    return null
  }
}

/**
 * Gets the current user's profile from Supabase
 */
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  try {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      throw new Error("No authenticated user found")
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("firebase_uid", firebaseUser.uid).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data as Profile
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error)
    return null
  }
}

/**
 * Updates the last_seen timestamp for the current user
 */
export const updateLastSeen = async (): Promise<void> => {
  try {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return

    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from("profiles")
      .update({ last_seen: new Date().toISOString() })
      .eq("firebase_uid", firebaseUser.uid)

    if (error) {
      console.error("Error updating last seen:", error)
    }
  } catch (error) {
    console.error("Error in updateLastSeen:", error)
  }
}

// Other profile service functions remain the same...

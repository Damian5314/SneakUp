import { auth } from "./firebase"
import { getSupabaseClient } from "./supabase"

// Store the current supabase client with auth
let supabaseWithAuth: ReturnType<typeof getSupabaseClient> | null = null

/**
 * Gets a Supabase client with Firebase authentication
 * Call this function whenever you need to make authenticated Supabase requests
 */
export const getAuthenticatedSupabase = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      return getSupabaseClient() // Return unauthenticated client
    }

    const token = await user.getIdToken()
    supabaseWithAuth = getSupabaseClient(token)
    return supabaseWithAuth
  } catch (error) {
    console.error("Error getting authenticated Supabase client:", error)
    return getSupabaseClient() // Return unauthenticated client as fallback
  }
}

/**
 * Clears the authenticated Supabase client
 * Call this function when logging out
 */
export const clearSupabaseAuth = (): void => {
  supabaseWithAuth = null
}

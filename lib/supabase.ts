import { createClient } from "@supabase/supabase-js"

// Initialize with public anon key (for unauthenticated requests)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a basic supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Store the authenticated client
let authenticatedClient = supabase

/**
 * Set up Supabase with Firebase token
 * @param firebaseToken Firebase ID token
 */
export const setupSupabaseWithFirebase = (firebaseToken: string) => {
  // Create a new client with the Firebase token
  authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    },
  })

  console.log("Supabase client authenticated with Firebase token")
}

/**
 * Clear Supabase authentication
 */
export const clearSupabaseAuth = () => {
  // Reset to the unauthenticated client
  authenticatedClient = supabase
  console.log("Supabase authentication cleared")
}

/**
 * Get the current Supabase client (authenticated if available)
 * @returns Supabase client
 */
export const getSupabaseClient = () => {
  return authenticatedClient
}

export { supabase }

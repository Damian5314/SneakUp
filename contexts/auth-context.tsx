"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { setupSupabaseWithFirebase, clearSupabaseAuth } from "@/lib/supabase"
import { refreshAuthToken } from "@/lib/auth-service"
import { syncUserProfile, updateLastSeen } from "@/lib/profile-service"

type AuthContextType = {
  user: User | null
  loading: boolean
  authError: string | null
  refreshToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authError: null,
  refreshToken: async () => null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  // Function to refresh the token
  const refreshToken = useCallback(async () => {
    try {
      const token = await refreshAuthToken()
      if (token) {
        // Update Supabase with the new token
        setupSupabaseWithFirebase(token)
      }
      return token
    } catch (error) {
      console.error("Error refreshing token:", error)
      return null
    }
  }, [])

  // Set up token refresh interval and sync user profile
  useEffect(() => {
    if (!user) return

    // Sync user profile with Supabase when app starts
    syncUserProfile().catch((err) => console.error("Error syncing user profile:", err))

    // Refresh token every 30 minutes (Firebase tokens expire after 1 hour)
    const tokenRefreshInterval = setInterval(
      async () => {
        try {
          await refreshToken()
        } catch (error) {
          console.error("Error refreshing token:", error)
        }
      },
      30 * 60 * 1000,
    )

    // Update last_seen every 5 minutes
    const lastSeenInterval = setInterval(
      async () => {
        try {
          await updateLastSeen()
        } catch (error) {
          console.error("Error updating last seen:", error)
        }
      },
      5 * 60 * 1000,
    )

    return () => {
      clearInterval(tokenRefreshInterval)
      clearInterval(lastSeenInterval)
    }
  }, [user, refreshToken])

  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!auth) {
      setAuthError("Firebase authentication is not initialized. Please check your environment variables.")
      setLoading(false)
      return () => {}
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          setUser(user)

          // Set or clear Supabase auth based on Firebase auth state
          if (user) {
            try {
              // Get the ID token and set up Supabase with it
              const token = await user.getIdToken(true) // Force refresh
              setupSupabaseWithFirebase(token)

              // Sync user profile with Supabase
              await syncUserProfile()
            } catch (error) {
              console.error("Error setting up Supabase auth:", error)
            }
          } else {
            clearSupabaseAuth()
          }

          setLoading(false)
        },
        (error) => {
          console.error("Auth state change error:", error)
          setAuthError(error.message)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error: any) {
      console.error("Auth provider setup error:", error)
      setAuthError(error.message)
      setLoading(false)
      return () => {}
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, authError, refreshToken }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { syncUserProfile, getCurrentUserProfile, type Profile } from "@/lib/profile-service"
import { refreshAuthToken } from "@/lib/auth-service"

export default function FirebaseSupabaseTest() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load profile on component mount
  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  // Function to load the profile
  const loadProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const profile = await getCurrentUserProfile()
      setProfile(profile)
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
      console.error("Error loading profile:", err)
    } finally {
      setLoading(false)
    }
  }

  // Function to sync the profile
  const handleSyncProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const profile = await syncUserProfile()
      setProfile(profile)
    } catch (err: any) {
      setError(err.message || "Failed to sync profile")
      console.error("Error syncing profile:", err)
    } finally {
      setLoading(false)
    }
  }

  // Function to refresh the token
  const handleRefreshToken = async () => {
    setLoading(true)
    setError(null)
    try {
      await refreshAuthToken()
      await loadProfile()
    } catch (err: any) {
      setError(err.message || "Failed to refresh token")
      console.error("Error refreshing token:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Firebase-Supabase Integration</CardTitle>
          <CardDescription>You need to be logged in to test this integration</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase-Supabase Integration</CardTitle>
        <CardDescription>Test the integration between Firebase Auth and Supabase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Firebase User</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto max-h-40">
            <pre className="text-xs">{JSON.stringify(user.toJSON(), null, 2)}</pre>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Supabase Profile</h3>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-200">
              <p className="text-sm">{error}</p>
            </div>
          ) : profile ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto max-h-40">
              <pre className="text-xs">{JSON.stringify(profile, null, 2)}</pre>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <p className="text-sm">No profile found. Try syncing your profile.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={loadProfile} variant="outline" disabled={loading}>
            Reload Profile
          </Button>
          <Button onClick={handleSyncProfile} disabled={loading}>
            Sync Profile
          </Button>
          <Button onClick={handleRefreshToken} variant="secondary" disabled={loading}>
            Refresh Token
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

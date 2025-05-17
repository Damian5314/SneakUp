"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserProfile, updateUserProfile } from "@/lib/user-service"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function UserProfileData() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        setLoading(true)
        const data = await getUserProfile()
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, toast])

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Example update
      const updatedProfile = {
        ...profile,
        last_seen: new Date().toISOString(),
      }

      await updateUserProfile(updatedProfile)

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Refresh profile data
      const data = await getUserProfile()
      setProfile(data)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading profile data...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Supabase Profile Data</h3>

      {profile ? (
        <div>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>

          <Button onClick={handleUpdateProfile} className="mt-4">
            Update Last Seen
          </Button>
        </div>
      ) : (
        <div>
          <p>No profile data found. You may need to create a profile in Supabase.</p>
          <Button onClick={handleUpdateProfile} className="mt-4">
            Create Profile
          </Button>
        </div>
      )}
    </div>
  )
}

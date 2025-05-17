import { getSupabaseClient } from "./supabase"
import { auth } from "./firebase"

export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  type: "general" | "targeted"
  target_uid?: string
  deadline: string
  created_at: string
  created_by: string
}

export interface ChallengeWithTarget extends Challenge {
  target?: {
    username: string
    avatar_url?: string
  }
}

/**
 * Get all active challenges (where deadline > now)
 */
export const getActiveChallenges = async (): Promise<ChallengeWithTarget[]> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    // Get challenges where deadline is in the future
    const { data: challenges, error } = await supabase
      .from("challenges")
      .select("*")
      .gt("deadline", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching active challenges:", error)
      return []
    }

    // Get all unique target UIDs
    const targetUids = challenges
      .filter((challenge) => challenge.type === "targeted" && challenge.target_uid)
      .map((challenge) => challenge.target_uid)
      .filter((uid, index, self) => uid && self.indexOf(uid) === index) as string[]

    // Get target user profiles
    const { data: targetProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("firebase_uid, username, avatar_url")
      .in("firebase_uid", targetUids)

    if (profilesError) {
      console.error("Error fetching target profiles:", profilesError)
    }

    // Map profiles to challenges
    const challengesWithTargets = challenges.map((challenge) => {
      const result: ChallengeWithTarget = { ...(challenge as Challenge) }

      if (challenge.type === "targeted" && challenge.target_uid) {
        const targetProfile = targetProfiles?.find((profile) => profile.firebase_uid === challenge.target_uid)
        if (targetProfile) {
          result.target = {
            username: targetProfile.username,
            avatar_url: targetProfile.avatar_url,
          }
        }
      }

      return result
    })

    return challengesWithTargets
  } catch (error) {
    console.error("Error in getActiveChallenges:", error)
    return []
  }
}

/**
 * Get challenges created by the current user
 */
export const getMyChallenges = async (): Promise<Challenge[]> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("created_by", currentUser.uid)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching my challenges:", error)
      return []
    }

    return data as Challenge[]
  } catch (error) {
    console.error("Error in getMyChallenges:", error)
    return []
  }
}

/**
 * Get challenges where the current user is the target
 */
export const getChallengesTargetingMe = async (): Promise<Challenge[]> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("target_uid", currentUser.uid)
      .gt("deadline", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching challenges targeting me:", error)
      return []
    }

    return data as Challenge[]
  } catch (error) {
    console.error("Error in getChallengesTargetingMe:", error)
    return []
  }
}

/**
 * Create a new challenge
 */
export const createChallenge = async (
  challenge: Omit<Challenge, "id" | "created_at" | "created_by">,
): Promise<Challenge | null> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    // Get a fresh token before creating the challenge
    const token = await currentUser.getIdToken(true)

    // Log the token for debugging (remove in production)
    console.log("Using token for challenge creation:", token.substring(0, 10) + "...")

    const newChallenge = {
      ...challenge,
      created_by: currentUser.uid,
    }

    // Log the challenge data for debugging
    console.log("Creating challenge:", newChallenge)

    const { data, error } = await supabase.from("challenges").insert(newChallenge).select().single()

    if (error) {
      console.error("Error creating challenge:", error)
      throw new Error(`Error creating challenge: ${error.message}`)
    }

    return data as Challenge
  } catch (error) {
    console.error("Error in createChallenge:", error)
    throw error
  }
}

/**
 * Update an existing challenge
 */
export const updateChallenge = async (id: string, challenge: Partial<Challenge>): Promise<Challenge | null> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    const { data, error } = await supabase
      .from("challenges")
      .update(challenge)
      .eq("id", id)
      .eq("created_by", currentUser.uid) // Ensure user can only update their own challenges
      .select()
      .single()

    if (error) {
      console.error("Error updating challenge:", error)
      return null
    }

    return data as Challenge
  } catch (error) {
    console.error("Error in updateChallenge:", error)
    return null
  }
}

/**
 * Delete a challenge
 */
export const deleteChallenge = async (id: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    const { error } = await supabase.from("challenges").delete().eq("id", id).eq("created_by", currentUser.uid) // Ensure user can only delete their own challenges

    if (error) {
      console.error("Error deleting challenge:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteChallenge:", error)
    return false
  }
}

import { getSupabaseClient } from "./supabase"
import { auth } from "./firebase"
import { uploadChallengeProof } from "./storage-service"

export interface Completion {
  id: string
  challenge_id: string
  completed_by: string
  proof_url?: string
  completed_at: string
  status: "pending" | "approved" | "rejected"
}

export interface CompletionWithChallenge extends Completion {
  challenge: {
    title: string
    points: number
    type: "general" | "targeted"
  }
}

/**
 * Submit a challenge completion
 */
export const submitCompletion = async (challengeId: string, proofFile?: File): Promise<Completion | null> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    // Upload proof if provided
    let proofUrl: string | undefined
    if (proofFile) {
      proofUrl = await uploadChallengeProof(proofFile, challengeId)
    }

    // Create completion record
    const completion = {
      challenge_id: challengeId,
      completed_by: currentUser.uid,
      proof_url: proofUrl,
      status: "pending",
    }

    const { data, error } = await supabase.from("completions").insert(completion).select().single()

    if (error) {
      console.error("Error submitting completion:", error)
      return null
    }

    return data as Completion
  } catch (error) {
    console.error("Error in submitCompletion:", error)
    return null
  }
}

/**
 * Get completions for a specific challenge
 */
export const getChallengeCompletions = async (challengeId: string): Promise<Completion[]> => {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("completions")
      .select("*")
      .eq("challenge_id", challengeId)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("Error fetching challenge completions:", error)
      return []
    }

    return data as Completion[]
  } catch (error) {
    console.error("Error in getChallengeCompletions:", error)
    return []
  }
}

/**
 * Get completions by the current user
 */
export const getMyCompletions = async (): Promise<CompletionWithChallenge[]> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    const { data, error } = await supabase
      .from("completions")
      .select(`
        *,
        challenge:challenges(title, points, type)
      `)
      .eq("completed_by", currentUser.uid)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("Error fetching my completions:", error)
      return []
    }

    return data as CompletionWithChallenge[]
  } catch (error) {
    console.error("Error in getMyCompletions:", error)
    return []
  }
}

/**
 * Update the status of a completion (for challenge creators)
 */
export const updateCompletionStatus = async (
  completionId: string,
  status: "approved" | "rejected",
): Promise<Completion | null> => {
  try {
    const supabase = getSupabaseClient()

    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    // First, get the completion to check if the user is the challenge creator
    const { data: completionData, error: completionError } = await supabase
      .from("completions")
      .select("*, challenge:challenges(created_by)")
      .eq("id", completionId)
      .single()

    if (completionError) {
      console.error("Error fetching completion:", completionError)
      return null
    }

    // Check if the current user is the challenge creator
    if (completionData.challenge.created_by !== currentUser.uid) {
      throw new Error("Only the challenge creator can update completion status")
    }

    // Update the completion status
    const { data, error } = await supabase
      .from("completions")
      .update({ status })
      .eq("id", completionId)
      .select()
      .single()

    if (error) {
      console.error("Error updating completion status:", error)
      return null
    }

    return data as Completion
  } catch (error) {
    console.error("Error in updateCompletionStatus:", error)
    return null
  }
}

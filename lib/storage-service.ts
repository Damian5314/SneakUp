import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth } from "./firebase"

// Initialize Firebase Storage
const storage = getStorage()

/**
 * Upload a file to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage where the file should be stored
 * @returns The download URL of the uploaded file
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, path)

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file)

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

/**
 * Upload a challenge proof image
 * @param file The image file to upload
 * @param challengeId The ID of the challenge
 * @returns The download URL of the uploaded image
 */
export const uploadChallengeProof = async (file: File, challengeId: string): Promise<string> => {
  try {
    // Get current user's Firebase UID
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error("No authenticated user found")
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`

    // Create the path in storage
    const path = `challenge-proofs/${currentUser.uid}/${challengeId}/${filename}`

    // Upload the file
    return await uploadFile(file, path)
  } catch (error) {
    console.error("Error uploading challenge proof:", error)
    throw error
  }
}

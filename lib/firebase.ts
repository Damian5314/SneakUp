import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Log environment variable status in development
if (process.env.NODE_ENV === "development") {
  console.log("Firebase configuration status:", {
    apiKey: firebaseConfig.apiKey ? "✓ Set" : "✗ Missing",
    authDomain: firebaseConfig.authDomain ? "✓ Set" : "✗ Missing",
    projectId: firebaseConfig.projectId ? "✓ Set" : "✗ Missing",
    storageBucket: firebaseConfig.storageBucket ? "✓ Set" : "✗ Missing",
    messagingSenderId: firebaseConfig.messagingSenderId ? "✓ Set" : "✗ Missing",
    appId: firebaseConfig.appId ? "✓ Set" : "✗ Missing",
  })
}

// Initialize Firebase
let app
let auth

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
} catch (error) {
  console.error("Error initializing Firebase:", error)
}

export { auth }

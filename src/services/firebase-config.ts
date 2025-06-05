
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebase configuration
// These would normally be environment variables
const firebaseConfig = {
  apiKey: process.env.PLASMO_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN || "creator-monetizer.firebaseapp.com",
  projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID || "creator-monetizer",
  storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET || "creator-monetizer.appspot.com",
  messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app


import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth/web-extension"
import { getFirestore } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.PLASMO_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Note: Analytics not available in service workers
// const analytics = getAnalytics(app); // Only for client-side code

export default app

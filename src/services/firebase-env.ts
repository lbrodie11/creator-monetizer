/**
 * Firebase Environment Configuration
 * Separate file to handle environment variable access for both content scripts and service workers
 */

export const getFirebaseConfig = () => {
  return {
    apiKey: import.meta.env.PLASMO_PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID
  }
}

// Hardcoded fallback for service workers where import.meta.env might not work
export const getFirebaseConfigFallback = () => {
  return {
    apiKey: "AIzaSyDHY9bT6gxnhgP0hhHs-arVBjypLB6exBA",
    authDomain: "creator-monetizer.firebaseapp.com",
    projectId: "creator-monetizer",
    storageBucket: "creator-monetizer.firebasestorage.app",
    messagingSenderId: "256036793295",
    appId: "1:256036793295:web:24b60441ad21f20f5fc0ba",
    measurementId: "G-YPR2WJ055T"
  }
}

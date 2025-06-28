
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth/web-extension"
import type { User as FirebaseUser } from "firebase/auth"
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore"
import { auth, db } from "./firebase-config"
import type { User, UserAffiliateSettings, LinkConversion } from "~src/types"

export class UserService {
  private static instance: UserService
  private currentUser: User | null = null

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async signInWithGoogle(): Promise<User> {
    return new Promise((resolve, reject) => {
      // Request background script to handle authentication
      chrome.runtime.sendMessage({ action: "SIGN_IN_GOOGLE" }, (response) => {
        if (!response?.success) {
          reject(new Error("Failed to initiate authentication"))
          return
        }
      })

      // Listen for authentication result
      const messageListener = (message: any) => {
        if (message.type === "AUTH_SUCCESS") {
          chrome.runtime.onMessage.removeListener(messageListener)
          this.handleAuthenticatedUser(message.user)
            .then(resolve)
            .catch(reject)
        } else if (message.type === "AUTH_ERROR") {
          chrome.runtime.onMessage.removeListener(messageListener)
          reject(new Error(message.error))
        }
      }

      chrome.runtime.onMessage.addListener(messageListener)
    })
  }

  async checkAuthState(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe()
        if (firebaseUser) {
          try {
            const user = await this.handleAuthenticatedUser(firebaseUser)
            resolve(user)
          } catch (error) {
            console.error("Error loading user:", error)
            resolve(null)
          }
        } else {
          this.currentUser = null
          resolve(null)
        }
      })
    })
  }

  async signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Request background script to handle sign out
      chrome.runtime.sendMessage({ action: "SIGN_OUT_GOOGLE" }, (response) => {
        if (!response?.success) {
          reject(new Error("Failed to initiate sign out"))
          return
        }
      })

      // Listen for sign out result
      const messageListener = (message: any) => {
        if (message.type === "SIGN_OUT_SUCCESS") {
          chrome.runtime.onMessage.removeListener(messageListener)
          this.currentUser = null
          resolve()
        } else if (message.type === "SIGN_OUT_ERROR") {
          chrome.runtime.onMessage.removeListener(messageListener)
          reject(new Error(message.error))
        }
      }

      chrome.runtime.onMessage.addListener(messageListener)
    })
  }

  private async handleAuthenticatedUser(firebaseUser: FirebaseUser): Promise<User> {
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
    
    if (!userDoc.exists()) {
      // Create new user document
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
        affiliateSettings: {},
        isPro: false,
        createdAt: Date.now()
      }

      await setDoc(doc(db, "users", firebaseUser.uid), newUser)
      this.currentUser = newUser
      return newUser
    } else {
      // Return existing user
      const userData = userDoc.data() as User
      this.currentUser = userData
      return userData
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  async updateAffiliateSettings(settings: UserAffiliateSettings): Promise<void> {
    if (!this.currentUser) {
      throw new Error("No user signed in")
    }

    try {
      await updateDoc(doc(db, "users", this.currentUser.uid), {
        affiliateSettings: settings
      })
      
      this.currentUser.affiliateSettings = settings
    } catch (error) {
      console.error("Error updating affiliate settings:", error)
      throw error
    }
  }

  async logLinkConversion(conversion: Omit<LinkConversion, "id">): Promise<void> {
    if (!this.currentUser) {
      return // Silent fail for non-authenticated users
    }

    try {
      await addDoc(collection(db, "users", this.currentUser.uid, "conversions"), conversion)
    } catch (error) {
      console.error("Error logging link conversion:", error)
      // Don't throw - logging shouldn't break the main functionality
    }
  }

  async getRecentConversions(limitCount: number = 10): Promise<LinkConversion[]> {
    if (!this.currentUser) {
      return []
    }

    try {
      const q = query(
        collection(db, "users", this.currentUser.uid, "conversions"),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LinkConversion[]
    } catch (error) {
      console.error("Error fetching conversions:", error)
      return []
    }
  }

  async loadUserData(firebaseUser: FirebaseUser): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User
        this.currentUser = userData
        return userData
      }
      
      return null
    } catch (error) {
      console.error("Error loading user data:", error)
      return null
    }
  }
}


import { 
  signInWithPopup,
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  type User as FirebaseUser
} from "firebase/auth"
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
    try {
      // For Chrome extensions, redirect to options page for authentication
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        // Close popup and open options page for auth
        chrome.runtime.openOptionsPage()
        
        // Return a promise that resolves when auth completes
        return new Promise((resolve, reject) => {
          // Listen for auth completion message
          const onMessage = (message: any) => {
            if (message.type === 'AUTH_SUCCESS') {
              chrome.runtime.onMessage.removeListener(onMessage)
              this.currentUser = message.user
              resolve(message.user)
            } else if (message.type === 'AUTH_ERROR') {
              chrome.runtime.onMessage.removeListener(onMessage)
              reject(new Error(message.error))
            }
          }
          
          chrome.runtime.onMessage.addListener(onMessage)
          
          // Timeout after 5 minutes
          setTimeout(() => {
            chrome.runtime.onMessage.removeListener(onMessage)
            reject(new Error('Authentication timeout'))
          }, 300000)
        })
      } else {
        throw new Error("Google Sign-In is only supported in Chrome extension environment")
      }
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  // Method to be called from options page
  async signInWithGoogleOnOptionsPage(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider()
      
      // Set custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      // Try the popup approach on the options page (which has more space)
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      
      const user = await this.handleAuthenticatedUser(firebaseUser)
      
      // Notify popup that auth completed
      chrome.runtime.sendMessage({
        type: 'AUTH_SUCCESS',
        user: user
      })
      
      return user
    } catch (error) {
      console.error("Error signing in with Google:", error)
      
      // Notify popup that auth failed
      chrome.runtime.sendMessage({
        type: 'AUTH_ERROR',
        error: error.message
      })
      
      throw error
    }
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

  async checkAuthState(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
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
          resolve(null)
        }
      })
    })
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
      this.currentUser = null
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
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

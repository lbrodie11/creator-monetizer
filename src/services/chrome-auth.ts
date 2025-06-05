import { signInWithCredential, GoogleAuthProvider, type User as FirebaseUser } from "firebase/auth"
import { auth } from "./firebase-config"

export class ChromeAuthService {
  private static instance: ChromeAuthService

  public static getInstance(): ChromeAuthService {
    if (!ChromeAuthService.instance) {
      ChromeAuthService.instance = new ChromeAuthService()
    }
    return ChromeAuthService.instance
  }

  async signInWithGoogle(): Promise<FirebaseUser> {
    return new Promise((resolve, reject) => {
      if (!chrome.identity) {
        reject(new Error("Chrome identity API not available"))
        return
      }

      chrome.identity.getAuthToken(
        { 
          interactive: true,
          scopes: ['email', 'profile']
        },
        async (token) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message))
            return
          }

          if (!token) {
            reject(new Error("No auth token received"))
            return
          }

          try {
            // Create Firebase credential from Chrome identity token
            const credential = GoogleAuthProvider.credential(null, token)
            const result = await signInWithCredential(auth, credential)
            resolve(result.user)
          } catch (error) {
            // If direct credential doesn't work, try getting user info from Google API
            try {
              const userInfo = await this.getUserInfo(token)
              // For now, we'll create a custom token approach
              // This is a simplified version - in production you'd want to verify the token server-side
              reject(new Error("Chrome identity integration needs server-side token verification"))
            } catch (apiError) {
              reject(apiError)
            }
          }
        }
      )
    })
  }

  private async getUserInfo(token: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`)
    if (!response.ok) {
      throw new Error("Failed to get user info from Google API")
    }
    return response.json()
  }

  async signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!chrome.identity) {
        reject(new Error("Chrome identity API not available"))
        return
      }

      chrome.identity.getAuthToken({ interactive: false }, (token) => {
        if (token) {
          chrome.identity.removeCachedAuthToken({ token }, () => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  }
}

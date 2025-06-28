import { signInWithCustomToken } from "firebase/auth/web-extension"
import type { User as FirebaseUser } from "firebase/auth"
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
          scopes: ['email', 'profile', 'openid']
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
            // Get user info from Google
            const userInfo = await this.getUserInfo(token)
            
            // For now, we'll use a simplified approach without server-side token verification
            // In production, you should verify this token server-side and create a custom Firebase token
            console.log("User info received:", userInfo)
            
            // For demo purposes, we'll throw an error with instructions
            reject(new Error("Chrome Identity API authenticated successfully, but custom token generation requires server-side implementation. Please use the Firebase popup method instead."))
            
          } catch (error) {
            reject(error)
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

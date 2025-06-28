
import { useState, useEffect } from "react"
import { UserService } from "~src/services/user-service"
import { sendMessage, MessageActions } from "~src/utils/messaging"
import type { User } from "~src/types"

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await sendMessage({ action: MessageActions.GET_USER_STATUS })
      if (response?.success && response.user) {
        setUser(response.user)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data")
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const userService = UserService.getInstance()
      
      // Use the simplified Firebase popup sign-in
      const signedInUser = await userService.signInWithGoogle()
      
      setUser(signedInUser)
      return signedInUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      
      const userService = UserService.getInstance()
      await userService.signOut()
      setUser(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign out"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    user,
    isLoading,
    error,
    signIn,
    signOut,
    refreshUser: loadUserData
  }
}

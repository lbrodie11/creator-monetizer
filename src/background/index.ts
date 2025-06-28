import { Storage } from "@plasmohq/storage"
import { UserService } from "~src/services/user-service"
import { AffiliateLinkConverter } from "~src/services/affiliate-converter"
import { LocalStorageManager } from "~src/utils/storage"
import type { UserAffiliateSettings } from "~src/types"

// Initialize storage
const storage = new Storage()

console.log("Creator Monetizer background script loaded")

// Offscreen document management
let offscreenCreated = false

async function ensureOffscreenDocument() {
  if (offscreenCreated) return
  
  try {
    // Check if document already exists (Chrome 124+)
    if ('hasDocument' in chrome.offscreen) {
      const hasDoc = await chrome.offscreen.hasDocument()
      if (hasDoc) {
        offscreenCreated = true
        return
      }
    }

    await chrome.offscreen.createDocument({
      url: chrome.runtime.getURL("src/offscreen-auth.html"),
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: "Firebase popup authentication requires DOM access for OAuth flows"
    })
    offscreenCreated = true
    console.log("Offscreen document created successfully")
  } catch (error) {
    // Document might already exist
    if (error.message.includes("Only a single offscreen")) {
      offscreenCreated = true
      console.log("Offscreen document already exists")
    } else {
      console.error("Failed to create offscreen document:", error)
      throw error
    }
  }
}

async function closeOffscreenDocument() {
  if (!offscreenCreated) return
  
  try {
    await chrome.offscreen.closeDocument()
    offscreenCreated = false
    console.log("Offscreen document closed")
  } catch (error) {
    console.error("Failed to close offscreen document:", error)
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Creator Monetizer installed!")
    // Set default settings
    LocalStorageManager.setIsEnabled(true)
  } else if (details.reason === "update") {
    console.log("Creator Monetizer updated")
    // Handle updates and migrate data if needed
    handleExtensionUpdate()
  }
})

// Handle network status changes for offline functionality
// Note: In service workers, we'll use chrome.storage.onChanged to detect reconnection
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.isOffline) {
    if (!changes.isOffline.newValue && changes.isOffline.oldValue) {
      console.log('Back online - syncing pending data')
      syncPendingData()
    }
  }
})

async function handleExtensionUpdate() {
  try {
    // Sync any pending offline data
    await syncPendingData()
    console.log('Extension update handled successfully')
  } catch (error) {
    console.error('Error handling extension update:', error)
  }
}

async function syncPendingData() {
  try {
    await LocalStorageManager.syncPendingData()
    
    // Try to sync with cloud if user is authenticated
    const userService = UserService.getInstance()
    if (userService.getCurrentUser()) {
      const localSettings = await LocalStorageManager.getAffiliateSettings()
      await userService.updateAffiliateSettings(localSettings)
    }
  } catch (error) {
    console.error('Error syncing pending data:', error)
  }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    // Handle Firebase config requests from offscreen document
    if (request.type === "GET_FIREBASE_CONFIG") {
      console.log("Firebase config requested, checking env vars...")
      
      // Add safety checks for undefined environment variables
      const apiKey = process.env.PLASMO_PUBLIC_FIREBASE_API_KEY
      if (!apiKey) {
        console.error("PLASMO_PUBLIC_FIREBASE_API_KEY is undefined!")
        sendResponse({ success: false, error: "Firebase API key not configured" })
        return true
      }
      
      const firebaseConfig = {
        apiKey: process.env.PLASMO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID
      }
      
      console.log("Sending Firebase config:", firebaseConfig)
      sendResponse({ success: true, config: firebaseConfig })
      return true
    }
    
    handleMessage(request, sender, sendResponse)
    return true // Keep the message channel open for async responses
  } catch (error) {
    console.error("Error in message handler:", error)
    sendResponse({ success: false, error: error.message })
    return true
  }
})

// Handle messages from offscreen document
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "AUTH_SUCCESS") {
    console.log("Authentication successful:", message.user.uid)
    // Handle successful authentication
    handleAuthSuccess(message.user)
    // Close offscreen document after successful auth
    closeOffscreenDocument()
  } else if (message.type === "AUTH_ERROR") {
    console.error("Authentication error:", message.error)
    closeOffscreenDocument()
  } else if (message.type === "SIGN_OUT_SUCCESS") {
    console.log("Sign out successful")
    closeOffscreenDocument()
  } else if (message.type === "SIGN_OUT_ERROR") {
    console.error("Sign out error:", message.error)
    closeOffscreenDocument()
  }
})

async function handleAuthSuccess(userData: any) {
  try {
    // This would typically update the user service
    const userService = UserService.getInstance()
    // Note: The actual user handling should be done in the options page
    console.log("User authenticated in background:", userData)
  } catch (error) {
    console.error("Error handling auth success:", error)
  }
}

async function handleMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  try {
    switch (request.action) {
      case "GET_FIREBASE_CONFIG":
        // Return Firebase configuration from environment variables
        console.log("GET_FIREBASE_CONFIG action requested")
        
        // Add safety checks
        const apiKey = process.env.PLASMO_PUBLIC_FIREBASE_API_KEY
        if (!apiKey) {
          console.error("Environment variables not available in handleMessage")
          sendResponse({ success: false, error: "Firebase configuration not available" })
          break
        }
        
        const firebaseConfig = {
          apiKey: process.env.PLASMO_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
          measurementId: process.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID
        }
        
        console.log("Returning Firebase config from handleMessage:", firebaseConfig)
        sendResponse({ success: true, config: firebaseConfig })
        break
      case "SIGN_IN_GOOGLE":
        await ensureOffscreenDocument()
        // Send message to offscreen document to trigger sign-in
        chrome.runtime.sendMessage({ cmd: "SIGN_IN" })
        sendResponse({ success: true })
        break

      case "SIGN_OUT_GOOGLE":
        await ensureOffscreenDocument()
        chrome.runtime.sendMessage({ cmd: "SIGN_OUT" })
        sendResponse({ success: true })
        break

      case "GET_SETTINGS":
        const settings = await getAffiliateSettings()
        const isEnabled = await storage.get("isEnabled") ?? true
        sendResponse({ 
          success: true, 
          data: { ...settings, isEnabled } 
        })
        break

      case "UPDATE_SETTINGS":
        await updateAffiliateSettings(request.settings)
        sendResponse({ success: true })
        break

      case "TOGGLE_ENABLED":
        await storage.set("isEnabled", request.enabled)
        sendResponse({ success: true })
        break

      case "CONVERT_URL":
        const result = await convertUrl(request.url)
        sendResponse(result)
        break

      case "GET_USER_STATUS":
        const userService = UserService.getInstance()
        const user = userService.getCurrentUser()
        sendResponse({ 
          success: true, 
          user: user ? { 
            uid: user.uid, 
            email: user.email, 
            displayName: user.displayName,
            isPro: user.isPro 
          } : null 
        })
        break

      case "LOG_CONVERSION":
        await logConversion(request.conversion)
        sendResponse({ success: true })
        break

      default:
        sendResponse({ success: false, error: "Unknown action" })
    }
  } catch (error) {
    console.error("Background script error:", error)
    sendResponse({ success: false, error: error.message })
  }
}

async function getAffiliateSettings(): Promise<UserAffiliateSettings> {
  const userService = UserService.getInstance()
  const user = userService.getCurrentUser()
  
  if (user) {
    return user.affiliateSettings
  }
  
  // Fallback to local storage for offline/non-authenticated users
  return await storage.get("affiliateSettings") || {}
}

async function updateAffiliateSettings(settings: UserAffiliateSettings): Promise<void> {
  const userService = UserService.getInstance()
  const user = userService.getCurrentUser()
  
  if (user) {
    await userService.updateAffiliateSettings(settings)
  }
  
  // Also store locally as backup
  await storage.set("affiliateSettings", settings)
}

async function convertUrl(url: string) {
  const settings = await getAffiliateSettings()
  const converter = new AffiliateLinkConverter(settings)
  return converter.convertUrl(url)
}

async function logConversion(conversion: any) {
  const userService = UserService.getInstance()
  await userService.logLinkConversion(conversion)
}

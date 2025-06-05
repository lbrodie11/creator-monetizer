
import { Storage } from "@plasmohq/storage"
import { UserService } from "~src/services/user-service"
import { AffiliateLinkConverter } from "~src/services/affiliate-converter"
import { LocalStorageManager } from "~src/utils/storage"
import type { UserAffiliateSettings } from "~src/types"

// Initialize storage
const storage = new Storage()

console.log("Creator Monetizer background script loaded")

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
  handleMessage(request, sender, sendResponse)
  return true // Keep the message channel open for async responses
})

async function handleMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
  try {
    switch (request.action) {
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

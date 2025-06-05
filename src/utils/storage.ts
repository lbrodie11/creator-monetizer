
import { Storage } from "@plasmohq/storage"
import type { UserAffiliateSettings, LinkConversion } from "~src/types"

export const storage = new Storage()

export const StorageKeys = {
  AFFILIATE_SETTINGS: "affiliateSettings",
  IS_ENABLED: "isEnabled",
  USER_PREFERENCES: "userPreferences",
  OFFLINE_CONVERSIONS: "offlineConversions",
  LAST_SYNC: "lastSync",
  OFFLINE_MODE: "offlineMode"
} as const

export class LocalStorageManager {
  static async getAffiliateSettings(): Promise<UserAffiliateSettings> {
    try {
      return await storage.get(StorageKeys.AFFILIATE_SETTINGS) || {}
    } catch (error) {
      console.error("Error getting affiliate settings:", error)
      return {}
    }
  }

  static async setAffiliateSettings(settings: UserAffiliateSettings): Promise<void> {
    try {
      await storage.set(StorageKeys.AFFILIATE_SETTINGS, settings)
      await this.setLastSync(Date.now())
    } catch (error) {
      console.error("Error setting affiliate settings:", error)
    }
  }

  static async getIsEnabled(): Promise<boolean> {
    try {
      return await storage.get(StorageKeys.IS_ENABLED) ?? true
    } catch (error) {
      console.error("Error getting enabled status:", error)
      return true
    }
  }

  static async setIsEnabled(enabled: boolean): Promise<void> {
    try {
      await storage.set(StorageKeys.IS_ENABLED, enabled)
    } catch (error) {
      console.error("Error setting enabled status:", error)
    }
  }

  static async addOfflineConversion(conversion: LinkConversion): Promise<void> {
    try {
      const existing = await this.getOfflineConversions()
      existing.push(conversion)
      await storage.set(StorageKeys.OFFLINE_CONVERSIONS, existing)
    } catch (error) {
      console.error("Error adding offline conversion:", error)
    }
  }

  static async getOfflineConversions(): Promise<LinkConversion[]> {
    try {
      return await storage.get(StorageKeys.OFFLINE_CONVERSIONS) || []
    } catch (error) {
      console.error("Error getting offline conversions:", error)
      return []
    }
  }

  static async clearOfflineConversions(): Promise<void> {
    try {
      await storage.set(StorageKeys.OFFLINE_CONVERSIONS, [])
    } catch (error) {
      console.error("Error clearing offline conversions:", error)
    }
  }

  static async setOfflineMode(offline: boolean): Promise<void> {
    try {
      await storage.set(StorageKeys.OFFLINE_MODE, offline)
    } catch (error) {
      console.error("Error setting offline mode:", error)
    }
  }

  static async isOfflineMode(): Promise<boolean> {
    try {
      return await storage.get(StorageKeys.OFFLINE_MODE) ?? false
    } catch (error) {
      console.error("Error checking offline mode:", error)
      return false
    }
  }

  static async setLastSync(timestamp: number): Promise<void> {
    try {
      await storage.set(StorageKeys.LAST_SYNC, timestamp)
    } catch (error) {
      console.error("Error setting last sync:", error)
    }
  }

  static async getLastSync(): Promise<number> {
    try {
      return await storage.get(StorageKeys.LAST_SYNC) || 0
    } catch (error) {
      console.error("Error getting last sync:", error)
      return 0
    }
  }

  static async syncPendingData(): Promise<void> {
    try {
      const offlineConversions = await this.getOfflineConversions()
      if (offlineConversions.length > 0) {
        // Here you would sync with cloud storage
        // For now, we'll just log them
        console.log("Syncing offline conversions:", offlineConversions)
        await this.clearOfflineConversions()
      }
      await this.setOfflineMode(false)
    } catch (error) {
      console.error("Error syncing pending data:", error)
    }
  }
}

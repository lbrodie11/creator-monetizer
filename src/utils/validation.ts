// Validation utilities for affiliate IDs
export interface ValidationResult {
  isValid: boolean
  error?: string
  suggestion?: string
}

export class AffiliateIdValidator {
  static validateAmazonId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "Amazon Associate ID is required" }
    }

    // Amazon Associate IDs typically end with -20 or similar country codes
    const amazonPattern = /^[\w-]+(-\d{2})$/
    if (!amazonPattern.test(id)) {
      return {
        isValid: false,
        error: "Invalid Amazon Associate ID format",
        suggestion: "Should end with country code like '-20' (e.g., yourname-20)"
      }
    }

    return { isValid: true }
  }

  static validateEbayId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "eBay Partner Network Campaign ID is required" }
    }

    // eBay campaign IDs are typically numeric
    if (!/^\d+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid eBay Campaign ID format",
        suggestion: "Should be numeric (e.g., 5338177094)"
      }
    }

    return { isValid: true }
  }

  static validateBookingId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "Booking.com Affiliate ID is required" }
    }

    // Booking.com affiliate IDs are typically numeric
    if (!/^\d+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid Booking.com Affiliate ID format",
        suggestion: "Should be numeric (e.g., 812345)"
      }
    }

    return { isValid: true }
  }

  static validateAliExpressId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "AliExpress Affiliate ID is required" }
    }

    // AliExpress affiliate IDs can be alphanumeric
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid AliExpress Affiliate ID format",
        suggestion: "Should contain only letters, numbers, underscores, and hyphens"
      }
    }

    return { isValid: true }
  }

  static validateWalmartId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "Walmart Affiliate ID is required" }
    }

    // Walmart partner IDs are alphanumeric
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid Walmart Partner ID format",
        suggestion: "Should contain only letters, numbers, underscores, and hyphens"
      }
    }

    return { isValid: true }
  }

  static validateTargetId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "Target Affiliate ID is required" }
    }

    // Target affiliate IDs are typically alphanumeric
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid Target Affiliate ID format",
        suggestion: "Should contain only letters, numbers, underscores, and hyphens"
      }
    }

    return { isValid: true }
  }

  static validateShareASaleId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "ShareASale Affiliate ID is required" }
    }

    // ShareASale IDs are typically numeric
    if (!/^\d+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid ShareASale Affiliate ID format",
        suggestion: "Should be numeric (e.g., 123456)"
      }
    }

    return { isValid: true }
  }

  static validateCJId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "CJ Affiliate ID is required" }
    }

    // CJ Affiliate IDs are typically numeric
    if (!/^\d+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid CJ Affiliate ID format",
        suggestion: "Should be numeric (e.g., 987654321)"
      }
    }

    return { isValid: true }
  }

  static validateImpactId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "Impact Affiliate ID is required" }
    }

    // Impact IDs are alphanumeric
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid Impact Affiliate ID format",
        suggestion: "Should contain only letters, numbers, underscores, and hyphens"
      }
    }

    return { isValid: true }
  }

  static validateFlexOffersId(id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: false, error: "FlexOffers Affiliate ID is required" }
    }

    // FlexOffers IDs are typically numeric
    if (!/^\d+$/.test(id)) {
      return {
        isValid: false,
        error: "Invalid FlexOffers Affiliate ID format",
        suggestion: "Should be numeric (e.g., 456789)"
      }
    }

    return { isValid: true }
  }

  static validateById(programId: string, id: string): ValidationResult {
    if (!id.trim()) {
      return { isValid: true } // Allow empty values (optional configuration)
    }

    switch (programId) {
      case "amazon":
        return this.validateAmazonId(id)
      case "ebay":
        return this.validateEbayId(id)
      case "booking":
        return this.validateBookingId(id)
      case "aliexpress":
        return this.validateAliExpressId(id)
      case "walmart":
        return this.validateWalmartId(id)
      case "target":
        return this.validateTargetId(id)
      case "shareasale":
        return this.validateShareASaleId(id)
      case "cj":
        return this.validateCJId(id)
      case "impact":
        return this.validateImpactId(id)
      case "flexoffers":
        return this.validateFlexOffersId(id)
      default:
        return { isValid: true }
    }
  }

  static validateAllSettings(settings: Record<string, string>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {}
    
    for (const [programId, id] of Object.entries(settings)) {
      results[programId] = this.validateById(programId, id)
    }

    return results
  }
}

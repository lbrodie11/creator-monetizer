
import type { AffiliateProgram, ConversionResult, UserAffiliateSettings } from "~src/types"
import { getProgramByDomain } from "~src/config/affiliate-programs"

export class AffiliateLinkConverter {
  private settings: UserAffiliateSettings

  constructor(settings: UserAffiliateSettings) {
    this.settings = settings
  }

  updateSettings(settings: UserAffiliateSettings): void {
    this.settings = settings
  }

  convertUrl(url: string): ConversionResult {
    try {
      const parsedUrl = new URL(url)
      const program = getProgramByDomain(parsedUrl.hostname)

      if (!program) {
        return {
          success: false,
          originalUrl: url,
          error: "No affiliate program found for this domain"
        }
      }

      const affiliateId = this.settings[program.id]
      if (!affiliateId) {
        return {
          success: false,
          originalUrl: url,
          error: `No affiliate ID configured for ${program.name}`
        }
      }

      const affiliateUrl = this.buildAffiliateUrl(parsedUrl, program, affiliateId)

      return {
        success: true,
        originalUrl: url,
        affiliateUrl,
        program: program.id
      }
    } catch (error) {
      return {
        success: false,
        originalUrl: url,
        error: "Invalid URL format"
      }
    }
  }

  private buildAffiliateUrl(url: URL, program: AffiliateProgram, affiliateId: string): string {
    const newUrl = new URL(url.toString())

    switch (program.id) {
      case "amazon":
        // Remove existing tag parameter if present
        newUrl.searchParams.delete("tag")
        newUrl.searchParams.set("tag", affiliateId)
        break
      
      case "ebay":
        newUrl.searchParams.set("campid", affiliateId)
        break
      
      case "booking":
        newUrl.searchParams.set("aid", affiliateId)
        break
      
      case "aliexpress":
        newUrl.searchParams.set("aff_trace_key", affiliateId)
        break
      
      case "walmart":
        newUrl.searchParams.set("wmlspartner", affiliateId)
        break
      
      case "target":
        newUrl.searchParams.set("afid", affiliateId)
        break
      
      default:
        newUrl.searchParams.set(program.paramName, affiliateId)
    }

    return newUrl.toString()
  }

  isAffiliateUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url)
      const program = getProgramByDomain(parsedUrl.hostname)
      
      if (!program) return false
      
      return parsedUrl.searchParams.has(program.paramName)
    } catch {
      return false
    }
  }
}

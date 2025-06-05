
import type { AffiliateProgram } from "~src/types"

export const AFFILIATE_PROGRAMS: AffiliateProgram[] = [
  {
    id: "amazon",
    name: "Amazon Associates",
    domain: "amazon",
    paramName: "tag",
    icon: "🛒",
    patterns: [
      /amazon\.(com|co\.uk|de|fr|it|es|ca|com\.au|co\.jp|in|com\.br)/,
      /amzn\.(to|com)/,
      /a\.co/
    ]
  },
  {
    id: "ebay",
    name: "eBay Partner Network",
    domain: "ebay",
    paramName: "campid",
    icon: "🏪",
    patterns: [
      /ebay\.(com|co\.uk|de|fr|it|es|ca|com\.au)/,
      /rover\.ebay\.com/
    ]
  },
  {
    id: "booking",
    name: "Booking.com Affiliate",
    domain: "booking.com",
    paramName: "aid",
    icon: "🏨",
    patterns: [
      /booking\.com/,
      /bstatic\.com/
    ]
  },
  {
    id: "aliexpress",
    name: "AliExpress Affiliate",
    domain: "aliexpress",
    paramName: "aff_trace_key",
    icon: "🛍️",
    patterns: [
      /aliexpress\.(com|us)/,
      /s\.click\.aliexpress\.com/
    ]
  },
  {
    id: "walmart",
    name: "Walmart Affiliate",
    domain: "walmart.com",
    paramName: "wmlspartner",
    icon: "🏬",
    patterns: [
      /walmart\.com/,
      /walmart\.ca/
    ]
  },
  {
    id: "target",
    name: "Target Affiliate",
    domain: "target.com",
    paramName: "afid",
    icon: "🎯",
    patterns: [
      /target\.com/
    ]
  },
  {
    id: "shareasale",
    name: "ShareASale",
    domain: "shareasale.com",
    paramName: "afftrack",
    icon: "🤝",
    patterns: [
      /shareasale\.com/,
      /sas7\.net/
    ]
  },
  {
    id: "cj",
    name: "CJ Affiliate",
    domain: "commission-junction.com",
    paramName: "PID",
    icon: "🔗",
    patterns: [
      /commission-junction\.com/,
      /cj\.com/,
      /tkqlhce\.com/,
      /dpbolvw\.net/
    ]
  },
  {
    id: "impact",
    name: "Impact",
    domain: "impact.com",
    paramName: "irclickid",
    icon: "📈",
    patterns: [
      /impact\.com/,
      /impact-affiliate\.com/
    ]
  },
  {
    id: "flexoffers",
    name: "FlexOffers",
    domain: "flexoffers.com",
    paramName: "fobs",
    icon: "💼",
    patterns: [
      /flexoffers\.com/,
      /flexlnk\.com/
    ]
  }
]

export const getProgramById = (id: string): AffiliateProgram | undefined => {
  return AFFILIATE_PROGRAMS.find(program => program.id === id)
}

export const getProgramByDomain = (domain: string): AffiliateProgram | undefined => {
  return AFFILIATE_PROGRAMS.find(program => {
    // First check simple domain match for backward compatibility
    if (domain.includes(program.domain)) {
      return true
    }
    
    // Then check regex patterns for more precise matching
    if (program.patterns) {
      return program.patterns.some(pattern => pattern.test(domain))
    }
    
    return false
  })
}

export const getProgramByUrl = (url: string): AffiliateProgram | undefined => {
  try {
    const parsedUrl = new URL(url)
    return getProgramByDomain(parsedUrl.hostname.toLowerCase())
  } catch {
    return undefined
  }
}

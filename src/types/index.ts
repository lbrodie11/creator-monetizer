
export interface AffiliateProgram {
  id: string
  name: string
  domain: string
  paramName: string
  icon?: string
  patterns?: RegExp[]
}

export interface UserAffiliateSettings {
  [programId: string]: string
}

export interface LinkConversion {
  id: string
  originalUrl: string
  affiliateUrl: string
  program: string
  timestamp: number
  domain: string
}

export interface User {
  uid: string
  email: string
  displayName?: string
  affiliateSettings: UserAffiliateSettings
  isPro: boolean
  createdAt: number
}

export interface ConversionResult {
  success: boolean
  originalUrl: string
  affiliateUrl?: string
  program?: string
  error?: string
}

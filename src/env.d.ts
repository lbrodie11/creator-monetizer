/// <reference types="vite/client" />

// Strongly-type the specific environment variables we use
interface ImportMetaEnv {
  readonly PLASMO_PUBLIC_FIREBASE_API_KEY: string
  readonly PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN: string
  readonly PLASMO_PUBLIC_FIREBASE_PROJECT_ID: string
  readonly PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET: string
  readonly PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
  readonly PLASMO_PUBLIC_FIREBASE_APP_ID: string
  readonly PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID: string
  readonly PLASMO_PUBLIC_USE_FIREBASE_EMULATOR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

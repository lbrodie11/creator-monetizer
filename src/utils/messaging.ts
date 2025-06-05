
export interface MessageRequest {
  action: string
  [key: string]: any
}

export interface MessageResponse {
  success: boolean
  data?: any
  error?: string
  user?: any
  affiliateUrl?: string
  program?: string
}

export const sendMessage = (message: MessageRequest): Promise<MessageResponse> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response || { success: false, error: "No response" })
    })
  })
}

export const MessageActions = {
  GET_SETTINGS: "GET_SETTINGS",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  CONVERT_URL: "CONVERT_URL",
  GET_USER_STATUS: "GET_USER_STATUS",
  LOG_CONVERSION: "LOG_CONVERSION",
  TOGGLE_ENABLED: "TOGGLE_ENABLED"
} as const

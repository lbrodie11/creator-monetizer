
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: [
    "*://*.google.com/*",
    "*://*.wordpress.com/*",
    "*://*.wordpress.org/*",
    "*://*.facebook.com/*",
    "*://*.twitter.com/*",
    "*://*.x.com/*",
    "*://*.linkedin.com/*",
    "*://*.medium.com/*",
    "*://*.substack.com/*",
    "*://*.notion.so/*",
    "*://*.docs.google.com/*"
  ],
  run_at: "document_idle"
}

class UrlConverter {
  private isEnabled = true
  private urlPattern = /https?:\/\/[^\s]+/g

  constructor() {
    this.init()
  }

  private async init() {
    // Check if extension is enabled
    const response = await this.sendMessage({ action: "GET_SETTINGS" })
    if (response?.success) {
      this.isEnabled = response.data?.isEnabled ?? true
      if (this.isEnabled) {
        this.setupEventListeners()
      }
    }
  }

  private setupEventListeners() {
    // Listen for paste events
    document.addEventListener("paste", this.handlePaste.bind(this), true)
    
    // Listen for input events in contenteditable elements
    document.addEventListener("input", this.handleInput.bind(this), true)
    
    // Use MutationObserver for dynamic content
    const observer = new MutationObserver(this.handleMutations.bind(this))
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }

  private async handlePaste(event: ClipboardEvent) {
    if (!this.isEnabled) return

    const clipboardData = event.clipboardData
    if (!clipboardData) return

    const pastedText = clipboardData.getData("text")
    if (!pastedText || !this.containsUrl(pastedText)) return

    // Small delay to let the paste complete
    setTimeout(() => {
      this.processUrls(event.target as Element)
    }, 100)
  }

  private async handleInput(event: Event) {
    if (!this.isEnabled) return

    const target = event.target as HTMLElement
    if (!target || !this.isEditableElement(target)) return

    // Debounce input processing
    clearTimeout((target as any).__urlConverterTimeout)
    ;(target as any).__urlConverterTimeout = setTimeout(() => {
      this.processUrls(target)
    }, 500)
  }

  private async handleMutations(mutations: MutationRecord[]) {
    if (!this.isEnabled) return

    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent || ""
            if (this.containsUrl(textContent)) {
              this.processUrls(node.parentElement)
            }
          }
        }
      }
    }
  }

  private containsUrl(text: string): boolean {
    return this.urlPattern.test(text)
  }

  private isEditableElement(element: HTMLElement): boolean {
    return (
      element.contentEditable === "true" ||
      element.tagName === "TEXTAREA" ||
      element.tagName === "INPUT" ||
      element.classList.contains("notranslate") || // Google Docs
      element.getAttribute("role") === "textbox"
    )
  }

  private async processUrls(element: Element | null) {
    if (!element) return

    const textNodes = this.getTextNodes(element)
    
    for (const textNode of textNodes) {
      const text = textNode.textContent || ""
      const urls = text.match(this.urlPattern)
      
      if (urls) {
        for (const url of urls) {
          await this.convertUrl(url, textNode)
        }
      }
    }
  }

  private getTextNodes(element: Element): Text[] {
    const textNodes: Text[] = []
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    )

    let node
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text)
    }

    return textNodes
  }

  private async convertUrl(url: string, textNode: Text) {
    try {
      const response = await this.sendMessage({
        action: "CONVERT_URL",
        url: url
      })

      if (response?.success && response.affiliateUrl) {
        // Replace the URL in the text node
        const newText = textNode.textContent?.replace(url, response.affiliateUrl)
        if (newText && newText !== textNode.textContent) {
          textNode.textContent = newText

          // Log the conversion
          this.sendMessage({
            action: "LOG_CONVERSION",
            conversion: {
              originalUrl: url,
              affiliateUrl: response.affiliateUrl,
              program: response.program,
              timestamp: Date.now(),
              domain: window.location.hostname
            }
          })

          // Show a subtle notification
          this.showConversionNotification(response.program)
        }
      }
    } catch (error) {
      console.error("Error converting URL:", error)
    }
  }

  private showConversionNotification(program: string) {
    // Create a subtle notification
    const notification = document.createElement("div")
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `
    notification.textContent = `✓ Link converted to ${program} affiliate`
    
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1"
    }, 10)
    
    // Remove after 2 seconds
    setTimeout(() => {
      notification.style.opacity = "0"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 2000)
  }

  private async sendMessage(message: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, resolve)
    })
  }
}

// Initialize the URL converter
new UrlConverter()

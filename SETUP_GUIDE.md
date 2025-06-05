# Creator Monetizer - Installation & Setup Guide

Creator Monetizer is a Chrome extension that automatically converts regular product URLs into affiliate links, helping content creators monetize their content effortlessly.

## Table of Contents
1. [Installation](#installation)
2. [Initial Setup](#initial-setup)
3. [Configuring Affiliate Programs](#configuring-affiliate-programs)
4. [Using the Extension](#using-the-extension)
5. [Dashboard & Analytics](#dashboard--analytics)
6. [Troubleshooting](#troubleshooting)

## Installation

### Option 1: From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "Creator Monetizer"
3. Click "Add to Chrome"
4. Confirm installation

### Option 2: Developer Mode (For Testing)
1. Download or clone the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `build/chrome-mv3-prod` folder
6. The extension will appear in your extensions list

## Initial Setup

### Step 1: Google Authentication
1. Click the Creator Monetizer icon in your Chrome toolbar
2. Click "Sign in with Google" 
3. Grant permissions to sync your settings
4. You'll be signed in and ready to configure affiliate programs

### Step 2: Basic Configuration
1. Right-click the extension icon and select "Options"
2. Or click "Configure Affiliate IDs" in the popup
3. You'll be taken to the options page where you can set up your affiliate programs

## Configuring Affiliate Programs

The extension supports multiple affiliate programs. Here's how to set up each one:

### Amazon Associates
1. **Get your Amazon Associate ID:**
   - Sign up at [associates.amazon.com](https://associates.amazon.com)
   - Your ID format: `yourname-20` (ends with country code)
2. **Enter in Creator Monetizer:**
   - Go to Options → Amazon Associates
   - Enter your ID (e.g., `johndoe-20`)

### eBay Partner Network
1. **Get your eBay Campaign ID:**
   - Sign up at [partnernetwork.ebay.com](https://partnernetwork.ebay.com)
   - Your ID is numeric (e.g., `5338177094`)
2. **Enter in Creator Monetizer:**
   - Go to Options → eBay Partner Network
   - Enter your campaign ID

### Booking.com Affiliate
1. **Get your Booking.com Affiliate ID:**
   - Apply at [partners.booking.com](https://partners.booking.com)
   - Your ID is numeric (e.g., `812345`)
2. **Enter in Creator Monetizer:**
   - Go to Options → Booking.com Affiliate
   - Enter your affiliate ID

### AliExpress Affiliate
1. **Get your AliExpress Affiliate ID:**
   - Sign up at [portals.aliexpress.com](https://portals.aliexpress.com)
   - Your ID format: `mm_12345678_0_0`
2. **Enter in Creator Monetizer:**
   - Go to Options → AliExpress Affiliate
   - Enter your tracking ID

### Walmart Affiliate
1. **Get your Walmart Partner ID:**
   - Apply through Commission Junction or Impact
   - Your ID format: `WL123456789`
2. **Enter in Creator Monetizer:**
   - Go to Options → Walmart Affiliate
   - Enter your partner ID

### Target Affiliate
1. **Get your Target Affiliate ID:**
   - Apply through their affiliate program
   - Your ID is alphanumeric
2. **Enter in Creator Monetizer:**
   - Go to Options → Target Affiliate
   - Enter your affiliate ID

## Using the Extension

### Automatic Link Conversion
Once configured, the extension automatically works on these platforms:
- **Google Docs** - Paste any supported URL and it converts automatically
- **WordPress Editor** - Works in both classic and Gutenberg editors
- **Social Media** - Facebook, Twitter, LinkedIn compose boxes
- **Email Clients** - Gmail, Outlook web apps
- **Any `contenteditable` field** - Most rich text editors

### How It Works
1. Copy a product URL (e.g., from Amazon, eBay, etc.)
2. Paste it into any supported editor
3. The extension automatically detects and converts the URL
4. You'll see a brief notification confirming the conversion
5. The link now includes your affiliate parameters

### Manual Control
- **Popup Toggle:** Click the extension icon to enable/disable auto-conversion
- **Per-Program Control:** Configure which programs are active in Options

## Dashboard & Analytics

### Viewing Conversions
1. Go to Options page
2. Scroll to "Recent Conversions" section
3. View your recent link conversions with timestamps

### Analytics Dashboard
- **Total Conversions:** See how many links you've converted
- **Program Breakdown:** View conversions by affiliate program
- **Recent Activity:** Track your most recent link conversions
- **Trends:** Monitor your affiliate link activity over time

## Troubleshooting

### Extension Not Converting Links
1. **Check if enabled:** Click extension icon, ensure toggle is ON
2. **Verify affiliate IDs:** Go to Options, check all IDs are correctly formatted
3. **Supported sites:** Ensure you're on a supported platform (Google Docs, etc.)
4. **Clear cache:** Try refreshing the page or restarting Chrome

### Validation Errors
The extension validates affiliate IDs:
- **Amazon:** Must end with country code (e.g., `-20`)
- **eBay:** Must be numeric
- **Booking.com:** Must be numeric
- **Others:** Must contain only letters, numbers, underscores, and hyphens

### Sign-in Issues
1. **Popup blockers:** Disable popup blockers for the extension
2. **Third-party cookies:** Ensure third-party cookies are enabled
3. **Clear data:** Try signing out and signing back in

### Performance Issues
1. **Too many conversions:** The extension is lightweight but try refreshing if slow
2. **Conflicting extensions:** Disable other URL-modifying extensions temporarily
3. **Memory usage:** Restart Chrome if experiencing issues

## Privacy & Security

### Data Collection
- **Affiliate IDs:** Stored securely in your Google account via Firebase
- **Conversion logs:** Tracked for analytics (URLs and timestamps only)
- **No personal data:** We don't collect or store personal browsing data

### Permissions
The extension requires:
- **Active tab:** To detect and convert URLs on current page
- **Storage:** To save your settings locally and in cloud
- **Host permissions:** To work on supported sites (Google Docs, social media, etc.)

## Support

### Getting Help
- **Documentation:** Check this guide first
- **GitHub Issues:** Report bugs on our GitHub repository
- **Email Support:** Contact us for account or technical issues

### Feature Requests
We're constantly improving Creator Monetizer. Submit feature requests through:
- GitHub Issues
- Email feedback
- Chrome Web Store reviews

## Advanced Usage

### Offline Mode
- Settings are cached locally for offline use
- When reconnected, changes sync to your Google account
- All conversions work without internet connection

### Multiple Devices
- Sign in with the same Google account on multiple devices
- Settings automatically sync across all installations
- Conversion history is shared between devices

### Custom Affiliate Programs
Contact us if you need support for additional affiliate programs. We're always adding new networks based on user demand.

---

**Creator Monetizer** - Effortless affiliate link conversion for content creators.

*Version 1.0 | Last updated: June 2025*

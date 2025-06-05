# Creator Monetizer - Testing Guide

This guide will help you manually test the Creator Monetizer Chrome extension to ensure all features work correctly.

## Prerequisites

1. **Chrome Browser** - Latest version recommended
2. **Built Extension** - Located in `build/chrome-mv3-prod/` directory
3. **Test Affiliate IDs** - Have valid affiliate IDs ready for testing

## Installation for Testing

### Step 1: Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Navigate to and select the `build/chrome-mv3-prod/` folder
5. The Creator Monetizer extension should now appear in your extensions list

### Step 2: Verify Installation
1. Look for the Creator Monetizer icon in the Chrome toolbar
2. If not visible, click the puzzle piece icon and pin Creator Monetizer
3. Verify the extension shows as "Enabled"

## Feature Testing Checklist

### 1. Popup Functionality ✅
**Test the extension popup interface**

1. **Open Popup**
   - Click the Creator Monetizer icon in toolbar
   - Popup should open with clean interface
   - Should show current status and quick actions

2. **Popup Content**
   - Verify all UI elements render correctly
   - Check for any console errors (F12 → Console tab)
   - Test responsive design at different sizes

### 2. Options Page ✅
**Test the comprehensive settings interface**

1. **Open Options**
   - Right-click extension icon → "Options"
   - OR navigate to `chrome://extensions/` → Creator Monetizer → "Extension options"
   - Should open in new tab with full interface

2. **Affiliate Program Configuration**
   - Test each affiliate program section:
     - Amazon Associates
     - eBay Partner Network
     - Booking.com Affiliate Partner
     - ShareASale
     - CJ Affiliate
     - Impact
     - FlexOffers

3. **Validation Testing**
   - Enter invalid affiliate IDs and verify error messages appear
   - Enter valid affiliate IDs and verify acceptance
   - Test specific validation rules:
     - **Amazon**: Must end with country code (e.g., `test-20`, `test-21`)
     - **eBay**: Must be numeric (e.g., `123456789`)
     - **Booking.com**: Must be numeric (e.g., `987654321`)

4. **Settings Persistence**
   - Save settings and refresh page
   - Verify settings are retained
   - Test with browser restart

### 3. URL Conversion ✅
**Test automatic link conversion on supported websites**

1. **Supported Sites**
   Test on these platforms:
   - Google Docs
   - WordPress.com/org
   - Facebook
   - Twitter/X
   - LinkedIn
   - Medium
   - Substack
   - Notion

2. **URL Conversion Tests**
   - **Amazon URLs**:
     - `https://amazon.com/dp/B08N5WRWNW`
     - `https://amzn.to/3ABC123` (short URL)
     - `https://amazon.co.uk/product-name/dp/B08N5WRWNW`
   
   - **eBay URLs**:
     - `https://ebay.com/itm/123456789`
     - `https://www.ebay.com/p/123456789`
   
   - **Booking.com URLs**:
     - `https://booking.com/hotel/example.html`
     - `https://www.booking.com/city/example.html`

3. **Conversion Process**
   - Paste URL into text field on supported site
   - Verify URL is automatically converted with your affiliate ID
   - Check that original URL structure is preserved
   - Ensure conversion happens quickly (< 1 second)

### 4. Background Script ✅
**Test extension lifecycle and background processes**

1. **Installation Handler**
   - Reinstall extension and verify welcome behavior
   - Check console for installation logs

2. **Update Handler**
   - Update extension version and test update behavior
   - Verify settings are preserved across updates

3. **Offline Support**
   - Disconnect internet and test basic functionality
   - Verify graceful degradation when offline

### 5. Storage Management ✅
**Test data persistence and sync capabilities**

1. **Local Storage**
   - Save settings and verify persistence
   - Test storage with various data types
   - Verify storage limits are handled gracefully

2. **Error Handling**
   - Test with corrupted storage data
   - Verify fallback to default settings
   - Check error recovery mechanisms

## Common Issues & Solutions

### Issue: Popup Not Opening
- **Solution**: Check manifest.json has `"default_popup": "popup.html"`
- **Solution**: Verify popup.html exists in build directory
- **Solution**: Check for JavaScript errors in extension console

### Issue: URL Conversion Not Working
- **Solution**: Verify you're on a supported website
- **Solution**: Check affiliate IDs are properly configured
- **Solution**: Ensure content script is loading (check Developer Tools)

### Issue: Settings Not Saving
- **Solution**: Check Chrome storage permissions
- **Solution**: Verify no storage quota issues
- **Solution**: Check for JavaScript errors in options page

### Issue: Validation Errors
- **Solution**: Ensure affiliate IDs match required format
- **Solution**: Check validation rules in documentation
- **Solution**: Verify network connectivity for real-time validation

## Advanced Testing

### Performance Testing
1. Test with large numbers of affiliate programs configured
2. Verify memory usage remains reasonable
3. Test conversion speed on various network conditions

### Security Testing
1. Verify no sensitive data is logged
2. Test with malicious URLs
3. Verify CSP compliance

### Browser Compatibility
1. Test on different Chrome versions
2. Verify on Chromium-based browsers (Edge, Brave)
3. Test various screen sizes and resolutions

## Reporting Issues

When reporting issues, include:
1. Chrome version
2. Extension version
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Screenshots (if applicable)

## Next Steps After Testing

1. **If All Tests Pass**: Ready for Chrome Web Store submission
2. **If Issues Found**: Document issues and fix before proceeding
3. **Performance Issues**: Optimize code and retest
4. **UI/UX Issues**: Refine interface and user experience

---

## Quick Test Commands

```bash
# Rebuild extension
npm run build

# Development build with hot reload
npm run dev

# Package for distribution
npm run package
```

Remember to test thoroughly as this extension handles financial affiliate links and user data!

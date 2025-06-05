# Firebase Authentication Setup for Chrome Extension

## Issue: `auth/unauthorized-domain` Error

When you see this error, it means Firebase doesn't recognize your Chrome extension's domain as authorized for authentication.

## Solution Steps

### 1. Get Your Extension ID

1. Load your extension in Chrome (chrome://extensions/)
2. Copy the Extension ID (it looks like: `abcdefghijklmnopqrstuvwxyz123456`)
3. The full domain will be: `chrome-extension://abcdefghijklmnopqrstuvwxyz123456`

### 2. Add Domain to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add these domains:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - `chrome-extension://YOUR_EXTENSION_ID` (replace with your actual extension ID)

### 3. Current Extension Configuration

The extension is now configured to use:
- `firebase/auth/web-extension` module (Chrome extension compatible)
- `offscreen` permission for complex auth flows
- Secure CSP that doesn't allow external scripts

### 4. Authentication Flow

1. **Popup**: Click "Sign in with Google" → Opens options page
2. **Options Page**: Handles the actual authentication with Firebase
3. **Communication**: Options page notifies popup when auth completes

### 5. Testing

After adding your extension ID to Firebase authorized domains:
1. Reload the extension in Chrome
2. Click the extension icon
3. Click "Sign in with Google"
4. Complete authentication in the options page
5. Extension should now work with your Firebase account

## Important Notes

- The extension ID changes each time you load an unpacked extension
- For published extensions, the ID remains constant
- Make sure to use the web-extension specific Firebase auth module
- External scripts (like Google APIs) are blocked by Chrome's CSP in extensions

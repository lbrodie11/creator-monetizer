// Simple JavaScript offscreen authentication handler
// This file handles Firebase authentication in the offscreen document context

let firebaseApp = null;
let firebaseAuth = null;

// Initialize Firebase dynamically when needed
async function initializeFirebase() {
  if (firebaseApp && firebaseAuth) {
    return; // Already initialized
  }

  try {
    // Get Firebase configuration from background script
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "GET_FIREBASE_CONFIG" }, resolve);
    });

    if (!response.success || !response.config) {
      throw new Error("Failed to get Firebase configuration from background script");
    }

    // Import Firebase modules dynamically
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js");
    const { getAuth, signInWithPopup, GoogleAuthProvider, signOut } = await import("https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js");

    // Initialize Firebase with config from background script
    firebaseApp = initializeApp(response.config);
    firebaseAuth = getAuth(firebaseApp);

    // Store auth functions globally for use
    window.firebaseSignInWithPopup = signInWithPopup;
    window.firebaseGoogleAuthProvider = GoogleAuthProvider;
    window.firebaseSignOut = signOut;

    console.log("Firebase initialized successfully in offscreen document");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    throw error;
  }
}

// Handle sign in
async function handleSignIn() {
  try {
    await initializeFirebase();
    
    const provider = new window.firebaseGoogleAuthProvider();
    const result = await window.firebaseSignInWithPopup(firebaseAuth, provider);
    
    // Send success message to background script
    chrome.runtime.sendMessage({
      type: "AUTH_SUCCESS",
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      }
    });
    
    return result.user;
  } catch (error) {
    console.error("Sign in error:", error);
    chrome.runtime.sendMessage({
      type: "AUTH_ERROR",
      error: error.message
    });
    throw error;
  }
}

// Handle sign out
async function handleSignOut() {
  try {
    await initializeFirebase();
    await window.firebaseSignOut(firebaseAuth);
    
    chrome.runtime.sendMessage({ type: "SIGN_OUT_SUCCESS" });
  } catch (error) {
    console.error("Sign out error:", error);
    chrome.runtime.sendMessage({
      type: "SIGN_OUT_ERROR", 
      error: error.message
    });
    throw error;
  }
}

// Listen for messages from the extension service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.cmd === "SIGN_IN") {
    handleSignIn()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }

  if (message.cmd === "SIGN_OUT") {
    handleSignOut()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

console.log("Offscreen authentication handler loaded and ready");

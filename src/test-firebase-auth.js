/**
 * Chrome Extension Authentication Test Script
 * 
 * This script tests the Firebase Web Extension authentication implementation
 * Run this in the browser console when the extension is loaded
 */

// Test 1: Check if Chrome APIs are available
function testChromeAPIs() {
  console.log('🧪 Testing Chrome APIs...');
  
  const results = {
    runtime: !!chrome?.runtime,
    identity: !!chrome?.identity,
    storage: !!chrome?.storage,
    extensionId: chrome?.runtime?.id || 'Not available'
  };
  
  console.log('Chrome API Results:', results);
  return results;
}

// Test 2: Test Chrome Identity API
function testChromeIdentity() {
  console.log('🧪 Testing Chrome Identity API...');
  
  return new Promise((resolve, reject) => {
    if (!chrome?.identity) {
      reject(new Error('Chrome Identity API not available'));
      return;
    }
    
    chrome.identity.getAuthToken({
      interactive: false, // Non-interactive first
      scopes: ['email', 'profile', 'openid']
    }, (token) => {
      if (chrome.runtime.lastError) {
        console.log('Non-interactive auth failed (expected):', chrome.runtime.lastError.message);
        
        // Try interactive
        chrome.identity.getAuthToken({
          interactive: true,
          scopes: ['email', 'profile', 'openid']
        }, (interactiveToken) => {
          if (chrome.runtime.lastError) {
            reject(new Error(`Interactive auth failed: ${chrome.runtime.lastError.message}`));
          } else if (interactiveToken) {
            console.log('✅ Chrome Identity Token received');
            resolve({ token: interactiveToken.substring(0, 20) + '...' });
          } else {
            reject(new Error('No token received'));
          }
        });
      } else if (token) {
        console.log('✅ Chrome Identity Token received (cached)');
        resolve({ token: token.substring(0, 20) + '...' });
      }
    });
  });
}

// Test 3: Test Firebase Web Extension Module
async function testFirebaseWebExtension() {
  console.log('🧪 Testing Firebase Web Extension...');
  
  try {
    // Test dynamic imports
    const firebaseApp = await import('firebase/app');
    const firebaseAuth = await import('firebase/auth/web-extension');
    
    console.log('✅ Firebase modules imported successfully');
    
    // Test if we can create auth instance
    const app = firebaseApp.initializeApp({
      apiKey: 'test-key',
      authDomain: 'test.firebaseapp.com',
      projectId: 'test-project'
    });
    
    const auth = firebaseAuth.getAuth(app);
    
    console.log('✅ Firebase auth instance created');
    
    return {
      modulesLoaded: true,
      authInstance: !!auth,
      currentUser: auth.currentUser
    };
    
  } catch (error) {
    console.error('❌ Firebase Web Extension Error:', error);
    throw error;
  }
}

// Test 4: Test Full Authentication Flow (with real Firebase config)
async function testFullAuthFlow() {
  console.log('🧪 Testing Full Authentication Flow...');
  
  try {
    // This would use the real UserService
    console.log('Note: This requires real Firebase configuration');
    console.log('Extension ID needed for Firebase authorized domains');
    
    return {
      message: 'Ready for full test with real Firebase config',
      extensionId: chrome?.runtime?.id
    };
    
  } catch (error) {
    console.error('❌ Full Auth Flow Error:', error);
    throw error;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🌸 Starting Firebase Web Extension Tests for Studio Ghibli Creator Monetizer 🍃');
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };
  
  try {
    // Test 1: Chrome APIs
    results.tests.chromeAPIs = testChromeAPIs();
    
    // Test 2: Chrome Identity
    try {
      results.tests.chromeIdentity = await testChromeIdentity();
    } catch (error) {
      results.tests.chromeIdentity = { error: error.message };
    }
    
    // Test 3: Firebase Web Extension
    try {
      results.tests.firebaseWebExtension = await testFirebaseWebExtension();
    } catch (error) {
      results.tests.firebaseWebExtension = { error: error.message };
    }
    
    // Test 4: Full Auth Flow
    try {
      results.tests.fullAuthFlow = await testFullAuthFlow();
    } catch (error) {
      results.tests.fullAuthFlow = { error: error.message };
    }
    
    console.log('🎉 Test Results:', results);
    
    // Summary
    const passed = Object.values(results.tests).filter(test => !test.error).length;
    const total = Object.keys(results.tests).length;
    
    console.log(`\n📊 Summary: ${passed}/${total} tests passed`);
    
    if (results.tests.chromeAPIs.extensionId) {
      console.log(`\n🔑 Extension ID: ${results.tests.chromeAPIs.extensionId}`);
      console.log(`📝 Add this to Firebase: chrome-extension://${results.tests.chromeAPIs.extensionId}`);
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Test runner error:', error);
    return { error: error.message };
  }
}

// Auto-run tests when script loads
console.log('🚀 Firebase Web Extension Test Script Loaded');
console.log('Run runAllTests() to start testing');

// Export functions for manual testing
window.creatorMonetizer_TestSuite = {
  runAllTests,
  testChromeAPIs,
  testChromeIdentity,
  testFirebaseWebExtension,
  testFullAuthFlow
};

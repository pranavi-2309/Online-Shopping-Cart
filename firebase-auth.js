// ========== Firebase Authentication Module ==========
// Import Firebase SDK modules (CDN version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// FIREBASE_CONFIG_PLACEHOLDER
// Paste your Firebase config here from Firebase Console (Project Settings → SDK snippet)
const firebaseConfig = {
  apiKey: "AIzaSyAWWGmjkbcr1MHyuPArD0jxrduV_HoI73k",
  authDomain: "shop-kart-f6dc9.firebaseapp.com",
  projectId: "shop-kart-f6dc9",
  storageBucket: "shop-kart-f6dc9.firebasestorage.app",
  messagingSenderId: "735893894066",
  appId: "1:735893894066:web:733ee940c9820575126aab"
};

// Initialize Firebase
let app;
let auth;
let provider;
let isFirebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  
  // Configure provider
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  isFirebaseInitialized = true;
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  isFirebaseInitialized = false;
}

// UI elements (will be available after DOM loads)
let signInBtn;
let signUpBtn;
let userProfileBtn;

// Initialize UI elements after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  signInBtn = document.getElementById('google-signin-btn');
  signUpBtn = document.getElementById('google-signup-btn');
  userProfileBtn = document.getElementById('user-profile-btn');
  
  // Notify that Firebase is ready
  if (isFirebaseInitialized) {
    window.dispatchEvent(new CustomEvent('firebaseReady'));
    console.log('🔥 Firebase is ready for authentication');
  }
});

/**
 * Sign in with Google using popup (with fallback to redirect for unauthorized domain errors)
 */
async function loginWithGoogle() {
  // Check if Firebase is initialized
  if (!isFirebaseInitialized) {
    alert('Firebase authentication is loading. Please try again in a moment.');
    console.error('Firebase not initialized yet');
    return;
  }
  
  try {
    console.log('🔄 Starting Google sign-in...');
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Google sign-in success:', user.email);
    
    // Store user info in window for existing script.js to use
    window.firebaseUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    
    // Send user data to backend MongoDB
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        })
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ User saved to MongoDB:', data.user);
      } else {
        console.error('❌ Backend error:', data.error);
      }
    } catch (backendErr) {
      console.error('❌ Failed to connect to backend:', backendErr);
      console.warn('⚠️ Make sure backend server is running');
      // Continue even if backend fails - user can still use the app
    }
    
    // Trigger custom event for script.js to handle
    window.dispatchEvent(new CustomEvent('firebaseAuthSuccess', {
      detail: window.firebaseUser
    }));
    
  } catch (err) {
    console.error('❌ Google Sign-In Error:', err);
    
    // Handle unauthorized domain error - fallback to redirect method
    if (err.code === 'auth/unauthorized-domain') {
      console.log('Unauthorized domain detected, trying redirect method...');
      alert('⚠️ Domain not authorized. Redirecting to Google Sign-In...\n\nIf this fails, add your domain to Firebase Console:\nAuthentication → Settings → Authorized domains');
      try {
        await signInWithRedirect(auth, provider);
        return; // User will be redirected
      } catch (redirectErr) {
        console.error('Redirect sign-in also failed:', redirectErr);
        alert('❌ Sign-in failed. Please add your domain to Firebase authorized domains:\n\n' +
              'Firebase Console → Authentication → Settings → Authorized domains\n' +
              'Add: ' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''));
        return;
      }
    }
    
    // Handle specific error cases
    if (err.code === 'auth/popup-closed-by-user') {
      console.warn('⚠️ Sign-in cancelled by user');
      return; // Don't show alert for user cancellation
    }
    
    if (err.code === 'auth/network-request-failed') {
      alert('❌ Network error. Please check your internet connection and try again.');
      return;
    }
    
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
      console.warn('⚠️ Popup unavailable, switching to redirect sign-in');
      try {
        await signInWithRedirect(auth, provider);
        return; // User will be redirected
      } catch (redirectErr) {
        console.error('Redirect sign-in failed:', redirectErr);
        alert('❌ Google sign-in could not open a popup, and redirect sign-in also failed. Please try again.');
        return;
      }
    }
    
    // General error
    alert('❌ Sign-in error: ' + (err.message || 'Unknown error. Please check the console for details.'));
  }
}

/**
 * Sign out current user
 */
async function logout() {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
    
    // Clear stored user data
    window.firebaseUser = null;
    
    // Trigger custom event for script.js to handle
    window.dispatchEvent(new CustomEvent('firebaseAuthSignOut'));
    
    alert('You have been logged out successfully');
    
  } catch (err) {
    console.error('Sign-out error:', err);
    alert('Sign-out error: ' + (err.message || 'Unknown error.'));
  }
}

/**
 * Check for redirect result on page load
 */
if (isFirebaseInitialized) {
  getRedirectResult(auth)
    .then(async (result) => {
      if (result) {
        const user = result.user;
        console.log('✅ Redirect sign-in success:', user.email);
        
        // Store user info
        window.firebaseUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        };
        
        // Send user data to backend MongoDB
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL
            })
          });
          
          const data = await response.json();
          if (data.success) {
            console.log('✅ User saved to MongoDB:', data.user);
          }
        } catch (backendErr) {
          console.error('❌ Failed to connect to backend:', backendErr);
        }
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('firebaseAuthSuccess', {
          detail: window.firebaseUser
        }));
      }
    })
    .catch((err) => {
      console.error('❌ Redirect result error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        alert('❌ Domain authorization error.\n\nPlease add to Firebase Console:\nAuthentication → Settings → Authorized domains\n\nAdd: ' +
              window.location.hostname + (window.location.port ? ':' + window.location.port : ''));
      }
    });
}

/**
 * Monitor authentication state changes
 */
if (isFirebaseInitialized) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✅ User is signed in:', user.email);
      
      // Store user info globally
      window.firebaseUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      };
      
      // Update UI elements if they exist
      if (userProfileBtn) {
        // Add user photo to profile button if available
        if (user.photoURL) {
          userProfileBtn.innerHTML = `<img src="${user.photoURL}" alt="Profile" style="width:32px; height:32px; border-radius:50%;">`;
          userProfileBtn.title = user.displayName || user.email;
        }
      }
      
      // Trigger event for existing code
      window.dispatchEvent(new CustomEvent('firebaseAuthStateChanged', {
        detail: { user: window.firebaseUser, isSignedIn: true }
      }));
      
    } else {
      console.log('ℹ️ User is signed out');
      window.firebaseUser = null;
      
      // Reset profile button
      if (userProfileBtn) {
        userProfileBtn.innerHTML = '<i class="fas fa-user"></i>';
        userProfileBtn.title = 'Login / Sign Up';
      }
      
      // Trigger event for existing code
      window.dispatchEvent(new CustomEvent('firebaseAuthStateChanged', {
        detail: { user: null, isSignedIn: false }
      }));
    }
  });
}

// Expose functions globally for use in existing script.js
window.loginWithGoogle = loginWithGoogle;
window.firebaseLogout = logout;
window.firebaseAuth = auth;

console.log('Firebase Authentication module loaded successfully');

# Firebase Setup for Google Sign-In

This project uses **Firebase Authentication** for real Google Sign-In integration.

## Prerequisites

You need to have:
- A Google account
- Internet connection
- A modern browser (Chrome, Firefox, Edge, Safari)

---

## Step-by-Step Setup Instructions

### 1. Create a Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., `shop-kart`)
4. Accept terms and click **Continue**
5. (Optional) Enable Google Analytics or skip
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

---

### 2. Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter an **App nickname** (e.g., `ShopKart Web App`)
3. **Do NOT check** "Also set up Firebase Hosting" (unless you want hosting)
4. Click **Register app**
5. You'll see a `firebaseConfig` object with your API keys

**Copy the entire `firebaseConfig` object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

6. Click **Continue to console**

---

### 3. Replace Firebase Config in Your Code

1. Open the file: **`firebase-auth.js`**
2. Find the section marked with `// FIREBASE_CONFIG_PLACEHOLDER`
3. **Replace** the existing `firebaseConfig` object with the one you copied from Firebase Console
4. Save the file

**Before:**
```javascript
// FIREBASE_CONFIG_PLACEHOLDER
const firebaseConfig = {
  apiKey: "AIzaSyAWWGmjkbcr1MHyuPArD0jxrduV_HoI73k",
  authDomain: "shop-kart-f6dc9.firebaseapp.com",
  // ... existing placeholder config
};
```

**After:**
```javascript
// FIREBASE_CONFIG_PLACEHOLDER
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  // ... your actual config from Firebase Console
};
```

---

### 4. Enable Google Sign-In Provider

1. In Firebase Console, go to **Authentication** (from left sidebar)
2. Click **"Get started"** (if this is your first time)
3. Click the **"Sign-in method"** tab
4. Find **Google** in the list of providers
5. Click on **Google** to expand
6. Toggle **Enable** switch to ON
7. Select a **Support email** (your email)
8. Click **Save**

---

### 5. Add Authorized Domain

1. Still in **Authentication** → **Settings** tab
2. Scroll down to **"Authorized domains"**
3. You should see `localhost` already listed
4. If `localhost` is not there:
   - Click **"Add domain"**
   - Enter `localhost`
   - Click **Add**

**Note:** When deploying to production, add your production domain here (e.g., `yoursite.com`)

---

### 6. Test Locally

1. Start a local development server:
   - **Using Live Server (VS Code extension):** Right-click `index.html` → "Open with Live Server"
   - **Using Python:** `python -m http.server 8000`
   - **Using Node.js:** `npx http-server -p 8000`

2. Open your browser to:
   - `http://localhost:5500` (Live Server default)
   - `http://localhost:8000` (if using Python/Node.js)

3. Click **"Shop Now"** button

4. Click **"Continue with Google"** in the login modal

5. **Expected behavior:**
   - Google sign-in popup appears
   - Select your Google account
   - Grant permissions
   - You should be signed in and see your name/photo
   - You'll be redirected to the shopping section

---

## Troubleshooting

### Issue: "Firebase authentication is loading"
**Solution:** Wait 2-3 seconds after page load, then try again. The Firebase SDK needs time to initialize.

### Issue: Pop-up blocked
**Solution:** Allow pop-ups for localhost in your browser settings.

### Issue: "auth/unauthorized-domain"
**Solution:** Make sure you added your domain (e.g., `localhost`) to Authorized domains in Firebase Console.

### Issue: Network error
**Solution:** Check your internet connection. Firebase requires an active connection.

### Issue: Sign-in works but user data not showing
**Solution:** Check browser console (F12) for errors. Make sure `script.js` is loading after `firebase-auth.js`.

---

## Verify Your Setup

1. Open **Firebase Console** → **Authentication** → **Users** tab
2. Sign in to your app with Google
3. Your email should appear in the Users list within seconds

---

## Security Notes

⚠️ **IMPORTANT:**
- **Never commit your `firebaseConfig` to public GitHub repos** - While the config is not a secret, it's best practice to use environment variables in production
- The `apiKey` in `firebaseConfig` is safe to expose client-side (it's not a secret key)
- Firebase Security Rules protect your backend data, not the config
- For production apps, set up proper Firebase Security Rules

---

## Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

## Need Help?

If you encounter issues:
1. Check the browser console (F12 → Console tab) for error messages
2. Verify all steps above are completed
3. Make sure your Firebase project has the Google provider enabled
4. Ensure `localhost` is in your authorized domains

---

**That's it! You're ready to use Google Sign-In in your ShopKart application. 🎉**

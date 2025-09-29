# 🚀 Quick Firebase Setup for HeavenKeys Chords Finder

## Option 1: If you already have a Firebase project

1. **Go to your Firebase Console**: https://console.firebase.google.com/
2. **Select your existing project**
3. **Go to Project Settings** (gear icon) → **General** tab
4. **Scroll down to "Your apps"** section
5. **Click "Add app"** → **Web app** (</> icon)
6. **Register your app** with nickname: `chords-finder-web`
7. **Copy the Firebase configuration** and paste it below

## Option 2: Create a new Firebase project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Enter project name**: `heavenkeys-chords-finder`
4. **Enable Google Analytics**: Yes (recommended)
5. **Click "Create project"**
6. **Follow steps 3-7 from Option 1**

## After getting your Firebase config:

1. **Enable Authentication**:
   - Go to **Authentication** → **Sign-in method**
   - Click **Email/Password** → **Enable**

2. **Create Firestore Database**:
   - Go to **Firestore Database** → **Create database**
   - Choose **"Start in test mode"**
   - Select a location close to your users

3. **Update your .env.local file** with your Firebase config

## Your Firebase config should look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## Test your setup:

1. Run: `npm run dev`
2. Visit: `http://localhost:3000/firebase-test`
3. Try registering a user at: `http://localhost:3000/register`

## Need help?

- Your app is already configured for Firebase
- Just need to add your Firebase project credentials
- All authentication and database code is ready!

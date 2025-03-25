# Firebase Setup Guide for X57

## Google Authentication Setup

The `auth/configuration-not-found` error typically occurs when OAuth configuration isn't properly set up in Firebase. Here's how to fix it:

1. **Go to the Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: x57designs-acc0e
3. **Navigate to Authentication**: In the left sidebar menu, click on "Authentication"
4. **Go to Sign-in methods**: Click on the "Sign-in method" tab
5. **Enable Google Authentication**:
   - Find Google in the list of providers and click the edit icon (pencil)
   - Toggle the "Enable" switch to on
   - Configure the provider:
     - Set a Project public-facing name (e.g., "X57 Designs")
     - Choose Project support email (use your email)
   - Click "Save"

6. **Add Authorized Domains**:
   - In the Authentication section, click on the "Settings" tab
   - Scroll to "Authorized domains"
   - Add all domains where your app will run, including:
     - localhost (for development)
     - Your production domain (e.g., x57designs.com)
   - Click "Add domain" to save each

7. **Update OAuth Consent Screen** (in Google Cloud Console):
   - Go to Google Cloud Console: https://console.cloud.google.com/
   - Select your Firebase project
   - Navigate to "APIs & Services" > "OAuth consent screen"
   - Add testing users if in development
   - Publish the app when ready for production

## Troubleshooting Common Issues

1. **Correctly set up environment variables**:
   Make sure all Firebase config values in `.env` are correct

2. **Enable cross-domain messaging**:
   If using iframe authentication, enable it in the Firebase Console Authentication settings

3. **Check browser console**:
   Look for specific error messages beyond just "configuration-not-found"

4. **Enable debug mode**:
   Add this before initializing Firebase:
   ```js
   window.localStorage.setItem('debug', 'firebase:*');
   ```

5. **API Restrictions**:
   Make sure the Firebase API key doesn't have any restrictions that block OAuth operations

## Production Deployment Checklist

- [ ] Enable Google Authentication in Firebase Console
- [ ] Add all production domains to Authorized Domains
- [ ] Complete OAuth consent screen information
- [ ] Set CORS configurations for storage if using Firebase Storage
- [ ] Deploy Firebase rules files using Firebase CLI
- [ ] Test authentication flow in production environment

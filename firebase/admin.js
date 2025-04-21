import { getApps, initializeApp, cert } from 'firebase-admin/app';

/**
 * Initialize Firebase Admin SDK
 * This is used for server-side operations like verifying session cookies
 */
export function initializeAdminApp() {
  const apps = getApps();
  if (apps.length > 0) {
    // Return the existing app if it's already initialized
    return apps[0];
  }

  // Initialize the app with service account credentials
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
} 
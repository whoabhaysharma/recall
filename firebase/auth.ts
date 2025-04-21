import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  User,
  getIdToken
} from 'firebase/auth';
import { auth } from './config';

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with user's name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Create session cookie
      await createSession(userCredential.user);
    }
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message || 'An error occurred during signup' };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Create session cookie
    if (userCredential.user) {
      await createSession(userCredential.user);
    }
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message || 'Invalid email or password' };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Create session cookie
    if (userCredential.user) {
      await createSession(userCredential.user);
    }
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message || 'An error occurred during Google sign in' };
  }
};

// Create a session cookie on the server
async function createSession(user: User) {
  try {
    // Get the ID token
    const idToken = await getIdToken(user);
    
    // Send token to server to create a session
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    // Add a small delay to ensure the cookie is fully registered before other API calls
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error creating session:', error);
    return false;
  }
}

// Sign out and clear the session
export const signOut = async () => {
  try {
    // First clear the server-side session
    await fetch('/api/auth/session', { method: 'DELETE' });
    
    // Then sign out from Firebase
    await firebaseSignOut(auth);
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'An error occurred during sign out' };
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null, success: true };
  } catch (error: any) {
    return { error: error.message || 'An error occurred while sending password reset email', success: false };
  }
};

// Resend verification email
export const resendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return { error: null, success: true };
  } catch (error: any) {
    return { error: error.message || 'An error occurred while sending verification email', success: false };
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const listenToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 
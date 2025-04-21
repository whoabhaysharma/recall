import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initializeAdminApp } from '../../../../firebase/admin';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
const firebaseAdmin = initializeAdminApp();

// Session cookie expiration (14 days in milliseconds)
// Must be between 5 minutes and 2 weeks (in milliseconds)
const SESSION_EXPIRATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
const SESSION_EXPIRATION_SECONDS = 14 * 24 * 60 * 60; // 14 days in seconds for cookie maxAge

/**
 * POST /api/auth/session - Create a new session
 * Takes an ID token from the client and creates a session cookie
 */
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'Missing ID token' },
        { status: 400 }
      );
    }
    
    // Create a session cookie using the ID token
    const adminAuth = getAuth(firebaseAdmin);
    const sessionCookie = await adminAuth.createSessionCookie(
      idToken,
      { expiresIn: SESSION_EXPIRATION_MS } // Value in milliseconds between 5 min and 2 weeks
    );
    
    // Set the cookie in the response
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'session',
      value: sessionCookie,
      maxAge: SESSION_EXPIRATION_SECONDS, // Value in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 401 }
    );
  }
}

/**
 * DELETE /api/auth/session - Remove the session
 * Clears the session cookie
 */
export async function DELETE() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete('session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
} 
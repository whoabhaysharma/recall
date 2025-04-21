import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { initializeAdminApp } from '../../../../firebase/admin';

// Initialize Firebase Admin
const firebaseAdmin = initializeAdminApp();

/**
 * GET /api/auth/verify - Verify if the user is authenticated
 * Used on the client side to verify token validity
 */
export async function GET() {
  try {
    // Get the session token from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'No session cookie found'
        },
        { status: 401 }
      );
    }
    
    try {
      // Verify the session cookie
      const decodedClaims = await getAuth(firebaseAdmin).verifySessionCookie(
        sessionCookie, 
        // Set checkRevoked to true to check if the session has been revoked
        true
      );
      
      return NextResponse.json({
        authenticated: true,
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        emailVerified: decodedClaims.email_verified
      });
    } catch (error) {
      console.error('Session verification error:', error);
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'Invalid session token'
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        message: 'Server error during verification'
      }, 
      { status: 500 }
    );
  }
} 
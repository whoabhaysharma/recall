/**
 * API Routes for toggling the pinned status of a note
 */
import { NextResponse } from "next/server";
import { updatePinStatus } from "../../../../../db/operations/noteOperations";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { initializeAdminApp } from "../../../../../firebase/admin";

// Initialize Firebase Admin
const firebaseAdmin = initializeAdminApp();

/**
 * Helper function to get the current user ID from the session token
 * @returns {Promise<string|null>} - The user ID or null if not authenticated
 */
async function getCurrentUserId() {
  try {
    // Get the session token from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return null;
    }
    
    // Verify the session cookie and get the user ID
    const decodedClaims = await getAuth(firebaseAdmin).verifySessionCookie(sessionCookie);
    return decodedClaims.uid;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * PATCH /api/notes/[id]/pin - Toggle the pinned status of a note
 */
export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing note ID" },
        { status: 400 }
      );
    }
    
    if (body.pinned === undefined) {
      return NextResponse.json(
        { error: "Missing 'pinned' field in request body" },
        { status: 400 }
      );
    }
    
    if (typeof body.pinned !== "boolean") {
      return NextResponse.json(
        { error: "'pinned' must be a boolean" },
        { status: 400 }
      );
    }
    
    // Get the current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Update pin status
    const updatedNote = await updatePinStatus(id, userId, body.pinned);
    
    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: `Note ${body.pinned ? 'pinned' : 'unpinned'} successfully`,
      note: updatedNote
    });
  } catch (error) {
    console.error(`❌ Error updating pin status for note ${params?.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update pin status" },
      { status: 500 }
    );
  }
} 
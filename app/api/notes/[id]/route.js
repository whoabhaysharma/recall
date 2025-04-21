/**
 * API Routes for individual note operations
 * Handles GET, PATCH, DELETE operations on a specific note
 */
import { NextResponse } from "next/server";
import { getNoteById, updateNote, deleteNote } from "../../../../db/operations/noteOperations";
import { validateNote } from "../../../../db/schemas/note";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { initializeAdminApp } from "../../../../firebase/admin";

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
 * GET /api/notes/[id] - Get a specific note by ID
 */
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing note ID" },
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
    
    const note = await getNoteById(id, userId);
    
    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(note);
  } catch (error) {
    console.error(`❌ Error fetching note ${params?.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notes/[id] - Update a specific note by ID
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
    
    // Get the current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if note exists and belongs to the user
    const existingNote = await getNoteById(id, userId);
    if (!existingNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }
    
    // If content is being updated, validate it
    if (body.content !== undefined) {
      const validation = validateNote({ content: body.content });
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }
    
    // Update note
    const updatedNote = await updateNote(id, userId, body);
    
    return NextResponse.json({
      message: "Note updated successfully",
      note: updatedNote
    });
  } catch (error) {
    console.error(`❌ Error updating note ${params?.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notes/[id] - Delete a specific note by ID
 */
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing note ID" },
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
    
    const success = await deleteNote(id, userId);
    
    if (!success) {
      return NextResponse.json(
        { error: "Note not found or could not be deleted" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error(`❌ Error deleting note ${params?.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
} 
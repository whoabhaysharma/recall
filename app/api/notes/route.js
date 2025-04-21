/**
 * API Routes for notes collection
 * Handles GET (list), POST (create)
 */
import { NextResponse } from "next/server";
import { createNote, getAllNotes } from "../../../db/operations/noteOperations";
import { validateNote } from "../../../db/schemas/note";
import { auth } from "../../../firebase/config";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { initializeAdminApp } from "../../../firebase/admin";

// Initialize Firebase Admin
const firebaseAdmin = initializeAdminApp();

/**
 * Helper function to get the current user ID from the session token
 * @param {Request} request - The Next.js request object
 * @returns {Promise<string|null>} - The user ID or null if not authenticated
 */
async function getCurrentUserId(request) {
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
 * GET /api/notes - Get all notes with pagination
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Notes per page (default: 20)
 */
export async function GET(request) {
  try {
    // Get the current user ID
    const userId = await getCurrentUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    
    // Validate parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter" },
        { status: 400 }
      );
    }
    
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid limit parameter (must be between 1 and 100)" },
        { status: 400 }
      );
    }
    
    // Get notes with pagination for the current user
    const result = await getAllNotes(userId, { page, limit });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notes - Create a new note
 */
export async function POST(request) {
  try {
    // Get the current user ID
    const userId = await getCurrentUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Missing 'content' in request body" },
        { status: 400 }
      );
    }

    // Validate note
    const validation = validateNote({ content, userId });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create note in database with user ID
    const note = await createNote(content, userId);

    return NextResponse.json({
      message: "Note created successfully",
      note
    });
  } catch (error) {
    console.error("❌ Error creating note:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create note" },
      { status: 500 }
    );
  }
} 
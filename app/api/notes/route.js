/**
 * API Routes for notes collection
 * Handles GET (list), POST (create)
 */
import { NextResponse } from "next/server";
import { createNote, getAllNotes } from "../../../db/operations/noteOperations";
import { validateNote } from "../../../db/schemas/note";

/**
 * GET /api/notes - Get all notes
 */
export async function GET() {
  try {
    const notes = await getAllNotes();
    return NextResponse.json(notes);
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
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Missing 'content' in request body" },
        { status: 400 }
      );
    }

    // Validate note
    const validation = validateNote({ content });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create note in database
    const note = await createNote(content);

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
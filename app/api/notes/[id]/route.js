/**
 * API Routes for individual note operations
 * Handles GET, PATCH, DELETE operations on a specific note
 */
import { NextResponse } from "next/server";
import { getNoteById, updateNote, deleteNote } from "../../../../db/operations/noteOperations";
import { validateNote } from "../../../../db/schemas/note";

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
    
    const note = await getNoteById(id);
    
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
    
    // Check if note exists
    const existingNote = await getNoteById(id);
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
    const updatedNote = await updateNote(id, body);
    
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
    
    const success = await deleteNote(id);
    
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
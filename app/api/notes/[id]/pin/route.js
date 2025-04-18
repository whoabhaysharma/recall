/**
 * API Route for pinning/unpinning notes
 */
import { NextResponse } from "next/server";
import { getNoteById, updatePinStatus } from "../../../../../db/operations/noteOperations";

/**
 * PATCH /api/notes/[id]/pin - Update the pin status of a note
 */
export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    const { pinned } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing note ID" },
        { status: 400 }
      );
    }
    
    if (pinned === undefined) {
      return NextResponse.json(
        { error: "Missing 'pinned' field in request body" },
        { status: 400 }
      );
    }
    
    if (typeof pinned !== "boolean") {
      return NextResponse.json(
        { error: "The 'pinned' field must be a boolean" },
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
    
    // Update pin status
    const updatedNote = await updatePinStatus(id, pinned);
    
    return NextResponse.json({
      message: pinned ? "Note pinned successfully" : "Note unpinned successfully",
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
/**
 * Schema definition for Note objects
 * This file defines the structure and validation for notes in the application
 */

/**
 * Validates a note object to ensure it has all required fields and correct format
 * @param {Object} note - The note object to validate
 * @returns {Object} - Object containing validation result and optional error message
 */
export function validateNote(note) {
  if (!note) return { isValid: false, error: "Note cannot be null or undefined" };
  
  // Basic content validation
  if (!note.content || typeof note.content !== "string") {
    return { isValid: false, error: "Note must have content as a string" };
  }
  
  if (note.content.trim().length === 0) {
    return { isValid: false, error: "Note content cannot be empty" };
  }
  
  // Validate pinned if it exists
  if (note.pinned !== undefined && typeof note.pinned !== "boolean") {
    return { isValid: false, error: "Pinned status must be a boolean" };
  }
  
  // Validate userId if it exists
  if (note.userId !== undefined && typeof note.userId !== "string") {
    return { isValid: false, error: "User ID must be a string" };
  }
  
  return { isValid: true };
}

/**
 * Creates a new note object with default values
 * @param {string} content - The content of the note
 * @param {string} userId - The ID of the user creating the note
 * @returns {Object} - A new note object with default values
 */
export function createNoteObject(content, userId) {
  return {
    content: content.trim(),
    userId: userId,
    pinned: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Maps a database note to the response format
 * @param {Object} dbNote - The note object from the database
 * @returns {Object} - Formatted note for client response
 */
export function mapNoteToResponse(dbNote) {
  return {
    id: dbNote._id.toString(),
    content: dbNote.content,
    userId: dbNote.userId,
    pinned: dbNote.pinned || false,
    createdAt: dbNote.createdAt,
    updatedAt: dbNote.updatedAt
  };
}

/**
 * MongoDB collection name for notes
 */
export const NOTES_COLLECTION = "notes"; 
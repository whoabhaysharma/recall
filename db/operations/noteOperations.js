/**
 * Database operations for notes
 */
import { ObjectId } from "mongodb";
import { getDb } from "../mongo";
import { createNoteObject, mapNoteToResponse, NOTES_COLLECTION } from "../schemas/note";
import { generateEmbeddings } from "../../services/Ai";
import { upsertVector, deleteVector } from "../pinecone";

/**
 * Creates a new note in the database
 * @param {string} content - The content of the note
 * @returns {Promise<Object>} - The created note
 */
export async function createNote(content) {
  const db = await getDb();
  const collection = db.collection(NOTES_COLLECTION);
  
  // Create note object
  const note = createNoteObject(content);
  
  // Insert into MongoDB
  const result = await collection.insertOne(note);
  
  // Generate and store embeddings
  try {
    const embeddings = await generateEmbeddings(note.content);
    if (embeddings && Array.isArray(embeddings)) {
      await upsertVector(
        result.insertedId.toString(),
        embeddings
      );
    }
  } catch (error) {
    console.error("Error generating embeddings:", error);
    // Continue despite embedding error
  }
  
  return {
    id: result.insertedId.toString(),
    ...note
  };
}

/**
 * Gets all notes from the database with pagination
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {Object} options.sort - Sort options (e.g., { createdAt: -1 })
 * @returns {Promise<Object>} - Object containing notes array and pagination metadata
 */
export async function getAllNotes({ page = 1, limit = 20, sort = { createdAt: -1 } } = {}) {
  const db = await getDb();
  const collection = db.collection(NOTES_COLLECTION);
  
  // Calculate skip value (how many documents to skip)
  const skip = (page - 1) * limit;
  
  // Get total count for pagination metadata
  const total = await collection.countDocuments();
  
  // Get notes with pagination
  const notes = await collection
    .find()
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
  
  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;
  
  return {
    notes: notes.map(mapNoteToResponse),
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasMore
    }
  };
}

/**
 * Gets a note by ID
 * @param {string} id - The note ID
 * @returns {Promise<Object|null>} - The note or null if not found
 */
export async function getNoteById(id) {
  try {
    const db = await getDb();
    const collection = db.collection(NOTES_COLLECTION);
    
    const objectId = new ObjectId(id);
    const note = await collection.findOne({ _id: objectId });
    
    if (!note) return null;
    return mapNoteToResponse(note);
  } catch (error) {
    console.error("Error getting note by ID:", error);
    return null;
  }
}

/**
 * Updates a note by ID
 * @param {string} id - The note ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Object|null>} - The updated note or null if not found
 */
export async function updateNote(id, updates) {
  try {
    const db = await getDb();
    const collection = db.collection(NOTES_COLLECTION);
    
    const objectId = new ObjectId(id);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    // Update embeddings if content was changed
    if (updates.content) {
      try {
        const embeddings = await generateEmbeddings(updates.content);
        if (embeddings && Array.isArray(embeddings)) {
          await upsertVector(id, embeddings);
        }
      } catch (error) {
        console.error("Error updating embeddings:", error);
        // Continue despite embedding error
      }
    }
    
    return mapNoteToResponse(result);
  } catch (error) {
    console.error("Error updating note:", error);
    return null;
  }
}

/**
 * Deletes a note by ID
 * @param {string} id - The note ID
 * @returns {Promise<boolean>} - Whether the note was successfully deleted
 */
export async function deleteNote(id) {
  try {
    const db = await getDb();
    const collection = db.collection(NOTES_COLLECTION);
    
    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });
    
    // Delete vector from Pinecone
    try {
      await deleteVector(id);
    } catch (error) {
      console.error("Error deleting vector from Pinecone:", error);
      // Continue despite Pinecone error
    }
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
}

/**
 * Updates the pinned status of a note
 * @param {string} id - The note ID
 * @param {boolean} pinned - The new pinned status
 * @returns {Promise<Object|null>} - The updated note or null if not found
 */
export async function updatePinStatus(id, pinned) {
  return updateNote(id, { pinned });
} 
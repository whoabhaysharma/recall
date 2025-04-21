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
 * @param {string} userId - The ID of the user creating the note
 * @returns {Promise<Object>} - The created note
 */
export async function createNote(content, userId) {
  const db = await getDb();
  const collection = db.collection(NOTES_COLLECTION);
  
  // Create note object
  const note = createNoteObject(content, userId);
  
  // Insert into MongoDB
  const result = await collection.insertOne(note);
  
  // Generate and store embeddings
  try {
    const embeddings = await generateEmbeddings(note.content);
    if (embeddings && Array.isArray(embeddings)) {
      await upsertVector(
        result.insertedId.toString(),
        embeddings,
        { userId: userId } // Add userId as metadata
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
 * Gets all notes from the database with pagination for a specific user
 * @param {string} userId - The user ID to filter notes by
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Number of items per page
 * @param {Object} options.sort - Sort options (e.g., { createdAt: -1 })
 * @returns {Promise<Object>} - Object containing notes array and pagination metadata
 */
export async function getAllNotes(userId, { page = 1, limit = 20, sort = { createdAt: -1 } } = {}) {
  const db = await getDb();
  const collection = db.collection(NOTES_COLLECTION);
  
  // Calculate skip value (how many documents to skip)
  const skip = (page - 1) * limit;
  
  // Filter by userId
  const filter = { userId };
  
  // Get total count for pagination metadata
  const total = await collection.countDocuments(filter);
  
  // Get notes with pagination
  const notes = await collection
    .find(filter)
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
 * Gets a note by ID for a specific user
 * @param {string} id - The note ID
 * @param {string} userId - The user ID 
 * @returns {Promise<Object|null>} - The note or null if not found
 */
export async function getNoteById(id, userId) {
  try {
    const db = await getDb();
    const collection = db.collection(NOTES_COLLECTION);
    
    const objectId = new ObjectId(id);
    const note = await collection.findOne({ _id: objectId, userId });
    
    if (!note) return null;
    return mapNoteToResponse(note);
  } catch (error) {
    console.error("Error getting note by ID:", error);
    return null;
  }
}

/**
 * Updates a note by ID for a specific user
 * @param {string} id - The note ID
 * @param {string} userId - The user ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Object|null>} - The updated note or null if not found
 */
export async function updateNote(id, userId, updates) {
  try {
    const db = await getDb();
    const collection = db.collection(NOTES_COLLECTION);
    
    const objectId = new ObjectId(id);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    const result = await collection.findOneAndUpdate(
      { _id: objectId, userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    // Update embeddings if content was changed
    if (updates.content) {
      try {
        const embeddings = await generateEmbeddings(updates.content);
        if (embeddings && Array.isArray(embeddings)) {
          await upsertVector(id, embeddings, { userId });
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
 * Deletes a note by ID for a specific user
 * @param {string} id - The note ID
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} - Whether the note was successfully deleted
 */
export async function deleteNote(id, userId) {
  try {
    const db = await getDb();
    const collection = db.collection(NOTES_COLLECTION);
    
    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId, userId });
    
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
 * Updates the pinned status of a note for a specific user
 * @param {string} id - The note ID
 * @param {string} userId - The user ID
 * @param {boolean} pinned - The new pinned status
 * @returns {Promise<Object|null>} - The updated note or null if not found
 */
export async function updatePinStatus(id, userId, pinned) {
  return updateNote(id, userId, { pinned });
} 
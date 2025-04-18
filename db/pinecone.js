/**
 * Pinecone vector database utilities
 */
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const index = pc.index('searchable');

/**
 * Upsert a single vector into Pinecone.
 * @param {string} id - The unique ID of the vector.
 * @param {number[]} values - The vector values (must be the correct dimension).
 * @param {object} metadata - Optional metadata object.
 * @returns {Promise<void>}
 */
async function upsertVector(id, values, metadata = {}) {
  if (!Array.isArray(values) || values.length === 0) {
    console.error('❌ Invalid or missing vector values. Cannot upsert.', values);
    return;
  }

  console.log('🧠 Upserting vector:', { id, valuesLength: values.length, metadata });

  try {
    await index.upsert([
      { id, values, metadata }
    ]);
    console.log(`✅ Vector with id ${id} upserted.`);
  } catch (error) {
    console.error(`❌ Error upserting vector:`, error);
  }
}

/**
 * Delete a vector from Pinecone by ID
 * @param {string} id - The unique ID of the vector to delete
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
async function deleteVector(id) {
  if (!id) {
    console.error('❌ Invalid or missing vector ID. Cannot delete.');
    return false;
  }

  try {
    await index.deleteOne(id);
    console.log(`✅ Vector with id ${id} deleted.`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting vector:`, error);
    return false;
  }
}

/**
 * Delete multiple vectors from Pinecone by IDs
 * @param {string[]} ids - Array of vector IDs to delete
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
async function deleteVectors(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    console.error('❌ Invalid or missing vector IDs. Cannot delete.');
    return false;
  }

  try {
    await index.deleteMany(ids);
    console.log(`✅ ${ids.length} vectors deleted.`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting vectors:`, error);
    return false;
  }
}

export {
  upsertVector,
  deleteVector,
  deleteVectors,
  index
}
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

export {
  upsertVector,
  index
}
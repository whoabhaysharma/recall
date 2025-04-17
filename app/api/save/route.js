import { getDb } from "../../../db/mongo";
import { upsertVector } from "../../../db/pinecone";
import { generateEmbeddings } from "../../../services/Ai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return Response.json({ error: "Missing 'content' in request body" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("notes");

    const note = {
      content,
      createdAt: new Date(),
    };

    // Generate embeddings
    const embeddings = await generateEmbeddings(note.content);
    if (!embeddings || !Array.isArray(embeddings)) {
      throw new Error("Invalid embeddings generated.");
    }

    // Insert into MongoDB
    const result = await collection.insertOne(note);

    // Upsert into Pinecone
    await upsertVector(
      result.insertedId.toString(), // Use MongoDB _id as Pinecone ID
      embeddings
    );

    return Response.json({
      message: "Note inserted successfully",
      insertedId: result.insertedId,
    });

  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

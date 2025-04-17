import { getDb } from "../../../db/mongo";
import { upsertVector } from "../../../db/pinecone";
import { generateEmbeddings } from "../../../services/Ai";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const content = searchParams.get("content");

    if (!content) {
      return Response.json({ error: "Missing 'content' in query params" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("notes");

    const sampleData = {
      content,
      createdAt: new Date(),
    };

    // Generate embeddings
    const embeddings = await generateEmbeddings(sampleData.content);
    if (!embeddings || !Array.isArray(embeddings)) {
      throw new Error("Invalid embeddings generated.");
    }

    // Insert into MongoDB
    const result = await collection.insertOne(sampleData);

    // Upsert into Pinecone
    await upsertVector(
      result.insertedId.toString(), // use Mongo _id as Pinecone ID
      embeddings
    );

    return Response.json({
      message: "Note inserted successfully",
      insertedId: result.insertedId,
    });

  } catch (error) {
    console.error("❌ Error in GET handler:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

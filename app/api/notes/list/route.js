import { getDb } from "../../../../db/mongo";

const collectionName = "notes";

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection(collectionName);

    const items = await collection.find().toArray();

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching items:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

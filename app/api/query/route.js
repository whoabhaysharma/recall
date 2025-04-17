// /api/query (assuming this is the path)
import { NextResponse } from "next/server";
import { generateEmbeddings, queryGeminiFlash } from "../../../services/Ai";
import { index } from "../../../db/pinecone";
import { getDb } from "../../../db/mongo";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const queryText = body?.q; // Use optional chaining for safety

    if (!queryText || typeof queryText !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'q' in body" }, { status: 400 });
    }

    // Step 1: Generate vector from query
    let vector;
    try {
      vector = await generateEmbeddings(queryText);
      if (!Array.isArray(vector) || vector.length === 0) {
        return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
      }
    } catch (error) {
      console.error("Error generating embeddings:", error);
      return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
    }

    // Step 2: Search in Pinecone
    let results;
    try {
      results = await index.query({
        topK: 5,
        vector,
        includeMetadata: true,
        includeValues: false,
      });
    } catch (error) {
      console.error("Error querying Pinecone:", error);
      return NextResponse.json({ error: "Error querying Pinecone" }, { status: 500 });
    }

    // Step 3: Fetch related MongoDB documents
    let documents;
    try {
      const ids = results?.matches?.map((match) => match.id) || [];
      const db = await getDb();
      const collection = db.collection("notes");

      documents = await collection
        .find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
        .toArray();
    } catch (error) {
      console.error("Error fetching MongoDB documents:", error);
      return NextResponse.json({ error: "Error fetching MongoDB documents" }, { status: 500 });
    }

    const enrichedResults = documents.map((doc) => {
      const match = results?.matches?.find((m) => m.id === doc._id.toString());
      return {
        ...doc,
        score: match?.score || 0,
      };
    }).sort((a, b) => (b.score || 0) - (a.score || 0)); // Added null/undefined safety

    // Step 4: Format prompt for Gemini
    const context = enrichedResults
      .map((doc, i) => `Note ${i + 1}: ${doc.content}. Score: ${doc.score}`)
      .join("\n\n");

    const prompt = `You're having a casual conversation with me. I’ll ask you a question, and I’ll also give you a few of my personal notes that are relevant, along with how closely each note matches the question (the score).

Your job is to understand the question, read through the notes, and then reply with a natural, friendly answer—like we're chatting. Match my tone and language style. Don’t mention any documents or scores in your response. Just answer as if you already knew this stuff.

Here’s my question: "${queryText}"

And here are the matching notes:\n\n${context}`;

    // Step 5: Send to Gemini
    let geminiAnswer;
    try {
      geminiAnswer = await queryGeminiFlash(prompt);
    } catch (error) {
      console.error("Error querying Gemini:", error);
      return NextResponse.json({ error: "Error querying Gemini" }, { status: 500 });
    }

    return NextResponse.json({
      query: queryText,
      answer: geminiAnswer,
      sources: enrichedResults,
    });

  } catch (err) {
    console.error("❌ Search error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
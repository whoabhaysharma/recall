// /api/query (assuming this is the path)
import { NextResponse } from "next/server";
import { generateEmbeddings, queryGeminiFlash } from "../../../services/Ai";
import { index } from "../../../db/pinecone";
import { getDb } from "../../../db/mongo";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Extract query text from the request body
    const requestBody = await req.json();
    const queryText = requestBody?.q;

    // Validate query text
    if (!queryText || typeof queryText !== "string") {
      return NextResponse.json({ message: "Missing or invalid 'q' in request body" }, { status: 400 });
    }

    // Step 1: Generate vector embeddings from the query text
    let vector;
    try {
      vector = await generateEmbeddings(queryText);
      if (!Array.isArray(vector) || vector.length === 0) {
        return NextResponse.json({ message: "Failed to generate embeddings" }, { status: 500 });
      }
    } catch (error) {
      console.error("Error generating embeddings:", error);
      return NextResponse.json({ message: "Failed to generate embeddings" }, { status: 500 });
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

    const prompt = `You're my personal AI assistant who knows all about my life from my notes. I'm going to ask you a question, and I'll also provide you with some of my personal notes that are relevant.

IMPORTANT: Your response must be completely conversational, as if we're good friends having a casual chat. Never explain what you're doing or mention my notes. Don't say things like "based on your notes" or "according to what you've written."

- Keep responses very brief and casual
- Use conversational language and occasional slang if appropriate
- Never sound academic, robotic, or like an AI
- Respond as if you already knew this information about me
- If asked for advice, give it directly without qualification
- Never suggest to "check my notes" or any reference to notes existing
- NEVER use phrases like "I can see" or "it seems" or "based on"

My question: "${queryText}"

My relevant notes:\n\n${context}

Reply only as a friend would, in a casual, direct, and personal way. No explanations, context-setting, or caveats.`;

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

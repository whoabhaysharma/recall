// /api/query (assuming this is the path)
import { NextResponse } from "next/server";
import { generateEmbeddings, queryGeminiFlash } from "../../../services/Ai";
import { index } from "../../../db/pinecone";
import { getDb } from "../../../db/mongo";
import { ObjectId } from "mongodb";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { initializeAdminApp } from "../../../firebase/admin";

// Initialize Firebase Admin
const firebaseAdmin = initializeAdminApp();

/**
 * Helper function to get the current user ID from the session token
 * @returns {Promise<string|null>} - The user ID or null if not authenticated
 */
async function getCurrentUserId() {
  try {
    // Get the session token from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      console.log("No session cookie found");
      return null;
    }
    
    try {
      // Verify the session cookie and get the user ID
      const decodedClaims = await getAuth(firebaseAdmin).verifySessionCookie(
        sessionCookie, 
        // Set checkRevoked to true to check if the session has been revoked
        true
      );
      
      if (!decodedClaims || !decodedClaims.uid) {
        console.error("Session cookie verification failed: Invalid claims");
        return null;
      }
      
      return decodedClaims.uid;
    } catch (verifyError) {
      console.error("Session cookie verification error:", verifyError.message);
      return null;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function POST(req) {
  try {
    // Get the current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
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

    // Step 2: Search in Pinecone with user ID filter
    let results;
    try {
      results = await index.query({
        topK: 5,
        vector,
        minScore: 0.5,
        includeMetadata: true,
        includeValues: false,
        filter: { userId: userId }, // Filter by user ID in Pinecone
      });
    } catch (error) {
      console.error("Error querying Pinecone:", error);
      return NextResponse.json({ error: "Error querying Pinecone" }, { status: 500 });
    }

    // Step 3: Fetch related MongoDB documents for the current user
    let documents;
    try {
      const ids = results?.matches?.map((match) => match.id) || [];
      const db = await getDb();
      const collection = db.collection("notes");

      documents = await collection
        .find({ 
          _id: { $in: ids.map((id) => new ObjectId(id)) },
          userId: userId // Ensure only this user's notes are returned
        })
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

IMPORTANT RULES:
- If the notes don't contain enough information to answer, just say so casually (e.g., "Hmm, not sure about that" or "I don’t really remember right now") — never make things up.
- Do NOT invent or assume details that aren’t clearly present in the notes.
- Your response must still feel like a natural, friendly chat — not robotic or apologetic.

STYLE RULES:
- Keep responses very brief and casual.
- Use conversational language and occasional slang if it fits.
- Never sound academic, robotic, or like an AI.
- Respond as if you already knew this info about me.
- If asked for advice, give it directly and naturally.
- Never mention or hint at my notes or that you used them.
- NEVER use phrases like "I can see", "it seems", "based on", or "according to".
- Do not explain what you’re doing.

My question: "${queryText}"

My relevant notes:\n\n${context}

Reply only as a friend would — casual, direct, and personal. If you don't know, just admit it naturally instead of guessing. No explanations, no disclaimers, no context-setting.`


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

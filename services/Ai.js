import { GoogleGenAI } from "@google/genai";
// Replace with your actual API key
const API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI({apiKey : API_KEY});

/**
 * Queries the Gemini 2.0 Flash model with the provided prompt.
 *
 * @param {string} prompt The text prompt to send to the model.
 * @param {object} generationConfig Optional. Configuration options for text generation.
 * See the Gemini API documentation for available options (e.g., temperature,
 * maxOutputTokens). If not provided, default settings will be used.
 * @returns {Promise<string | null>} A Promise that resolves with the generated text
 * (a string), or null on error or if no parts are in the response.
 */
export async function queryGeminiFlash(prompt, generationConfig = {}) {
    try {
      const model = 'gemini-2.0-flash';
      const config = {
        responseMimeType: 'text/plain',
        ...generationConfig, // Allow overriding defaults
      };
  
      const contents = [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ];
  
      const stream = await genAI.models.generateContentStream({
        model,
        config,
        contents,
      });
  
      let result = '';
  
      for await (const chunk of stream) {
        if (chunk.text) {
          result += chunk.text;
        }
      }
  
      return result.trim();
    } catch (error) {
      console.error("❌ Error querying Gemini Flash:", error);
      return null;
    }
  }
  

/**
 * Generates embeddings for the given text using the Gemini API.
 *
 * @param {string} text The text to generate embeddings for.
 * @param {string} modelName Optional. The name of the Gemini model to use
 * (e.g., 'gemini-embedding-exp-03-07').
 * Defaults to 'gemini-embedding-exp-03-07' if not provided.
 * @returns {Promise<number[] | null>} A Promise that resolves with the embedding vector
 * (an array of numbers), or null on error.
 */
export async function generateEmbeddings(text, modelName = 'gemini-embedding-exp-03-07') {
    try {
        const response = await genAI.models.embedContent({
            model: modelName,
            contents: text,
        });

        return response.embeddings?.[0]?.values
    } catch (error) {
        console.error("Error generating embeddings:", error);
        return null; // Explicitly return null on error
    }
}
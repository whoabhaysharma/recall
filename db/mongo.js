import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true, // only if necessary!
});

let db;

export async function getDb() {
  if (db) return db;

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB");
    db = client.db("notes-db");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

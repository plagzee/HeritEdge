import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "heritedge";

if (!uri) throw new Error("Please define MONGODB_URI in .env.local");

let cached = global._mongo;
if (!cached) cached = global._mongo = { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: false, // true only for dev testing
      serverSelectionTimeoutMS: 5000,
    });

    cached.promise = client.connect().then((client) => {
      const db = client.db(dbName);
      return { client, db };
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function withMongo(handler) {
  return async function wrappedHandler(req, res) {
    try {
      const { db, client } = await connectToDatabase();
      req.db = db;
      req.mongoClient = client;
      return handler(req, res);
    } catch (err) {
      console.error("Mongo middleware error:", err);
      res.status(500).json({ error: "Database connection error" });
    }
  };
}

export function withMongoRoute(handler) {
  return async (req) => {
    try {
      const { db, client } = await connectToDatabase();
      return handler(req, { db, client });
    } catch (err) {
      console.error("Mongo route middleware error:", err);
      return new Response(JSON.stringify({ error: "Database connection error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}

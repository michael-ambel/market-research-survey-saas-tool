import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) throw new Error("MONGODB_URI is required");

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseCache;
}

const cache: MongooseCache = global.mongoose || { conn: null, promise: null };

export default async function connectDb(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
}

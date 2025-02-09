import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongodb uri in the env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: true, // what will this bufferCommands do in mongodb?
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then(() => mongoose.connection)
      .catch();
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.log("connection error", error);
  }

  return cached.conn;
}

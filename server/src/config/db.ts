import mongoose from 'mongoose';

let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<void> {
  if (cachedConnection) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in your environment variables');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri);
  }

  cachedConnection = await connectionPromise;
  console.log('MongoDB connected successfully');
}
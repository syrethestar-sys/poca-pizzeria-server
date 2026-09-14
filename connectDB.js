import mongoose from "mongoose";

let connectionPromise = null;

export const connectDB = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI);
  }
  return connectionPromise;
};

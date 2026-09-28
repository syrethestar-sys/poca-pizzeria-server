import mongoose from "mongoose";

let connectionPromise = null;

export const connectDB = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((err) => {
      // Forget the failed attempt so the next request tries again instead of
      // failing forever until the server is restarted.
      connectionPromise = null;
      throw err;
    });
  }
  return connectionPromise;
};

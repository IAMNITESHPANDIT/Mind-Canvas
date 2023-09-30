import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cachedConnection = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return { db: cachedConnection };
  }

  try {
    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedConnection = connection.connection;
    return { db: connection.connection };
  } catch (error) {
    console.log(error);
  }
}

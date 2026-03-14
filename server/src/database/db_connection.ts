import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();

export const db_connection = async () => {
  mongoose
    .connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/your-second-brain",
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1);
    });
};

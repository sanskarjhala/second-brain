import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();

// @ts-ignore
export const db_connection = async () => {
  mongoose
    .connect(
      // @ts-ignore
      process.env.DATABASE_URL as string
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err.message);
      process.exit(1);
    });
};

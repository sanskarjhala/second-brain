import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import contentRoutes from "./routes/content-routes.js";
import userRoutes from "./routes/user-routes.js";
import { db_connection } from "./database/db_connection.js";
configDotenv();

const app = express();

app.use(express.json());
app.use(cors());

db_connection();

app.use("/api/v1", contentRoutes);
app.use("/api/v1", userRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is runnnin at port ${process.env.PORT}`);
});

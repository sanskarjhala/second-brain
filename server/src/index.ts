import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import contentRoutes from "./routes/content-routes";
import userRoutes from "./routes/user-routes";
import { db_connection } from "./database/db_connection";
configDotenv();

const app = express();

app.use(express.json());
app.use(cors());

db_connection();

app.use("/" , contentRoutes);
app.use("/" , userRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is runnnin at port ${process.env.PORT}`);
});

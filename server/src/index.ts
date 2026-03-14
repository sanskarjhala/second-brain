import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv()


const app = express();

app.use(express.json());
app.use(cors())

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is runnnin at port ${process.env.PORT}`);
});

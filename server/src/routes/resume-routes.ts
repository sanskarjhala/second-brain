import { Router } from "express";
import multer from "multer";
import { UserMiddleware } from "../middleware/auth.js";
import { analyzeResume } from "../controllers/Resume.js";


const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/analyze", UserMiddleware, upload.single("resume"), analyzeResume);

export default router;
// src/routes/resume-routes.ts
import { Router } from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/Resume.js";
import { UserMiddleware } from "../middleware/auth.js";


const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/analyze", UserMiddleware, upload.single("resume"), analyzeResume);
// router.post("/chat", UserMiddleware, resumeChat);

export default router;
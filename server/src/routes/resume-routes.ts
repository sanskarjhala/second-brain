import multer from "multer";
import express from "express";
import {
  analyzeResume,
  getUserResumes,
  getResumeById,
  chatWithResume,
  deleteResume,
} from "../controllers/Resume";
import { UserMiddleware } from "../middleware/auth";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/resume/analyze",
  UserMiddleware,
  upload.single("resume"),
  analyzeResume,
);
router.get("/resume", UserMiddleware, getUserResumes);
router.get("/resume/:resumeId", UserMiddleware, getResumeById);
router.post("/resume/:resumeId/chat", UserMiddleware, chatWithResume);
router.delete("/resume/:resumeId", UserMiddleware, deleteResume);

export default router;

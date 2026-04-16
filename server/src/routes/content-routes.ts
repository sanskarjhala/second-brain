import express from "express";
import {
  aiSearch,
  createContent,
  deleteContent,
  getContent,
} from "../controllers/Content.js";
import { UserMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/content", UserMiddleware, createContent);
router.get("/content", UserMiddleware, getContent);
router.delete("/content", UserMiddleware, deleteContent);
router.get("/ai-search", UserMiddleware, aiSearch);

export default router;

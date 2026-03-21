import express from "express";
import {
  createContent,
  deleteContent,
  getContent,
} from "../controllers/Content";
import { UserMiddleware } from "../middleware/auth";
const router = express.Router();

router.post("/content", UserMiddleware, createContent);
router.get("/content", UserMiddleware, getContent);
router.delete("/content/:id", UserMiddleware, deleteContent);

export default router;

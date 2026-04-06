import express from "express";
import { createContent, getContentStatus } from "../controllers/Content";
import { UserMiddleware } from "../middleware/auth";
import { chatHandler } from "../controllers/ChatHandler";
const router = express.Router();

router.post("/add", UserMiddleware, createContent);
// router.get("/content", UserMiddleware, getContent);
// router.delete("/content/:id", UserMiddleware, deleteContent);
router.post("/chat", UserMiddleware, chatHandler);
router.get("/status/:id", UserMiddleware, getContentStatus);

export default router;

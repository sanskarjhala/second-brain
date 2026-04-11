import express from "express";
import { createContent, getAllContent, getContentStatus } from "../controllers/Content.js";
import { UserMiddleware } from "../middleware/auth.js";
import { chatHandler } from "../controllers/ChatHandler.js";
import { similaritySearch } from "../ai-utils/client.js";
const router = express.Router();

router.post("/add", UserMiddleware, createContent);
// router.get("/content", UserMiddleware, getContent);
// router.delete("/content/:id", UserMiddleware, deleteContent);
router.post("/chat", UserMiddleware, chatHandler);
router.get("/status/:id", UserMiddleware, getContentStatus);
router.get("/all-content", UserMiddleware, getAllContent);

router.get("/test-search", UserMiddleware, async (req, res) => {
  const { query, source } = req.body;

  const userId = req.userId;
  const results = await similaritySearch(
    query as string,
    userId as string,
    source as string, // optional
  );

  res.json(results);
});

export default router;

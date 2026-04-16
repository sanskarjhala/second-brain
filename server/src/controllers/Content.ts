import { Response, Request } from "express";
import { ContentModel } from "../database/Schema.js";
import { aiService } from "../ai-utils/AI-Service.js";
import { validateLinkByType } from "../utils/linkValidation.js";
import { queueFetchContent } from "../ai-utils/worker.js";
import mongoose from "mongoose";

export const createContent = async (req: Request, res: Response) => {
  try {
    const { title, link, type } = req.body;

    if (!link.trim() || !title.trim()) {
      return res.status(400).json({ error: "Link and title are required." });
    }

    // validating links
    const validation = validateLinkByType(type, link);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const content = await ContentModel.create({
      link,
      type,
      title,
      //@ts-ignore
      userId: req.userId,
      content: "Processing metadata...",
      embedding: null,
      status: "pending",
      retryCount: 0,
    });

    queueFetchContent(content._id.toString());

    res.status(200).json({
      message: "Content saved, processing metadata in background",
      contentId: content._id,
      content,
    });
  } catch (error) {
    console.error("Error in /api/v1/content:", error);

    res.status(500).json({
      message: "Error in adding content.",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getContent = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const contents = await ContentModel.find({
    userId: userId,
  }).populate("userId", "emailID username");

  res.json({
    contents,
  });
};

export const deleteContent = async (req: Request, res: Response) => {
  const { contentId } = req.body;

  if (!contentId) {
    res.status(400).json({ message: "Content ID is required" });
  }

  await ContentModel.deleteOne({
    _id: contentId,
  });

  res.status(200).json({
    message: "successfully deleted content",
  });
};

const truncate = (text: string, max = 500) =>
  text.length > max ? text.slice(0, max) + "..." : text;

export const aiSearch = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.q as string;
    if (!searchQuery) {
      return res.status(400).json({ error: "Missing query" });
    }

    const queryEmbedding = await aiService.getEmbedding(searchQuery);

    let vectorResults: any[] = [];
    try {
      vectorResults = await ContentModel.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 5,
            filter: { userId: new mongoose.Types.ObjectId(req.userId) },
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            link: 1,
            type: 1,
            _vectorScore: { $meta: "vectorSearchScore" },
          },
        },
      ]);
    } catch (dbError: any) {
      console.error("Vector search failed:", dbError.message || dbError);
    }

    vectorResults.sort((a, b) => b._vectorScore - a._vectorScore);

    const threshold = parseFloat(req.query.threshold as string) || 0.65;
    let relevantResults = vectorResults.filter(
      (r) => r._vectorScore >= threshold,
    );

    if (relevantResults.length === 0) {
      console.warn(" No vector matches, falling back to text search...");

      const textResults = await ContentModel.find(
        {
          userId: req.userId,
          $or: [
            { title: { $regex: searchQuery, $options: "i" } },
            { content: { $regex: searchQuery, $options: "i" } },
          ],
        },
        { title: 1, content: 1, link: 1, type: 1 },
      ).limit(3);

      relevantResults = textResults.map((doc: any) => ({
        ...doc.toObject(),
        _vectorScore: 0.65,
      }));
    }

    let prompt: string;
    let cards: any[] = [];

    if (relevantResults.length > 0) {
      const context = relevantResults
        .slice(0, 3)
        .map(
          (item, idx) =>
            `Card ${idx + 1}: ${item.title}\n${truncate(item.content)}`,
        )
        .join("\n\n");

      prompt = `
You are an AI assistant for a Second Brain app.
User's question: "${searchQuery}"

Here are the most relevant saved notes/cards:
${context}

Answer the question using the saved content.
At the end, also mention: "I've included your saved cards below."
      `.trim();

      cards = relevantResults.map((doc) => ({
        _id: doc._id,
        title: doc.title,
        link: doc.link,
        type: doc.type,
        score: doc._vectorScore?.toFixed?.(3) ?? "N/A",
      }));
    } else {
      prompt = `
User's question: "${searchQuery}"

You have no saved content for this topic.
Answer the question from your own knowledge.
Also mention: "No saved cards matched your search."
      `.trim();
    }

    const llmResponse = await aiService.getLLMResponseWithRetry(prompt);
    const safeResponse = llmResponse?.trim() || "No AI answer found ";

    res.json({ LLMresponses: safeResponse, cards });
  } catch (error: any) {
    console.error("aiSearch error:", error.message || error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

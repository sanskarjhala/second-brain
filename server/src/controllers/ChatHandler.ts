import { Request, Response } from "express";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { model, similaritySearch } from "../ai-utils/client.js";

export const chatHandler = async (req: Request, res: Response) => {
  const { question, source, history } = req.body as {
    question: string;
    source: string;
    history: { role: "user" | "assistant"; content: string }[];
  };

  const userId = req.userId;

  if (!question || !source) {
    return res.status(400).json({ error: "question and source are required" });
  }

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const results = await similaritySearch(
      question,
      userId,  
      source,  
    );

    // 👇 was doc.pageContent, your schema field is "content"
    const context = results.map((doc: any) => doc.content).join("\n---\n");

    if (!context.trim()) {
      return res.json({
        answer:
          "I couldn't find relevant content for your question. Try re-phrasing or check that the content was indexed.",
      });
    }

    const systemPrompt = `You are a helpful assistant. Answer questions using ONLY the context below.
If the context doesn't contain enough information, say so — do not make things up.

CONTEXT:
${context}`;

    const messages = [
      new SystemMessage(systemPrompt),
      ...history
        .slice(1)
        .slice(0, -1)
        .map((msg) =>
          msg.role === "user"
            ? new HumanMessage(msg.content)
            : new AIMessage(msg.content),
        ),
      new HumanMessage(question),
    ];

    const response = await model.invoke(messages);
    const answer =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return res.json({ answer });
  } catch (err: any) {
    console.error("[chat] Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
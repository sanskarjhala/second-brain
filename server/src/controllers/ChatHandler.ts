import { Request, Response } from "express";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { model, getVectorDb } from "../ai-utils/client";

export const chatHandler = async (req: Request, res: Response) => {
  const { question, source, history } = req.body as {
    question: string;
    source: string;
    history: { role: "user" | "assistant"; content: string }[];
  };

  if (!question || !source) {
    return res.status(400).json({ error: "question and source are required" });
  }

  try {
    // Get a VectorDB view scoped to this content's source key
    const vectorDb = await getVectorDb(source);

    // Retrieve top-5 most relevant chunks for the question
    const results = await vectorDb.similaritySearch(question, 5);
    const context = results.map((doc: any) => doc.pageContent).join("\n---\n");

    if (!context.trim()) {
      return res.json({
        answer:
          "I couldn't find relevant content for your question. Try re-phrasing or check that the content was indexed.",
      });
    }

    // Build the message array:
    //    SystemMessage  → RAG context injected fresh every turn
    //    History        → prior turns so follow-ups stay coherent
    //    HumanMessage   → the current question
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

    // 4. Call the model
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

import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export class AIService {
  private token: string;
  private githubAI: OpenAI;

  private readonly LLM_URL =
    "https://models.github.ai/inference/chat/completions";
  private readonly EMBED_URL = "https://models.github.ai/inference/embeddings";
  private readonly EMBED_MODEL = "text-embedding-3-small";
  private readonly EMBED_DIMENSIONS = 1536;
  private readonly CHAT_MODEL = "gpt-4o-mini";

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error(" GITHUB_TOKEN is not set in environment");

    this.token = token;
    this.githubAI = new OpenAI({
      baseURL: "https://models.github.ai/inference",
      apiKey: token,
    });
  }

  async getLLMResponse(prompt: string): Promise<string> {
    if (!prompt?.trim()) return "No prompt provided.";

    try {
      const response = await axios.post(
        this.LLM_URL,
        {
          model: this.CHAT_MODEL,
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return (
        response.data?.choices?.[0]?.message?.content?.trim() ||
        "No AI answer found."
      );
    } catch (error: any) {
      console.error("LLM error:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      });
      throw error;
    }
  }

  /**
   * Retries the LLM call on failure with linear delay (1s, 2s, 3s...)
   */
  async getLLMResponseWithRetry(
    prompt: string,
    retries: number = 2,
    delay: number = 1000,
  ): Promise<string> {
    for (let i = 0; i <= retries; i++) {
      try {
        return await this.getLLMResponse(prompt);
      } catch (err: any) {
        console.warn(`LLM attempt ${i + 1} failed:`, err.message || err);
        if (i === retries) {
          return "AI service is temporarily unavailable. Here's what I found from your saved cards:";
        }
        await this._sleep(delay * (i + 1));
      }
    }
    return "Unexpected error in retry logic.";
  }

  //  Summarization
  async getSummary(text: string): Promise<string> {
    try {
      const response = await this.githubAI.chat.completions.create({
        model: this.CHAT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes text.",
          },
          {
            role: "user",
            content: `Summarize the following text in a few sentences:\n\n${text}`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content ?? "";

      return content;
    } catch (err) {
      console.error("Summary error:", err);
      return "";
    }
  }

  //  Embeddings

  async getEmbedding(text: string): Promise<number[]> {
    if (!text?.trim()) return [];

    try {
      const response = await axios.post(
        this.EMBED_URL,
        { model: this.EMBED_MODEL, input: text.trim() },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 30000,
        },
      );

      const embedding = response.data?.data?.[0]?.embedding;

      if (
        Array.isArray(embedding) &&
        embedding.length === this.EMBED_DIMENSIONS
      ) {
        console.log(`Embedding generated: ${embedding.length} dimensions`);
        return embedding;
      }

      console.warn(
        " Invalid embedding format:",
        typeof embedding,
        "length:",
        embedding?.length,
      );
      return [];
    } catch (error: any) {
      console.error("Embedding API error:");
      error.response
        ? console.error(
            "Status:",
            error.response.status,
            "Data:",
            error.response.data,
          )
        : console.error("Error:", error.message);
      return [];
    }
  }

  // ─── Metadata ─────────────────────────────────────────────────────────────

  async getMetadataFromLink(link: string): Promise<string> {
    try {
      const { data } = await axios.get(
        `https://api.microlink.io?url=${encodeURIComponent(link)}`,
      );
      const { title, description } = data.data;
      return `${title ?? ""}. ${description ?? ""}`;
    } catch (err) {
      console.error("Microlink error:", err);
      return "";
    }
  }

  //  Helpers

  private _sleep(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
  }
}

export const aiService = new AIService();

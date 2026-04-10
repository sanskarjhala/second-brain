import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { configDotenv } from "dotenv";
import { ChunkModel } from "../database/Schema";
configDotenv();
import mongoose from "mongoose";

export const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN,
  },
});

const embeddingsModel = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.GITHUB_TOKEN,
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
  },
});

export const upsertDocs = async (docs: any[], contentId: string) => {
  const enrichedDocs = await Promise.all(
    docs.map(async (doc, index) => {
      const embedding = await embeddingsModel.embedQuery(doc.pageContent);
      return {
        contentId: new mongoose.Types.ObjectId(contentId),
        userId: new mongoose.Types.ObjectId(doc.metadata?.userId),
        source: doc.metadata?.source,
        content: doc.pageContent,
        embedding,
        chunkIndex: index,
      };
    }),
  );

  await ChunkModel.insertMany(enrichedDocs);
};

export const similaritySearch = async (
  query: string,
  userId: string,
  source?: string,
) => {
  const queryEmbedding = await embeddingsModel.embedQuery(query);

  const results = await ChunkModel.aggregate([
    {
      $vectorSearch: {
        index: "vector_index", // create this index on ChunkModel collection
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 5,
        filter: {
          userId: new mongoose.Types.ObjectId(userId),
          ...(source && { source }),
        },
      },
    },
    {
      $project: {
        content: 1,
        source: 1,
        chunkIndex: 1,
        contentId: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
};

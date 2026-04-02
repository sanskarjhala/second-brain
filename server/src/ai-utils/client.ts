import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

export const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN,
  },
});

export const embeddingsModel = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN,
  },
});

export const upsertDocs = async (docs: any[]) => {
  return Chroma.fromDocuments(docs, embeddingsModel, {
    collectionName: process.env.COLLECTION,
    url: process.env.CHROMA_URL,
  });
};

export const getVectorDb = async (filterSource?: string) => {
  const db = await Chroma.fromExistingCollection(embeddingsModel, {
    collectionName: process.env.COLLECTION,
    url: process.env.CHROMA_URL,
  });

  if (filterSource) {
    db.filter = { source: filterSource };
  }

  return db;
};

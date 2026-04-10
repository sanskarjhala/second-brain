import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { configDotenv } from "dotenv";
configDotenv();

export const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN,
  },
});

// const embeddingsModel = new HuggingFaceInferenceEmbeddings({
//   apiKey: process.env.HF_TOKEN,
//   model: "sentence-transformers/all-MiniLM-L6-v2",
// });

const embeddingsModel = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.GITHUB_TOKEN,
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
  },
});


export const upsertDocs = async (docs: any[]) => {
  return Chroma.fromDocuments(docs, embeddingsModel, {
    collectionName: process.env.COLLECTION,
    url: process.env.CHROMA_URL,
    
  });
};

export const getVectorDb = async (source: string, userId: string) => {
  const db = await Chroma.fromExistingCollection(embeddingsModel, {
    collectionName: process.env.COLLECTION,
    url: process.env.CHROMA_URL,
  });

  db.filter = {
    $and: [{ source: { $eq: source } }, { userId: { $eq: userId } }],
  };

  return db;
};

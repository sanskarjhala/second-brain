import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

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

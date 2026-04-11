import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { AIMessage } from "@langchain/core/messages";
import z from "zod";
import { model, similaritySearch , upsertDocs } from "./client.js";
import { ContentModel } from "../database/Schema.js";

const ResumeSchema = z.object({
  skills: z.array(z.string()),
  experience: z.string(),
  projects: z.string(),
  education: z.string(),
  summary: z.string(),
});

class ResumeComponent {
  private llm = model;
  private llm2 = model.withStructuredOutput(ResumeSchema);

  public documentLoader = async (filePath: string) => {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  };

  public extractSections = async (resumeText: string) => {
    const prompt = `
Extract these sections from the resume:
- skills (array)
- experience
- projects
- education

If missing, return empty.

Resume:
${resumeText}
    `;
    try {
      return await this.llm2.invoke(prompt);
    } catch (error: any) {
      console.log(error.message);
      return {
        skills: [],
        experience: "",
        projects: "",
        education: "",
        summary: "",
      };
    }
  };

  public similaritySearch = async (
    vectorDB: any,
    jdChunks: string[],
    userId: any,
    source: string,
  ) => {
    const matches: any[] = [];
    for (const chunk of jdChunks) {
      const results = await vectorDB.similaritySearch(chunk, 3, {
        source,
        userId,
      });
      matches.push({ jdChunk: chunk, results });
    }
    return matches;
  };

  public generateReport = async (
    matches: any,
    jd: string,
  ): Promise<AIMessage> => {
    const prompt = `
You are an advanced ATS system.

Return JSON:
{
  "score": number,
  "missing_skills": [],
  "strong_matches": [],
  "weak_areas": [],
  "suggestions": []
}

DATA:
${JSON.stringify(matches, null, 2)}

JOB DESCRIPTION:
${jd}
    `;
    return this.llm.invoke(prompt);
  };
}

export class Chunking {
  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 10,
  });

  public createChunks = async (
    sections: any,
    source: string,
    userId: string,
  ) => {
    const docs: any[] = [];
    for (const [section, content] of Object.entries(sections)) {
      if (!content) continue;
      const text = Array.isArray(content) ? content.join(", ") : content;
      const chunks = await this.splitter.splitText(text as string);
      chunks.forEach((chunk) => {
        docs.push({
          pageContent: chunk,
          metadata: { section, source, userId },
        });
      });
    }
    return docs;
  };

  public processJd = async (jd: string) => {
    return this.splitter.splitText(jd);
  };
}

export class ResumePipeline {
  private chunking = new Chunking();
  private resumeComponent = new ResumeComponent();

  public ingest = async (
    filePath: string,
    userId: string,
  ): Promise<{ source: string; title: string; contentId: string }> => {
    const source = `resume-${userId}`;
    const title = `Resume - ${userId}`;

    const content = await ContentModel.create({
      title,
      link: filePath,
      type: "resume",
      userId,
      status: "processing",
      source,
    });

    try {
      const resumeText = await this.resumeComponent.documentLoader(filePath);
      const sections = await this.resumeComponent.extractSections(resumeText);
      const docs = await this.chunking.createChunks(sections, source, userId);

      await upsertDocs(docs, content._id.toString());

      await ContentModel.findByIdAndUpdate(content._id, { status: "ready" });
    } catch (err) {
      await ContentModel.findByIdAndUpdate(content._id, { status: "failed" });
      throw err;
    }

    return { source, title, contentId: content._id.toString() };
  };

  public main = async (
    filePath: string,
    jobDescription: string,
    userId: string,
  ): Promise<AIMessage> => {
    const { source } = await this.ingest(filePath, userId);

    const jdChunks = await this.chunking.processJd(jobDescription);

    const matches: any[] = [];
    for (const chunk of jdChunks) {
      const results = await similaritySearch(chunk, userId, source);
      matches.push({ jdChunk: chunk, results });
    }

    return this.resumeComponent.generateReport(matches, jobDescription);
  };
}

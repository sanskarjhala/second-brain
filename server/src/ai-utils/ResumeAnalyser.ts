import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import z from "zod";
import { getVectorDb, model, upsertDocs } from "./client";

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
    const text = docs.map((doc) => doc.pageContent).join("\n");
    return text;
  };

  public ExtractSections = async (resumeText: string) => {
    const promt = `
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
      const result = await this.llm2.invoke(promt);
      console.log(result);
      return result;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  public similaritySearch = async (vectorDB: any, jdChunks: string[]) => {
    const matches: any[] = [];

    for (const chunk of jdChunks) {
      const results = await vectorDB.similaritySearch(chunk, 3);

      matches.push({
        jdChunk: chunk,
        results,
      });
    }

    return matches;
  };

  public async generateReport(matches: any, jd: string) {
    const prompt = `
        You are an ATS system.

        Given:
        1. Job Description
        2. Resume matches from vector search

        Analyze and return:

        - Missing skills
        - Weak areas
        - Strong matches
        - Final ATS score (0-100)
        - Suggestions to improve resume

        DATA:
        ${JSON.stringify(matches, null, 2)}

        JOB DESCRIPTION:
        ${jd}
        `;

    const response = await this.llm.invoke(prompt);
    return response;
  }
}

export class Chunking {
  // Import spillter
  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 80,
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
          metadata: { section: section, source: source, userId },
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

  public run = async (
    filePath: string,
    jobDescription: string,
    userId: any,
  ) => {
    const resumeText = await this.resumeComponent.documentLoader(filePath);
    const sections = await this.resumeComponent.ExtractSections(resumeText);
    const source = `resume-${userId}`;
    const docs = await this.chunking.createChunks(sections, source, userId);
    await upsertDocs(docs);
    const vectorDb = await getVectorDb(source);
    const jdChunks = await this.chunking.processJd(jobDescription);
    const matches = await this.resumeComponent.similaritySearch(
      vectorDb,
      jdChunks,
    );
    const report = await this.resumeComponent.generateReport(
      matches,
      jobDescription,
    );
    return report;
  };
}

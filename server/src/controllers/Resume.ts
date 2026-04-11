import { Request, Response } from "express";
import fs from "fs";
import { ResumePipeline } from "../ai-utils/ResumeAnalyser.js";

export const analyzeResume = async (req: Request, res: Response) => {

  const filePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    const { jobDescription } = req.body;

    if (!jobDescription?.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }

    const userId = req.userId!;
    const pipeline = new ResumePipeline();

    // run the full pipeline — extract, embed, similarity search, generate report
    const report = await pipeline.main(filePath!, jobDescription, userId);

    // parse the AI response to JSON
    const raw =
      typeof report.content === "string"
        ? report.content
        : (report.content as any[]).map((b: any) => b.text || "").join("");

    const clean = raw.replace(/```json|```/g, "").trim();
    const parsedReport = JSON.parse(clean);

    return res.status(200).json(parsedReport);
  } catch (error: any) {
    console.error("[analyzeResume]", error.message);
    return res.status(500).json({ error: error.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
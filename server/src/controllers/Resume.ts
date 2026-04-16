import { Request, Response } from "express";
import pdfParse from "pdf-parse";
import { z } from "zod";
import { aiService } from "../ai-utils/AI-Service";
import { ResumeModel } from "../database/Schema";

// ── Zod schema for the structured analysis output ─────────────
const ResumeAnalysisSchema = z.object({
  skills: z.array(z.string()),
  experience: z.string(),
  projects: z.string(),
  education: z.string(),
  summary: z.string(),
  matchScore: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
  suggestions: z.array(z.string()),
});

// ── Helper: extract text from uploaded PDF buffer ─────────────
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text?.trim() || "";
}

// ── Helper: parse JSON safely from LLM response ───────────────
function parseLLMJson(raw: string) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export const analyzeResume = async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Resume PDF is required." });
    }
    if (!jobDescription?.trim()) {
      return res.status(400).json({ error: "Job description is required." });
    }

    // ── Step 1: Extract text from PDF ─────────────────────────
    const resumeText = await extractTextFromPDF(req.file.buffer);
    if (!resumeText) {
      return res
        .status(400)
        .json({
          error:
            "Could not extract text from PDF. Make sure it's not scanned/image-only.",
        });
    }

    // ── Step 2: Summarize JD ──────────────────────────────────
    const jdSummary = await aiService.getSummary(jobDescription);

    // ── Step 3: Analyze resume against JD ────────────────────
    const analysisPrompt = `
You are an expert technical recruiter and resume analyst.

Analyze the resume below against the job description and return ONLY a valid JSON object with NO extra text, explanation, or markdown.

JSON format:
{
  "skills": ["skill1", "skill2"],         // skills found in the resume
  "experience": "string",                  // summary of work experience
  "projects": "string",                    // summary of projects
  "education": "string",                   // education details
  "summary": "string",                     // overall candidate summary
  "matchScore": 0-100,                     // % match with the JD
  "missingSkills": ["skill1", "skill2"],   // skills in JD but missing in resume
  "suggestions": ["tip1", "tip2"]          // specific improvement suggestions
}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}
    `.trim();

    const rawAnalysis = await aiService.getLLMResponseWithRetry(analysisPrompt);
    const parsed = parseLLMJson(rawAnalysis);
    const analysis = ResumeAnalysisSchema.parse(parsed);

    // ── Step 4: Save to DB ────────────────────────────────────
    const resumeDoc = await ResumeModel.create({
      userId: req.userId,
      resumeText,
      jobDescription,
      jdSummary,
      analysis,
      messages: [],
    });

    return res.status(201).json({
      resumeId: resumeDoc._id,
      jdSummary,
      analysis,
    });
  } catch (error: any) {
    console.error("analyzeResume error:", error.message || error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

export const getUserResumes = async (req: Request, res: Response) => {
  try {
    const resumes = await ResumeModel.find(
      { userId: req.userId },
      { resumeText: 0, messages: 0 }, // exclude heavy fields from list view
    ).sort({ createdAt: -1 });

    return res.json({ resumes });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getResumeById = async (req: Request, res: Response) => {
  try {
    const resume = await ResumeModel.findOne({
      _id: req.params.resumeId,
      userId: req.userId, // ensure user owns this resume
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume session not found." });
    }

    return res.json({ resume });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const chatWithResume = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const resume = await ResumeModel.findOne({
      _id: req.params.resumeId,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume session not found." });
    }

    // ── Build system context ──────────────────────────────────
    const systemContext = `
You are an expert career coach and resume analyst. 
You have access to the user's resume and the job description they are targeting.

RESUME:
${resume.resumeText}

JOB DESCRIPTION:
${resume.jobDescription}

ANALYSIS ALREADY DONE:
- Match Score: ${resume.analysis?.matchScore}%
- Missing Skills: ${resume.analysis?.missingSkills?.join(", ")}
- Suggestions: ${resume.analysis?.suggestions?.join("; ")}

You can help the user:
1. Answer questions about their resume
2. Answer questions about the job description
3. Give specific improvement suggestions
4. Be honest, specific, and actionable in your responses.
    `.trim();

    // Build conversation history for context 
    const conversationHistory = resume.messages
      .slice(-10) // last 10 messages for context window
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const fullPrompt = `
${systemContext}

CONVERSATION SO FAR:
${conversationHistory}

User: ${message}
Assistant:
    `.trim();

    const aiReply = await aiService.getLLMResponseWithRetry(fullPrompt);

    // Save both messages to DB
    await ResumeModel.findByIdAndUpdate(resume._id, {
      $push: {
        messages: {
          $each: [
            { role: "user", content: message },
            { role: "assistant", content: aiReply },
          ],
        },
      },
    });

    return res.json({ reply: aiReply });
  } catch (error: any) {
    console.error("chatWithResume error:", error.message || error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    await ResumeModel.deleteOne({
      _id: req.params.resumeId,
      userId: req.userId,
    });
    return res.json({ message: "Resume session deleted." });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

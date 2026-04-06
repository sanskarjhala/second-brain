import { Response, Request } from "express";
import { ContentModel } from "../database/Schema";
import { ExtractorPipeline } from "../ai-utils/Extractor";

const pipeline = new ExtractorPipeline(); // singleton

export const createContent = async (req: Request, res: Response) => {
  try {
    const { link, type, title } = req.body;
    const userId = req.userId;

    const content = await ContentModel.create({
      title,
      link,
      type,
      userId,
      status: "processing",
    });

    res.status(200).json({
      message: "Content added",
      contentId: content._id,
      status: "processing",
    });

    ingestInBackground(content._id.toString(), link, userId as string);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const ingestInBackground = async (
  contentId: string,
  link: string,
  userId: string,
) => {
  try {
    const { source } = await pipeline.ingest(link, userId);

    await ContentModel.findByIdAndUpdate(contentId, {
      status: "ready",
      chromaSource: source,
    });

    console.log(`[ingest] Done: ${contentId} → source: ${source}`);
  } catch (error: any) {
    await ContentModel.findByIdAndUpdate(contentId, { status: "failed" });
    console.error(`[ingest] Failed: ${contentId}`, error.message);
  }
};

// ── Status polling endpoint ───────────────────────────────────────────────────
// GET /api/content/:id/status
// Frontend polls this until status is "ready" or "failed"

export const getContentStatus = async (req: Request, res: Response) => {
  try {
    const content = await ContentModel.findById(req.params.id).select(
      "status chromaSource title",
    );

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    return res.json({
      status: content.status,
      chromaSource: content.chromaSource,
      title: content.title,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

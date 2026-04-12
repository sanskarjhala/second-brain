import { ContentModel } from "../database/Schema";
import { aiService } from "./AI-Service";

const RETRY_LIMIT = 6;

export function queueFetchContent(id: string) {
  // run after request cycle ends
  setImmediate(() => processContent(id));
}

async function processContent(id: string) {
  const item = await ContentModel.findById(id);
  if (!item || item.status === "ready" || item.status === "failed") return;

  try {
    const link: string = item.link ?? "";
    let metadata = await aiService.getMetadataFromLink(link);
    let summary = "";
    if (metadata && metadata.trim()) {
      summary = await aiService.getSummary(metadata);
    }

    if (!metadata?.trim() && !summary?.trim()) {
      await ContentModel.findByIdAndUpdate(item._id, {
        status: "pending",
      });
      return; // exit, don’t create embedding --> becz there is not content found is there in the content
    }

    const finalContent = `${metadata} ${summary}`.trim();
    const embedding = await aiService.getEmbedding(finalContent);

    // if correctly fetched then update the database...
    await ContentModel.findByIdAndUpdate(item._id, {
      content: finalContent,
      embedding,
      status: "ready",
    });
  } catch (err: any) {
    console.error(
      `Error processing-> fetching content and generating embedding ${id}:`,
      err.message,
    );

    const newRetry = (item.retryCount || 0) + 1;

    if (newRetry >= RETRY_LIMIT) {
      await ContentModel.findByIdAndUpdate(id, {
        status: "failed",
        retryCount: newRetry,
      });
      console.log(`Marked ${id} as failed`);
    } else {
      await ContentModel.findByIdAndUpdate(id, {
        status: "retrying",
        retryCount: newRetry,
      });

      const delay = Math.pow(2, newRetry) * 1000; // 2s, 4s, 8s, 16s, 32s
      setTimeout(() => processContent(id), delay);
    }
  }
}

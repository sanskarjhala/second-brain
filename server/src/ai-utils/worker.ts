import { ContentModel } from "../database/Schema";
import { aiService } from "./AI-Service";

const RETRY_LIMIT = 6;

export function queueFetchContent(id: string) {
  setImmediate(() => processContent(id));
}

async function processContent(id: string) {
  console.log(`[processContent] Starting for id: ${id}`);

  const item = await ContentModel.findById(id);

  if (!item) {
    console.warn(`[processContent] No item found for id: ${id}`);
    return;
  }

  if (["ready", "failed", "processing"].includes(item.status)) {
    console.log(`[processContent] Early exit — status: ${item.status}`);
    return;
  }

  await ContentModel.findByIdAndUpdate(id, { status: "processing" });

  try {
    // ── just embed the title directly ──
    const textToEmbed = item.title?.trim();

    if (!textToEmbed) {
      throw new Error("Title is empty — nothing to embed");
    }

    console.log(`[processContent] Embedding title: "${textToEmbed}"`);
    const embedding = await aiService.getEmbedding(textToEmbed);

    if (!embedding || embedding.length === 0) {
      throw new Error("Embedding came back empty");
    }

    await ContentModel.findByIdAndUpdate(id, {
      content: textToEmbed,
      embedding,
      status: "ready",
    });

    console.log(`[processContent] ✓ Done for id: ${id}`);
  } catch (err: any) {
    console.error(`[processContent] Error for id ${id}:`, err.message);

    const newRetry = (item.retryCount || 0) + 1;

    if (newRetry >= RETRY_LIMIT) {
      await ContentModel.findByIdAndUpdate(id, {
        status: "failed",
        retryCount: newRetry,
      });
      console.log(`[processContent] ✗ Marked as failed`);
    } else {
      await ContentModel.findByIdAndUpdate(id, {
        status: "pending",
        retryCount: newRetry,
      });
      const delay = Math.pow(2, newRetry) * 1000;
      console.log(`[processContent] Retrying in ${delay / 1000}s...`);
      setTimeout(() => processContent(id), delay);
    }
  }
}

// async function processContent(id: string) {
//   console.log(`[processContent] Starting for id: ${id}`);

//   const item = await ContentModel.findById(id);

//   if (!item) {
//     console.warn(`[processContent] No item found for id: ${id}`);
//     return;
//   }

//   if (["ready", "failed", "processing"].includes(item.status)) {
//     console.log(`[processContent] Early exit — status is: ${item.status}`);
//     return;
//   }

//   // lock it so no duplicate workers run
//   await ContentModel.findByIdAndUpdate(id, { status: "processing" });
//   console.log(`[processContent] Locked as processing`);

//   try {
//     // ── Step 1: Metadata ───────────────────────────────
//     const link = item.link ?? "";
//     console.log(`[processContent] Fetching metadata for: ${link}`);

//     const metadata = await aiService.getMetadataFromLink(link);
//     console.log(`[processContent] Metadata result: "${metadata}"`);

//     // ── Step 2: Summary ────────────────────────────────
//     let summary = "";
//     if (metadata?.trim()) {
//       summary = await aiService.getSummary(metadata);
//       console.log(`[processContent] Summary result: "${summary}"`);
//     } else {
//       console.warn(`[processContent] Empty metadata — skipping summary`);
//     }

//     // ── Step 3: Validate content ───────────────────────
//     if (!metadata?.trim() && !summary?.trim()) {
//       throw new Error("Both metadata and summary are empty — nothing to embed");
//     }

//     const finalContent = `${metadata} ${summary}`.trim();
//     console.log(
//       `[processContent] Final content length: ${finalContent.length}`,
//     );

//     // ── Step 4: Embedding ──────────────────────────────
//     const embedding = await aiService.getEmbedding(finalContent);
//     console.log(`[processContent] Embedding length: ${embedding?.length}`);

//     if (!embedding || embedding.length === 0) {
//       throw new Error(
//         "Embedding came back empty — invalid format or API issue",
//       );
//     }

//     // ── Step 5: Save to DB ─────────────────────────────
//     await ContentModel.findByIdAndUpdate(id, {
//       content: finalContent,
//       embedding,
//       status: "ready",
//     });

//     console.log(`[processContent] ✓ Successfully saved content for id: ${id}`);
//   } catch (err: any) {
//     console.error(`[processContent] Error for id ${id}:`, err.message);

//     const newRetry = (item.retryCount || 0) + 1;
//     console.log(`[processContent] Retry count: ${newRetry}/${RETRY_LIMIT}`);

//     if (newRetry >= RETRY_LIMIT) {
//       await ContentModel.findByIdAndUpdate(id, {
//         status: "failed",
//         retryCount: newRetry,
//       });
//       console.log(
//         `[processContent] ✗ Marked as failed after ${newRetry} retries`,
//       );
//     } else {
//       await ContentModel.findByIdAndUpdate(id, {
//         status: "pending", // reset so next retry can pass the guard
//         retryCount: newRetry,
//       });

//       const delay = Math.pow(2, newRetry) * 1000; // 2s, 4s, 8s, 16s, 32s, 64s
//       console.log(`[processContent] Retrying in ${delay / 1000}s...`);
//       setTimeout(() => processContent(id), delay);
//     }
//   }
// }

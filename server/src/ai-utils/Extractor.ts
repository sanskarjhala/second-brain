import { Readability } from "@mozilla/readability";
import axios from "axios";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { URL } from "node:url";
import { Chunking } from "./ResumeAnalyser.js";
import { upsertDocs } from "./client.js";


import { YoutubeTranscript } from "youtube-transcript";
import * as YouTubeVideoIdPkg from "youtube-video-id";
import ytdlp from "yt-dlp-exec";
import fs from "fs/promises";


interface ExtractedContent {
  title?: string | null;
  content: string | null | undefined;
  shortSummary?: string | null;
  type: "youtube" | "article";
  source: string;
}

class ArticleExtractor {
  private removeHtmlTags(text: string): string {
    const $ = cheerio.load(text);
    return $.text().trim();
  }

  extract = async (url: string): Promise<ExtractedContent> => {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      },
    });

    const dom = new JSDOM(response.data);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) throw new Error("Failed to parse article");
    // @ts-ignore
    const text = this.removeHtmlTags(article.content);
    return {
      title: article.title ?? null,
      content: text ?? null,
      shortSummary: article.excerpt ?? null,
      type: "article",
      source: `article-${encodeURIComponent(url)}`,
    };
  };
}


const YouTubeVideoId = (YouTubeVideoIdPkg as any).default || YouTubeVideoIdPkg;
class YoutubeExtractor {
  private getVideoId(url: string): string {
    const id = YouTubeVideoId(url);
    if (!id) {
      throw new Error(`Invalid YouTube URL: ${url}`);
    }
    return id;
  }

  private async getTranscriptPrimary(id: string): Promise<string> {
    const data = await YoutubeTranscript.fetchTranscript(id);
    return data.map((item) => item.text).join(" ");
  }

  private async getTranscriptFallback(url: string): Promise<string> {
    try {
      const videoId = this.getVideoId(url);

      await ytdlp(url, {
        skipDownload: true,
        writeAutoSub: true,
        subLang: "en",
        convertSubs: "vtt",
        output: `/tmp/${videoId}.%(ext)s`,
      });

      const filePath = `/tmp/${videoId}.en.vtt`;
      const data = await fs.readFile(filePath, "utf-8");

      const text = data
        .split("\n")
        .filter(
          (line) =>
            line &&
            !line.includes("-->") &&
            !line.includes("WEBVTT") &&
            !line.match(/^\d+$/),
        )
        .join(" ");

      return text;
    } catch (err: any) {
      console.error("yt-dlp fallback failed:", err.message);
      throw err;
    }
  }

  async extractTranscript(url: string): Promise<ExtractedContent> {
    const videoId = this.getVideoId(url);

    let transcript = "";

    try {
      console.log("Trying primary...");
      transcript = await this.getTranscriptPrimary(videoId);
    } catch {
      console.log("Primary failed → fallback...");
      try {
        transcript = await this.getTranscriptFallback(url);
      } catch {
        transcript = "Transcript not available.";
      }
    }

    return {
      title: `YouTube video: ${videoId}`,
      content: transcript,
      type: "youtube",
      source: `youtube-${videoId}`,
    };
  }
}

export default YoutubeExtractor;

export class ExtractorPipeline {
  private articleExtractor = new ArticleExtractor();
  private youtubeExtractor = new YoutubeExtractor();
  private chunker = new Chunking();

  private detectType(url: string): "youtube" | "article" {
    const hostname = new URL(url).hostname;
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return "youtube";
    }
    return "article";
  }

  private async extractContent(url: string): Promise<ExtractedContent> {
    const type = this.detectType(url);
    switch (type) {
      case "youtube":
        console.log("@1");
        return this.youtubeExtractor.extractTranscript(url);
      case "article":
        return this.articleExtractor.extract(url);
    }
  }

  async ingest(
    url: string,
    userId: string,
    contentId: string,
  ): Promise<{ source: string; title?: string }> {
    const extracted = await this.extractContent(url);

    const docs = await this.chunker.createChunks(
      { content: extracted.content },
      extracted.source,
      userId,
    );

    await upsertDocs(docs, contentId); 
    return { source: extracted.source, title: extracted.title ?? undefined };
  }
}

import { Readability } from "@mozilla/readability";
import axios from "axios";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { URL } from "node:url";
import { YoutubeTranscript } from "youtube-transcript";
import YouTubeVideoId from "youtube-video-id";
import { Chunking } from "./ResumeAnalyser";
import { upsertDocs } from "./client";

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
      title: article.title,
      content: text,
      shortSummary: article.excerpt,
      type: "article",
      source: `article-${encodeURIComponent(url)}`,
    };
  };
}

class YoutubeExtractor {
  private getVideoId = (url: string): string => {
    const id = YouTubeVideoId(url);
    if (!id) throw new Error(`Could not extract video ID from: ${url}`);
    return id;
  };

  private getTranscript = async (id: string): Promise<string> => {
    try {
      const data = await YoutubeTranscript.fetchTranscript(id);
      const trans = data.map((item) => item.text).join(" ");
      return trans;
    } catch (err: any) {
      console.error("Transcript failed:", err.message);
      throw err;
    }
  };

  extractTranscript = async (url: string): Promise<ExtractedContent> => {
    const videoId = this.getVideoId(url);

    const transcript = await this.getTranscript(videoId);

    return {
      title: `YouTube video: ${videoId}`,
      content: transcript,
      type: "youtube",
      source: `youtube-${videoId}`,
    };
  };
}

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
        return this.youtubeExtractor.extractTranscript(url);
      case "article":
        return this.articleExtractor.extract(url);
    }
  }

  async ingest(
    url: string,
    userId: string,
  ): Promise<{ source: string; title?: string }> {
    const extracted = await this.extractContent(url);

    const docs = await this.chunker.createChunks(
      { content: extracted.content },
      extracted.source,
      userId,
    );
    // console.log(docs)
    await upsertDocs(docs);
    // @ts-ignore
    return { source: extracted.source, title: extracted.title };
  }
}

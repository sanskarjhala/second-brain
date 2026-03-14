import { Readability } from "@mozilla/readability";
import axios from "axios";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { URL } from "node:url";
import { fetchTranscript } from "youtube-transcript-plus";
import YouTubeVideoId from "youtube-video-id";

interface type {
  type: "youtube" | "article" | "pdf";
}

class ArticleExtractor {
  private removeHtmlTags(text: string): string {
    const $ = cheerio.load(text);
    return $.text().trim();
  }

  extract = async (url: string) => {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      },
    });

    const dom = new JSDOM(response.data);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    //@ts-ignore
    const text = this.removeHtmlTags(article.content);
    return {
      title: article?.title,
      content: text,
      shortSummary: article?.excerpt,
      type: "article",
    };
  };
}

class YoutubeExtractor {
  private getVideoId = (url: string): string => {
    return YouTubeVideoId(url);
  };

  private getTranscript = async (id: string): Promise<string> => {
    try {
      const transcriptChunks = await fetchTranscript(id);

      //converting them into single string
      const fullTranscript = transcriptChunks
        .map((chunk) => chunk.text)
        .join(" ");

      return fullTranscript;
    } catch (error: any) {
      throw new error("failed to get Transcript");
    }
  };

  extractTranscript = async (url: string): Promise<string> => {
    const videoId = this.getVideoId(url);

    try {
      const data = await this.getTranscript(videoId);
      return data;
    } catch (error: any) {
      throw new error("Yoiutube transcupt error");
    }
  };
}

export class Extractor {
  private ArticleExtractor = new ArticleExtractor();
  private YoutubeExtractor = new YoutubeExtractor();

  //detect the type
  private detectType = (url: string) => {
    const hostname = new URL(url).hostname;

    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return "youtube";
    }
    return "article";
  };

  extract = async (url: string) => {
    const type = this.detectType(url);

    switch (type) {
      case "youtube":
        return this.YoutubeExtractor.extractTranscript(url);
      case "article":
        return this.ArticleExtractor.extract(url);
    }
  };
}

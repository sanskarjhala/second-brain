import { useEffect, useState, useRef } from "react";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { ShareIcon } from "../../icons/ShareIcon";

interface CardProps {
  title: string;
  link: string;
  type: "youtube" | "twitter" | "article" | "github" | "website";
  status: "processing" | "ready" | "failed";
  onDelete?: () => void;
}

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E24B4A">
    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.2 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.5 3-5.5 3z" />
  </svg>
);

const ArticleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#378ADD">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const typeConfig = {
  youtube: { icon: <YoutubeIcon />, color: "text-red-500" },
  twitter: { icon: <TwitterIcon />, color: "text-sky-500" },
  github: { icon: <GithubIcon />, color: "text-gray-800" },
  article: { icon: <ArticleIcon />, color: "text-amber-600" },
  website: { icon: <ArticleIcon />, color: "text-violet-600" },
};

const ChatIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ── Chat Drawer ────────────────────────────────────────────────────────────
interface ChatDrawerProps {
  title: string;
  link?: string;
  source: string;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}
// I have removed link from here and have to cheack after deployment
const ChatDrawer = ({ title, source, onClose }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I've read this content. Ask me anything about "${title}"!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/content/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg.content,
          source, // used to filter vectorDB by this content's source
          history: updated,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong, try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      {/* Drawer panel — stop propagation so clicks inside don't close it */}
      <div
        className="w-full max-w-md h-full bg-white flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <ChatIcon />
            <span className="text-sm font-medium truncate">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap
                  ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-700 rounded-bl-sm"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-gray-100 px-3 py-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask something..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="bg-purple-600 text-white px-3 py-2 rounded-xl text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Card ───────────────────────────────────────────────────────────────────
export const Card = ({ title, link, type, status }: CardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  console.log("Card status:", title, status);

  // source key — unique per content item, used to scope vectorDB queries
  const source = `content-${btoa(link).slice(0, 16)}`;

  const handleLoad = () => {
    setIsLoading(false);
  };


  useEffect(() => {
    if (type === "twitter" && (window as any).twttr) {
      (window as any).twttr.widgets.load();
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [type, link]);

  return (
    <>
      <div className="p-4 m-2 bg-white shadow-md shadow-gray-800 rounded-md outline-2 outline-slate-200 max-w-84">
        {/* Header row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {typeConfig[type]?.icon}
            <span className="font-medium text-sm">{title}</span>
          </div>
          <div className="flex gap-3 items-center">
            <a href={link} target="_blank" rel="noreferrer">
              <ShareIcon />
            </a>
            <DeleteIcon />
          </div>
        </div>


        {/* Media content */}
        <div className="pt-2">
          {isLoading && type !== "article" && type !== "github" && (
            <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded text-sm text-gray-400">
              Loading...
            </div>
          )}

          {/* YouTube embed */}
          {type === "youtube" && (
            <iframe
              className={`w-full pt-5 ${isLoading ? "hidden" : "block"}`}
              src={link.replace("watch?v=", "embed/")}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleLoad}
            />
          )}

          {/* Twitter embed */}
          {type === "twitter" && (
            <blockquote
              className={`twitter-tweet ${isLoading ? "hidden" : "block"}`}
            >
              <a href={link.replace("x.com", "twitter.com")} />
            </blockquote>
          )}

          {/* GitHub — show repo card style */}
          {type === "github" && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
            >
              <GithubIcon />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-black">
                  {/* extract "owner/repo" from URL */}
                  {link.replace("https://github.com/", "")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  GitHub Repository
                </p>
              </div>
              <span className="ml-auto text-gray-400 text-xs">↗</span>
            </a>
          )}

          {/* Article — show link preview style */}
          {type === "article" && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex flex-col gap-1 p-3 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <ArticleIcon />
                <p className="text-xs text-amber-700 truncate font-medium">
                  {new URL(link).hostname}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-black">
                {title}
              </p>
              <p className="text-xs text-gray-400 truncate">{link}</p>
            </a>
          )}
        </div>

        {/* Chat button row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {status === "processing" && (
              <>
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400">
                  Indexing content...
                </span>
              </>
            )}
            {status === "ready" && (
              <>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-400">Ready to chat</span>
              </>
            )}
            {status === "failed" && (
              <>
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                <span className="text-xs text-red-400">Index failed</span>
              </>
            )}
          </div>

          <button
            onClick={() => setChatOpen(true)}
            disabled={status !== "ready"}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-purple-200 text-purple-600
              hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChatIcon />
            Chat
          </button>
        </div>
      </div>

      {/* Chat drawer — rendered outside the card via portal-like conditional */}
      {chatOpen && (
        <ChatDrawer
          title={title}
          link={link}
          source={source}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
};

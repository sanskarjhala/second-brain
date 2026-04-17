import { useState, useRef, useEffect } from "react";
import { ResumeApis } from "../apis/ResumeApis";
import { ScoreRing } from "../components/core/resumeAnalyser/ScoreRing";
import { HistorySidebar } from "../components/core/resumeAnalyser/HistorySidebar";
import {
  Card,
  Pill,
  SectionLabel,
} from "../components/core/resumeAnalyser/ResumeUi";
import { UploadView } from "../components/core/resumeAnalyser/UploadView";

const resumeApis = new ResumeApis();

export type Analysis = {
  matchScore: number;
  summary: string;
  skills: string[];
  missingSkills: string[];
  experience: string;
  projects: string;
  education: string;
  suggestions: string[];
};

export type ResumeHistoryItem = {
  _id: string;
  analysis?: Analysis;
  createdAt: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type SessionData = {
  resumeId: string;
  analysis: Analysis;
  jdSummary: string;
  messages: ChatMessage[];
  createdAt: string;
};

function AnalysisTab({
  analysis,
  jdSummary,
}: {
  analysis: Analysis;
  jdSummary: string;
}) {
  let matchLabel = "Weak match";
  if (analysis.matchScore >= 70) matchLabel = "Strong match";
  else if (analysis.matchScore >= 45) matchLabel = "Moderate match";

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-slate-50 p-5 dark:bg-[#0f1117]">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-[auto_1fr]">
          <Card className="flex flex-col items-center justify-center gap-1 px-5">
            <ScoreRing score={analysis.matchScore} />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {matchLabel}
            </p>
          </Card>

          <Card>
            <SectionLabel>JD summary</SectionLabel>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {jdSummary}
            </p>
          </Card>
        </div>

        <Card>
          <SectionLabel>Candidate summary</SectionLabel>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {analysis.summary}
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <SectionLabel>Skills found</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {analysis.skills.map((skill, index) => (
                <Pill key={index} label={skill} variant="success" />
              ))}
            </div>
          </Card>

          <Card>
            <SectionLabel>Missing skills</SectionLabel>
            {analysis.missingSkills.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                None — great match!
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingSkills.map((skill, index) => (
                  <Pill key={index} label={skill} variant="danger" />
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card>
          <SectionLabel>Experience</SectionLabel>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {analysis.experience}
          </p>
        </Card>

        <Card>
          <SectionLabel>Projects</SectionLabel>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {analysis.projects}
          </p>
        </Card>

        <Card>
          <SectionLabel>Education</SectionLabel>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {analysis.education}
          </p>
        </Card>

        <Card>
          <SectionLabel>Suggestions</SectionLabel>
          <div className="flex flex-col gap-3">
            {analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 rounded-full border border-purple-200 bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChatTab({
  resumeId,
  initialMessages = [],
}: {
  resumeId: string;
  initialMessages?: ChatMessage[];
}) {
  const defaultMessages: ChatMessage[] =
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            role: "assistant",
            content:
              "Hi! Ask me anything about your resume or the job description. I can help you improve it, explain skill gaps, or write a cover letter.",
          },
        ];

  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [inputText, setInputText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage() {
    if (!inputText.trim() || isSending) return;

    const userMessage = inputText;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputText("");
    setIsSending(true);

    try {
      const responseData = await resumeApis.sendChatMessage(
        resumeId,
        userMessage,
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responseData.reply || "Something went wrong.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error reaching AI. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  const quickPrompts = [
    "How can I improve my resume?",
    "What skills am I missing?",
    "Key requirements of this JD?",
    "Write me a cover letter",
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50/70 dark:bg-[#0f1117]">
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 px-4 py-2.5 dark:border-white/10">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => setInputText(prompt)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] text-slate-600 hover:border-purple-300 hover:text-purple-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-purple-500/40 dark:hover:text-slate-200"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-custom-gradient text-[8px] font-bold text-white">
                  AI
                </div>
              )}

              <div
                className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "rounded-br-sm bg-custom-gradient text-white"
                    : "rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-white/10 dark:bg-[#171a22] dark:text-slate-300"
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-end gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-custom-gradient text-[8px] font-bold text-white">
              AI
            </div>
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#171a22]">
              {[0, 1, 2].map((dotIndex) => (
                <div
                  key={dotIndex}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
                  style={{ animationDelay: `${dotIndex * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 px-4 pt-2 dark:border-white/10">
        <div className="flex gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSendMessage();
              }
            }}
            placeholder="Ask about your resume or the job description..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 "
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !inputText.trim()}
            className="rounded-xl bg-custom-gradient px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-25"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionView({ session }: { session: SessionData }) {
  const [activeTab, setActiveTab] = useState<"analysis" | "chat">("analysis");

  const tabs = [
    { id: "analysis" as const, label: "Analysis" },
    { id: "chat" as const, label: "Chat with AI" },
  ];

  const formattedDate = new Date(session.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#10131a] pt-8">
      <div className="flex shrink-0 items-center gap-0 border-b border-slate-200 bg-white/80 px-5 backdrop-blur-sm dark:border-white/10 dark:bg-[#10131a]/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "border-purple-500 text-purple-600 dark:text-purple-300"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        <div className="flex-1" />
        <span className="pr-1 text-[11px] text-slate-500 dark:text-slate-400">
          {formattedDate}
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "analysis" ? (
          <AnalysisTab
            analysis={session.analysis}
            jdSummary={session.jdSummary}
          />
        ) : (
          <ChatTab
            resumeId={session.resumeId}
            initialMessages={session.messages}
          />
        )}
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [resumes, setResumes] = useState<ResumeHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"upload" | "session">(
    "upload",
  );

  useEffect(() => {
    resumeApis
      .getAllResumes()
      .then((data) => {
        setResumes(data.data.resumes || []);
      })
      .catch(() => {})
      .finally(() => {
        setIsHistoryLoading(false);
      });
  }, []);

  async function handleSelectSession(resumeId: string) {
    setIsSessionLoading(true);
    setCurrentView("session");

    try {
      const data = await resumeApis.getSingleResume(resumeId);

      const session: SessionData = {
        resumeId: data.resume._id,
        analysis: data.resume.analysis,
        jdSummary: data.resume.jdSummary,
        messages: data.resume.messages || [],
        createdAt: data.resume.createdAt,
      };

      setActiveSession(session);
    } catch {
      setCurrentView("upload");
    } finally {
      setIsSessionLoading(false);
    }
  }

  function handleAnalyzed(data: any) {
    const newSession: SessionData = {
      resumeId: data.resumeId,
      analysis: data.analysis,
      jdSummary: data.jdSummary,
      messages: [],
      createdAt: new Date().toISOString(),
    };

    setActiveSession(newSession);
    setCurrentView("session");

    const newHistoryItem: ResumeHistoryItem = {
      _id: data.resumeId,
      analysis: data.analysis,
      createdAt: new Date().toISOString(),
    };

    setResumes((prev) => [newHistoryItem, ...prev]);
  }

  async function handleDelete(resumeId: string) {
    await resumeApis.deleteResume(resumeId);

    setResumes((prev) => prev.filter((r) => r._id !== resumeId));

    if (activeSession?.resumeId === resumeId) {
      setActiveSession(null);
      setCurrentView("upload");
    }
  }

  return (
    <div className="flex h-screen no-scrollbar bg-slate-50 text-slate-900 dark:bg-[#0b0d12] dark:text-slate-100">
      <HistorySidebar
        resumes={resumes}
        activeId={activeSession?.resumeId}
        onSelect={handleSelectSession}
        onNew={() => {
          setActiveSession(null);
          setCurrentView("upload");
        }}
        onDelete={handleDelete}
        loading={isHistoryLoading}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {currentView === "upload" && <UploadView onAnalyzed={handleAnalyzed} />}

        {currentView === "session" && isSessionLoading && (
          <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-[#0f1117]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-purple-500 dark:border-white/10 dark:border-t-purple-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading session...
              </p>
            </div>
          </div>
        )}

        {currentView === "session" && !isSessionLoading && activeSession && (
          <SessionView session={activeSession} />
        )}
      </main>
    </div>
  );
}
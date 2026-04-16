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
// API CLASS
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

// Shows the full analysis result (score, skills, suggestions, etc.)
function AnalysisTab({
  analysis,
  jdSummary,
}: {
  analysis: Analysis;
  jdSummary: string;
}) {
  // Determine match label based on score
  let matchLabel = "Weak match";
  if (analysis.matchScore >= 70) matchLabel = "Strong match";
  else if (analysis.matchScore >= 45) matchLabel = "Moderate match";

  return (
    <div className="flex flex-col gap-4 p-5 overflow-y-auto h-full">
      {/* Top row: score ring + JD summary */}
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <Card className="flex flex-col items-center justify-center px-5 gap-1">
          {/* Ek circle dikhati hai or uske andr score Chota hai lekin motaa hai */}
          <ScoreRing score={analysis.matchScore} />
          <p className="text-[11px] text-[#444]">{matchLabel}</p>
        </Card>
        <Card>
          <SectionLabel>JD summary</SectionLabel>
          <p className="text-sm text-[#777] leading-relaxed">{jdSummary}</p>
        </Card>
      </div>

      {/* Candidate summary */}
      <Card>
        <SectionLabel>Candidate summary</SectionLabel>
        <p className="text-sm text-[#777] leading-relaxed">
          {analysis.summary}
        </p>
      </Card>

      {/* Skills found vs missing */}
      <div className="grid grid-cols-2 gap-4">
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
            <p className="text-xs text-[#444]">None — great match!</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {analysis.missingSkills.map((skill, index) => (
                <Pill key={index} label={skill} variant="danger" />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Experience, Projects, Education */}
      <Card>
        <SectionLabel>Experience</SectionLabel>
        <p className="text-sm text-[#777] leading-relaxed">
          {analysis.experience}
        </p>
      </Card>

      <Card>
        <SectionLabel>Projects</SectionLabel>
        <p className="text-sm text-[#777] leading-relaxed">
          {analysis.projects}
        </p>
      </Card>

      <Card>
        <SectionLabel>Education</SectionLabel>
        <p className="text-sm text-[#777] leading-relaxed">
          {analysis.education}
        </p>
      </Card>

      {/* Improvement suggestions */}
      <Card>
        <SectionLabel>Suggestions</SectionLabel>
        <div className="flex flex-col gap-3">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-[10px] font-bold text-purple-300 bg-purple-900/25 border border-purple-800/40 rounded-full px-2 py-0.5 shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p className="text-sm text-[#777] leading-relaxed">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// A chat interface to ask questions about your resume
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

  // Used to auto-scroll to the bottom when a new message is added
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage() {
    if (!inputText.trim() || isSending) return;

    const userMessage = inputText;

    // Add user's message to the chat immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputText("");
    setIsSending(true);

    try {
      const responseData = await resumeApis.sendChatMessage(
        resumeId,
        userMessage,
      );

      // Add the AI reply to the chat
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

  // Pre-written quick prompts the user can click
  const quickPrompts = [
    "How can I improve my resume?",
    "What skills am I missing?",
    "Key requirements of this JD?",
    "Write me a cover letter",
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Quick prompt buttons */}
      <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-[#1c1c1c]">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => setInputText(prompt)}
            className="text-[11px] px-3 py-1 rounded-full border border-[#252525] text-[#555] hover:border-accent/40 hover:text-[#ccc] transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={index}
              className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {/* AI avatar icon */}
              {!isUser && (
                <div className="w-6 h-6 rounded-full bg-custom-gradient shrink-0 flex items-center justify-center text-[8px] font-bold text-white mb-0.5">
                  AI
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[75%] text-sm leading-relaxed px-4 py-2.5 rounded-2xl whitespace-pre-wrap
                  ${
                    isUser
                      ? "bg-custom-gradient text-white rounded-br-sm"
                      : "bg-[#1a1a1a] text-[#aaa] border border-[#252525] rounded-bl-sm"
                  }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}

        {/* Animated typing indicator */}
        {isSending && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-full bg-custom-gradient shrink-0 flex items-center justify-center text-[8px] font-bold text-white">
              AI
            </div>
            <div className="bg-[#1a1a1a] border border-[#252525] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
              {[0, 1, 2].map((dotIndex) => (
                <div
                  key={dotIndex}
                  className="w-1.5 h-1.5 rounded-full bg-[#555] animate-bounce"
                  style={{ animationDelay: `${dotIndex * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Invisible div to scroll to */}
        <div ref={bottomRef} />
      </div>

      {/* Input bar at the bottom */}
      <div className="px-4 pb-4 pt-2 border-t border-[#1c1c1c]">
        <div className="flex gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              // Send on Enter (but not Shift+Enter)
              if (e.key === "Enter" && !e.shiftKey) {
                handleSendMessage();
              }
            }}
            placeholder="Ask about your resume or the job description..."
            className="flex-1 bg-[#1a1a1a] border border-[#252525] text-[#ccc] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent/40 placeholder:text-[#333] transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-custom-gradient text-white disabled:opacity-25 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Shows the analysis + chat tabs for a selected resume session
function SessionView({ session }: { session: SessionData }) {
  // "analysis" or "chat" tab
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
    <div className="flex-1 flex flex-col overflow-hidden bg-darkbg">
      {/* Tab bar */}
      <div className="flex items-center gap-0 px-5 border-b border-[#1c1c1c] shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px
                ${
                  isActive
                    ? "text-white border-accent"
                    : "text-[#444] border-transparent hover:text-[#888]"
                }`}
            >
              {tab.label}
            </button>
          );
        })}

        {/* Spacer + date label */}
        <div className="flex-1" />
        <span className="text-[11px] text-[#333] pr-1">{formattedDate}</span>
      </div>

      {/* Tab content */}
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

// This is the main component that brings everything together
export default function ResumeAnalyzer() {
  const [resumes, setResumes] = useState<ResumeHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"upload" | "session">(
    "upload",
  );

  // Purane Saare Resume fetch krlo shuvat me
  useEffect(() => {
    resumeApis
      .getAllResumes()
      .then((data) => {
        setResumes(data.resumes || []);
      })
      .catch(() => {
        // silently fail — user just won't see history
      })
      .finally(() => {
        setIsHistoryLoading(false);
      });
  }, []);

  // Called when a user clicks a past session in the sidebar
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
      // If loading fails, go back to upload screen
      setCurrentView("upload");
    } finally {
      setIsSessionLoading(false);
    }
  }

  // Called after a new resume is analyzed
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

    // Also add it to the sidebar history
    const newHistoryItem: ResumeHistoryItem = {
      _id: data.resumeId,
      analysis: data.analysis,
      createdAt: new Date().toISOString(),
    };

    setResumes((prev) => [newHistoryItem, ...prev]);
  }

  // Called when user deletes a resume from history
  async function handleDelete(resumeId: string) {
    await resumeApis.deleteResume(resumeId);

    // Remove from the list
    setResumes((prev) => prev.filter((r) => r._id !== resumeId));

    // If we deleted the currently open session, go back to upload
    if (activeSession?.resumeId === resumeId) {
      setActiveSession(null);
      setCurrentView("upload");
    }
  }

  return (
    <div className="flex h-screen bg-darkbg overflow-hidden">
      {/* Sidebar */}
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

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Upload screen */}
        {currentView === "upload" && <UploadView onAnalyzed={handleAnalyzed} />}

        {/* Loading spinner while fetching a session */}
        {currentView === "session" && isSessionLoading && (
          <div className="flex-1 flex items-center justify-center bg-darkbg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-[#2a2a2a] border-t-accent rounded-full animate-spin" />
              <p className="text-sm text-[#444]">Loading session...</p>
            </div>
          </div>
        )}

        {/* Show session if we have data and aren't loading */}
        {currentView === "session" && !isSessionLoading && activeSession && (
          <SessionView session={activeSession} />
        )}
      </main>
    </div>
  );
}

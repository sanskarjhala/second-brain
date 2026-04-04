import { useState, useRef, useEffect } from "react";

interface Report {
  score: number;
  missing_skills: string[];
  strong_matches: string[];
  weak_areas: string[];
  suggestions: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ResumePage() {
  const [phase, setPhase] = useState<"upload" | "chat">("upload");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // ── Step 1: Upload & Analyze ──────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!resumeFile || !jobDesc.trim()) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDesc);

      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json(); // { score, missing_skills, strong_matches, weak_areas, suggestions }
      setReport(data);

      // seed the chat with the report as context
      const reportSummary = `
Resume analysis complete. Here is the report:
- Score: ${data.score}/100
- Strong matches: ${data.strong_matches.join(", ")}
- Missing skills: ${data.missing_skills.join(", ")}
- Weak areas: ${data.weak_areas.join(", ")}
- Suggestions: ${data.suggestions.join(" | ")}

The user may now ask follow-up questions about their resume or this job.
      `.trim();

      setMessages([{ role: "assistant", content: reportSummary }]);
      setPhase("chat");
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Chat ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || chatLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setChatLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert resume coach and ATS specialist. 
The user just received this resume analysis report:

Score: ${report?.score}/100
Strong matches: ${report?.strong_matches.join(", ")}
Missing skills: ${report?.missing_skills.join(", ")}
Weak areas: ${report?.weak_areas.join(", ")}
Suggestions: ${report?.suggestions.join(" | ")}

Answer the user's questions about their resume, the job fit, how to improve, etc.
Be concise, specific, and actionable.`,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const reply = data.content?.map((b: any) => b.text || "").join("") ?? "";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ── Upload Phase UI ───────────────────────────────────────────────────────
  if (phase === "upload") {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Resume Analyzer
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Upload your resume and a job description to get an ATS report, then
            chat with it.
          </p>
        </div>

        {/* Resume PDF Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            Resume (PDF)
          </label>
          <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-400 transition-colors bg-gray-50">
            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888"
                strokeWidth="1.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {resumeFile ? resumeFile.name : "Click to upload PDF"}
              </p>
              <p className="text-xs text-gray-400">Only .pdf files</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            Job description
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={7}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleAnalyze}
          disabled={!resumeFile || !jobDesc.trim() || loading}
          className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "Analyzing your resume..."
            : "Analyze & Continue to Chat →"}
        </button>
      </div>
    );
  }

  // ── Chat Phase UI ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Report Summary Banner */}
      {report && (
        <div className="shrink-0 mx-4 mt-4 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">
              ATS Report
            </span>
            <span
              className="text-lg font-bold"
              style={{
                color:
                  report.score >= 75
                    ? "#639922"
                    : report.score >= 50
                      ? "#BA7517"
                      : "#A32D2D",
              }}
            >
              {report.score}
              <span className="text-xs font-normal text-gray-400">/100</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400 uppercase font-medium mb-1">
                Strong matches
              </p>
              {report.strong_matches.map((s, i) => (
                <p key={i} className="text-gray-700 flex gap-1.5 mb-0.5">
                  <span className="text-green-500 font-bold">+</span>
                  {s}
                </p>
              ))}
            </div>
            <div>
              <p className="text-gray-400 uppercase font-medium mb-1">
                Missing skills
              </p>
              {report.missing_skills.map((s, i) => (
                <p key={i} className="text-gray-700 flex gap-1.5 mb-0.5">
                  <span className="text-red-400 font-bold">-</span>
                  {s}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm"
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {chatLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
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

      {/* Input Bar */}
      <div className="shrink-0 border-t border-gray-200 px-4 py-3 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask about your resume, skills, how to improve..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || chatLoading}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// // Express example
// import { ResumePipeline } from "./resumePipeline";

// app.post("/api/resume/analyze", upload.single("resume"), async (req, res) => {
//   const pipeline = new ResumePipeline();
//   const report = await pipeline.main(
//     req.file.path,           // temp path of uploaded PDF
//     req.body.jobDescription,
//     req.user.id              // or whatever your userId is
//   );

//   // report is an AIMessage — parse the JSON from its content
//   const raw = typeof report.content === "string"
//     ? report.content
//     : (report.content as any[]).map((b: any) => b.text || "").join("");

//   const clean = raw.replace(/```json|```/g, "").trim();
//   res.json(JSON.parse(clean));
// });

import { useState, useRef } from "react";
import { Card, SectionLabel } from "./ResumeUi";
import { ResumeApis } from "../../../apis/ResumeApis";

const resumeApis = new ResumeApis();

export function UploadView({
  onAnalyzed,
}: {
  onAnalyzed: (data: any) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelected(file: File | null) {
    if (!file) return;

    if (file.type === "application/pdf") {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please upload a PDF file.");
    }
  }

  async function handleSubmit() {
    if (!selectedFile) {
      setErrorMessage("Please upload your resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      setErrorMessage("Please paste the job description.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("jobDescription", jobDescription);

    try {
      const responseData = await resumeApis.analyzeResume(formData);

      if (responseData.error) {
        throw new Error(responseData.error);
      }
      onAnalyzed(responseData);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-6 md:px-8 overflow-y-hidden">
      <div className="w-full max-w-2xl rounded-3xl border bg-white shadow-xl backdrop-blur-sm p-4 md:p-8 dark:border-white/10 dark:bg-white/5 dark:shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl md:text-4xl font-bold tracking-tight text-purple-600 ">
            Analyze your resume
          </h2>
          <p className="mt-2 font-thin md:text-base text-slate-600 leading-relaxed dark:text-slate-300">
            Upload your resume and paste a job description to get an AI-powered
            match score, missing skills, and improvement suggestions.
          </p>
        </div>

        <Card className="mb-4 rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-[#15151b]">
          <SectionLabel>Resume · PDF</SectionLabel>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileSelected(e.dataTransfer.files[0]);
            }}
            className={`mt-3 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer
              ${
                isDragging
                  ? "border-purple-500 bg-purple-100/80 dark:bg-purple-500/10 dark:border-purple-400 scale-[1.01]"
                  : selectedFile
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10"
                    : "border-slate-300 bg-slate-50 hover:border-purple-400 hover:bg-purple-50 dark:border-white/10 dark:bg-[#101014]"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
            />

            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  PDF selected successfully · click to replace
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Drop your PDF here or click to browse
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Only PDF files are supported
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="mb-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-[#15151b]">
          <SectionLabel>Job description</SectionLabel>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 placeholder:text-slate-400 shadow-sm resize-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-[#101014] dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
          />
        </Card>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full rounded-2xl py-3.5 text-sm md:text-base font-semibold transition-all duration-300
            ${
              isLoading
                ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                : "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Analyzing resume...
            </span>
          ) : (
            "Analyze Resume →"
          )}
        </button>
      </div>
    </div>
  );
}

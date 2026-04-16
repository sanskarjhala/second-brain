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

  // This ref is used to programmatically click the hidden file input
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
    // Validate inputs before sending
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

    // Build form data to send the file
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
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-darkbg">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-semibold bg-custom-gradient bg-clip-text text-transparent mb-1">
          Analyze your resume
        </h2>
        <p className="text-sm text-[#555] mb-6 leading-relaxed">
          Upload a PDF and paste a job description to get an AI-powered match
          score and improvement suggestions.
        </p>

        {/* PDF Upload Box */}
        <Card className="mb-3">
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
            className={`rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-all
              ${
                isDragging
                  ? "border-accent bg-purple-900/10"
                  : selectedFile
                    ? "border-purple-700/50 bg-purple-900/10"
                    : "border-[#252525] hover:border-[#333]"
              }`}
          >
            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
            />

            {selectedFile ? (
              <div>
                <p className="text-purple-300 text-sm font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-[#444] text-xs mt-1">Click to replace</p>
              </div>
            ) : (
              <p className="text-[#444] text-sm">
                Drop PDF here or click to browse
              </p>
            )}
          </div>
        </Card>

        {/* Job Description Textarea */}
        <Card className="mb-5">
          <SectionLabel>Job description</SectionLabel>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description..."
            rows={8}
            className="w-full bg-[#141414] text-[#999] text-sm leading-relaxed rounded-lg border border-[#222] p-3 resize-none focus:outline-none focus:border-accent/40 placeholder:text-[#333] transition-colors"
          />
        </Card>

        {/* Error message */}
        {errorMessage && (
          <p className="text-red-400 text-xs mb-3">{errorMessage}</p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all
            ${
              isLoading
                ? "bg-[#1a1a1a] text-[#444] cursor-not-allowed"
                : "bg-custom-gradient text-white hover:opacity-90 active:scale-[0.99]"
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-[#333] border-t-accent rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Analyze resume →"
          )}
        </button>
      </div>
    </div>
  );
}

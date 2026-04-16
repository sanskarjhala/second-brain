import type { ResumeHistoryItem } from "../../../pages/ResumeAnalyser";

export function HistorySidebar({
  resumes,
  activeId,
  onSelect,
  onNew,
  onDelete,
  loading,
}: {
  resumes: ResumeHistoryItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  return (
    <aside className="ml-14 w-60 shrink-0 bg-[#0e0e0e] border-r border-[#1c1c1c] flex flex-col h-full">
      {/* New analysis button */}
      <div className="p-3 border-b border-[#1c1c1c]">
        <button
          onClick={onNew}
          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-custom-gradient text-white hover:opacity-90 active:scale-[0.98] transition-all"
        >
          + New analysis
        </button>
      </div>

      {/* "History" label */}
      <div className="px-2 pt-3 pb-1">
        <p className="text-[10px] uppercase tracking-widest text-[#333] font-semibold px-2">
          History
        </p>
      </div>

      {/* List of past resumes */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {/* Show skeleton loaders while fetching */}
        {loading &&
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-lg bg-[#161616] animate-pulse mb-2"
            />
          ))}

        {/* Empty state */}
        {!loading && resumes.length === 0 && (
          <p className="text-xs text-[#333] px-3 py-4">No analyses yet.</p>
        )}

        {/* Render each resume item */}
        {!loading &&
          resumes.map((resume) => {
            const isActive = activeId === resume._id;
            const score = resume.analysis?.matchScore ?? 0;

            // Pick color for the score badge
            let scoreClasses = "text-red-400 bg-red-900/30";
            if (score >= 70) scoreClasses = "text-purple-300 bg-purple-900/30";
            else if (score >= 45)
              scoreClasses = "text-amber-400 bg-amber-900/30";

            // Truncate the summary to 42 characters
            const shortSummary = resume.analysis?.summary
              ? resume.analysis.summary.slice(0, 42) + "…"
              : "Resume session";

            return (
              <div
                key={resume._id}
                onClick={() => onSelect(resume._id)}
                className={`group relative flex flex-col gap-1 px-3 py-2.5 rounded-lg cursor-pointer mb-1 transition-all
                  ${
                    isActive
                      ? "bg-purple-900/20 border border-purple-800/30"
                      : "hover:bg-[#161616] border border-transparent"
                  }`}
              >
                {/* Summary text */}
                <p className="text-xs font-medium text-[#ccc] truncate pr-5 leading-snug">
                  {shortSummary}
                </p>

                {/* Score badge + date */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${scoreClasses}`}
                  >
                    {resume.analysis?.matchScore ?? "--"}%
                  </span>
                  <span className="text-[10px] text-[#3a3a3a]">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Delete button (only visible on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // don't trigger the parent onClick
                    onDelete(resume._id);
                  }}
                  className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 text-[#3a3a3a] hover:text-red-500 transition-all text-xs leading-none p-0.5"
                >
                  ✕
                </button>
              </div>
            );
          })}
      </div>
    </aside>
  );
}

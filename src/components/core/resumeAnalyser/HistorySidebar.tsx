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
    <aside className="pt-6 ml-14 w-64 shrink-0 h-full flex flex-col border-r border-slate-200 bg-white/80 text-slate-900 backdrop-blur-sm dark:border-white/10 dark:bg-[#0f1117] dark:text-white">
      {/* New analysis button */}
      <div className="border-b border-slate-200 p-3 dark:border-white/10">
        <button
          onClick={onNew}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
        >
          + New analysis
        </button>
      </div>

      {/* History label */}
      <div className="px-3 pt-4 pb-2">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          History
        </p>
      </div>

      {/* Resume list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {loading &&
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="mb-2 h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-white/5 dark:bg-white/5"
            />
          ))}

        {!loading && resumes.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No analyses yet
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Start a new resume analysis to see history here.
            </p>
          </div>
        )}

        {!loading &&
          resumes.map((resume) => {
            const isActive = activeId === resume?._id;
            const score = resume.analysis?.matchScore ?? 0;

            let scoreClasses =
              "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300";

            if (score >= 70) {
              scoreClasses =
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
            } else if (score >= 45) {
              scoreClasses =
                "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
            }

            const shortSummary = resume.analysis?.summary
              ? resume.analysis.summary.slice(0, 42) + "…"
              : "Resume session";

            return (
              <div
                key={resume._id}
                onClick={() => onSelect(resume._id)}
                className={`group relative mb-2 cursor-pointer rounded-xl border px-3 py-3 transition-all duration-200
                  ${
                    isActive
                      ? "border-purple-200 bg-purple-50 shadow-sm dark:border-purple-500/30 dark:bg-purple-500/10"
                      : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
                  }`}
              >
                {/* Summary */}
                <p
                  className={`truncate pr-6 text-sm font-medium leading-snug
                    ${
                      isActive
                        ? "text-purple-700 dark:text-purple-200"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                >
                  {shortSummary}
                </p>

                {/* Score + date */}
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${scoreClasses}`}
                  >
                    {resume.analysis?.matchScore ?? "--"}%
                  </span>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(resume._id);
                  }}
                  className="absolute right-2 top-2 rounded-md p-1 text-xs text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
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

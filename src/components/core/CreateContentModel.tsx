import { useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "../ui/Button";

interface ModelProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: (data: { type: ContentType; title: string; link: string }) => void;
}

type ContentType = "youtube" | "twitter" | "github" | "article" | "website";

const CONTENT_TYPES: {
  type: ContentType;
  label: string;
  icon: string;
  color: string;
  placeholder: string;
}[] = [
  {
    type: "youtube",
    label: "YouTube",
    icon: "▶",
    color: "bg-red-50 border-red-200 hover:bg-red-100 text-red-700",
    placeholder: "https://youtube.com/watch?v=...",
  },
  {
    type: "twitter",
    label: "Twitter",
    icon: "𝕏",
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100 text-sky-700",
    placeholder: "https://twitter.com/...",
  },
  {
    type: "github",
    label: "GitHub",
    icon: "◉",
    color: "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-800",
    placeholder: "https://github.com/...",
  },
  {
    type: "article",
    label: "Article",
    icon: "✦",
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700",
    placeholder: "https://medium.com/...",
  },
  {
    type: "website",
    label: "Website",
    icon: "⊕",
    color: "bg-violet-50 border-violet-200 hover:bg-violet-100 text-violet-700",
    placeholder: "https://...",
  },
];

export const CreateContentModel = ({
  isOpen,
  onClose,
  onSubmit,
}: ModelProps) => {
  const [step, setStep] = useState<"type" | "details">("type");
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const selectedMeta = CONTENT_TYPES.find((c) => c.type === selectedType);

  const handleClose = () => {
    setStep("type");
    setSelectedType(null);
    setTitle("");
    setLink("");
    onClose?.();
  };

  const handleTypeSelect = (type: ContentType) => {
    setSelectedType(type);
    setStep("details");
  };

  const handleBack = () => {
    setStep("type");
    setSelectedType(null);
    setTitle("");
    setLink("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !title || !link) return;
    onSubmit?.({ type: selectedType, title, link });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-400 via-sky-400 to-amber-400" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {step === "details" && (
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium flex items-center gap-1"
                >
                  ← Back
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {step === "type"
                    ? "What are you saving?"
                    : `Add ${selectedMeta?.label}`}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {step === "type"
                    ? "Choose a content type to get started"
                    : "Fill in the details below"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
            >
              <CrossIcon />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            {["type", "details"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-violet-600 text-white"
                      : i === 0 && step === "details"
                        ? "bg-violet-100 text-violet-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i === 0 && step === "details" ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step === s ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {s === "type" ? "Type" : "Details"}
                </span>
                {i === 0 && (
                  <div
                    className={`h-px w-6 transition-all ${
                      step === "details" ? "bg-violet-300" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Type selection */}
          {step === "type" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CONTENT_TYPES.map(({ type, label, icon, color }) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all font-medium text-sm ${color}`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Details form */}
          {step === "details" && selectedMeta && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Selected type badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium w-fit ${selectedMeta.color}`}
              >
                <span>{selectedMeta.icon}</span>
                <span>{selectedMeta.label}</span>
              </div>

              <Input
                label="Title"
                placeholder="Give it a memorable name..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Input
                label="Link"
                placeholder={selectedMeta.placeholder}
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                type="url"
              />

              <Button
                variant="primary"
                text="Save to Brain"
                type="submit" 
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

function Input({
  label,
  placeholder,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 transition-colors placeholder:text-gray-300"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

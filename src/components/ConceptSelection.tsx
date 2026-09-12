import React, { useState } from "react";
import { AdConcept, HookType } from "../types";
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  MessageSquareQuote,
  Lightbulb,
  CornerDownRight,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react";

interface ConceptSelectionProps {
  concepts: AdConcept[];
  selectedConcept: AdConcept | null;
  onSelectConcept: (concept: AdConcept) => void;
  onConfirmConcept: () => void;
  onReshapeFeedback: (feedback: string) => void;
  onBackToBrief: () => void;
  isReshaping: boolean;
  batchIteration: number;
}

export const ConceptSelection: React.FC<ConceptSelectionProps> = ({
  concepts,
  selectedConcept,
  onSelectConcept,
  onConfirmConcept,
  onReshapeFeedback,
  onBackToBrief,
  isReshaping,
  batchIteration,
}) => {
  const [feedbackText, setFeedbackText] = useState("");

  const handleReshapeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      onReshapeFeedback(feedbackText.trim());
      setFeedbackText("");
    }
  };

  const hookBadgeStyles: Record<
    HookType,
    { label: string; bg: string; text: string; border: string }
  > = {
    "pain-point-first": {
      label: "Pain-Point-First",
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
    },
    "curiosity-gap": {
      label: "Curiosity-Gap",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/30",
    },
    "before-after": {
      label: "Before / After",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    "social-proof": {
      label: "Social-Proof",
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/30",
    },
    humor: {
      label: "Humor & Wit",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
    },
  };

  const sampleFeedbackPills = [
    "Lean harder into the remote work daily fatigue",
    "Add more curiosity: why do ordinary solutions fail?",
    "Keep it punchy, dry, and witty",
    "Focus on immediate relief within the first 15 minutes",
    "More premium, understated executive tone",
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Step Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Step 2 &bull; Human-In-The-Loop Concept Review
            </span>
            <span className="text-xs font-mono text-stone-500">
              Batch #{batchIteration}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight mt-1 font-display">
            Select or Reshape Ad Concepts
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
            The Ideation agent prepared {concepts.length} distinct angles. Confirm one to generate creative assets, or reshape them with your feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToBrief}
          className="flex items-center space-x-1.5 text-xs text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded-lg border border-stone-800 hover:bg-stone-900 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Edit Product Brief</span>
        </button>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {concepts.map((concept, index) => {
          const isSelected = selectedConcept?.id === concept.id;
          const hookStyle =
            hookBadgeStyles[concept.hookType] || hookBadgeStyles["pain-point-first"];

          return (
            <div
              key={concept.id}
              onClick={() => onSelectConcept(concept)}
              className={`relative rounded-xl p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-stone-900/95 border-amber-500 ring-2 ring-amber-500/30 shadow-xl shadow-amber-500/10"
                  : "bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/90 shadow-md"
              }`}
            >
              {/* Card Header: Hook Badge & Origin */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${hookStyle.bg} ${hookStyle.text} ${hookStyle.border}`}
                  >
                    {hookStyle.label}
                  </span>

                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        concept.origin === "blended"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {concept.origin === "blended"
                        ? "Blended Feedback"
                        : "Agent-Suggested"}
                    </span>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-amber-500 text-stone-950"
                          : "border border-stone-700 text-transparent"
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Concept Title */}
                <h3 className="text-base font-bold text-stone-100 mb-1.5 tracking-tight">
                  {concept.title}
                </h3>

                {/* Message Angle */}
                <div className="bg-stone-950/60 rounded-lg p-2.5 border border-stone-800/80 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-0.5">
                    Message Angle:
                  </span>
                  <p className="text-xs text-stone-200 leading-snug font-medium">
                    "{concept.messageAngle}"
                  </p>
                </div>

                {/* Suggested Visual Direction */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 flex items-center space-x-1">
                    <Lightbulb className="w-3 h-3 text-amber-400" />
                    <span>Suggested Art Direction:</span>
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                    {concept.suggestedVisualDirection}
                  </p>
                </div>
              </div>

              {/* Card Footer: CTA style & Strategic Rationale */}
              <div className="border-t border-stone-800/80 pt-3 mt-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>CTA Style:</span>
                  <span className="text-stone-200 font-semibold px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                    {concept.ctaStyle}
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 italic line-clamp-2">
                  &ldquo;{concept.rationale}&rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Concept Bar & Launch Action */}
      {selectedConcept && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-stone-900 border border-amber-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold flex-shrink-0">
              <CheckCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                  Confirmed Selection:
                </span>
                <span className="text-xs font-bold text-stone-100">
                  {selectedConcept.title}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Ready to pass to Creative Agent (Imagen) and Copy Agent (Gemini).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onConfirmConcept}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-sm rounded-lg shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Confirm & Launch Creative Run</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Human-In-The-Loop Reshaping Box */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-stone-100">
              Want Something Different? Reshape with Free-Text Feedback
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            Ideation Agent Loop
          </span>
        </div>

        <p className="text-xs text-stone-400">
          Type your ideas or feedback below. The Ideation agent will incorporate your notes, reshape the structured angles, and regenerate a fresh batch of 3–5 concepts.
        </p>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5">
          {sampleFeedbackPills.map((pill, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFeedbackText(pill)}
              className="text-[11px] bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 text-stone-300 rounded-full px-2.5 py-1 transition-colors"
            >
              + {pill}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleReshapeSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={2}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="e.g. Focus on software engineers with back fatigue. Let's make the hook sharper and challenge the status quo..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isReshaping || !feedbackText.trim()}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isReshaping ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Reshaping Concepts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reshape Concepts with Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

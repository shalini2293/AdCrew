import React, { useState } from "react";
import { AdStudioRun, IterationAttempt } from "../types";
import { CriticScoreCard } from "./CriticScoreCard";
import { ModelDiagnosticCard } from "./ModelDiagnosticCard";
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  Download,
  RefreshCw,
  Eye,
  GitBranch,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  Cpu,
} from "lucide-react";

interface ResultsViewProps {
  run: AdStudioRun;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ run, onReset }) => {
  const isApproved = run.status === "completed";
  const [activeIterationIdx, setActiveIterationIdx] = useState<number>(
    isApproved && run.passAttemptNumber
      ? run.passAttemptNumber - 1
      : run.bestAttemptIndex
  );
  const [copied, setCopied] = useState(false);

  const activeAttempt: IterationAttempt =
    run.attempts[activeIterationIdx] || run.attempts[0];

  const handleCopyCopy = () => {
    const textToCopy = `HEADLINE:\n${activeAttempt.headline}\n\nBODY CAPTION:\n${activeAttempt.caption}\n\nCTA:\n${activeAttempt.ctaText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = activeAttempt.imageUrl;
    link.download = `adcrew-${run.concept.hookType}-iteration${activeAttempt.iteration}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Top Status Banner */}
      <div
        className={`rounded-2xl p-6 border shadow-2xl transition-all ${
          isApproved
            ? "bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-900 border-emerald-500/40"
            : "bg-gradient-to-r from-rose-950/40 via-stone-900 to-stone-900 border-rose-500/40"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                isApproved
                  ? "bg-emerald-500 text-stone-950"
                  : "bg-rose-500 text-stone-950"
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <AlertTriangle className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-100 tracking-tight font-display">
                  {isApproved
                    ? `Ad Creative Approved & Shipped (Pass@${run.passAttemptNumber})`
                    : "Critic Gate: Unapproved (Failed After 3 Iterations)"}
                </h1>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isApproved
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {isApproved
                    ? `Passed at Iteration #${run.passAttemptNumber}`
                    : "Not Shipped — Brand Safety Protected"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-3xl">
                {isApproved
                  ? `The Critic Agent passed this creative asset on all four dimensions (Aesthetics, Brand Fit, Product Faithfulness, Audience Sentiment). The asset is certified production-ready.`
                  : `AdCrew strictly refuses to force through substandard or unfaithful creative. Across 3 iteration loops, the Critic identified criteria failures. Below is the highest-scoring attempt with full transparent reasoning.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-semibold border border-stone-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Start New Creative Run</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: The Final Asset & Feed Mockup (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h2 className="text-base font-bold text-stone-100 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Production Creative Mockup</span>
            </h2>
            <span className="text-[11px] font-mono text-stone-400">
              Attempt #{activeAttempt.iteration} Preview
            </span>
          </div>

          {/* Social Feed Ad Mockup Frame */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Ad Header */}
            <div className="p-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-stone-950 font-bold text-xs">
                  {run.brand.brandName.slice(0, 1)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-200">
                    {run.brand.brandName}
                  </h4>
                  <p className="text-[10px] text-stone-500 font-mono">
                    Sponsored &bull; {run.concept.hookType}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                AdCrew Verified
              </span>
            </div>

            {/* Ad Visual Image */}
            <div className="relative aspect-square w-full bg-stone-900 overflow-hidden group">
              <img
                src={activeAttempt.imageUrl}
                alt={activeAttempt.headline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Hook Badge Overlay */}
              <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-sm border border-stone-800 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-amber-300 shadow-lg">
                {run.concept.hookType}
              </div>

              {/* Image Engine Badge */}
              <div className="absolute top-3 right-3 bg-stone-950/85 backdrop-blur-sm border border-stone-800 px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center space-x-1 shadow-lg">
                <Cpu className="w-3 h-3 text-amber-400" />
                <span className="text-stone-300">
                  {activeAttempt.imageSource === "imagen-3"
                    ? "Imagen 3 (Photorealistic)"
                    : activeAttempt.imageSource === "gemini-flash-image"
                    ? "Flash Image Gen"
                    : "Vector Graphic Art"}
                </span>
              </div>

              {/* Quick Download Overlay on Hover */}
              <button
                type="button"
                onClick={handleDownloadImage}
                className="absolute bottom-3 right-3 bg-stone-950/80 hover:bg-stone-900 text-stone-200 p-2 rounded-lg border border-stone-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Download full resolution image"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Ad Copywriting Body */}
            <div className="p-4 space-y-3 bg-stone-950">
              {/* Headline */}
              <h3 className="text-base font-extrabold text-stone-100 tracking-tight leading-snug">
                {activeAttempt.headline}
              </h3>

              {/* Caption */}
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {activeAttempt.caption}
              </p>

              {/* CTA Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-800/80">
                <span className="text-[11px] text-stone-500 font-mono">
                  Target CTA:
                </span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <span>{activeAttempt.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions for Creative */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyCopy}
              className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>{copied ? "Copied Copywriting!" : "Copy Ad Copy"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadImage}
              className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Image</span>
            </button>
          </div>

          {/* Asset Lineage Card */}
          <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-stone-200 border-b border-stone-800 pb-2">
              <GitBranch className="w-4 h-4 text-amber-400" />
              <span>Concept Lineage Tracking</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono block">
                  Origin Concept:
                </span>
                <span className="font-medium text-stone-200">
                  {run.concept.title}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono block">
                  Origin Source:
                </span>
                <span className="font-mono text-stone-200 capitalize">
                  {run.concept.origin === "blended"
                    ? "Blended Feedback"
                    : "Agent Suggested"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono block">
                  Hook Archetype:
                </span>
                <span className="font-mono text-amber-400 capitalize">
                  {run.concept.hookType}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono block">
                  CTA Style:
                </span>
                <span className="font-mono text-stone-200">
                  {run.concept.ctaStyle}
                </span>
              </div>
            </div>

            <div className="border-t border-stone-800/80 pt-2 text-[11px] text-stone-400">
              <span className="text-stone-500 font-mono text-[10px] uppercase block mb-0.5">
                Suggested Visual Direction:
              </span>
              <p className="line-clamp-2 italic">
                "{run.concept.suggestedVisualDirection}"
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Critic Score Breakdown & Iteration History (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Iteration Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-stone-100">
                Critic Gate Audit & Iteration Timeline
              </h2>
            </div>

            {/* Iteration Selector Pill Tabs */}
            <div className="flex items-center space-x-1.5 bg-stone-950 p-1 rounded-lg border border-stone-800">
              {run.attempts.map((att, idx) => {
                const isSelected = activeIterationIdx === idx;
                return (
                  <button
                    key={att.iteration}
                    type="button"
                    onClick={() => setActiveIterationIdx(idx)}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                      isSelected
                        ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                        : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
                    }`}
                  >
                    <span>Attempt #{att.iteration}</span>
                    {att.passed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Iteration Progression Story Banner */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-stone-200">
                Viewing Iteration #{activeAttempt.iteration}
              </span>
              <span className="text-stone-500">&bull;</span>
              <span className="text-stone-400 font-mono">
                Average: {activeAttempt.criticScore.averageScore} / 10
              </span>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                activeAttempt.passed
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {activeAttempt.passed ? "Gate Passed" : "Gate Rejected"}
            </span>
          </div>

          {/* Comprehensive Critic Score Card Component */}
          <CriticScoreCard
            score={activeAttempt.criticScore}
            iteration={activeAttempt.iteration}
            title={`Self-Evaluating Critic Audit (Attempt #${activeAttempt.iteration})`}
            isDetailed={true}
          />

          {/* Model Status & Error Diagnostics for this attempt or pipeline */}
          {(activeAttempt.modelDiagnostics && activeAttempt.modelDiagnostics.length > 0) ||
          (run.modelErrors && run.modelErrors.length > 0) ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  Model Execution Diagnostics & Fallback Notes (
                  {(activeAttempt.modelDiagnostics || run.modelErrors || []).length}
                  )
                </span>
              </div>
              <div className="space-y-2.5">
                {(activeAttempt.modelDiagnostics || run.modelErrors || []).map(
                  (diag, dIdx) => (
                    <ModelDiagnosticCard key={dIdx} diagnostic={diag} />
                  )
                )}
              </div>
            </div>
          ) : null}

          {/* Creative Prompt Transparency */}
          <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Creative Agent's Imagen Prompt (Attempt #{activeAttempt.iteration})</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                Art Direction Specification
              </span>
            </div>
            <p className="text-xs text-stone-300 font-mono bg-stone-950 p-3 rounded-lg border border-stone-800/80 leading-relaxed select-all">
              {activeAttempt.imagePrompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

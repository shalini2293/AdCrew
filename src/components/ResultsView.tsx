import React, { useState, useEffect } from "react";
import { AdStudioRun, IterationAttempt, ModelErrorDetail } from "../types";
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
  Camera,
  Zap,
  SlidersHorizontal,
  Loader2,
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

  // Dynamic overrides per iteration when user opts for a different model
  const [overriddenImages, setOverriddenImages] = useState<{
    [idx: number]: {
      url: string;
      source: string;
      diagnostics?: ModelErrorDetail[];
    };
  }>({});

  const [isSwitchingModel, setIsSwitchingModel] = useState(false);
  const [activeSwitchModel, setActiveSwitchModel] = useState<string | null>(null);
  const [modelSwitchToast, setModelSwitchToast] = useState<{
    type: "success" | "warning";
    message: string;
  } | null>(null);

  const displayImageUrl =
    overriddenImages[activeIterationIdx]?.url || activeAttempt.imageUrl;
  const displayImageSource =
    overriddenImages[activeIterationIdx]?.source || activeAttempt.imageSource;
  const currentDiagnostics = [
    ...(activeAttempt.modelDiagnostics || run.modelErrors || []),
    ...(overriddenImages[activeIterationIdx]?.diagnostics || []),
  ];

  // Auto-dismiss toast
  useEffect(() => {
    if (modelSwitchToast) {
      const t = setTimeout(() => setModelSwitchToast(null), 4500);
      return () => clearTimeout(t);
    }
  }, [modelSwitchToast]);

  const handleCopyCopy = () => {
    const textToCopy = `HEADLINE:\n${activeAttempt.headline}\n\nBODY CAPTION:\n${activeAttempt.caption}\n\nCTA:\n${activeAttempt.ctaText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = displayImageUrl;
    link.download = `adcrew-${run.concept.hookType}-iteration${activeAttempt.iteration}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSwitchModel = async (newModelChoice: string) => {
    try {
      setIsSwitchingModel(true);
      setActiveSwitchModel(newModelChoice);

      const res = await fetch("/api/agents/switch-image-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: run.product,
          concept: run.concept,
          brand: run.brand,
          modelChoice: newModelChoice,
          iteration: activeAttempt.iteration,
          refinedPrompt: activeAttempt.imagePrompt,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      const data = await res.json();
      setOverriddenImages((prev) => ({
        ...prev,
        [activeIterationIdx]: {
          url: data.imageUrl,
          source: data.imageSource,
          diagnostics: data.modelDiagnostics,
        },
      }));

      const modelLabel =
        data.imageSource === "commercial-photo"
          ? "Commercial Studio Photography (1080p)"
          : data.imageSource === "pollinations-turbo"
          ? "Pollinations Turbo (Fast AI)"
          : data.imageSource === "pollinations-flux"
          ? "Pollinations Flux (Deep AI)"
          : data.imageSource === "imagen-3"
          ? "Google Imagen 3"
          : "Vector Graphic Art";

      setModelSwitchToast({
        type: "success",
        message: `Opted for ${modelLabel}. Ad mockup updated immediately!`,
      });
    } catch (err: any) {
      console.error("Error switching image model:", err);
      setModelSwitchToast({
        type: "warning",
        message: `Could not reach ${newModelChoice}. Retained current image.`,
      });
    } finally {
      setIsSwitchingModel(false);
      setActiveSwitchModel(null);
    }
  };

  const getImageSourceLabel = (src?: string) => {
    switch (src) {
      case "commercial-photo":
        return "Commercial Studio Photo (1080p)";
      case "pollinations-turbo":
        return "Pollinations Turbo (Fast AI)";
      case "pollinations-flux":
        return "Pollinations Flux (Deep AI)";
      case "imagen-3":
        return "Google Imagen 3 (Photoreal)";
      case "gemini-flash-image":
        return "Gemini Flash Image Gen";
      default:
        return "Vector Graphic Art";
    }
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
                src={displayImageUrl}
                alt={activeAttempt.headline}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  console.warn("Mockup image failed to render, applying commercial photo fallback");
                  e.currentTarget.src = "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1080&q=85";
                }}
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
                  {getImageSourceLabel(displayImageSource)}
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

          {/* Model Engine Switcher Panel */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-stone-200">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Opt for Different Visual Model</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {isSwitchingModel ? "Switching..." : getImageSourceLabel(displayImageSource)}
              </span>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              If an image generation model was unavailable, throttled, or didn't meet visual criteria, opt for an alternate model below to re-render this mockup instantly:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSwitchingModel}
                onClick={() => handleSwitchModel("commercial-photo")}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  displayImageSource === "commercial-photo"
                    ? "bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm"
                    : "bg-stone-950/70 border-stone-800 hover:border-stone-700 text-stone-300"
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Studio Photo</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1">Guaranteed 1080p Photo</span>
              </button>

              <button
                type="button"
                disabled={isSwitchingModel}
                onClick={() => handleSwitchModel("pollinations-turbo")}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  displayImageSource === "pollinations-turbo"
                    ? "bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-sm"
                    : "bg-stone-950/70 border-stone-800 hover:border-stone-700 text-stone-300"
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pollinations Turbo</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1">Fast 2s AI Generation</span>
              </button>

              <button
                type="button"
                disabled={isSwitchingModel}
                onClick={() => handleSwitchModel("pollinations-flux")}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  displayImageSource === "pollinations-flux"
                    ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-200 shadow-sm"
                    : "bg-stone-950/70 border-stone-800 hover:border-stone-700 text-stone-300"
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Pollinations Flux</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1">Deep Photoreal AI</span>
              </button>

              <button
                type="button"
                disabled={isSwitchingModel}
                onClick={() => handleSwitchModel("imagen-3")}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  displayImageSource === "imagen-3"
                    ? "bg-sky-500/15 border-sky-500/50 text-sky-200 shadow-sm"
                    : "bg-stone-950/70 border-stone-800 hover:border-stone-700 text-stone-300"
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  <span>Google Imagen 3</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1">Direct Gemini API</span>
              </button>
            </div>

            {isSwitchingModel && (
              <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                <span>
                  Opting for {activeSwitchModel}... If model is unavailable or queued, will auto-cascade to alternate engine.
                </span>
              </div>
            )}

            {modelSwitchToast && (
              <div
                className={`text-xs p-2.5 rounded-lg border flex items-center space-x-1.5 ${
                  modelSwitchToast.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{modelSwitchToast.message}</span>
              </div>
            )}
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
          {currentDiagnostics.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  Model Execution Diagnostics & Fallback Notes ({currentDiagnostics.length})
                </span>
              </div>
              <div className="space-y-2.5">
                {currentDiagnostics.map((diag, dIdx) => (
                  <ModelDiagnosticCard key={dIdx} diagnostic={diag} />
                ))}
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

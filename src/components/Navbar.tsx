import React from "react";
import { Sparkles, ShieldCheck, Layers, RefreshCw, Cpu } from "lucide-react";

interface NavbarProps {
  currentStep: "brief" | "concepts" | "pipeline" | "results";
  onReset: () => void;
  onOpenModelStatus?: () => void;
  isGenerating?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onReset,
  onOpenModelStatus,
  isGenerating,
}) => {
  const steps = [
    { id: "brief", label: "1. Brief & Brand" },
    { id: "concepts", label: "2. Concept Review" },
    { id: "pipeline", label: "3. Agent Studio" },
    { id: "results", label: "4. Critic Audit & Ship" },
  ];

  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-stone-100 tracking-tight font-display">
                AdCrew
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Multi-Agent Studio
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              Human-in-the-Loop Concepting &bull; Self-Evaluating Critic Gate
            </p>
          </div>
        </div>

        {/* Workflow Breadcrumb Navigation */}
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isPassed =
              (currentStep === "concepts" && idx === 0) ||
              (currentStep === "pipeline" && idx <= 1) ||
              (currentStep === "results" && idx <= 2);

            return (
              <div key={step.id} className="flex items-center">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
                    isActive
                      ? "bg-amber-500 text-stone-950 font-semibold shadow-sm"
                      : isPassed
                      ? "text-stone-300 bg-stone-900 border border-stone-800"
                      : "text-stone-500"
                  }`}
                >
                  {step.label}
                </span>
                {idx < steps.length - 1 && (
                  <span className="text-stone-700 mx-1">&rsaquo;</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Reset & Status Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onOpenModelStatus && (
            <button
              type="button"
              onClick={onOpenModelStatus}
              className="flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900/60 text-stone-300 hover:text-stone-100 hover:bg-stone-900 hover:border-amber-500/30 transition-colors"
              title="Inspect AI models and connectivity status"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Model Diagnostics</span>
              <span className="sm:hidden">Status</span>
            </button>
          )}

          <div className="hidden lg:flex items-center space-x-2 text-xs text-stone-400 border-r border-stone-800 pr-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Critic Gate</span>
          </div>

          <button
            type="button"
            onClick={onReset}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-900 transition-colors disabled:opacity-50"
            title="Start a new ad run"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Run</span>
          </button>
        </div>
      </div>
    </header>
  );
};

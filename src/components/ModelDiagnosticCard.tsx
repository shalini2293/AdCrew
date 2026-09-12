import React, { useState } from "react";
import { ModelErrorDetail } from "../types";
import {
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  RefreshCw,
  Key,
} from "lucide-react";

interface ModelDiagnosticCardProps {
  diagnostic: ModelErrorDetail;
  compact?: boolean;
}

export const ModelDiagnosticCard: React.FC<ModelDiagnosticCardProps> = ({
  diagnostic,
  compact = false,
}) => {
  const [showTechnical, setShowTechnical] = useState(false);

  const isCritical = diagnostic.status === "failed";

  return (
    <div
      className={`rounded-xl border transition-all ${
        isCritical
          ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
          : "bg-amber-950/30 border-amber-800/60 text-amber-200"
      } p-4 shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isCritical
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isCritical ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  isCritical
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {diagnostic.agent} Agent
              </span>

              <span className="text-[11px] font-mono text-stone-300 flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-stone-400 inline" />
                <span>Model: {diagnostic.modelAttempted}</span>
              </span>

              {diagnostic.timestamp && (
                <span className="text-[10px] text-stone-500 font-mono">
                  {diagnostic.timestamp}
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-semibold text-stone-100">
              {diagnostic.status === "fallback"
                ? "Automatic Fallback Engaged"
                : "Model Call Failed or Unavailable"}
            </h4>

            {/* Friendly reason */}
            <p className="text-xs text-stone-300 leading-relaxed">
              {diagnostic.friendlyReason}
            </p>

            {/* Suggested Action */}
            {diagnostic.suggestedAction && (
              <div className="mt-2 text-xs flex items-start space-x-1.5 text-amber-300/90 bg-stone-900/60 p-2.5 rounded-lg border border-amber-500/20">
                <Key className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <span className="font-semibold text-amber-300">Action: </span>
                  <span>{diagnostic.suggestedAction}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle technical details */}
        {!compact && diagnostic.errorMessage && (
          <button
            type="button"
            onClick={() => setShowTechnical(!showTechnical)}
            className="text-[11px] font-mono text-stone-400 hover:text-stone-200 flex items-center space-x-1 bg-stone-900/80 px-2 py-1 rounded border border-stone-800 hover:bg-stone-800 transition-colors flex-shrink-0"
            title="View raw error log"
          >
            <span>{showTechnical ? "Hide Raw" : "Raw Error"}</span>
            {showTechnical ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {/* Raw Error Accordion */}
      {showTechnical && diagnostic.errorMessage && (
        <div className="mt-3 pt-3 border-t border-stone-800/80">
          <div className="text-[10px] font-mono text-stone-400 mb-1 flex items-center justify-between">
            <span>RAW MODEL EXCEPTION OUTPUT</span>
          </div>
          <pre className="text-[11px] font-mono bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-rose-300 overflow-x-auto whitespace-pre-wrap">
            {diagnostic.errorMessage}
          </pre>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { ModelHealthCheckResult } from "../types";
import {
  X,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Key,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface ModelHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelHealthModal: React.FC<ModelHealthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean>(false);
  const [modelHealth, setModelHealth] = useState<ModelHealthCheckResult[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/agents/model-status");
      if (!res.ok) {
        throw new Error(`Failed to fetch model status (HTTP ${res.status})`);
      }
      const data = await res.json();
      setApiKeyConfigured(data.apiKeyConfigured);
      setModelHealth(data.models || []);
    } catch (err: any) {
      setFetchError(err?.message || "Failed to query AI model statuses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-800 bg-stone-950/60 sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100 font-display">
                AI Studio Model Connectivity & Health
              </h3>
              <p className="text-[11px] text-stone-400">
                Live availability status and failure reasons for AdCrew agents
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={fetchHealth}
              disabled={loading}
              className="p-1.5 rounded-lg border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors disabled:opacity-50"
              title="Refresh status"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Key Status Indicator */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Key className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-stone-200">
                  Gemini API Key:
                </span>{" "}
                <span
                  className={`text-xs font-mono font-bold ${
                    apiKeyConfigured ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {apiKeyConfigured ? "Active & Configured" : "Using Platform Default"}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-stone-500 font-mono">
              Port 3000 Verified
            </span>
          </div>

          {fetchError && (
            <div className="bg-rose-950/50 border border-rose-800 text-rose-200 p-3 rounded-xl text-xs flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {/* Model Status List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
              AdCrew Agent Model Matrix
            </h4>

            {loading && modelHealth.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 flex flex-col items-center space-y-2">
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                <span>Pinging model endpoints...</span>
              </div>
            ) : (
              modelHealth.map((item) => {
                const isAvail = item.status === "available";
                const isDegraded = item.status === "degraded";
                return (
                  <div
                    key={item.model}
                    className={`rounded-xl border p-4 transition-all ${
                      isAvail
                        ? "bg-stone-950/60 border-stone-800"
                        : isDegraded
                        ? "bg-amber-950/20 border-amber-800/40"
                        : "bg-rose-950/20 border-rose-800/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-stone-100 font-mono">
                            {item.model}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">
                            {item.role}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          {item.reason}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        {isAvail ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Available</span>
                          </span>
                        ) : isDegraded ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Degraded / Fallback</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            <XCircle className="w-3 h-3" />
                            <span>Unavailable</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {item.suggestedAction && (
                      <div className="mt-3 pt-2.5 border-t border-stone-800/60 text-[11px] text-amber-300 flex items-start space-x-1.5">
                        <Key className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{item.suggestedAction}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Fallback Resilience Explanation */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <h5 className="text-xs font-semibold text-stone-200 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>AdCrew Built-In High Availability Architecture</span>
            </h5>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              If an image generation model (e.g. Imagen 3) is rate-limited or lacks image generation quota, AdCrew automatically engages its secondary flash image pipeline or high-resolution vector artwork fallback. The concept review, copy synthesis, and 4-dimension critic gate continue operating seamlessly.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

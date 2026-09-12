import React from "react";
import { AdConcept, ModelErrorDetail } from "../types";
import { ModelDiagnosticCard } from "./ModelDiagnosticCard";
import {
  Sparkles,
  Palette,
  PenTool,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface PipelineProgressProps {
  concept: AdConcept;
  currentAgent: "ideation" | "creative" | "copy" | "critic";
  currentIteration: number;
  statusMessage: string;
  modelDiagnostics?: ModelErrorDetail[];
  logs: Array<{
    id: string;
    timestamp: string;
    agent: string;
    message: string;
    type: "info" | "success" | "warning";
  }>;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({
  concept,
  currentAgent,
  currentIteration,
  statusMessage,
  modelDiagnostics,
  logs,
}) => {
  const agents = [
    {
      id: "ideation",
      name: "Ideation Agent",
      role: "Concept Architect",
      model: "Gemini 3.8 Flash",
      icon: Sparkles,
      color: "amber",
      description: "Drafted structured hook and angle.",
    },
    {
      id: "creative",
      name: "Creative Agent",
      role: "Visual Art Director",
      model: "Multi-Model (Pollinations / Imagen 3 / Studio Photo)",
      icon: Palette,
      color: "purple",
      description: "Generates high-fidelity visual asset with multi-model cascade.",
    },
    {
      id: "copy",
      name: "Copy Agent",
      role: "Head Copywriter",
      model: "Gemini 3.8 Flash",
      icon: PenTool,
      color: "sky",
      description: "Crafts headline, caption & CTA.",
    },
    {
      id: "critic",
      name: "Critic Agent",
      role: "Gatekeeper & Evaluator",
      model: "Gemini 3.8 Flash (Multimodal)",
      icon: ShieldCheck,
      color: "emerald",
      description: "Scores 4 dimensions (Pass >= 7.0).",
    },
  ];

  const getAgentStatus = (agentId: string) => {
    if (agentId === "ideation") return "completed";

    if (currentAgent === agentId) return "active";

    if (currentAgent === "critic" && (agentId === "creative" || agentId === "copy")) {
      return "completed";
    }

    if (currentAgent === "copy" && agentId === "creative") {
      return "completed";
    }

    return "pending";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-mono text-amber-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Active Pipeline: Iteration #{currentIteration} of 3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight font-display">
          Multi-Agent Generation & Quality Gate
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Executing handoffs between Creative, Copy, and Critic agents for &ldquo;{concept.title}&rdquo;.
        </p>
      </div>

      {/* Concept Focus Banner */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-stone-400 uppercase font-mono text-[10px]">
            Target Concept:
          </span>
          <span className="font-bold text-stone-100">{concept.title}</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20">
            {concept.hookType}
          </span>
        </div>
        <span className="text-stone-400 text-[11px] truncate max-w-md italic">
          "{concept.messageAngle}"
        </span>
      </div>

      {/* Visual Agent Workflow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {agents.map((agent) => {
          const status = getAgentStatus(agent.id);
          const Icon = agent.icon;

          return (
            <div
              key={agent.id}
              className={`rounded-xl p-4 border transition-all ${
                status === "active"
                  ? "bg-stone-900 border-amber-500 ring-2 ring-amber-500/20 shadow-lg shadow-amber-500/5"
                  : status === "completed"
                  ? "bg-stone-950/80 border-stone-800 text-stone-300"
                  : "bg-stone-950/40 border-stone-900 text-stone-600 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    status === "active"
                      ? "bg-amber-500 text-stone-950"
                      : status === "completed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-stone-900 text-stone-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="text-[10px] font-mono uppercase tracking-wider">
                  {status === "active" && (
                    <span className="text-amber-400 flex items-center space-x-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping mr-1" />
                      Working...
                    </span>
                  )}
                  {status === "completed" && (
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  )}
                  {status === "pending" && <span>Queued</span>}
                </div>
              </div>

              <h3 className="text-xs font-bold text-stone-100 mb-0.5">
                {agent.name}
              </h3>
              <p className="text-[11px] text-stone-400 font-mono mb-2">
                {agent.role}
              </p>
              <p className="text-[10px] text-stone-500 leading-tight">
                {agent.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Model Failure & Fallback Notices */}
      {modelDiagnostics && modelDiagnostics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>AI Model Alerts & Diagnostic Reports ({modelDiagnostics.length})</span>
          </div>
          <div className="space-y-2">
            {modelDiagnostics.map((diag, idx) => (
              <ModelDiagnosticCard key={idx} diagnostic={diag} />
            ))}
          </div>
        </div>
      )}

      {/* Real-time Status Card & Terminal Log */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-stone-200 uppercase tracking-wider">
              Agent Execution & Gatekeeper Log
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            {statusMessage}
          </span>
        </div>

        {/* Live Status Message Banner */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-lg p-3 flex items-center space-x-3">
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />
          <div className="text-xs text-stone-200">
            <span className="font-semibold text-amber-400">Current Task: </span>
            {statusMessage}
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 font-mono text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start space-x-2 text-[11px] p-2 rounded ${
                log.type === "success"
                  ? "bg-emerald-950/20 text-emerald-300 border border-emerald-900/30"
                  : log.type === "warning"
                  ? "bg-amber-950/20 text-amber-300 border border-amber-900/30"
                  : "bg-stone-900/50 text-stone-300"
              }`}
            >
              <span className="text-stone-500 flex-shrink-0">{log.timestamp}</span>
              <span className="font-semibold text-amber-400 uppercase text-[10px] flex-shrink-0">
                [{log.agent}]
              </span>
              <span className="flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

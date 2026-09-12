import React from "react";
import { CriticScores } from "../types";
import { ShieldCheck, ShieldAlert, Sparkles, Target, Compass, HeartHandshake } from "lucide-react";

interface CriticScoreCardProps {
  score: CriticScores;
  iteration?: number;
  title?: string;
  isDetailed?: boolean;
}

export const CriticScoreCard: React.FC<CriticScoreCardProps> = ({
  score,
  iteration,
  title = "Critic Gatekeeper Evaluation",
  isDetailed = true,
}) => {
  const dimensions = [
    {
      id: "aesthetic",
      name: "Aesthetic Quality",
      score: score.aestheticQuality,
      reasoning: score.aestheticReasoning,
      icon: Sparkles,
      description: "Visual composition, cinematic lighting, color harmony, and craft.",
      passed: score.aestheticQuality >= 7.0,
    },
    {
      id: "brandFit",
      name: "Brand Fit",
      score: score.brandFit,
      reasoning: score.brandFitReasoning,
      icon: Target,
      description: "Tone-of-voice alignment, visual mood matching, reference ad cadence.",
      passed: score.brandFit >= 7.0,
    },
    {
      id: "faithfulness",
      name: "Product Faithfulness",
      score: score.faithfulness,
      reasoning: score.faithfulnessReasoning,
      icon: Compass,
      description: "Independent audit: Zero feature hallucinations, truthful specs representation.",
      passed: score.faithfulness >= 7.0,
      isStrictIndependent: true,
    },
    {
      id: "audienceSentiment",
      name: "Audience Sentiment",
      score: score.audienceSentiment,
      reasoning: score.audienceSentimentReasoning,
      icon: HeartHandshake,
      description: "Emotional resonance, hook strength, and predicted audience conversion impact.",
      passed: score.audienceSentiment >= 7.0,
    },
  ];

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              score.passed
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {score.passed ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-stone-100">{title}</h3>
              {iteration && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  Iteration #{iteration}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              Pass threshold: all dimensions &ge; 7.0 / 10.0
            </p>
          </div>
        </div>

        {/* Aggregate Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-[11px] text-stone-400 uppercase tracking-wider font-mono">
              Composite
            </div>
            <div className="text-lg font-bold text-stone-100 font-mono">
              {score.averageScore}
              <span className="text-xs text-stone-500">/10</span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 ${
              score.passed
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
            }`}
          >
            {score.passed ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Passed Gate</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Gate Rejected</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Critic Summary */}
      <div className="mb-5 bg-stone-950/60 rounded-lg p-3 border border-stone-800/80">
        <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-1 flex items-center justify-between">
          <span>Critic Verdict & Synthesis</span>
          <span className="text-[10px] text-stone-500 font-sans">
            Independent Self-Evaluation Gate
          </span>
        </div>
        <p className="text-sm text-stone-200 leading-relaxed font-sans">
          {score.summary}
        </p>
      </div>

      {/* 4 Dimension Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensions.map((dim) => {
          const Icon = dim.icon;
          const pct = Math.min(100, Math.max(0, (dim.score / 10) * 100));

          return (
            <div
              key={dim.id}
              className={`rounded-lg p-4 border transition-all ${
                dim.isStrictIndependent
                  ? "bg-stone-950/80 border-amber-500/30"
                  : "bg-stone-950/50 border-stone-800/80"
              }`}
            >
              {/* Dimension Title & Score */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-stone-400" />
                  <span className="text-xs font-semibold text-stone-200">
                    {dim.name}
                  </span>
                  {dim.isStrictIndependent && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20" title="Scored independently; high aesthetics cannot offset low product accuracy">
                      Independent
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1.5 font-mono">
                  <span
                    className={`text-sm font-bold ${
                      dim.passed ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {dim.score.toFixed(1)}
                  </span>
                  <span className="text-xs text-stone-500">/10</span>
                </div>
              </div>

              {/* Score Bar with 7.0 Passing Marker */}
              <div className="relative w-full h-2 bg-stone-800 rounded-full overflow-hidden mb-2.5">
                {/* 7.0 threshold line indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-stone-500 z-10"
                  style={{ left: "70%" }}
                  title="7.0 Passing Line"
                />
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dim.passed ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Threshold info */}
              <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono mb-2">
                <span>0.0</span>
                <span className="text-stone-400">Pass: 7.0</span>
                <span>10.0</span>
              </div>

              {/* Reasoning */}
              {isDetailed && (
                <p className="text-xs text-stone-300 leading-normal border-t border-stone-800/60 pt-2 mt-1">
                  {dim.reasoning}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Revision Directives if Failed */}
      {!score.passed && (score.creativeFeedback || score.copyFeedback) && (
        <div className="mt-4 pt-4 border-t border-stone-800">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2.5 flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Critic Revision Directives Handed to Agents</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {score.creativeFeedback && (
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-3 text-amber-200">
                <span className="font-semibold block mb-1 text-amber-300 font-mono text-[11px]">
                  &gt; Directives for Creative Agent (Visuals)
                </span>
                <p className="leading-relaxed">{score.creativeFeedback}</p>
              </div>
            )}
            {score.copyFeedback && (
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-3 text-amber-200">
                <span className="font-semibold block mb-1 text-amber-300 font-mono text-[11px]">
                  &gt; Directives for Copy Agent (Words)
                </span>
                <p className="leading-relaxed">{score.copyFeedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

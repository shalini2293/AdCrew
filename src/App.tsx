import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { BriefForm } from "./components/BriefForm";
import { ConceptSelection } from "./components/ConceptSelection";
import { PipelineProgress } from "./components/PipelineProgress";
import { ResultsView } from "./components/ResultsView";
import { ModelHealthModal } from "./components/ModelHealthModal";
import { ModelDiagnosticCard } from "./components/ModelDiagnosticCard";
import { PRESET_PRODUCTS } from "./data/presets";
import {
  AdConcept,
  BrandProfile,
  ProductBrief,
  AdStudioRun,
  ModelErrorDetail,
} from "./types";
import { AlertCircle, X, ShieldAlert } from "lucide-react";

export default function App() {
  // Navigation step: 'brief' | 'concepts' | 'pipeline' | 'results'
  const [currentStep, setCurrentStep] = useState<
    "brief" | "concepts" | "pipeline" | "results"
  >("brief");

  // Product Brief & Brand Profile State
  const [product, setProduct] = useState<ProductBrief>({
    ...PRESET_PRODUCTS[0].product,
  });
  const [brand, setBrand] = useState<BrandProfile>({
    ...PRESET_PRODUCTS[0].brand,
  });

  // Concepts state
  const [concepts, setConcepts] = useState<AdConcept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<AdConcept | null>(null);
  const [batchIteration, setBatchIteration] = useState<number>(1);
  const [isGeneratingConcepts, setIsGeneratingConcepts] = useState<boolean>(false);
  const [isReshaping, setIsReshaping] = useState<boolean>(false);
  const [ideationDiagnostic, setIdeationDiagnostic] = useState<ModelErrorDetail | null>(null);

  // Pipeline execution state
  const [currentAgent, setCurrentAgent] = useState<
    "ideation" | "creative" | "copy" | "critic"
  >("creative");
  const [currentIteration, setCurrentIteration] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<string>("Initializing pipeline...");
  const [pipelineDiagnostics, setPipelineDiagnostics] = useState<ModelErrorDetail[]>([]);
  const [logs, setLogs] = useState<
    Array<{
      id: string;
      timestamp: string;
      agent: string;
      message: string;
      type: "info" | "success" | "warning";
    }>
  >([]);

  // Final Result State
  const [runResult, setRunResult] = useState<AdStudioRun | null>(null);

  // Model Health Inspector Modal
  const [showModelHealthModal, setShowModelHealthModal] = useState<boolean>(false);

  // General error state & structured model error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeModelError, setActiveModelError] = useState<ModelErrorDetail | null>(null);

  const addLog = (
    agent: string,
    message: string,
    type: "info" | "success" | "warning" = "info"
  ) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
        agent,
        message,
        type,
      },
    ]);
  };

  // 1. DRAFT INITIAL CONCEPTS (Ideation Agent)
  const handleGenerateConcepts = async () => {
    setIsGeneratingConcepts(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/agents/ideate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          brand,
          existingBatchIteration: 1,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to draft ad concepts.");
      }

      const data = await response.json();
      if (!data.concepts || data.concepts.length === 0) {
        throw new Error("No concepts were drafted. Please check product details.");
      }

      setConcepts(data.concepts);
      setSelectedConcept(data.concepts[0] || null);
      setBatchIteration(1);
      if (data.modelDiagnostic) {
        setIdeationDiagnostic(data.modelDiagnostic);
      } else {
        setIdeationDiagnostic(null);
      }
      setActiveModelError(null);
      setCurrentStep("concepts");
    } catch (err: any) {
      console.error(err);
      const rawMsg = err?.message || "Failed to contact Ideation Agent.";
      setErrorMessage(rawMsg);
      setActiveModelError({
        agent: "ideation",
        modelAttempted: "gemini-3.8-flash",
        status: "failed",
        errorMessage: rawMsg,
        friendlyReason:
          rawMsg.includes("429") || rawMsg.includes("quota")
            ? "API rate limits reached on the Gemini 3.8 Flash ideation model."
            : "The Ideation agent encountered a communication or model unavailability error.",
        suggestedAction:
          "Verify your project quota or check your API key settings. The studio will use backup synthesis if retried.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
    } finally {
      setIsGeneratingConcepts(false);
    }
  };

  // 2. RESHAPE CONCEPTS WITH USER FEEDBACK (Human-In-The-Loop)
  const handleReshapeFeedback = async (feedback: string) => {
    setIsReshaping(true);
    setErrorMessage(null);
    setActiveModelError(null);

    try {
      const response = await fetch("/api/agents/ideate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          brand,
          userFeedback: feedback,
          existingBatchIteration: batchIteration,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to reshape concepts with feedback.");
      }

      const data = await response.json();
      if (!data.concepts || data.concepts.length === 0) {
        throw new Error("No reshaped concepts returned.");
      }

      setConcepts(data.concepts);
      setSelectedConcept(data.concepts[0] || null);
      setBatchIteration((prev) => prev + 1);
      if (data.modelDiagnostic) {
        setIdeationDiagnostic(data.modelDiagnostic);
      }
    } catch (err: any) {
      console.error(err);
      const rawMsg = err?.message || "Failed to reshape concepts.";
      setErrorMessage(rawMsg);
      setActiveModelError({
        agent: "ideation",
        modelAttempted: "gemini-3.8-flash",
        status: "failed",
        errorMessage: rawMsg,
        friendlyReason: "Unable to reach Gemini 3.8 to reshape concepts with your feedback.",
        suggestedAction: "Retry submitting your feedback prompt or verify Gemini API status.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
    } finally {
      setIsReshaping(false);
    }
  };

  // 3. LAUNCH PRODUCTION PIPELINE (Creative + Copy + Critic Gate Loop)
  const handleConfirmAndRun = async () => {
    if (!selectedConcept) return;

    setCurrentStep("pipeline");
    setCurrentAgent("creative");
    setCurrentIteration(1);
    setLogs([]);
    setErrorMessage(null);
    setActiveModelError(null);
    setPipelineDiagnostics([]);

    addLog(
      "Ideation",
      `Confirmed Concept: "${selectedConcept.title}" (${selectedConcept.hookType}). Handing off to Creative Agent.`,
      "info"
    );
    setStatusMessage("Creative Agent is synthesizing art direction and image prompt...");

    // Simulated progress stage updates while backend executes autonomous loop
    const t1 = setTimeout(() => {
      setCurrentAgent("creative");
      setStatusMessage("Creative Agent generating ad image with Imagen...");
      addLog("Creative", "Generating photorealistic visual asset with Imagen...", "info");
    }, 2500);

    const t2 = setTimeout(() => {
      setCurrentAgent("copy");
      setStatusMessage("Copy Agent drafting matching headline, caption, and CTA...");
      addLog("Copy", "Drafting punchy hook headline and body copy aligned with brand voice...", "info");
    }, 7000);

    const t3 = setTimeout(() => {
      setCurrentAgent("critic");
      setStatusMessage("Critic Agent evaluating Quality Gate across 4 independent dimensions...");
      addLog("Critic", "Auditing Aesthetic Quality, Brand Fit, Product Faithfulness, and Audience Sentiment...", "info");
    }, 12000);

    try {
      const response = await fetch("/api/agents/run-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept: selectedConcept,
          product,
          brand,
        }),
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Execution pipeline failed.");
      }

      const runData: AdStudioRun = await response.json();

      // Collect any model errors/diagnostics that occurred during the run
      if (runData.modelErrors && runData.modelErrors.length > 0) {
        setPipelineDiagnostics(runData.modelErrors);
        runData.modelErrors.forEach((diag) => {
          addLog(
            diag.agent,
            `[Notice] ${diag.friendlyReason} (${diag.modelAttempted})`,
            "warning"
          );
        });
      }

      // Log the full iteration history
      runData.attempts.forEach((att) => {
        addLog(
          "Critic",
          `Iteration #${att.iteration}: Overall score ${att.criticScore.averageScore}/10. ${
            att.passed ? "PASSED quality gate!" : "REJECTED by critic. Revisions requested."
          }`,
          att.passed ? "success" : "warning"
        );
      });

      setRunResult(runData);
      setCurrentStep("results");
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      console.error(err);
      const rawMsg = err?.message || "Error running multi-agent creative pipeline.";
      setErrorMessage(rawMsg);
      setActiveModelError({
        agent: "creative",
        modelAttempted: "imagen-3.0-generate-002 + gemini-3.8-flash",
        status: "failed",
        errorMessage: rawMsg,
        friendlyReason:
          "The studio pipeline was interrupted due to a model timeout or API error.",
        suggestedAction:
          "Check model connectivity using the 'Model Diagnostics' button in the top navbar.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
      setCurrentStep("concepts");
    }
  };

  const handleReset = () => {
    setCurrentStep("brief");
    setErrorMessage(null);
    setRunResult(null);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation */}
      <Navbar
        currentStep={currentStep}
        onReset={handleReset}
        onOpenModelStatus={() => setShowModelHealthModal(true)}
        isGenerating={currentStep === "pipeline"}
      />

      {/* Structured Model Error / Unavailable Alert */}
      {activeModelError && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="relative">
            <ModelDiagnosticCard diagnostic={activeModelError} />
            <button
              onClick={() => {
                setActiveModelError(null);
                setErrorMessage(null);
              }}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-200 p-1.5 bg-stone-900/80 rounded-lg border border-stone-800"
              title="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* General Error Notification Banner (if not already displayed as structured model error) */}
      {errorMessage && !activeModelError && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 px-4 py-3 rounded-xl flex items-center justify-between text-xs shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentStep === "brief" && (
          <BriefForm
            product={product}
            setProduct={setProduct}
            brand={brand}
            setBrand={setBrand}
            onGenerateConcepts={handleGenerateConcepts}
            isLoading={isGeneratingConcepts}
          />
        )}

        {currentStep === "concepts" && (
          <ConceptSelection
            concepts={concepts}
            selectedConcept={selectedConcept}
            onSelectConcept={(concept) => setSelectedConcept(concept)}
            onConfirmConcept={handleConfirmAndRun}
            onReshapeFeedback={handleReshapeFeedback}
            onBackToBrief={() => setCurrentStep("brief")}
            isReshaping={isReshaping}
            batchIteration={batchIteration}
            modelDiagnostic={ideationDiagnostic || undefined}
          />
        )}

        {currentStep === "pipeline" && selectedConcept && (
          <PipelineProgress
            concept={selectedConcept}
            currentAgent={currentAgent}
            currentIteration={currentIteration}
            statusMessage={statusMessage}
            modelDiagnostics={pipelineDiagnostics}
            logs={logs}
          />
        )}

        {currentStep === "results" && runResult && (
          <ResultsView run={runResult} onReset={handleReset} />
        )}
      </main>

      {/* Live AI Studio Model Connectivity & Health Modal */}
      <ModelHealthModal
        isOpen={showModelHealthModal}
        onClose={() => setShowModelHealthModal(false)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-6 text-center text-xs text-stone-500 bg-stone-950/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            AdCrew Studio &bull; Multi-Agent AI Advertising with Human-In-The-Loop Review
          </span>
          <span className="font-mono text-[11px] text-stone-400">
            Powered by Gemini 3.8 &bull; Imagen 3 &bull; Self-Evaluating Critic Gate
          </span>
        </div>
      </footer>
    </div>
  );
}

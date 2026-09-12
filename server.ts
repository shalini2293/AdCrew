import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import {
  runIdeationAgent,
  runCreativeAgent,
  runCopyAgent,
  runCriticAgent,
  checkModelHealth,
} from "./server/agents.js";
import { AdStudioRun, IterationAttempt, ModelErrorDetail } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for image data URLs
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// ----------------------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "AdCrew Multi-Agent Creative Studio API",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Live Model Health & Connectivity Inspector
 */
app.get("/api/agents/model-status", async (_req, res) => {
  try {
    const models = await checkModelHealth();
    return res.json({
      status: "ok",
      apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
      models,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || "Failed to inspect model health status.",
    });
  }
});

/**
 * 1. Ideation Agent Endpoint
 * Generates 3-5 distinct ad concepts or reshapes them with user feedback
 */
app.post("/api/agents/ideate", async (req, res) => {
  try {
    const { product, brand, userFeedback, existingBatchIteration } = req.body;

    if (!product || !brand) {
      return res
        .status(400)
        .json({ error: "Missing required product or brand details." });
    }

    const { concepts, modelDiagnostic } = await runIdeationAgent({
      product,
      brand,
      userFeedback,
      existingBatchIteration: existingBatchIteration || 1,
    });

    return res.json({ concepts, modelDiagnostic });
  } catch (error: any) {
    console.error("Ideation agent error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate ad concepts.",
    });
  }
});

/**
 * 2. Single Iteration Step Endpoint (Useful for fine-grained progress or step-by-step UI)
 */
app.post("/api/agents/execute-iteration", async (req, res) => {
  try {
    const {
      concept,
      product,
      brand,
      iteration = 1,
      criticFeedback,
    } = req.body;

    if (!concept || !product || !brand) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // Step A: Creative Agent produces image prompt & image
    const creativeResult = await runCreativeAgent({
      concept,
      product,
      brand,
      iteration,
      criticFeedback: criticFeedback?.creativeFeedback,
    });

    // Step B: Copy Agent produces headline, caption & CTA
    const copyResult = await runCopyAgent({
      concept,
      product,
      brand,
      imagePrompt: creativeResult.imagePrompt,
      iteration,
      criticFeedback: criticFeedback?.copyFeedback,
    });

    // Step C: Critic Agent evaluates all dimensions
    const criticResult = await runCriticAgent({
      concept,
      product,
      brand,
      attempt: {
        iteration,
        imagePrompt: creativeResult.imagePrompt,
        imageUrl: creativeResult.imageUrl,
        headline: copyResult.headline,
        caption: copyResult.caption,
        ctaText: copyResult.ctaText,
      },
    });

    const diagnostics: ModelErrorDetail[] = [
      ...(creativeResult.modelDiagnostics || []),
      ...(copyResult.modelDiagnostic ? [copyResult.modelDiagnostic] : []),
      ...(criticResult.modelDiagnostic ? [criticResult.modelDiagnostic] : []),
    ];

    const attempt: IterationAttempt = {
      iteration,
      timestamp: Date.now(),
      imagePrompt: creativeResult.imagePrompt,
      imageUrl: creativeResult.imageUrl,
      imageSource: creativeResult.imageSource,
      headline: copyResult.headline,
      caption: copyResult.caption,
      ctaText: copyResult.ctaText,
      criticScore: criticResult.scores,
      passed: criticResult.scores.passed,
      modelDiagnostics: diagnostics.length > 0 ? diagnostics : undefined,
    };

    return res.json({ attempt, passed: criticResult.scores.passed });
  } catch (error: any) {
    console.error("Execute iteration error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to execute creative iteration.",
    });
  }
});

/**
 * 3. Complete Self-Evaluating Pipeline Endpoint
 * Autonomous loop: Creative -> Copy -> Critic -> Gatekeeper check (up to 3 attempts)
 */
app.post("/api/agents/run-pipeline", async (req, res) => {
  try {
    const { concept, product, brand } = req.body;

    if (!concept || !product || !brand) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    const runId = `run-${Date.now()}`;
    const attempts: IterationAttempt[] = [];
    const allRunModelErrors: ModelErrorDetail[] = [];
    const MAX_ITERATIONS = 3;

    let currentIteration = 1;
    let isApproved = false;
    let passAttemptNumber: number | undefined = undefined;
    let lastCreativeFeedback = "";
    let lastCopyFeedback = "";

    while (currentIteration <= MAX_ITERATIONS && !isApproved) {
      console.log(`[AdCrew] Starting Iteration #${currentIteration} for concept: "${concept.title}"`);

      // Creative Agent
      const creativeResult = await runCreativeAgent({
        concept,
        product,
        brand,
        iteration: currentIteration,
        criticFeedback: lastCreativeFeedback,
      });
      if (creativeResult.modelDiagnostics?.length) {
        allRunModelErrors.push(...creativeResult.modelDiagnostics);
      }

      // Copy Agent
      const copyResult = await runCopyAgent({
        concept,
        product,
        brand,
        imagePrompt: creativeResult.imagePrompt,
        iteration: currentIteration,
        criticFeedback: lastCopyFeedback,
      });
      if (copyResult.modelDiagnostic) {
        allRunModelErrors.push(copyResult.modelDiagnostic);
      }

      // Critic Agent
      const criticResult = await runCriticAgent({
        concept,
        product,
        brand,
        attempt: {
          iteration: currentIteration,
          imagePrompt: creativeResult.imagePrompt,
          imageUrl: creativeResult.imageUrl,
          headline: copyResult.headline,
          caption: copyResult.caption,
          ctaText: copyResult.ctaText,
        },
      });
      if (criticResult.modelDiagnostic) {
        allRunModelErrors.push(criticResult.modelDiagnostic);
      }

      const iterationDiagnostics: ModelErrorDetail[] = [
        ...(creativeResult.modelDiagnostics || []),
        ...(copyResult.modelDiagnostic ? [copyResult.modelDiagnostic] : []),
        ...(criticResult.modelDiagnostic ? [criticResult.modelDiagnostic] : []),
      ];

      const attemptRecord: IterationAttempt = {
        iteration: currentIteration,
        timestamp: Date.now(),
        imagePrompt: creativeResult.imagePrompt,
        imageUrl: creativeResult.imageUrl,
        imageSource: creativeResult.imageSource,
        headline: copyResult.headline,
        caption: copyResult.caption,
        ctaText: copyResult.ctaText,
        criticScore: criticResult.scores,
        passed: criticResult.scores.passed,
        modelDiagnostics: iterationDiagnostics.length > 0 ? iterationDiagnostics : undefined,
      };

      attempts.push(attemptRecord);

      if (criticResult.scores.passed) {
        isApproved = true;
        passAttemptNumber = currentIteration;
        console.log(`[AdCrew] Passed Quality Gate at iteration #${currentIteration}!`);
        break;
      } else {
        console.log(
          `[AdCrew] Failed Quality Gate at iteration #${currentIteration}. Critic feedback: ${criticResult.scores.summary}`
        );
        lastCreativeFeedback = criticResult.scores.creativeFeedback;
        lastCopyFeedback = criticResult.scores.copyFeedback;
        currentIteration++;
      }
    }

    // Find the best attempt (if passed, it's the passing one; if failed after 3, pick highest average score)
    let bestIndex = 0;
    let highestScore = -1;
    attempts.forEach((att, idx) => {
      if (att.criticScore.averageScore > highestScore) {
        highestScore = att.criticScore.averageScore;
        bestIndex = idx;
      }
    });

    const chosenAttempt = isApproved ? attempts[attempts.length - 1] : attempts[bestIndex];

    const finalStudioRun: AdStudioRun = {
      runId,
      product,
      brand,
      concept,
      status: isApproved ? "completed" : "failed_after_max_retries",
      passAttemptNumber,
      attempts,
      bestAttemptIndex: bestIndex,
      modelErrors: allRunModelErrors.length > 0 ? allRunModelErrors : undefined,
      finalAsset: {
        concept,
        imageUrl: chosenAttempt.imageUrl,
        imageSource: chosenAttempt.imageSource,
        headline: chosenAttempt.headline,
        caption: chosenAttempt.caption,
        ctaText: chosenAttempt.ctaText,
        score: chosenAttempt.criticScore,
        iteration: chosenAttempt.iteration,
        isShipped: isApproved,
        failureReasoning: isApproved
          ? undefined
          : `The ad creative failed to satisfy all 4 quality criteria across ${MAX_ITERATIONS} iterations. Per AdCrew policy, substandard assets are never shipped. Review the Critic's breakdown and best attempt below.`,
      },
    };

    return res.json(finalStudioRun);
  } catch (error: any) {
    console.error("Run pipeline execution error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to execute multi-agent creative studio pipeline.",
    });
  }
});

// ----------------------------------------------------------------------------
// VITE INTEGRATION & SERVER STARTUP
// ----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AdCrew] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

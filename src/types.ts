export type HookType = 
  | 'pain-point-first'
  | 'curiosity-gap'
  | 'before-after'
  | 'social-proof'
  | 'humor';

export type ConceptOrigin = 'agent-suggested' | 'user-provided' | 'blended';

export interface ReferenceAd {
  id: string;
  title: string;
  url?: string;
  base64?: string;
  description: string;
}

export interface BrandProfile {
  brandName: string;
  brandTone: string;
  targetAudience: string;
  referenceImages: ReferenceAd[];
}

export interface ProductBrief {
  productName: string;
  category: string;
  description: string;
  coreBenefits: string[];
  productImage?: string; // base64 or sample URL
}

export interface AdConcept {
  id: string;
  title: string;
  hookType: HookType;
  messageAngle: string;
  suggestedVisualDirection: string;
  ctaStyle: string;
  origin: ConceptOrigin;
  rationale: string;
  batchIteration: number;
  userFeedbackIncorporated?: string;
}

export interface CriticScores {
  aestheticQuality: number; // 0-10
  aestheticReasoning: string;
  brandFit: number; // 0-10
  brandFitReasoning: string;
  faithfulness: number; // 0-10 (Independent score, never compensated by aesthetics)
  faithfulnessReasoning: string;
  audienceSentiment: number; // 0-10
  audienceSentimentReasoning: string;
  passed: boolean; // all dimensions >= 7.0
  averageScore: number;
  summary: string;
  creativeFeedback: string;
  copyFeedback: string;
}

export interface ModelErrorDetail {
  agent: 'ideation' | 'creative' | 'copy' | 'critic';
  modelAttempted: string;
  status: 'failed' | 'fallback' | 'rate_limited' | 'quota_exceeded' | 'unavailable' | 'timeout';
  errorCode?: number | string;
  errorMessage: string;
  friendlyReason: string;
  suggestedAction: string;
  timestamp: string;
}

export interface ModelHealthCheckResult {
  model: string;
  category: 'text' | 'image' | 'multimodal';
  status: 'healthy' | 'degraded' | 'unavailable';
  latencyMs?: number;
  error?: string;
  reason?: string;
  details?: string;
}

export interface IterationAttempt {
  iteration: number; // 1, 2, or 3
  timestamp: number;
  imagePrompt: string;
  imageUrl: string;
  imageSource?: 'pollinations-flux' | 'pollinations-turbo' | 'imagen-3' | 'gemini-flash-image' | 'commercial-photo' | 'fallback-vector';
  headline: string;
  caption: string;
  ctaText: string;
  criticScore: CriticScores;
  passed: boolean;
  modelDiagnostics?: ModelErrorDetail[];
}

export interface FinalAdAsset {
  concept: AdConcept;
  imageUrl: string;
  imageSource?: 'pollinations-flux' | 'pollinations-turbo' | 'imagen-3' | 'gemini-flash-image' | 'commercial-photo' | 'fallback-vector';
  headline: string;
  caption: string;
  ctaText: string;
  score: CriticScores;
  iteration: number;
  isShipped: boolean; // true if passed, false if best-effort after 3 failures
  failureReasoning?: string;
}

export interface AdStudioRun {
  runId: string;
  product: ProductBrief;
  brand: BrandProfile;
  concept: AdConcept;
  status: 'pending' | 'generating' | 'critiquing' | 'completed' | 'failed_after_max_retries';
  passAttemptNumber?: number; // 1, 2, 3 or undefined if failed
  attempts: IterationAttempt[];
  bestAttemptIndex: number;
  finalAsset?: FinalAdAsset;
  modelErrors?: ModelErrorDetail[];
  a2aTrace?: A2AMessage[];
}

export type AgentRole = 'ideation' | 'creative' | 'copy' | 'critic';

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  agent: AgentRole;
  iteration?: number;
  title: string;
  detail: string;
  status: 'info' | 'working' | 'success' | 'warning' | 'error';
}

// ----------------------------------------------------------------------------
// GOOGLE ADK (Agent Development Kit) & A2A (Agent-to-Agent) Protocol Types
// ----------------------------------------------------------------------------
export type A2AMessageType =
  | 'TASK_DELEGATE'
  | 'TASK_RESULT'
  | 'PEER_HANDOFF'
  | 'CRITIQUE_REVISE'
  | 'GATE_APPROVAL'
  | 'GATE_REJECT'
  | 'ORCHESTRATOR_SYNC';

export interface A2AMessage {
  id: string;
  traceId: string;
  timestamp: string;
  sender: string; // e.g. "adk:orchestrator", "adk:creative-agent", "adk:critic-gate"
  receiver: string; // e.g. "adk:copy-agent", "adk:critic-gate", "broadcast"
  type: A2AMessageType;
  action: string; // e.g. "generate_imagery", "audit_creatives", "revise_visual_angle"
  summary: string;
  payload: Record<string, any>;
  metadata?: {
    model?: string;
    latencyMs?: number;
    iteration?: number;
    passed?: boolean;
    dimensionsScored?: number;
  };
}

export interface ADKAgentCard {
  id: string;
  name: string;
  version: string;
  role: string;
  model: string;
  capabilities: string[];
  protocolsSupported: string[];
  inputContract: string;
  outputContract: string;
  a2aEndpoints: {
    inbox: string;
    health: string;
  };
}


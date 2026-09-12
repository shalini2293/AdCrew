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

export interface IterationAttempt {
  iteration: number; // 1, 2, or 3
  timestamp: number;
  imagePrompt: string;
  imageUrl: string;
  headline: string;
  caption: string;
  ctaText: string;
  criticScore: CriticScores;
  passed: boolean;
}

export interface FinalAdAsset {
  concept: AdConcept;
  imageUrl: string;
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

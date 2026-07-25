export interface CampaignInput {
  targetVertical: string;
  referenceAccount: string;
  goal: string;
  vendorName: string;
  vendorAngle: string;
  vendorProofPoints: string[];
  accountCount: number;
}

export interface SourceCitation {
  title: string;
  url: string;
  snippet?: string;
}

export interface FactConfidence {
  level: 'verified' | 'single-source';
  sourceCount: number;
}

export interface SearchProcessLog {
  query: string;
  snippetSummary?: string;
}

export interface Account {
  id: string;
  name: string;
  hqCountry: string;
  commodities: string[];
  scaleNotes: string;
  icpReasoning: string;
  icpScore?: number; // Requirement 3: ICP Fit Score (0-100)
  reasoningTrace?: string; // Requirement 8: "Why this one" concise note
  confidence?: FactConfidence; // Requirement 1: Confidence badge
  searchProcess?: SearchProcessLog[]; // Requirement 2: Show search process
  sources: SourceCitation[];
  status: 'pending' | 'success' | 'failed' | 'partial';
  failureReason?: string;
}

export interface Contact {
  id: string;
  accountId: string;
  accountName: string;
  name: string | null; // null if "no contact found"
  title: string | null;
  linkedin: string | null;
  email: string | null;
  source: string | null;
  reasoningTrace?: string; // Requirement 8: "Why this contact" note
  confidence?: FactConfidence; // Requirement 1
  searchProcess?: SearchProcessLog[]; // Requirement 2
  sources: SourceCitation[];
  status: 'found' | 'no_contact_found' | 'failed';
  failureReason?: string;
}

export interface ResearchBrief {
  id: string;
  accountId: string;
  accountName: string;
  summary: string; // 150-250 words
  recentNews: string;
  operationalFootprint: string;
  vendorFitSignals: string;
  confidence?: FactConfidence; // Requirement 1
  searchProcess?: SearchProcessLog[]; // Requirement 2
  sources: SourceCitation[];
  isEdited?: boolean; // Requirement 10: Inline editing flag
  status: 'success' | 'failed';
  failureReason?: string;
}

export interface EmailPersonalizationScore {
  isPersonalized: boolean;
  score: number;
  reason: string;
}

export interface Email {
  id: string;
  contactId: string;
  accountId: string;
  accountName: string;
  contactName: string;
  contactTitle: string;
  subject: string;
  body: string;
  painPointTargeted: string;
  proofPointUsed: string;
  personalization?: EmailPersonalizationScore; // Requirement 4: Email quality score
  searchProcess?: SearchProcessLog[]; // Requirement 2
  isEdited?: boolean; // Requirement 10: Inline editing flag
  lastToneTweak?: string;
  regenCount?: number;
  status: 'generated' | 'skipped' | 'failed';
  skipReason?: string;
}

export interface StageError {
  stage: number;
  stageName: string;
  item: string;
  error: string;
  timestamp: string;
}

export interface PipelineHealth {
  stage1AccountsIdentified: number;
  stage2ContactsFound: number;
  stage2ContactsMissing: number;
  stage3BriefsCompleted: number;
  stage4EmailsGenerated: number;
  stage4EmailsSkipped: number;
  stageErrors: StageError[];
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  stage: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface CampaignState {
  inputs: CampaignInput;
  isRunning: boolean;
  currentStage: number; // 0 = idle, 1, 2, 3, 4, 5 = completed
  stageProgressText: string;
  accounts: Account[];
  contacts: Contact[];
  briefs: ResearchBrief[];
  emails: Email[];
  logs: PipelineLog[];
  health: PipelineHealth;
}

export interface CampaignHistoryRecord {
  id: string;
  timestamp: string;
  inputs: CampaignInput;
  accounts: Account[];
  contacts: Contact[];
  briefs: ResearchBrief[];
  emails: Email[];
  logs: PipelineLog[];
  health: PipelineHealth;
}

export interface AppNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  stage?: number;
}


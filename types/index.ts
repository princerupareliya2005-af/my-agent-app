export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface BugItem {
  id: string;
  title: string;
  file: string;
  line: number;
  lineRange?: string;
  severity: Severity;
  errorType: string;
  description: string;
  impact: string;
  incorrectCode: string;
  explanation: string;
  cve?: string;
}

export interface PatchDiff {
  fileName: string;
  filePath: string;
  language: string;
  originalCode: string;
  patchedSnippet: string;
  fullCorrectedCode: string;
  changeSummary: string;
  reasoningWhyItFixes: string;
  validationResults: string;
}

export interface AuditRecord {
  id: string;
  owner: string;
  repo: string;
  url: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'PATCHED' | 'PUSHED_TO_GITHUB';
  timestamp: string;
  bugsCount: number;
  bugs: BugItem[];
  diffs: PatchDiff[];
  logs: string[];
  prUrl?: string;
  commitSha?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  auditRecord?: AuditRecord;
  logs?: string[];
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
  githubToken: string;
  stats: {
    totalAudits: number;
    bugsFixed: number;
    prsCreated: number;
    linesPatched: number;
  };
}

export interface AgentConfig {
  aiModel: string;
  autoCreatePR: boolean;
  severityThreshold: Severity;
  maxFixAttempts: number;
  runStaticAnalysis: boolean;
  runDynamicTests: boolean;
  theme: ThemeMode;
}

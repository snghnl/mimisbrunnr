export interface ThoughtEntry {
  timestamp: Date;
  message: string;
  type: 'thinking' | 'action' | 'result' | 'error';
}

export interface HumanPrompt {
  question: string;
  options: string[];
  allowCustom: boolean;
}

export interface AgentTask {
  id: string;
  type: 'summarize' | 'tag' | 'link' | 'cluster' | 'draft';
  status: 'queued' | 'running' | 'done' | 'failed' | 'waiting_human';
  input: unknown;
  output?: unknown;
  thoughtLog: ThoughtEntry[];
  humanPrompt?: HumanPrompt;
}

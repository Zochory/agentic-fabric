export type MagenticAgentPresetKey =
  | "planner"
  | "web"
  | "file"
  | "coder"
  | "terminal"
  | "critic";

export interface MagenticAgentPreset {
  key: MagenticAgentPresetKey;
  label: string;
  description: string;
  agentRole: string;
  capabilities: string[];
  systemPrompt: string;
  toolIds?: string[];
}

export const MAGENTIC_AGENT_PRESETS: MagenticAgentPreset[] = [
  {
    key: "planner",
    label: "Planner Agent",
    description: "Creates task plans, updates task ledger, assigns agents.",
    agentRole: "planner",
    capabilities: ["planning", "fact-gathering", "assignment"],
    systemPrompt:
      "You are the planning specialist. Break down the task into actionable steps, keep the facts and plan ledgers updated, and assign the next best agent.",
    toolIds: ["magentic-task-ledger", "magentic-progress-ledger"],
  },
  {
    key: "web",
    label: "Web Surfer Agent",
    description: "Searches and summarizes web sources to gather external facts.",
    agentRole: "web-surfer",
    capabilities: ["web-search", "summarization"],
    systemPrompt:
      "You are the web research specialist. Use browsing tools to gather and summarise authoritative information that helps the team.",
    toolIds: ["web-browser", "http-client"],
  },

  {
    key: "coder",
    label: "Coder Agent",
    description: "Writes and runs code to fulfil assigned subtasks.",
    agentRole: "coder",
    capabilities: ["code-generation", "code-execution"],
    systemPrompt:
      "You are responsible for writing and executing code to achieve the assigned goal. Produce correct, well-tested programs and explain results.",
    toolIds: ["hosted-code-interpreter"],
  },

  {
    key: "critic",
    label: "Critic Agent",
    description: "Reviews work-in-progress and ensures quality before completion.",
    agentRole: "critic",
    capabilities: ["review", "quality-assurance"],
    systemPrompt:
      "Review teammate output for accuracy, completeness, and adherence to plan. Flag issues and suggest improvements.",
    toolIds: ["analysis-notes"],
  },
];

export const MAGENTIC_AGENT_PRESET_MAP = MAGENTIC_AGENT_PRESETS.reduce<
  Record<MagenticAgentPresetKey, MagenticAgentPreset>
>((acc, preset) => {
  acc[preset.key] = preset;
  return acc;
}, {} as Record<MagenticAgentPresetKey, MagenticAgentPreset>);

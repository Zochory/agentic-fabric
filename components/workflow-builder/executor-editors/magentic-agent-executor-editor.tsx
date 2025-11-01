"use client";

import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MagenticAgentExecutor, ToolReference } from "@/lib/workflow/executors";
import {
  MAGENTIC_AGENT_PRESETS,
  MAGENTIC_AGENT_PRESET_MAP,
} from "@/lib/workflow/magentic-presets";
import type { MagenticAgentPresetKey } from "@/lib/workflow/magentic-presets";

type MagenticAgentExecutorEditorProps = {
  executor: MagenticAgentExecutor;
  onChange: (updates: Partial<MagenticAgentExecutor>) => void;
};

type MagenticMetadata = {
  presetKey?: string | null;
  agentRole?: string;
  capabilities?: string[];
  toolIds?: string[];
};

type ExecutorMetadata = Record<string, unknown> & { magentic?: MagenticMetadata };

const toCommaSeparated = (values?: string[]) =>
  values && values.length > 0 ? values.join(", ") : "";

const fromCommaSeparated = (value: string) =>
  value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const toToolIds = (tools?: ToolReference[]) =>
  tools && tools.length > 0 ? tools.map((tool) => tool.toolId).filter(Boolean).join(", ") : "";

const fromToolIds = (value: string): ToolReference[] | undefined => {
  const ids = fromCommaSeparated(value);
  if (ids.length === 0) return undefined;
  return ids.map((toolId) => ({ toolId, enabled: true }));
};

const mergeMetadata = (
  executor: MagenticAgentExecutor,
  magenticPatch: Partial<MagenticMetadata>
): ExecutorMetadata => {
  const current = (executor.metadata as ExecutorMetadata | undefined) ?? {};
  const currentMagentic = current.magentic ?? {};
  return {
    ...current,
    source: "agent-framework",
    magentic: {
      ...currentMagentic,
      ...magenticPatch,
    },
  };
};

export function MagenticAgentExecutorEditor({ executor, onChange }: MagenticAgentExecutorEditorProps) {
  const metadata = (executor.metadata as ExecutorMetadata | undefined) ?? {};
  const magenticMeta = metadata.magentic ?? {};

  const presetValue = useMemo(() => {
    if (magenticMeta.presetKey) {
      return magenticMeta.presetKey;
    }
    const match = MAGENTIC_AGENT_PRESETS.find((preset) => preset.agentRole === executor.agentRole);
    return match?.key ?? "custom";
  }, [magenticMeta.presetKey, executor.agentRole]);

  const handlePresetChange = (value: string) => {
    if (value === "custom") {
      onChange({
        metadata: mergeMetadata(executor, { presetKey: null }),
      });
      return;
    }

    const preset = MAGENTIC_AGENT_PRESET_MAP[value as MagenticAgentPresetKey];
    if (!preset) {
      return;
    }

    onChange({
      label: preset.label,
      description: preset.description,
      agentRole: preset.agentRole,
      capabilities: preset.capabilities,
      systemPrompt: preset.systemPrompt,
      tools: preset.toolIds?.map((toolId) => ({ toolId, enabled: true })),
      metadata: mergeMetadata(executor, {
        presetKey: preset.key,
        agentRole: preset.agentRole,
        capabilities: preset.capabilities,
        toolIds: preset.toolIds ?? [],
      }),
    });
  };

  const handleCapabilitiesChange = (value: string) => {
    const capabilities = fromCommaSeparated(value);
    onChange({
      capabilities,
      metadata: mergeMetadata(executor, {
        capabilities,
      }),
    });
  };

  const handleToolsChange = (value: string) => {
    const tools = fromToolIds(value);
    onChange({
      tools,
      metadata: mergeMetadata(executor, {
        toolIds: tools?.map((tool) => tool.toolId) ?? [],
      }),
    });
  };

  const handleAgentRoleChange = (value: string) => {
    onChange({
      agentRole: value,
      metadata: mergeMetadata(executor, {
        agentRole: value,
      }),
    });
  };

  const capabilitiesValue = toCommaSeparated(executor.capabilities ?? magenticMeta.capabilities);
  const toolsValue = toToolIds(executor.tools);

  return (
    <div className="space-y-4 pt-2 border-t">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Magentic Agent</h4>
      </div>

      <div className="space-y-2">
        <Label htmlFor="magentic-agent-preset">Preset</Label>
        <Select value={presetValue} onValueChange={handlePresetChange}>
          <SelectTrigger id="magentic-agent-preset">
            <SelectValue placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent>
            {MAGENTIC_AGENT_PRESETS.map((preset) => (
              <SelectItem key={preset.key} value={preset.key}>
                {preset.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="magentic-agent-role">Agent Role</Label>
        <Input
          id="magentic-agent-role"
          value={executor.agentRole || ""}
          onChange={(event) => handleAgentRoleChange(event.target.value)}
          placeholder="planner, coder, reviewer..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="magentic-agent-capabilities">Capabilities</Label>
        <Input
          id="magentic-agent-capabilities"
          value={capabilitiesValue}
          onChange={(event) => handleCapabilitiesChange(event.target.value)}
          placeholder="comma separated (planning, summarisation)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="magentic-agent-tools">Tool IDs</Label>
        <Input
          id="magentic-agent-tools"
          value={toolsValue}
          onChange={(event) => handleToolsChange(event.target.value)}
          placeholder="comma separated tool ids"
        />
        <p className="text-xs text-muted-foreground">
          Tools are referenced by id (e.g. web-browser, hosted-code-interpreter). Leave blank to disable tools.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="magentic-agent-system-prompt">System Prompt</Label>
        <Textarea
          id="magentic-agent-system-prompt"
          value={executor.systemPrompt || ""}
          onChange={(event) =>
            onChange({
              systemPrompt: event.target.value || undefined,
            })
          }
          rows={6}
          placeholder="Describe the agent's persona and responsibilities"
        />
      </div>
    </div>
  );
}

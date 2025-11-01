"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MagenticOrchestratorExecutor } from "@/lib/workflow/executors";

type MagenticOrchestratorExecutorEditorProps = {
  executor: MagenticOrchestratorExecutor;
  onChange: (updates: Partial<MagenticOrchestratorExecutor>) => void;
};

type ExecutorMetadata = Record<string, unknown> & {
  magentic?: Record<string, unknown>;
};

const mergeMetadata = (
  executor: MagenticOrchestratorExecutor,
  patch: Record<string, unknown>
): ExecutorMetadata => {
  const current = (executor.metadata as ExecutorMetadata | undefined) ?? {};
  const currentMagentic = (current.magentic as Record<string, unknown> | undefined) ?? {};
  return {
    ...current,
    source: "agent-framework",
    magentic: {
      ...currentMagentic,
      ...patch,
    },
  };
};

const booleanOptions = [
  { value: "true", label: "Enabled" },
  { value: "false", label: "Disabled" },
];

export function MagenticOrchestratorExecutorEditor({ executor, onChange }: MagenticOrchestratorExecutorEditorProps) {
  const planningStrategy = executor.planningStrategy || "adaptive";
  const progressTracking = executor.progressTracking !== false;
  const humanInLoop = executor.humanInTheLoop === true;
  const metadata = (executor.metadata as ExecutorMetadata | undefined) ?? {};
  const magenticMeta = (metadata.magentic as Record<string, unknown> | undefined) ?? {};

  const handlePlanningStrategy = (value: string) => {
    onChange({
      planningStrategy: value as MagenticOrchestratorExecutor["planningStrategy"],
      metadata: mergeMetadata(executor, { planningStrategy: value }),
    });
  };

  const handleProgressTracking = (value: string) => {
    const enabled = value === "true";
    onChange({
      progressTracking: enabled,
      metadata: mergeMetadata(executor, { progressTracking: enabled }),
    });
  };

  const handleHumanLoop = (value: string) => {
    const enabled = value === "true";
    onChange({
      humanInTheLoop: enabled,
      metadata: mergeMetadata(executor, { humanInTheLoop: enabled }),
    });
  };

  return (
    <div className="space-y-4 pt-2 border-t">
      <h4 className="text-sm font-medium">Magentic Orchestrator</h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between h-[34px]">
          <Label htmlFor="magentic-orchestrator-planning" className="text-sm font-normal">
            Planning Strategy
          </Label>
          <Select value={planningStrategy} onValueChange={handlePlanningStrategy}>
            <SelectTrigger id="magentic-orchestrator-planning" className="w-[140px]">
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adaptive">Adaptive</SelectItem>
              <SelectItem value="sequential">Sequential</SelectItem>
              <SelectItem value="parallel">Parallel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          Controls how the orchestrator schedules agent work. Adaptive selects the next agent based on progress ledger state.
        </p>

        <div className="flex items-center justify-between h-[34px]">
          <Label htmlFor="magentic-orchestrator-progress" className="text-sm font-normal">
            Progress Tracking
          </Label>
          <Select value={progressTracking ? "true" : "false"} onValueChange={handleProgressTracking}>
            <SelectTrigger id="magentic-orchestrator-progress" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {booleanOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          When enabled the orchestrator maintains Magentic progress ledgers to avoid stalls and loops.
        </p>

        <div className="flex items-center justify-between h-[34px]">
          <Label htmlFor="magentic-orchestrator-hitl" className="text-sm font-normal">
            Human-in-the-loop
          </Label>
          <Select value={humanInLoop ? "true" : "false"} onValueChange={handleHumanLoop}>
            <SelectTrigger id="magentic-orchestrator-hitl" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {booleanOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          Require plan review before execution begins. Connect to a Request Info node to collect approvals.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="magentic-orchestrator-notes">Notes</Label>
        <Input
          id="magentic-orchestrator-notes"
          value={(magenticMeta.notes as string | undefined) ?? ""}
          onChange={(event) =>
            onChange({
              metadata: mergeMetadata(executor, { notes: event.target.value || undefined }),
            })
          }
          placeholder="Optional: add internal notes"
        />
     </div>
   </div>
 );
}

"use client";

import React, { memo } from "react";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Actions, Action } from "@/components/ai-elements/actions";
import { GitBranch, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SwitchCaseEdgeGroup, Case } from "@/lib/workflow/edges";

/**
 * Switch-case node data
 */
export interface SwitchCaseNodeData {
  variant: "switch-case";
  handles: {
    target: boolean;
    source: boolean;
    // Multiple source handles for multiple cases
    caseCount?: number;
  };
  group: SwitchCaseEdgeGroup;
  label?: string;
  description?: string;
}

/**
 * Props for SwitchCaseNode component
 */
export interface SwitchCaseNodeProps {
  id: string;
  data: SwitchCaseNodeData;
  selected?: boolean;
}

/**
 * Switch-case edge group node - conditional routing based on expression value
 */
export const SwitchCaseNode = memo(({ data, selected }: SwitchCaseNodeProps) => {
  const { handles, group, label, description } = data;

  const displayLabel = label || `Switch/Case (${group.cases.length} cases)`;
  const displayDescription = description || `Routes based on: ${group.switchExpression}`;

  return (
    <Node handles={handles} className={cn(selected && "ring-2 ring-primary")}>
      <NodeHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="size-4 text-primary" />
          <div className="flex-1 min-w-0">
            <NodeTitle className="text-sm truncate">{displayLabel}</NodeTitle>
            <NodeDescription className="text-xs truncate">
              {displayDescription}
            </NodeDescription>
          </div>
        </div>
      </NodeHeader>
      <NodeContent>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Expression: <span className="font-mono text-[10px]">{group.switchExpression}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Source: <span className="font-mono">{group.source}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Cases: {group.cases.length}
          </div>
          {group.default && (
            <div className="text-xs text-muted-foreground">
              Default case: <span className="font-mono">{group.default.target}</span>
            </div>
          )}
          {group.cases.length > 0 && (
            <div className="text-xs space-y-1 max-h-20 overflow-auto">
              {group.cases.map((caseItem: Case, idx: number) => (
                <div key={caseItem.id} className="bg-muted p-1 rounded">
                  Case {idx + 1}: {String(caseItem.value)} → {caseItem.target}
                </div>
              ))}
            </div>
          )}
        </div>
      </NodeContent>
      <NodeFooter>
        <div className="text-xs text-muted-foreground">
          Group ID: <span className="font-mono">{group.id}</span>
        </div>
      </NodeFooter>
      <Toolbar>
        <Actions>
          <Action tooltip="Edit switch-case group" label="Edit" aria-label="Edit">
            <Pencil className="size-4" />
          </Action>
          <Action tooltip="Delete switch-case group" label="Delete" aria-label="Delete">
            <Trash2 className="size-4" />
          </Action>
        </Actions>
      </Toolbar>
    </Node>
  );
});

SwitchCaseNode.displayName = "SwitchCaseNode";


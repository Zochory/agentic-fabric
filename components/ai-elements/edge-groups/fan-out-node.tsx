"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps as ReactFlowNodeProps } from "@xyflow/react";
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
import { ArrowUpFromLine, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FanOutEdgeGroup } from "@/lib/workflow/edges";

/**
 * Fan-out node data
 */
export interface FanOutNodeData {
  variant: "fan-out";
  handles: {
    target: boolean;
    source: boolean;
    // Multiple source handles for multiple targets
    targetCount?: number;
  };
  group: FanOutEdgeGroup;
  label?: string;
  description?: string;
}

/**
 * Props for FanOutNode component
 */
export interface FanOutNodeProps {
  id: string;
  data: FanOutNodeData;
  selected?: boolean;
}

/**
 * Fan-out edge group node - one source broadcasts to multiple targets
 */
export const FanOutNode = memo(({ id, data, selected }: FanOutNodeProps) => {
  const { handles, group, label, description } = data;

  const displayLabel = label || `Fan-Out (${group.targets.length} targets)`;
  const displayDescription = description || `Broadcasts from ${group.source} to ${group.targets.length} targets`;

  return (
    <Node handles={handles} className={cn(selected && "ring-2 ring-primary")}>
      <NodeHeader>
        <div className="flex items-center gap-2">
          <ArrowUpFromLine className="size-4 text-primary" />
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
            Source: <span className="font-mono">{group.source}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Targets: {group.targets.length}
          </div>
          {group.broadcastMode && (
            <div className="text-xs text-muted-foreground">
              Mode: <span className="capitalize">{group.broadcastMode}</span>
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
          <Action tooltip="Edit fan-out group" label="Edit" aria-label="Edit">
            <Pencil className="size-4" />
          </Action>
          <Action tooltip="Delete fan-out group" label="Delete" aria-label="Delete">
            <Trash2 className="size-4" />
          </Action>
        </Actions>
      </Toolbar>
    </Node>
  );
});

FanOutNode.displayName = "FanOutNode";


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
import { ArrowDownToLine, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FanInEdgeGroup } from "@/lib/workflow/edges";

/**
 * Fan-in node data
 */
export interface FanInNodeData {
  variant: "fan-in";
  handles: {
    target: boolean;
    source: boolean;
    // Multiple target handles for multiple sources
    sourceCount?: number;
  };
  group: FanInEdgeGroup;
  label?: string;
  description?: string;
}

/**
 * Props for FanInNode component
 */
export interface FanInNodeProps {
  id: string;
  data: FanInNodeData;
  selected?: boolean;
}

/**
 * Fan-in edge group node - multiple sources converge into one target
 */
export const FanInNode = memo(({ id, data, selected }: FanInNodeProps) => {
  const { handles, group, label, description } = data;

  const displayLabel = label || `Fan-In (${group.sources.length} sources)`;
  const displayDescription = description || `Converges ${group.sources.length} sources into ${group.target}`;

  const sourceCount = handles.sourceCount || group.sources.length;

  return (
    <Node handles={handles} className={cn(selected && "ring-2 ring-primary")}>
      <NodeHeader>
        <div className="flex items-center gap-2">
          <ArrowDownToLine className="size-4 text-primary" />
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
            Sources: {group.sources.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Target: <span className="font-mono">{group.target}</span>
          </div>
          {group.aggregationStrategy && (
            <div className="text-xs text-muted-foreground">
              Strategy: <span className="capitalize">{group.aggregationStrategy}</span>
            </div>
          )}
          {group.customAggregator && (
            <div className="text-xs text-muted-foreground">
              Custom aggregator: <span className="font-mono">{group.customAggregator}</span>
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
          <Action tooltip="Edit fan-in group" label="Edit" aria-label="Edit">
            <Pencil className="size-4" />
          </Action>
          <Action tooltip="Delete fan-in group" label="Delete" aria-label="Delete">
            <Trash2 className="size-4" />
          </Action>
        </Actions>
      </Toolbar>
    </Node>
  );
});

FanInNode.displayName = "FanInNode";


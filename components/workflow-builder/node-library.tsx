"use client";

import React, { useCallback } from "react";
import { Panel } from "@/components/ai-elements/panel";
import { Button } from "@/components/ui/button";
import {
  Code,
  Bot,
  Workflow,
  Globe,
  ArrowDownToLine,
  ArrowUpFromLine,
  GitBranch,
  Network,
  Sparkles,
  Square,
  FileText,
  FolderSearch,
  Shield,
  Settings,
  Repeat,
  UserCheck,
  ArrowLeftRight,
  CircleDot,
  FileCode,
} from "lucide-react";
import type { ExecutorType } from "@/lib/workflow/executors";
import { getExecutorTypeLabel, getExecutorTypeDescription } from "@/lib/workflow/executors";
import type { EdgeGroupType } from "@/lib/workflow/types";
import { getEdgeGroupTypeLabel, getEdgeGroupTypeDescription } from "@/lib/workflow/edges";
import { MAGENTIC_AGENT_PRESETS } from "@/lib/workflow/magentic-presets";
import { cn } from "@/lib/utils";

type NodeLibraryCategory = "core" | "tools" | "logic" | "data" | "magentic";

interface NodeLibraryProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void;
  onAddNode: (nodeType: string) => void;
  onAddMagenticScaffold: () => void;
}

interface NodeLibraryItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: NodeLibraryCategory;
  iconColor?: string;
}

// Core category (Blue icons)
const coreItems: NodeLibraryItem[] = [
  {
    id: "agent-executor",
    label: getExecutorTypeLabel("agent-executor"),
    description: getExecutorTypeDescription("agent-executor"),
    icon: Bot,
    category: "core",
    iconColor: "#3B82F6", // Blue
  },
  {
    id: "workflow-executor",
    label: "End",
    description: getExecutorTypeDescription("workflow-executor"),
    icon: Square,
    category: "core",
    iconColor: "#10B981", // Green for End
  },
  {
    id: "textBlock",
    label: "Note",
    description: "Add a text note or annotation",
    icon: FileText,
    category: "core",
    iconColor: "#FBBF24", // Yellow for Note
  },
];

// Tools category (Yellow icons)
const toolsItems: NodeLibraryItem[] = [
  {
    id: "request-info-executor",
    label: "File search",
    description: getExecutorTypeDescription("request-info-executor"),
    icon: FolderSearch,
    category: "tools",
    iconColor: "#FBBF24", // Yellow
  },
  {
    id: "function-executor",
    label: "MCP",
    description: "Model Context Protocol integration",
    icon: Settings,
    category: "tools",
    iconColor: "#FBBF24", // Yellow
  },
];

// Logic category (Orange icons)
const logicItems: NodeLibraryItem[] = [
  {
    id: "switch-case",
    label: "If / else",
    description: getEdgeGroupTypeDescription("switch-case"),
    icon: GitBranch,
    category: "logic",
    iconColor: "#F97316", // Orange
  },
  {
    id: "fan-out",
    label: "While",
    description: "Loop while condition is true",
    icon: Repeat,
    category: "logic",
    iconColor: "#F97316", // Orange
  },
  {
    id: "request-info-executor",
    label: "User approval",
    description: "Request user input or approval",
    icon: UserCheck,
    category: "logic",
    iconColor: "#F97316", // Orange
  },
];

// Data category (Purple icons)
const dataItems: NodeLibraryItem[] = [
  {
    id: "function-executor",
    label: "Transform",
    description: getExecutorTypeDescription("function-executor"),
    icon: ArrowLeftRight,
    category: "data",
    iconColor: "#A855F7", // Purple
  },
  {
    id: "attribute",
    label: "Set state",
    description: "Set or update workflow state",
    icon: CircleDot,
    category: "data",
    iconColor: "#A855F7", // Purple
  },
];

// Magentic category (Special/Network icons)
const magenticItems: NodeLibraryItem[] = [
  {
    id: "magentic-orchestrator-executor",
    label: getExecutorTypeLabel("magentic-orchestrator-executor"),
    description: getExecutorTypeDescription("magentic-orchestrator-executor"),
    icon: Network,
    category: "magentic",
    iconColor: "#8B5CF6", // Purple variant
  },
  ...MAGENTIC_AGENT_PRESETS.map((preset) => ({
    id: `magentic-agent-executor:${preset.key}`,
    label: preset.label,
    description: preset.description,
    icon: Sparkles,
    category: "magentic" as NodeLibraryCategory,
    iconColor: "#8B5CF6", // Purple variant
  })),
];

const categoryConfig: Record<NodeLibraryCategory, { label: string; color: string; items: NodeLibraryItem[] }> = {
  core: {
    label: "Core",
    color: "#3B82F6",
    items: coreItems,
  },
  tools: {
    label: "Tools",
    color: "#FBBF24",
    items: toolsItems,
  },
  logic: {
    label: "Logic",
    color: "#F97316",
    items: logicItems,
  },
  data: {
    label: "Data",
    color: "#A855F7",
    items: dataItems,
  },
  magentic: {
    label: "Magentic",
    color: "#8B5CF6",
    items: magenticItems,
  },
};

export function NodeLibrary({ onDragStart, onAddNode, onAddMagenticScaffold }: NodeLibraryProps) {
  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
      onDragStart(event, nodeType);
    },
    [onDragStart]
  );

  const handleAddNode = useCallback(
    (nodeType: string) => {
      onAddNode(nodeType);
    },
    [onAddNode]
  );

  const renderNodeItem = (item: NodeLibraryItem) => {
    const Icon = item.icon;
    const iconColor = item.iconColor || "#9CA3AF";
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        onClick={() => handleAddNode(item.id)}
        className="group relative cursor-grab rounded-full border bg-muted p-3 text-sm shadow-sm transition-colors hover:bg-muted/70 active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <Icon className="size-4 shrink-0" style={{ color: iconColor }} />
          <div className="font-medium text-[12px]">{item.label}</div>
        </div>
        {/* Description tooltip on hover */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block pointer-events-none">
          <div className="bg-popover border rounded-md px-3 py-2 text-xs text-popover-foreground shadow-lg whitespace-nowrap max-w-xs">
            {item.description}
          </div>
        </div>
      </div>
    );
  };

  const renderCategory = (category: NodeLibraryCategory) => {
    const config = categoryConfig[category];
    if (!config || config.items.length === 0) return null;

    return (
      <div key={category}>
        <h4
          className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide"
          style={{ color: config.color }}
        >
          {config.label}
        </h4>
        <div className="space-y-0">
          {config.items.map(renderNodeItem)}
        </div>
      </div>
    );
  };

  return (
    <Panel
      position="center-left"
      className={cn(
        "m-0 ml-6 mt-8 w-[224px] space-y-4 p-3",
        "bottom-6 overflow-y-auto",
        "bg-white/12 backdrop-blur-sm"
      )}
      style={{ height: "calc(100vh - 8.5rem)" }}
    >
      <div>
        <h3 className="text-sm font-semibold mb-1">Node Library</h3>
        <p className="text-xs text-muted-foreground">Drag onto canvas or click to add</p>
      </div>

      {(["core", "tools", "logic", "data", "magentic"] as NodeLibraryCategory[]).map(
        renderCategory
      )}

      <div className="pt-2 border-t">
        <Button
          size="sm"
          className="w-full"
          onClick={() => handleAddNode("executor")}
        >
          Add Executor to Center
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="w-full mt-2"
          onClick={onAddMagenticScaffold}
        >
          Scaffold Magentic Workflow
        </Button>
      </div>
    </Panel>
  );
}

"use client";

import React, { useState } from "react";
import { Panel } from "@/components/ai-elements/panel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseExecutor } from "@/lib/workflow/types";
import type {
  FunctionExecutor,
  AgentExecutor,
  WorkflowExecutor,
  RequestInfoExecutor,
  MagenticAgentExecutor,
  MagenticOrchestratorExecutor,
} from "@/lib/workflow/executors";
import { FunctionExecutorEditor } from "./executor-editors/function-executor-editor";
import { AgentExecutorEditor } from "./executor-editors/agent-executor-editor";
import { WorkflowExecutorEditor } from "./executor-editors/workflow-executor-editor";
import { RequestInfoExecutorEditor } from "./executor-editors/request-info-executor-editor";
import { MagenticAgentExecutorEditor } from "./executor-editors/magentic-agent-executor-editor";
import { MagenticOrchestratorExecutorEditor } from "./executor-editors/magentic-orchestrator-executor-editor";

interface PropertiesPanelProps {
  selectedNode: {
    id: string;
    type: string;
    data: {
      executor?: BaseExecutor;
      executorType?: string;
      label?: string;
      description?: string;
    };
  } | null;
  onUpdate: (nodeId: string, updates: Partial<BaseExecutor>) => void;
  onDelete?: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
  onEvaluate?: (nodeId: string) => void;
}

export function PropertiesPanel({
  selectedNode,
  onUpdate,
  onDelete,
  onDuplicate,
  onEvaluate,
}: PropertiesPanelProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [includeChatHistory, setIncludeChatHistory] = useState(true);
  const [verbosity, setVerbosity] = useState("medium");
  const [summary, setSummary] = useState("auto");
  const [displayResponseInChat, setDisplayResponseInChat] = useState(true);
  const [showInProgressMessages, setShowInProgressMessages] = useState(true);
  const [showSearchSources, setShowSearchSources] = useState(true);
  const [continueOnError, setContinueOnError] = useState(false);
  const [writeToConversationHistory, setWriteToConversationHistory] = useState(true);

  if (!selectedNode || !selectedNode.data.executor) {
    return (
      <Panel position="center-right" className="mr-4 w-[400px] p-4">
        <div className="text-sm text-muted-foreground text-center py-8">
          Select a node to view and edit its properties
        </div>
      </Panel>
    );
  }

  const executor = selectedNode.data.executor;
  const executorType = selectedNode.data.executorType || executor.type;
  const nodeLabel = selectedNode.data.label || executor.label || executor.id;
  const nodeDescription =
    selectedNode.data.description ||
    executor.description ||
    "Configure the executor settings";

  const handleChange = (field: keyof BaseExecutor, value: unknown) => {
    onUpdate(selectedNode.id, { [field]: value } as Partial<BaseExecutor>);
  };

  const handleExecutorChange = (updates: Partial<BaseExecutor>) => {
    onUpdate(selectedNode.id, updates);
  };

  const handleNameChange = (value: string) => {
    onUpdate(selectedNode.id, { label: value } as Partial<BaseExecutor>);
  };

  const handleInstructionsChange = (value: string) => {
    // Check executorType instead of checking if systemPrompt property exists
    // This handles both preset-based and newly created agent executors
    if (executorType === "agent-executor" || executorType === "magentic-agent-executor") {
      onUpdate(selectedNode.id, {
        systemPrompt: value,
      } as Partial<BaseExecutor>);
    } else if (executorType === "magentic-orchestrator-executor") {
      // For orchestrator, instructions might be stored differently
      handleChange("description" as keyof BaseExecutor, value);
    }
  };

  const getInstructionsValue = (): string => {
    const agentExecutor = executor as AgentExecutor;
    return (
      (agentExecutor as any).systemPrompt ||
      (agentExecutor as any).instructions ||
      executor.description ||
      "You are a helpful assistant."
    );
  };

  return (
    <Panel
      position="center-right"
      className={cn(
        "mr-4 w-[400px] p-0",
        "max-h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col"
      )}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Header Section */}
        <div className="space-y-1 border-b border-border pb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {nodeLabel}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {nodeDescription}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Documentation"
              >
                <BookOpen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete?.(selectedNode.id)}
                title="Delete node"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Name Field - Horizontal Layout */}
        <div className="flex items-center gap-3">
          <Label htmlFor="node-name" className="text-sm font-normal whitespace-nowrap">
            Name
          </Label>
          <Input
            id="node-name"
            value={nodeLabel}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter node name"
            className="flex-1"
          />
        </div>

        {/* Instructions Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="node-instructions">Instructions</Label>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Textarea
            id="node-instructions"
            value={getInstructionsValue()}
            onChange={(e) => handleInstructionsChange(e.target.value)}
            placeholder="You are a helpful assistant."
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Configuration Options */}
        <div className="space-y-3">
          {/* Include chat history toggle */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="chat-history" className="text-sm font-normal">
              Include chat history
            </Label>
            <div className="flex items-center h-[34px]">
              <Switch
                checked={includeChatHistory}
                onCheckedChange={setIncludeChatHistory}
              />
            </div>
          </div>

          {/* Model dropdown */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="model-select" className="text-sm font-normal">
              Model
            </Label>
            <Select
              value={(executor as AgentExecutor).model || "gpt-5"}
              onValueChange={(value) =>
                handleChange("model" as keyof BaseExecutor, value)
              }
            >
              <SelectTrigger id="model-select" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-5">GPT-5</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reasoning effort dropdown */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="reasoning-effort-select" className="text-sm font-normal">
              Reasoning effort
            </Label>
            <Select defaultValue="low">
              <SelectTrigger id="reasoning-effort-select" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tools field */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="tools" className="text-sm font-normal">Tools</Label>
            <div className="flex items-center gap-2 h-[34px]">
              <div className="px-3 h-[34px] flex items-center rounded-md border bg-muted/50 text-sm text-muted-foreground min-w-[140px] text-right">
                {Array.isArray((executor as AgentExecutor).tools) &&
                (executor as AgentExecutor).tools?.length > 0
                  ? `${(executor as AgentExecutor).tools.length} tool(s) configured`
                  : "No tools configured"}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Output format dropdown */}
          <div className="flex items-center justify-between h-[34px]">
            <Label htmlFor="output-format-select" className="text-sm font-normal">
              Output format
            </Label>
            <Select defaultValue="text">
              <SelectTrigger id="output-format-select" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Model Parameters Section */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Model parameters
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="verbosity-select" className="text-sm font-normal">
                Verbosity
              </Label>
              <Select value={verbosity} onValueChange={setVerbosity}>
                <SelectTrigger id="verbosity-select" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="summary-select" className="text-sm font-normal">
                Summary
              </Label>
              <Select value={summary} onValueChange={setSummary}>
                <SelectTrigger id="summary-select" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="always">Always</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ChatKit Section */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            ChatKit
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="display-response" className="text-sm font-normal">
                Display response in chat
              </Label>
              <div className="flex items-center h-[34px]">
                <Switch
                  checked={displayResponseInChat}
                  onCheckedChange={setDisplayResponseInChat}
                />
              </div>
            </div>
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="in-progress-messages" className="text-sm font-normal">
                Show in-progress messages
              </Label>
              <div className="flex items-center h-[34px]">
                <Switch
                  checked={showInProgressMessages}
                  onCheckedChange={setShowInProgressMessages}
                />
              </div>
            </div>
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="search-sources" className="text-sm font-normal">
                Show search sources
              </Label>
              <div className="flex items-center h-[34px]">
                <Switch
                  checked={showSearchSources}
                  onCheckedChange={setShowSearchSources}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Section */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Advanced
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="continue-error" className="text-sm font-normal">
                Continue on error
              </Label>
              <div className="flex items-center h-[34px]">
                <Switch
                  checked={continueOnError}
                  onCheckedChange={setContinueOnError}
                />
              </div>
            </div>
            <div className="flex items-center justify-between h-[34px]">
              <Label htmlFor="write-history" className="text-sm font-normal">
                Write to conversation history
              </Label>
              <div className="flex items-center h-[34px]">
                <Switch
                  checked={writeToConversationHistory}
                  onCheckedChange={setWriteToConversationHistory}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Configuration Section */}
        <Collapsible open={isMoreOpen} onOpenChange={setIsMoreOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <span>{isMoreOpen ? "Less" : "More"}</span>
            {isMoreOpen ? (
              <ChevronUp className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label htmlFor="executor-id">Executor ID</Label>
              <Input
                id="executor-id"
                value={executor.id}
                disabled
                className="font-mono text-xs bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="executor-type">Type</Label>
              <Input
                id="executor-type"
                value={executorType}
                disabled
                className="font-mono text-xs bg-muted"
              />
            </div>
            {/* Type-specific editors */}
            {executorType === "function-executor" && (
              <FunctionExecutorEditor
                executor={executor as FunctionExecutor}
                onChange={handleExecutorChange}
              />
            )}

            {executorType === "agent-executor" && (
              <AgentExecutorEditor
                executor={executor as AgentExecutor}
                onChange={handleExecutorChange}
              />
            )}

            {executorType === "magentic-agent-executor" && (
              <MagenticAgentExecutorEditor
                executor={executor as MagenticAgentExecutor}
                onChange={
                  handleExecutorChange as (
                    updates: Partial<MagenticAgentExecutor>
                  ) => void
                }
              />
            )}

            {executorType === "workflow-executor" && (
              <WorkflowExecutorEditor
                executor={executor as WorkflowExecutor}
                onChange={handleExecutorChange}
              />
            )}

            {executorType === "request-info-executor" && (
              <RequestInfoExecutorEditor
                executor={executor as RequestInfoExecutor}
                onChange={handleExecutorChange}
              />
            )}

            {executorType === "magentic-orchestrator-executor" && (
              <MagenticOrchestratorExecutorEditor
                executor={executor as MagenticOrchestratorExecutor}
                onChange={
                  handleExecutorChange as (
                    updates: Partial<MagenticOrchestratorExecutor>
                  ) => void
                }
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Bottom Actions - Footer */}
      <div className="border-t border-border p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className="text-sm text-muted-foreground hover:text-foreground gap-2"
        >
          {isMoreOpen ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              More
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEvaluate?.(selectedNode.id)}
          className="text-sm text-foreground hover:text-foreground gap-2"
        >
          Evaluate
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </Panel>
  );
}

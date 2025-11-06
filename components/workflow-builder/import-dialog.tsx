"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Workflow } from "@/lib/workflow/workflow";
import {
  deserializeFromJSON,
  deserializeFromYAML,
} from "@/lib/workflow/export/serializers";
import { validateWorkflowSchema } from "@/lib/workflow/export/validator";
import { workflowToReactFlow, type WorkflowReactFlowNode, type WorkflowReactFlowEdge } from "@/lib/workflow/conversion";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (nodes: WorkflowReactFlowNode[], edges: WorkflowReactFlowEdge[]) => void;
}

export function ImportDialog({
  open,
  onOpenChange,
  onImport,
}: ImportDialogProps) {
  const [format, setFormat] = useState<"json" | "yaml">("json");
  const [importText, setImportText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportText(content);
      validateImport(content);
    };
    reader.readAsText(file);
  };

  const validateImport = (text: string) => {
    try {
      let workflow: Workflow;

      if (format === "json") {
        workflow = deserializeFromJSON(text);
      } else {
        workflow = deserializeFromYAML(text);
      }

      const validation = validateWorkflowSchema(workflow);
      if (validation.valid) {
        setError(null);
        setIsValid(true);
      } else {
        setError(validation.errors.join("\n"));
        setIsValid(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid workflow format");
      setIsValid(false);
    }
  };

  const handleImport = () => {
    if (!importText || !isValid) return;

    try {
      let workflow: Workflow;

      if (format === "json") {
        workflow = deserializeFromJSON(importText);
      } else {
        workflow = deserializeFromYAML(importText);
      }

      const { nodes, edges } = workflowToReactFlow(workflow);
      onImport(nodes, edges);
      onOpenChange(false);
      setImportText("");
      setError(null);
      setIsValid(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import workflow");
    }
  };

  const handleTextChange = (text: string) => {
    setImportText(text);
    if (text.trim()) {
      validateImport(text);
    } else {
      setError(null);
      setIsValid(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Workflow</DialogTitle>
          <DialogDescription>
            Import a workflow from JSON or YAML format
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Format selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Format:</label>
            <Select
              value={format}
              onValueChange={(value) => {
                setFormat(value as "json" | "yaml");
                if (importText) {
                  validateImport(importText);
                }
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="size-4 mr-2" />
              Upload File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={format === "json" ? ".json" : ".yaml,.yml"}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Validation status */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="size-4 text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                    Import Error
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isValid && !error && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-md p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✓ Valid workflow format
                </div>
              </div>
            </div>
          )}

          {/* Text input */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <label className="text-sm font-medium mb-2">Or paste workflow definition:</label>
            <div className="flex-1 overflow-auto bg-muted rounded-md p-4">
              <Textarea
                value={importText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={
                  format === "json"
                    ? '{"id": "workflow-1", "executors": [...], "edges": [...]}'
                    : "id: workflow-1\nexecutors:\n  - id: executor-1\n    type: executor\nedges:\n  - id: edge-1\n    source: executor-1\n    target: executor-2"
                }
                className="font-mono text-xs min-h-full border-0 bg-transparent resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!isValid || !importText}>
            Import Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


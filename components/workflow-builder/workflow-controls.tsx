"use client";

import React from "react";
import { Panel } from "@/components/ai-elements/panel";
import { Button } from "@/components/ui/button";
import { Action, Actions } from "@/components/ai-elements/actions";
import { Download, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import type { Workflow } from "@/lib/workflow/workflow";
import { validateWorkflowExtended } from "@/lib/workflow/export/validator";

interface WorkflowControlsProps {
  workflow: Workflow | null;
  onExport: () => void;
  onImport: () => void;
  onValidate?: () => void;
}

export function WorkflowControls({
  workflow,
  onExport,
  onImport,
  onValidate,
}: WorkflowControlsProps) {
  const validation = workflow
    ? validateWorkflowExtended(workflow)
    : null;

  const isValid = validation?.valid ?? false;
  const hasErrors = validation
    ? validation.valid === false || validation.typeErrors.length > 0
    : false;
  const hasWarnings =
    validation && (validation.warnings.length > 0 || validation.connectivityWarnings.length > 0);

  return (
    <Panel position="bottom-right" className="space-y-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Workflow Controls</h2>
      </div>
      <Actions>
        <Action
          tooltip="Import workflow from file"
          label="Import"
          onClick={onImport}
        >
          <Upload className="size-4" />
        </Action>
        <Action
          tooltip={hasErrors ? "Fix errors before exporting" : "Export workflow"}
          label="Export"
          onClick={onExport}
          disabled={!workflow || hasErrors}
        >
          <Download className="size-4" />
        </Action>
        {validation && (
          <Action
            tooltip={
              hasErrors
                ? "Workflow has errors"
                : hasWarnings
                ? "Workflow has warnings"
                : "Workflow is valid"
            }
            label="Validation"
            onClick={onValidate}
          >
            {hasErrors ? (
              <AlertCircle className="size-4 text-red-500" />
            ) : hasWarnings ? (
              <AlertCircle className="size-4 text-yellow-500" />
            ) : (
              <CheckCircle2 className="size-4 text-green-500" />
            )}
          </Action>
        )}
      </Actions>
      {validation && (
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {hasErrors ? (
            <span className="text-red-500">
              {validation.errors.length + validation.typeErrors.length} error(s)
            </span>
          ) : hasWarnings ? (
            <span className="text-yellow-500">
              {validation.warnings.length + validation.connectivityWarnings.length} warning(s)
            </span>
          ) : (
            <span className="text-green-500">Valid workflow</span>
          )}
        </div>
      )}
    </Panel>
  );
}

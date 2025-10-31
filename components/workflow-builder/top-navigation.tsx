"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Code, Eye, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Workflow } from "@/lib/workflow/workflow";
import { validateWorkflowExtended } from "@/lib/workflow/export/validator";
import { ThemeToggle } from "@/components/theme-toggle";
import logoLightmode from "@/public/logo-lightmode.svg";
import logoDarkmode from "@/public/logo-darkmode.svg";

interface TopNavigationProps {
  projectName?: string;
  projectStatus?: string;
  workflow?: Workflow | null;
  onEvaluate?: () => void;
  onCode?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  onValidate?: () => void;
}

export function TopNavigation({
  projectName = "MCP Draft",
  projectStatus,
  workflow,
  onEvaluate,
  onCode,
  onPreview,
  onPublish,
  onValidate,
}: TopNavigationProps) {
  const displayName = projectStatus
    ? `${projectName} ${projectStatus}`
    : projectName;

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
    <div
      className={cn(
        "absolute top-0 left-0 right-0 w-full",
        "flex items-center justify-between h-14 px-6 bg-transparent",
        "border-b border-transparent",
        "text-white z-50"
      )}
    >
      {/* Left side: Project name/status */}
      <div className="flex items-center gap-2">
      <img src={logoDarkmode.src} alt="Logo" className="size-8 hidden dark:block" /> <img src={logoLightmode.src} alt="Logo" className="size-8 dark:hidden" /> <h1 className="text-lg font-semibold text-gray-200">{displayName}</h1>
        
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-2 mt-6 p-[8px] bg-white/8 rounded-full">
        {validation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onValidate}
            className="text-gray-300 hover:text-white hover:bg-white/10"
            title={
              hasErrors
                ? "Workflow has errors"
                : hasWarnings
                ? "Workflow has warnings"
                : "Workflow is valid"
            }
          >
            {hasErrors ? (
              <AlertCircle className="size-4 text-red-500" />
            ) : hasWarnings ? (
              <AlertCircle className="size-4 text-yellow-500" />
            ) : (
              <CheckCircle2 className="size-4 text-green-500" />
            )}
            <span className="ml-1">Validation</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onEvaluate}
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Play className="size-4" />
          Evaluate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCode}
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Code className="size-4" />
          Code
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreview}
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Eye className="size-4" />
          Preview
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onPublish}
          className="bg-black/64 dark:bg-white/64 hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black rounded-full"
        >
          <Upload className="size-4" />
          Publish
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}


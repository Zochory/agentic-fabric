"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Undo2,
  Redo2,
  Hand,
  MousePointer2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToolType = "pointer" | "pan";

interface BottomControlsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onToolChange?: (tool: ToolType) => void;
  currentTool?: ToolType;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function BottomControls({
  onUndo,
  onRedo,
  onToolChange,
  currentTool = "pointer",
  canUndo = false,
  canRedo = false,
}: BottomControlsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 rounded-full border bg-background/95 backdrop-blur-sm shadow-lg p-1.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full",
            !canUndo && "opacity-50 cursor-not-allowed"
          )}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full",
            !canRedo && "opacity-50 cursor-not-allowed"
          )}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant={currentTool === "pointer" ? "secondary" : "ghost"}
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full",
            currentTool === "pointer" && "bg-primary/10"
          )}
          onClick={() => onToolChange?.("pointer")}
          title="Selection tool"
        >
          <MousePointer2 className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTool === "pan" ? "secondary" : "ghost"}
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full",
            currentTool === "pan" && "bg-primary/10"
          )}
          onClick={() => onToolChange?.("pan")}
          title="Pan tool"
        >
          <Hand className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


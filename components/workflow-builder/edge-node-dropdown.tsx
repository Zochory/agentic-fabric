"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Plus, Bot, Square, ArrowLeftRight, Network, Sparkles } from "lucide-react";
import { MAGENTIC_AGENT_PRESETS } from "@/lib/workflow/magentic-presets";
import { getExecutorTypeLabel } from "@/lib/workflow/executors";
import type { XYPosition } from "@xyflow/react";

interface EdgeNodeDropdownProps {
  edgeId: string;
  position: XYPosition;
  screenPosition?: { x: number; y: number };
  onSelectNode: (nodeType: string) => void;
  onClose?: () => void;
}

const nodeLibraryItems = [
  { id: "agent-executor", label: getExecutorTypeLabel("agent-executor"), icon: Bot, color: "#3B82F6" },
  { id: "workflow-executor", label: "End", icon: Square, color: "#10B981" },
  { id: "function-executor", label: getExecutorTypeLabel("function-executor"), icon: ArrowLeftRight, color: "#A855F7" },
  { id: "request-info-executor", label: getExecutorTypeLabel("request-info-executor"), icon: Network, color: "#3B82F6" },
  { id: "magentic-orchestrator-executor", label: getExecutorTypeLabel("magentic-orchestrator-executor"), icon: Network, color: "#8B5CF6" },
  ...MAGENTIC_AGENT_PRESETS.map((preset) => ({
    id: `magentic-agent-executor:${preset.key}`,
    label: preset.label,
    icon: Sparkles,
    color: "#8B5CF6",
  })),
];

export function EdgeNodeDropdown({
  edgeId,
  position,
  screenPosition,
  onSelectNode,
  onClose,
}: EdgeNodeDropdownProps) {
  const [open, setOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleSelect = useCallback(
    (nodeType: string) => {
      onSelectNode(nodeType);
      setOpen(false);
      onClose?.();
    },
    [onSelectNode, onClose]
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, onClose]);

  // Use screen position if provided, otherwise fall back to flow position
  const displayPosition = screenPosition || { x: 0, y: 0 };

  return (
    <div
      ref={dropdownRef}
      className="fixed z-[1000] pointer-events-auto"
      style={{
        left: `${displayPosition.x}px`,
        top: `${displayPosition.y}px`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu open={open} onOpenChange={(newOpen) => {
        if (!newOpen) {
          setOpen(false);
          onClose?.();
        } else {
          setOpen(true);
        }
      }}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 rounded-full p-0 shadow-lg bg-background border-2 border-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-56 max-h-[300px] overflow-y-auto"
          onCloseAutoFocus={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Add Node
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {nodeLibraryItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(item.id);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: item.color }} />
                <span className="text-sm">{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


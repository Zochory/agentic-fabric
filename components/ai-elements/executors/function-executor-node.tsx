"use client";

import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { Info, ChevronDown, ChevronUp, Code, Settings, FileCode } from "lucide-react";
import type { FunctionExecutor } from "@/lib/workflow/executors";

import { ConnectionHandle } from "@/components/ai-elements/connection-handle";

/**
 * Function executor node data
 */
export interface FunctionExecutorNodeData {
  variant: "function-executor";
  handles: {
    target: boolean;
    source: boolean;
  };
  executor: FunctionExecutor;
  label?: string;
  description?: string;
  status?: "idle" | "running" | "completed" | "error";
}

/**
 * Props for FunctionExecutorNode component
 */
export interface FunctionExecutorNodeProps {
  id: string;
  data: FunctionExecutorNodeData;
  selected?: boolean;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

/**
 * Function executor node component
 */
export const FunctionExecutorNode = memo(({ id, data, selected }: FunctionExecutorNodeProps) => {
  const { handles, executor, label } = data;
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalHovered, setInternalHovered] = useState(false);

  const displayLabel = label || executor.label || executor.functionName || executor.id;
  const executorTypeName = "function-executor";
  
  // Get model from metadata or default
  const metadata = (executor.metadata as Record<string, unknown> | undefined) ?? {};
  const model = (metadata.model as string | undefined) || "GPT-5";

  const hovered = internalHovered;

  const toggleCollapse = () => {
    setInternalCollapsed(!internalCollapsed);
  };

  // Get current values for suggestions
  const currentFunctionName = executor.functionName || "—";
  const parametersCount = executor.parameters ? Object.keys(executor.parameters).length : 0;
  const currentParameters = parametersCount > 0 ? `${parametersCount} parameter(s)` : "None";
  const hasCode = !!executor.functionCode;
  const currentCode = hasCode ? "Configured" : "None";
  const hasFunctionId = !!executor.functionId;
  const currentFunctionId = hasFunctionId ? executor.functionId || "—" : "None";

  // Suggestions for Function Executor - matching main parameters exactly as shown in properties panel
  const suggestions = [
    {
      icon: FileCode,
      label: `Function Name ${currentFunctionName}`,
    },
    {
      icon: Settings,
      label: `Parameters ${currentParameters}`,
    },
    {
      icon: Code,
      label: `Function Code ${currentCode}`,
    },
    {
      icon: FileCode,
      label: `Function ID ${currentFunctionId}`,
    },
  ];

  const isCollapsed = internalCollapsed;

  return (
    <motion.div
      layout
      transition={springTransition}
      className="w-[352px]"
      data-id={id}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
    >
      {/* Collapsed State */}
      {isCollapsed ? (
        <motion.button
          aria-label={`Expand ${displayLabel}`}
          layoutId={`node-${id}`}
          onClick={toggleCollapse}
          initial={{
            scale: 0.95,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0.95,
            opacity: 0,
          }}
          transition={springTransition}
          className={`
            w-full px-4 py-3 rounded-2xl
            bg-[rgba(32,32,32,0.9)] backdrop-blur-2xl
            border transition-all duration-200
            ${
              selected
                ? "border-blue-500/50 ring-2 ring-blue-500/20"
                : hovered
                ? "border-white/10"
                : "border-white/5"
            }
            hover:border-white/15 active:scale-98
            flex items-center justify-between
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              layoutId={`node-title-${id}`}
              transition={springTransition}
              className="text-base text-gray-300 truncate"
            >
              {displayLabel}
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                ...springTransition,
                delay: 0.1,
              }}
              className="text-xs text-gray-600"
            >
              {model}
            </motion.div>
          </div>
          <motion.div
            initial={{
              rotate: 180,
              opacity: 0,
            }}
            animate={{
              rotate: 0,
              opacity: 1,
            }}
            transition={springTransition}
          >
            <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
          </motion.div>
        </motion.button>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={springTransition}
            className="mb-2 px-0"
          >
            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="min-w-0">
                <motion.div
                  layoutId={`node-title-${id}`}
                  transition={springTransition}
                  className={`text-[24px] leading-[30px] truncate transition-colors duration-200 ${
                    hovered ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {displayLabel}
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    ...springTransition,
                    delay: 0.05,
                  }}
                  className="text-sm text-gray-600 truncate max-w-[120px]"
                >
                  {model}
                </motion.div>
                <motion.button
                  aria-label={`Collapse ${displayLabel}`}
                  onClick={toggleCollapse}
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  transition={springTransition}
                  className="p-1 rounded hover:bg-white/5 transition-colors"
                >
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                </motion.button>
              </div>
            </div>
          </motion.div>
          {/* Card */}
          <motion.div
            layoutId={`node-${id}`}
            className="relative"
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              ...springTransition,
              opacity: {
                duration: 0.2,
              },
            }}
          >
            <motion.div
              initial={{
                borderRadius: 16,
              }}
              animate={{
                borderRadius: 16,
              }}
              transition={springTransition}
              className={`
                relative h-[352px] w-[352px] rounded-2xl
                bg-[rgba(32,32,32,0.9)] backdrop-blur-2xl
                border transition-all duration-200
                ${
                  selected
                    ? "border-blue-500/50 ring-2 ring-blue-500/20"
                    : hovered
                    ? "border-white/10"
                    : "border-white/5"
                }
              `}
            >
              <div className="flex flex-col h-full rounded-2xl overflow-hidden">
                {/* Content Area */}
                <div className="relative flex-1 flex flex-col overflow-hidden">
                  {/* Empty State with Suggestions */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      {/* Info Banner */}
                      <motion.div
                        initial={{
                          y: -10,
                          opacity: 0,
                        }}
                        animate={{
                          y: 0,
                          opacity: 1,
                        }}
                        transition={{
                          ...springTransition,
                          delay: 0.1,
                        }}
                        onClick={toggleCollapse}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                      >
                        <button className="flex items-center gap-3 text-gray-600 hover:text-gray-400 transition-colors duration-300">
                          <Info className="h-3.5 w-3.5" />
                          <p className="text-xs leading-[16.5px] -tracking-[0.16px]">
                            Learn about {executorTypeName}
                          </p>
                        </button>
                      </motion.div>
                      <hr className="border-t border-[rgb(41,47,53)]" />
                      {/* Suggestions */}
                      <div className="flex items-start h-[260px]">
                        <div className="flex-1 flex flex-col gap-4 px-6 pt-4">
                          <motion.span
                            initial={{
                              opacity: 0,
                              x: -10,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              ...springTransition,
                              delay: 0.15,
                            }}
                            className="text-gray-600 text-xs leading-[16.5px] -tracking-[0.16px]"
                          >
                            Try to...
                          </motion.span>
                          <div className="flex flex-col gap-3">
                            {suggestions.map((suggestion, index) => {
                              const Icon = suggestion.icon;
                              return (
                                <motion.button
                                  key={index}
                                  initial={{
                                    opacity: 0,
                                    x: -20,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                  }}
                                  transition={{
                                    ...springTransition,
                                    delay: 0.2 + index * 0.05,
                                  }}
                                  whileHover={{
                                    x: 4,
                                    scale: 1.02,
                                  }}
                                  whileTap={{
                                    scale: 0.98,
                                  }}
                                  className="flex items-center gap-1 p-0.5 rounded text-gray-400 hover:text-gray-300 hover:bg-white/5 transition-all duration-200"
                                >
                                  <Icon className="h-3 w-3" />
                                  <span className="text-xs leading-[16.5px] -tracking-[0.16px]">
                                    {suggestion.label}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            {/* ReactFlow Handles */}
            {handles.target && (
              <Handle position={Position.Left} type="target" />
            )}
            {handles.source && (
              <Handle position={Position.Right} type="source" />
            )}
            {/* Connection Handles */}
            {handles.target && (
              <ConnectionHandle position="left" visible={hovered} />
            )}
            {handles.source && (
              <ConnectionHandle position="right" visible={hovered} />
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
});

FunctionExecutorNode.displayName = "FunctionExecutorNode";

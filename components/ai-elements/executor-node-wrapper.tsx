"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Handle, Position } from "@xyflow/react";
import { ConnectionHandle } from "./connection-handle";

interface ExecutorNodeWrapperProps {
  children: React.ReactNode;
  selected?: boolean;
  dataId?: string;
  className?: string;
  handles?: {
    target: boolean;
    source: boolean;
  };
}

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const ExecutorNodeWrapper: React.FC<ExecutorNodeWrapperProps> = ({
  children,
  selected = false,
  dataId,
  className = "",
  handles = { target: true, source: true },
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      transition={springTransition}
      className={`w-[352px] ${className}`}
      data-id={dataId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
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
        transition={{
          ...springTransition,
          opacity: {
            duration: 0.2,
          },
        }}
        className="relative"
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
                : isHovered
                ? "border-white/10"
                : "border-white/5"
            }
          `}
        >
          {/* React Flow Handles - positioned at connection points, made larger for easier dragging */}
          {handles.target && (
            <Handle
              id="target"
              type="target"
              position={Position.Left}
              className="!w-12 !h-12 !bg-transparent !border-none !rounded-none !cursor-grab !left-[-32px] !top-[176px]"
              style={{
                width: "48px",
                height: "48px",
                transform: "translate(-50%, -50%)",
                pointerEvents: "auto",
              }}
            />
          )}
          {handles.source && (
            <Handle
              id="source"
              type="source"
              position={Position.Right}
              className="!w-12 !h-12 !bg-transparent !border-none !rounded-none !cursor-grab !right-[-32px] !top-[176px]"
              style={{
                width: "48px",
                height: "48px",
                transform: "translate(50%, -50%)",
                pointerEvents: "auto",
              }}
            />
          )}
          {children}
        </motion.div>
        {/* Custom Connection Handles (visual only - handles functional above) */}
        {handles.target && (
          <ConnectionHandle 
            position="left" 
            visible={isHovered} 
          />
        )}
        {handles.source && (
          <ConnectionHandle 
            position="right" 
            visible={isHovered} 
          />
        )}
      </motion.div>
    </motion.div>
  );
};

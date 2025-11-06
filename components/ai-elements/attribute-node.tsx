"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Settings, Check, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type {
  AttributeDefinition,
  AttributeNodeData,
  AttributeType,
} from "@/lib/workflow/types";

type AttributeNodeProps = Omit<AttributeNodeData, "variant" | "handles"> & {
  isSelected?: boolean;
  isHovered?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onAttributeChange?: (id: string, value: any) => void;
  "data-id"?: string;
};

export const AttributeNode: React.FC<AttributeNodeProps> = ({
  title = "Attributes",
  model = "GPT-5",
  attributes = [],
  isSelected = false,
  isHovered = false,
  collapsed = false,
  onToggleCollapse,
  onAttributeChange,
  "data-id": dataId,
}) => {
  const [internalHovered, setInternalHovered] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    attributes.forEach((attr) => {
      initial[attr.id] = attr.value ?? getDefaultValue(attr.type);
    });
    return initial;
  });

  useEffect(() => {
    setInternalCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    setValues((prev) => {
      const next: Record<string, any> = {};

      attributes.forEach((attr) => {
        const previousValue = prev[attr.id];
        next[attr.id] =
          attr.value ?? previousValue ?? getDefaultValue(attr.type);
      });

      return next;
    });
  }, [attributes]);

  const hovered = isHovered || internalHovered;
  const isCollapsed = internalCollapsed;

  const handleChange = (id: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
    onAttributeChange?.(id, value);
  };

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  return (
    <motion.div
      layout
      transition={springTransition}
      className="w-[352px]"
      data-id={dataId}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
    >
      {/* Collapsed State */}
      {isCollapsed ? (
        <motion.button
          aria-label={`Expand ${title}`}
          layoutId={`attr-node-${dataId || title}`}
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
              isSelected
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
              initial={{
                rotate: -90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              transition={springTransition}
            >
              <Settings className="h-4 w-4 text-gray-500 shrink-0" />
            </motion.div>
            <motion.div
              layoutId={`attr-title-${dataId || title}`}
              transition={springTransition}
              className="text-base text-gray-300 truncate"
            >
              {title}
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
                  layoutId={`attr-title-${dataId || title}`}
                  transition={springTransition}
                  className={`text-[24px] leading-[30px] truncate transition-colors duration-200 ${
                    hovered ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {title}
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
                  aria-label={`Collapse ${title}`}
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
            layoutId={`attr-node-${dataId || title}`}
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
                  isSelected
                    ? "border-blue-500/50 ring-2 ring-blue-500/20"
                    : hovered
                    ? "border-white/10"
                    : "border-white/5"
                }
              `}
            >
              <div className="flex flex-col h-full rounded-2xl overflow-hidden">
                {/* Header with Icon */}
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
                  className="flex items-center gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-400">
                    Configure Parameters
                  </span>
                </motion.div>
                {/* Attributes List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {attributes.length === 0 ? (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={springTransition}
                      className="flex items-center justify-center h-full"
                    >
                      <p className="text-gray-600 text-sm">
                        No attributes configured
                      </p>
                    </motion.div>
                  ) : (
                    attributes.map((attr, index) => (
                      <motion.div
                        key={attr.id}
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
                          delay: 0.1 + index * 0.05,
                        }}
                      >
                        <AttributeControl
                          attribute={attr}
                          value={values[attr.id]}
                          onChange={(value) => handleChange(attr.id, value)}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
            {/* Connection Handles */}
            <ConnectionHandle position="right" visible={hovered} />
            <ConnectionHandle position="left" visible={hovered} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

interface AttributeControlProps {
  attribute: AttributeDefinition;
  value: any;
  onChange: (value: any) => void;
}

const AttributeControl: React.FC<AttributeControlProps> = ({
  attribute,
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const stopNodeDrag = {
    onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
    onTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
  } as const;

  const renderControl = () => {
    switch (attribute.type) {
      case "input":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...stopNodeDrag}
            className={`
              w-full px-3 py-2 rounded-lg
              bg-black/20 border transition-all duration-200
              text-white text-sm outline-none
              ${isFocused ? "border-white/20 bg-black/30" : "border-white/10"}
              hover:border-white/15
            `}
            placeholder={`Enter ${attribute.label.toLowerCase()}`}
          />
        );
      case "progress":
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{Math.round(value || 0)}%</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
                style={{
                  width: `${value || 0}%`,
                }}
              />
            </div>
            <input
              type="range"
              min={attribute.min || 0}
              max={attribute.max || 100}
              step={attribute.step || 1}
              value={value || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              {...stopNodeDrag}
              className="w-full accent-blue-500"
            />
          </div>
        );
      case "checkbox":
        return (
          <button
            onClick={() => onChange(!value)}
            {...stopNodeDrag}
            className={`
              flex items-center gap-3 w-full p-3 rounded-lg
              border transition-all duration-200
              ${
                value
                  ? "bg-blue-500/10 border-blue-500/30"
                  : "bg-black/20 border-white/10"
              }
              hover:border-white/20 active:scale-98
            `}
          >
            <div
              className={`
              w-5 h-5 rounded border-2 flex items-center justify-center
              transition-all duration-200
              ${value ? "bg-blue-500 border-blue-500" : "border-gray-600"}
            `}
            >
              {value && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm text-gray-300">
              Enable {attribute.label}
            </span>
          </button>
        );
      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...stopNodeDrag}
            className={`
              w-full px-3 py-2 rounded-lg
              bg-black/20 border transition-all duration-200
              text-white text-sm outline-none cursor-pointer
              ${isFocused ? "border-white/20 bg-black/30" : "border-white/10"}
              hover:border-white/15
            `}
          >
            <option value="">Select {attribute.label}</option>
            {attribute.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "slider":
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{attribute.label}</span>
              <span>{value || attribute.min || 0}</span>
            </div>
            <input
              type="range"
              min={attribute.min || 0}
              max={attribute.max || 100}
              step={attribute.step || 1}
              value={value || attribute.min || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              {...stopNodeDrag}
              className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-110"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 uppercase tracking-wider">
        {attribute.label}
      </label>
      {renderControl()}
    </div>
  );
};

const getDefaultValue = (type: AttributeType): any => {
  switch (type) {
    case "input":
      return "";
    case "progress":
      return 0;
    case "checkbox":
      return false;
    case "select":
      return "";
    case "slider":
      return 0;
    default:
      return null;
  }
};

interface ConnectionHandleProps {
  position: "left" | "right";
  visible?: boolean;
}

const ConnectionHandle: React.FC<ConnectionHandleProps> = ({
  position,
  visible = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className={`
          pointer-events-none absolute top-44 -translate-y-12 z-0
          flex h-24 w-px items-center
          bg-gradient-to-b from-transparent via-white to-transparent
          transition-opacity duration-300
          ${visible ? "opacity-100" : "opacity-0"}
          ${position === "right" ? "-right-px" : "-left-px"}
        `}
      />
      <div
        className={`
          absolute top-44 -translate-y-12 z-0
          flex h-24 items-center cursor-pointer
          transition-opacity duration-300
          ${visible || isHovered ? "opacity-100" : "opacity-0"}
          ${position === "right" ? "-right-8 left-80" : "-left-8 right-80"}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`p-5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
          ${isHovered ? "scale-110 bg-white/5" : "scale-100"}`}
        >
          <Plus
            className={`h-6 w-6 transition-colors duration-200 ${
              isHovered ? "text-white" : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </>
  );
};

"use client";

import React, { useMemo } from "react";
import {
  BaseEdge,
  type EdgeProps,
  getBezierPath,
  type InternalNode,
  type Node,
  Position,
  useInternalNode,
  useReactFlow,
} from "@xyflow/react";

/**
 * Enhanced edge types with improved handle position calculation
 */

/**
 * Calculate handle coordinates based on node position and handle type
 * Automatically determines the best handle position and applies smart offsets
 */
const getHandleCoordsByPosition = (
  node: InternalNode<Node>,
  handlePosition: Position,
  handleType: "source" | "target" = handlePosition === Position.Left ? "target" : "source"
): [number, number] => {
  const handle = node.internals.handleBounds?.[handleType]?.find(
    (h) => h.position === handlePosition
  );

  if (!handle) {
    // Fallback to node center if handle not found
    const bounds = node.internals.bounds;
    return [
      node.internals.positionAbsolute.x + (bounds?.width || 0) / 2,
      node.internals.positionAbsolute.y + (bounds?.height || 0) / 2,
    ];
  }

  // Smart offset calculation based on handle type and position
  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // Adjust offset based on handle position for proper connection alignment
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0; // Connect at the left edge
      break;
    case Position.Right:
      offsetX = handle.width; // Connect at the right edge
      break;
    case Position.Top:
      offsetY = 0; // Connect at the top edge
      break;
    case Position.Bottom:
      offsetY = handle.height; // Connect at the bottom edge
      break;
    default:
      // Use center if position is not recognized
      offsetX = handle.width / 2;
      offsetY = handle.height / 2;
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
};

/**
 * Get optimal edge parameters with automatic handle position detection
 */
const getEdgeParams = (
  source: InternalNode<Node>,
  target: InternalNode<Node>
) => {
  // Automatically determine best handle positions
  // Default: source from right, target from left
  const sourcePos = Position.Right;
  const targetPos = Position.Left;

  const [sx, sy] = getHandleCoordsByPosition(source, sourcePos, "source");
  const [tx, ty] = getHandleCoordsByPosition(target, targetPos, "target");

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
};

/**
 * Temporary Edge Component
 * - Uses dashed lines with ring color
 * - Typically used for preview/connection states
 * - Smooth Bezier curve connection
 */
export const TemporaryEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  source,
  target,
  style,
}: EdgeProps) => {
  // Always call hooks unconditionally
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const edgePath = useMemo(() => {
    // Use calculated positions if nodes are available
    if (sourceNode && targetNode) {
      const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
        sourceNode,
        targetNode
      );
      const [path] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetX: tx,
        targetY: ty,
        targetPosition: targetPos,
      });
      return path;
    }

    // Fallback to provided coordinates
    const [path] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition: sourcePosition || Position.Right,
      targetX,
      targetY,
      targetPosition: targetPosition || Position.Left,
    });
    return path;
  }, [
    sourceNode,
    targetNode,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  ]);

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      className="stroke-2 stroke-ring"
      style={{
        strokeDasharray: "8, 4",
        strokeLinecap: "round",
        opacity: 0.7,
        ...style,
      }}
    />
  );
};

/**
 * Props for AnimatedEdge component
 */
interface AnimatedEdgeProps extends EdgeProps {
  onHover?: (position: { x: number; y: number }, screenPosition: { x: number; y: number }) => void;
}

/**
 * Animated Edge Component
 * - Includes a moving circle indicator along the path
 * - Smooth Bezier curve connection
 * - Automatically calculates optimal handle positions
 * - Visual indicator shows flow direction
 * - Interactive button on hover to add nodes
 */
export const AnimatedEdge = ({
  id,
  source,
  target,
  markerEnd,
  style,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  onHover,
}: AnimatedEdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const [isHovered, setIsHovered] = React.useState(false);
  const reactFlow = useReactFlow();

  const { edgePath, midPoint } =
    useMemo(() => {
      if (sourceNode && targetNode) {
        const params = getEdgeParams(sourceNode, targetNode);
        const [path] = getBezierPath({
          sourceX: params.sx,
          sourceY: params.sy,
          sourcePosition: params.sourcePos,
          targetX: params.tx,
          targetY: params.ty,
          targetPosition: params.targetPos,
        });
        
        // Calculate midpoint
        const midX = (params.sx + params.tx) / 2;
        const midY = (params.sy + params.ty) / 2;
        
        return {
          edgePath: path,
          midPoint: { x: midX, y: midY },
        };
      }

      // Fallback to provided coordinates
      const [path] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition: sourcePosition || Position.Right,
        targetX,
        targetY,
        targetPosition: targetPosition || Position.Left,
      });
      
      // Calculate midpoint
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      
      return {
        edgePath: path,
        midPoint: { x: midX, y: midY },
      };
    }, [
      sourceNode,
      targetNode,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    ]);


  if (!edgePath) {
    return null;
  }

  return (
    <>
      <BaseEdge
        id={id}
        markerEnd={markerEnd}
        path={edgePath}
        style={{
          strokeWidth: 2,
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {/* Animated circle indicator */}
      <circle
        r="5"
        fill="hsl(var(--primary))"
        className="animate-pulse"
        opacity={0.8}
      >
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
          keyPoints="0;1"
          keyTimes="0;1"
        />
      </circle>
      {/* Secondary trailing indicator for better visibility */}
      <circle
        r="3"
        fill="hsl(var(--primary))"
        opacity={0.5}
      >
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
          keyPoints="0.2;1.2"
          keyTimes="0;1"
        />
      </circle>
      {/* Interactive button in the middle - shown on hover */}
      {isHovered && midPoint && onHover && (
        <foreignObject
          x={midPoint.x - 16}
          y={midPoint.y - 16}
          width="32"
          height="32"
          className="pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            const screenPos = reactFlow.flowToScreenPosition(midPoint);
            onHover(midPoint, screenPos);
          }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary shadow-lg cursor-pointer hover:bg-primary/10 transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-primary"
            >
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </foreignObject>
      )}
    </>
  );
};

/**
 * Export edge components for use in edgeTypes configuration
 */
export const Edge = {
  temporary: TemporaryEdge,
  animated: AnimatedEdge,
};

// Type exports for TypeScript
export type TemporaryEdgeProps = EdgeProps;
export type AnimatedEdgeProps = EdgeProps;

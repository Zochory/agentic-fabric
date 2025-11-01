import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from "@xyflow/react";
import type { BaseExecutor, BaseEdge, ExecutorId, EdgeId, EdgeCondition } from "./types";
import type { Workflow } from "./workflow";
import type {
  FunctionExecutor,
  AgentExecutor,
  WorkflowExecutor,
  RequestInfoExecutor,
  ExecutorType,
  MagenticAgentExecutor,
  MagenticOrchestratorExecutor,
  ToolReference,
} from "./executors";
import type {
  SingleEdgeGroup,
  FanInEdgeGroup,
  FanOutEdgeGroup,
  SwitchCaseEdgeGroup,
  EdgeGroup,
} from "./edges";
import type { ExecutorNodeData } from "@/components/ai-elements/executors/executor-node";
import type { FunctionExecutorNodeData } from "@/components/ai-elements/executors/function-executor-node";
import type { AgentExecutorNodeData } from "@/components/ai-elements/executors/agent-executor-node";
import type { WorkflowExecutorNodeData } from "@/components/ai-elements/executors/workflow-executor-node";
import type { RequestInfoExecutorNodeData } from "@/components/ai-elements/executors/request-info-executor-node";
import type { FanInNodeData } from "@/components/ai-elements/edge-groups/fan-in-node";
import type { FanOutNodeData } from "@/components/ai-elements/edge-groups/fan-out-node";
import type { SwitchCaseNodeData } from "@/components/ai-elements/edge-groups/switch-case-node";

// Import legacy node data types
import type {
  WorkflowStepNodeData,
  TextBlockNodeData,
  AttributeNodeData,
} from "./types";
import { MAGENTIC_AGENT_PRESET_MAP } from "./magentic-presets";
import type { MagenticAgentPresetKey } from "./magentic-presets";

/**
 * Extended React Flow node data that can contain executor or edge group data
 */
export type WorkflowNodeData =
  | ExecutorNodeData
  | FunctionExecutorNodeData
  | AgentExecutorNodeData
  | WorkflowExecutorNodeData
  | RequestInfoExecutorNodeData
  | FanInNodeData
  | FanOutNodeData
  | SwitchCaseNodeData
  | WorkflowStepNodeData
  | TextBlockNodeData
  | AttributeNodeData;

/**
 * Workflow node data with index signature to satisfy ReactFlow constraints
 */
export type WorkflowNodeDataWithIndex = WorkflowNodeData & Record<string, unknown>;

/**
 * React Flow node with workflow data
 */
export type WorkflowReactFlowNode = ReactFlowNode<WorkflowNodeDataWithIndex>;

/**
 * React Flow edge with workflow data
 */
export type WorkflowReactFlowEdge = ReactFlowEdge;

/**
 * Convert React Flow nodes and edges to Agent Framework Workflow format
 */
export function reactFlowToWorkflow(
  nodes: WorkflowReactFlowNode[],
  edges: WorkflowReactFlowEdge[],
  workflowId: string = "workflow-1",
  workflowName?: string
): Workflow {
  // Extract executors from nodes
  const executors: BaseExecutor[] = [];
  const nodePositions: Record<string, { x: number; y: number }> = {};

  for (const node of nodes) {
    // Store position for later restoration
    nodePositions[node.id] = node.position;

    // Handle executor nodes
    if (isExecutorNodeData(node.data)) {
      const executor = nodeToExecutor(node);
      if (executor) {
        // Store position in metadata
        if (!executor.metadata) {
          executor.metadata = {};
        }
        executor.metadata.position = node.position;
        executors.push(executor);
      }
    }
    // Edge groups are handled separately - they're represented as nodes but contain edge group data
  }

  // Convert edges
  const workflowEdges: BaseEdge[] = edges.map((edge) => {
    const condition = edge.data?.condition as EdgeCondition | undefined;
    let edgeCondition: EdgeCondition | undefined = undefined;
    
    if (condition) {
      if (condition.type === "predicate") {
        edgeCondition = {
          type: "predicate" as const,
          expression: condition.expression,
        };
      } else if (condition.type === "case") {
        edgeCondition = {
          type: "case" as const,
          caseValue: condition.caseValue,
        };
      }
    }

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      condition: edgeCondition,
      metadata: {
        ...edge.data,
        type: edge.type,
      },
    };
  });

  // Extract edge groups from nodes
  const edgeGroups: EdgeGroup[] = [];
  for (const node of nodes) {
    if (isEdgeGroupNode(node.data)) {
      const group = nodeDataToEdgeGroup(node.data);
      if (group) {
        edgeGroups.push(group);
      }
    }
  }

  return {
    id: workflowId,
    name: workflowName,
    executors,
    edges: workflowEdges,
    edgeGroups: edgeGroups.length > 0 ? edgeGroups : undefined,
    metadata: (() => {
      const metadata: Workflow["metadata"] = {
        createdAt: new Date().toISOString(),
        custom: {},
      };

      if (Object.keys(nodePositions).length > 0) {
        // For backwards compatibility, node positions are stored in both metadata.custom.nodePositions
        // and metadata.nodePositions. Older consumers may expect the root-level property, while newer
        // code should use metadata.custom.nodePositions. Remove the root-level property only after
        // all consumers have migrated.
        (metadata.custom as Record<string, unknown>).nodePositions = nodePositions;
        (metadata as Record<string, unknown>).nodePositions = nodePositions;
      }

      if (!metadata.custom || Object.keys(metadata.custom).length === 0) {
        delete metadata.custom;
      }

      return metadata;
    })(),
  };
}

/**
 * Convert Agent Framework Workflow format to React Flow nodes and edges
 */
export function workflowToReactFlow(workflow: Workflow): {
  nodes: WorkflowReactFlowNode[];
  edges: WorkflowReactFlowEdge[];
} {
  const nodes: WorkflowReactFlowNode[] = [];
  const edges: WorkflowReactFlowEdge[] = [];

  // Convert executors to nodes
  for (const executor of workflow.executors) {
    const nodePositions =
      (workflow.metadata?.custom?.nodePositions as Record<string, { x: number; y: number }> | undefined) ??
      ((workflow.metadata as Record<string, unknown> | undefined)?.nodePositions as Record<string, { x: number; y: number }> | undefined);
    const position =
      nodePositions?.[executor.id] ||
      ({ x: 0, y: 0 } as { x: number; y: number });

    const nodeData = executorToNodeData(executor);
    if (nodeData) {
      nodes.push({
        id: executor.id,
        type: getNodeTypeFromExecutor(executor),
        position,
        data: nodeData as WorkflowNodeDataWithIndex,
      });
    }
  }

  // Convert edge groups to nodes if they exist
  if (workflow.edgeGroups) {
    for (const group of workflow.edgeGroups) {
      const nodeData = edgeGroupToNodeData(group);
      if (nodeData) {
        // Position edge group nodes (would need layout logic in real implementation)
        const position = { x: 0, y: 0 };
        nodes.push({
          id: group.id,
          type: getNodeTypeFromEdgeGroup(group),
          position,
          data: nodeData as WorkflowNodeDataWithIndex,
        });
      }
    }
  }

  // Convert edges
  for (const edge of workflow.edges) {
    edges.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "animated",
      data: {
        condition: edge.condition,
        ...edge.metadata,
      },
    });
  }

  return { nodes, edges };
}

/**
 * Check if node data is executor data
 */
function isExecutorNodeData(
  data: WorkflowNodeData
): data is
  | ExecutorNodeData
  | FunctionExecutorNodeData
  | AgentExecutorNodeData
  | WorkflowExecutorNodeData
  | RequestInfoExecutorNodeData {
  return (
    data.variant === "executor" ||
    data.variant === "function-executor" ||
    data.variant === "agent-executor" ||
    data.variant === "workflow-executor" ||
    data.variant === "request-info-executor"
  );
}

/**
 * Check if node data is edge group data
 */
function isEdgeGroupNode(
  data: WorkflowNodeData
): data is FanInNodeData | FanOutNodeData | SwitchCaseNodeData {
  return (
    data.variant === "fan-in" ||
    data.variant === "fan-out" ||
    data.variant === "switch-case"
  );
}

/**
 * Convert React Flow node to executor
 */
function nodeToExecutor(node: WorkflowReactFlowNode): BaseExecutor | null {
  const data = node.data;
  if (!isExecutorNodeData(data)) {
    return null;
  }

  if (data.executor) {
    return { ...data.executor };
  }

  // Fallback: create basic executor from node
  return {
    id: node.id,
    type: (data.executorType as string) || "executor",
    label: data.label,
    description: data.description,
  };
}

/**
 * Convert executor to React Flow node data
 */
function executorToNodeData(
  executor: BaseExecutor
): WorkflowNodeData | null {
  const executorType = executor.type as ExecutorType;

  switch (executorType) {
    case "function-executor": {
      const funcExec = executor as FunctionExecutor;
      return {
        variant: "function-executor",
        handles: { target: true, source: true },
        executor: funcExec,
        label: funcExec.label,
        description: funcExec.description,
      } as FunctionExecutorNodeData;
    }
    case "agent-executor": {
      const agentExec = executor as AgentExecutor;
      return {
        variant: "agent-executor",
        handles: { target: true, source: true },
        executor: agentExec,
        label: agentExec.label,
        description: agentExec.description,
      } as AgentExecutorNodeData;
    }
    case "magentic-agent-executor": {
      const magenticAgent = executor as MagenticAgentExecutor;
      return {
        variant: "agent-executor",
        handles: { target: true, source: true },
        executor: magenticAgent as unknown as AgentExecutor,
        label: magenticAgent.label,
        description: magenticAgent.description,
      } as AgentExecutorNodeData;
    }
    case "workflow-executor": {
      const workflowExec = executor as WorkflowExecutor;
      return {
        variant: "workflow-executor",
        handles: { target: true, source: true },
        executor: workflowExec,
        label: workflowExec.label,
        description: workflowExec.description,
      } as WorkflowExecutorNodeData;
    }
    case "request-info-executor": {
      const reqExec = executor as RequestInfoExecutor;
      return {
        variant: "request-info-executor",
        handles: { target: true, source: true },
        executor: reqExec,
        label: reqExec.label,
        description: reqExec.description,
      } as RequestInfoExecutorNodeData;
    }
    case "magentic-orchestrator-executor": {
      const magenticOrchestrator = executor as MagenticOrchestratorExecutor;
      return {
        variant: "executor",
        handles: { target: true, source: true },
        executor: magenticOrchestrator as unknown as BaseExecutor,
        executorType: "magentic-orchestrator-executor",
        label: magenticOrchestrator.label,
        description: magenticOrchestrator.description,
      } as ExecutorNodeData;
    }
    default: {
      if ((executor as BaseExecutor).type === "magentic-agent-executor") {
        const magAgent = executor as MagenticAgentExecutor;
        return {
          variant: "agent-executor",
          handles: { target: true, source: true },
          executor: magAgent as unknown as AgentExecutor,
          label: magAgent.label,
          description: magAgent.description,
        } as AgentExecutorNodeData;
      }
      if ((executor as BaseExecutor).type === "magentic-orchestrator-executor") {
        const magOrchestrator = executor as MagenticOrchestratorExecutor;
        return {
          variant: "executor",
          handles: { target: true, source: true },
          executor: magOrchestrator as unknown as BaseExecutor,
          executorType: "magentic-orchestrator-executor",
          label: magOrchestrator.label,
          description: magOrchestrator.description,
        } as ExecutorNodeData;
      }
      return {
        variant: "executor",
        handles: { target: true, source: true },
        executor,
        executorType: executorType || "executor",
        label: executor.label,
        description: executor.description,
      } as ExecutorNodeData;
    }
  }
}

/**
 * Get React Flow node type from executor
 */
function getNodeTypeFromExecutor(executor: BaseExecutor): string {
  const executorType = executor.type as ExecutorType;
  switch (executorType) {
    case "function-executor":
      return "function-executor";
    case "agent-executor":
      return "agent-executor";
    case "magentic-agent-executor":
      return "magentic-agent-executor";
    case "workflow-executor":
      return "workflow-executor";
    case "request-info-executor":
      return "request-info-executor";
    case "magentic-orchestrator-executor":
      return "magentic-orchestrator-executor";
    default:
      return "executor";
  }
}

/**
 * Convert node data to edge group
 */
function nodeDataToEdgeGroup(
  data: WorkflowNodeData
): EdgeGroup | null {
  if (data.variant === "fan-in" && "group" in data) {
    return (data as FanInNodeData).group;
  }
  if (data.variant === "fan-out" && "group" in data) {
    return (data as FanOutNodeData).group;
  }
  if (data.variant === "switch-case" && "group" in data) {
    return (data as SwitchCaseNodeData).group;
  }
  return null;
}

/**
 * Convert edge group to node data
 */
function edgeGroupToNodeData(group: EdgeGroup): WorkflowNodeData | null {
  switch (group.type) {
    case "fan-in": {
      const fanIn = group as FanInEdgeGroup;
      return {
        variant: "fan-in",
        handles: {
          target: true,
          source: true,
          sourceCount: fanIn.sources.length,
        },
        group: fanIn,
      } as FanInNodeData;
    }
    case "fan-out": {
      const fanOut = group as FanOutEdgeGroup;
      return {
        variant: "fan-out",
        handles: {
          target: true,
          source: true,
          targetCount: fanOut.targets.length,
        },
        group: fanOut,
      } as FanOutNodeData;
    }
    case "switch-case": {
      const switchCase = group as SwitchCaseEdgeGroup;
      return {
        variant: "switch-case",
        handles: {
          target: true,
          source: true,
          caseCount: switchCase.cases.length,
        },
        group: switchCase,
      } as SwitchCaseNodeData;
    }
    default:
      return null;
  }
}

/**
 * Get React Flow node type from edge group
 */
function getNodeTypeFromEdgeGroup(group: EdgeGroup): string {
  switch (group.type) {
    case "fan-in":
      return "fan-in";
    case "fan-out":
      return "fan-out";
    case "switch-case":
      return "switch-case";
    default:
      return "executor";
  }
}

/**
 * Create default executor from node type
 */
interface CreateExecutorOptions {
  label?: string;
  presetKey?: string;
}

export function createExecutorFromNodeType(
  nodeType: string,
  id: string,
  label?: string,
  options?: CreateExecutorOptions
): BaseExecutor {
  switch (nodeType) {
    case "function-executor":
      return {
        id,
        type: "function-executor",
        label: label || "Function Executor",
        description: "Execute a function as a workflow node",
      } as FunctionExecutor;
    case "agent-executor":
      return {
        id,
        type: "agent-executor",
        label: label || "Agent Executor",
        description: "Use an AI agent to process messages",
      } as AgentExecutor;
    case "workflow-executor":
      return {
        id,
        type: "workflow-executor",
        label: label || "Workflow Executor",
        description: "Nest another workflow as an executor",
        workflowId: "",
      } as WorkflowExecutor;
    case "request-info-executor":
      return {
        id,
        type: "request-info-executor",
        label: label || "Request Info Executor",
        description: "Gateway for external information requests",
        requestType: "",
      } as RequestInfoExecutor;
    case "magentic-orchestrator-executor": {
      return {
        id,
        type: "magentic-orchestrator-executor",
        label: label || "Magentic Orchestrator",
        description: "Coordinates Magentic agents, planning and routing messages",
        planningStrategy: "adaptive",
        progressTracking: true,
        humanInTheLoop: false,
        metadata: {
          source: "agent-framework",
          magentic: {
            presetKey: "orchestrator",
            planningStrategy: "adaptive",
            progressTracking: true,
            humanInTheLoop: false,
          },
        },
      } as MagenticOrchestratorExecutor;
    }
    case "magentic-agent-executor": {
      const preset =
        options?.presetKey && MAGENTIC_AGENT_PRESET_MAP[options.presetKey as MagenticAgentPresetKey]
          ? MAGENTIC_AGENT_PRESET_MAP[options.presetKey as MagenticAgentPresetKey]
          : undefined;

      return {
        id,
        type: "magentic-agent-executor",
        label: label || preset?.label || "Magentic Agent",
        description:
          preset?.description || "Specialised Magentic agent that collaborates under the orchestrator",
        agentRole: preset?.agentRole || "generalist",
        capabilities: preset?.capabilities,
        systemPrompt: preset?.systemPrompt,
        tools: preset?.toolIds?.map((toolId) => ({ toolId, enabled: true } as ToolReference)),
        metadata: {
          source: "agent-framework",
          magentic: {
            presetKey: preset?.key ?? null,
            agentRole: preset?.agentRole || "generalist",
            capabilities: preset?.capabilities ?? [],
            toolIds: preset?.toolIds ?? [],
          },
        },
      } as MagenticAgentExecutor;
    }
    default:
      return {
        id,
        type: "executor",
        label: label || "Executor",
        description: "Base executor for processing messages",
      };
  }
}

/**
 * Create default node data from executor type
 */
export function createNodeDataFromExecutorType(
  executorType: ExecutorType,
  executor: BaseExecutor
): WorkflowNodeData {
  switch (executorType) {
    case "function-executor":
      return {
        variant: "function-executor",
        handles: { target: true, source: true },
        executor: executor as FunctionExecutor,
      } as FunctionExecutorNodeData;
    case "agent-executor":
      return {
        variant: "agent-executor",
        handles: { target: true, source: true },
        executor: executor as AgentExecutor,
      } as AgentExecutorNodeData;
    case "magentic-agent-executor":
      return {
        variant: "agent-executor",
        handles: { target: true, source: true },
        executor: executor as MagenticAgentExecutor,
      } as AgentExecutorNodeData;
    case "workflow-executor":
      return {
        variant: "workflow-executor",
        handles: { target: true, source: true },
        executor: executor as WorkflowExecutor,
      } as WorkflowExecutorNodeData;
    case "request-info-executor":
      return {
        variant: "request-info-executor",
        handles: { target: true, source: true },
        executor: executor as RequestInfoExecutor,
      } as RequestInfoExecutorNodeData;
    case "magentic-orchestrator-executor":
      return {
        variant: "executor",
        handles: { target: true, source: true },
        executor: executor as MagenticOrchestratorExecutor,
        executorType: "magentic-orchestrator-executor",
      } as ExecutorNodeData;
    default:
      return {
        variant: "executor",
        handles: { target: true, source: true },
        executor,
        executorType: "executor",
      } as ExecutorNodeData;
  }
}

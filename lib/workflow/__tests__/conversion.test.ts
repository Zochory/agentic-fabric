import { describe, it, expect } from "vitest";
import {
  reactFlowToWorkflow,
  workflowToReactFlow,
  createExecutorFromNodeType,
  createNodeDataFromExecutorType,
} from "../conversion";
import type { BaseExecutor } from "../types";
import type {
  FunctionExecutor,
  AgentExecutor,
  WorkflowExecutor,
  RequestInfoExecutor,
  MagenticAgentExecutor,
  MagenticOrchestratorExecutor,
} from "../executors";

describe("Conversion Utilities", () => {
  describe("createExecutorFromNodeType", () => {
    it("should create a function executor", () => {
      const executor = createExecutorFromNodeType("function-executor", "test-id", "Test Function");
      expect(executor.type).toBe("function-executor");
      expect(executor.id).toBe("test-id");
      expect(executor.label).toBe("Test Function");
    });

    it("should create an agent executor", () => {
      const executor = createExecutorFromNodeType("agent-executor", "agent-1");
      expect(executor.type).toBe("agent-executor");
      expect(executor.id).toBe("agent-1");
    });

    it("should create a workflow executor", () => {
      const executor = createExecutorFromNodeType("workflow-executor", "workflow-1");
      expect(executor.type).toBe("workflow-executor");
      expect((executor as WorkflowExecutor).workflowId).toBeDefined();
    });

    it("should create a request-info executor", () => {
      const executor = createExecutorFromNodeType("request-info-executor", "req-1");
      expect(executor.type).toBe("request-info-executor");
      expect((executor as RequestInfoExecutor).requestType).toBeDefined();
    });

    it("should create a magentic orchestrator executor", () => {
      const executor = createExecutorFromNodeType("magentic-orchestrator-executor", "orch-1");
      const orchestrator = executor as MagenticOrchestratorExecutor;
      expect(orchestrator.type).toBe("magentic-orchestrator-executor");
      expect(orchestrator.progressTracking).toBe(true);
    });

    it("should create a magentic agent executor with preset", () => {
      const executor = createExecutorFromNodeType(
        "magentic-agent-executor",
        "agent-role",
        undefined,
        { presetKey: "planner" }
      );
      const magentic = executor as MagenticAgentExecutor;
      expect(magentic.type).toBe("magentic-agent-executor");
      expect(magentic.agentRole).toBe("planner");
      expect(magentic.capabilities).toContain("planning");
    });

    it("should create a default executor for unknown types", () => {
      const executor = createExecutorFromNodeType("unknown-type" as any, "default-1");
      expect(executor.type).toBe("executor");
    });
  });

  describe("reactFlowToWorkflow", () => {
    it("should convert React Flow nodes and edges to workflow format", () => {
      const nodes = [
        {
          id: "executor-1",
          type: "executor",
          position: { x: 100, y: 100 },
          data: {
            variant: "executor" as const,
            handles: { target: true, source: true },
            executor: {
              id: "executor-1",
              type: "executor",
              label: "Test Executor",
            },
            executorType: "executor" as const,
          },
        },
      ];

      const edges = [
        {
          id: "edge-1",
          source: "executor-1",
          target: "executor-2",
          type: "animated",
        },
      ];

      const workflow = reactFlowToWorkflow(nodes as any, edges, "workflow-1", "Test Workflow");

      expect(workflow.id).toBe("workflow-1");
      expect(workflow.name).toBe("Test Workflow");
      expect(workflow.executors).toHaveLength(1);
      expect(workflow.executors[0].id).toBe("executor-1");
      expect(workflow.edges).toHaveLength(1);
      expect(workflow.edges[0].source).toBe("executor-1");
      expect(workflow.edges[0].target).toBe("executor-2");
    });

    it("should preserve node positions in metadata", () => {
      const nodes = [
        {
          id: "executor-1",
          type: "executor",
          position: { x: 200, y: 300 },
          data: {
            variant: "executor" as const,
            handles: { target: true, source: true },
            executor: {
              id: "executor-1",
              type: "executor",
            },
            executorType: "executor" as const,
          },
        },
      ];

      const workflow = reactFlowToWorkflow(nodes as any, [], "workflow-1");
      expect(workflow.metadata?.nodePositions?.["executor-1"]).toEqual({ x: 200, y: 300 });
    });
  });

  describe("workflowToReactFlow", () => {
    it("should convert workflow format to React Flow nodes and edges", () => {
    const workflow = {
      id: "workflow-1",
      name: "Test Workflow",
      executors: [
        {
          id: "executor-1",
          type: "executor",
          label: "Test Executor",
        },
        {
          id: "executor-2",
          type: "agent-executor",
          label: "Test Agent",
          agentId: "agent-1",
        } as AgentExecutor,
        {
          id: "orch-1",
          type: "magentic-orchestrator-executor",
          label: "Orchestrator",
        } as MagenticOrchestratorExecutor,
      ],
      edges: [
        {
          id: "edge-1",
          source: "executor-1",
          target: "executor-2",
        },
        {
          id: "edge-2",
          source: "orch-1",
          target: "executor-2",
        },
      ],
      metadata: {
        nodePositions: {
          "executor-1": { x: 100, y: 100 },
          "executor-2": { x: 300, y: 100 },
          "orch-1": { x: 200, y: -50 },
        },
      },
    };

    const { nodes, edges } = workflowToReactFlow(workflow);

    expect(nodes).toHaveLength(3);
    expect(nodes[0].id).toBe("executor-1");
    expect(nodes[0].position).toEqual({ x: 100, y: 100 });
    expect(nodes[1].id).toBe("executor-2");
    expect(nodes[1].type).toBe("agent-executor");
    const orchestratorNode = nodes.find((node) => node.id === "orch-1");
    expect(orchestratorNode?.type).toBe("magentic-orchestrator-executor");

    expect(edges).toHaveLength(2);
    expect(edges[0].source).toBe("executor-1");
    expect(edges[0].target).toBe("executor-2");
  });

    it("should handle missing node positions with default", () => {
      const workflow = {
        id: "workflow-1",
        executors: [
          {
            id: "executor-1",
            type: "executor",
          },
        ],
        edges: [],
      };

      const { nodes } = workflowToReactFlow(workflow);
      expect(nodes[0].position).toEqual({ x: 0, y: 0 });
    });
  });

  describe("createNodeDataFromExecutorType", () => {
    it("should create function executor node data", () => {
      const executor: FunctionExecutor = {
        id: "func-1",
        type: "function-executor",
        functionName: "testFunction",
      };
      const nodeData = createNodeDataFromExecutorType("function-executor", executor);
      expect(nodeData.variant).toBe("function-executor");
    });

    it("should create agent executor node data", () => {
      const executor: AgentExecutor = {
        id: "agent-1",
        type: "agent-executor",
        agentId: "agent-1",
      };
      const nodeData = createNodeDataFromExecutorType("agent-executor", executor);
      expect(nodeData.variant).toBe("agent-executor");
    });

    it("should create magentic agent node data", () => {
      const executor: MagenticAgentExecutor = {
        id: "mag-agent-1",
        type: "magentic-agent-executor",
        agentRole: "planner",
      };
      const nodeData = createNodeDataFromExecutorType("magentic-agent-executor", executor);
      expect(nodeData.variant).toBe("agent-executor");
    });

    it("should create magentic orchestrator node data", () => {
      const executor: MagenticOrchestratorExecutor = {
        id: "orch-1",
        type: "magentic-orchestrator-executor",
        planningStrategy: "adaptive",
      };
      const nodeData = createNodeDataFromExecutorType("magentic-orchestrator-executor", executor);
      expect(nodeData.variant).toBe("executor");
    });

    it("should create workflow executor node data", () => {
      const executor: WorkflowExecutor = {
        id: "workflow-1",
        type: "workflow-executor",
        workflowId: "nested-1",
      };
      const nodeData = createNodeDataFromExecutorType("workflow-executor", executor);
      expect(nodeData.variant).toBe("workflow-executor");
    });

    it("should create request-info executor node data", () => {
      const executor: RequestInfoExecutor = {
        id: "req-1",
        type: "request-info-executor",
        requestType: "user-input",
      };
      const nodeData = createNodeDataFromExecutorType("request-info-executor", executor);
      expect(nodeData.variant).toBe("request-info-executor");
    });
  });
});

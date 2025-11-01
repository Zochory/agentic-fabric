import { describe, expect, it } from "vitest";
import { reactFlowToWorkflow } from "../conversion";
import type { WorkflowReactFlowNode, WorkflowNodeDataWithIndex } from "../conversion";

const createEdgeGroupNode = (id: string, type: "fan-in" | "fan-out" | "switch-case"): WorkflowReactFlowNode => {
  if (type === "fan-in") {
    return {
      id,
      type,
      position: { x: 0, y: 0 },
      data: {
        variant: "fan-in",
        handles: { target: true, source: true, sourceCount: 0 },
        group: {
          id,
          type: "fan-in",
          sources: [],
          target: "",
          edges: [],
        },
      } as WorkflowNodeDataWithIndex,
    };
  }

  if (type === "fan-out") {
    return {
      id,
      type,
      position: { x: 0, y: 0 },
      data: {
        variant: "fan-out",
        handles: { target: true, source: true, targetCount: 0 },
        group: {
          id,
          type: "fan-out",
          source: "",
          targets: [],
          edges: [],
          broadcastMode: "parallel",
        },
      } as WorkflowNodeDataWithIndex,
    };
  }

  return {
    id,
    type,
    position: { x: 0, y: 0 },
    data: {
      variant: "switch-case",
      handles: { target: true, source: true, caseCount: 0 },
      group: {
        id,
        type: "switch-case",
        source: "",
        cases: [],
        switchExpression: "message.type",
      },
    } as WorkflowNodeDataWithIndex,
  };
};

describe("reactFlowToWorkflow edge group conversion", () => {
  it("collects edge groups from React Flow nodes", () => {
    const nodes: WorkflowReactFlowNode[] = [
      createEdgeGroupNode("fan-in-test", "fan-in"),
      createEdgeGroupNode("fan-out-test", "fan-out"),
      createEdgeGroupNode("switch-test", "switch-case"),
    ];

    const workflow = reactFlowToWorkflow(nodes, [], "workflow-edge-groups");

    expect(workflow.edgeGroups).toBeDefined();
    expect(workflow.edgeGroups).toHaveLength(3);

    const types = workflow.edgeGroups?.map((group) => group.type);
    expect(types).toEqual(expect.arrayContaining(["fan-in", "fan-out", "switch-case"]));

    const fanIn = workflow.edgeGroups?.find((group) => group.id === "fan-in-test");
    expect(fanIn?.type).toBe("fan-in");
    const fanOut = workflow.edgeGroups?.find((group) => group.id === "fan-out-test");
    expect(fanOut?.type).toBe("fan-out");
    const switchCase = workflow.edgeGroups?.find((group) => group.id === "switch-test");
    expect(switchCase?.type).toBe("switch-case");
  });
});

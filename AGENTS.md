# Agents

## Architecture Overview
- Agents implement `AgentProtocol`, `BaseAgent`, and supporting middleware/context types in `lib/workflow/agent.ts`, establishing the shared run signature, streaming hooks, and optional context providers.
- Workflow nodes embed agents through the executor structures defined in `lib/workflow/executors.ts`, covering `AgentExecutor`, `MagenticAgentExecutor`, and `MagenticOrchestratorExecutor`.
- Tool integration is expressed by `WorkflowTool` and helper types in `lib/workflow/tools.ts`, which agent options, presets, and UI components reference when mapping `toolIds`.

## Magentic Workflow Support
- `createExecutorFromNodeType` seeds default orchestrator and agent executors, including metadata, preset wiring, and tool bindings for Magentic flows (see `lib/workflow/conversion.ts`).
- Runtime ↔ canvas conversions retain that metadata via `createNodeDataFromExecutorType`, letting the workflow builder rehydrate Magentic-specific editors (see `lib/workflow/conversion.ts`).
- Conversion tests pin these behaviours, asserting that the orchestrator enables progress tracking and that presets populate role/capability defaults (see `lib/workflow/__tests__/conversion.test.ts`).

## Built-in Magentic Agent Presets
Defined in `lib/workflow/magentic-presets.ts`. The `MAGENTIC_AGENT_PRESET_MAP` accessor is generated automatically, so adding a preset only requires updating the array.

| Key | Label | Role | Core duties | Default tools |
| --- | --- | --- | --- | --- |
| `planner` | Planner Agent | planner | Breaks work into steps, owns fact and progress ledgers. | `magentic-task-ledger`, `magentic-progress-ledger` |
| `web` | Web Surfer Agent | web-surfer | Gathers external facts via browsing and summarisation. | `web-browser`, `http-client` |
| `file` | File Surfer Agent | file-surfer | Surfaces, previews, and manages files for agent workflows. | `file-browser`, `file-preview` |
| `coder` | Coder Agent | coder | Writes and executes code to satisfy delegated subtasks. | `hosted-code-interpreter` |
| `critic` | Critic Agent | critic | Reviews teammate output for accuracy, completeness, and quality gates. | `analysis-notes` |

Each preset carries a tailored system prompt and capability list that the editor surfaces; choose the preset to auto-populate those defaults or switch to `custom` for free-form configuration.

**Note**: Additional presets (file surfer, terminal agent, etc.) can be easily added by extending the `MAGENTIC_AGENT_PRESETS` array in `lib/workflow/magentic-presets.ts`.

## Workflow Builder Integration
- The node library exposes both the Magentic orchestrator and every preset as draggable items so builders can scaffold full teams quickly (see `components/workflow-builder/node-library.tsx`).
- Selecting a Magentic agent node opens the preset-aware editor, which keeps metadata in sync, allows manual overrides, and mirrors tool IDs into executor state (see `components/workflow-builder/executor-editors/magentic-agent-executor-editor.tsx`).
- Orchestrator nodes surface planning strategy, progress tracking, human-in-the-loop toggles, and internal notes, writing the choices back into executor metadata with the `source: "agent-framework"` marker (see `components/workflow-builder/executor-editors/magentic-orchestrator-executor-editor.tsx`).

## Extending and Customising
1. Add or modify presets in `lib/workflow/magentic-presets.ts`, including a unique `key`, `agentRole`, concise `description`, capability list, and aligned `toolIds`. New IDs should correspond to entries exposed via `WorkflowTool` descriptors (see `lib/workflow/tools.ts`).
2. If the preset needs bespoke UI fields, extend the Magentic agent editor or introduce metadata handling similar to the existing merge helper (see `components/workflow-builder/executor-editors/magentic-agent-executor-editor.tsx`).
3. Update or add regression tests so `createExecutorFromNodeType` and React Flow conversions cover the new role defaults (see `lib/workflow/__tests__/conversion.test.ts`).
4. Optional: expose a convenience button in the node library, following the pattern used for existing presets (see `components/workflow-builder/node-library.tsx`).

## Non-Magentic Agents
For single-agent workflows, the generic agent editor configures chat or workflow-backed agents by setting IDs, model overrides, temperature, token limits, and tool invocation modes (see `components/workflow-builder/executor-editors/agent-executor-editor.tsx`). This path bypasses Magentic scaffolding but still honours the underlying `AgentProtocol` contracts.

## Validation
Run `npm run test -- conversion` to confirm Magentic executor helpers continue to pass their invariants, or `npm run test` for the full suite once presets or editors change. The conversion tests provide targeted regression coverage for orchestrator and preset wiring.

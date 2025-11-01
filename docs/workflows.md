# Workflows Documentation

## Overview

This document provides comprehensive documentation for the workflow system in Agentic Fabric, including workflow structure, execution model, conversion between UI and runtime representations, and best practices.

## Workflow Fundamentals

### What is a Workflow?

A workflow in Agentic Fabric is a directed graph where:
- **Nodes** represent executors (processing units that perform work)
- **Edges** represent data flow connections between executors
- **Edge Groups** provide advanced routing logic (fan-in, fan-out, switch-case)
- **Shared State** allows executors to communicate and share data

### Workflow Interface

```typescript
interface Workflow {
  id: string;
  name?: string;
  version?: string;
  description?: string;
  executors: BaseExecutor[];
  edges: BaseEdge[];
  edgeGroups?: EdgeGroup[];
  metadata?: WorkflowMetadata;
  state?: WorkflowState;
}
```

## Executors

Executors are the building blocks of workflows. Each executor performs a specific task.

### BaseExecutor Interface

```typescript
interface BaseExecutor {
  id: ExecutorId;
  type: string;
  label?: string;
  description?: string;
  input?: ExecutorInput;
  output?: ExecutorOutput;
  metadata?: Record<string, unknown>;
}
```

### Executor Types

#### 1. Function Executor

Executes JavaScript/TypeScript functions.

```typescript
interface FunctionExecutor extends BaseExecutor {
  type: "function";
  function: {
    code: string;
    parameters: FunctionParameter[];
    returnType?: string;
  };
}
```

**Use Cases:**
- Data transformation
- Custom business logic
- API calls
- Data validation

**Example:**
```javascript
// Function code
function processData(input) {
  return {
    processed: input.data.toUpperCase(),
    timestamp: Date.now()
  };
}
```

#### 2. Agent Executor

Runs AI agents with custom configurations.

```typescript
interface AgentExecutor extends BaseExecutor {
  type: "agent";
  agentId?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: ToolConfiguration[];
  capabilities?: string[];
}
```

**Use Cases:**
- Natural language processing
- Content generation
- Decision making
- Data analysis

**Example Configuration:**
```json
{
  "type": "agent",
  "model": "gpt-4",
  "systemPrompt": "You are a helpful assistant that analyzes data.",
  "temperature": 0.7,
  "maxTokens": 1000,
  "tools": [
    { "toolId": "web-search", "enabled": true }
  ]
}
```

#### 3. Workflow Executor

Embeds sub-workflows as reusable components.

```typescript
interface WorkflowExecutor extends BaseExecutor {
  type: "workflow";
  workflowId: string;
  inputMapping?: Record<string, string>;
  outputMapping?: Record<string, string>;
}
```

**Use Cases:**
- Modular workflow design
- Reusable workflow components
- Complex nested workflows

#### 4. Request Info Executor

Gathers user input during workflow execution.

```typescript
interface RequestInfoExecutor extends BaseExecutor {
  type: "request-info";
  prompt: string;
  fields: InputField[];
  validation?: ValidationRule[];
}
```

**Use Cases:**
- Human-in-the-loop workflows
- Form-based data collection
- Interactive decision points

#### 5. Magentic Agent Executor

Specialized agents from the Magentic framework.

```typescript
interface MagenticAgentExecutor extends BaseExecutor {
  type: "magentic-agent";
  agentRole: string;
  capabilities: string[];
  systemPrompt: string;
  tools: ToolConfiguration[];
  metadata: {
    magentic: {
      presetKey: MagenticAgentPresetKey;
    };
    source: "agent-framework";
  };
}
```

**Preset Types:**
- **Planner**: Creates task plans and assigns work
- **Web Surfer**: Gathers information from the web
- **File Surfer**: Reads and processes documents
- **Coder**: Writes and executes code
- **Terminal**: Runs shell commands
- **Critic**: Reviews and validates work

**Example - Planner Agent:**
```json
{
  "type": "magentic-agent",
  "agentRole": "planner",
  "capabilities": ["planning", "fact-gathering", "assignment"],
  "systemPrompt": "You are the planning specialist...",
  "tools": [
    { "toolId": "magentic-task-ledger", "enabled": true },
    { "toolId": "magentic-progress-ledger", "enabled": true }
  ]
}
```

#### 6. Magentic Orchestrator Executor

Coordinates multiple Magentic agents.

```typescript
interface MagenticOrchestratorExecutor extends BaseExecutor {
  type: "magentic-orchestrator";
  planningStrategy?: string;
  enableProgressTracking?: boolean;
  humanInLoop?: boolean;
  notes?: string;
}
```

**Use Cases:**
- Multi-agent collaboration
- Complex task delegation
- Team-based problem solving

## Edges

Edges connect executors and define data flow.

### BaseEdge Interface

```typescript
interface BaseEdge {
  id: EdgeId;
  source: ExecutorId;
  target: ExecutorId;
  condition?: EdgeCondition;
  transform?: EdgeTransform;
  metadata?: Record<string, unknown>;
}
```

### Edge Features

#### Conditional Edges

Edges can have conditions that determine if data flows:

```typescript
interface EdgeCondition {
  type: "expression" | "function";
  expression?: string;  // e.g., "output.status === 'success'"
  function?: string;    // JavaScript function
}
```

#### Edge Transforms

Transform data as it flows between executors:

```typescript
interface EdgeTransform {
  type: "map" | "filter" | "function";
  mapping?: Record<string, string>;
  function?: string;
}
```

## Edge Groups

Edge groups enable advanced routing patterns.

### Fan-In Edge Group

Merges multiple inputs into a single output.

```typescript
interface FanInEdgeGroup {
  type: "fan-in";
  sources: ExecutorId[];
  target: ExecutorId;
  mergeStrategy?: "all" | "any" | "first";
}
```

**Merge Strategies:**
- `all`: Wait for all sources to complete
- `any`: Proceed when any source completes
- `first`: Use only the first completed source

**Use Cases:**
- Gathering results from parallel tasks
- Combining data from multiple sources
- Synchronization points

### Fan-Out Edge Group

Broadcasts input to multiple outputs.

```typescript
interface FanOutEdgeGroup {
  type: "fan-out";
  source: ExecutorId;
  targets: ExecutorId[];
  broadcastMode: "parallel" | "sequential";
}
```

**Broadcast Modes:**
- `parallel`: Execute all targets simultaneously
- `sequential`: Execute targets one after another

**Use Cases:**
- Parallel processing
- Broadcasting notifications
- Running multiple analyses

### Switch-Case Edge Group

Routes based on conditional logic.

```typescript
interface SwitchCaseEdgeGroup {
  type: "switch-case";
  source: ExecutorId;
  switchExpression: string;
  cases: CaseRoute[];
  defaultTarget?: ExecutorId;
}

interface CaseRoute {
  condition: string;
  target: ExecutorId;
  label?: string;
}
```

**Use Cases:**
- Conditional routing
- Business logic branching
- Error handling paths

**Example:**
```json
{
  "switchExpression": "output.type",
  "cases": [
    { "condition": "'success'", "target": "success-handler" },
    { "condition": "'error'", "target": "error-handler" },
    { "condition": "'warning'", "target": "warning-handler" }
  ],
  "defaultTarget": "default-handler"
}
```

## Workflow State

### Shared State

Executors can read from and write to shared workflow state:

```typescript
interface SharedState {
  [key: string]: unknown;
}

// Accessing shared state in executors
context.sharedState.get("key");
context.sharedState.set("key", value);
```

**Use Cases:**
- Passing data between non-connected executors
- Global configuration
- Accumulating results

### Workflow Status

```typescript
type WorkflowStatus = 
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";
```

### Execution State

```typescript
interface WorkflowState {
  runId: string;
  status: WorkflowStatus;
  sharedState: SharedState;
  checkpoints?: WorkflowCheckpoint[];
  events: WorkflowEvent[];
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: WorkflowError;
}
```

## Workflow Conversion

### React Flow ↔ Workflow Conversion

The system converts between two representations:

1. **React Flow Representation** (UI Layer)
   - Nodes with position data
   - Visual styling information
   - UI-specific metadata

2. **Workflow Representation** (Runtime Layer)
   - Pure executor definitions
   - Edge logic without UI concerns
   - Execution metadata

### Conversion Functions

#### reactFlowToWorkflow()

Converts React Flow state to executable workflow:

```typescript
function reactFlowToWorkflow(
  nodes: ReactFlowNode[],
  edges: Edge[],
  workflowId: string,
  workflowName?: string
): Workflow
```

**Process:**
1. Extract executor data from nodes
2. Convert edges to runtime format
3. Group edges into edge groups
4. Build workflow metadata
5. Validate workflow structure

#### workflowToReactFlow()

Converts workflow to React Flow state:

```typescript
function workflowToReactFlow(
  workflow: Workflow
): { nodes: ReactFlowNode[], edges: Edge[] }
```

**Process:**
1. Create nodes from executors
2. Apply layout (if positions not saved)
3. Create edges from workflow edges
4. Expand edge groups to visual edges
5. Apply styling and UI metadata

### Metadata Preservation

Important metadata is preserved during round-trip conversion:

- Node positions
- UI preferences
- Magentic preset keys
- Custom executor configurations
- Visual styling choices

## Workflow Execution (Conceptual)

### Execution Model

1. **Initialization**
   - Create workflow state
   - Initialize shared state
   - Prepare executors

2. **Execution Loop**
   - Identify ready executors (all inputs satisfied)
   - Execute ready executors
   - Update shared state
   - Follow edges to next executors
   - Handle edge groups

3. **Completion**
   - All executors completed
   - Collect final outputs
   - Generate execution report

### Execution Context

Each executor receives a context:

```typescript
interface WorkflowContext {
  workflowId: string;
  runId: string;
  sharedState: SharedState;
  input: unknown;
  messages: BaseMessage[];
  emitEvent: (event: WorkflowEvent) => void;
}
```

### Event System

Workflows emit events during execution:

```typescript
interface WorkflowEvent {
  type: string;
  timestamp: string;
  executorId?: ExecutorId;
  data?: unknown;
}
```

**Event Types:**
- `workflow.started`
- `workflow.completed`
- `workflow.failed`
- `executor.started`
- `executor.completed`
- `executor.failed`
- `edge.traversed`

## Workflow Patterns

### Common Patterns

#### 1. Sequential Pipeline

```
A → B → C → D
```

Simple linear flow for step-by-step processing.

#### 2. Parallel Processing

```
     ┌→ B →┐
A → fan-out    fan-in → D
     └→ C →┘
```

Process multiple tasks in parallel and merge results.

#### 3. Conditional Branching

```
         ┌→ B (success)
A → switch
         └→ C (error)
```

Route based on conditions.

#### 4. Map-Reduce

```
     ┌→ B →┐
     ├→ C →┤
A →  ├→ D →├ → fan-in → F
     ├→ E →┤
     └→ ... →┘
```

Distribute work and collect results.

#### 5. Human-in-the-Loop

```
A → request-info → B → C
```

Pause for user input during execution.

#### 6. Magentic Team

```
          ┌→ Planner  →┐
          ├→ Web      →┤
Orchestrator ├→ Coder    →├ Orchestrator
          ├→ Critic   →┤
          └→ Terminal →┘
```

Multi-agent collaboration with orchestration.

## Best Practices

### Workflow Design

1. **Keep It Simple**: Start with simple workflows and add complexity as needed
2. **Modular Design**: Use workflow executors to create reusable components
3. **Error Handling**: Always include error paths and validation
4. **State Management**: Use shared state judiciously; prefer explicit edges
5. **Documentation**: Add descriptions to executors and workflows
6. **Testing**: Test workflows with various inputs and edge cases

### Executor Configuration

1. **Clear Labels**: Use descriptive labels and descriptions
2. **Type Safety**: Define input/output schemas where possible
3. **Validation**: Validate inputs before processing
4. **Error Reporting**: Provide clear error messages
5. **Resource Limits**: Set appropriate timeouts and token limits
6. **Tool Selection**: Only enable tools that are needed

### Edge Configuration

1. **Explicit Conditions**: Make edge conditions clear and testable
2. **Transform Data**: Use edge transforms to adapt data formats
3. **Avoid Cycles**: Be careful with circular dependencies
4. **Default Paths**: Provide default paths in switch-case groups
5. **Merge Strategy**: Choose appropriate fan-in strategies

### Performance

1. **Parallel When Possible**: Use fan-out for independent tasks
2. **Batch Operations**: Group similar operations
3. **Cache Results**: Use shared state to cache expensive computations
4. **Limit Nesting**: Avoid deep workflow nesting
5. **Monitor Execution**: Track execution time and resource usage

## Workflow Export/Import

### Export Format

Workflows export to JSON with this structure:

```json
{
  "id": "workflow-1",
  "name": "My Workflow",
  "version": "1.0.0",
  "executors": [...],
  "edges": [...],
  "edgeGroups": [...],
  "metadata": {
    "author": "...",
    "createdAt": "...",
    "tags": [...]
  }
}
```

### Import Validation

Imported workflows are validated for:
- Valid executor types
- Valid edge references
- No circular dependencies (in certain contexts)
- Valid edge group configurations
- Metadata schema compliance

### Version Compatibility

- Use semantic versioning for workflows
- Include version in metadata
- Handle older workflow versions gracefully
- Migrate workflows when schema changes

## Advanced Topics

### Dynamic Workflows

Future: Generate workflows programmatically based on:
- User requirements
- Template expansion
- AI-generated workflows

### Workflow Optimization

Future: Optimize workflows for:
- Execution time
- Resource usage
- Cost efficiency
- Parallelization

### Workflow Templates

Future: Create and share workflow templates:
- Industry-specific templates
- Common pattern libraries
- Template marketplace

### Distributed Execution

Future: Execute workflows across:
- Multiple servers
- Edge devices
- Cloud functions
- Hybrid environments

## Testing Workflows

### Test Coverage

1. **Unit Tests**: Test individual executors
2. **Integration Tests**: Test executor interactions
3. **End-to-End Tests**: Test complete workflows
4. **Edge Case Tests**: Test error conditions and edge cases

### Test Utilities

Located in `lib/workflow/__tests__/`:

```typescript
// Example test
import { reactFlowToWorkflow } from "../conversion";

test("converts simple workflow", () => {
  const nodes = [...];
  const edges = [...];
  const workflow = reactFlowToWorkflow(nodes, edges, "test-1");
  expect(workflow.executors).toHaveLength(3);
});
```

## Related Documentation

- [Architecture](./architecture.md) - System architecture
- [Components](./components.md) - UI components
- [Development](./development.md) - Development guidelines
- [AGENTS.md](../AGENTS.md) - Agent system details

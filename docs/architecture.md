# Architecture

## Overview

Agentic Fabric is built as a modern React web application with a clear separation between the UI layer and the core workflow engine. The architecture follows a modular design that promotes reusability, testability, and extensibility.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│  (React Components, Canvas, Node Library, Properties Panel) │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Workflow Builder Layer                     │
│     (Node Management, Edge Management, State Management)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Engine Layer                     │
│      (Executors, Agents, Tools, Conversion, Export)         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Runtime Layer                            │
│         (Execution, Streaming, Event Handling)               │
└─────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Workflow Engine (`lib/workflow/`)

The workflow engine is the heart of the system, providing the core abstractions and runtime for executing workflows.

#### Key Files and Responsibilities

- **`workflow.ts`** - Core workflow type definitions
  - `Workflow` interface: The main workflow structure
  - `WorkflowState`: Runtime state management
  - `WorkflowMetadata`: Workflow metadata and versioning

- **`executors.ts`** - Executor implementations
  - `BaseExecutor`: Base interface for all executors
  - `FunctionExecutor`: Executes JavaScript functions
  - `AgentExecutor`: Runs AI agents
  - `WorkflowExecutor`: Embeds sub-workflows
  - `MagenticAgentExecutor`: Magentic framework agents
  - `MagenticOrchestratorExecutor`: Multi-agent orchestration

- **`agent.ts`** - Agent protocol and base classes
  - `AgentProtocol`: Interface all agents must implement
  - `BaseAgent`: Common agent functionality
  - Agent lifecycle management
  - Streaming support

- **`edges.ts`** - Edge definitions and routing logic
  - `BaseEdge`: Simple point-to-point connections
  - `EdgeGroup`: Advanced routing constructs
  - `FanInEdgeGroup`: Merge multiple inputs
  - `FanOutEdgeGroup`: Broadcast to multiple outputs
  - `SwitchCaseEdgeGroup`: Conditional routing

- **`tools.ts`** - Tool protocol and definitions
  - `ToolProtocol`: Interface for tools
  - `AIFunction`: Typed function wrappers for AI models
  - Tool parameter validation

- **`conversion.ts`** - React Flow ↔ Workflow conversion
  - Converts UI representation to executable workflows
  - Converts workflows back to UI nodes
  - Maintains metadata during round-trip conversions

- **`magentic-presets.ts`** - Pre-configured agent templates
  - Planner, Web Surfer, Coder, Critic, etc.
  - System prompts and capabilities
  - Default tool bindings

### 2. UI Layer (`components/`)

The UI layer provides the visual interface for building and managing workflows.

#### Component Organization

- **`ai-elements/`** - AI-specific reusable components
  - Generic node, edge, and canvas components
  - Text block cards and attribute nodes
  - Executor-specific node renderers
  - Panel and toolbar components

- **`workflow-builder/`** - Workflow builder UI
  - `node-library.tsx`: Draggable node palette
  - `properties-panel.tsx`: Node configuration interface
  - `executor-editors/`: Specialized editors for each executor type
  - `top-navigation.tsx`: Main toolbar and actions
  - `bottom-controls.tsx`: Zoom, undo/redo controls

- **`ui/`** - Generic UI primitives
  - Button, Dialog, DropdownMenu, Select, etc.
  - Based on Radix UI primitives
  - Styled with Tailwind CSS and CVA variants

### 3. Application Layer (`app/`)

Next.js 16 App Router structure:

- **`page.tsx`** - Main workflow canvas page
  - React Flow provider setup
  - Canvas rendering and interaction
  - Node/edge state management
  - History (undo/redo) management

- **`layout.tsx`** - Root layout
  - Theme provider setup
  - Global styles
  - Font optimization

## Data Flow

### 1. Workflow Creation Flow

```
User Action (Drag Node)
  → Node Library Component
  → WorkflowCanvas onDrop handler
  → createExecutorFromNodeType()
  → createNodeDataFromExecutorType()
  → React Flow Node Created
  → State Updated (setNodes)
  → History Saved
```

### 2. Workflow Export Flow

```
React Flow State (nodes, edges)
  → reactFlowToWorkflow()
  → Workflow Definition (JSON)
  → Export Dialog
  → File Download / API
```

### 3. Workflow Import Flow

```
JSON File Upload
  → Import Dialog
  → Parse & Validate
  → workflowToReactFlow()
  → React Flow State
  → Canvas Updated
```

### 4. Execution Flow (Conceptual)

```
Start Node
  → Executor.execute(context)
  → Process Logic
  → Update Shared State
  → Emit Events
  → Follow Edges
  → Next Executor(s)
```

## State Management

### Canvas State

Managed by React Flow's built-in state management:
- Nodes array: All workflow nodes with position and data
- Edges array: All connections between nodes
- Viewport: Pan/zoom state

### History State

Custom implementation for undo/redo:
- Array of historical states (nodes + edges)
- Current history index
- Limited to last 50 states
- Saves on significant changes (not selection/position)

### Selected Node State

Local React state:
- Currently selected node for properties panel
- Synced with React Flow selection
- Updates on node changes

### Workflow State

Workflow-level state during execution:
- `WorkflowState` interface in workflow.ts
- Run ID, status, shared state
- Events, checkpoints, errors
- Executor-level states

## Type System

The project uses TypeScript with strict type checking. Key type patterns:

### Discriminated Unions

```typescript
type ExecutorType = 
  | "executor"
  | "function-executor"
  | "agent-executor"
  | "workflow-executor"
  // etc...
```

### Generic Interfaces

```typescript
interface AIFunction<TArgs, TReturn> {
  execute: (args: TArgs) => Promise<TReturn> | TReturn;
}
```

### Metadata Typing

```typescript
interface BaseExecutor {
  metadata?: Record<string, unknown>; // Flexible metadata
}
```

See [TYPE_SYSTEM.md](../lib/workflow/TYPE_SYSTEM.md) for detailed type documentation.

## Extension Points

### Adding New Executor Types

1. Define executor interface in `executors.ts`
2. Create executor editor in `components/workflow-builder/executor-editors/`
3. Create node renderer in `components/ai-elements/executors/`
4. Update `createExecutorFromNodeType()` in `conversion.ts`
5. Update `createNodeDataFromExecutorType()` in `conversion.ts`
6. Add to `nodeTypes` in `page.tsx`
7. Add to node library in `node-library.tsx`

### Adding New Agent Presets

1. Add preset definition to `magentic-presets.ts`
2. Define capabilities, tools, and system prompt
3. Preset automatically available in UI via `MAGENTIC_AGENT_PRESETS`
4. Add tests in `__tests__/conversion.test.ts`

### Adding New Tools

1. Implement `ToolProtocol` interface in `tools.ts`
2. Define parameters with JSON schema
3. Implement `execute` method
4. Register in tool registry
5. Reference by ID in agent/executor configurations

### Adding New Edge Groups

1. Define edge group interface in `edges.ts`
2. Create node component in `components/ai-elements/edge-groups/`
3. Update conversion logic in `conversion.ts`
4. Add rendering logic in `page.tsx`
5. Add to node library

## Performance Considerations

### React Flow Optimization

- Nodes and edges use stable IDs (nanoid)
- Node components are memoized with React.memo
- Large workflows may need virtualization (future)

### State Updates

- Batch state updates when possible
- Use functional updates for state derived from previous state
- Avoid unnecessary re-renders with memo and useMemo

### History Management

- Limited to 50 states to prevent memory issues
- Use structuredClone for deep copying
- Only save on significant changes

## Security Considerations

- No direct code execution in the browser (yet)
- Workflow definitions are JSON and should be validated
- Future: Sandbox execution environments
- Future: Rate limiting and resource constraints

## Testing Strategy

### Unit Tests

Located in `lib/workflow/__tests__/`:
- `workflow.test.ts`: Core workflow logic
- `executors.test.ts`: Executor behavior
- `edges.test.ts`: Edge routing logic
- `conversion.test.ts`: React Flow ↔ Workflow conversion
- `edge-groups.test.ts`: Edge group logic

### Integration Tests

- `integration.test.ts`: End-to-end workflow scenarios

### Component Tests

Future: React Testing Library tests for UI components

### Test Coverage

Run `npm test` to execute all tests with Vitest.

## Build and Deployment

### Development Build

```bash
npm run dev
```

- Uses Turbopack for fast refresh
- Hot module replacement enabled
- Development-only warnings and checks

### Production Build

```bash
npm run build
npm start
```

- Optimized bundle with tree-shaking
- Static optimization where possible
- Server-side rendering for initial page load

### Deployment Targets

- Vercel (recommended)
- Docker containers
- Node.js servers
- Static hosting (with limitations)

## Future Architecture Considerations

### Planned Enhancements

1. **Workflow Execution Runtime**
   - Background job execution
   - Streaming execution updates
   - Checkpoint and resume capability

2. **Collaboration Features**
   - Real-time multi-user editing
   - Workflow versioning
   - Conflict resolution

3. **Tool Ecosystem**
   - Plugin system for external tools
   - Tool marketplace
   - Custom tool builder

4. **Advanced AI Integration**
   - Multiple AI provider support
   - Function calling improvements
   - Streaming enhancements

5. **Performance Optimizations**
   - Workflow virtualization for large graphs
   - Lazy loading of node editors
   - Canvas rendering optimizations

## Related Documentation

- [Components](./components.md) - UI component documentation
- [Workflows](./workflows.md) - Workflow system deep dive
- [Development](./development.md) - Development guidelines
- [AGENTS.md](../AGENTS.md) - Agent system documentation

# Components Documentation

## Overview

This document provides comprehensive documentation for all React components in the Agentic Fabric application. Components are organized into three main categories: AI Elements, Workflow Builder, and UI Primitives.

## Component Organization

```
components/
├── ai-elements/          # AI-specific workflow components
│   ├── executors/       # Executor node components
│   └── edge-groups/     # Edge group node components
├── workflow-builder/    # Workflow builder UI
│   └── executor-editors/ # Executor configuration editors
└── ui/                  # Generic UI primitives (Radix UI based)
```

## AI Elements Components

### Canvas (`ai-elements/canvas.tsx`)

Wrapper component for React Flow canvas with custom styling and configuration.

**Props:**
- Extends all React Flow `ReactFlowProps`
- Pre-configured with custom styling classes
- Supports dark/light theme via Tailwind classes

**Usage:**
```tsx
<Canvas
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
>
  {children}
</Canvas>
```

### Node (`ai-elements/node.tsx`)

Generic node wrapper component with connection handles and customizable styling.

**Props:**
- `handles`: Configuration for target/source handles
  - `target`: boolean (show input handle)
  - `source`: boolean (show output handle)
  - `sourceCount`/`targetCount`: Number of handles
- `children`: Node content
- `className`: Additional CSS classes

**Sub-components:**
- `NodeHeader`: Title and description area
- `NodeTitle`: Node title text
- `NodeDescription`: Node description text
- `NodeContent`: Main content area
- `NodeFooter`: Footer area for metadata

**Usage:**
```tsx
<Node handles={{ target: true, source: true }}>
  <NodeHeader>
    <NodeTitle>My Node</NodeTitle>
    <NodeDescription>Node description</NodeDescription>
  </NodeHeader>
  <NodeContent>
    <p>Node content here</p>
  </NodeContent>
  <NodeFooter>
    <p>Footer info</p>
  </NodeFooter>
</Node>
```

### Edge (`ai-elements/edge.tsx`)

Custom edge components with animations and styling.

**Components:**
- `AnimatedEdge`: Animated edge with flowing particles
- `TemporaryEdge`: Dashed edge for temporary connections
- `Edge`: Base edge component

**Props:**
- Standard React Flow edge props
- `onHover`: Callback for hover events (position and screen position)

**Usage:**
```tsx
const edgeTypes = {
  animated: AnimatedEdge,
  temporary: TemporaryEdge,
};
```

### Connection (`ai-elements/connection.tsx`)

Connection line component shown while dragging to create edges.

**Features:**
- Animated connection preview
- Matches theme styling
- Shows valid/invalid connection states

### TextBlockCard (`ai-elements/text-block-card.tsx`)

Specialized 352×352px morphing node for text editing with suggestions.

**Props:**
- `title`: Card title
- `placeholder`: Textarea placeholder
- `showSuggestions`: Show/hide suggestions panel
- `collapsed`: Collapse state (controlled)
- `onToggleCollapse`: Collapse toggle callback
- `isSelected`: Selection state
- `isHovered`: Hover state

**Features:**
- Dual textarea setup (main + bottom input)
- Shimmer placeholder animation
- Spring-based collapse/expand morphing
- Connection handles for workflow integration
- Fixed 352×352px dimensions

**Usage:**
```tsx
<TextBlockCard
  title="Creative Brief"
  placeholder="Enter your text..."
  showSuggestions={true}
  isSelected={isSelected}
/>
```

### AttributeNode (`ai-elements/attribute-node.tsx`)

Specialized 352×352px morphing node for configurable parameters.

**Props:**
- `title`: Node title
- `attributes`: Array of attribute configurations
- `collapsed`: Collapse state
- `onToggleCollapse`: Collapse callback
- `onAttributeChange`: Attribute change callback
- `isSelected`: Selection state

**Attribute Types:**
- `input`: Text input field
- `slider`: Range slider
- `checkbox`: Checkbox toggle
- `select`: Dropdown select
- `progress`: Progress indicator

**Usage:**
```tsx
<AttributeNode
  title="Settings"
  attributes={[
    { id: "temp", type: "slider", label: "Temperature", min: 0, max: 1, value: 0.7 },
    { id: "tone", type: "select", label: "Tone", options: ["Formal", "Casual"], value: "Formal" }
  ]}
  onAttributeChange={(id, value) => console.log(id, value)}
/>
```

### Panel (`ai-elements/panel.tsx`)

Floating panel component for sidebars and overlays.

**Props:**
- `position`: "left" | "right" | "top" | "bottom"
- `children`: Panel content
- `className`: Additional styles

### Toolbar (`ai-elements/toolbar.tsx`)

Node toolbar component that appears on hover/selection.

**Sub-components:**
- `Actions`: Container for action buttons
- `Action`: Individual action button

**Usage:**
```tsx
<Toolbar>
  <Actions>
    <Action tooltip="Edit" label="Edit">
      <Pencil className="size-4" />
    </Action>
    <Action tooltip="Delete" label="Delete">
      <Trash2 className="size-4" />
    </Action>
  </Actions>
</Toolbar>
```

## Executor Node Components

Located in `components/ai-elements/executors/`.

### ExecutorNode

Generic executor node for base executors.

**Props:**
- `id`: Node ID
- `data`: Executor data including:
  - `executor`: BaseExecutor object
  - `label`: Display label
  - `description`: Description
  - `variant`: Executor type variant

### AgentExecutorNode

Specialized node for agent executors.

**Features:**
- Shows agent capabilities
- Displays model information
- Tool configurations
- System prompt preview

### FunctionExecutorNode

Node for function executors.

**Features:**
- Function code preview
- Parameter display
- Return type information

### WorkflowExecutorNode

Node for sub-workflow executors.

**Features:**
- Embedded workflow reference
- Input/output mapping
- Nested workflow indicator

### RequestInfoExecutorNode

Node for request info executors.

**Features:**
- Input field configuration
- Prompt template preview
- Required field indicators

## Edge Group Components

Located in `components/ai-elements/edge-groups/`.

### FanInNode

Merges multiple inputs into single output.

**Props:**
- `data.group`: FanInEdgeGroup configuration
- `data.handles`: Handle configuration with `sourceCount`

**Features:**
- Multiple target handles (one per source)
- Single source handle
- Automatic handle positioning

### FanOutNode

Broadcasts single input to multiple outputs.

**Props:**
- `data.group`: FanOutEdgeGroup configuration
  - `broadcastMode`: "parallel" | "sequential"
- `data.handles`: Handle configuration with `targetCount`

**Features:**
- Single target handle
- Multiple source handles (one per target)
- Mode indicator (parallel/sequential)

### SwitchCaseNode

Routes based on conditional logic.

**Props:**
- `data.group`: SwitchCaseEdgeGroup configuration
  - `switchExpression`: Expression to evaluate
  - `cases`: Array of case conditions
- `data.handles`: Handle configuration with `caseCount`

**Features:**
- Single target handle
- Multiple source handles (one per case + default)
- Case expression editor
- Condition labels

## Workflow Builder Components

Located in `components/workflow-builder/`.

### NodeLibrary (`node-library.tsx`)

Draggable palette of available nodes.

**Props:**
- `onAddNode`: Callback to add node to canvas
- `onDragStart`: Drag start handler
- `onAddMagenticScaffold`: Add full Magentic team

**Features:**
- Categorized node sections
- Drag-to-canvas support
- Magentic scaffold quick-add
- Search/filter (future)

**Node Categories:**
- Executors (Function, Agent, Workflow, Request Info)
- Magentic Agents (Planner, Web, Coder, Critic, etc.)
- Edge Groups (Fan-in, Fan-out, Switch-case)
- Legacy (Workflow step, Text block, Attribute)

### PropertiesPanel (`properties-panel.tsx`)

Right sidebar for configuring selected nodes.

**Props:**
- `selectedNode`: Currently selected node
- `onUpdate`: Update callback
- `onDelete`: Delete callback
- `onDuplicate`: Duplicate callback
- `onEvaluate`: Evaluate callback (future)

**Features:**
- Dynamic editor based on node type
- Executor-specific editors
- Common actions (delete, duplicate)
- Future: Evaluation trigger

### TopNavigation (`top-navigation.tsx`)

Top toolbar with workflow actions.

**Props:**
- `projectName`: Current workflow name
- `projectStatus`: Workflow status badge
- `workflow`: Full workflow object
- Action callbacks:
  - `onEvaluate`, `onCode`, `onPreview`, `onPublish`, `onValidate`

**Features:**
- Project name display
- Status badge
- Action buttons (Evaluate, Code, Preview, Publish)
- Export/import workflow
- Theme toggle

### BottomControls (`bottom-controls.tsx`)

Bottom toolbar with canvas controls.

**Props:**
- `currentTool`: "pointer" | "pan"
- `onToolChange`: Tool change callback
- `onUndo`, `onRedo`: History callbacks
- `canUndo`, `canRedo`: History state

**Features:**
- Tool selector (pointer/pan)
- Undo/redo buttons with state
- Zoom controls
- Fit view button

### ExportDialog (`export-dialog.tsx`)

Dialog for exporting workflows.

**Props:**
- `open`: Dialog open state
- `onOpenChange`: Open state change callback
- `workflow`: Workflow to export

**Features:**
- JSON export with formatting
- Copy to clipboard
- Download as file
- Workflow validation

### ImportDialog (`import-dialog.tsx`)

Dialog for importing workflows.

**Props:**
- `open`: Dialog open state
- `onOpenChange`: Open state change callback
- `onImport`: Import callback with nodes and edges

**Features:**
- File upload
- Paste from clipboard
- JSON validation
- Error handling

### EdgeNodeDropdown (`edge-node-dropdown.tsx`)

Dropdown menu for inserting nodes on edges.

**Props:**
- `edgeId`: Target edge ID
- `position`: Flow position for new node
- `screenPosition`: Screen position for dropdown
- `onSelectNode`: Node selection callback
- `onClose`: Close callback

**Features:**
- Appears on edge hover
- Lists available node types
- Creates node and splits edge

## Executor Editors

Located in `components/workflow-builder/executor-editors/`.

### AgentExecutorEditor

Editor for agent executors.

**Fields:**
- Label, description
- Model selection
- System prompt
- Temperature, max tokens
- Tool selection and configuration
- Capabilities list

### MagenticAgentExecutorEditor

Editor for Magentic agent executors.

**Additional Fields:**
- Preset selection (planner, web, coder, etc.)
- Agent role
- Preset-specific capabilities
- Auto-populated system prompts

### MagenticOrchestratorExecutorEditor

Editor for Magentic orchestrator executors.

**Fields:**
- Planning strategy
- Progress tracking toggle
- Human-in-the-loop toggle
- Internal notes

### FunctionExecutorEditor

Editor for function executors.

**Fields:**
- Function name
- Code editor with syntax highlighting
- Parameter definitions
- Return type

### WorkflowExecutorEditor

Editor for workflow executors.

**Fields:**
- Workflow selection/reference
- Input mapping
- Output mapping

### RequestInfoExecutorEditor

Editor for request info executors.

**Fields:**
- Prompt template
- Input fields configuration
- Validation rules
- Required field toggles

## UI Primitives

Located in `components/ui/`. These are based on Radix UI with custom Tailwind styling.

### Button (`button.tsx`)

Styled button component with variants.

**Variants:**
- `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

**Sizes:**
- `default`, `sm`, `lg`, `icon`

**Usage:**
```tsx
<Button variant="default" size="lg">Click me</Button>
```

### Dialog (`dialog.tsx`)

Modal dialog component.

**Sub-components:**
- `Dialog`: Root component
- `DialogTrigger`: Trigger button
- `DialogContent`: Dialog content area
- `DialogHeader`, `DialogTitle`, `DialogDescription`
- `DialogFooter`: Footer area

### Select (`select.tsx`)

Dropdown select component.

**Sub-components:**
- `Select`: Root
- `SelectTrigger`: Trigger button
- `SelectContent`: Dropdown content
- `SelectItem`: Individual option

### Slider (`slider.tsx`)

Range slider component.

**Props:**
- `min`, `max`, `step`: Range configuration
- `value`: Current value
- `onValueChange`: Change callback

### Additional Primitives

- `Avatar`: User avatar component
- `Collapsible`: Collapsible section
- `DropdownMenu`: Context menu
- `HoverCard`: Hover tooltip card
- `Progress`: Progress bar
- `ScrollArea`: Scrollable area
- `Tooltip`: Simple tooltip

## Styling Patterns

### CVA (Class Variance Authority)

Components use CVA for variant-driven styling:

```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        destructive: "destructive-classes",
      },
      size: {
        default: "default-size",
        sm: "small-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### cn() Utility

Use the `cn()` utility for merging classes:

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", conditional && "conditional-class")} />
```

### Tailwind v4 Patterns

- Use semantic color tokens: `bg-primary`, `text-muted-foreground`
- Use responsive breakpoints: `md:flex`, `lg:grid-cols-3`
- Use state variants: `hover:`, `focus:`, `disabled:`
- Use group/peer selectors: `group-hover:`, `peer-focus:`

## Component Development Guidelines

### Creating New Components

1. Use TypeScript with proper prop types
2. Forward refs when needed for Radix primitives
3. Use CVA for variant styling
4. Follow existing naming conventions
5. Add proper aria-labels for accessibility
6. Use semantic HTML elements
7. Support dark/light themes

### Component Testing

1. Use Vitest + React Testing Library
2. Test user interactions
3. Test accessibility features
4. Test edge cases
5. Mock external dependencies

### Performance

1. Use `React.memo` for expensive components
2. Use `useMemo` and `useCallback` appropriately
3. Avoid inline object/array creation in render
4. Keep component render trees shallow
5. Profile with React DevTools

## Related Documentation

- [Architecture](./architecture.md) - System architecture
- [Workflows](./workflows.md) - Workflow system
- [Development](./development.md) - Development guidelines

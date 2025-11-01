# Development Guide

## Overview

This guide covers development workflows, coding conventions, testing practices, and contribution guidelines for Agentic Fabric.

## Getting Started

### Prerequisites

- **Node.js**: 20+ or latest LTS
- **Package Manager**: npm, yarn, pnpm, or bun
- **Editor**: VS Code recommended (with extensions below)
- **Git**: For version control

### Recommended VS Code Extensions

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Tailwind class completion
- **TypeScript Vue Plugin (Volar)**: TypeScript support
- **GitLens**: Git integration
- **Error Lens**: Inline error display

### Initial Setup

1. Clone and install:
```bash
git clone https://github.com/Qredence/agentic-fabric.git
cd agentic-fabric
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:3000

4. Run tests:
```bash
npm test
```

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch (if used)
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates
- `refactor/*`: Code refactoring

### Making Changes

1. **Create a branch**:
```bash
git checkout -b feature/my-new-feature
```

2. **Make changes**: Follow coding conventions below

3. **Test changes**:
```bash
npm test
npm run lint
```

4. **Commit changes**:
```bash
git add .
git commit -m "feat: add new feature"
```

5. **Push and create PR**:
```bash
git push origin feature/my-new-feature
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**
```
feat(workflow): add fan-in edge group support
fix(canvas): resolve node selection bug
docs(readme): update installation instructions
refactor(executors): simplify agent executor logic
```

## Coding Conventions

### TypeScript

#### Strict Type Checking

Enable all strict checks:
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

#### Type Definitions

Prefer interfaces over types for objects:
```typescript
// Good
interface Workflow {
  id: string;
  name?: string;
}

// Avoid for object shapes
type Workflow = {
  id: string;
  name?: string;
}
```

Use types for unions and primitives:
```typescript
type ExecutorType = "agent" | "function" | "workflow";
type ExecutorId = string;
```

#### Avoid `any`

Use `unknown` when type is truly unknown:
```typescript
// Bad
function process(data: any) { ... }

// Good
function process(data: unknown) {
  if (typeof data === "string") {
    // Type narrowing
  }
}
```

### React Components

#### Component Structure

```typescript
interface MyComponentProps {
  title: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export const MyComponent = ({
  title,
  onAction,
  children,
}: MyComponentProps) => {
  // Hooks first
  const [state, setState] = useState<string>("");
  
  // Event handlers
  const handleClick = useCallback(() => {
    onAction?.();
  }, [onAction]);
  
  // Render
  return (
    <div>
      <h1>{title}</h1>
      {children}
      <button onClick={handleClick}>Action</button>
    </div>
  );
};
```

#### Component Naming

- Use PascalCase: `MyComponent`
- File names match component: `my-component.tsx`
- Use descriptive names: `AgentExecutorNode` not `AEN`

#### Props Best Practices

1. Destructure props
2. Use optional chaining: `onAction?.()`
3. Provide default values in destructuring
4. Document complex props with JSDoc

```typescript
interface Props {
  /**
   * The title displayed in the header
   */
  title: string;
  /**
   * Callback fired when user clicks submit
   * @param data - The form data
   */
  onSubmit?: (data: FormData) => void;
}
```

#### Hook Usage

```typescript
// Group related hooks
const [nodes, setNodes] = useNodesState(initialNodes);
const [edges, setEdges] = useEdgesState(initialEdges);

// Memoize expensive computations
const workflow = useMemo(
  () => reactFlowToWorkflow(nodes, edges, "id", "name"),
  [nodes, edges]
);

// Memoize callbacks
const handleNodeClick = useCallback(
  (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  },
  []
);
```

#### Component Optimization

Use `React.memo` for expensive components:
```typescript
export const ExpensiveComponent = memo(({ data }: Props) => {
  // Component logic
});
```

Custom comparison function:
```typescript
export const Node = memo(
  ({ id, data }: NodeProps) => {
    // Component logic
  },
  (prev, next) => {
    return prev.id === next.id && prev.data === next.data;
  }
);
```

### Styling

#### Tailwind CSS Conventions

1. Use utility classes directly:
```typescript
<div className="flex items-center gap-2 p-4 rounded-lg bg-primary text-primary-foreground">
```

2. Use `cn()` for conditional classes:
```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  isDisabled && "disabled-class"
)} />
```

3. Use CVA for component variants:
```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

4. Semantic color tokens:
```typescript
// Good - semantic
"bg-primary text-muted-foreground border-border"

// Avoid - hardcoded
"bg-blue-500 text-gray-400 border-gray-300"
```

#### Component Styling Patterns

Extract base classes to variables when repeating:
```typescript
const inputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2";

<input className={cn(inputClasses, props.className)} />
```

Group-based styling:
```typescript
<div className="group">
  <div className="group-hover:bg-accent" />
</div>
```

### File Organization

#### Import Order

1. React imports
2. Third-party imports
3. Internal imports (by category)
4. Type imports
5. Relative imports

```typescript
import React, { useState, useCallback } from "react";

import { ReactFlowProvider } from "@xyflow/react";
import { nanoid } from "nanoid";

import { Canvas } from "@/components/ai-elements/canvas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Workflow } from "@/lib/workflow/workflow";
import type { ExecutorType } from "@/lib/workflow/executors";

import { NodeLibrary } from "./node-library";
```

#### File Naming

- Components: `kebab-case.tsx` (e.g., `agent-executor-node.tsx`)
- Utilities: `kebab-case.ts` (e.g., `workflow-utils.ts`)
- Types: `kebab-case.ts` or co-located with implementation
- Tests: `*.test.ts` or `*.test.tsx`

#### Directory Structure

Keep related files together:
```
components/
  workflow-builder/
    executor-editors/
      agent-executor-editor.tsx
      function-executor-editor.tsx
    node-library.tsx
    properties-panel.tsx
```

## Testing

### Testing Stack

- **Vitest**: Test runner (Jest-compatible)
- **React Testing Library**: React component testing
- **jsdom**: DOM environment for tests

### Test File Location

Place tests in `__tests__` directories:
```
lib/
  workflow/
    __tests__/
      workflow.test.ts
      executors.test.ts
    workflow.ts
    executors.ts
```

### Writing Tests

#### Unit Tests

```typescript
import { describe, it, expect } from "vitest";
import { reactFlowToWorkflow } from "../conversion";

describe("reactFlowToWorkflow", () => {
  it("converts nodes to executors", () => {
    const nodes = [
      { id: "1", type: "agent-executor", data: { executor: {...} } }
    ];
    const edges = [];
    
    const workflow = reactFlowToWorkflow(nodes, edges, "test-id");
    
    expect(workflow.executors).toHaveLength(1);
    expect(workflow.executors[0].id).toBe("1");
  });
  
  it("handles empty workflow", () => {
    const workflow = reactFlowToWorkflow([], [], "test-id");
    
    expect(workflow.executors).toHaveLength(0);
    expect(workflow.edges).toHaveLength(0);
  });
});
```

#### Component Tests

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
  
  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it("applies variant classes", () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    expect(container.firstChild).toHaveClass("bg-destructive");
  });
});
```

#### Integration Tests

```typescript
describe("Workflow Integration", () => {
  it("executes simple workflow", async () => {
    const workflow: Workflow = {
      id: "test",
      executors: [
        { id: "1", type: "function", function: { code: "..." } },
        { id: "2", type: "agent", agentId: "test-agent" }
      ],
      edges: [
        { id: "e1", source: "1", target: "2" }
      ]
    };
    
    // Execute workflow
    const result = await executeWorkflow(workflow, { input: "test" });
    
    expect(result.status).toBe("completed");
    expect(result.output).toBeDefined();
  });
});
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in CI mode
npm run test:run

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- workflow.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

Aim for:
- **80%+ overall coverage**
- **90%+ for critical paths** (workflow conversion, execution)
- **100% for utilities**

## Linting and Formatting

### ESLint

Configuration in `eslint.config.mjs`:

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Prettier (if configured)

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

## Performance

### Profiling

Use React DevTools Profiler:
1. Open React DevTools
2. Go to Profiler tab
3. Click record
4. Perform actions
5. Stop recording
6. Analyze flamegraph

### Optimization Checklist

- [ ] Use `React.memo` for expensive components
- [ ] Use `useMemo` for expensive computations
- [ ] Use `useCallback` for stable function references
- [ ] Avoid inline object/array creation in render
- [ ] Use virtualization for long lists
- [ ] Lazy load heavy components
- [ ] Code split with dynamic imports

### Bundle Analysis

```bash
# Build with analysis
npm run build -- --analyze
```

## Debugging

### Debug Configuration (VS Code)

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Debugging Tips

1. **Console logging**:
```typescript
console.log("State:", { nodes, edges });
```

2. **React DevTools**: Inspect component props and state

3. **Network Tab**: Monitor API calls

4. **Breakpoints**: Set in browser DevTools or VS Code

5. **Error Boundaries**: Catch and display React errors

## Common Tasks

### Adding a New Executor Type

1. Define type in `lib/workflow/executors.ts`:
```typescript
export interface MyExecutor extends BaseExecutor {
  type: "my-executor";
  myConfig: string;
}
```

2. Create node component in `components/ai-elements/executors/`:
```typescript
// my-executor-node.tsx
export const MyExecutorNode = ({ id, data }: NodeProps) => {
  return <Node>...</Node>;
};
```

3. Create editor in `components/workflow-builder/executor-editors/`:
```typescript
// my-executor-editor.tsx
export const MyExecutorEditor = ({ executor, onChange }: Props) => {
  return <form>...</form>;
};
```

4. Update conversion logic in `lib/workflow/conversion.ts`:
```typescript
case "my-executor":
  return {
    type: "my-executor",
    myConfig: "default"
  };
```

5. Register in `app/page.tsx`:
```typescript
const nodeTypes = {
  // ...
  "my-executor": MyExecutorNode,
};
```

6. Add to node library in `components/workflow-builder/node-library.tsx`

7. Add tests in `lib/workflow/__tests__/`

### Adding a New UI Component

1. Create component file in `components/ui/`:
```typescript
// my-component.tsx
import { cn } from "@/lib/utils";

interface MyComponentProps {
  className?: string;
}

export const MyComponent = ({ className }: MyComponentProps) => {
  return (
    <div className={cn("base-classes", className)}>
      ...
    </div>
  );
};
```

2. Add to exports if needed

3. Write tests

4. Document in `docs/components.md`

### Updating Documentation

1. Edit relevant `.md` files in `docs/`
2. Update README.md if needed
3. Ensure examples are accurate
4. Check links and references
5. Run through a spell checker

## Troubleshooting

### Common Issues

**Issue**: TypeScript errors after dependency update
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Build fails with module not found
```bash
# Solution: Check import paths use @ alias
import { X } from "@/lib/utils";  # Good
import { X } from "../../../lib/utils";  # Avoid
```

**Issue**: Tests fail after React update
```bash
# Solution: Update testing library
npm update @testing-library/react @testing-library/user-event
```

## Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Flow Documentation](https://reactflow.dev)
- [Radix UI Documentation](https://radix-ui.com)
- [Vitest Documentation](https://vitest.dev)

### Related Docs

- [Architecture](./architecture.md) - System architecture
- [Components](./components.md) - Component documentation
- [Workflows](./workflows.md) - Workflow system
- [AGENTS.md](../AGENTS.md) - Agent documentation

## Contributing

### Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add tests for new features
4. Follow code conventions
5. Write clear commit messages
6. Create descriptive PR title and description
7. Request review from maintainers

### Code Review Guidelines

As a reviewer:
- Check for test coverage
- Verify documentation updates
- Ensure code follows conventions
- Look for potential bugs
- Suggest improvements
- Be constructive and respectful

As an author:
- Respond to all comments
- Make requested changes
- Ask questions if unclear
- Thank reviewers

## Support

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community support
- **Documentation**: Check `docs/` directory

---

Happy coding! 🚀

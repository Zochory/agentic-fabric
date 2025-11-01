# Documentation Index

Welcome to the Agentic Fabric documentation! This index will help you find the information you need.

## Getting Started

New to Agentic Fabric? Start here:

1. **[README.md](../README.md)** - Project overview, features, and quick start guide
2. **[Installation and Setup](../README.md#installation)** - Get up and running
3. **[Quick Start Guide](../README.md#quick-start-guide)** - Your first workflow

## Core Documentation

### Architecture and Design

- **[Architecture](./architecture.md)** - System architecture, design patterns, and extension points
  - High-level architecture overview
  - Core modules (workflow engine, UI layer, app layer)
  - Data flow and state management
  - Type system
  - Performance and security considerations

### Component Reference

- **[Components](./components.md)** - Comprehensive component documentation
  - AI Elements (Canvas, Node, Edge, TextBlockCard, AttributeNode)
  - Executor Nodes (Agent, Function, Workflow, etc.)
  - Edge Group Components (Fan-in, Fan-out, Switch-case)
  - Workflow Builder (NodeLibrary, PropertiesPanel, etc.)
  - UI Primitives (Button, Dialog, Select, etc.)
  - Styling patterns with CVA and Tailwind

### Workflow System

- **[Workflows](./workflows.md)** - Deep dive into the workflow system
  - Workflow fundamentals and structure
  - Executor types and configuration
  - Edge and edge group logic
  - Workflow state and execution model
  - Conversion between UI and runtime representations
  - Workflow patterns and best practices

### Agent System

- **[AGENTS.md](../AGENTS.md)** - Agent architecture and Magentic framework
  - Agent protocol and base classes
  - Magentic agent presets (Planner, Web, Coder, Critic)
  - Magentic orchestrator for multi-agent coordination
  - Workflow builder integration
  - Extending and customizing agents

## Development

- **[Development Guide](./development.md)** - Guidelines for contributing and developing
  - Development workflow and setup
  - Coding conventions (TypeScript, React, styling)
  - Testing practices (unit, component, integration)
  - Linting and formatting
  - Performance optimization
  - Common development tasks
  - Troubleshooting

## Quick Reference

### Key Concepts

- **Workflow**: A directed graph of executors connected by edges
- **Executor**: A processing unit that performs work (function, agent, sub-workflow, etc.)
- **Edge**: A connection that defines data flow between executors
- **Edge Group**: Advanced routing logic (fan-in, fan-out, switch-case)
- **Agent**: An AI-powered executor that can use tools and maintain conversation context
- **Magentic**: Multi-agent framework with specialized agent roles

### Common Tasks

- [Adding a new executor type](./development.md#adding-a-new-executor-type)
- [Adding a new UI component](./development.md#adding-a-new-ui-component)
- [Adding a new agent preset](./architecture.md#adding-new-agent-presets)
- [Creating workflow templates](./workflows.md#workflow-patterns)
- [Testing your changes](./development.md#testing)

### File Locations

- **Core Workflow Engine**: `lib/workflow/`
- **React Components**: `components/`
- **Main Application**: `app/`
- **Tests**: `lib/workflow/__tests__/`
- **Documentation**: `docs/`

## API Reference

### Type Definitions

Key interfaces and types are defined in:
- `lib/workflow/workflow.ts` - Workflow, WorkflowState, WorkflowMetadata
- `lib/workflow/executors.ts` - BaseExecutor and executor types
- `lib/workflow/agent.ts` - AgentProtocol, BaseAgent
- `lib/workflow/edges.ts` - BaseEdge, EdgeGroup types
- `lib/workflow/tools.ts` - ToolProtocol, AIFunction
- `lib/workflow/types.ts` - Common shared types

### Conversion Functions

- `reactFlowToWorkflow()` - Convert UI state to executable workflow
- `workflowToReactFlow()` - Convert workflow to UI state
- `createExecutorFromNodeType()` - Create executor from node type
- `createNodeDataFromExecutorType()` - Create node data from executor

## Testing

- **Test Files**: Located in `lib/workflow/__tests__/`
- **Running Tests**: `npm test` (interactive), `npm run test:run` (CI)
- **Test Coverage**: Aim for 80%+ overall, 90%+ for critical paths

## Contributing

We welcome contributions! Please see:

1. [Contributing Guidelines](../README.md#contributing) in README.md
2. [Development Guide](./development.md) for coding conventions
3. [Architecture Guide](./architecture.md) for system design

### Pull Request Checklist

- [ ] Tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] Code follows style guidelines

## Support and Community

- **GitHub Issues**: [Report bugs and request features](https://github.com/Qredence/agentic-fabric/issues)
- **GitHub Discussions**: [Ask questions and discuss](https://github.com/Qredence/agentic-fabric/discussions)
- **Documentation**: You're reading it!

## Changelog

See [GitHub Releases](https://github.com/Qredence/agentic-fabric/releases) for version history and changes.

## License

See [LICENSE](../LICENSE) file for license information.

---

**Need help?** If you can't find what you're looking for, please [open an issue](https://github.com/Qredence/agentic-fabric/issues) or start a [discussion](https://github.com/Qredence/agentic-fabric/discussions).

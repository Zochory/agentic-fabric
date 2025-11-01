# Agentic Fabric

A visual workflow builder for orchestrating AI agents and creating complex multi-agent systems. Build sophisticated AI workflows with a drag-and-drop interface, powered by React Flow and Next.js 16.

## Overview

Agentic Fabric is a modern web application that enables you to design, configure, and execute AI-powered workflows visually. It provides an intuitive canvas interface for connecting AI agents, tools, and logic nodes to create complex agentic systems without writing code.

### Key Features

- **🎨 Visual Workflow Builder** - Drag-and-drop canvas powered by React Flow for intuitive workflow design
- **🤖 Multi-Agent Support** - Built-in support for specialized AI agents with the Magentic framework
- **🔧 Flexible Executors** - Multiple executor types including functions, agents, workflows, and request handlers
- **🌊 Advanced Control Flow** - Fan-in, fan-out, and switch-case edge groups for complex routing logic
- **📦 Import/Export** - Save and share workflows as portable JSON definitions
- **🎯 Pre-built Agent Presets** - Ready-to-use agent configurations for common tasks (planner, coder, web surfer, critic)
- **⚡ Real-time Collaboration** - Live workflow editing with undo/redo support
- **🎭 Dual Theme Support** - Beautiful dark and light modes
- **🔍 Properties Panel** - Configure executors, agents, and nodes with rich editing interfaces

## Technology Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Radix UI primitives
- **Workflow Engine**: React Flow (xyflow)
- **State Management**: React hooks with local state
- **Animation**: Motion (Framer Motion successor)
- **Testing**: Vitest + Testing Library
- **AI Integration**: Vercel AI SDK

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Qredence/agentic-fabric.git
cd agentic-fabric
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the workflow builder.

### Building for Production

```bash
npm run build
npm start
```

## Quick Start Guide

1. **Create a Workflow**: Open the application and you'll see a canvas with example workflow nodes
2. **Add Nodes**: Drag nodes from the left sidebar onto the canvas
3. **Connect Nodes**: Click and drag from one node's handle to another to create connections
4. **Configure Executors**: Select a node and use the right properties panel to configure its behavior
5. **Use Magentic Scaffold**: Click the "Add Magentic Scaffold" button to quickly create a multi-agent team
6. **Export/Import**: Save your workflow to JSON or import existing workflow definitions

## Project Structure

```
agentic-fabric/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main workflow canvas page
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ai-elements/       # AI-specific UI components
│   │   ├── canvas.tsx     # React Flow canvas wrapper
│   │   ├── node.tsx       # Generic node component
│   │   ├── edge.tsx       # Edge components
│   │   ├── text-block-card.tsx  # Text editor node
│   │   ├── attribute-node.tsx   # Parameter control node
│   │   └── executors/     # Executor-specific node components
│   ├── workflow-builder/  # Workflow builder UI
│   │   ├── node-library.tsx      # Draggable node palette
│   │   ├── properties-panel.tsx  # Node configuration panel
│   │   ├── executor-editors/     # Executor configuration editors
│   │   └── top-navigation.tsx    # Top toolbar
│   └── ui/                # Shared UI primitives
├── lib/                   # Core library code
│   ├── workflow/          # Workflow engine
│   │   ├── workflow.ts    # Workflow type definitions
│   │   ├── executors.ts   # Executor implementations
│   │   ├── agent.ts       # Agent protocol and base classes
│   │   ├── edges.ts       # Edge and edge group logic
│   │   ├── tools.ts       # Tool protocol and definitions
│   │   ├── conversion.ts  # React Flow ↔ Workflow conversion
│   │   ├── magentic-presets.ts  # Pre-built agent configurations
│   │   └── export/        # Workflow export/import utilities
│   └── utils.ts           # Utility functions
├── docs/                  # Documentation (see below)
├── test/                  # Test setup
└── public/                # Static assets
```

## Core Concepts

### Executors

Executors are the building blocks of workflows. Types include:

- **Function Executor**: Execute JavaScript/TypeScript functions
- **Agent Executor**: Run AI agents with custom prompts and tools
- **Workflow Executor**: Embed sub-workflows as nodes
- **Request Info Executor**: Gather user input during workflow execution
- **Magentic Agent Executor**: Specialized agents from the Magentic framework
- **Magentic Orchestrator**: Coordinates multiple Magentic agents

### Agents

AI agents follow the `AgentProtocol` interface and can:
- Process messages and maintain conversation context
- Use tools and function calling
- Stream responses in real-time
- Access shared workflow state

See [AGENTS.md](./AGENTS.md) for detailed agent documentation.

### Workflows

Workflows are directed graphs where:
- Nodes represent executors (processing units)
- Edges represent data flow between executors
- Edge groups enable complex routing (fan-in, fan-out, switch-case)
- Shared state allows executors to communicate

### Edge Groups

Advanced control flow constructs:
- **Fan-in**: Merge multiple inputs into one output
- **Fan-out**: Broadcast one input to multiple outputs (parallel or sequential)
- **Switch-case**: Route based on conditional logic

## Testing

Run the test suite:

```bash
npm test          # Interactive mode
npm run test:run  # CI mode
npm run test:ui   # UI mode with Vitest UI
```

Tests cover:
- Workflow conversion and serialization
- Executor behavior and lifecycle
- Edge group logic
- Integration scenarios

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Architecture](./docs/architecture.md) - System design and architecture overview
- [Components](./docs/components.md) - UI component documentation
- [Workflows](./docs/workflows.md) - Workflow system deep dive
- [Development](./docs/development.md) - Development guidelines and conventions

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding conventions
4. Add tests for new functionality
5. Run tests and linting (`npm test && npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Use TypeScript with strict type checking
- Write tests for new features
- Update documentation for significant changes
- Keep components focused and composable
- Follow the custom instructions in `.github/copilot-instructions.md`

## License

This project is open source. Please check the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [React Flow](https://reactflow.dev)
- UI components from [Radix UI](https://radix-ui.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- AI capabilities via [Vercel AI SDK](https://sdk.vercel.ai)

## Support

- 📫 Report issues on [GitHub Issues](https://github.com/Qredence/agentic-fabric/issues)
- 💬 Join discussions on [GitHub Discussions](https://github.com/Qredence/agentic-fabric/discussions)
- 📖 Read the [documentation](./docs/)

---

Built with ❤️ by the Agentic Fabric team

# 🔥 MonorepoOnFire

![portfolio](doc/portfolio.gif)

> A modern, type-safe Turbo monorepo featuring Hono backend, React frontend, and comprehensive tooling

<div align="center">

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![Hono](https://img.shields.io/badge/Hono-4.7.9-orange.svg)](https://hono.dev/)
[![CI](https://github.com/IsaiaScope/monorepoonfire/workflows/CI/badge.svg)](https://github.com/IsaiaScope/monorepoonfire/actions)

</div>

## 🎯 Overview

MonorepoOnFire is a cutting-edge monorepo template that combines the best of modern web development. Built with performance, developer experience, and type safety in mind, it provides a solid foundation for building scalable full-stack applications.

### 🚀 Key Features

- **⚡ Lightning Fast**: Powered by Vite, Hono, and Turborepo
- **🏷️ Type Safe**: Full TypeScript coverage across the entire stack
- **🎨 Beautiful UI**: shadcn/ui components with Tailwind CSS
- **🌍 Internationalized**: i18next integration with automated translation management
- **🧪 Well Tested**: Comprehensive testing with Vitest
- **📱 Responsive**: Mobile-first design with dark mode support
- **🔒 Secure**: Built-in security best practices and validation
- **🚀 CI/CD Ready**: GitHub Actions for automated testing and deployment

## 📁 Project Structure

```
monorepoonfire/
├── 📱 app/
│   ├── 🔥 hono/              # Backend API (Hono + Drizzle)
│   └── 🎨 portfolio/         # Frontend App (React + Vite)
├── 📦 package/
│   ├── ⚙️ config/            # Shared configurations
│   ├── 🎭 shadcn/            # UI component library
│   ├── 🎨 ui/                # Custom UI components
│   └── 🛠️ utility/           # Shared utilities
├── 📄 doc/                   # Comprehensive documentation
├── 📜 script/                # Build and deployment scripts
└── ⚙️ Configuration files
```

## 🛠️ Tech Stack

### 🔥 Backend (Hono App)

- **Framework**: Hono.js
- **Database**: SQLite with Drizzle ORM
- **Runtime**: Node.js with TypeScript
- **Testing**: Vitest for unit and integration tests
- **Validation**: Zod for schema validation

### 🎨 Frontend (Portfolio App)

- **Framework**: React
- **Build Tool**: Vite for lightning-fast development
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Tanstack Query for server state
- **Routing**: Tanstack Router
- **Forms**: React Hook Form
- **Internationalization**: i18next with automated translations
- **Testing**: Vitest with React Testing Library

### ⚙️ Shared Infrastructure

- **Monorepo**: Turborepo for optimized builds and caching
- **Package Manager**: pnpm for efficient dependency management
- **Type Safety**: TypeScript
- **Linting**: ESLint
- **Git Hooks**: Husky with lint-staged for quality gates
- **CI/CD**: GitHub Actions for automated workflows

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9.1.1

### Installation

```bash
# Clone the repository
git clone https://github.com/IsaiaScope/monorepoonfire.git
cd monorepoonfire

# Install dependencies
pnpm install
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Or start specific applications
pnpm --filter @app/hono dev      # Backend only
pnpm --filter @app/portfolio dev # Frontend only
```

### Building

```bash
# Build all applications
pnpm build

# Build for specific environment
pnpm build:test
pnpm build:production
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## 📚 Documentation

Comprehensive documentation is available in the [`doc/`](./doc/) directory:

- **📁 [Project Structure](./doc/project-structure.md)** - Monorepo architecture and organization
- **🔥 [Hono Backend](./doc/hono-backend.md)** - API development and database integration
- **🎨 [Portfolio Frontend](./doc/portfolio-frontend.md)** - React application development
- **🧪 [Testing with Vitest](./doc/vitest-testing.md)** - Testing strategies and setup
- **🌍 [Internationalization](./doc/i18n-internationalization.md)** - i18n implementation and workflow
- **🔄 [Tanstack Query](./doc/tanstack-query.md)** - Server state management
- **🎭 [shadcn/ui](./doc/shadcn-ui.md)** - Component library usage
- **🚀 [CI/CD](./doc/ci-cd.md)** - Deployment and automation
- **🔍 [Linting & Type Safety](./doc/linting-type-safety.md)** - Code quality and validation
- **🎨 [Tailwind CSS](./doc/tailwind-css.md)** - Styling and design system
- **📦 [Packages Overview](./doc/packages-overview.md)** - Shared packages documentation

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/IsaiaScope/monorepoonfire/issues)
- 📖 Docs: [Documentation](./doc/)

## 🤝 Contributing

 Made with ❤️ by <a href="https://github.com/IsaiaScope">IsaiaScope</a>

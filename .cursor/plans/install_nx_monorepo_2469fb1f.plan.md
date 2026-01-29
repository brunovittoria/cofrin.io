---
name: Install Nx Monorepo
overview: Install Nx into the existing Cofrinio project, restructure it as a monorepo with apps/ and libs/ folders, and configure it for the current React frontend with preparation for a future NestJS backend.
todos:
  - id: init-nx
    content: Run `npx nx@latest init` to initialize Nx in the project
    status: completed
  - id: install-plugins
    content: Install @nx/vite and @nx/react plugins
    status: completed
  - id: create-apps-structure
    content: Create apps/ directory and move frontend to apps/web/
    status: completed
  - id: update-configs
    content: Update vite.config.ts, tsconfig files, and path aliases for new structure
    status: completed
  - id: create-nx-configs
    content: Create nx.json, project.json, tsconfig.base.json, pnpm-workspace.yaml
    status: completed
  - id: update-package-json
    content: Update root package.json with Nx scripts including dev:all to run both apps
    status: completed
  - id: update-gitignore
    content: Add Nx-specific entries to .gitignore
    status: cancelled
  - id: verify-setup
    content: Run nx serve web and nx graph to verify the setup works
    status: completed
---

# Install Nx Monorepo for Cofrinio

## Current State

- **Package Manager**: pnpm
- **Frontend**: Vite + React 18 + TypeScript + TanStack Router + Shadcn UI
- **Auth**: Clerk
- **Backend Services**: Supabase (client-side SDK)
- **Project Name**: `vite_react_shadcn_ts`

## Target Monorepo Structure

```
cofrinio/
├── apps/
│   ├── web/                    # Current React frontend (renamed)
│   │   ├── src/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── project.json        # Nx project configuration
│   └── api/                    # Future NestJS backend (placeholder)
├── libs/                       # Shared libraries (future)
│   └── shared/                 # Shared types, utils between web/api
├── nx.json                     # Nx workspace configuration
├── package.json                # Root package.json
├── tsconfig.base.json          # Base TypeScript config
└── pnpm-workspace.yaml         # pnpm workspaces config
```

## Implementation Steps

### Step 1: Initialize Nx in the Project

Run the Nx initialization command which will:

- Add Nx as a dev dependency
- Create `nx.json` configuration
- Detect and configure the existing Vite project
```bash
npx nx@latest init
```


This will prompt for options - select:

- Enable Nx caching for faster builds
- Add the `@nx/vite` plugin for Vite integration

### Step 2: Install Required Nx Plugins

Install plugins for React/Vite (current) and prepare for NestJS (future):

```bash
pnpm add -D @nx/vite @nx/react @nx/js
```

For future NestJS backend, you'll add:

```bash
pnpm add -D @nx/nest @nx/node
```

### Step 3: Restructure to Monorepo Layout

Move the current frontend into `apps/web/`:

**Files to move to `apps/web/`:**

- `src/` directory
- `public/` directory  
- `index.html`
- `vite.config.ts`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `components.json` (Shadcn config)
- `tailwind.config.ts`
- `postcss.config.js`

**Files to keep at root:**

- `package.json` (will be modified)
- `tsconfig.json` (will become `tsconfig.base.json`)
- `eslint.config.js` (root ESLint config)
- `.gitignore` (update for Nx)
- `supabase/` directory

### Step 4: Create Nx Project Configuration

Create `apps/web/project.json`:

```json
{
  "name": "web",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "apps/web/src",
  "tags": ["scope:web", "type:app"],
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/web"
      }
    },
    "serve": {
      "executor": "@nx/vite:dev-server",
      "options": {
        "buildTarget": "web:build"
      }
    },
    "preview": {
      "executor": "@nx/vite:preview-server",
      "options": {
        "buildTarget": "web:build"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint"
    }
  }
}
```

### Step 5: Update Configuration Files

**Update `vite.config.ts`** (in `apps/web/`):

- Update path aliases to work from new location
- Point to correct source directories

**Create `tsconfig.base.json`** at root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@cofrinio/shared": ["libs/shared/src/index.ts"]
    },
    "skipLibCheck": true,
    "allowJs": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": false,
    "noImplicitAny": false,
    "strictNullChecks": false
  }
}
```

**Update `apps/web/tsconfig.json`**:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
```

### Step 6: Update Root package.json

Update scripts to use Nx commands, including a script to run both frontend and backend simultaneously:

```json
{
  "name": "cofrinio",
  "scripts": {
    "dev": "nx serve web",
    "dev:api": "nx serve api",
    "dev:all": "nx run-many -t serve -p web api --parallel",
    "build": "nx build web",
    "build:api": "nx build api",
    "build:all": "nx run-many -t build -p web api",
    "lint": "nx run-many -t lint",
    "test": "nx run-many -t test",
    "graph": "nx graph"
  }
}
```

**Script explanations:**

- `dev:all` - Runs both `web` and `api` dev servers in parallel using `nx run-many`
- `build:all` - Builds both projects (respects dependency order)
- The `--parallel` flag ensures both servers start simultaneously

### Step 7: Create pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "libs/*"
```

### Step 8: Update .gitignore for Nx

Add Nx-specific ignores:

```
# Nx
.nx
dist
tmp
```

### Step 9: Create nx.json Configuration

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "main",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": ["default", "!{projectRoot}/**/*.spec.ts"],
    "sharedGlobals": []
  },
  "plugins": [
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "previewTargetName": "preview",
        "serveTargetName": "serve"
      }
    }
  ],
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"]
    },
    "lint": {
      "cache": true
    }
  }
}
```

## Post-Installation Commands

After setup, verify everything works:

```bash
# Start development server
nx serve web

# Build for production  
nx build web

# View project graph
nx graph

# Run affected commands (useful in CI)
nx affected -t build
nx affected -t lint
```

## Future: Adding NestJS Backend

When ready to add the backend, run:

```bash
pnpm add -D @nx/nest @nx/node
nx g @nx/nest:application api
```

This will create `apps/api/` with a full NestJS setup including:

- NestJS application structure
- Jest testing configuration
- TypeScript configuration
- Prisma can be added separately

Once the API is created, the `dev:all` script will automatically run both:

```bash
pnpm dev:all  # Starts web on :8080 and api on :3000 simultaneously
```

You can also run them individually:

```bash
pnpm dev      # Frontend only (port 8080)
pnpm dev:api  # Backend only (port 3000)
```

## Key Benefits

- **Task Caching**: Nx caches build/test results for faster iterations
- **Affected Commands**: Only rebuild/test what changed
- **Dependency Graph**: Visual representation of project dependencies
- **Code Sharing**: Easy sharing between web and api via `libs/`
- **Consistent Tooling**: Same commands for all projects
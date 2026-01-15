# TanStack Router Migration Documentation

## Why TanStack Router Over React Router DOM

### 1. 100% Type-Safe Routing

TanStack Router provides **full TypeScript inference** out of the box. Unlike React Router DOM where routes are essentially strings with no compile-time verification, TanStack Router knows all your routes and their configurations at build time.

```typescript
// React Router DOM - No type safety, typos won't be caught until runtime
navigate("/transactoins"); // ❌ Typo won't be caught

// TanStack Router - Full type safety, autocomplete, and compile-time errors
navigate({ to: "/transactions" }); // ✅ TypeScript knows all valid routes
```

When you type navigate({ to: " your IDE will show autocomplete with all valid routes:

````
/
/login
/register
/cards
````

### 2. Type-Safe Search Parameters

React Router treats search params as an afterthought - just a `URLSearchParams` object with string values. TanStack Router makes search params **first-class citizens** with full type safety and validation.

```typescript
// React Router DOM - Manual parsing, no type safety
const [searchParams] = useSearchParams();
const categoria = searchParams.get("categoria"); // Always string | null

// TanStack Router - Validated, typed search params
const { categoria } = routeApi.useSearch(); // Typed as string | undefined
```

### 3. Type-Safe Route Parameters

```typescript
// React Router DOM - useParams returns Record<string, string | undefined>
const { id } = useParams(); // id: string | undefined

// TanStack Router - Params are typed based on route definition
const { id } = routeApi.useParams(); // id: string (guaranteed by route)
```

### 4. File-Based Routing with Full Control

TanStack Router's file-based routing generates a type-safe route tree while keeping you in control. The generated `routeTree.gen.ts` provides full type information for all routes. (Seems like Next.js)

### 5. Built-in Route Context

Pass data through routes with full type safety:

```typescript
// Router context for authentication state
const router = createRouter({
  routeTree,
  context: { isSignedIn: false },
});

// Access in beforeLoad hooks
beforeLoad: async ({ context }) => {
  if (!context.isSignedIn) {
    throw redirect({ to: "/login" });
  }
}
```

### 6. Better Developer Experience

- **Autocomplete**: IDE suggests valid route paths
- **Refactoring**: Rename a route and TypeScript shows all places to update
- **Devtools**: TanStack Router Devtools for debugging routes

---

## Migration Summary

### What Changed

#### 1. Dependencies

**Added:**
- `@tanstack/react-router` (already installed)
- `@tanstack/react-router-devtools` (already installed)
- `@tanstack/router-plugin` (Vite plugin for file-based routing)

**Removed:**
- `react-router-dom`

#### 2. Configuration Files

**`vite.config.ts`** - Added TanStack Router Vite plugin:

```typescript
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // Generates route tree automatically
    react(),
  ],
});
```

**`src/router.tsx`** - New router configuration:

```typescript
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  context: { isSignedIn: false },
  defaultPreload: "intent",
});
```

#### 3. Entry Point (`src/main.tsx`)

```typescript
import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";
import { router } from "./router";

function InnerApp() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <RouterProvider
      router={router}
      context={{ isSignedIn: isSignedIn ?? false }}
    />
  );
}
```

#### 4. Route Structure

New file-based routes in `src/routes/`:

```
src/routes/
├── __root.tsx                    # Root layout (providers, toasters)
├── index.tsx                     # Landing page (/)
├── login.tsx                     # Login page (/login)
├── register.tsx                  # Register page (/register)
├── _authenticated.tsx            # Auth layout (sidebar, header)
└── _authenticated/
    ├── dashboard.tsx             # Dashboard (/dashboard)
    ├── transactions.tsx          # Transactions (/transactions)
    ├── categories.tsx            # Categories (/categories)
    ├── future-launches.tsx       # Future launches (/future-launches)
    ├── cards.tsx                 # Cards (/cards)
    ├── expenses.tsx              # Expenses (/expenses)
    ├── incomes.tsx               # Incomes (/incomes)
    └── goals/
        ├── index.tsx             # Goals list (/goals)
        ├── create.tsx            # Create goal (/goals/create)
        └── $id.tsx               # Goal detail (/goals/:id)
```

**Key conventions:**
- `__root.tsx` - Root route that wraps all routes
- `_authenticated.tsx` - Layout route (underscore prefix = pathless layout)
- `$id.tsx` - Dynamic route parameter (dollar sign prefix)
- `index.tsx` - Index route for a directory

#### 5. Files Deleted

- `src/App.tsx` - Routing logic moved to route files
- `src/providers/RouterProvider.tsx` - No longer needed

---

## API Changes Reference

### Navigation

```typescript
// Before (React Router DOM)
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate("/goals");
navigate(`/goals/${id}`);

// After (TanStack Router)
import { useNavigate } from "@tanstack/react-router";
const navigate = useNavigate();
navigate({ to: "/goals" });
navigate({ to: "/goals/$id", params: { id } });
```

### Links

```typescript
// Before (React Router DOM)
import { Link, NavLink } from "react-router-dom";
<Link to="/dashboard">Dashboard</Link>
<NavLink to="/goals" end>Goals</NavLink>

// After (TanStack Router)
import { Link } from "@tanstack/react-router";
<Link to="/dashboard">Dashboard</Link>
<Link to="/goals">Goals</Link>
```

### Route Parameters

```typescript
// Before (React Router DOM)
import { useParams } from "react-router-dom";
const { id } = useParams<{ id: string }>();

// After (TanStack Router)
import { getRouteApi } from "@tanstack/react-router";
const routeApi = getRouteApi("/_authenticated/goals/$id");
const { id } = routeApi.useParams();
```

### Search Parameters

```typescript
// Before (React Router DOM)
import { useSearchParams } from "react-router-dom";
const [searchParams] = useSearchParams();
const categoria = searchParams.get("categoria");

// After (TanStack Router)
// 1. Define search params in route file:
export const Route = createFileRoute("/_authenticated/transactions")({
  validateSearch: (search): { categoria?: string } => ({
    categoria: search.categoria as string | undefined,
  }),
  component: Transactions,
});

// 2. Use in component:
import { getRouteApi } from "@tanstack/react-router";
const routeApi = getRouteApi("/_authenticated/transactions");
const { categoria } = routeApi.useSearch();
```

### Location

```typescript
// Before (React Router DOM)
import { useLocation } from "react-router-dom";
const location = useLocation();
console.log(location.pathname);

// After (TanStack Router)
import { useLocation } from "@tanstack/react-router";
const location = useLocation();
console.log(location.pathname);
```

### Navigation with Search Params

```typescript
// Before (React Router DOM)
navigate(`/transactions?categoria=${encodeURIComponent(name)}`);

// After (TanStack Router)
navigate({
  to: "/transactions",
  search: { categoria: name },
});
```

---

## Route Protection Pattern

### Authentication Guard

Layout routes can protect all child routes:

```typescript
// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { isSignedIn } = context;
    if (!isSignedIn) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});
```

### Redirect Signed-In Users

Public routes can redirect authenticated users:

```typescript
// src/routes/login.tsx
export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    const { isSignedIn } = context;
    if (isSignedIn) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
```

---

## URL Structure Changes

| Page | Before | After |
|------|--------|-------|
| Landing | `/` (when signed out) | `/` |
| Dashboard | `/` (when signed in) | `/dashboard` |
| Transactions | `/transactions` | `/transactions` |
| Categories | `/categories` | `/categories` |
| Future Launches | `/future-launches` | `/future-launches` |
| Goals | `/goals` | `/goals` |
| Create Goal | `/goals/create` | `/goals/create` |
| Goal Detail | `/goals/:id` | `/goals/:id` |
| Cards | `/cards` | `/cards` |
| Login | `/login` | `/login` |
| Register | `/register` | `/register` |

**Note:** The dashboard was moved from `/` to `/dashboard` to avoid route conflicts between public and authenticated users.

---

## Generated Files

The TanStack Router Vite plugin automatically generates:

- `src/routeTree.gen.ts` - Route tree with full type information

**Do not edit this file manually.** It's regenerated on each build/dev server start.

---

## Best Practices

### 1. Use `getRouteApi` for Route-Specific Hooks

```typescript
// ✅ Correct - Use getRouteApi in page components
const routeApi = getRouteApi("/_authenticated/goals/$id");
const { id } = routeApi.useParams();

// ❌ Avoid - Don't import Route directly in page components
import { Route } from "@/routes/_authenticated/goals/$id";
const { id } = Route.useParams(); // Can cause circular dependencies
```

### 2. Define Search Params in Route Files

```typescript
// src/routes/_authenticated/transactions.tsx
export const Route = createFileRoute("/_authenticated/transactions")({
  validateSearch: (search): TransactionsSearch => ({
    categoria: search.categoria as string | undefined,
  }),
  component: Transactions,
});
```

### 3. Use Type-Safe Navigation

```typescript
// With params
navigate({ to: "/goals/$id", params: { id: goalId } });

// With search params
navigate({ to: "/transactions", search: { categoria: "Food" } });

// With both
navigate({
  to: "/goals/$id",
  params: { id: goalId },
  search: { tab: "history" },
});
```

---

## Resources

- [TanStack Router Documentation](https://tanstack.com/router/latest/docs/framework/react/overview)
- [File-Based Routing Guide](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
- [Search Params Guide](https://tanstack.com/router/latest/docs/framework/react/guide/search-params)
- [Type Safety Guide](https://tanstack.com/router/latest/docs/framework/react/guide/type-safety)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Type-check (vue-tsc) then build production bundle
npm run preview  # Preview the production build locally
```

No test runner or linter is configured.

## Architecture

**Stack:** Vue 3 (Composition API, `<script setup>`), TypeScript (strict), Vite, Vue Router 4, Tailwind CSS v4, Reka UI components, Lucide icons.

**State management:** No Pinia/Vuex. Shared state lives in composables using module-level reactive refs (`useAuth`, `useTheme`). These act as singletons — all component imports share the same reactive state.

**Data flow:** Component → Composable → Service → Backend API

### Key directories

- `src/services/` — API layer. Each file exports a factory function returning method objects (not classes). Uses `fetch` with `credentials: "include"` for cookie-based session auth.
- `src/composables/` — `useAuth.ts` manages session state; `useTheme.ts` manages light/dark/system theme with localStorage persistence.
- `src/lib/api.ts` — Centralizes `API_ENDPOINTS` constants and the base request helper. Base URL comes from `VITE_API_BASE_URL` (default: `http://localhost:8080/api/v1`).
- `src/router/` — Route guards check `useAuth().isAuthenticated` before allowing access to routes with `meta: { requiresAuth: true }`.
- `src/components/ui/register-modal/` — Multi-step registration is a single component with internal view switching, not separate routes.

### Authentication

On app mount, `useAuth().initializeAuth()` calls `GET /auth/status`. If the session is valid, `isAuthenticated` is set to `true`. The router guard redirects unauthenticated users away from protected routes. No JWT tokens — auth is entirely cookie/session based.

### Environment variables

Copy `.env.example` to `.env.local` (not committed). Key vars:

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ENABLE_LOGGING=true
```

### Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin. Custom Oklch color tokens and dark mode (`.dark` class on root) are defined in `src/style.css`. Path alias `@/` resolves to `src/`.

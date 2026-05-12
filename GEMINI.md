# GEMINI.md - Money Saver Vue.js Frontend

## Project Overview
**Money Saver** is a personal finance management application built with Vue 3, TypeScript, and Vite. It provides features for tracking expenses, managing budgets, and monitoring financial health through a modern, responsive dashboard.

### Core Technologies
- **Framework:** [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://shadcn.vuejs.org/) (via `reka-ui`)
- **Routing:** [Vue Router 4](https://router.vuejs.org/)
- **State/Logic Sharing:** Vue Composables
- **Icons:** [Lucide Vue Next](https://lucide.dev/)

## Project Structure
The project follows a standard Vue.js directory structure within the `money-saver/` directory:

- `src/assets/`: Static assets like images and global styles.
- `src/components/`: Reusable UI components.
    - `ui/`: Base components (buttons, inputs, dialogs, etc.).
    - `layout/`: Layout components like Navigation.
    - `budget/`, `transactions/`: Feature-specific components.
    - `register-modal/`: Multi-step registration flow components.
- `src/composables/`: Shared reactive logic (e.g., `useAuth.ts`, `useTheme.ts`).
- `src/lib/`: Core utilities, including `api.ts` for centralized API configuration.
- `src/router/`: Vue Router configuration and route definitions.
- `src/services/`: Service layer for API interactions (budget, transactions, users).
- `src/views/`: Page-level components (Home, Dashboard, Expenses, Budget, Settings).

## Building and Running
Navigate to the `money-saver` directory before running these commands:

| Command | Action |
| :--- | :--- |
| `npm install` | Install project dependencies. |
| `npm run dev` | Start the development server with Vite. |
| `npm run build` | Build the project for production using `vue-tsc` and `vite`. |
| `npm run preview` | Locally preview the production build. |

## Development Conventions

### Coding Standards
- **SFC Style:** Always use `<script setup lang="ts">` for Single File Components.
- **Styling:** Use Tailwind CSS utility classes for styling. Follow the established color tokens for theme consistency.
- **TypeScript:** Maintain strict typing. Avoid `any` where possible.
- **Components:** Favor composition and small, focused components. Base UI components should reside in `src/components/ui`.

### API Interactions
- All API requests should go through the `apiRequest` utility in `src/lib/api.ts`.
- Business logic and data fetching should be abstracted into services within `src/services/`.
- Default API Base URL: `http://localhost:8080/api/v1` (configurable via environment variables).

### Theme System
- The app supports Light, Dark, and System themes.
- Use `useTheme()` composable for theme management.
- Styling should use shadcn/ui semantic tokens (e.g., `bg-background`, `text-foreground`).
- Dark mode is triggered by the `.dark` class on the root element.

### Environment Variables
The following variables can be configured in `.env` files:
- `VITE_API_BASE_URL`: The base URL for the backend API.
- `VITE_API_TIMEOUT`: API request timeout in milliseconds.
- `VITE_DEV_MODE`: Enable/disable developer-specific features.
- `VITE_ENABLE_LOGGING`: Toggle API request/response logging.

## Key Documentation Files
- `money-saver/README.md`: Basic project setup instructions.
- `money-saver/ROUTER_SETUP.md`: Detailed information on the routing implementation.
- `money-saver/THEME_IMPLEMENTATION.md`: Details on the dark/light mode system.

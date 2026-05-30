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
- `src/components/ui/`: Shared base UI components (buttons, inputs, dialogs, etc.).
- `src/features/`: Domain-specific modules encapsulating logic, components, and services.
    - `auth/`: Authentication logic and registration flow.
    - `budget/`: Budget management and visualization.
    - `transactions/`: Expense tracking and transaction history.
- `src/types/`: Centralized TypeScript interfaces and types.
- `src/lib/`: Core utilities, including `api.ts` for the `apiClient`.
- `src/router/`: Vue Router configuration.
- `src/views/`: Page-level components.

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
- **Styling:** Use Tailwind CSS utility classes.
- **Modularity:** Follow the **Feature-Based Architecture**. New domain logic should be placed in `src/features/`.
- **TypeScript:** Maintain strict typing. All shared data models should live in `src/types/`.

### API Interactions
- All API requests should use the `apiClient` in `src/lib/api.ts`.
- Prefer `apiClient.get<T>()`, `apiClient.post<T>()`, etc., for automatic parsing and error handling.
- Business logic should be abstracted into feature-specific services (e.g., `BudgetServices.ts`).

### UX & Interaction
- **Auto-Focus:** Key input fields in multi-step flows should be automatically focused using `onMounted` or `watch` with `nextTick` to improve keyboard efficiency.
- **Keyboard Navigation:** Support the "Enter" key for advancing through forms and modals by using native `<form>` elements and `@submit.prevent`.

### Form Handling
- **Custom Inputs:** Always use `:model-value` and `@update:model-value` when binding to custom UI components (like `Input.vue`) to ensure correct state synchronization.
- **Form Submission:** Wrap multi-step modals or views in a single `<form>` to centralize submission logic and enable native browser features like submission on Enter.

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

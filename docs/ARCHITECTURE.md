# Money Saver - Architectural Overview

## Feature-Based Architecture
The project follows a **Feature-Based Architecture**. This modular approach encapsulates logic, components, and services by domain rather than by technical layer.

### Directory Structure (`src/features/`)
Each feature module contains everything it needs to function:
- `components/`: UI components exclusive to this feature.
- `[Feature]Services.ts`: API interaction logic for the domain.
- `use[Feature].ts`: (Optional) Feature-specific composables for state management.
- `index.ts`: The "Public API" for the feature, defining barrel exports.

### Core Domains
- **Auth (`src/features/auth`):** Handles session management, login, and the multi-step registration flow.
- **Budget (`src/features/budget`):** Manages budget allocation data and category visualization.
- **Transactions (`src/features/transactions`):** Handles expense logging and the transaction history list.

## Shared Infrastructure
- **`src/types/`**: Centralized TypeScript interfaces used across features. This ensures a "single source of truth" for data models.
- **`src/lib/api.ts`**: A robust `apiClient` wrapper around `fetch` that provides unified error handling, automatic JSON parsing, and request/response logging.
- **`src/components/ui/`**: Base UI primitives (buttons, inputs, dialogs) that are shared across all features.

## Long-Term Goals
1. **Scalability:** The feature-based structure allows for new domains (e.g., "Goals", "Reports") to be added without cluttering global directories.
2. **Encapsulation:** Features should be as self-contained as possible. External imports from other features should only happen through their `index.ts` barrel files.
3. **Type Safety:** Maintain 100% strict typing by leveraging the centralized `src/types` directory and the generic `apiClient.request<T>()` method.
4. **Consistency:** All new services should follow the plain-object export pattern established in Phase 2 of the restructuring.

## Development Workflow
- When adding a new feature, create a new folder in `src/features/`.
- Export the feature's primary components and services from its `index.ts`.
- Use the `apiClient` for all network requests to ensure consistent error handling.
- Update `src/types/` for any data models that might be used by multiple features.

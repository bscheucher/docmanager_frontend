This repository is a Create React App TypeScript frontend for a document-management service.

High-level architecture
- Frontend: React + TypeScript (CRA). Entry: `src/index.tsx` -> `src/App.tsx`.
- Auth: centralised in `src/contexts/AuthContext.tsx` and `src/services/auth.service.ts`.
- API services: lightweight single-responsibility service classes in `src/services/*` (e.g. `document.service.ts`, `tag.service.ts`, `user.service.ts`) — use these for all server interactions.
- Hooks: data + state orchestration lives in `src/hooks/*` (e.g. `useDocuments`, `useTags`, `useUsers`) and update local UI state after service calls.
- Routing + guards: `react-router` in `App.tsx` and route guards in `src/components/auth/ProtectedRoute.tsx` (use `isAdmin`, `hasRole`, `isAuthenticated`).

Why these choices matter
- Token management and refresh logic is implemented globally via `src/utils/axiosInterceptor.ts`. Requests rely on `authService.getAccessToken()` and the interceptor will attempt refresh on 401. Avoid duplicating token logic in components.
- Services return raw API responses; hooks and context convert and store them in React state. Prefer using existing hooks rather than calling services directly from components unless you intentionally need custom behaviour.

Developer workflows (commands)
- Start dev server: `npm start` (CRA default, opens at `http://localhost:3000`).
- Build production bundle: `npm run build`.
- Run tests (CRA): `npm test`.
- Environment: backend API base URL is read from `REACT_APP_API_URL` (defaults to `http://localhost:8080/api`).

Common patterns and conventions
- Central auth flow:
  - `auth.service` stores tokens in `localStorage` keys `accessToken` and `refreshToken`.
  - The axios interceptor adds `Authorization: Bearer <token>` and attempts token refresh on 401s. After failed refresh it calls `authService.logout()` and redirects to `/login`.
  - `AuthContext` exposes `login`, `register`, `logout`, `isAuthenticated`, `isLoading`, `user`, `hasRole`, and `isAdmin`.
- Service classes:
  - Use `documentService.uploadDocument(file, title, category, tags)` for file uploads (multipart/form-data).
  - Use typed endpoints in `src/services/*` rather than ad-hoc axios calls.
- Hooks:
  - Hooks named `useX` return `{ data, loading, error, refetch, ...mutations }` and update in-memory state to keep UIs in sync.
  - Prefer `useDocuments()` in lists to get automatic fetch + state update after create/update/delete.
- Error handling:
  - Services generally throw axios errors; calling code (hooks or context) maps `error.response?.data?.message` for user-facing messages.

Integration points & external dependencies
- Backend REST API under `REACT_APP_API_URL`. Services assume typical REST endpoints: `/auth/*`, `/documents`, `/tags`, `/users`.
- Third-party libs of note: `axios`, `react-router-dom@7`, `tailwindcss`, `lucide-react` (icons).

Where to make changes safely
- UI changes: `src/components/*`, `src/pages/*`.
- Business logic / API: `src/services/*` (update endpoints here). Keep service method signatures intact to avoid needing to update many hooks/components.
- Auth/token changes: update `src/services/auth.service.ts` and `src/utils/axiosInterceptor.ts` together.

Examples (copy-paste friendly)
- Add Authorization in a new service (don't — use existing `axios` instance/ interceptor):
  - Call `authService.getAccessToken()` only if you need the token for a special header; normal services rely on the interceptor.
- Use `useDocuments` in a component:
  - const { documents, loading, error, createDocument } = useDocuments();
  - call `createDocument(...)` to upload and automatically update `documents` state.

Files to inspect for context
- `src/contexts/AuthContext.tsx` — central auth state and exports `useAuth()`.
- `src/utils/axiosInterceptor.ts` — global axios interceptors, token refresh queue handling.
- `src/services/*.ts` — all HTTP API calls.
- `src/hooks/*.ts` — rules for local caching and mutation flows.
- `src/components/auth/ProtectedRoute.tsx` — routing guard conventions.

Notes for AI agents
- Do not change token storage keys (`accessToken`, `refreshToken`) without updating `axiosInterceptor` and `auth.service` together.
- Prefer to modify or add service methods in `src/services/*` instead of scattering axios calls.
- When adding new routes, use `ProtectedRoute` / `AdminRoute` as appropriate and follow `App.tsx` routing pattern.
- Tests: this project uses CRA test runner; add tests near the component/hook, follow existing naming conventions (`*.test.tsx`).

If something's unclear
- Ask which backend contract is authoritative (some endpoints are guessed by convention). Provide API examples or a sample response body when changing service typings.

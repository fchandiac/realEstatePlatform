# AI Coding Agent Guide — realEstatePlatform

Focus on being productive quickly in this full-stack repo (NestJS backend + Next.js frontend). Prefer concrete patterns already used here over generic advice.

## Architecture at a glance
- Monorepo structure:
  - `backend/` — NestJS 11 + TypeORM (MySQL). Business logic, auth, uploads, notifications.
  - `frontend/` — Next.js App Router with NextAuth Credentials provider, server actions for API access.
  - `project/` — Product/tech docs (entities, UX mocks, etc.).
- Backend modules are registered in `backend/src/app.module.ts`. Global config via `ConfigModule` and DB via `TypeOrmModule.forRootAsync(ormConfig)`.
- Static uploads are served from `backend/uploads` under `/uploads/*` (see `backend/src/main.ts`).

## Local dev & env
- Run services independently:
  - Backend: `cd backend && npm run start:dev` (default PORT=3000).
  - Frontend: `cd frontend && npm run dev` (Next defaults to 3000).
- To avoid port clash, commonly set backend `PORT=3001` and frontend uses `AUTH_API_URL=http://localhost:3001` (see `frontend/lib/env.ts`).
- Frontend env: set `NEXTAUTH_SECRET`, `NEXTAUTH_URL` when changing ports; backend URL comes from `AUTH_API_URL` or `NEXT_PUBLIC_AUTH_API_URL`.

## Backend patterns you should follow
- TypeORM config: `backend/src/config/ormconfig.ts` reads DB env; `synchronize` is true only in development. Use migrations for production.
  - Migrations: `backend/run-migrations.ts` or DataSource at `backend/data-source.js`; files live in `backend/database/migrations`.
- Auth uses encrypted JWE tokens (RSA-OAEP-256 + A256GCM): `backend/src/auth/jwe/jwe.service.ts` loads keys from `backend/keys/*.pem`.
  - Sign in: `POST /auth/sign-in` returns `{ access_token, user, ... }`.
  - Protected routes expect `Authorization: Bearer <JWE>`.
- Auditing is first-class: decorate controller handlers with `@Audit(...)` and the global `AuditInterceptor` logs success/failure (`backend/src/common/interceptors/audit.interceptor.ts`).
- Controller/Service/DTO conventions:
  - DTOs in `src/modules/<feature>/dto`, controllers/services in `src/modules/<feature>/` and validated via `ValidationPipe`.
  - Entities live in `src/entities` and use UUIDs, soft deletes where applicable.
- Concrete API examples:
  - Properties: `GET /properties/grid-sale` accepts query params like `fields, sort, sortField, search, filters, pagination, page, limit` (see controller and frontend usage below).
  - Users: `GET /users/admins` with `search` filter (see `backend/src/modules/users/users.controller.ts`).

## Frontend patterns you should follow
- Auth: NextAuth Credentials provider calls backend `/auth/sign-in` (`frontend/app/api/auth/[...nextauth]/route.ts`).
  - JWT session strategy; we persist `accessToken` and `role` in token and session.
  - `Providers` sets up `SessionProvider` and a small `AuthContext` with `login`, `logout`, and `refresh` (`frontend/app/providers.tsx`).
- Server actions are the standard way to call backend APIs. Always:
  - Read `accessToken` from `getServerSession(authOptions)`.
  - Use `env.backendApiUrl` (from `frontend/lib/env.ts`), never hardcode URLs.
  - Send `Authorization: Bearer ${accessToken}`.
  - Examples:
    - List admins: `frontend/app/actions/users.ts` → calls `GET /users/admins?search=...`.
    - Sale grid: `frontend/app/actions/properties.ts` builds URLSearchParams for `/properties/grid-sale`.
- App Router structure:
  - Public portal under `frontend/app/portal/*`.
  - Back office under `frontend/app/backOffice/*` with feature pages (e.g., `users/administrators`).

### Frontend components (UI)
- All reusable UI lives under `frontend/components/*`. Prefer these over ad‑hoc HTML.
- Import style: Follow `frontend/components/index.ts` guidance — import directly from the component path, not from the barrel file.
  - Example: `import Alert from '@/components/Alert/Alert'`
- Recommended mappings:
  - Feedback: `Alert` (success/info/warning/error), `Dialog` for modals, `CircularProgress` for loading spinners.
  - Lists/tables: `DataGrid` for paginated/admin listings.
  - Forms/inputs: `BaseForm` for structured CRUD forms; `TextField` for text/email/password/number; `Select`, `Dropdown`, `AutoComplete`, `Switch`, `NumberStepper`, `RangeSlider` for specialized inputs.
  - Media/upload/location: `FileUploader`, `LocationPicker`.
  - Navigation and common UI: `TopBar`, `Button`, `IconButton`, `Card`, `Showcase`, `Logo`, `FontAwesome` wrapper.
- Client vs Server:
  - UI components that use React hooks or browser APIs must be rendered in Client Components (`'use client'`). Keep data fetching in Server Components or Server Actions.
- Style system: Tailwind CSS utility classes. Keep styling consistent with existing component classes; avoid inline styles unless necessary.

#### Quick usage guide
- Alert: show user feedback.
  - Import: `import Alert from '@/components/Alert/Alert'`
  - Use for success/info/warning/error messages; minimal layout, stackable.
- Dialog: confirm/collect small inputs in a modal.
  - Import: `import Dialog from '@/components/Dialog/Dialog'`
  - Wrap critical/destructive actions with confirmation.
- CircularProgress: indicate loading in panels or full page.
  - Import: `import CircularProgress from '@/components/CircularProgress/CircularProgress'`
  - Use while awaiting server actions or data loads.
- DataGrid: admin-style lists with pagination/sorting.
  - Import: `import DataGrid from '@/components/DataGrid/DataGrid'`
  - Pair with server actions (e.g., `listAdministrators`, `getSalePropertiesGrid`).
- BaseForm: scaffold CRUD forms with field configs; use for create/update flows.
  - Import: `import { CreateBaseForm, UpdateBaseForm } from '@/components/BaseForm'`
  - Prefer BaseForm over custom layouts for consistent validation/layout.
- TextField: text/email/password/number inputs; use inside forms and filters.
  - Import: `import TextField from '@/components/TextField/TextField'`
  - Add `'use client'` at top of file if using state/hooks.
- Select/Dropdown/AutoComplete: choose one from list; prefer `AutoComplete` for large sets.
  - Import: `import Select from '@/components/Select/Select'`, etc.
- Switch/NumberStepper/RangeSlider: toggles, small numeric inputs, ranged filters.
  - Import: from their respective folders under `components/`.
- FileUploader: upload images/docs; use with backend endpoints like `/document/upload` or `/multimedia`.
  - Import: `import FileUploader from '@/components/FileUploader/FileUploader'`
  - Remember backend serves files from `/uploads/*`.
- LocationPicker: pick map coordinates for properties.
  - Import: `import LocationPicker from '@/components/LocationPicker/LocationPicker'`
  - Requires client component and map CSS; avoid SSR-only contexts.
- TopBar/Button/IconButton/Card/Showcase/Logo/FontAwesome: building blocks for consistent UX.
  - Import from their paths; keep styles consistent and avoid inline styles.

## Testing & data
- Jest scripts are available per feature (e.g., `npm run test:contract`, `test:users`) in `backend/package.json`.
- Seeding helpers exist (`npm run seed` / `seed:reset`). Prefer `seed:reset` before integration tests that expect a known state.

## When adding features
- Backend:
  - Create DTOs, service, controller under `src/modules/<feature>/` with `ValidationPipe` and `@Audit` annotations.
  - Wire your module in `app.module.ts`.
  - If schema changes, add a migration in `backend/database/migrations` and update seeders if used.
- Frontend:
  - Add a server action that follows the `listAdministrators`/`getSalePropertiesGrid` pattern.
  - Update App Router pages; rely on `useAuth()`/session where needed for role-based UI decisions.

## Gotchas
- Backend and frontend both default to port 3000; set one to 3001 to avoid conflicts.
- Only JWE tokens (not plain JWT) are accepted by protected backend endpoints; always pass the encrypted token you got from sign-in.
- Static files are under `/uploads/*` from the backend; don’t serve them from the frontend public dir unless explicitly needed.

If anything above is unclear or feels incomplete (e.g., migrations workflow, roles/permissions granularity), tell me what you’re building and I’ll expand these rules specific to that area.

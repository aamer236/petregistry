# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui

## Product: PetRetriever

PetRetriever is a digital pet identity and verification platform. It allows:
- Registering pets with identity data (generates unique Pet ID)
- Verifying pet identity by Pet ID, owner phone, or microchip ID
- Storing vaccination and health records
- Enabling vets and institutions to verify pets

### Pages
- `/` — Landing page with hero, how it works, CTAs
- `/register` — 3-step pet registration form (owner info → pet info → photo upload)
- `/verify` — Search by Pet ID, owner phone, or microchip ID
- `/pet/:id` — Full pet profile with health records timeline
- `/vet` — Vet dashboard: view pets, add vaccinations/notes, mark verified
- `/admin` — Admin dashboard: stats, pet table with status filtering

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── petretriever/       # React + Vite frontend (PetRetriever app)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Database Schema

### Tables (Drizzle / PostgreSQL)

- **owners** — id, name, phone (unique), email, createdAt
- **pets** — id, petId (unique, format PR-XXXXXXXX), name, species, breed, age, gender, microchipId, photoUrl, status (Verified/Pending/Incomplete), ownerId (FK), createdAt
- **vaccination_records** — id, petId (FK), type, date, verified, notes, createdAt
- **medical_records** — id, petId (FK), notes, createdAt

## API Routes

All routes under `/api`:

- `GET /healthz` — Health check
- `GET /pets` — List pets (optional ?status=, ?search=)
- `POST /pets` — Register a pet
- `GET /pets/verify` — Verify by ?petId=, ?phone=, ?microchipId=
- `GET /pets/:id` — Get full pet profile
- `PATCH /pets/:id` — Update pet
- `PATCH /pets/:id/verify` — Mark pet as verified
- `GET /pets/:id/vaccinations` — List vaccinations
- `POST /pets/:id/vaccinations` — Add vaccination
- `GET /pets/:id/medical` — List medical records
- `POST /pets/:id/medical` — Add medical note
- `GET /admin/stats` — Get admin statistics
- `POST /upload` — Upload photo (stores data URL)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`).
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/petretriever` (`@workspace/petretriever`)

React + Vite frontend. Routes via wouter. Uses React Query hooks from `@workspace/api-client-react`.

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` and `src/routes/pets.ts`
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/pets.ts` — pet, owner, vaccination, and medical record tables
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`).

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec. Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package.

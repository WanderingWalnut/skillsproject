# Repository Guidelines

## Project Structure & Module Organization
- `client/`: Vite + React (TypeScript). Key areas: `src/app/routes/` (pages), `src/components/` (shared UI), `src/hooks/`, `src/types/`, `src/config/`.
- `server/`: FastAPI + SQLAlchemy. Key areas: `app/main.py`, `app/api/api_v1/routes/` (endpoints), `app/core/` (config, db, services), `app/schemas/`, `app/crud/`.
- Root assets: `sample_maintenance_data.csv`, `overview.md`. Local DB defaults to `server/maintenance_predictor.db`.

## Build, Test, and Development Commands
- Backend (from `server/`):
  - Install: `python -m venv ../venv && source ../venv/bin/activate && pip install -r requirements.txt`
  - Run API: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
  - Config: copy `.env.example` → `.env` and set `DATABASE_URL` if not using SQLite.
- Frontend (from `client/`):
  - Install: `npm install`
  - Dev server: `npm run dev` (http://localhost:5173)
  - Build/preview: `npm run build` / `npm run preview`

## Coding Style & Naming Conventions
- Frontend: TypeScript, React 19, ESLint enforced (`client/eslint.config.js`).
  - Components PascalCase in folders (e.g., `components/RiskBadge/RiskBadge.tsx`).
  - Hooks start with `use` (e.g., `hooks/useFileUpload.ts`).
  - 2‑space indent; prefer functional components and explicit types.
- Backend: Python (PEP 8, type hints, snake_case).
  - Keep route handlers thin; put business logic in `app/core/services/`.
  - Config lives in `app/core/config.py`; DB in `app/core/db/`.

## Testing Guidelines
- No suite is checked in yet. If adding tests:
  - Backend: `server/tests/` with `pytest` (aim for unit tests around services and schemas).
  - Frontend: Vitest + React Testing Library; add `"test"` script in `client/package.json` and keep tests near components or under `src/__tests__/`.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise subject (≤72 chars). Optional scope prefix: `server:`, `client:` (e.g., `server: add training workflow service`).
- PRs: include summary, rationale, and screenshots for UI changes; link issues; note API or schema changes with examples; update docs (`STRUCTURE.md`, `.env.example`) when relevant.

## Security & Configuration Tips
- Do not commit secrets. Use `server/.env` (copy from `.env.example`).
- Default CORS allows `http://localhost:5173` (see `server/app/main.py`). Update if ports/origins change.
- SQLite is default; set `DATABASE_URL` for other engines. Exclude local DB files from commits when possible.


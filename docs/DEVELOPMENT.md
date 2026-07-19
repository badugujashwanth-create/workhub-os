# Development guide

## Purpose

WorkHub is a full-stack workplace-operations prototype covering tasks, projects, work sessions, attendance, permissions, collaboration, documents, calls, reports, and administration.

## Install and run

```powershell
npm ci --prefix backend
npm ci --prefix frontend
powershell -ExecutionPolicy Bypass -File scripts/run-demo.ps1
```

The demo command uses `MONGO_URI=memory`, synthetic seed data, loopback API/socket URLs, and a local-only JWT secret. For manual development, start each package with `npm run dev`.

## Verify

```powershell
npm test --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
npm audit --prefix backend
npm audit --prefix frontend
```

While both services are healthy, `node scripts/verify-demo-workflow.mjs` verifies admin login, project discovery, task assignment, employee visibility/status, work-session state, and manager-side persistence.

Copy example environment files instead of committing real values. Generated dependencies, caches, logs, databases, uploads, and build output must remain untracked.

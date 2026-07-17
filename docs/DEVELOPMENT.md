# Development guide

## Purpose

Full-stack workplace operations system covering tasks, attendance, permissions, collaboration, documents, calls, reports, and administration.

## Prerequisites

Next.js/TypeScript, Express/Node.js, MongoDB/Mongoose, Socket.IO, Zustand.

## Install

```powershell
npm ci --prefix backend; npm ci --prefix frontend
```

## Run

```powershell
Run `npm run dev` in both backend and frontend directories
```

## Verify

- Tests: `Frontend: npm run lint; backend has no automated test script`
- Build: `npm run build --prefix frontend`

See [TEST_REPORT.md](TEST_REPORT.md) for the latest audited results. Copy example environment files instead of committing real values. Generated dependencies, caches, logs, databases, and build output must remain untracked.


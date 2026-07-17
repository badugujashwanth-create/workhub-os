# WorkHub OS interview guide

## Tell me about this project.

WorkHub OS is a role-based workplace operations application covering tasks, attendance, permissions, collaboration, calls, and reporting through a Next.js frontend and Express/MongoDB backend.

## Why did you build it?

The goal was to explore how connected team workflows can share identity, permissions, and real-time state instead of living in separate tools.

## What was your contribution?

Discuss the frontend workflows, backend service boundary, permissions/type/lifecycle corrections, CI, documentation, and demo. Do not claim the MongoDB-backed production path was verified in the final audit.

## What was the hardest technical problem?

Coordinating role-based UI behavior with real-time chat/call and backend state while keeping browser permissions and asynchronous initialization predictable.

## How does the architecture work?

Next.js provides role-oriented application routes; Express owns API and Socket.IO behavior; MongoDB stores operational state; browser WebRTC uses configured signaling and TURN/STUN boundaries.

## What would you improve?

Add backend tests, a disposable MongoDB integration environment, contract tests, stronger authentication/session review, and end-to-end real-time tests.

## How did you test it?

The verified frontend lint and production build pass in CI. Backend dependencies install, but no automated backend test script exists and startup needs configured MongoDB.

## What are its security limitations?

Synthetic accounts must not be reused publicly. Authentication, authorization, CORS, MongoDB access, uploads, calls, and environment secrets require deployment hardening.

## How would you scale it?

Separate stateless API and Socket.IO scaling, use shared session/pub-sub infrastructure, index operational queries, store uploads externally, and isolate reporting workloads.

## What did you learn?

Large workflow products need explicit domain and permission boundaries; frontend polish cannot substitute for backend integration tests.

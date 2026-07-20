# WorkHub OS interview guide

## What is it?

WorkHub OS is a role-based workplace-operations prototype that connects projects, tasks, work sessions, attendance, collaboration, calls, and reporting through a Next.js frontend and Express/MongoDB backend.

## What is the strongest workflow?

A manager works inside an owned or managed project, assigns a project member, and follows the same task state that the employee updates. The integration suite proves both the happy path and cross-project denial.

## What was the hardest problem?

The broad API originally relied heavily on role checks and automatic activity startup. The stronger boundary combines project relationships, task allowlists, explicit session start, and regression tests against a real ephemeral database.

## What evidence exists?

Seven backend tests cover CORS plus authenticated project/task behavior using `mongodb-memory-server`. Frontend lint, a 37-route production build, and both dependency audits pass.

## What is not proven?

Do not claim production employee monitoring, WebRTC reliability, provider-backed AI behavior, external user adoption, or completed credential rotation. Tokens are currently stored in browser storage and need a stricter production threat model.

## What would come next?

Move sessions to a stricter browser boundary, expand contract and real-time tests, measure query/socket behavior under load, and complete account-owner credential rotation and log review.

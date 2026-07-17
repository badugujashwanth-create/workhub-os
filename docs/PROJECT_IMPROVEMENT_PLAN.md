# Project Improvement Plan

## Current state

WorkHub has a substantial role/work/task/collaboration API surface and a polished frontend, but baseline CI did not execute backend behavior and local startup requires MongoDB.

## Findings

- **Works:** frontend lint/build, health endpoints, route separation, role models, Socket.IO path, CORS allowlist logic, and seeded development concepts.
- **Does not / missing:** broad authorization/IDOR verification, deterministic one-command demo, backend workflow tests, and evidence that every dashboard surface is fully connected.
- **UX / architecture:** breadth creates a risk of shallow features. The role/work/task path should remain the demonstrated core.
- **Testing / security:** baseline backend CI only installed packages. CORS, authentication, and resource authorization are the highest-risk boundaries.
- **Performance / docs / demo:** query and socket scaling are unmeasured. MongoDB setup is the main reproducibility blocker.

## Recommendations

### Critical

- Add meaningful security-boundary tests to backend CI, beginning with origin normalization, preview scoping, suffix spoofing, and local/server requests.
- Keep production origins explicit and fail closed.

### High value

- Add an authenticated workspace/project/task integration path using an ephemeral database.
- Document and verify a bounded seeded demo workflow.

### Optional

- Add workload analytics only after core authorization tests are complete.

## Delivery constraints

- **Priority:** backend verification; **complexity:** medium; **dependencies:** Node, MongoDB or `mongodb-memory-server` for later integration tests.
- **Acceptance:** frontend lint/build and backend tests pass in CI; spoofed origins fail; startup errors explain missing database configuration.
- **Excluded:** cloning full enterprise project-management suites and expanding unverified dashboard breadth.

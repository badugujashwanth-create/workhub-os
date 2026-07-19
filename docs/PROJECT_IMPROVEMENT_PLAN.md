# Project improvement plan

## Current state

The core role/project/task workflow now runs against an ephemeral MongoDB database in tests and in the deterministic local demo. CORS and dependency boundaries are also verified.

## Completed P0 work

- Upgraded backend and frontend dependency trees to zero known audit findings.
- Added object-level project/task authorization and employee update allowlists.
- Added MongoDB-backed login, happy-path, IDOR, and manager-scope regression tests.
- Made local frontend defaults explicit and loopback-only.
- Added a one-command in-memory startup path and deterministic workflow verifier.

## Remaining P1 work

- Record and inspect a full recruiter walkthrough of the verified workflow.
- Rotate the previously exposed provider credential and reusable JWT outside the repository, then review deployment logs.
- Add browser evidence for keyboard, responsive, and reduced-motion states.
- Add real-time call tests only when an owned TURN/media test environment is authorized.

## Excluded expansion

Do not clone a broad enterprise project-management suite or imply every dashboard surface is production-integrated. The role/project/task/work-session path remains the public proof workflow.

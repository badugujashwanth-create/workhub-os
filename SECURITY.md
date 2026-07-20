# Security policy

## Supported status

WorkHub OS is maintained as a portfolio prototype. The authenticated project/task workflow and current dependency trees are tested; this is not a production-support or complete-security claim.

## Reporting a vulnerability

Use GitHub private vulnerability reporting when available. Otherwise contact the owner through a verified GitHub channel. Never include secrets, access tokens, private URLs, employee data, or exploit details in a public issue.

## Verified controls

- Explicit CORS origins with preview-site scoping and spoof rejection.
- Disabled public registration/bootstrap administration by default.
- Hashed rotating refresh tokens and account-disable checks.
- Project ownership/manager/member authorization and task update allowlists.
- Rate limiting, Helmet, dependency audits, and MongoDB-backed regression tests.

## Open boundaries

- Browser token storage requires a stricter production session/XSS design.
- Uploads, WebRTC/TURN, production database access, and provider integrations require deployment-specific review.
- Historical provider/JWT findings require account-owner rotation, revocation, session invalidation, and log review.

Commit only placeholder examples and use synthetic data for tests, screenshots, and recordings. No response-time or production support commitment is implied.

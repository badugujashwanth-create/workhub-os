# Deployment and rollback

This repository has a verified frontend build, dependency audits, and authenticated project/task integration tests. A new public backend deployment is not yet verified because it still requires owned infrastructure and completed credential rotation.

## Security prerequisite

Earlier document revisions contained credential-like examples. Treat any value copied from them as compromised: revoke/rotate provider keys and JWT secrets, invalidate affected sessions, and review provider usage logs. Git history is intentionally not rewritten in this release.

## Backend checklist

1. Create an isolated MongoDB database and least-privilege application user.
2. Generate a new high-entropy JWT secret in the hosting provider's secret manager.
3. Add an optional provider key only if AI routes are enabled.
4. Set `CLIENT_URL` to explicit owned HTTPS origins.
5. Run `npm ci` and `npm test` in `backend`.
6. Start the service and verify `/api/health`.
7. Create accounts through the application bootstrap flow; there is no documented default administrator password.
8. Run the existing role/project/task authorization suite and add deployment-specific checks before allowing public traffic.

## Frontend checklist

1. Set only browser-safe public values.
2. Run `npm ci`, `npm run lint`, and `npm run build` in `frontend`.
3. Verify login failure, permission-denied recovery, task/workflow navigation, and responsive layouts against the deployed API.

## Rollback

Keep the last known-good deployment artifact and database backup. If authentication, authorization, or secret exposure is suspected, disable public traffic, rotate secrets and sessions, restore the previous application version, and validate data integrity before reopening.

## Current limitation

The release does not claim a newly verified WorkHub backend. The deterministic local demo remains the public proof path until infrastructure ownership and rotation gates are complete.

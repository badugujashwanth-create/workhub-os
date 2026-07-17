# Deployment and rollback

This repository has a verified frontend build and backend security-boundary tests. A public backend deployment is not verified because it requires MongoDB, environment secrets, real-time infrastructure, and authorization testing.

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
8. Verify role authorization and cross-user resource isolation before allowing public traffic.

## Frontend checklist

1. Set only browser-safe public values.
2. Run `npm ci`, `npm run lint`, and `npm run build` in `frontend`.
3. Verify login failure, permission-denied recovery, task/workflow navigation, and responsive layouts against the deployed API.

## Rollback

Keep the last known-good deployment artifact and database backup. If authentication, authorization, or secret exposure is suspected, disable public traffic, rotate secrets and sessions, restore the previous application version, and validate data integrity before reopening.

## Current limitation

The portfolio release does not publish or claim a newly verified WorkHub backend. The existing demo video is preferable to an insecure deployment.

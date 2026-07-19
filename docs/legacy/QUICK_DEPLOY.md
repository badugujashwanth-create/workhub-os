# Quick deployment guide

> Security notice (2026-07-18): earlier revisions of this document contained credential-like deployment examples. Any real credential copied from an earlier revision must be revoked and rotated before deployment. Do not reuse documentation values.

## Backend

Configure secrets in the hosting provider's encrypted environment settings, never in Git or a client bundle:

```env
PORT=5000
MONGO_URI=<managed-mongodb-connection-string>
JWT_SECRET=<new-random-secret-generated-for-this-environment>
CLIENT_URL=https://your-frontend.example
OPENAI_API_KEY=<optional-provider-secret>
OPENAI_MODEL=<supported-model-name>
```

Generate `JWT_SECRET` independently for each environment. Do not copy example values, logs, or secrets from another deployment.

```powershell
Set-Location backend
npm ci
npm test
npm start
```

Verify `GET /api/health` before connecting the frontend. A production deployment also requires a real MongoDB service; the repository does not claim a verified public backend.

## Frontend

Set the public API URL in the hosting provider, then install, lint, and build:

```powershell
Set-Location frontend
npm ci
npm run lint
npm run build
```

## Release gate

- Rotate any credential ever committed or copied into documentation.
- Restrict `CLIENT_URL` to owned HTTPS origins.
- Create the first administrator through an approved bootstrap process; no default password is provided.
- Test authentication, role authorization, and resource ownership before exposing the API.
- Retain the video demo when a safe backend deployment is unavailable.

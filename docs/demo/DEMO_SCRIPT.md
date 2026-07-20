# WorkHub OS demo script

**Target length:** 5–6 minutes

**Format:** Real Chromium product simulation with generated narration and captions

**Data:** Synthetic in-memory records only

## Walkthrough

1. **Boundary and admin entry:** State the synthetic-data and non-production boundary, then use the seeded admin account.
2. **Manager evidence:** Inspect the dashboard, task register, and deterministic launch-readiness task assigned to Eli.
3. **Employee entry:** Sign out, use the seeded employee account, and show that login did not start a work session.
4. **Explicit consent:** Open Work Mode, read the collection boundary, and deliberately start the session.
5. **Employee execution:** Open the assigned task board, move the deterministic task to review, and add a safe progress comment.
6. **Explicit stop:** Return to Work Mode and stop the session before signing out.
7. **Manager verification:** Sign in as admin again and verify the same persisted review status and employee comment.
8. **Proof and limitations:** Narrate the test, build, audit, secret-scan, provider, deployment, and credential-rotation boundaries.

Never show environment files, tokens, unrelated applications, notifications, bookmarks, personal accounts, or private URLs. Do not edit footage to imply an external integration succeeded.

## Record

After the repository checks pass and Chromium use is authorized:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\record-demo.ps1
```

The script starts a clean in-memory demo, verifies the API workflow, records the browser simulation, adds narration, extracts inspection frames, validates duration/resolution/audio, and writes the SHA-256 checksum.

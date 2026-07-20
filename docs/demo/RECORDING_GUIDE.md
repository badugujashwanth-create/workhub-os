# Recording guide

## Preparation

1. Install the backend and frontend lockfiles exactly as documented in `docs/DEVELOPMENT.md`.
2. Close notifications, unrelated applications, password managers, and personal browser profiles.
3. Use only the synthetic in-memory demo. Do not supply provider credentials.

## Record and verify

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\record-demo.ps1
```

The script resolves pinned FFmpeg 8.1.2 when needed, starts a production frontend and ephemeral backend, verifies the API workflow, runs the complete Chromium simulation, generates narration, encodes VP9/Opus, creates a thumbnail, extracts twelve milestone frames, and writes verification metadata plus a SHA-256 checksum.

Use `-SmokeOnly` to validate the 14-step workflow without the timed holds or media encoding. Use `-AuditOnly` to run the 390×844 responsive, focus, drawer, and reduced-motion audit.

## Acceptance

Do not publish a take until it is at least three minutes, includes audio and captions, stays at 1280×720, contains no personal or secret material, and every extracted frame has been visually inspected. Do not splice in fake success states or imply that an external provider ran.

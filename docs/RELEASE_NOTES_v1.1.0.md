# WorkHub OS v1.1.0

## Candidate release outcome

This release makes the role/project/task/work-session path the verified public workflow. It adds object-level authorization tests, explicit session consent, deterministic in-memory startup, responsive navigation, reduced-motion and focus support, current documentation, and a real 5:42 narrated Chromium walkthrough.

## Verified evidence

- Seven backend tests, including authenticated MongoDB-memory authorization flows.
- Next.js production build with 37 routes and a clean frontend lint run.
- Zero known npm audit findings in both dependency trees.
- Current tracked-tree secret scan with zero findings.
- Fourteen-step Chromium workflow smoke and 390×844 responsive/accessibility audit.
- 342.728-second VP9/Opus walkthrough with captions, thumbnail, SHA-256 checksum, and twelve inspected frames.

## Compatibility and fixes

- Updated both dynamic task routes for asynchronous Next.js 16 route parameters.
- Persisted fresh authentication tokens before requesting the current profile.
- Made work-session stop idempotent and reset the verifier’s explicit demo session.
- Removed mobile horizontal overflow and moved sign-in ahead of marketing content on small screens.

## External gates

This is a tested prototype release, not a production-security declaration. Account-owner credential rotation and log review remain required. Provider AI, hosted monitoring, real employee use, and TURN-backed media reliability are not claimed.

# Demo verification evidence

The recording pipeline writes twelve timestamped frames and `verification.json` here. The JSON records duration, resolution, codecs, browser, synthetic-data boundary, workflow, file size, caption path, and SHA-256 checksum.

Acceptance requires:

- at least 180 seconds of uncut product simulation;
- 1280×720 video with an Opus audio stream;
- captions covering the complete walkthrough;
- no credentials, personal accounts, unrelated applications, or unsupported external-service claims;
- visual inspection of every extracted frame after generation;
- matching status, comment, consent, and manager-verification states in the running product.

The committed evidence passed these checks on 2026-07-20. See [`INSPECTION.md`](INSPECTION.md) for the frame-by-frame result.

# Walkthrough frame inspection

Inspected on 2026-07-20 from the final 342.728-second VP9/Opus recording. All frames use synthetic WorkHub data and the 1280×720 Chromium viewport.

| Frame | Timestamp | Visible evidence | Result |
|---:|---:|---|---|
| 01 | 0:10 | Synthetic login boundary and both demo roles | Pass |
| 02 | 0:35 | Admin dashboard | Pass |
| 03 | 1:00 | Deterministic task in manager register | Pass |
| 04 | 1:30 | Task detail, Eli Flores, and Ava Morgan | Pass |
| 05 | 2:00 | Work Mode before consent, offline state | Pass |
| 06 | 2:30 | Active session after explicit start | Pass |
| 07 | 3:00 | Employee task in progress | Pass |
| 08 | 3:30 | Employee task moved to review | Pass |
| 09 | 4:00 | Work Mode returned to the stopped state | Pass |
| 10 | 4:30 | Administrator role restored | Pass |
| 11 | 5:00 | Manager register shows review and one comment | Pass |
| 12 | 5:25 | Manager sees Eli’s persisted update | Pass |

No frame exposes credentials, personal accounts, unrelated applications, browser chrome, or a claimed provider success. The rejected first take was replaced after a full-page screenshot briefly resized the recorded viewport; the final take uses viewport-only evidence captures and contains no such artifact.

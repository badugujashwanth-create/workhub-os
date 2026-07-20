# UX and accessibility audit

Audited on 2026-07-20 with Playwright’s bundled Chromium against the production frontend and synthetic in-memory backend.

## Evidence-led findings

| Area | Current evidence | Finding | Resolution | Final evidence |
|---|---|---|---|---|
| Mobile login | [`current-mobile-login.png`](assets/screenshots/audit/current-mobile-login.png) | The marketing panel displaced the sign-in action below the first viewport. | Reordered the existing cards on small screens without changing the desktop composition. | [`final-mobile-login.png`](assets/screenshots/audit/final-mobile-login.png) |
| Mobile shell | [`current-mobile-dashboard.png`](assets/screenshots/audit/current-mobile-dashboard.png) | A permanent 288-pixel sidebar caused a 636-pixel document inside a 390-pixel viewport. | Reused the sidebar as an overlay drawer below the large breakpoint and constrained content with `min-width: 0`. | [`final-mobile-dashboard.png`](assets/screenshots/audit/final-mobile-dashboard.png) |
| Mobile navigation | Same overflow evidence | Primary routes were not practically reachable without horizontal scrolling. | Added a labelled menu button, outside-click close, Escape close, and close-on-navigation behavior. | [`final-mobile-navigation.png`](assets/screenshots/audit/final-mobile-navigation.png) |
| Motion | Source inspection | Decorative animation had no reduced-motion override. | Added a global `prefers-reduced-motion: reduce` boundary and verified the computed duration in Chromium. | Automated audit pass |
| Keyboard focus | Source inspection | Focus treatment varied by control. | Added a consistent three-pixel `:focus-visible` outline and verified keyboard focus in Chromium. | Automated audit pass |

## Verification result

The final mobile document reports `clientWidth: 390` and `scrollWidth: 390`. The responsive audit also verifies keyboard focus, reduced motion, drawer open/close, and Escape dismissal. Desktop behavior remains covered by the fourteen-milestone workflow and the inspected 1280×720 recording.

## Remaining WCAG 2.2 AA risks

- A full manual screen-reader pass is still required before a formal accessibility claim.
- Complex data tables need broader keyboard and zoom testing across every administrative route.
- Real call controls require permission-dialog, captioning, and media-state testing in an authorized TURN environment.

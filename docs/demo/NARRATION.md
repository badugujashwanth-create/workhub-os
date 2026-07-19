# WorkHub OS walkthrough narration

WorkHub OS is a local workplace-operations prototype built around clear roles, bounded activity collection, and an auditable task workflow. Every person, project, task, comment, and work session in this walkthrough is synthetic, resettable demo data. This recording does not show a production employer, real employee monitoring, or a live customer environment.

The opening screen provides separate seeded admin and employee paths. We begin as the administrator. Authentication establishes the role boundary, but it does not create an employee work session. The administrative dashboard summarizes the demo workspace and exposes operations such as people, teams, tasks, leave, calls, documents, announcements, reports, and control settings.

The task register is the manager-side source of truth for assignments. The launch-readiness task is linked to the synthetic workspace and assigned to Eli. Opening it shows the assignee, assigner, priority, due date, discussion, and attachment boundary. This is a real record returned by the running API, not a static card added only for the video.

We now sign out and enter through the seeded employee path. The employee dashboard explicitly says that activity is not recorded before Work Mode begins. Login alone creates no current work session, and the presence heartbeat is disabled until the user starts one. This consent boundary was verified in the authenticated integration suite.

In Work Mode, the interface explains what starting means: while a session is live, WorkHub can record session activity and idle events. Stopping ends that collection. Camera and microphone access are separate and requested only when a user deliberately starts a call. The employee now selects Start session, making the transition visible and reversible.

The employee task board contains the same launch-readiness assignment seen by the administrator. The four status columns expose a small but complete delivery lifecycle. Eli moves the task into review, and the interface updates from the API response. The task is then opened and a safe progress note is added to the shared discussion.

This status change and comment form the core end-to-end workflow: a manager-owned assignment reaches the intended employee, the employee performs an explicit state transition, and the resulting evidence remains available to the manager. Authorization tests also verify that a second workspace cannot read or mutate the project and task through guessed identifiers.

Before leaving the employee view, Work Mode is stopped explicitly. The button returns to Start session, providing visible confirmation that session-scoped collection ended. Signing out also performs defensive session cleanup, but the walkthrough demonstrates the intentional user action rather than relying on that fallback.

Back in the administrator role, the task register shows the persisted review state. The task detail shows the employee update in the shared discussion. This closes the undeniable workflow using the same backend record across two role-scoped interfaces.

The completion candidate is backed by seven automated backend tests, including MongoDB-memory authorization workflows, a successful production frontend build with thirty-seven routes, zero known npm audit findings in both dependency trees, a current-tree secret scan, a Markdown link check, and a deterministic API verifier. Those checks support a tested local prototype claim; they do not establish production readiness.

Several boundaries remain explicit. Provider-backed AI summaries require separate configuration and are not shown here. Calls require user-initiated media permission and are not exercised in this recording. Real deployment still requires managed secrets, monitoring, privacy and accessibility review, provider configuration, operational ownership, and rotation of any historically exposed credentials. WorkHub OS demonstrates secure workflow thinking without claiming real employees, customers, or production usage.

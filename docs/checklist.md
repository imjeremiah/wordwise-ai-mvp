**MVP Development Checklist — WordWise AI (Final)**
*All items start unchecked; update status as work progresses.*

---

### Phase 1 — Foundation

*Essential scaffolding; no live Firebase credentials required.*

\[X] **Feature 1 – Boilerplate Cleanup**
\[X] Delete/rename all DevAgency-specific pages, components, images, and routes while preserving shared layout code.
\[X] Update `package.json`, `next.config.mjs`, and environment-variable *names* (leave values blank).
\[X] Commit the cleaned skeleton as the baseline for further work.

\[X] **Feature 2 – Tooling & Core Configuration**
\[X] Ensure Next.js 14, React 18, Tailwind, and shadcn/ui build without errors.
\[X] Configure static-export mode (`next build && next export`) in `package.json` scripts.
\[X] Add ESLint + Prettier configs and hook with Husky pre-commit.
\[X] Install the Firebase CLI globally (no project init yet).

\[X] **Feature 3 – Continuous Integration Scaffold**
\[X] Add a GitHub Actions workflow that lints, tests, builds, and **exports** the site.
\[X] Leave the `firebase deploy` step **commented-out** until secrets are added in Phase 2.
\[X] Verify the pipeline passes through lint/test/build/export without live credentials.

\[X] **Feature 4 – Local Development Environment**
\[X] Create a **minimal `firebase.json`** (hosting, Firestore, functions stubs) so emulators launch cleanly.
\[X] Add `npm run emulators` to start Firebase Auth, Firestore, and Functions locally.
\[X] Add `npm run dev` to run Next.js + Tailwind in watch mode.
\[X] Document setup in `README.md` so a fresh clone runs with two commands.

---

### Phase 2 — Data Layer

*Live Firebase wiring; depends on Foundation.*

\[ ] **Feature 1 – Firebase Project Integration**
\[ ] Add real Firebase config vars (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc.) to `.env.local`.
\[ ] Upload service-account JSON to the repo's encrypted secret `FIREBASE_SERVICE_ACCOUNT`.
\[ ] Enable Email/Password + Google auth and create a Firestore database in the Firebase console.

\[ ] **Feature 2 – Authentication Module**
\[ ] Implement Email/Password sign-up, sign-in, and sign-out flows.
\[ ] Implement Google SSO flow with popup and credential persistence.
\[ ] Unit-test auth flows with the Firebase Auth emulator.

\[ ] **Feature 3 – Firestore Data Models & Security**
\[ ] Create `users` collection (UID, displayName, createdAt).
\[ ] Create `documents` collection (title, content, updatedAt, ownerUID).
\[ ] Write security rules restricting reads/writes to the owner UID.

\[ ] **Feature 4 – CI/CD Secrets & Deploy Hook**
\[ ] Add `FIREBASE_PROJECT_ID` and `FIREBASE_SERVICE_ACCOUNT` to GitHub secrets.
\[ ] **Uncomment** the `firebase deploy --only hosting,functions` step in the workflow.
\[ ] Confirm green pipeline and first live deploy to Firebase Hosting.

\[ ] **Feature 5 – Logging Infrastructure**
\[ ] Create `logs` collection (eventType, uid, timestamp, payload).
\[ ] Add helper util to write log events application-wide.
\[ ] Set TTL rule to purge logs older than 30 days.

---

### Phase 3 — Interface Layer

*User-facing components; depends on Phase 1 & 2.*

\[ ] **Feature 1 – Global Layout & Navigation**
\[ ] Build a responsive header with logo and nav links.
\[ ] Implement protected-route logic redirecting unauthenticated users to `/login`.
\[ ] Ensure layout adapts gracefully down to 320 px width.

\[ ] **Feature 2 – Editor Page Skeleton**
\[ ] Add `/editor` route and mount a basic Lexical editor.
\[ ] Style editor container with Grammarly-like whitespace and fonts.
\[ ] Add placeholder panel for future suggestion hover cards.

\[ ] **Feature 3 – Document Dashboard UI**
\[ ] List user documents with title & updatedAt.
\[ ] Implement create, open, rename, delete actions (Firestore).
\[ ] Ensure keyboard navigation and screen-reader friendliness.

\[ ] **Feature 4 – Accessibility & Base Styling**
\[ ] Run axe-core audit; resolve WCAG 2.2 AA issues.
\[ ] Apply Tailwind theme with Grammarly-inspired green palette.
\[ ] Provide focus rings and aria-labels for every control.

---

### Phase 4 — Implementation Layer

*Core application functionality; depends on Phase 1 + 2 + 3.*

\[ ] **Feature 1 – Grammar & Style Cloud Function**
\[ ] Write Cloud Function: receive text → call GPT-4o → return suggestions.
\[ ] Add Firestore hash-based cache to avoid duplicate OpenAI calls.
\[ ] Enforce 100-prompt/month per user limit.
\[ ] **Set `OPENAI_API_KEY` via** `firebase functions:config:set openai.key="YOUR_KEY"` and load it in the function.

\[ ] **Feature 2 – Editor Suggestions Integration**
\[ ] Send text to Cloud Function after 1-second idle debounce.
\[ ] Render underlines; show hover cards with Accept / Dismiss.
\[ ] Update Firestore document when a suggestion is accepted.

\[ ] **Feature 3 – Autosave & Live Stats**
\[ ] Autosave content to Firestore 1 s after last keystroke.
\[ ] Display live word-count in the toolbar.
\[ ] Compute and display Flesch-Kincaid grade beside word-count.

\[ ] **Feature 4 – Performance Monitoring & Guardrails**
\[ ] Log suggestion round-trip latency to `logs`.
\[ ] Surface Firestore quota and GPT-4o token usage on an admin page.
\[ ] Show user-friendly error if Cloud Function fails or rate limit is hit.

---

### Status Key

`[ ]` Not Started  `[~]` In Progress  `[X]` Completed  `[!]` Blocked

*Every sub-feature is independent, testable in isolation, and safe to roll back without breaking other functionality.*

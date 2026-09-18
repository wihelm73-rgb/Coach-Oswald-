# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Coach Oswald — a React + Vite single-page app for a personal-training coach: exercise library,
programs, tests, agenda, billing, etc. No backend; all data persists in `localStorage`. Theme
colors: Or `#D4AF37`, Orange `#FF6B35`, Cuivre `#B87333` (thème sombre).

## Commands

- `npm run dev` — dev server at http://localhost:5173 (auto-opens)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

No test suite and no linter are configured.

## Architecture

**Routing**: there is no router. [App.jsx](src/App.jsx) holds `activePage` in `useState` and
`renderPage()` switches over it to mount one page component. Sidebar menu items
([Sidebar.jsx](src/components/Sidebar.jsx)) call `setActivePage` with the same string ids used in
the switch. To add a new section: add a menu item id/label/icon in `Sidebar.jsx`, add the matching
`case` + title in `App.jsx`, and create the page component in `src/pages/`. A page with no content
yet can render [ComingSoon.jsx](src/components/ComingSoon.jsx) as a placeholder.

Some cross-page navigation is done via lifted state rather than the router param, e.g.
`goToAudit(protocolId)` in `App.jsx` sets `preselectedProtocol` and switches to `audit` — follow
this pattern (a small piece of state in `App.jsx` passed down as a prop) for any other
page-to-page handoff.

**Persistence & inter-module data flow**: every page owns one `localStorage` key, prefixed
`oswald_` (e.g. `oswald_dashboard`, `oswald_sessions`, `oswald_rdv`, `oswald_billing`,
`oswald_audit`, `oswald_tests`, `oswald_programs`, `oswald_profile`). Pages read/write their own key with a local
`loadLS`/`saveLS` helper pair (see [DashboardPage.jsx](src/pages/DashboardPage.jsx)):

```js
const loadLS = (k, f) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch { return f; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
```

There is no shared state/store — a page that needs another module's data (e.g. `DashboardPage`
aggregating `oswald_sessions`, `oswald_rdv`, `oswald_billing` for its KPIs) just reads that other
key directly and treats it read-only. When adding a new key or changing an existing key's shape,
check every page that reads it (`grep` for the key name) so aggregation doesn't silently break.

**Exercise data**: [src/data/exercises.json](src/data/exercises.json) is a static referential
(13 `muscleGroups`, ~110 `exercises`) consumed by `ExercisesPage`/`ProgramsPage`. Each exercise has
`primaryMuscle`, a `muscles` array, `category`, `type` (`reps`/etc.), default sets/reps, equipment
and difficulty — keep new entries consistent with this shape.

**Tutos vidéo**: same static-referential pattern —
[src/data/tutos.json](src/data/tutos.json) (`id`, `title`, `description`, `publishedAt`, `file`)
consumed by [TutosPage.jsx](src/pages/TutosPage.jsx), sorted by `publishedAt` descending. Video
files live in `public/tutos/` (served as-is by Vite, not imported/hashed) — added via the
`/ajouter-tuto` slash command rather than by hand.

**Auth (stub)**: [useAuth.js](src/lib/useAuth.js) fakes a session in `localStorage` (`oswald_auth`)
— `login()` accepts any non-empty email/password, no real check yet. Pages listed in
[protectedPages.js](src/constants/protectedPages.js) render
[AuthGate.jsx](src/components/AuthGate.jsx) instead of their real content when logged out; keep
that list in sync when adding a page that should require login. Purely local — no backend, no
plan to add one; keep the same `{ user, isLoggedIn, login, logout }` shape if this ever changes.

## Commandes Claude Code personnalisées

Voir `.claude/commands/` (versionné avec ce dépôt — Claude Code doit être lancé avec cette racine
comme répertoire courant pour les charger) : `/tester`, `/modifier-texte`, `/publier`, `/deployer`,
`/ajouter-tuto`, `/maj-budget`, `/maintenance`. Détails d'usage dans [DEPLOYMENT.md](DEPLOYMENT.md).

## Working rules for this repo

- **Budget tracking (mandatory)**: at the end of every work session, update
  [BUDGET_TRACKING.md](BUDGET_TRACKING.md) — add a dated `Session N — AAAA-MM-JJ` section (date,
  duration, estimated tokens, costs, "Ce qui a été réalisé"), update the cumulative summary and the
  "Dernière mise à jour" footer. Token/cost figures are estimates — say so.
- Do not name the AI model used in files or output; stay generic about API costs.

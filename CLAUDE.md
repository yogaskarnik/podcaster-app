# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is two separate npm projects (root = frontend, `backend/` = backend) that must be run together.

```bash
# Install
npm install                  # frontend deps (root)
cd backend && npm install    # backend deps

# Run (two terminals — backend must be running first)
cd backend && npm run dev    # backend on :4000, nodemon auto-reload
npm start                    # frontend on :3000, CRA dev server

# Test
npm test                             # all frontend tests, watch mode (react-scripts/Jest)
npm test -- --watchAll=false         # single run (e.g. for CI)
npm test -- SearchBar                # run a single test file by name pattern

# Build
npm run build                # production build to /build
```

The backend has no test script (`backend/package.json` `test` is a stub) and no lint script exists in either package — don't invent calls to either.

The frontend dev server proxies unmatched requests to the backend via the `proxy` field in root `package.json` (`http://localhost:4000`), so frontend code calls relative paths like `/api/podcasts` (see `src/services/podcastService.js`), not absolute URLs.

## Environment

Backend requires a `backend/.env` (gitignored) with iTunes API URL fragments it concatenates itself — see `QUICKSTART.md` for the exact variable list (`REACT_APP_PODCAST_BASE_URL`, `REACT_APP_PODCAST`, `REACT_APP_PODCAST_DETAIL`, `REACT_APP_PODCAST_LIMIT`, `REACT_APP_PODCAST_GENRE`, `REACT_APP_PODCAST_MEDIA`, `REACT_APP_PODCAST_ENTITY`, `REACT_APP_PODCAST_OUTPUT`). Despite the `REACT_APP_` prefix (a CRA convention for client-exposed vars), these are read by the **backend** (`backend/controllers/podcasts.js`) via `dotenv`, not by the React app — don't move them into frontend `.env` or assume CRA injects them.

## Architecture

Full-stack app: Express backend proxies/aggregates the iTunes Search API; React frontend consumes only the backend's `/api/podcasts` routes, never iTunes directly.

- `backend/app.js` — Express app, mounts `podcastsRouter` at `/api/podcasts`, CORS + JSON middleware.
- `backend/controllers/podcasts.js` — the entire backend API surface: `GET /` (list/search, builds the iTunes lookup URL from the env fragments) and `GET /:id` (podcast detail + episodes, entity switches to `podcastEpisode`).
- `src/services/podcastService.js` — sole HTTP client for the frontend; wraps axios with an in-memory `Map` cache keyed by `${fn}_${JSON.stringify(params)}` and a TTL from `src/config/index.js` (5 min dev / 30 min prod / disabled in test). Call `podcastService.clearCache()` if a test or feature needs to bypass this.
- `src/config/index.js` — environment-keyed config object selected by `NODE_ENV` (not `.env`-driven); add new tunables here rather than reading `process.env` ad hoc in components.

**State management is React Context, not Redux**, despite `@reduxjs/toolkit`/`react-redux` being listed in root `package.json` dependencies — there is no store, slice, or `<Provider>` anywhere in `src/`. Treat those two packages as unused/vestigial rather than as the state pattern to follow.

- `src/contexts/AuthContext.js` — mock auth only (no backend call): accepts any non-empty email/password, persists the fabricated user to `localStorage`. Do not add real credential validation here without the user asking for it explicitly.
- `src/contexts/PlaylistContext.js` — depends on `AuthContext` (`useAuth`) and persists playlists to `localStorage` under a fixed key, cleared on logout. Consumes/produces raw iTunes episode shapes (keyed by `trackId`), not a normalized schema.

Similarly, `mongoose` is a `backend/package.json` dependency but there is no schema, model, or DB connection anywhere in `backend/` — all data is fetched live from iTunes per-request, nothing is persisted server-side.

Routing (`src/App.js`) is flat and lazy-loaded per top-level route via `React.lazy`/`Suspense`:
- `/` → `MainView`, `/podcast/:podcastId` → `PodcastDetail`, `/podcast/:podcastId/episode/:episodeId` → `EpisodeDetail`, `/playlists` → `PlaylistsView`.

**iTunes response shape is inconsistent between endpoints** and components defensively branch on both shapes — see the `getPodcast*` helpers in `src/components/MainView.js` which fall back between `trackId`/`artworkUrl100`/etc. (Search API) and `id.attributes['im:id']`/`im:image`/etc. (lookup/RSS-style feed API). Preserve this dual-shape handling pattern when touching components that render iTunes data rather than assuming one consistent shape.

Progress tracking (`src/hooks/useEpisodeProgress.js`) is per-episode `localStorage`, independent of playlists/auth — a episode is "completed" at ≥95% progress, not 100%.

## Repo conventions

- `.gitignore` excludes all `*.md` except `README.md` (see `!README.md`; `CLAUDE.md` is explicitly excepted too). `ARCHITECTURE.md`, `DEVELOPMENT.md`, `API.md`, `QUICKSTART.md`, `ROADMAP.md` exist on disk but are **not tracked in git** and may drift from the actual code (e.g. they describe a Redux store and a `src/store/`/`src/utils/`/`src/styles/` layout that don't exist). Prefer reading the actual source over trusting those docs; this file reflects the real, current architecture.
- Components are functional with hooks throughout; no class components except `ErrorBoundary` (required by React for error boundary semantics).
- Tests live beside their subject in `__tests__/` folders (`src/components/__tests__/`, `src/hooks/__tests__/`), using Jest + React Testing Library.

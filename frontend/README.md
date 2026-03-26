# Quiz Maker (React)

Take-home app: build coding quizzes (multiple choice + short answer), share by quiz ID, take attempts, and view scores with optional session signals (tab focus/blur and paste events).

## Requirements

- **Node.js** `>=20.19` (see [`.nvmrc`](.nvmrc); Vite 8 and TanStack Router require it)
- **Backend** running locally (default `http://localhost:4000`) with `Authorization: Bearer dev-token` (or your token)

## Setup

```bash
npm install
cp .env.example .env   # optional; defaults match the sample backend
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run routes:generate` | Regenerate [`src/routeTree.gen.ts`](src/routeTree.gen.ts) after changing files under `src/routes/` |

After adding or renaming route files, run `npm run routes:generate` (or let `vite` / `vite build` run with the TanStack Router plugin, which updates the tree on build).

## Run locally

1. From the monorepo root, start the API: `cd ../backend && npm run dev` (port `4000` by default).
2. In this folder (`frontend/`):

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Architecture (short)

- **Vite 8**, **React 19**, **TypeScript**
- **TanStack Query v5** for server state (quizzes, questions, attempts)
- **TanStack Router** (file routes under `src/routes/`, generated `routeTree.gen.ts`)
- **Tailwind CSS v4** + lightweight UI primitives (Radix-based components, **Sonner** toasts)
- **API**: `src/api/client.ts` sends `Authorization: Bearer <VITE_API_TOKEN>` on every request

### Architecture decisions & trade-offs

- **TanStack Router over React Router**: Provides type-safe routing with file-based conventions and first-class search param validation. Slightly higher setup cost (route tree code-gen), but catches broken links and invalid params at compile time.
- **TanStack Query for all server state**: Every API call goes through query/mutation hooks (`src/hooks/`). This gives automatic caching, background refetching, and consistent loading/error states without manual state management.
- **Session persistence for attempt state**: The API has no `GET /attempts/:id` endpoint, so the quiz snapshot (questions, attempt metadata) received from `POST /attempts` is stored in `sessionStorage`. Without this, a page refresh mid-quiz would lose all context and break the player.
- **Session persistence for results**: `POST /attempts/:id/submit` returns the score once — there is no `GET` for results. The app mirrors the submit response in `sessionStorage` so refreshing the results page still shows the score breakdown.
- **Auto-publish on quiz creation**: Newly created quizzes are published immediately so the author can share the quiz ID and participants can take it right away, without a separate "publish" step.
- **Code snippet as a minor backend tweak**: The spec lists "optional code snippet (display only)" per question, but the provided schema had no column for it. Added a nullable `code_snippet TEXT` column with an `ALTER TABLE` migration for existing databases — a small, backwards-compatible change.
- **Anti-cheat with native browser events**: Uses `window` blur/focus and input `paste` listeners directly rather than pulling in a library. The scope is intentionally minimal — just what the spec asks for — and avoids adding dependencies for three event handlers.

## Anti-cheat (bonus)

Hook: [`src/hooks/use-anti-cheat.ts`](src/hooks/use-anti-cheat.ts), wired from [`src/routes/play.$attemptId.tsx`](src/routes/play.$attemptId.tsx).

- **Signals**: `window` **`blur`** / **`focus`** → **`tab-blur`** / **`tab-focus`**; answer-field **`paste`** → **`text-pasted`**. The **Session signals** summary counts tab switches as **`tab-blur`** events only (not focus).
- **Logged (server)**: Each signal is sent as **`POST /attempts/:attemptId/events`** with body `{ "event": "<name>" }` — [`recordEvent`](src/api/attempts.ts).
- **Shown (UI)**: After submit, [`src/routes/results.$attemptId.tsx`](src/routes/results.$attemptId.tsx) shows [`AntiCheatSummary`](src/components/results/anti-cheat-summary.tsx) (“Session signals”): counts plus a **timestamp + event name** list. The same data is persisted with the graded result in **`sessionStorage`** ([`src/lib/session.ts`](src/lib/session.ts)) so the results view survives refresh.

## License

Private / assessment use.

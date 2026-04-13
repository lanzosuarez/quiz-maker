# Quiz Maker

Monorepo for the take-home: **backend** (Node.js + SQLite API) and **frontend** (React + Vite).

## Layout

```
quiz-maker/
  backend/    # API — port 4000 by default
  frontend/   # SPA — Vite dev server (usually 5173)
```

## Prerequisites

- **Node.js** **20.19+** for both apps

## Run locally

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Leave this running. The API should be at `http://localhost:4000` with `Authorization: Bearer dev-token` (unless you changed `API_TOKEN` in `.env`).

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open the URL shown (typically `http://localhost:5173`). The sample `.env` points the app at `http://localhost:4000` with token `dev-token` so it matches the backend defaults.

## More detail

- **Backend**: see `[backend/README.md](backend/README.md)`
- **Frontend**: see `[frontend/README.md](frontend/README.md)`


# money-saver (Vue 3 + TypeScript + Vite)

## Running locally

**Docker (recommended):**
```bash
docker compose up -d    # start Vite dev server at http://localhost:5173
docker compose down     # stop
```

The dev server proxies `/api/*` requests to `http://host.docker.internal:8080` (your local backend). Override with `BACKEND_URL=http://... docker compose up -d`.

**Without Docker:**
```bash
npm install
npm run dev     # http://localhost:5173
```

## Other commands

```bash
npm run build   # type-check + production bundle
npm run preview # preview the production build
```

## Production (nginx)

```bash
docker compose --profile prod up --build
```

Serves the built bundle via nginx on port 80 and proxies `/api` to `http://backend:8080`.

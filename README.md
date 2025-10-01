# Nium Intelligence Demo

This repository seeds a demo environment that mirrors the proposed Nium knowledge platform. It ships with:

- **Next.js web app (`apps/web`)** for showcasing the pipeline, seed URLs, and integration placeholders.
- **FastAPI backend (`services/api`)** exposing demo endpoints for documents, integrations, and draft bug fixes.
- **Data slot (`data/`)** where the Nium crawl CSV can be mounted for local exploration.

> ?? All integrations are mocked. The goal is to iterate on UX and scaffolding before connecting to production APIs.

## Getting Started

1. Copy the crawl data into the repository:

   ```powershell
   Copy-Item "C:\\Users\\ibrahim.apena\\Downloads\\nium_all_urls_exhaustive.csv" \
     "data/nium_all_urls_exhaustive.csv"
   ```

2. Install dependencies:

   ```bash
   npm install
   pnpm install # optional alternative
   ```

   > Use Node 18+ (Next.js 14 requirement). The repo is configured as an npm workspace; `npm install` at the root will install the web app packages.

3. Run the Next.js demo locally:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000` to preview the UI featuring the hero section, pipeline blueprint, seed URL table, and integration cards.

4. (Optional) Start the FastAPI backend in another terminal:

   ```bash
   cd services/api
   uvicorn nium_api_demo.main:app --reload
   ```

   - `GET /documents?limit=50` returns the first URLs from the CSV.
   - `GET /integrations/jira` (or `slack`, `confluence`, etc.) returns placeholder payloads ready to be replaced with real connectors.
   - `POST /bugs/draft-fix` accepts a JSON payload and responds with a mock branch + summary.

## Vercel Deployment

1. Create a new Vercel project and import this repository.
2. Set the framework preset to **Next.js**; the build command can stay `npm run build`, output `.next`.
3. Add an environment variable (optional):

   - `NIUM_CSV_PATH=/var/task/data/nium_all_urls_exhaustive.csv` if you upload the CSV as a build asset.

4. Optional API Deployment: deploy `services/api` to Vercel Functions or another host (Render/Fly). For Vercel, wrap FastAPI with `asgiref.wsgi.WsgiToAsgi` or use `vercel-python` runtime.

5. Configure preview deployments so every branch generates a Vercel preview link you can share internally.

## Next Steps

- Expand the crawler into a dedicated service that syncs the CSV from the live scrape pipeline.
- Enhance the UI with chat-driven retrieval once the RAG gateway is available.
- Replace placeholder integration responses with authenticated connectors once credentials and scopes are approved.
- Add CI/CD workflows (GitHub Actions) to lint, test, and deploy both the frontend and API.

## Repository Layout

```
.
+- apps/
¦  +- web/            # Next.js demo frontend
+- services/
¦  +- api/            # FastAPI placeholder backend
+- data/              # Mount crawl outputs here (ignored by git)
+- README.md
```
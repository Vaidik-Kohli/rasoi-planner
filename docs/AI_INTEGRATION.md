# AI Integration Setup

This repo uses Vite + React + TypeScript. The AI server is placed under `server/` to keep your API key off the client.

## 1) Configure the AI server
1. Copy `server/.env.example` to `server/.env` and set `OPENAI_API_KEY`.
2. Install server deps:
   ```bash
   cd server
   npm i
   ```
3. Run the server in dev:
   ```bash
   npm run dev
   # listens on http://localhost:8787
   ```

## 2) Configure the client
- `vite.config.ts` is set to proxy `/api` to `http://localhost:8787` during development.
- New files added:
  - `src/types/meal-plan.ts`
  - `src/lib/ai.ts`
  - `src/components/AIPlanner.tsx`

To use the planner UI, import and render the component (e.g., inside `src/App.tsx`):
```tsx
import AIPlanner from './components/AIPlanner'
export default function App() {
  return <AIPlanner />
}
```

Run the client:
```bash
npm run dev
# open http://localhost:5173
```

## Production notes
- Host `server/` as a small Node service and point the web app to it (set the base URL instead of relying on Vite dev proxy).
- Keep `OPENAI_API_KEY` only on the server; never expose it to the browser.
- The server enforces JSON schema validation to maintain consistent, high-quality plans and reduce hallucinations.
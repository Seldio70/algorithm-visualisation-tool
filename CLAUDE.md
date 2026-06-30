# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repository.

## Project overview

AlgoVisualisation is a client-only React SPA that visualises 20 algorithms step-by-step. It has two sections:

- **Learn** (`/learn/:algorithmId`) — general algorithm catalogue (sorting, searching, graph, tree, recursion).
- **42 Tirana** (`/42/:algorithmId`) — `libft`-style exercises (`ft_split`, `ft_atoi`, etc.) for the 42 Tirana curriculum.

Both sections share the same workspace UI (`AlgorithmWorkspace` in `src/pages/LearnPage.tsx`) and the same algorithm data model — only the routing base path and sidebar list differ (`src/pages/FortyTwoPage.tsx` reuses `AlgorithmWorkspace` with `forceAccent="violet"`).

There is **no backend** — this is a pure static SPA (Vite build, deployed as a static site). Any persistence is `localStorage`.

## Stack

- React 19, TypeScript ~6.0, Vite 8
- React Router 7 (`react-router-dom`) for routing
- Tailwind CSS v4 (`@tailwindcss/vite`) — utility classes must be full literal strings (no dynamic class-name construction; the build-time scanner can't see them)
- Framer Motion for animation (`motion.div`/`motion.span`, `AnimatePresence`)
- Vitest + Testing Library for unit/component tests; Playwright for e2e (`npm run test:e2e`)

## Commands

```
npm run dev        # start Vite dev server
npm run build       # tsc -b && vite build
npm run lint        # eslint .
npm test            # vitest run
npm run test:watch  # vitest watch mode
npm run test:e2e    # playwright
npm run check       # lint + test + build
```

## Architecture

### Algorithm data model

Each algorithm is an `AlgorithmDefinition` (`src/types/index.ts`):
```ts
interface AlgorithmDefinition {
  meta: AlgorithmMeta;   // id, name, category, difficulty, complexity, description, code, legend, accent, ...
  generateSteps: (input: number[]) => Step[];
}
```
`meta.id` (e.g. `"bubble-sort"`, `"ft-split"`) is the canonical per-algorithm key used everywhere data needs to be looked up or namespaced: `IMPLEMENTATIONS`/`EXPLANATIONS` (`src/data/`), routing, and the notes feature's localStorage keys.

Algorithms are registered in `src/algorithms/` and exposed via `mainAlgorithms` / `algorithmMap` (Learn) and the 42 Tirana equivalents.

### Workspace UI

`AlgorithmWorkspace` (`src/pages/LearnPage.tsx`) renders the per-algorithm page and owns a `view` tab state (`"visualizer" | "about" | "notes"`), rendered via a `role="tablist"` button row plus a conditional panel per tab. The component is mounted with `key={algo.meta.id}`, so it fully remounts on algorithm change — this is what keeps all per-algorithm hook state (including notes) cleanly isolated without manual reset logic.

- `view === "visualizer"` — the step-by-step animation (`Visualizer`), `StepExplanation`, `Controls`, code/variables/call-stack panels.
- `view === "about"` — description, complexity cards, and `LanguagePanel` (Pseudocode/Java/C/Python tabs with "How it works" bullets, sourced from `src/data/implementations.ts` and `src/data/explanations.ts`, keyed by `meta.id`).
- `view === "notes"` — the per-algorithm `Notepad` (see below).

### Styling conventions

Reuse the existing glassmorphism utility classes from `src/index.css` rather than inventing new ones: `.glass-panel`, `.glass-card`, `.glass-control`, `.glass-field`, `.glass-sidebar`, `.glass-subtle`, `.themed-scrollbar` (+ `-cyan`/`-violet` variants).

Dual accent theming: `ThemeAccent = "cyan" | "violet"`, resolved via the `ACCENT` record in `src/constants/theme.ts` and threaded through components as an `accent?: ThemeAccent` prop defaulting to `"cyan"`. Learn pages default to cyan (or an algorithm-specific accent); 42 Tirana pages force violet.

### Persistence convention

No backend exists, so all persistence is `localStorage`, namespaced `"algoviz-<purpose>[-v1]"`, always wrapped in try/catch with a silent fallback (storage may be unavailable in some environments). Existing examples: `LAST_LEARN_KEY`, `PLAYBACK_SPEED_KEY`, `useEmailCapture`'s `STORAGE_KEY`. Follow this pattern for any new persisted state.

## Notes feature (per-algorithm notepad)

A digital notepad lets users jot study notes while working through an algorithm, isolated per algorithm and autosaved.

- **`src/hooks/useNotes.ts`** — persistence hook. One `localStorage` key per algorithm: `algoviz-notes-${algorithmId}-v1`. Edits are debounced (600ms) to autosave; any pending edit is flushed synchronously on unmount (tab switch away from "Notes", or navigating to a different algorithm, which remounts `AlgorithmWorkspace`) so nothing is lost. Exposes `{ content, update, saveNow, status, savedAt }`.
- **`src/components/Notepad.tsx`** — reusable notebook-styled editor: ruled-paper background + margin rule (CSS gradients, accent-colored), serif font, a `Save` button, and an animated save-status indicator (`Saving…` / `Saved Ns ago` / error state). Manual save also available via blur or Ctrl/Cmd+S.
- Wired into `AlgorithmWorkspace` as the third `"notes"` tab, rendering `<Notepad algorithmId={meta.id} algorithmName={meta.name} accent={accent} />`.

Because each algorithm gets its own storage key and `AlgorithmWorkspace` remounts per `meta.id`, notes are reliably isolated — switching algorithms or tabs can never bleed one algorithm's notes into another's.

## Things to watch out for

- Don't introduce dynamic Tailwind class strings (e.g. `` `bg-${color}-500` ``) — they won't be picked up by the build; use a lookup record instead (see `ACCENT`, `DIFFICULTY_COLOR`).
- Don't write to a ref during render (flagged by `eslint-plugin-react-hooks`) — update refs inside effects/event handlers/callbacks only.
- When adding new persisted state, follow the existing `algoviz-<purpose>-v1` key convention and wrap storage access in try/catch.
- When running Playwright verification scripts ad hoc, run them from the project root (not from a temp directory) so ESM module resolution can find `node_modules/playwright`.

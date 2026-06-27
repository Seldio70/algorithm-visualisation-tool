# AlgoVisualisation

An interactive web app for learning algorithms step by step. Pick an algorithm, press play, and watch the data structure update on each line of code — with explanations, variable panels, and color-coded visuals.

Built with React, TypeScript, Vite, and Tailwind CSS. Deployed as a single-page app on Vercel.

---

## What the app does

AlgoVisualisation is an **algorithm learning workspace**, not a generic code runner. Each algorithm is a self-contained module that **pre-generates a sequence of steps**. The UI walks through those steps so you can see *what* the algorithm is doing and *why* at each moment.

### Core experience

1. **Choose an algorithm** from the sidebar (sorting, searching, graphs, trees, and more).
2. **Step through the run** with play/pause, next/previous, or keyboard shortcuts.
3. **Watch the visualization update** — arrays swap, graph nodes get visited, trees grow, grids flood-fill, etc.
4. **Read the explanation** for the current step in plain language.
5. **Follow the code** — the relevant lines are highlighted in the code panel.
6. **Inspect state** — a variables panel shows values like distances, pointers, and loop counters.

Nothing runs on a backend. All steps are computed in the browser when you open an algorithm.

### Pages & routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page with a short intro and link into the app |
| `/learn` | Main learning workspace (redirects to the first algorithm) |
| `/learn/:algorithmId` | Workspace for a specific main algorithm |
| `/42` | Hub for the **42 Tirana** curriculum section |
| `/42/:algorithmId` | Workspace for a 42-specific algorithm |

The **Learn** section and **42 Tirana** section share the same workspace layout but use different algorithm lists and accent colors (cyan vs violet).

### Visualization types

Algorithms render with the layout that fits their data structure:

| Layout | Used for | Examples |
|--------|----------|----------|
| **Array / linear** | Sorting, searching, two pointers | Bubble Sort, Binary Search |
| **Graph (SVG)** | BFS, DFS, weighted shortest path | BFS, DFS, Dijkstra |
| **Tree (SVG)** | BST and traversals | BST Insert, In/Pre/Post-order |
| **Grid** | 2D pathfinding and flood fill | Flood Fill, BFS Maze |
| **Linked list** | Pointer-based structures | Linked List (42) |
| **Stack** | LIFO operations | Stack & Queue (42) |
| **Memory blocks** | Allocation visualizations | Memory Blocks (42) |

Graph and tree visualizers use SVG with node states (current, visited, path, highlight) and optional edge weights. Dijkstra highlights **only the reconstructed shortest path** to the target node, with numbered step labels on path nodes.

### Algorithms included

**Main curriculum (`/learn`) — 14 algorithms**

| Category | Algorithms |
|----------|------------|
| Sorting | Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort |
| Searching | Linear Search, Binary Search |
| Graph | BFS, DFS, Dijkstra's Algorithm |
| Tree | Tree Traversal, BST Insert |
| Classic | Fibonacci, Two Pointers |

**42 Tirana section (`/42`) — 7 algorithms**

Linked List, Stack & Queue, Merge Sort, Quick Sort, Flood Fill, BFS Maze, Memory Blocks

---

## Prerequisites

- **Node.js 18+** (20 LTS recommended)
- **npm** (comes with Node)

Check your versions:

```bash
node -v
npm -v
```

---

## Getting the app running locally

### 1. Clone the repository

```bash
git clone https://github.com/Seldio70/algorithm-visualisation-tool.git
cd algorithm-visualisation-tool
```

If you already have the repo locally, just open a terminal in the project folder.

### 2. Install dependencies

```bash
npm install
```

This installs React, Vite, Tailwind CSS, Framer Motion, React Router, and TypeScript tooling.

### 3. Start the development server

```bash
npm run dev
```

Vite prints a local URL (usually **http://localhost:5173**). Open it in your browser.

The dev server supports hot module replacement — edits to source files reload automatically.

### 4. Build for production (optional)

```bash
npm run build
```

Compiles TypeScript and outputs static files to `dist/`.

### 5. Preview the production build locally (optional)

```bash
npm run preview
```

Serves the `dist/` folder so you can test the production build before deploying.

### 6. Lint (optional)

```bash
npm run lint
```

---

## Deploying

The app is configured for **Vercel** as a static SPA. `vercel.json` rewrites all routes to `index.html` so client-side routing works.

Typical flow:

1. Push your branch to GitHub.
2. Connect the repo in Vercel (or let an existing project auto-deploy).
3. Vercel runs `npm run build` and serves `dist/`.

No environment variables are required for basic local or production use.

---

## How it works (architecture)

```
Algorithm module (e.g. dijkstra.ts)
        │
        ▼
  generateSteps(input)  →  Step[]  (elements, edges, explanation, highlighted code lines, variables)
        │
        ▼
  useAlgorithm hook     →  current step index, play/pause, speed, keyboard controls
        │
        ▼
  LearnPage workspace   →  Visualizer + CodePanel + StepExplanation + Controls
        │
        ▼
  Visualizer router     →  Array / Graph / Tree / Grid / … visualizer based on layout
```

Each algorithm exports an `AlgorithmDefinition`:

- **`meta`** — name, category, difficulty, complexity, pseudocode, default input, visualizer layout
- **`generateSteps(input)`** — returns the full animation as an array of `Step` objects

Each `Step` can include:

- `elements` — nodes/cells/values with a visual state (`current`, `visited`, `sorted`, `path`, …)
- `edges` — graph edges with optional weights and states
- `pointers` — named markers (e.g. `left`, `right`, `head`)
- `highlightedLines` — which lines to highlight in the code panel
- `explanation` — human-readable text for that step
- `variables` — key/value snapshot for the variables panel

Adding a new algorithm means creating a file under `src/algorithms/`, implementing `generateSteps`, and registering it in `src/algorithms/index.ts`.

---

## Keyboard shortcuts

While focused on the workspace (not typing in an input):

| Key | Action |
|-----|--------|
| **Space** | Play / pause (restarts from step 0 if at the end) |
| **→** | Next step |
| **←** | Previous step |
| **R** | Reset to step 0 |

---

## Project structure

```
src/
├── algorithms/          # One file per algorithm + shared graph config
│   ├── index.ts         # Registry: mainAlgorithms, fortyTwoAlgorithms
│   ├── helpers.ts       # Shared step utilities
│   ├── graphConfig.ts   # Graph layouts for BFS / DFS / Dijkstra
│   └── fortyTwo/        # 42 Tirana–specific algorithms
├── components/
│   ├── visualizers/     # Array, Graph, Tree, Grid, … renderers
│   ├── Controls.tsx     # Play, step, speed, reset
│   ├── CodePanel.tsx    # Pseudocode with line highlighting
│   ├── Visualizer.tsx   # Routes step data to the right visualizer
│   └── …
├── hooks/
│   └── useAlgorithm.ts  # Step playback and keyboard handling
├── pages/
│   ├── LandingPage.tsx
│   ├── LearnPage.tsx    # Main workspace
│   └── FortyTwoPage.tsx
├── types/               # Step, AlgorithmDefinition, layouts
└── utils/               # e.g. tree layout helpers
```

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** — dev server and bundler
- **Tailwind CSS v4** — styling (`@tailwindcss/vite`)
- **React Router v7** — client-side routes
- **Framer Motion** — landing page and UI motion

---

## License

Private project — see repository owner for usage terms.

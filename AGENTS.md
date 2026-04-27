# AGENTS.md — Mimisbrunnr Coding Agent Context

> This file provides the Coding Agent with full project context for Mimisbrunnr.
> All code generation, modification, and review must treat this document as the primary source of truth.
> This context can be deprecated or not true. it should be verified in session.

---

## 1. Project Identity

**Name:** Mimisbrunnr (Well of Mimir)
**Category:** AI-native local PKMS (Personal Knowledge Management System) + Writing Tool
**Philosophy:** A cognitive augmentation tool that transforms information into knowledge, and knowledge into production
**Competing Products:** Obsidian (file structure reference), Notion (editor experience reference)
**Key Differentiator:** AI is not a plugin — it is embedded in the core architecture from the ground up

---

## 2. Canonical Tech Stack

Any library not listed below requires explicit justification and approval before being introduced.

### Desktop Framework
- **Tauri v2** — Rust-based cross-platform desktop framework
  - Chosen over Electron for: smaller bundle size, lower memory footprint, stronger security model
  - Rust code is scoped exclusively to native concerns: file I/O, file watching, system tray

### Frontend
- **React 18** + **TypeScript (strict mode)**
- **Tailwind CSS v4** — utility-first styling
- **TanStack Router** — fully type-safe client-side routing
- **TanStack Query** — async server state management (Tauri invoke calls, AI API calls)
- **CodeMirror 6** — markdown editor core
- **Cytoscape.js** — Knowledge Graph visualization
- **shadcn/ui** — accessible UI component library (built on Radix UI + Tailwind)
- **Radix UI** — headless primitive components (via shadcn/ui)
- **Lucide React** — icon system

### AI / Backend (TypeScript layer)
- **Vercel AI SDK** — unified LLM provider interface
- **sqlite-vec** — local vector embeddings and similarity search
- **better-sqlite3** — local SQLite (metadata and vector storage)

### File System
- All notes are stored as **local `.md` files**
- Vault directory is user-specified
- File access via Tauri's `fs` plugin
- File change detection via `@tauri-apps/plugin-fs` + `@tauri-apps/plugin-watcher`

### Package Manager
- **bun** only — npm, yarn, and pnpm are forbidden

---

## 3. Project Structure

```
mimisbrunnr/
├── src-tauri/                  # Rust (Tauri backend)
│   ├── src/
│   │   ├── main.rs
│   │   ├── commands/           # Tauri IPC commands
│   │   │   ├── fs.rs           # File read/write
│   │   │   └── watcher.rs      # File watching
│   │   └── lib.rs
│   └── Cargo.toml
│
├── src/                        # React frontend
│   ├── app/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── editor/             # CodeMirror editor
│   │   │   ├── Editor.tsx
│   │   │   ├── extensions/     # CM6 extensions
│   │   │   └── toolbar/
│   │   ├── sidebar/            # File explorer, tags
│   │   │   ├── Sidebar.tsx
│   │   │   ├── FileTree.tsx
│   │   │   └── TagPanel.tsx
│   │   ├── graph/              # Knowledge Graph
│   │   │   └── GraphView.tsx
│   │   ├── dashboard/          # Home dashboard
│   │   │   └── Dashboard.tsx
│   │   ├── agent/              # Agent panel UI
│   │   │   ├── AgentPanel.tsx
│   │   │   └── ThoughtLog.tsx
│   │   ├── absorption/         # Clipping card UI
│   │   │   └── AbsorptionCard.tsx
│   │   └── ui/                 # Shared UI primitives
│   │       ├── CommandPalette.tsx
│   │       ├── Button.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── ai/                 # AI pipeline
│   │   │   ├── absorption.ts   # Absorption Engine
│   │   │   ├── production.ts   # Production Engine
│   │   │   └── embedding.ts    # Embedding logic
│   │   ├── vault/              # Vault filesystem logic
│   │   │   ├── index.ts
│   │   │   ├── parser.ts       # MD parsing, frontmatter
│   │   │   └── linker.ts       # Wikilink resolution
│   │   ├── graph/              # Graph data logic
│   │   │   └── builder.ts
│   │   └── db/                 # SQLite connection
│   │       └── index.ts
│   ├── store/                  # Global state (Zustand)
│   │   ├── vaultStore.ts
│   │   ├── editorStore.ts
│   │   └── agentStore.ts
│   ├── hooks/                  # Custom hooks
│   └── types/                  # TypeScript type definitions
│       ├── note.ts
│       ├── graph.ts
│       └── agent.ts
│
├── AGENTS.md                   # This file
├── package.json
├── bun.lock
└── tsconfig.json
```

---

## 4. Core Domain Models

### Note
```typescript
interface Note {
  id: string;               // UUID
  path: string;             // Relative path from vault root
  title: string;            // Filename or frontmatter title
  content: string;          // Raw markdown
  frontmatter: Record<string, unknown>;
  tags: string[];
  links: WikiLink[];        // Parsed [[wikilinks]]
  backlinks: string[];      // Notes referencing this note
  createdAt: Date;
  updatedAt: Date;
  embedding?: number[];     // Vector embedding (optional)
}

interface WikiLink {
  target: string;           // Target note name
  alias?: string;           // Display text (if any)
  resolved: boolean;        // Whether the target file exists
}
```

### GraphNode / GraphEdge
```typescript
interface GraphNode {
  id: string;               // Note ID
  label: string;            // Note title
  weight: number;           // Connection count (drives node size)
  tags: string[];
  cluster?: string;         // AI clustering result
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'explicit' | 'semantic'; // Explicit link vs AI-discovered connection
  weight: number;           // Connection strength
}
```

### AbsorptionItem
```typescript
interface AbsorptionItem {
  id: string;
  sourceUrl?: string;
  rawContent: string;       // Original text
  summary: string;          // AI-generated summary
  suggestedTags: string[];
  suggestedLinks: string[]; // Related note IDs
  status: 'pending' | 'archived' | 'rejected';
  createdAt: Date;
}
```

### AgentTask
```typescript
interface AgentTask {
  id: string;
  type: 'summarize' | 'tag' | 'link' | 'cluster' | 'draft';
  status: 'queued' | 'running' | 'done' | 'failed' | 'waiting_human';
  input: unknown;
  output?: unknown;
  thoughtLog: ThoughtEntry[];
  humanPrompt?: HumanPrompt; // Human-in-the-loop request
}

interface ThoughtEntry {
  timestamp: Date;
  message: string;
  type: 'thinking' | 'action' | 'result' | 'error';
}

interface HumanPrompt {
  question: string;
  options: string[];
  allowCustom: boolean;
}
```

---

## 5. Architecture Principles

### 5-1. Local-First
- Core features (read, write, search) must work without network access
- LLM API calls are scoped to AI features only; failures must degrade gracefully
- All user data lives in local `.md` files and SQLite

### 5-2. File System is the Source of Truth
- SQLite serves as a cache and index — never the primary store
- Any change to a `.md` file must trigger a DB sync
- Editing files directly outside the app must not break consistency

### 5-3. AI Runs Silently in the Background
- AI tasks must never block the UI thread
- All agent work is queue-based and asynchronous
- Completion triggers a quiet toast notification — no forced popups

### 5-4. Human-in-the-Loop
- Low-confidence AI decisions (tagging, link creation, categorization) must request user confirmation
- Rejected suggestions are recorded for personalization
- Agents are forbidden from modifying `.md` files autonomously in MVP

### 5-5. Editor Focus Principle
- When the editor is focused, non-essential UI elements must be minimized
- Notifications and panel transitions must be non-intrusive

---

## 6. Tauri IPC Command Conventions

All Rust ↔ TypeScript communication goes through Tauri's command system.

```typescript
import { invoke } from '@tauri-apps/api/core';

// Read a note
const content = await invoke<string>('read_note', { path: 'notes/example.md' });

// Write a note
await invoke('write_note', { path: 'notes/example.md', content: '# Hello' });

// Scan vault directory
const files = await invoke<string[]>('scan_vault', { vaultPath: '/Users/...' });
```

**Naming conventions:**
- Rust function names: `snake_case`
- Group commands by domain under `commands/` submodules
- Errors returned as `Result<T, String>`; frontend handles with try/catch

---

## 7. State Management

State is split between two layers with a hard boundary. Never mix their responsibilities.

### 7-1. TanStack Query — Async / Server State

Use TanStack Query for anything that involves an async call: Tauri `invoke()`, AI API calls, SQLite reads. It owns loading, error, caching, and refetching logic.

```typescript
// Wrapping a Tauri invoke call with TanStack Query
const { data: notes, isLoading } = useQuery({
  queryKey: ['vault', vaultPath],
  queryFn: () => invoke<Note[]>('scan_vault', { vaultPath }),
});

// Invalidate cache after a file is written
const { mutate: saveNote } = useMutation({
  mutationFn: (note: Note) => invoke('write_note', { path: note.path, content: note.content }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vault'] }),
});

// Invalidate cache when the file watcher detects a change
queryClient.invalidateQueries({ queryKey: ['vault'] });
```

**Use TanStack Query for:**
- Loading the vault file list (`scan_vault`)
- Reading note content (`read_note`)
- Writing / saving notes (`write_note`)
- All AI pipeline calls (summarize, tag, embed)
- SQLite reads (backlinks, embeddings, agent logs)

### 7-2. Zustand — Client / UI State

Use Zustand for synchronous, in-memory state that does not involve async I/O.

```typescript
// Example: store/vaultStore.ts
interface VaultStore {
  vaultPath: string | null;
  activeNoteId: string | null;
  setVaultPath: (path: string) => void;
  setActiveNote: (id: string) => void;
}
```

| Store | Responsibility |
|-------|----------------|
| `vaultStore` | Vault path, active note ID |
| `editorStore` | Editor focus state, cursor position, selection |
| `graphStore` | Graph layout state, selected node |
| `agentStore` | Agent queue, human-in-the-loop prompts |
| `uiStore` | Panel open/close, current view, theme |

### 7-3. Routing — TanStack Router

All navigation is handled by TanStack Router. Route definitions are fully type-safe.

```typescript
// Route structure
const routeTree = rootRoute.addChildren([
  indexRoute,        // /        → Dashboard
  editorRoute,       // /editor/$noteId → Editor View
  graphRoute,        // /graph   → Graph View
]);
```

- Use `useNavigate` and `Link` from TanStack Router exclusively
- Never use `window.location` or manual history manipulation
- Route params (`$noteId`) are fully typed — no casting needed

### 7-4. State Boundary Rules

| Data type | Owner |
|-----------|-------|
| Vault file list | TanStack Query |
| Note content (read/write) | TanStack Query |
| AI task results | TanStack Query |
| Active note ID | Zustand (`vaultStore`) |
| Panel open/close | Zustand (`uiStore`) |
| Current route | TanStack Router |
| Editor cursor | Zustand (`editorStore`) |

React Context API is forbidden for global state. Do not use `useState` for state that needs to be shared across components.

---

## 8. Coding Conventions

### TypeScript
- `strict: true` is required — `any` is forbidden
- All shared types live in the `types/` directory
- Prefer `interface` over `type`; use `type` only for unions and intersections
- Use `async/await` — avoid `.then()` chaining

### React
- Functional components only — class components are forbidden
- Component filenames: `PascalCase.tsx`
- Hook filenames: `useCamelCase.ts`
- Props types declared at the top of each component file

### File and Folder Naming
- Components: `PascalCase`
- Utilities / hooks / stores: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Styling: Tailwind utility classes only — minimize standalone CSS files

### Commit Message Format
```
feat: add wikilink autocomplete to editor
fix: deduplicate file watcher events
refactor: extract note indexing logic from vaultStore
chore: update bun dependencies
```

---

## 9. MVP Implementation Roadmap

The agent follows this sequence strictly. Do not proceed to the next phase until the current phase is stable.

### Phase 1 — Editor Core (Current)
- [ ] Tauri v2 project scaffold
- [ ] Vault directory selection and file list loading
- [ ] CodeMirror 6 markdown editor (basic)
- [ ] File read / write / auto-save
- [ ] Sidebar file tree
- [ ] Wikilink `[[...]]` parsing and click navigation

### Phase 2 — Absorption Engine
- [ ] URL input → web content scraping
- [ ] AI summary generation (Vercel AI SDK)
- [ ] Automatic tagging
- [ ] AbsorptionCard UI
- [ ] Archive to local `.md` file

### Phase 3 — Knowledge Graph
- [ ] Link analysis → graph data construction
- [ ] Cytoscape.js graph view
- [ ] sqlite-vec embedding storage
- [ ] AI semantic connection discovery

### Phase 4 — Production Engine
- [ ] Related note retrieval during writing
- [ ] `/` command AI actions in editor
- [ ] Dashboard — Daily Digest

---

## 10. Environment Variables

`.env` file — included in `.gitignore`, never committed:

```env
OPENAI_API_KEY=           # For Absorption Engine
ANTHROPIC_API_KEY=        # For Production Engine
```

Environment variables must never be exposed directly to the frontend.
All secrets are mediated through Tauri commands from `src-tauri/.env`.

---

## 11. Prohibited Actions

The agent must never do the following:

- Use the `any` type
- Leave `console.log` statements in production code
- Autonomously modify or delete `.md` files without user confirmation
- Hardcode API keys anywhere in source code
- Use `npm`, `yarn`, or `pnpm` (bun only)
- Use Zustand for async/server state — that belongs to TanStack Query
- Use TanStack Query for synchronous UI state — that belongs to Zustand
- Use React Context API for global state
- Use `window.location` or manual history manipulation instead of TanStack Router
- Add libraries outside the canonical stack without approval

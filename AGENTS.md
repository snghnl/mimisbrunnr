# AGENTS.md — Mimisbrunnr Agent Rules

> Behavioral instructions for coding agents working on Mimisbrunnr.
> For domain vocabulary, data models, and architecture overview see `CONTEXT.md`.
> For architectural decisions see `docs/adr/`.

---

## Canonical Tech Stack

Any library not listed below requires explicit justification and approval before being introduced.

### Desktop Framework
- **Tauri v2** — Rust-based cross-platform desktop framework (see ADR-0001)
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
- **bun** only — npm, yarn, and pnpm are forbidden (see ADR-0002)

---

## Tauri IPC Command Conventions

All Rust ↔ TypeScript communication goes through Tauri's command system.

```typescript
import { invoke } from '@tauri-apps/api/core';

const content = await invoke<string>('read_note', { path: 'notes/example.md' });
await invoke('write_note', { path: 'notes/example.md', content: '# Hello' });
const files = await invoke<string[]>('scan_vault', { vaultPath: '/Users/...' });
```

- Rust function names: `snake_case`
- Group commands by domain under `commands/` submodules
- Errors returned as `Result<T, String>`; frontend handles with try/catch

---

## State Management

State is split between two layers with a hard boundary. Never mix their responsibilities.

### TanStack Query — Async / Server State

Use for anything that involves an async call: Tauri `invoke()`, AI API calls, SQLite reads.

```typescript
const { data: notes, isLoading } = useQuery({
  queryKey: ['vault', vaultPath],
  queryFn: () => invoke<Note[]>('scan_vault', { vaultPath }),
});

const { mutate: saveNote } = useMutation({
  mutationFn: (note: Note) => invoke('write_note', { path: note.path, content: note.content }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vault'] }),
});
```

Use TanStack Query for: vault file list, note content, all AI pipeline calls, SQLite reads.

### Zustand — Client / UI State

Use for synchronous, in-memory state that does not involve async I/O.

| Store | Responsibility |
|-------|----------------|
| `vaultStore` | Vault path, active note ID |
| `editorStore` | Editor focus state, cursor position, selection |
| `graphStore` | Graph layout state, selected node |
| `agentStore` | Agent queue, human-in-the-loop prompts |
| `uiStore` | Panel open/close, current view, theme |

### Routing — TanStack Router

- Use `useNavigate` and `Link` from TanStack Router exclusively
- Never use `window.location` or manual history manipulation
- Route params (`$noteId`) are fully typed — no casting needed

### State Boundary Rules

| Data type | Owner |
|-----------|-------|
| Vault file list | TanStack Query |
| Note content (read/write) | TanStack Query |
| AI task results | TanStack Query |
| Active note ID | Zustand (`vaultStore`) |
| Panel open/close | Zustand (`uiStore`) |
| Current route | TanStack Router |
| Editor cursor | Zustand (`editorStore`) |

React Context API is forbidden for global state. Do not use `useState` for state shared across components.

---

## Coding Conventions

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

## Environment Variables

`.env` — included in `.gitignore`, never committed:

```env
OPENAI_API_KEY=           # For Absorption Engine
ANTHROPIC_API_KEY=        # For Production Engine
```

Environment variables must never be exposed to the frontend. All secrets are mediated through Tauri commands from `src-tauri/.env`.

---

## Prohibited Actions

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

---

## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

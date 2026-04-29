# Mimisbrunnr — Project Context

> Domain vocabulary and architecture overview for Mimisbrunnr.
> Agents: read this before working on any feature. Use the terms here exactly — don't drift to synonyms.

---

## Product Identity

**Name:** Mimisbrunnr (Well of Mimir)
**Category:** AI-native local PKMS (Personal Knowledge Management System) + Writing Tool
**Philosophy:** A cognitive augmentation tool that transforms information into knowledge, and knowledge into production.
**Reference products:** Obsidian (file structure), Notion (editor experience)
**Key differentiator:** AI is not a plugin — it is embedded in the core architecture from the ground up.

---

## Architecture Principles

These principles define the character of the system. Decisions that contradict them require an ADR.

- **Local-First** — Core features (read, write, search) must work without network access. LLM calls are scoped to AI features only; failures degrade gracefully. All user data lives in local `.md` files and SQLite.
- **File System is the Source of Truth** — SQLite is a cache and index, never the primary store. Any `.md` file change triggers a DB sync. Editing files outside the app must not break consistency.
- **AI Runs Silently** — AI tasks never block the UI thread. All agent work is queue-based and async. Completion triggers a quiet toast — no forced popups.
- **Human-in-the-Loop** — Low-confidence AI decisions request user confirmation. Rejected suggestions are recorded for personalization. Agents are forbidden from modifying `.md` files autonomously in MVP.
- **Editor Focus** — When the editor is focused, non-essential UI is minimized. Notifications and panel transitions are non-intrusive.

---

## Domain Model

These are the canonical types. When naming things in issues, tests, or code, use these terms exactly.

### Note

The primary unit of the knowledge base. A `Note` maps 1-to-1 with a `.md` file on disk.

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

Used by the Knowledge Graph view. Nodes are derived from Notes; edges from links.

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
  type: 'explicit' | 'semantic'; // Explicit [[wikilink]] vs AI-discovered connection
  weight: number;
}
```

### AbsorptionItem

The output of the **Absorption Engine** — a clipped piece of external content processed by AI before archiving as a Note.

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

A unit of background AI work dispatched to the **agent queue**. Human-in-the-loop prompts pause execution until the user responds.

```typescript
interface AgentTask {
  id: string;
  type: 'summarize' | 'tag' | 'link' | 'cluster' | 'draft';
  status: 'queued' | 'running' | 'done' | 'failed' | 'waiting_human';
  input: unknown;
  output?: unknown;
  thoughtLog: ThoughtEntry[];
  humanPrompt?: HumanPrompt;
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

## Project Structure

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
│   ├── components/
│   │   ├── editor/             # CodeMirror editor
│   │   ├── sidebar/            # File explorer, tags
│   │   ├── graph/              # Knowledge Graph
│   │   ├── dashboard/          # Home dashboard
│   │   ├── agent/              # Agent panel UI
│   │   ├── absorption/         # Clipping card UI
│   │   └── ui/                 # Shared UI primitives
│   ├── lib/
│   │   ├── ai/                 # AI pipeline (absorption, production, embedding)
│   │   ├── vault/              # Vault filesystem logic (parser, linker)
│   │   ├── graph/              # Graph data construction
│   │   └── db/                 # SQLite connection
│   ├── store/                  # Zustand stores (vault, editor, agent, ui)
│   ├── hooks/
│   └── types/                  # Shared TypeScript interfaces (note, graph, agent)
│
├── docs/
│   ├── adr/                    # Architectural Decision Records
│   └── agents/                 # Agent skill configuration
├── CONTEXT.md                  # This file
└── AGENTS.md                   # Agent behavioral rules
```

---

## MVP Roadmap

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

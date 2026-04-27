// Shared sample data for all three directions
const VAULT = [
  { kind: 'folder', name: 'Daily', open: true, children: [
    { kind: 'note', id: 'd-2604', name: '2026-04-26', tags: ['daily'] },
    { kind: 'note', id: 'd-2625', name: '2026-04-25', tags: ['daily'] },
    { kind: 'note', id: 'd-2624', name: '2026-04-24', tags: ['daily'] },
  ]},
  { kind: 'folder', name: 'Reading', open: true, children: [
    { kind: 'note', id: 'r-attn',   name: 'Attention is all you need',     tags: ['ai','paper'] },
    { kind: 'note', id: 'r-graph',  name: 'Knowledge graphs in practice',  tags: ['pkm'] },
    { kind: 'note', id: 'r-bret',   name: 'Bret Victor — thinking tools',  tags: ['design','tools'] },
    { kind: 'note', id: 'r-zttl',   name: 'Zettelkasten origins',          tags: ['pkm','history'] },
  ]},
  { kind: 'folder', name: 'Projects', open: true, children: [
    { kind: 'note', id: 'p-mimis',  name: 'Mimisbrunnr — design notes',   tags: ['project','design'] },
    { kind: 'note', id: 'p-spec',   name: 'Absorption pipeline spec',     tags: ['project','spec'] },
    { kind: 'note', id: 'p-roll',   name: 'April rollup',                 tags: ['project'] },
  ]},
  { kind: 'folder', name: 'Ideas', open: false, children: [
    { kind: 'note', id: 'i-comp',   name: 'On compression of thought',    tags: ['idea'] },
    { kind: 'note', id: 'i-loops',  name: 'Feedback loops everywhere',    tags: ['idea'] },
  ]},
  { kind: 'folder', name: 'Archive', open: false, children: [] },
];

const TAGS = [
  { name: 'ai',      count: 24 },
  { name: 'pkm',     count: 18 },
  { name: 'design',  count: 12 },
  { name: 'project', count:  9 },
  { name: 'idea',    count:  7 },
  { name: 'daily',   count: 31 },
];

// Body text for the active note — written out, no lorem ipsum
const ACTIVE_NOTE = {
  title: 'On compression of thought',
  meta:  '1,247 words · ~6 min read · saved 2m ago',
  tags:  ['idea','pkm','design'],
  body: [
    { kind: 'p', text: 'A note is a compression artifact. The act of writing forces you to discard ninety percent of what was in your head; what remains is denser, more transferable, and — crucially — addressable.' },
    { kind: 'p', text: 'Most personal knowledge tools are storage. They optimize for the moment of capture. The harder problem is retrieval that respects the original act of compression: surfacing notes when they are useful, not when they match a keyword.' },
    { kind: 'h2', text: 'The retrieval failure' },
    { kind: 'p', text: 'I have searched my own vault three times this week and found nothing. Each time, the note I wanted existed, but I had archived it under a category I no longer think in. The vocabulary of past-me is foreign to present-me.' },
    { kind: 'p', text: 'A model trained on the vault could bridge this gap. Not by generating prose, but by translating between past and present taxonomies. When I write " feedback loops, " surface the 2024 entry titled " closed-loop systems " — same idea, different words.' },
    { kind: 'h2', text: 'What the AI should not do' },
    { kind: 'p', text: 'It should not write for me. It should not summarize aggressively. It should not pretend to understand. The compression that matters is mine; the model is a librarian, not a co-author.' },
    { kind: 'wikilink-p', text: 'See also: ', link: 'Bret Victor — thinking tools', after: ' for a related argument about tools that amplify rather than replace.' },
    { kind: 'h2', text: 'Open questions' },
    { kind: 'ul', items: [
      'How do you evaluate a librarian? Precision and recall, but on what corpus?',
      'Should the model ever surface notes unprompted, or only on query?',
      'What is the latency budget for " feels invisible "?',
    ]},
  ],
};

// Suggestions in the editor right gutter
const GUTTER_SUGGESTIONS = [
  { line: 4, kind: 'connect', text: 'Related: Zettelkasten origins', strength: 0.82 },
  { line: 9, kind: 'expand',  text: 'Expand: vocabulary drift over time', strength: 0.71 },
  { line: 14, kind: 'connect', text: 'Related: Bret Victor — thinking tools', strength: 0.91 },
];

// Dashboard digest
const DIGEST = [
  { id: 'r-bret',  title: 'Bret Victor — thinking tools', why: 'Connects to 4 of your active notes', minutes: 8 },
  { id: 'r-attn',  title: 'Attention is all you need',    why: 'You opened this 3 weeks ago, never finished', minutes: 12 },
  { id: 'i-comp',  title: 'On compression of thought',    why: 'Edited yesterday; 2 unresolved threads', minutes: 4 },
];

// Absorption queue
const ABSORPTION = [
  {
    id: 'abs-1',
    source: 'maggieappleton.com/garden',
    title: 'Tools for thought as cultural practices',
    captured: '14 min ago',
    status: 'ready',
    summary: 'Argues that PKM tools are read more than they are written; the audience is future-you. Five practices for a sustainable garden.',
    tags: ['pkm','tools','culture'],
    related: ['Bret Victor — thinking tools', 'Zettelkasten origins'],
  },
  {
    id: 'abs-2',
    source: 'arxiv.org/2401.04088',
    title: 'Retrieval-augmented generation, revisited',
    captured: '1 h ago',
    status: 'ready',
    summary: 'Survey of 2024–25 RAG architectures. Key shift: hybrid retrieval (lexical + dense) outperforms pure-dense by 11% on long-tail queries.',
    tags: ['ai','paper','rag'],
    related: ['Attention is all you need'],
  },
  {
    id: 'abs-3',
    source: 'thesephist.com/posts/branches',
    title: 'Branches and the shape of writing',
    captured: '3 h ago',
    status: 'processing',
    summary: null,
    tags: [],
    related: [],
  },
];

// Recent activity for dashboard
const ACTIVITY = [
  { time: '2m',  kind: 'edit',    text: 'Edited “On compression of thought”' },
  { time: '14m', kind: 'absorb',  text: 'Absorbed maggieappleton.com/garden' },
  { time: '1h',  kind: 'agent',   text: 'Linked 3 notes to #pkm cluster' },
  { time: '1h',  kind: 'agent',   text: 'Suggested tag #rag for 2 notes' },
  { time: '3h',  kind: 'absorb',  text: 'Absorbed thesephist.com/posts/branches' },
  { time: '5h',  kind: 'edit',    text: 'Created “April rollup”' },
  { time: 'yd',  kind: 'agent',   text: 'Detected 2 isolated notes in Reading/' },
];

// Agent log — for AI panel
const AGENT_LOG = [
  { state: 'thinking', text: 'Reading current note…' },
  { state: 'thinking', text: 'Searching vault for semantic neighbors' },
  { state: 'found',    text: 'Found 3 strong candidates' },
  { state: 'await',    text: 'Tag “#compression”? Confidence 0.74' },
];

// Graph nodes — laid out in a constellation. Coords are 0-1 normalized.
const GRAPH_NODES = [
  { id: 'p-mimis', label: 'Mimisbrunnr',           x: 0.50, y: 0.50, size: 22, cluster: 'a' },
  { id: 'i-comp',  label: 'compression of thought', x: 0.34, y: 0.32, size: 17, cluster: 'a' },
  { id: 'r-bret',  label: 'Bret Victor',            x: 0.22, y: 0.55, size: 15, cluster: 'a' },
  { id: 'r-zttl',  label: 'Zettelkasten',           x: 0.30, y: 0.72, size: 13, cluster: 'a' },
  { id: 'r-graph', label: 'Knowledge graphs',       x: 0.62, y: 0.30, size: 14, cluster: 'b' },
  { id: 'r-attn',  label: 'Attention paper',        x: 0.78, y: 0.40, size: 13, cluster: 'b' },
  { id: 'p-spec',  label: 'Absorption spec',        x: 0.70, y: 0.62, size: 12, cluster: 'b' },
  { id: 'i-loops', label: 'feedback loops',         x: 0.56, y: 0.78, size: 11, cluster: 'a' },
  { id: 'p-roll',  label: 'April rollup',           x: 0.84, y: 0.72, size: 10, cluster: 'b' },
  { id: 'd-2604',  label: '2026-04-26',             x: 0.14, y: 0.30, size:  8, cluster: 'c' },
  { id: 'd-2625',  label: '2026-04-25',             x: 0.10, y: 0.42, size:  8, cluster: 'c' },
  { id: 'd-2624',  label: '2026-04-24',             x: 0.12, y: 0.55, size:  8, cluster: 'c' },
];

const GRAPH_EDGES = [
  { a: 'p-mimis', b: 'i-comp',  kind: 'link' },
  { a: 'p-mimis', b: 'r-graph', kind: 'link' },
  { a: 'p-mimis', b: 'p-spec',  kind: 'link' },
  { a: 'i-comp',  b: 'r-bret',  kind: 'link' },
  { a: 'i-comp',  b: 'r-zttl',  kind: 'semantic' },
  { a: 'r-bret',  b: 'r-zttl',  kind: 'semantic' },
  { a: 'r-attn',  b: 'r-graph', kind: 'link' },
  { a: 'p-spec',  b: 'r-attn',  kind: 'semantic' },
  { a: 'p-spec',  b: 'i-loops', kind: 'semantic' },
  { a: 'p-roll',  b: 'p-mimis', kind: 'link' },
  { a: 'p-roll',  b: 'p-spec',  kind: 'link' },
  { a: 'd-2604',  b: 'd-2625',  kind: 'link' },
  { a: 'd-2625',  b: 'd-2624',  kind: 'link' },
  { a: 'd-2604',  b: 'i-comp',  kind: 'semantic' },
];

Object.assign(window, {
  VAULT, TAGS, ACTIVE_NOTE, GUTTER_SUGGESTIONS,
  DIGEST, ABSORPTION, ACTIVITY, AGENT_LOG,
  GRAPH_NODES, GRAPH_EDGES,
});

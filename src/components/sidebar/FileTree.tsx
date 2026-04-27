import { useState } from 'react';
import { useVaultStore } from '@/store/vaultStore';

interface VaultFile {
  kind: 'note';
  id: string;
  name: string;
}

interface VaultFolder {
  kind: 'folder';
  name: string;
  open?: boolean;
  children: VaultNode[];
}

type VaultNode = VaultFile | VaultFolder;

const VAULT: VaultFolder[] = [
  { kind: 'folder', name: 'Daily', open: true, children: [
    { kind: 'note', id: 'd-2604', name: '2026-04-26' },
    { kind: 'note', id: 'd-2625', name: '2026-04-25' },
    { kind: 'note', id: 'd-2624', name: '2026-04-24' },
  ]},
  { kind: 'folder', name: 'Reading', open: true, children: [
    { kind: 'note', id: 'r-attn',  name: 'Attention is all you need'   },
    { kind: 'note', id: 'r-graph', name: 'Knowledge graphs in practice' },
    { kind: 'note', id: 'r-bret',  name: 'Bret Victor — thinking tools' },
    { kind: 'note', id: 'r-zttl',  name: 'Zettelkasten origins'         },
  ]},
  { kind: 'folder', name: 'Projects', open: true, children: [
    { kind: 'note', id: 'p-mimis', name: 'Mimisbrunnr — design notes'  },
    { kind: 'note', id: 'p-spec',  name: 'Absorption pipeline spec'    },
    { kind: 'note', id: 'p-roll',  name: 'April rollup'                },
  ]},
  { kind: 'folder', name: 'Ideas', open: false, children: [
    { kind: 'note', id: 'i-comp',  name: 'On compression of thought'   },
    { kind: 'note', id: 'i-loops', name: 'Feedback loops everywhere'   },
  ]},
  { kind: 'folder', name: 'Archive', open: false, children: [] },
];

// Inline SVG icon helpers
const IconChevRight = () => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6"/>
  </svg>
);
const IconChevDown = () => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const IconFolder = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
  </svg>
);
const IconFile = () => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/>
  </svg>
);

interface NodeProps {
  node: VaultNode;
  depth: number;
}

function VaultNodeItem({ node, depth }: NodeProps) {
  const [open, setOpen] = useState(node.kind === 'folder' ? (node.open !== false) : false);
  const { activeNoteId, setActiveNote } = useVaultStore();

  if (node.kind === 'folder') {
    return (
      <div>
        <div
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: `4px 9px 4px ${9 + depth * 12}px`,
            color: 'var(--m-text-2)',
            fontSize: 12,
            cursor: 'pointer',
            borderRadius: 4,
          }}
        >
          <span style={{ color: 'var(--m-text-4)', display: 'inline-flex' }}>
            {open ? <IconChevDown /> : <IconChevRight />}
          </span>
          <span style={{ color: 'var(--m-text-3)' }}><IconFolder /></span>
          <span style={{ flex: 1 }}>{node.name}</span>
        </div>
        {open && node.children.map((child, i) => (
          <VaultNodeItem key={i} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  const active = activeNoteId === node.id;
  return (
    <div
      onClick={() => setActiveNote(node.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: `3px 9px 3px ${9 + depth * 12 + 14}px`,
        color: active ? 'var(--m-text)' : 'var(--m-text-2)',
        background: active ? 'color-mix(in oklch, var(--m-accent) 12%, transparent)' : 'transparent',
        borderLeft: active ? '2px solid var(--m-accent)' : '2px solid transparent',
        fontSize: 12,
        cursor: 'pointer',
      }}
    >
      <span style={{ color: active ? 'var(--m-accent)' : 'var(--m-text-4)', display: 'inline-flex' }}>
        <IconFile />
      </span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {node.name}
      </span>
    </div>
  );
}

export default function FileTree() {
  return (
    <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 6px' }}>
      {VAULT.map((folder, i) => (
        <VaultNodeItem key={i} node={folder} depth={0} />
      ))}
    </div>
  );
}

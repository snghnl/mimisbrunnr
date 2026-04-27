import { X, Sparkles } from 'lucide-react';
import { Dot, Kbd } from '@/components/ui/atoms';

interface AgentLogEntry {
  state: 'thinking' | 'found' | 'await';
  text: string;
}

const AGENT_LOG: AgentLogEntry[] = [
  { state: 'thinking', text: 'Reading current note…' },
  { state: 'thinking', text: 'Searching vault for semantic neighbors' },
  { state: 'found',    text: 'Found 3 strong candidates' },
  { state: 'await',    text: 'Tag "#compression"? Confidence 0.74' },
];

const RECENT_RUNS = [
  { t: '2m',  task: 'Find related to current note', n: 3 },
  { t: '14m', task: 'Absorb maggieappleton.com',    n: 1 },
  { t: '1h',  task: 'Cluster #pkm notes',           n: 8 },
  { t: '3h',  task: 'Detect orphan notes',          n: 2 },
];

function cardBtn(primary: boolean): React.CSSProperties {
  return {
    padding: '5px 11px',
    fontSize: 11.5,
    background: primary ? 'var(--m-accent)' : 'transparent',
    color: primary ? 'oklch(0.18 0.01 80)' : 'var(--m-text-2)',
    border: primary ? 'none' : '1px solid var(--m-line)',
    borderRadius: 4,
    cursor: 'pointer',
    fontFamily: 'var(--m-sans)',
    fontWeight: primary ? 500 : 400,
  };
}

interface AgentPanelProps {
  onClose: () => void;
}

export default function AgentPanel({ onClose }: AgentPanelProps) {
  return (
    <aside
      className="m-slide-in"
      style={{
        marginTop: 36,
        width: 320,
        height: 'calc(100vh - 36px)',
        background: 'var(--m-bg)',
        borderLeft: '1px solid var(--m-line-soft)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: '1px solid var(--m-line-soft)',
      }}>
        <Dot color="var(--m-ai)" pulse size={7} />
        <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--m-text)' }}>Agent</span>
        <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.5 }}>· thinking</span>
        <button
          onClick={onClose}
          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--m-text-3)', cursor: 'pointer', display: 'flex', padding: 0 }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Now */}
        <div>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Now</div>
          <div style={{ fontSize: 13, color: 'var(--m-text)', lineHeight: 1.45, marginBottom: 8 }}>
            Finding semantic neighbors for{' '}
            <span style={{ color: 'var(--m-accent)' }}>"On compression of thought"</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 4 }}>
            {AGENT_LOG.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: 'var(--m-text-2)' }}>
                <span style={{ marginTop: 5, flexShrink: 0 }}>
                  <Dot
                    color={l.state === 'await' ? 'var(--m-accent)' : 'var(--m-ai)'}
                    size={4}
                    pulse={l.state === 'thinking'}
                  />
                </span>
                <span style={{ flex: 1 }}>{l.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HITL confirmation */}
        <div
          className="m-slide-in"
          style={{
            padding: 12,
            background: 'color-mix(in oklch, var(--m-accent) 7%, var(--m-bg-2))',
            border: '1px solid color-mix(in oklch, var(--m-accent) 30%, var(--m-line))',
            borderRadius: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Dot color="var(--m-accent)" size={6} />
            <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-accent)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Confirm</span>
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--m-text)', marginBottom: 10 }}>
            Tag this note as <span style={{ color: 'var(--m-accent)' }}>#compression</span>?
            <span style={{ display: 'block', color: 'var(--m-text-3)', fontSize: 11, marginTop: 4 }}>
              Confidence 0.74 · 6 similar notes share this tag
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={cardBtn(true)}>Yes</button>
            <button style={cardBtn(false)}>No</button>
            <button style={cardBtn(false)}>Edit</button>
          </div>
        </div>

        {/* Recent runs */}
        <div>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Recent runs</div>
          {RECENT_RUNS.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                padding: '7px 0',
                fontSize: 12,
                color: 'var(--m-text-2)',
                borderBottom: i < RECENT_RUNS.length - 1 ? '1px solid var(--m-line-soft)' : 'none',
              }}
            >
              <span style={{ width: 26, fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)' }}>{r.t}</span>
              <span style={{ flex: 1 }}>{r.task}</span>
              <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)' }}>↳ {r.n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ask input */}
      <div style={{ padding: 12, borderTop: '1px solid var(--m-line-soft)' }}>
        <div style={{
          padding: 10,
          background: 'var(--m-bg-2)',
          border: '1px solid var(--m-line-soft)',
          borderRadius: 5,
          fontSize: 12.5,
          color: 'var(--m-text-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ color: 'var(--m-ai)' }}><Sparkles size={12} /></span>
          <span style={{ flex: 1 }}>Ask the agent…</span>
          <Kbd>↵</Kbd>
        </div>
      </div>
    </aside>
  );
}

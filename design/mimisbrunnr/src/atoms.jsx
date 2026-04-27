// Shared atomic components: icons, status dots, graph canvas, etc.

// ───────────────────────── Icons (Lucide-style strokes, drawn inline) ─────────────────────────
const I = {
  search: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  plus:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  hash:   (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>,
  folder: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>,
  file:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/></svg>,
  chevR:  (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>,
  chevD:  (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  graph:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.5 7.5 11 16M16.5 7.5 13 16"/></svg>,
  home:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2Z"/></svg>,
  edit:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21h4l11-11-4-4L4 17Z"/><path d="m14 6 4 4"/></svg>,
  link:   (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7L12.5 17"/></svg>,
  globe:  (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>,
  spark:  (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>,
  cmd:    (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3Z"/></svg>,
  clock:  (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  inbox:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h5l1.5 2h5L16 13h5"/><path d="M5 5h14l2 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z"/></svg>,
  archive:(s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18v4H3zM5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/></svg>,
  x:      (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>,
  panel:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M14 4v16"/></svg>,
  gear:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></svg>,
  arrow:  (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  check:  (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  trash:  (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/></svg>,
};

// ───────────────────────── Tiny atoms ─────────────────────────
function Tag({ name, accent = false, ai = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 7px',
      fontFamily: 'var(--m-mono)',
      fontSize: 10.5, letterSpacing: 0.2,
      color: accent ? 'var(--m-accent)' : ai ? 'var(--m-ai)' : 'var(--m-text-3)',
      background: 'transparent',
      border: `1px solid ${accent ? 'color-mix(in oklch, var(--m-accent) 35%, transparent)' : ai ? 'color-mix(in oklch, var(--m-ai) 35%, transparent)' : 'var(--m-line-soft)'}`,
      borderRadius: 3,
    }}>
      <span style={{ opacity: 0.65, marginLeft: -2 }}>#</span>{name}
    </span>
  );
}

function Dot({ color = 'var(--m-text-3)', size = 6, pulse = false }) {
  return <span className={pulse ? 'm-pulse' : ''} style={{
    display: 'inline-block', width: size, height: size, borderRadius: '50%',
    background: color, flexShrink: 0,
  }}/>;
}

function Kbd({ children }) {
  return <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 18, height: 18, padding: '0 5px',
    fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-3)',
    background: 'var(--m-bg-3)', border: '1px solid var(--m-line-soft)', borderRadius: 3,
  }}>{children}</span>;
}

function Divider({ vertical = false, style }) {
  return <div style={{
    background: 'var(--m-line-soft)',
    [vertical ? 'width' : 'height']: 1,
    [vertical ? 'height' : 'width']: '100%',
    ...style,
  }}/>;
}

// ───────────────────────── Mark — Mimisbrunnr glyph ─────────────────────────
// A simple wellhead: three concentric arcs over a point. No mythology illustration.
function Mark({ size = 18, color }) {
  const c = color || 'var(--m-accent)';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" opacity="0.35"/>
      <circle cx="12" cy="12" r="6" opacity="0.65"/>
      <circle cx="12" cy="12" r="2.5"/>
      <circle cx="12" cy="12" r="0.8" fill={c}/>
    </svg>
  );
}

// ───────────────────────── Constellation graph ─────────────────────────
// Pure SVG renderer for graph view & previews. width/height in px.
function Constellation({ width = 560, height = 360, nodes = window.GRAPH_NODES, edges = window.GRAPH_EDGES, focus = 'p-mimis', subtle = false }) {
  const [hover, setHover] = React.useState(null);
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const xy = (n) => ({ x: n.x * width, y: n.y * height });

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="m-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="var(--m-accent)" stopOpacity="0.55"/>
          <stop offset="60%"  stopColor="var(--m-accent)" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="var(--m-accent)" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="m-glow-ai" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="var(--m-ai)" stopOpacity="0.55"/>
          <stop offset="60%"  stopColor="var(--m-ai)" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="var(--m-ai)" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Faint star field for atmosphere */}
      {Array.from({ length: 40 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const sx = ((seed % 100) / 100) * width;
        const sy = (((seed * 7) % 100) / 100) * height;
        const sr = ((seed % 7) / 10) + 0.4;
        return <circle key={i} cx={sx} cy={sy} r={sr} fill="var(--m-text-4)" opacity="0.3"/>;
      })}

      {/* Edges */}
      {edges.map((e, i) => {
        const a = byId[e.a], b = byId[e.b];
        if (!a || !b) return null;
        const pa = xy(a), pb = xy(b);
        const isFocus = focus && (e.a === focus || e.b === focus);
        const stroke = e.kind === 'semantic' ? 'var(--m-ai)' : 'var(--m-line)';
        const opacity = subtle ? (isFocus ? 0.6 : 0.18) : (isFocus ? 0.85 : 0.32);
        return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
          stroke={stroke} strokeWidth={isFocus ? 1.2 : 0.8}
          strokeDasharray={e.kind === 'semantic' ? '3 3' : 'none'}
          opacity={opacity}/>;
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const { x, y } = xy(n);
        const isFocus = n.id === focus;
        const isHover = hover === n.id;
        const r = n.size / 2;
        return (
          <g key={n.id} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
            {(isFocus || isHover) && <circle cx={x} cy={y} r={r * 3.2} fill={`url(#${n.cluster === 'b' ? 'm-glow-ai' : 'm-glow'})`}/>}
            <circle cx={x} cy={y} r={r}
              fill={isFocus ? 'var(--m-accent)' : (n.cluster === 'b' ? 'var(--m-ai)' : 'var(--m-text-2)')}
              opacity={isFocus ? 1 : (isHover ? 0.95 : 0.78)}/>
            {(isFocus || isHover || n.size >= 13) && (
              <text x={x + r + 6} y={y + 3}
                fontFamily="var(--m-serif)" fontSize={10.5}
                fill={isFocus ? 'var(--m-text)' : 'var(--m-text-2)'}>
                {n.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ───────────────────────── AI status pill ─────────────────────────
function AIStatusPill({ state = 'idle', text }) {
  const map = {
    idle:     { dot: 'var(--m-text-4)', label: text || 'Idle' },
    thinking: { dot: 'var(--m-ai)',     label: text || 'Thinking', pulse: true },
    found:    { dot: 'var(--m-ai)',     label: text || 'Found' },
    await:    { dot: 'var(--m-accent)', label: text || 'Awaiting input' },
  };
  const s = map[state] || map.idle;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px',
      fontSize: 11, color: 'var(--m-text-2)',
      background: 'transparent',
      border: '1px solid var(--m-line-soft)', borderRadius: 999,
    }}>
      <Dot color={s.dot} pulse={s.pulse}/>
      {s.label}
    </span>
  );
}

Object.assign(window, { I, Tag, Dot, Kbd, Divider, Mark, Constellation, AIStatusPill });

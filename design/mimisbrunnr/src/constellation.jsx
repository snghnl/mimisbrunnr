// Direction 3 — CONSTELLATION
// Graph-as-home. The vault opens onto its knowledge map; clicking a node
// opens the editor as a slide-up sheet that doesn't dismiss the map.

function Constellation3({ theme = 'dark', editorFont = 'serif', width = 1320, height = 820 }) {
  const [sheetOpen, setSheetOpen] = React.useState(true);
  const [absorbExpanded, setAbsorbExpanded] = React.useState(false);

  const editorFamily =
    editorFont === 'serif' ? 'var(--m-serif)' :
    editorFont === 'sans'  ? 'var(--m-sans)'  :
                             'var(--m-mono)';

  const sheetH = sheetOpen ? Math.round(height * 0.52) : 44;

  return (
    <div data-theme={theme} style={{
      width, height, background: 'oklch(0.10 0.005 240)', color: 'var(--m-text)',
      borderRadius: 8, overflow: 'hidden', position: 'relative',
      fontFamily: 'var(--m-sans)',
    }}>
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 5,
        padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'color-mix(in oklch, oklch(0.10 0.005 240) 75%, transparent)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid color-mix(in oklch, var(--m-line) 50%, transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Mark size={16}/>
          <span style={{ fontSize: 12.5, color: 'var(--m-text-2)', letterSpacing: 0.2 }}>mimisbrunnr</span>
          <span style={{ color: 'var(--m-text-4)' }}>/</span>
          <span style={{ fontFamily: 'var(--m-mono)', fontSize: 11, color: 'var(--m-text-3)' }}>~/notes</span>
        </div>

        <div style={{
          flex: 1, maxWidth: 480, marginLeft: 24,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px',
          background: 'color-mix(in oklch, var(--m-bg-2) 60%, transparent)',
          border: '1px solid color-mix(in oklch, var(--m-line) 60%, transparent)',
          borderRadius: 5, color: 'var(--m-text-3)', fontSize: 12,
        }}>
          {I.search(12)}
          <span style={{ flex: 1 }}>Search · 247 notes · 1,184 connections</span>
          <Kbd>⌘K</Kbd>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AIStatusPill state="thinking" text="agent reading"/>
          <button style={{
            padding: '5px 11px', fontSize: 12, background: 'transparent',
            border: '1px solid var(--m-line)', borderRadius: 4, color: 'var(--m-text-2)',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>{I.plus(11)} new</button>
        </div>
      </div>

      {/* Constellation canvas — fills behind everything */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <ConstellationField width={width} height={height}/>
      </div>

      {/* Left — filters / clusters */}
      <div style={{
        position: 'absolute', top: 60, left: 16, width: 220, zIndex: 4,
        padding: 14,
        background: 'color-mix(in oklch, var(--m-bg) 75%, transparent)',
        backdropFilter: 'blur(12px)',
        border: '1px solid color-mix(in oklch, var(--m-line) 50%, transparent)',
        borderRadius: 7,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Clusters</div>
          {[
            { name: 'Personal Knowledge',  count: 84, color: 'var(--m-accent)', active: true },
            { name: 'AI & Retrieval',      count: 56, color: 'var(--m-ai)',     active: true },
            { name: 'Daily',               count: 31, color: 'var(--m-text-2)', active: false },
            { name: 'Projects',            count: 24, color: 'var(--m-text-2)', active: true },
          ].map(c => (
            <label key={c.name} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 0', fontSize: 12, color: c.active ? 'var(--m-text)' : 'var(--m-text-3)',
              cursor: 'pointer',
            }}>
              <span style={{
                width: 10, height: 10, borderRadius: 2,
                border: `1px solid ${c.color}`,
                background: c.active ? c.color : 'transparent',
              }}/>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)' }}>{c.count}</span>
            </label>
          ))}
        </div>

        <Divider/>

        <div>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Edges</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', fontSize: 11.5, color: 'var(--m-text-2)' }}>
            <span style={{ width: 18, height: 1, background: 'var(--m-line)' }}/>
            <span style={{ flex: 1 }}>Wikilinks</span>
            <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)' }}>820</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', fontSize: 11.5, color: 'var(--m-text-2)' }}>
            <span style={{ width: 18, borderTop: '1px dashed var(--m-ai)' }}/>
            <span style={{ flex: 1 }}>Semantic <span style={{ color: 'var(--m-ai)' }}>(AI)</span></span>
            <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)' }}>364</span>
          </label>
        </div>

        <Divider/>

        <div>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Layout</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['Force', 'Radial', 'Time'].map((l, i) => (
              <button key={l} style={{
                flex: 1, padding: '4px 8px', fontSize: 11,
                background: i === 0 ? 'var(--m-bg-3)' : 'transparent',
                color: i === 0 ? 'var(--m-text)' : 'var(--m-text-3)',
                border: '1px solid var(--m-line-soft)', borderRadius: 3, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Right — focused node card */}
      <div style={{
        position: 'absolute', top: 60, right: 16, width: 270, zIndex: 4,
        padding: 14,
        background: 'color-mix(in oklch, var(--m-bg) 75%, transparent)',
        backdropFilter: 'blur(12px)',
        border: '1px solid color-mix(in oklch, var(--m-line) 50%, transparent)',
        borderRadius: 7,
      }}>
        <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-accent)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>● Focused</div>
        <h3 style={{ fontFamily: editorFamily, fontWeight: 500, fontSize: 18, margin: '0 0 6px', lineHeight: 1.25 }}>On compression of thought</h3>
        <div style={{ fontSize: 11, color: 'var(--m-text-3)', marginBottom: 10, fontFamily: 'var(--m-mono)' }}>1,247 words · 8 inbound · 4 outbound</div>
        <p style={{ fontSize: 12, color: 'var(--m-text-2)', lineHeight: 1.5, margin: '0 0 12px' }}>
          A note is a compression artifact. The act of writing forces you to discard ninety percent of what was…
        </p>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
          {ACTIVE_NOTE.tags.map(t => <Tag key={t} name={t}/>)}
        </div>

        <Divider/>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Neighbors</div>
          {[
            { name: 'Bret Victor — thinking tools', strength: 0.91, ai: false },
            { name: 'Zettelkasten origins',         strength: 0.78, ai: true },
            { name: 'Knowledge graphs in practice', strength: 0.62, ai: false },
            { name: 'feedback loops everywhere',    strength: 0.54, ai: true },
          ].map(n => (
            <div key={n.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', fontSize: 11.5, color: 'var(--m-text-2)', cursor: 'pointer' }}>
              <Dot color={n.ai ? 'var(--m-ai)' : 'var(--m-text-3)'} size={4}/>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.name}</span>
              <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)' }}>{n.strength.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <button style={{
          marginTop: 10, width: '100%', padding: '6px 0', fontSize: 11.5,
          background: 'var(--m-accent)', color: 'oklch(0.18 0.01 80)',
          border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500,
        }}>Open in editor</button>
      </div>

      {/* Floating absorption pill — bottom-left */}
      <div style={{
        position: 'absolute', left: 16, bottom: 16 + (sheetOpen ? sheetH - 44 : 0), zIndex: 4,
        width: absorbExpanded ? 360 : 220,
        padding: absorbExpanded ? 14 : '8px 12px',
        background: 'color-mix(in oklch, var(--m-bg) 80%, transparent)',
        backdropFilter: 'blur(12px)',
        border: '1px solid color-mix(in oklch, var(--m-line) 60%, transparent)',
        borderRadius: 7,
        cursor: 'pointer',
        transition: 'width 150ms, padding 150ms',
      }} onClick={() => setAbsorbExpanded(!absorbExpanded)}>
        {!absorbExpanded ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dot color="var(--m-ai)" size={5} pulse/>
            <span style={{ fontSize: 11.5, color: 'var(--m-text-2)' }}>1 absorbing · 2 ready</span>
            <span style={{ marginLeft: 'auto', color: 'var(--m-text-4)' }}>{I.chevR(11)}</span>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Dot color="var(--m-ai)" size={5} pulse/>
              <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-2)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Absorption</span>
              <span style={{ marginLeft: 'auto', color: 'var(--m-text-4)' }}>{I.chevD(11)}</span>
            </div>
            {ABSORPTION.slice(0, 3).map(a => (
              <div key={a.id} style={{ padding: '7px 0', borderTop: '1px solid var(--m-line-soft)' }}>
                <div style={{ fontSize: 12, color: 'var(--m-text)', marginBottom: 3, lineHeight: 1.3 }}>{a.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontFamily: 'var(--m-mono)', color: 'var(--m-text-4)' }}>
                  <span>{a.source}</span>
                  <span style={{ marginLeft: 'auto', color: a.status === 'processing' ? 'var(--m-ai)' : 'var(--m-text-3)' }}>
                    {a.status === 'processing' ? 'reading…' : 'ready'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom sheet — editor preview */}
      <BottomSheet
        height={sheetH}
        open={sheetOpen}
        onToggle={() => setSheetOpen(!sheetOpen)}
        editorFamily={editorFamily}
      />
    </div>
  );
}

// Larger, more atmospheric constellation field for the home view
function ConstellationField({ width, height }) {
  const [hover, setHover] = React.useState(null);
  const nodes = GRAPH_NODES;
  const edges = GRAPH_EDGES;
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const xy = (n) => ({ x: n.x * width * 0.86 + width * 0.07, y: n.y * height * 0.7 + height * 0.08 });

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="m-glow-big" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--m-accent)" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="var(--m-accent)" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="m-glow-big-ai" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--m-ai)" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="var(--m-ai)" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="m-bg-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="oklch(0.16 0.01 240)" stopOpacity="1"/>
          <stop offset="100%" stopColor="oklch(0.10 0.005 240)" stopOpacity="1"/>
        </radialGradient>
      </defs>

      <rect width={width} height={height} fill="url(#m-bg-glow)"/>

      {/* Star field */}
      {Array.from({ length: 90 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const sx = ((seed % 1000) / 1000) * width;
        const sy = (((seed * 7) % 1000) / 1000) * height;
        const sr = ((seed % 7) / 10) + 0.3;
        const op = ((seed % 5) / 10) + 0.15;
        return <circle key={i} cx={sx} cy={sy} r={sr} fill="var(--m-text-3)" opacity={op}/>;
      })}

      {/* Edges */}
      {edges.map((e, i) => {
        const a = byId[e.a], b = byId[e.b];
        if (!a || !b) return null;
        const pa = xy(a), pb = xy(b);
        const isFocus = e.a === 'p-mimis' || e.b === 'p-mimis';
        const isHover = hover && (e.a === hover || e.b === hover);
        const stroke = e.kind === 'semantic' ? 'var(--m-ai)' : 'var(--m-line)';
        const opacity = (isFocus || isHover) ? 0.85 : 0.32;
        return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
          stroke={stroke} strokeWidth={(isFocus || isHover) ? 1.2 : 0.7}
          strokeDasharray={e.kind === 'semantic' ? '3 3' : 'none'}
          opacity={opacity}/>;
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const { x, y } = xy(n);
        const isFocus = n.id === 'p-mimis';
        const isHover = hover === n.id;
        const r = (n.size / 2) * 1.4;
        return (
          <g key={n.id} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
            {(isFocus || isHover) && <circle cx={x} cy={y} r={r * 4.5} fill={`url(#${n.cluster === 'b' ? 'm-glow-big-ai' : 'm-glow-big'})`}/>}
            <circle cx={x} cy={y} r={r}
              fill={isFocus ? 'var(--m-accent)' : (n.cluster === 'b' ? 'var(--m-ai)' : 'var(--m-text-2)')}
              opacity={isFocus ? 1 : (isHover ? 0.95 : 0.72)}/>
            {(isFocus || isHover || n.size >= 13) && (
              <text x={x + r + 8} y={y + 3.5}
                fontFamily="var(--m-serif)" fontSize={isFocus ? 13 : 11}
                fontWeight={isFocus ? 500 : 400}
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

function BottomSheet({ height, open, onToggle, editorFamily }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height, zIndex: 6,
      background: 'color-mix(in oklch, var(--m-bg) 92%, transparent)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid color-mix(in oklch, var(--m-line) 60%, transparent)',
      transition: 'height 200ms ease-out',
      display: 'flex', flexDirection: 'column',
    }}>
      <div onClick={onToggle} style={{
        height: 44, padding: '0 20px',
        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        borderBottom: open ? '1px solid var(--m-line-soft)' : 'none',
      }}>
        <span style={{ width: 32, height: 3, background: 'var(--m-line)', borderRadius: 2, marginRight: 8 }}/>
        <span style={{ color: 'var(--m-accent)' }}>{I.edit(13)}</span>
        <span style={{ fontFamily: editorFamily, fontSize: 14, color: 'var(--m-text)', fontWeight: 500 }}>{ACTIVE_NOTE.title}</span>
        <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)' }}>· {ACTIVE_NOTE.meta}</span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Kbd>⌘↑</Kbd>
          <span style={{ fontSize: 11, color: 'var(--m-text-3)' }}>{open ? 'collapse' : 'expand'}</span>
        </div>
      </div>

      {open && (
        <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, maxWidth: 1100, margin: '0 auto', padding: '0 36px' }}>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {ACTIVE_NOTE.tags.map(t => <Tag key={t} name={t}/>)}
              </div>
              <div style={{ fontFamily: editorFamily, fontSize: 16, lineHeight: 1.65, color: 'var(--m-text)' }}>
                {ACTIVE_NOTE.body.slice(0, 4).map((b, i) => {
                  if (b.kind === 'p')   return <p key={i} style={{ margin: '0 0 1em' }}>{b.text}</p>;
                  if (b.kind === 'h2')  return <h2 key={i} style={{ fontFamily: editorFamily, fontWeight: 500, fontSize: 19, margin: '1.2em 0 0.4em' }}>{b.text}</h2>;
                  return null;
                })}
                <p style={{ margin: 0, color: 'var(--m-text-2)' }}>
                  The librarian metaphor needs more work
                  <span className="m-cursor" style={{ display: 'inline-block', width: 2, height: '1em', verticalAlign: '-2px', background: 'var(--m-accent)', marginLeft: 1 }}/>
                </p>
              </div>
            </div>

            <aside>
              <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Agent suggestions</div>
              {GUTTER_SUGGESTIONS.map((s, i) => (
                <div key={i} style={{
                  padding: '9px 11px', marginBottom: 8,
                  borderLeft: '2px solid var(--m-ai)',
                  background: 'color-mix(in oklch, var(--m-ai) 5%, transparent)',
                  fontSize: 12, color: 'var(--m-text-2)', lineHeight: 1.4,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Dot color="var(--m-ai)" size={4}/>
                    <span style={{ fontFamily: 'var(--m-mono)', fontSize: 9.5, color: 'var(--m-ai)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.kind}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--m-mono)', fontSize: 9.5, color: 'var(--m-text-4)' }}>{Math.round(s.strength * 100)}</span>
                  </div>
                  {s.text}
                </div>
              ))}
              <div style={{ marginTop: 14, padding: 11, background: 'color-mix(in oklch, var(--m-accent) 7%, var(--m-bg-2))', border: '1px solid color-mix(in oklch, var(--m-accent) 30%, var(--m-line))', borderRadius: 5 }}>
                <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-accent)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>● Confirm</div>
                <div style={{ fontSize: 12, color: 'var(--m-text)', lineHeight: 1.4, marginBottom: 8 }}>Tag as <span style={{ color: 'var(--m-accent)' }}>#compression</span>?</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button style={cardBtn(true)}>Yes</button>
                  <button style={cardBtn(false)}>No</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Constellation3 });

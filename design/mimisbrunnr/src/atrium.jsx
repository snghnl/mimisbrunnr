// Direction 2 — ATRIUM
// Dashboard-forward home. Editor opens as a focused, distraction-free modal.
// The vault sits behind a slim rail; the day is the primary surface.

function Atrium({ theme = 'dark', editorFont = 'serif', width = 1320, height = 820 }) {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [absorbInput, setAbsorbInput] = React.useState('');

  const editorFamily =
    editorFont === 'serif' ? 'var(--m-serif)' :
    editorFont === 'sans'  ? 'var(--m-sans)'  :
                             'var(--m-mono)';

  return (
    <div data-theme={theme} style={{
      width, height, background: 'var(--m-bg)', color: 'var(--m-text)',
      display: 'flex', overflow: 'hidden', borderRadius: 8,
      fontFamily: 'var(--m-sans)', position: 'relative',
    }}>
      {/* Slim rail */}
      <aside style={{
        width: 56, background: 'oklch(0.13 0.004 80)', borderRight: '1px solid var(--m-line-soft)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', gap: 4,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--m-bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Mark size={18}/>
        </div>
        {[
          { icon: I.home,    active: true },
          { icon: I.edit,    active: false },
          { icon: I.graph,   active: false },
          { icon: I.inbox,   active: false, badge: 3 },
          { icon: I.archive, active: false },
        ].map((b, i) => (
          <button key={i} style={{
            width: 36, height: 36, borderRadius: 7,
            background: b.active ? 'var(--m-bg-3)' : 'transparent',
            border: 'none', color: b.active ? 'var(--m-accent)' : 'var(--m-text-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
          }}>
            {b.icon(16)}
            {b.badge && <span style={{
              position: 'absolute', top: 4, right: 5, fontSize: 9, fontFamily: 'var(--m-mono)',
              minWidth: 14, height: 14, borderRadius: 7, padding: '0 3px',
              background: 'var(--m-accent)', color: 'oklch(0.18 0.01 80)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{b.badge}</span>}
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <button style={{ width: 36, height: 36, border: 'none', background: 'transparent', color: 'var(--m-text-3)', cursor: 'pointer' }}>{I.gear(16)}</button>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--m-bg-3)', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--m-mono)', color: 'var(--m-text-2)' }}>jh</div>
      </aside>

      {/* Main */}
      <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Top — search + capture */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 3,
          padding: '14px 36px',
          background: 'color-mix(in oklch, var(--m-bg) 90%, transparent)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--m-line-soft)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            flex: 1, maxWidth: 640,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px',
            background: 'var(--m-bg-2)', border: '1px solid var(--m-line-soft)', borderRadius: 6,
            color: 'var(--m-text-3)', fontSize: 13,
          }}>
            <span>{I.search(14)}</span>
            <span style={{ flex: 1 }}>Search vault, or paste a URL to absorb…</span>
            <Kbd>⌘K</Kbd>
          </div>
          <AIStatusPill state="thinking" text="Indexing 2 captures"/>
          <button style={{
            padding: '8px 14px', fontSize: 12.5,
            background: 'var(--m-accent)', color: 'oklch(0.18 0.01 80)',
            border: 'none', borderRadius: 5, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500,
          }} onClick={() => setEditorOpen(true)}>
            {I.plus(13)} New note
          </button>
        </div>

        <div style={{ padding: '36px 36px 60px', maxWidth: 1180 }}>
          {/* Hero — today */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: 'var(--m-mono)', fontSize: 11, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Monday · 27 April 2026 · Day 312 of vault</div>
            <h1 style={{ fontFamily: editorFamily, fontWeight: 400, fontSize: 44, margin: '0 0 8px', letterSpacing: -0.6, lineHeight: 1.05 }}>
              <span style={{ color: 'var(--m-text)' }}>Three things await your attention.</span>
            </h1>
            <p style={{ color: 'var(--m-text-3)', fontSize: 14, margin: 0, maxWidth: 560 }}>
              You wrote 1,247 words yesterday across 3 notes. The agent has surfaced 2 connections it would like you to confirm.
            </p>
          </div>

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
            {/* LEFT */}
            <div>
              {/* Digest — featured + secondary */}
              <SectionHead label="Today's digest"/>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12, marginBottom: 32 }}>
                {/* Featured */}
                <article style={{
                  padding: 20, borderRadius: 7,
                  background: 'linear-gradient(180deg, color-mix(in oklch, var(--m-accent) 6%, var(--m-bg-2)) 0%, var(--m-bg-2) 100%)',
                  border: '1px solid color-mix(in oklch, var(--m-accent) 25%, var(--m-line))',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: 200,
                }}>
                  <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-accent)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 }}>● Featured · 8 min</div>
                  <h3 style={{ fontFamily: editorFamily, fontWeight: 500, fontSize: 22, margin: '0 0 10px', lineHeight: 1.2, letterSpacing: -0.2 }}>Bret Victor — thinking tools</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--m-text-2)', margin: '0 0 14px', lineHeight: 1.55 }}>
                    The agent connected this to four of your active notes including <span style={{ color: 'var(--m-accent)' }}>“On compression of thought”</span>. There's a thread you started 12 days ago that this might close.
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
                    {['design','tools','thinking'].map(t => <Tag key={t} name={t}/>)}
                  </div>
                </article>
                {/* Secondary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {DIGEST.slice(1).map((d, i) => (
                    <article key={d.id} style={{
                      padding: 14, borderRadius: 6,
                      background: 'var(--m-bg-2)', border: '1px solid var(--m-line-soft)',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 92,
                    }}>
                      <div style={{ fontFamily: 'var(--m-mono)', fontSize: 9.5, color: 'var(--m-text-4)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>0{i+2} · {d.minutes} min</div>
                      <h4 style={{ fontFamily: editorFamily, fontWeight: 500, fontSize: 14, margin: '0 0 6px', lineHeight: 1.3 }}>{d.title}</h4>
                      <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--m-text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Dot color="var(--m-ai)" size={4}/>{d.why}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Absorption */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--m-line-soft)' }}>
                <div>
                  <span style={{ fontSize: 11, fontFamily: 'var(--m-mono)', letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--m-text-2)' }}>Absorption queue</span>
                  <span style={{ fontSize: 11, color: 'var(--m-text-4)', marginLeft: 8 }}>· 2 ready, 1 processing</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--m-text-3)', cursor: 'pointer' }}>view all →</span>
              </div>

              {/* Capture box */}
              <div style={{
                padding: '10px 12px', marginBottom: 14,
                background: 'var(--m-bg-2)', border: '1px dashed var(--m-line)',
                borderRadius: 5, display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ color: 'var(--m-text-4)' }}>{I.globe(13)}</span>
                <input
                  value={absorbInput}
                  onChange={(e) => setAbsorbInput(e.target.value)}
                  placeholder="Paste a URL to absorb into the vault…"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: 'var(--m-text)', fontSize: 12.5, fontFamily: 'var(--m-sans)',
                  }}/>
                <Kbd>⌘V</Kbd>
              </div>

              {ABSORPTION.map(a => <AbsorptionCard key={a.id} card={a} editorFamily={editorFamily}/>)}
            </div>

            {/* RIGHT */}
            <div>
              {/* Vault stats */}
              <SectionHead label="Your vault"/>
              <div style={{ padding: 16, background: 'var(--m-bg-2)', border: '1px solid var(--m-line-soft)', borderRadius: 6, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'Notes',       value: '247', sub: '+3 this week' },
                    { label: 'Connections', value: '1,184', sub: '32 new (AI)' },
                    { label: 'Orphans',     value: '12', sub: 'down from 18' },
                    { label: 'Tags',        value: '47', sub: '#pkm most active' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 10.5, fontFamily: 'var(--m-mono)', color: 'var(--m-text-4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                      <div style={{ fontSize: 24, fontFamily: editorFamily, fontWeight: 400, color: 'var(--m-text)', lineHeight: 1.1, margin: '4px 0 2px', letterSpacing: -0.3 }}>{s.value}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--m-text-3)' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Mini graph preview */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--m-line-soft)' }}>
                  <div style={{ fontSize: 11, color: 'var(--m-text-3)', marginBottom: 8 }}>Knowledge graph</div>
                  <div style={{ background: 'oklch(0.13 0.005 240)', borderRadius: 4, height: 140, overflow: 'hidden', position: 'relative' }}>
                    <Constellation width={324} height={140} focus="p-mimis" subtle/>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--m-text-3)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>3 clusters</span>
                    <span style={{ color: 'var(--m-accent)', cursor: 'pointer' }}>open graph →</span>
                  </div>
                </div>
              </div>

              {/* Agent activity */}
              <SectionHead label="Agent" hint="last 24h"/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <AgentActivityRow
                  state="await"
                  primary={<>Tag <span style={{ color: 'var(--m-accent)' }}>#rag</span> on 2 notes?</>}
                  meta="14m ago · confidence 0.81"
                  actions
                />
                <AgentActivityRow
                  state="found"
                  primary={<>Linked 3 notes to <span style={{ color: 'var(--m-accent)' }}>#pkm</span> cluster</>}
                  meta="1h ago · auto-confirmed"
                />
                <AgentActivityRow
                  state="found"
                  primary="Detected 2 isolated notes in Reading/"
                  meta="3h ago · suggested 5 connections"
                />
                <AgentActivityRow
                  state="found"
                  primary={<>Absorbed <span style={{ fontFamily: 'var(--m-mono)', fontSize: 11.5 }}>maggieappleton.com</span></>}
                  meta="14m ago · 3 wikilinks created"
                />
              </div>

              {/* Recent */}
              <SectionHead label="Activity"/>
              <div style={{ borderLeft: '1px solid var(--m-line-soft)', paddingLeft: 16, marginLeft: 4 }}>
                {ACTIVITY.slice(0, 6).map((a, i) => (
                  <div key={i} style={{ position: 'relative', padding: '5px 0', display: 'flex', gap: 10, fontSize: 12, color: 'var(--m-text-2)' }}>
                    <span style={{
                      position: 'absolute', left: -20, top: 11,
                      width: 5, height: 5, borderRadius: '50%',
                      background: a.kind === 'agent' ? 'var(--m-ai)' : a.kind === 'absorb' ? 'var(--m-accent)' : 'var(--m-text-3)',
                    }}/>
                    <span style={{ width: 26, fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)' }}>{a.time}</span>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor focus modal */}
      {editorOpen && <FocusEditor editorFamily={editorFamily} onClose={() => setEditorOpen(false)}/>}
    </div>
  );
}

function AgentActivityRow({ state, primary, meta, actions }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: state === 'await' ? 'color-mix(in oklch, var(--m-accent) 6%, var(--m-bg-2))' : 'var(--m-bg-2)',
      border: state === 'await' ? '1px solid color-mix(in oklch, var(--m-accent) 28%, var(--m-line))' : '1px solid var(--m-line-soft)',
      borderRadius: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: actions ? 8 : 4 }}>
        <Dot color={state === 'await' ? 'var(--m-accent)' : 'var(--m-ai)'} size={5} pulse={state === 'thinking'}/>
        <span style={{ fontSize: 12.5, color: 'var(--m-text)' }}>{primary}</span>
      </div>
      <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.4 }}>{meta}</div>
      {actions && (
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <button style={cardBtn(true)}>Confirm</button>
          <button style={cardBtn(false)}>Skip</button>
        </div>
      )}
    </div>
  );
}

// Focus editor — distraction-free overlay
function FocusEditor({ editorFamily, onClose }) {
  return (
    <div className="m-slide-in" style={{
      position: 'absolute', inset: 0, zIndex: 10,
      background: 'color-mix(in oklch, var(--m-bg) 92%, transparent)',
      backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid var(--m-line-soft)' }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: '1px solid var(--m-line)', color: 'var(--m-text-2)',
          padding: '5px 10px', fontSize: 11.5, borderRadius: 4, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          {I.x(11)} close
          <Kbd>esc</Kbd>
        </button>
        <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)' }}>focus mode · ideas/on-compression-of-thought.md</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <AIStatusPill state="thinking"/>
          <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)' }}>saved 2m ago</span>
        </div>
      </div>
      <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', padding: '60px 0 80px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', padding: '0 56px' }}>
          <h1 style={{ fontFamily: editorFamily, fontWeight: 500, fontSize: 38, lineHeight: 1.15, letterSpacing: -0.4, margin: '0 0 6px' }}>{ACTIVE_NOTE.title}</h1>
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {ACTIVE_NOTE.tags.map(t => <Tag key={t} name={t}/>)}
          </div>
          <div style={{ fontFamily: editorFamily, fontSize: 17, lineHeight: 1.7, color: 'var(--m-text)' }}>
            {ACTIVE_NOTE.body.slice(0, 5).map((b, i) => {
              if (b.kind === 'p')   return <p key={i} style={{ margin: '0 0 1em' }}>{b.text}</p>;
              if (b.kind === 'h2')  return <h2 key={i} style={{ fontFamily: editorFamily, fontWeight: 500, fontSize: 22, margin: '1.6em 0 0.4em', letterSpacing: -0.2 }}>{b.text}</h2>;
              return null;
            })}
            <p style={{ margin: 0, color: 'var(--m-text-2)' }}>
              The librarian metaphor needs more work
              <span className="m-cursor" style={{ display: 'inline-block', width: 2, height: '1.05em', verticalAlign: '-3px', background: 'var(--m-accent)', marginLeft: 1 }}/>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Atrium });

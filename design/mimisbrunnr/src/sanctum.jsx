// Direction 1 — SANCTUM (v2)
// Editor-led three-pane. Dashboard absorbs B's featured-card layout + vault stats + mini-graph.
// Cmd+K command palette, full Absorption flow (URL → processing → card), wikilink popover, polished editor.

function Sanctum({ theme = 'dark', editorFont = 'serif', width = 1320, height = 820 }) {
  const [aiOpen, setAiOpen]     = React.useState(true);
  const [activeTab, setTab]     = React.useState('editor');
  const [activeNote, setNote]   = React.useState('i-comp');
  const [slashOpen, setSlash]   = React.useState(false);
  const [showHITL, setHITL]     = React.useState(true);
  const [paletteOpen, setPalette] = React.useState(false);
  const [wikiOpen, setWiki]     = React.useState(false);
  const [absorbList, setAbsorb] = React.useState(ABSORPTION);
  const [absorbInput, setAbsInput] = React.useState('');

  const editorFamily =
    editorFont === 'serif' ? 'var(--m-serif)' :
    editorFont === 'sans'  ? 'var(--m-sans)'  :
                             'var(--m-mono)';

  // Cmd+K listener
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette(p => !p);
      }
      if (e.key === 'Escape') {
        setPalette(false); setSlash(false); setWiki(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Absorption — paste URL flow
  const onAbsorb = (url) => {
    if (!url || !url.trim()) return;
    const id = 'abs-' + Date.now();
    const newCard = {
      id, source: url.replace(/^https?:\/\//, '').slice(0, 40),
      title: 'Absorbing…', captured: 'just now', status: 'processing',
      summary: null, tags: [], related: [],
    };
    setAbsorb(prev => [newCard, ...prev]);
    setAbsInput('');
    // Simulate AI processing → ready
    setTimeout(() => {
      setAbsorb(prev => prev.map(c => c.id === id ? {
        ...c,
        title: 'New capture from ' + newCard.source,
        status: 'ready',
        summary: 'AI-generated summary appears here once processing completes. Three sentences distilling the core argument and any actionable claims.',
        tags: ['captured','ai'],
        related: ['On compression of thought'],
      } : c));
    }, 2400);
  };

  const sidebarW = 240;
  const aiW = aiOpen ? 320 : 0;
  const editorW = width - sidebarW - aiW;

  return (
    <div data-theme={theme} style={{
      width, height, background: 'var(--m-bg)', color: 'var(--m-text)',
      display: 'flex', overflow: 'hidden',
      borderRadius: 8, fontFamily: 'var(--m-sans)', position: 'relative',
    }}>
      {/* Title bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 36,
        background: 'var(--m-bg)', borderBottom: '1px solid var(--m-line-soft)',
        display: 'flex', alignItems: 'center', padding: '0 12px',
        zIndex: 5, gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'oklch(0.55 0.05 25)' }}/>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'oklch(0.55 0.05 80)' }}/>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'oklch(0.55 0.05 145)' }}/>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--m-text-3)' }}>
          <Mark size={13}/> mimisbrunnr · vault
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <AIStatusPill state="thinking" text="2 agents working"/>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside style={{
        marginTop: 36, width: sidebarW, height: height - 36,
        background: 'var(--m-bg)', borderRight: '1px solid var(--m-line-soft)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '12px 12px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { id: 'editor',    label: 'Editor',    icon: I.edit,  k: 'E' },
            { id: 'dashboard', label: 'Dashboard', icon: I.home,  k: 'D' },
            { id: 'graph',     label: 'Graph',     icon: I.graph, k: 'G' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '6px 9px', borderRadius: 5,
              background: activeTab === t.id ? 'var(--m-bg-3)' : 'transparent',
              border: 'none', color: activeTab === t.id ? 'var(--m-text)' : 'var(--m-text-2)',
              fontSize: 12.5, cursor: 'pointer', textAlign: 'left',
              transition: 'background 120ms, color 120ms',
            }}>
              <span style={{ color: activeTab === t.id ? 'var(--m-accent)' : 'var(--m-text-3)' }}>{t.icon(13)}</span>
              <span style={{ flex: 1 }}>{t.label}</span>
              <Kbd>⌘{t.k}</Kbd>
            </button>
          ))}
        </div>

        <div style={{ padding: '0 12px 8px' }}>
          <div onClick={() => setPalette(true)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 9px',
            background: 'var(--m-bg-2)', border: '1px solid var(--m-line-soft)',
            borderRadius: 5, color: 'var(--m-text-3)', fontSize: 12, cursor: 'pointer',
          }}>
            <span>{I.search(12)}</span>
            <span style={{ flex: 1 }}>Search vault</span>
            <Kbd>⌘K</Kbd>
          </div>
        </div>

        <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 6px' }}>
          <div style={{ padding: '8px 9px 4px', fontSize: 10.5, fontFamily: 'var(--m-mono)',
            color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>Vault</span>
            <span style={{ color: 'var(--m-text-3)', cursor: 'pointer' }}>{I.plus(11)}</span>
          </div>
          {VAULT.map((f, i) => <VaultNode key={i} node={f} activeNote={activeNote} setNote={setNote} depth={0}/>)}

          <div style={{ padding: '14px 9px 4px', fontSize: 10.5, fontFamily: 'var(--m-mono)',
            color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Tags</div>
          <div style={{ padding: '0 6px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {TAGS.map(t => (
              <span key={t.name} style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '3px 7px', fontSize: 11, fontFamily: 'var(--m-mono)',
                color: 'var(--m-text-2)', background: 'var(--m-bg-2)',
                border: '1px solid var(--m-line-soft)', borderRadius: 3, cursor: 'pointer',
              }}>
                <span style={{ color: 'var(--m-text-4)' }}>#</span>{t.name}
                <span style={{ color: 'var(--m-text-4)', marginLeft: 2 }}>{t.count}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{
          padding: '10px 12px', borderTop: '1px solid var(--m-line-soft)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--m-bg-3)', borderRadius: '50%' }}>
            <Mark size={14} color="var(--m-text)"/>
          </span>
          <div style={{ flex: 1, fontSize: 11.5, lineHeight: 1.2 }}>
            <div style={{ color: 'var(--m-text-2)' }}>local vault</div>
            <div style={{ color: 'var(--m-text-4)', fontFamily: 'var(--m-mono)', fontSize: 10 }}>~/notes · 247 files</div>
          </div>
          <span style={{ color: 'var(--m-text-3)', cursor: 'pointer' }}>{I.gear(13)}</span>
        </div>
      </aside>

      {/* CENTER */}
      <main style={{
        marginTop: 36, width: editorW, height: height - 36,
        display: 'flex', flexDirection: 'column',
        background: 'var(--m-bg)', position: 'relative',
      }}>
        {activeTab === 'editor'    && <SanctumEditor editorFamily={editorFamily} slashOpen={slashOpen} setSlash={setSlash} wikiOpen={wikiOpen} setWiki={setWiki}/>}
        {activeTab === 'dashboard' && <SanctumDashboard editorFamily={editorFamily} absorbList={absorbList} absorbInput={absorbInput} setAbsInput={setAbsInput} onAbsorb={onAbsorb} setTab={setTab}/>}
        {activeTab === 'graph'     && <SanctumGraph/>}

        <div style={{
          height: 24, padding: '0 14px', borderTop: '1px solid var(--m-line-soft)',
          display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)',
          background: 'var(--m-bg)',
        }}>
          <span>{ACTIVE_NOTE.meta}</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 14, alignItems: 'center' }}>
            <span>md</span><span>UTF-8</span><span>Ln 24, Col 41</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Dot color="var(--m-ai)" pulse/>indexed
            </span>
          </span>
        </div>
      </main>

      {/* AI PANEL */}
      {aiOpen && (
        <SanctumAIPanel width={aiW} height={height - 36}
          showHITL={showHITL} setHITL={setHITL}
          onClose={() => setAiOpen(false)}/>
      )}
      {!aiOpen && (
        <button onClick={() => setAiOpen(true)} style={{
          position: 'absolute', right: 12, top: 48, zIndex: 4,
          width: 28, height: 28, borderRadius: 6,
          background: 'var(--m-bg-3)', border: '1px solid var(--m-line-soft)',
          color: 'var(--m-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>{I.panel(14)}</button>
      )}

      {/* Command palette */}
      {paletteOpen && <CommandPalette onClose={() => setPalette(false)} setTab={setTab} setAiOpen={setAiOpen} editorFamily={editorFamily}/>}
    </div>
  );
}

function VaultNode({ node, activeNote, setNote, depth }) {
  const [open, setOpen] = React.useState(node.open !== false);
  if (node.kind === 'folder') {
    return (
      <div>
        <div onClick={() => setOpen(!open)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: `4px 9px 4px ${9 + depth * 12}px`,
          color: 'var(--m-text-2)', fontSize: 12, cursor: 'pointer',
          borderRadius: 4,
        }}>
          <span style={{ color: 'var(--m-text-4)', display: 'inline-flex' }}>
            {open ? I.chevD(11) : I.chevR(11)}
          </span>
          <span style={{ color: 'var(--m-text-3)' }}>{I.folder(13)}</span>
          <span style={{ flex: 1 }}>{node.name}</span>
        </div>
        {open && node.children && node.children.map((c, i) =>
          <VaultNode key={i} node={c} activeNote={activeNote} setNote={setNote} depth={depth + 1}/>
        )}
      </div>
    );
  }
  const active = activeNote === node.id;
  return (
    <div onClick={() => setNote(node.id)} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: `3px 9px 3px ${9 + depth * 12 + 14}px`,
      color: active ? 'var(--m-text)' : 'var(--m-text-2)',
      background: active ? 'color-mix(in oklch, var(--m-accent) 12%, transparent)' : 'transparent',
      borderLeft: active ? '2px solid var(--m-accent)' : '2px solid transparent',
      fontSize: 12, cursor: 'pointer',
    }}>
      <span style={{ color: active ? 'var(--m-accent)' : 'var(--m-text-4)', display: 'inline-flex' }}>{I.file(11)}</span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
    </div>
  );
}

// ─────────────── Editor ───────────────
function SanctumEditor({ editorFamily, slashOpen, setSlash, wikiOpen, setWiki }) {
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
      <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', padding: '52px 0 100px', position: 'relative' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 56px' }}>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)', marginBottom: 18, letterSpacing: 0.4 }}>
            ideas / on-compression-of-thought.md
          </div>

          <h1 style={{
            fontFamily: editorFamily, fontWeight: 500,
            fontSize: 38, lineHeight: 1.12, letterSpacing: -0.5,
            color: 'var(--m-text)', margin: '0 0 8px',
            textWrap: 'pretty',
          }}>{ACTIVE_NOTE.title}</h1>

          <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
            {ACTIVE_NOTE.tags.map(t => <Tag key={t} name={t} accent={t === 'idea'}/>)}
          </div>

          <div style={{
            fontFamily: editorFamily, fontSize: 17, lineHeight: 1.7,
            color: 'var(--m-text)', textWrap: 'pretty',
          }}>
            {ACTIVE_NOTE.body.map((b, i) => {
              if (b.kind === 'p')   return <p key={i} style={{ margin: '0 0 1.1em' }}>{b.text}</p>;
              if (b.kind === 'h2')  return <h2 key={i} style={{
                fontFamily: editorFamily, fontWeight: 500,
                fontSize: 22, marginTop: '1.7em', marginBottom: '0.45em',
                color: 'var(--m-text)', letterSpacing: -0.25,
              }}>{b.text}</h2>;
              if (b.kind === 'ul')  return (
                <ul key={i} style={{ margin: '0 0 1.1em', paddingLeft: 22 }}>
                  {b.items.map((it, j) => <li key={j} style={{ margin: '0 0 0.35em' }}>{it}</li>)}
                </ul>
              );
              if (b.kind === 'wikilink-p') return (
                <p key={i} style={{ margin: '0 0 1.1em' }}>
                  {b.text}
                  <span style={{
                    color: 'var(--m-accent)',
                    borderBottom: '1px dashed color-mix(in oklch, var(--m-accent) 50%, transparent)',
                    padding: '0 1px', cursor: 'pointer',
                  }}>[[{b.link}]]</span>
                  {b.after}
                </p>
              );
              return null;
            })}

            {/* Live wikilink composition with popover */}
            <p style={{ margin: '0 0 1.1em', color: 'var(--m-text-2)', position: 'relative' }}>
              The librarian metaphor needs more work — see also{' '}
              <span style={{ position: 'relative', color: 'var(--m-accent)', fontFamily: 'var(--m-mono)', fontSize: '0.92em' }}>
                [[<span onClick={() => setWiki(true)} style={{ cursor: 'pointer', borderBottom: '1px dashed color-mix(in oklch, var(--m-accent) 50%, transparent)' }}>brett</span>
                <span className="m-cursor" style={{
                  display: 'inline-block', width: 2, height: '1em', verticalAlign: '-2px',
                  background: 'var(--m-accent)', marginLeft: 1,
                }}/>
                {wikiOpen && <WikiPopover onClose={() => setWiki(false)}/>}
              </span>
            </p>
          </div>

          {slashOpen && <SlashMenu onClose={() => setSlash(false)}/>}
        </div>

        {/* Right gutter — AI hints */}
        <div style={{ position: 'absolute', top: 80, right: 12, width: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GUTTER_SUGGESTIONS.map((s, i) => (
            <div key={i} className="m-slide-in" style={{
              padding: '8px 10px',
              borderLeft: '2px solid var(--m-ai)',
              background: 'color-mix(in oklch, var(--m-ai) 6%, transparent)',
              fontSize: 11, color: 'var(--m-text-2)', lineHeight: 1.4,
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <Dot color="var(--m-ai)" size={5}/>
                <span style={{ fontFamily: 'var(--m-mono)', fontSize: 9.5, color: 'var(--m-ai)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.kind}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--m-mono)', fontSize: 9.5, color: 'var(--m-text-4)' }}>{Math.round(s.strength * 100)}</span>
              </div>
              {s.text}
            </div>
          ))}
        </div>
      </div>

      {/* Floating bottom controls */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 4,
        padding: 4, background: 'var(--m-bg-3)', border: '1px solid var(--m-line-soft)',
        borderRadius: 8, boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
      }}>
        <button onClick={() => setSlash(s => !s)} style={floatBtn(slashOpen)}>
          <span style={{ fontFamily: 'var(--m-mono)' }}>/</span> commands
        </button>
        <button style={floatBtn(false)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{I.spark(11)} ask</span>
        </button>
        <button onClick={() => setWiki(w => !w)} style={floatBtn(wikiOpen)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{I.link(11)} link</span>
        </button>
      </div>
    </div>
  );
}

function floatBtn(active) {
  return {
    padding: '5px 11px', fontSize: 11.5,
    background: active ? 'var(--m-bg-4)' : 'transparent',
    border: 'none', borderRadius: 5,
    color: active ? 'var(--m-text)' : 'var(--m-text-2)',
    cursor: 'pointer', fontFamily: 'var(--m-sans)',
  };
}

// ─────────────── Wikilink popover ───────────────
function WikiPopover({ onClose }) {
  const matches = [
    { name: 'Bret Victor — thinking tools', match: 'br_t' , folder: 'Reading' },
    { name: 'Brett — quick contact note',    match: 'brett', folder: 'Daily',   create: false },
    { name: 'Brain dump — April',            match: 'br_',  folder: 'Daily' },
  ];
  return (
    <div className="m-slide-in" onClick={(e) => e.stopPropagation()} style={{
      position: 'absolute', top: '100%', left: 0, marginTop: 6,
      width: 320, background: 'var(--m-bg-3)', border: '1px solid var(--m-line)',
      borderRadius: 6, boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      overflow: 'hidden', zIndex: 10,
    }}>
      <div style={{ padding: '8px 12px', fontSize: 10.5, fontFamily: 'var(--m-mono)', color: 'var(--m-text-4)', letterSpacing: 0.5, textTransform: 'uppercase', borderBottom: '1px solid var(--m-line-soft)', display: 'flex', alignItems: 'center' }}>
        <span>Link to note · matches "brett"</span>
        <span style={{ marginLeft: 'auto' }}><Kbd>↑↓</Kbd> <Kbd>↵</Kbd></span>
      </div>
      {matches.map((m, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', fontSize: 12,
          background: i === 0 ? 'var(--m-bg-4)' : 'transparent',
          color: 'var(--m-text-2)', cursor: 'pointer',
          borderBottom: i < matches.length - 1 ? '1px solid var(--m-line-soft)' : 'none',
        }}>
          <span style={{ color: 'var(--m-text-4)' }}>{I.file(11)}</span>
          <span style={{ flex: 1, fontFamily: 'var(--m-serif)', fontSize: 13 }}>{m.name}</span>
          <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)' }}>{m.folder}</span>
        </div>
      ))}
      <div style={{ padding: '8px 12px', fontSize: 11.5, color: 'var(--m-ai)', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--m-line-soft)', cursor: 'pointer' }}>
        <Dot color="var(--m-ai)" size={5} pulse/>
        <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>AI</span>
        <span>Create new “Brett — thinking tools” linked to 4 notes</span>
      </div>
    </div>
  );
}

function SlashMenu({ onClose }) {
  const items = [
    { cmd: '/summarize', desc: 'Summarize selection' },
    { cmd: '/expand',    desc: 'Expand idea into a paragraph' },
    { cmd: '/connect',   desc: 'Suggest related notes' },
    { cmd: '/draft',     desc: 'Generate draft from outline' },
    { cmd: '/cite',      desc: 'Find citations in vault' },
  ];
  return (
    <div className="m-slide-in" style={{
      position: 'absolute', bottom: 80, left: 56, width: 320,
      background: 'var(--m-bg-3)', border: '1px solid var(--m-line)',
      borderRadius: 7, boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      overflow: 'hidden', zIndex: 10,
    }}>
      <div style={{ padding: '8px 12px', fontSize: 10.5, fontFamily: 'var(--m-mono)', color: 'var(--m-text-4)', letterSpacing: 0.5, textTransform: 'uppercase', borderBottom: '1px solid var(--m-line-soft)' }}>AI commands</div>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', fontSize: 12,
          background: i === 0 ? 'var(--m-bg-4)' : 'transparent',
          color: 'var(--m-text-2)', cursor: 'pointer',
        }}>
          <span style={{ fontFamily: 'var(--m-mono)', color: 'var(--m-accent)', fontSize: 11.5 }}>{it.cmd}</span>
          <span style={{ flex: 1, color: 'var(--m-text-3)' }}>{it.desc}</span>
          {i === 0 && <Kbd>↵</Kbd>}
        </div>
      ))}
    </div>
  );
}

// ─────────────── Dashboard (now richer, B-styled) ───────────────
function SanctumDashboard({ editorFamily, absorbList, absorbInput, setAbsInput, onAbsorb, setTab }) {
  return (
    <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', padding: '36px 48px 60px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Monday · 27 April 2026 · Day 312 of vault</div>
          <h1 style={{ fontFamily: editorFamily, fontWeight: 400, fontSize: 36, margin: '0 0 6px', letterSpacing: -0.5, lineHeight: 1.1 }}>Three things await your attention.</h1>
          <p style={{ color: 'var(--m-text-3)', fontSize: 13.5, margin: 0, maxWidth: 560 }}>You wrote 1,247 words yesterday across 3 notes. The agent has surfaced 2 connections it would like you to confirm.</p>
        </div>

        {/* Two-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          {/* LEFT */}
          <div>
            <SectionHead label="Today's digest" hint="curated by your vault"/>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
              {DIGEST.map((d, i) => (
                <article key={d.id} style={{
                  padding: 14, background: 'var(--m-bg-2)',
                  border: '1px solid var(--m-line-soft)', borderRadius: 6,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 130,
                  transition: 'border 120ms, background 120ms',
                }}>
                  <div style={{ fontFamily: 'var(--m-mono)', fontSize: 9.5, color: 'var(--m-text-4)', letterSpacing: 0.5, textTransform: 'uppercase' }}>0{i+1} · {d.minutes} min</div>
                  <h3 style={{ fontFamily: editorFamily, fontWeight: 500, fontSize: 15, margin: 0, lineHeight: 1.3, letterSpacing: -0.1 }}>{d.title}</h3>
                  <div style={{ marginTop: 'auto', fontSize: 11.5, color: 'var(--m-text-3)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <Dot color="var(--m-ai)" size={5} pulse={i === 0}/>
                    <span>{d.why}</span>
                  </div>
                </article>
              ))}
            </div>

            {/* Absorption */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--m-line-soft)' }}>
              <div>
                <span style={{ fontSize: 11, fontFamily: 'var(--m-mono)', letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--m-text-2)' }}>Absorption queue</span>
                <span style={{ fontSize: 11, color: 'var(--m-text-4)', marginLeft: 8 }}>· {absorbList.filter(a => a.status === 'ready').length} ready · {absorbList.filter(a => a.status === 'processing').length} processing</span>
              </div>
            </div>

            {/* Capture box */}
            <form onSubmit={(e) => { e.preventDefault(); onAbsorb(absorbInput); }} style={{
              padding: '10px 12px', marginBottom: 14,
              background: 'var(--m-bg-2)', border: '1px dashed var(--m-line)',
              borderRadius: 5, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ color: 'var(--m-text-4)' }}>{I.globe(13)}</span>
              <input
                value={absorbInput}
                onChange={(e) => setAbsInput(e.target.value)}
                placeholder="Paste a URL to absorb into the vault…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--m-text)', fontSize: 12.5, fontFamily: 'var(--m-sans)',
                }}/>
              <button type="submit" style={{
                padding: '4px 10px', fontSize: 11,
                background: absorbInput ? 'var(--m-accent)' : 'var(--m-bg-3)',
                color: absorbInput ? 'oklch(0.18 0.01 80)' : 'var(--m-text-3)',
                border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500,
              }}>Absorb</button>
            </form>

            {absorbList.map(a => <AbsorptionCard key={a.id} card={a} editorFamily={editorFamily}/>)}
          </div>

          {/* RIGHT */}
          <div>
            <SectionHead label="Your vault"/>
            <div style={{ padding: 16, background: 'var(--m-bg-2)', border: '1px solid var(--m-line-soft)', borderRadius: 6, marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Notes',       value: '247',   sub: '+3 this week' },
                  { label: 'Connections', value: '1,184', sub: '32 new (AI)' },
                  { label: 'Orphans',     value: '12',    sub: 'down from 18' },
                  { label: 'Tags',        value: '47',    sub: '#pkm most active' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--m-mono)', color: 'var(--m-text-4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontFamily: editorFamily, fontWeight: 400, color: 'var(--m-text)', lineHeight: 1.05, margin: '4px 0 2px', letterSpacing: -0.4 }}>{s.value}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--m-text-3)' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Mini graph */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--m-line-soft)' }}>
                <div style={{ fontSize: 11, color: 'var(--m-text-3)', marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <span>Knowledge graph</span>
                  <span onClick={() => setTab('graph')} style={{ marginLeft: 'auto', color: 'var(--m-accent)', cursor: 'pointer', fontSize: 10.5 }}>open →</span>
                </div>
                <div style={{ background: 'oklch(0.13 0.005 240)', borderRadius: 4, height: 130, overflow: 'hidden', position: 'relative' }}>
                  <Constellation width={300} height={130} focus="p-mimis" subtle/>
                </div>
              </div>
            </div>

            <SectionHead label="Agent" hint="last 24h"/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              <AgentRow state="await"
                primary={<>Tag <span style={{ color: 'var(--m-accent)' }}>#rag</span> on 2 notes?</>}
                meta="14m ago · confidence 0.81" actions/>
              <AgentRow state="found"
                primary={<>Linked 3 notes to <span style={{ color: 'var(--m-accent)' }}>#pkm</span> cluster</>}
                meta="1h ago · auto-confirmed"/>
              <AgentRow state="found"
                primary="Detected 2 isolated notes in Reading/"
                meta="3h ago"/>
            </div>

            <SectionHead label="Activity"/>
            <div style={{ borderLeft: '1px solid var(--m-line-soft)', paddingLeft: 16, marginLeft: 4 }}>
              {ACTIVITY.slice(0, 6).map((a, i) => (
                <div key={i} style={{ position: 'relative', padding: '5px 0', display: 'flex', gap: 10, fontSize: 12, color: 'var(--m-text-2)' }}>
                  <span style={{
                    position: 'absolute', left: -20, top: 11, width: 5, height: 5, borderRadius: '50%',
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
  );
}

function AgentRow({ state, primary, meta, actions }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: state === 'await' ? 'color-mix(in oklch, var(--m-accent) 6%, var(--m-bg-2))' : 'var(--m-bg-2)',
      border: state === 'await' ? '1px solid color-mix(in oklch, var(--m-accent) 28%, var(--m-line))' : '1px solid var(--m-line-soft)',
      borderRadius: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: actions ? 8 : 4 }}>
        <Dot color={state === 'await' ? 'var(--m-accent)' : 'var(--m-ai)'} size={5}/>
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

function SectionHead({ label, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--m-line-soft)' }}>
      <span style={{ fontSize: 11, fontFamily: 'var(--m-mono)', letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--m-text-2)' }}>{label}</span>
      {hint && <span style={{ fontSize: 11, color: 'var(--m-text-4)' }}>· {hint}</span>}
    </div>
  );
}

function AbsorptionCard({ card, editorFamily }) {
  const processing = card.status === 'processing';
  return (
    <article className="m-slide-in" style={{
      padding: 14, background: 'var(--m-bg-2)',
      border: '1px solid var(--m-line-soft)', borderRadius: 6,
      marginBottom: 10, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 11, color: 'var(--m-text-3)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{I.globe(11)} {card.source}</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)' }}>{card.captured}</span>
      </div>
      <h3 style={{ fontFamily: editorFamily, fontWeight: 500, fontSize: 15, margin: '0 0 8px', lineHeight: 1.3 }}>{card.title}</h3>
      {processing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--m-ai)' }}>
          <Dot color="var(--m-ai)" pulse/>
          <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, letterSpacing: 0.4 }}>READING…</span>
          <span style={{ flex: 1, height: 2, background: 'var(--m-bg-4)', borderRadius: 2, overflow: 'hidden' }}>
            <span className="m-pulse" style={{ display: 'block', width: '60%', height: '100%', background: 'var(--m-ai)' }}/>
          </span>
        </div>
      ) : (
        <>
          <p style={{ margin: '0 0 10px', fontSize: 12.5, color: 'var(--m-text-2)', lineHeight: 1.55 }}>{card.summary}</p>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            {card.tags.map(t => <Tag key={t} name={t} ai/>)}
          </div>
          {card.related && card.related.length > 0 && (
            <div style={{ fontSize: 11.5, color: 'var(--m-text-3)', marginBottom: 10 }}>
              Related: {card.related.map((r, i) => (
                <span key={i}>
                  <span style={{ color: 'var(--m-accent)', cursor: 'pointer' }}>[[{r}]]</span>
                  {i < card.related.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={cardBtn(true)}>Save to vault</button>
            <button style={cardBtn(false)}>Edit first</button>
            <button style={{ ...cardBtn(false), marginLeft: 'auto', color: 'var(--m-text-4)' }}>{I.trash(11)}</button>
          </div>
        </>
      )}
    </article>
  );
}

function cardBtn(primary) {
  return {
    padding: '5px 11px', fontSize: 11.5,
    background: primary ? 'var(--m-accent)' : 'transparent',
    color: primary ? 'oklch(0.18 0.01 80)' : 'var(--m-text-2)',
    border: primary ? 'none' : '1px solid var(--m-line)',
    borderRadius: 4, cursor: 'pointer',
    fontFamily: 'var(--m-sans)', fontWeight: primary ? 500 : 400,
  };
}

// ─────────────── Graph ───────────────
function SanctumGraph() {
  return (
    <div style={{ flex: 1, position: 'relative', background: 'oklch(0.13 0.005 240)', overflow: 'hidden' }}>
      <Constellation width={920} height={620} focus="p-mimis"/>
      <div style={{
        position: 'absolute', top: 16, left: 16,
        padding: 10, background: 'color-mix(in oklch, var(--m-bg) 80%, transparent)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--m-line-soft)', borderRadius: 6,
        display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11.5,
      }}>
        <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Filters</div>
        {['All notes (247)', 'Linked (180)', 'Orphans (12)', 'AI suggested (23)'].map((f, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--m-text-2)', cursor: 'pointer' }}>
            <span style={{ width: 11, height: 11, border: '1px solid var(--m-line)', borderRadius: 2, background: i < 2 ? 'var(--m-accent)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {i < 2 && <span style={{ color: 'oklch(0.15 0.005 80)' }}>{I.check(9)}</span>}
            </span>
            {f}
          </label>
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        padding: '8px 12px',
        background: 'color-mix(in oklch, var(--m-bg) 80%, transparent)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--m-line-soft)', borderRadius: 6,
        display: 'flex', gap: 16, fontSize: 11, color: 'var(--m-text-3)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 16, height: 1, background: 'var(--m-line)' }}/> link</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 16, borderTop: '1px dashed var(--m-ai)' }}/> semantic</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Dot color="var(--m-accent)" size={7}/> focus</span>
      </div>
    </div>
  );
}

// ─────────────── AI Panel ───────────────
function SanctumAIPanel({ width, height, showHITL, setHITL, onClose }) {
  return (
    <aside className="m-slide-in" style={{
      marginTop: 36, width, height,
      background: 'var(--m-bg)', borderLeft: '1px solid var(--m-line-soft)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--m-line-soft)' }}>
        <Dot color="var(--m-ai)" pulse size={7}/>
        <span style={{ fontSize: 12.5, fontWeight: 500 }}>Agent</span>
        <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.5 }}>· thinking</span>
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--m-text-3)', cursor: 'pointer', display: 'flex' }}>{I.x(13)}</button>
      </div>

      <div className="m-scroll" style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Now</div>
          <div style={{ fontSize: 13, color: 'var(--m-text)', lineHeight: 1.45, marginBottom: 8 }}>
            Finding semantic neighbors for <span style={{ color: 'var(--m-accent)' }}>“On compression of thought”</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 4 }}>
            {AGENT_LOG.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: 'var(--m-text-2)' }}>
                <span style={{ marginTop: 5, flexShrink: 0 }}>
                  <Dot color={l.state === 'await' ? 'var(--m-accent)' : 'var(--m-ai)'} size={4} pulse={l.state === 'thinking'}/>
                </span>
                <span style={{ flex: 1 }}>{l.text}</span>
              </div>
            ))}
          </div>
        </div>

        {showHITL && (
          <div className="m-slide-in" style={{
            padding: 12,
            background: 'color-mix(in oklch, var(--m-accent) 7%, var(--m-bg-2))',
            border: '1px solid color-mix(in oklch, var(--m-accent) 30%, var(--m-line))',
            borderRadius: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Dot color="var(--m-accent)" size={6}/>
              <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-accent)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Confirm</span>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--m-text)', marginBottom: 10 }}>
              Tag this note as <span style={{ color: 'var(--m-accent)' }}>#compression</span>?
              <span style={{ display: 'block', color: 'var(--m-text-3)', fontSize: 11, marginTop: 4 }}>Confidence 0.74 · 6 similar notes share this tag</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setHITL(false)} style={cardBtn(true)}>Yes</button>
              <button onClick={() => setHITL(false)} style={cardBtn(false)}>No</button>
              <button style={cardBtn(false)}>Edit</button>
            </div>
          </div>
        )}

        <div>
          <div style={{ fontFamily: 'var(--m-mono)', fontSize: 10, color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Recent runs</div>
          {[
            { t: '2m', task: 'Find related to current note', n: 3 },
            { t: '14m', task: 'Absorb maggieappleton.com', n: 1 },
            { t: '1h', task: 'Cluster #pkm notes', n: 8 },
            { t: '3h', task: 'Detect orphan notes', n: 2 },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', fontSize: 12, color: 'var(--m-text-2)', borderBottom: i < 3 ? '1px solid var(--m-line-soft)' : 'none' }}>
              <span style={{ width: 26, fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)' }}>{r.t}</span>
              <span style={{ flex: 1 }}>{r.task}</span>
              <span style={{ fontFamily: 'var(--m-mono)', fontSize: 10.5, color: 'var(--m-text-4)' }}>↳ {r.n}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 12, borderTop: '1px solid var(--m-line-soft)' }}>
        <div style={{
          padding: 10, background: 'var(--m-bg-2)',
          border: '1px solid var(--m-line-soft)', borderRadius: 5,
          fontSize: 12.5, color: 'var(--m-text-3)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: 'var(--m-ai)' }}>{I.spark(12)}</span>
          <span style={{ flex: 1 }}>Ask the agent…</span>
          <Kbd>↵</Kbd>
        </div>
      </div>
    </aside>
  );
}

// ─────────────── Command Palette ───────────────
function CommandPalette({ onClose, setTab, setAiOpen, editorFamily }) {
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const all = [
    { kind: 'cmd',  icon: I.plus,   label: 'New note',                     hint: 'Create blank note',           action: () => { setTab('editor'); onClose(); } },
    { kind: 'cmd',  icon: I.home,   label: 'Open Dashboard',               hint: 'Today\'s digest',             action: () => { setTab('dashboard'); onClose(); }, kbd: '⌘D' },
    { kind: 'cmd',  icon: I.edit,   label: 'Open Editor',                  hint: 'Last note',                   action: () => { setTab('editor'); onClose(); },    kbd: '⌘E' },
    { kind: 'cmd',  icon: I.graph,  label: 'Open Graph',                   hint: 'Knowledge map',               action: () => { setTab('graph'); onClose(); },     kbd: '⌘G' },
    { kind: 'cmd',  icon: I.spark,  label: 'Toggle agent panel',           hint: '',                            action: () => { setAiOpen(p => !p); onClose(); }, ai: true },
    { kind: 'cmd',  icon: I.globe,  label: 'Absorb URL…',                  hint: 'Paste & summarize',            ai: true },
    { kind: 'cmd',  icon: I.spark,  label: 'Ask agent about current note', hint: '',                            ai: true },
    { kind: 'note', icon: I.file,   label: 'On compression of thought',    hint: 'ideas/ · 2m ago' },
    { kind: 'note', icon: I.file,   label: 'Bret Victor — thinking tools', hint: 'Reading/' },
    { kind: 'note', icon: I.file,   label: 'Absorption pipeline spec',     hint: 'Projects/' },
    { kind: 'note', icon: I.file,   label: 'Knowledge graphs in practice', hint: 'Reading/' },
    { kind: 'tag',  icon: I.hash,   label: '#pkm',                          hint: '18 notes' },
    { kind: 'tag',  icon: I.hash,   label: '#ai',                           hint: '24 notes' },
  ];

  const filtered = q
    ? all.filter(x => x.label.toLowerCase().includes(q.toLowerCase()))
    : all;

  const groups = [
    { kind: 'cmd',  label: 'Actions' },
    { kind: 'note', label: 'Notes' },
    { kind: 'tag',  label: 'Tags' },
  ];

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); const item = filtered[sel]; if (item && item.action) item.action(); else onClose(); }
  };

  let runningIdx = -1;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 20,
      background: 'color-mix(in oklch, oklch(0.05 0 0) 55%, transparent)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', paddingTop: 120,
    }}>
      <div className="m-slide-in" onClick={(e) => e.stopPropagation()} style={{
        width: 580, maxHeight: 480, background: 'var(--m-bg-3)',
        border: '1px solid var(--m-line)', borderRadius: 8,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--m-line-soft)' }}>
          <span style={{ color: 'var(--m-text-3)' }}>{I.search(14)}</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            placeholder="Search notes, run commands, ask the agent…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, color: 'var(--m-text)', fontFamily: 'var(--m-sans)',
            }}/>
          <Kbd>esc</Kbd>
        </div>
        <div className="m-scroll" style={{ overflowY: 'auto', flex: 1 }}>
          {groups.map(g => {
            const items = filtered.filter(f => f.kind === g.kind);
            if (items.length === 0) return null;
            return (
              <div key={g.kind}>
                <div style={{ padding: '8px 16px 4px', fontSize: 10, fontFamily: 'var(--m-mono)', color: 'var(--m-text-4)', letterSpacing: 0.6, textTransform: 'uppercase' }}>{g.label}</div>
                {items.map((item) => {
                  runningIdx += 1;
                  const idx = runningIdx;
                  const active = idx === sel;
                  return (
                    <div key={idx} onMouseEnter={() => setSel(idx)} onClick={() => { if (item.action) item.action(); else onClose(); }} style={{
                      display: 'flex', alignItems: 'center', gap: 11,
                      padding: '8px 16px', fontSize: 13,
                      background: active ? 'var(--m-bg-4)' : 'transparent',
                      color: active ? 'var(--m-text)' : 'var(--m-text-2)',
                      cursor: 'pointer',
                      borderLeft: active ? '2px solid var(--m-accent)' : '2px solid transparent',
                    }}>
                      <span style={{ color: item.ai ? 'var(--m-ai)' : (active ? 'var(--m-accent)' : 'var(--m-text-4)') }}>{item.icon(13)}</span>
                      <span style={{ flex: 1, fontFamily: g.kind === 'note' ? editorFamily : 'var(--m-sans)', fontSize: g.kind === 'note' ? 13.5 : 13 }}>{item.label}</span>
                      {item.hint && <span style={{ fontSize: 11, color: 'var(--m-text-4)', fontFamily: 'var(--m-mono)' }}>{item.hint}</span>}
                      {item.kbd && <Kbd>{item.kbd}</Kbd>}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: 28, textAlign: 'center', color: 'var(--m-text-4)', fontSize: 12.5 }}>
              No matches. <span style={{ color: 'var(--m-ai)', cursor: 'pointer' }}>Ask the agent →</span>
            </div>
          )}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--m-line-soft)', display: 'flex', alignItems: 'center', gap: 14, fontSize: 10.5, color: 'var(--m-text-4)', fontFamily: 'var(--m-mono)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Kbd>↑↓</Kbd> navigate</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Kbd>↵</Kbd> open</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Kbd>⌘↵</Kbd> ask agent</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Dot color="var(--m-ai)" pulse size={4}/> indexed locally
          </span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sanctum });

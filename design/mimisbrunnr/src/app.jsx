// App entry — composes the three directions on a DesignCanvas + Tweaks panel

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "editorFont": "serif"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULTS);

  // Apply theme to the artboard wrappers via CSS vars (override on a wrapper div)
  return (
    <>
      <DesignCanvas
        title="Mimisbrunnr — UI Directions"
        subtitle="Three approaches for an AI-native, local-first PKM. Drag to pan · scroll to zoom · click any artboard to focus."
      >
        <DCSection id="approaches" title="Three directions" subtitle="Same vault, same data, three different stances on what should be at the center.">
          <DCArtboard id="sanctum" label="A · Sanctum — editor-led" width={1320} height={820}>
            <ThemeWrap theme={tweaks.theme}>
              <Sanctum theme={tweaks.theme} editorFont={tweaks.editorFont}/>
            </ThemeWrap>
          </DCArtboard>
          <DCArtboard id="atrium" label="B · Atrium — dashboard home" width={1320} height={820}>
            <ThemeWrap theme={tweaks.theme}>
              <Atrium theme={tweaks.theme} editorFont={tweaks.editorFont}/>
            </ThemeWrap>
          </DCArtboard>
          <DCArtboard id="constellation" label="C · Constellation — graph home" width={1320} height={820}>
            <ThemeWrap theme={tweaks.theme}>
              <Constellation3 theme={tweaks.theme} editorFont={tweaks.editorFont}/>
            </ThemeWrap>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakRadio
            label="Mode"
            value={tweaks.theme}
            onChange={(v) => setTweak('theme', v)}
            options={[
              { value: 'dark',  label: 'Dark' },
              { value: 'light', label: 'Light' },
              { value: 'sepia', label: 'Sepia' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Editor">
          <TweakRadio
            label="Font"
            value={tweaks.editorFont}
            onChange={(v) => setTweak('editorFont', v)}
            options={[
              { value: 'serif', label: 'Serif' },
              { value: 'sans',  label: 'Sans' },
              { value: 'mono',  label: 'Mono' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// Theme wrapper — overrides palette CSS vars based on theme.
// "dark"  = the default near-black neutral declared in :root.
// "light" = bone-white paper, near-black ink.
// "sepia" = warm parchment.
function ThemeWrap({ theme, children }) {
  const themes = {
    dark: {}, // use root vars
    light: {
      '--m-bg':        'oklch(0.985 0.003 80)',
      '--m-bg-2':      'oklch(0.965 0.004 80)',
      '--m-bg-3':      'oklch(0.935 0.005 80)',
      '--m-bg-4':      'oklch(0.895 0.005 80)',
      '--m-line':      'oklch(0.835 0.005 80)',
      '--m-line-soft': 'oklch(0.905 0.004 80)',
      '--m-text':      'oklch(0.205 0.005 80)',
      '--m-text-2':    'oklch(0.395 0.006 80)',
      '--m-text-3':    'oklch(0.555 0.006 80)',
      '--m-text-4':    'oklch(0.685 0.006 80)',
      '--m-accent':    'oklch(0.58 0.10 70)',
      '--m-accent-d':  'oklch(0.48 0.11 65)',
      '--m-ai':        'oklch(0.55 0.08 220)',
      '--m-ai-d':      'oklch(0.45 0.09 220)',
    },
    sepia: {
      '--m-bg':        'oklch(0.94 0.025 78)',
      '--m-bg-2':      'oklch(0.92 0.028 78)',
      '--m-bg-3':      'oklch(0.89 0.030 76)',
      '--m-bg-4':      'oklch(0.86 0.032 76)',
      '--m-line':      'oklch(0.78 0.030 70)',
      '--m-line-soft': 'oklch(0.86 0.026 76)',
      '--m-text':      'oklch(0.275 0.025 60)',
      '--m-text-2':    'oklch(0.435 0.028 65)',
      '--m-text-3':    'oklch(0.575 0.025 65)',
      '--m-text-4':    'oklch(0.685 0.022 70)',
      '--m-accent':    'oklch(0.52 0.13 45)',
      '--m-accent-d':  'oklch(0.42 0.14 40)',
      '--m-ai':        'oklch(0.50 0.07 220)',
      '--m-ai-d':      'oklch(0.42 0.08 220)',
    },
  };
  return <div style={{ ...themes[theme], width: '100%', height: '100%' }}>{children}</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

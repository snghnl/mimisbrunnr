export default function GraphView() {
  return (
    <div style={{
      flex: 1,
      background: 'oklch(0.13 0.005 240)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12,
      color: 'var(--m-text-3)',
    }}>
      <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity={0.4}>
        <circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/>
        <path d="M7.5 7.5 11 16M16.5 7.5 13 16"/>
      </svg>
      <p style={{ fontFamily: 'var(--m-mono)', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', margin: 0 }}>
        Knowledge Graph — Phase 3
      </p>
    </div>
  );
}

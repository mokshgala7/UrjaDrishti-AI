import React from 'react';

export default function Navbar() {
  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-secondary)'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--accent-cyan)' }}>
        ⚡ UrjaDrishti-AI
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
        Region: Mumbai (Adani / BEST Grid)
      </div>
    </header>
  );
}

import React from 'react';

export default function DateRangePicker() {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input type="date" style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--border-color)' }} />
      <span>to</span>
      <input type="date" style={{ padding: '6px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--border-color)' }} />
    </div>
  );
}

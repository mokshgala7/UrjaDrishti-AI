import React from 'react';

export default function ProviderSelector({ selectedProvider, onSelectProvider }) {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {['Adani Electricity', 'BEST Undertaking'].map(provider => (
        <button
          key={provider}
          onClick={() => onSelectProvider?.(provider)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: selectedProvider === provider ? 'var(--accent-cyan)' : 'transparent',
            color: selectedProvider === provider ? '#000' : '#fff',
            cursor: 'pointer'
          }}
        >
          {provider}
        </button>
      ))}
    </div>
  );
}

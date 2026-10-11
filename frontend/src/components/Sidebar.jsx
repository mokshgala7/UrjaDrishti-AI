import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'prediction', label: '📈 Prediction Studio' },
    { id: 'models', label: '🧪 Model Lab' },
    { id: 'anomalies', label: '🚨 Anomaly Monitor' },
    { id: 'simulator', label: '💡 Bill Simulator' },
    { id: 'datasets', label: '📁 Dataset Explorer' },
    { id: 'environmental', label: '🌱 Environmental' }
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '20px 10px'
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === item.id ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === item.id ? '#fff' : 'var(--text-muted)',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

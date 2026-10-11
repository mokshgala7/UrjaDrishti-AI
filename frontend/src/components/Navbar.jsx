import React from 'react';

export default function Navbar({ activePage, onNavigate }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(250, 248, 240, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      transition: 'all 0.2s ease'
    }}>
      <div className="container" style={{
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Logo: Leaf + Spark */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            textAlign: 'left',
            padding: '4px 0'
          }}
          aria-label="UrjaDrishti AI Home"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(40, 89, 67, 0.2)',
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {/* Stylized leaf */}
              <path
                d="M19 4C14 4 8 7 6 12C4 17 6 20 6 20C6 20 9 22 14 20C19 18 20 12 20 7C20 5.5 19.5 4.5 19 4Z"
                fill="#78A66A"
              />
              {/* Electricity Bolt cutting across the leaf */}
              <path
                d="M13 3L8 12H13L11 21L18 10H13L15 3Z"
                fill="#DCECB5"
                stroke="#285943"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--primary-forest)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              UrjaDrishti <span style={{ color: 'var(--fresh-green)', fontWeight: 700 }}>AI</span>
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Mumbai Energy Calculator
            </div>
          </div>
        </button>

        {/* Center / Right Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '15px',
              fontWeight: 600,
              color: activePage === 'home' ? 'var(--primary-forest)' : 'var(--text-muted)',
              backgroundColor: activePage === 'home' ? 'var(--soft-lime)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('calculator')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '15px',
              fontWeight: 600,
              color: activePage === 'calculator' ? 'var(--primary-forest)' : 'var(--text-muted)',
              backgroundColor: activePage === 'calculator' ? 'var(--soft-lime)' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            Calculator
          </button>

          <button
            onClick={() => onNavigate('calculator')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              marginLeft: '8px',
              backgroundColor: 'var(--primary-forest)',
              color: 'var(--text-on-dark)',
              borderRadius: 'var(--radius-full)',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(40, 89, 67, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-forest)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Calculate Now</span>
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </div>
      </div>
    </header>
  );
}

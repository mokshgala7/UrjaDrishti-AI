import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      backgroundColor: '#F3EFE6',
      borderTop: '1px solid var(--border-light)',
      padding: '48px 0 32px 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '32px',
          paddingBottom: '32px',
          borderBottom: '1px solid rgba(119, 125, 115, 0.2)'
        }}>
          {/* Left Brand */}
          <div style={{ maxWidth: '420px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 4C14 4 8 7 6 12C4 17 6 20 6 20C6 20 9 22 14 20C19 18 20 12 20 7C20 5.5 19.5 4.5 19 4Z"
                    fill="#78A66A"
                  />
                  <path
                    d="M13 3L8 12H13L11 21L18 10H13L15 3Z"
                    fill="#DCECB5"
                  />
                </svg>
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--primary-forest)'
              }}>
                UrjaDrishti AI
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0
            }}>
              A simple, friendly consumer tool for Mumbai households to calculate electricity costs, simulate conservation savings, and measure environmental emissions with complete transparency.
            </p>
          </div>

          {/* Quick Navigation */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--primary-forest)',
                transition: 'opacity 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--primary-forest)',
                transition: 'opacity 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Calculator
            </button>
          </div>
        </div>

        {/* Tariff and Integrity Disclosure Note */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '12px',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)'
          }}>
            <strong>Important Transparency Notice:</strong> Calculation results depend strictly on the availability and accuracy of verified tariff schedules from MERC (Maharashtra Electricity Regulatory Commission) orders and Central Electricity Authority (CEA) grid baseline emission factors. UrjaDrishti AI does not manufacture unverified rates or make direct offset claims. Monthly variable Fuel Adjustment Charges (FAC) are explicitly disclosed when not extracted.
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-light)'
          }}>
            <span>© {new Date().getFullYear()} UrjaDrishti AI. Built for Mumbai electricity consumers.</span>
            <span>Clean Energy • Honest Data • Zero Gimmicks</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

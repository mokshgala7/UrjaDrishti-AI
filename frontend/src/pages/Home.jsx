import React from 'react';
import HeroIllustration from '../components/illustrations/HeroIllustration';
import {
  CartoonBillIcon,
  CartoonSavingsIcon,
  CartoonPlanetIcon,
  CartoonStep1Icon,
  CartoonStep2Icon,
  CartoonStep3Icon
} from '../components/illustrations/AnimatedIcons';

export default function Home({ onNavigate }) {
  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '60px' }}>
      {/* SECTION B: HERO SECTION */}
      <section style={{ paddingTop: '32px' }}>
        <div className="container hero-grid">
          {/* LEFT SIDE */}
          <div style={{ maxWidth: '540px' }}>
            {/* Small introductory label */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--soft-lime)',
              color: 'var(--primary-forest)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '14px' }}>⚡</span>
              SMARTER ENERGY. GREENER FUTURE.
            </div>

            {/* Main heading */}
            <h1 style={{
              fontSize: 'clamp(32px, 4.2vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-charcoal)',
              lineHeight: 1.15,
              marginBottom: '20px'
            }}>
              Understand your electricity.{' '}
              <span style={{
                color: 'var(--primary-forest)',
                position: 'relative',
                display: 'inline-block'
              }}>
                Make every unit count.
              </span>
            </h1>

            {/* Supporting text */}
            <p style={{
              fontSize: '18px',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              Estimate your electricity bill, explore ways to save, and discover how cleaner energy can make a difference.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px'
            }}>
              <button
                onClick={() => onNavigate('calculator')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--primary-forest)',
                  color: 'var(--text-on-dark)',
                  padding: '16px 32px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '16px',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-forest)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <span>Calculate My Electricity Cost</span>
                <span style={{ fontSize: '18px' }}>→</span>
              </button>

              <a
                href="#how-it-works"
                onClick={scrollToHowItWorks}
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-full)',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-forest)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                How does it work? ↓
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: CARTOON ILLUSTRATION */}
          <div>
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* SECTION C: THREE SIMPLE BENEFITS */}
      <section>
        <div className="container">
          <div style={{
            textAlign: 'center',
            maxWidth: '560px',
            margin: '0 auto 48px auto'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '8px'
            }}>
              Simple energy clarity for every home
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
              No complicated spreadsheets or technical jargon. Just clear answers.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Benefit 1 */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '36px 28px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <CartoonBillIcon size={46} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--primary-forest)',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                1. Understand Your Bill
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Get a clearer estimate of your electricity costs based on verified Mumbai tariff slabs.
              </p>
            </div>

            {/* Benefit 2 */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '36px 28px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <CartoonSavingsIcon size={46} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--primary-forest)',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                2. Explore Savings
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                See how changes in electricity consumption can affect your estimated bill through non-linear slab rates.
              </p>
            </div>

            {/* Benefit 3 */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '36px 28px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <CartoonPlanetIcon size={46} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--primary-forest)',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                3. Measure Environmental Impact
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Understand the estimated carbon emissions associated with electricity consumption and illustrative tree equivalents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: HOW IT WORKS */}
      <section id="how-it-works">
        <div className="container">
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 36px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              textAlign: 'center',
              maxWidth: '540px',
              margin: '0 auto 40px auto'
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--fresh-green)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px'
              }}>
                Simple 3-Step Process
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800 }}>
                How It Works
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '32px',
              position: 'relative'
            }}>
              {/* Step 1 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-lime-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <CartoonStep1Icon size={42} />
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: 'var(--fresh-green)',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  Step 1
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                  Enter Your Usage
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Provide your monthly electricity consumption or adjust the slider to match your typical bill units.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-lime-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <CartoonStep2Icon size={42} />
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: 'var(--fresh-green)',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  Step 2
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                  Calculate Your Cost
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Estimate your electricity charges using applicable verified tariff orders from MERC without hidden formulas.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-lime-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <CartoonStep3Icon size={42} />
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: 'var(--fresh-green)',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  Step 3
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                  Understand Your Impact
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Explore your itemised bill, examine potential savings scenarios, and see estimated greenhouse emissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: SIMPLE CALL TO ACTION */}
      <section>
        <div className="container">
          <div style={{
            backgroundColor: 'var(--primary-forest)',
            color: 'var(--text-on-dark)',
            borderRadius: 'var(--radius-xl)',
            padding: '56px 36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background subtle leaf shapes */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundColor: 'rgba(220, 236, 181, 0.08)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-20px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              backgroundColor: 'rgba(120, 166, 106, 0.1)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(220, 236, 181, 0.2)',
                color: 'var(--soft-lime)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '16px'
              }}>
                Fast & Interactive
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '16px'
              }}>
                Ready to understand your electricity bill?
              </h2>
              <p style={{
                fontSize: '17px',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.6,
                marginBottom: '32px'
              }}>
                Start with a few details and get an estimate in seconds.
              </p>
              <button
                onClick={() => onNavigate('calculator')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--soft-lime)',
                  color: 'var(--primary-forest)',
                  padding: '16px 36px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '16px',
                  fontWeight: 800,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--soft-lime)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>Open Calculator</span>
                <span style={{ fontSize: '18px' }}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

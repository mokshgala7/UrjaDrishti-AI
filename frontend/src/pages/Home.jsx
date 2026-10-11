import React from 'react';
import HeroIllustration from '../components/illustrations/HeroIllustration';
import {
  FriendlyLightbulb,
  AnimatedCeilingFan,
  FriendlyPlug,
  FriendlySolarPanel
} from '../components/illustrations/CartoonObjects';

import robotBillImg from '../assets/illustrations/robot-bill.jpg';
import humanRobotMeterImg from '../assets/illustrations/human-robot-meter.jpg';
import robotLeafTreeImg from '../assets/illustrations/robot-leaf-tree.jpg';
import step1PersonImg from '../assets/illustrations/step1-person-input.jpg';
import step2RobotCalcImg from '../assets/illustrations/step2-robot-calculating.jpg';
import step3PersonReviewImg from '../assets/illustrations/step3-person-reviewing.jpg';
import robotPointingCtaImg from '../assets/illustrations/robot-pointing-cta.jpg';

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
      {/* ========================================================= */}
      {/* SECTION B: HERO SECTION                                   */}
      {/* ========================================================= */}
      <section style={{ paddingTop: '32px' }}>
        <div className="container hero-grid">
          {/* LEFT SIDE: HEADING & INTRO */}
          <div style={{ maxWidth: '540px' }}>
            {/* Small introductory badge */}
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
              Meet <strong>UrjaBot</strong>, your friendly electricity assistant. Estimate your electricity bill, explore ways to save, and discover how cleaner energy makes a difference.
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

          {/* RIGHT SIDE: HERO CARTOON ILLUSTRATION */}
          <div>
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C: THREE SIMPLE BENEFITS                          */}
      {/* ========================================================= */}
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
            {/* Benefit 1: Understand Your Bill */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
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
              {/* Illustration Frame */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-sm)',
                border: '2px solid var(--border-light)'
              }}>
                <img
                  src={robotBillImg}
                  alt="UrjaBot holding an electricity bill"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
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

            {/* Benefit 2: Explore Savings */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
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
              {/* Illustration Frame */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-sm)',
                border: '2px solid var(--border-light)'
              }}>
                <img
                  src={humanRobotMeterImg}
                  alt="Person and UrjaBot examining smart electricity meter"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
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
                See how changes in electricity consumption affect your estimated bill through non-linear slab rates.
              </p>
            </div>

            {/* Benefit 3: Environmental Impact */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
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
              {/* Illustration Frame */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)',
                marginBottom: '20px',
                boxShadow: 'var(--shadow-sm)',
                border: '2px solid var(--border-light)'
              }}>
                <img
                  src={robotLeafTreeImg}
                  alt="UrjaBot holding glowing leaf beside sapling tree"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--primary-forest)',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                3. Environmental Impact
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Understand the estimated carbon emissions associated with electricity consumption and illustrative tree equivalents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION D: HOW IT WORKS                                   */}
      {/* ========================================================= */}
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
              gap: '32px'
            }}>
              {/* Step 1 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-lime-soft)',
                  marginBottom: '18px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '2px solid var(--border-light)'
                }}>
                  <img
                    src={step1PersonImg}
                    alt="Step 1: Person entering electricity consumption"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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
                  width: '130px',
                  height: '130px',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-lime-soft)',
                  marginBottom: '18px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '2px solid var(--border-light)'
                }}>
                  <img
                    src={step2RobotCalcImg}
                    alt="Step 2: UrjaBot calculating estimated bill"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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
                  width: '130px',
                  height: '130px',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-lime-soft)',
                  marginBottom: '18px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '2px solid var(--border-light)'
                }}>
                  <img
                    src={step3PersonReviewImg}
                    alt="Step 3: Reviewing results with UrjaBot"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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

      {/* ========================================================= */}
      {/* SECTION E: CALL TO ACTION WITH POINTING MASCOT            */}
      {/* ========================================================= */}
      <section>
        <div className="container">
          <div style={{
            backgroundColor: 'var(--primary-forest)',
            color: 'var(--text-on-dark)',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 36px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background decorative subtle circles */}
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

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '32px',
              position: 'relative',
              zIndex: 1,
              maxWidth: '960px',
              margin: '0 auto'
            }}>
              {/* Mascot pointing illustration */}
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: '4px solid var(--soft-lime)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                flexShrink: 0,
                margin: '0 auto',
                animation: 'floatSlow 4s ease-in-out infinite'
              }}>
                <img
                  src={robotPointingCtaImg}
                  alt="UrjaBot cheerfully pointing towards the calculate button"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Text & Button */}
              <div style={{ flex: '1 1 380px', textAlign: 'left' }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(220, 236, 181, 0.2)',
                  color: 'var(--soft-lime)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '12px'
                }}>
                  Fast & Interactive
                </div>
                <h2 style={{
                  fontSize: 'clamp(26px, 3.2vw, 36px)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  marginBottom: '12px'
                }}>
                  Ready to calculate your electricity bill?
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.88)',
                  lineHeight: 1.5,
                  marginBottom: '24px'
                }}>
                  UrjaBot will calculate your tariff slabs, estimate environmental impact, and help you discover savings in seconds.
                </p>
                <button
                  onClick={() => onNavigate('calculator')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
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
        </div>
      </section>
    </div>
  );
}

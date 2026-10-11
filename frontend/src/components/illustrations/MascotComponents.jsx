import React from 'react';
import leafMascotImg from '../../assets/illustrations/leaf-mascot.jpg';
import cuteMeterImg from '../../assets/illustrations/cute-meter.jpg';
import celebrationImg from '../../assets/illustrations/celebrating-savings.jpg';

// Cute Leaf Character Card for Environmental Impact
export function LeafImpactMascot({ co2Kg, treesOffset }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      backgroundColor: 'var(--bg-lime-soft)',
      border: '1px solid var(--soft-lime-dark)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      marginTop: '16px'
    }}>
      <div style={{
        width: '68px',
        height: '68px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid #FFFFFF',
        boxShadow: 'var(--shadow-sm)',
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        animation: 'swaySoft 4s ease-in-out infinite'
      }}>
        <img
          src={leafMascotImg}
          alt="Cheerful green leaf sustainability mascot"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--primary-forest)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Clean Energy Perspective
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-charcoal)',
          marginTop: '2px',
          lineHeight: 1.4
        }}>
          Produces ~<strong>{co2Kg} kg</strong> of CO₂. Absorbing this annually equates to the work of ~<strong>{treesOffset}</strong> mature trees.
        </div>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginTop: '4px'
        }}>
          Based on CEA Western Regional baseline (0.716 kg CO₂/kWh). Illustrative equivalence, not a direct offset.
        </div>
      </div>
    </div>
  );
}

// Interactive Meter Illustration Display
export function MeterCharacterHeader({ units }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '12px 16px',
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '20px'
    }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '2px solid var(--fresh-green)',
        flexShrink: 0,
        backgroundColor: '#FFFFFF'
      }}>
        <img
          src={cuteMeterImg}
          alt="Cute electric meter mascot"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Smart Meter Simulation
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 800,
          color: 'var(--primary-forest)',
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}>
          <span>{units}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>kWh / Month</span>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-lime-soft)',
        color: 'var(--primary-forest)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '11px',
        fontWeight: 700
      }}>
        1 Unit = 1 kWh
      </div>
    </div>
  );
}

// Savings Celebration Card
export function SavingsCelebrationCard({ originalBill, reducedBill, percent, unitReduction }) {
  const savings = Math.max(0, Math.round(originalBill - reducedBill));

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      backgroundColor: 'var(--accent-orange-light)',
      border: '1px solid rgba(242, 166, 90, 0.4)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      marginTop: '16px',
      animation: 'popIn 0.3s ease-out'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid #FFFFFF',
        boxShadow: 'var(--shadow-sm)',
        flexShrink: 0,
        backgroundColor: '#FFFFFF'
      }}>
        <img
          src={celebrationImg}
          alt="Happy character celebrating savings"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#B45309',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {percent}% Conservation Opportunity
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-charcoal)',
          marginTop: '2px'
        }}>
          Save approximately <span style={{ color: 'var(--primary-forest)', fontSize: '16px' }}>₹{savings.toLocaleString()}</span> / month
        </div>
        <div style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: '2px'
        }}>
          By trimming {unitReduction} kWh. Calculated through non-linear slab rates, preserving fixed charges.
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import robotReceiptImg from '../../assets/illustrations/robot-holding-receipt.jpg';
import robotLeafTreeImg from '../../assets/illustrations/robot-leaf-tree.jpg';
import cuteMeterImg from '../../assets/illustrations/cute-meter.jpg';
import celebrationImg from '../../assets/illustrations/celebrating-savings.jpg';
import robotPointingImg from '../../assets/illustrations/robot-pointing-cta.jpg';

/**
 * Robot Mascot Badge for Page Headers (e.g., Calculator header)
 */
export function RobotHeaderBadge({ size = 46 }) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2.5px solid var(--primary-forest)',
      backgroundColor: '#FFFFFF',
      boxShadow: 'var(--shadow-sm)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'floatSlow 4s ease-in-out infinite'
    }}>
      <img
        src={robotPointingImg}
        alt="UrjaBot Mascot"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

/**
 * Robot Mascot Holding Receipt Card (Calculator Result Section)
 */
export function RobotBillReceiptCard({ totalBill, provider, financialYear }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      backgroundColor: 'var(--bg-lime-soft)',
      border: '1.5px solid var(--soft-lime-dark)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      marginBottom: '20px',
      animation: 'popIn 0.3s ease-out'
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
        animation: 'robotWiggle 4s ease-in-out infinite'
      }}>
        <img
          src={robotReceiptImg}
          alt="UrjaBot holding electricity bill receipt"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: 'var(--primary-forest)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Verified MERC Bill Estimate
        </div>
        <div style={{
          fontSize: '15px',
          fontWeight: 800,
          color: 'var(--text-charcoal)',
          marginTop: '2px'
        }}>
          ₹{totalBill?.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>calculated by UrjaBot</span>
        </div>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          marginTop: '2px'
        }}>
          {provider} • {financialYear} residential LT-I schedule
        </div>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        color: 'var(--primary-forest)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: '12px',
        fontWeight: 800,
        border: '1px solid var(--border-light)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>✓</span>
        <span>Valid</span>
      </div>
    </div>
  );
}

/**
 * Environmental Impact Mascot Card with UrjaBot holding glowing leaf
 */
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
          src={robotLeafTreeImg}
          alt="UrjaBot holding glowing leaf beside green sapling tree"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 800,
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

/**
 * Interactive Meter Illustration Header for Calculator
 */
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
      marginBottom: '16px'
    }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '2px solid var(--fresh-green)',
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        animation: 'floatSlow 4s ease-in-out infinite'
      }}>
        <img
          src={cuteMeterImg}
          alt="Cute electric meter mascot"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Smart Meter Telemetry
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 800,
          color: 'var(--primary-forest)',
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}>
          <span key={units} style={{ animation: 'digitBump 0.2s ease-out' }}>{units}</span>
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

/**
 * Savings Celebration Card
 */
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
        backgroundColor: '#FFFFFF',
        animation: 'robotWiggle 3.5s ease-in-out infinite'
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
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>🎉</span>
          <span>{percent}% Conservation Opportunity</span>
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

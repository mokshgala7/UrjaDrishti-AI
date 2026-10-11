import React from 'react';

/**
 * Friendly Cartoon Lightbulb with expressive eyes & animated warm glow
 */
export function FriendlyLightbulb({ size = 52, glowing = true }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: glowing ? 'bulbGlow 3.5s ease-in-out infinite' : 'none'
    }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Glow backdrop */}
        <circle cx="32" cy="28" r="22" fill="#FDF3E7" />
        {/* Bulb Glass */}
        <path
          d="M32 8C20.95 8 12 16.95 12 28C12 34.5 15.2 40.2 20.2 43.8C21.4 44.7 22.1 46.1 22.1 47.6V49H41.9V47.6C41.9 46.1 42.6 44.7 43.8 43.8C48.8 40.2 52 34.5 52 28C52 16.95 43.05 8 32 8Z"
          fill="#FDE68A"
          stroke="#285943"
          strokeWidth="2.5"
        />
        {/* Highlight sheen */}
        <path
          d="M20 20C22 15 27 12 32 12"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Cute Face */}
        <circle cx="26" cy="27" r="2.2" fill="#285943" />
        <circle cx="38" cy="27" r="2.2" fill="#285943" />
        <path
          d="M28 32Q32 36 36 32"
          stroke="#285943"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Rosy Cheeks */}
        <ellipse cx="23" cy="30" rx="2" ry="1.2" fill="#F2A65A" opacity="0.6" />
        <ellipse cx="41" cy="30" rx="2" ry="1.2" fill="#F2A65A" opacity="0.6" />
        {/* Metallic Base */}
        <rect x="23" y="49" width="18" height="3" rx="1.5" fill="#9EA59A" stroke="#285943" strokeWidth="1.5" />
        <rect x="24" y="53" width="16" height="3" rx="1.5" fill="#9EA59A" stroke="#285943" strokeWidth="1.5" />
        <path d="M26 57H38C38 59 35.5 61 32 61C28.5 61 26 59 26 57Z" fill="#777D73" stroke="#285943" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/**
 * Friendly Cartoon Ceiling Fan with rotating blades
 */
export function AnimatedCeilingFan({ size = 56, speedSeconds = 6 }) {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Downrod */}
      <div style={{
        width: '4px',
        height: '10px',
        backgroundColor: '#285943',
        borderRadius: '2px'
      }} />
      {/* Rotating Blades & Smiling Hub */}
      <div style={{
        animation: `fanRotateSlow ${speedSeconds}s linear infinite`,
        transformOrigin: 'center center'
      }}>
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          {/* Blade 1 (Top) */}
          <rect x="29" y="4" width="6" height="24" rx="3" fill="#DCECB5" stroke="#285943" strokeWidth="1.8" />
          {/* Blade 2 (Bottom Left) */}
          <rect
            x="29"
            y="4"
            width="6"
            height="24"
            rx="3"
            fill="#DCECB5"
            stroke="#285943"
            strokeWidth="1.8"
            transform="rotate(120 32 32)"
          />
          {/* Blade 3 (Bottom Right) */}
          <rect
            x="29"
            y="4"
            width="6"
            height="24"
            rx="3"
            fill="#DCECB5"
            stroke="#285943"
            strokeWidth="1.8"
            transform="rotate(240 32 32)"
          />
          {/* Center Motor Hub */}
          <circle cx="32" cy="32" r="10" fill="#78A66A" stroke="#285943" strokeWidth="2.2" />
          {/* Smiling Hub Face */}
          <circle cx="29" cy="30" r="1.5" fill="#FFFFFF" />
          <circle cx="35" cy="30" r="1.5" fill="#FFFFFF" />
          <path d="M30 34Q32 36 34 34" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Friendly Cartoon Plug character
 */
export function FriendlyPlug({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Metal Prongs */}
      <rect x="16" y="6" width="3.5" height="10" rx="1.5" fill="#9EA59A" stroke="#285943" strokeWidth="1.5" />
      <rect x="28.5" y="6" width="3.5" height="10" rx="1.5" fill="#9EA59A" stroke="#285943" strokeWidth="1.5" />
      {/* Plug Body */}
      <rect x="12" y="14" width="24" height="20" rx="7" fill="#EEF6DF" stroke="#285943" strokeWidth="2.2" />
      {/* Face */}
      <circle cx="20" cy="22" r="1.8" fill="#285943" />
      <circle cx="28" cy="22" r="1.8" fill="#285943" />
      <path d="M21 26Q24 29 27 26" stroke="#285943" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cord */}
      <path d="M24 34V42C24 44 26 46 28 46" stroke="#78A66A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Friendly Rooftop Solar Panel Illustration
 */
export function FriendlySolarPanel({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Frame */}
      <polygon points="12,18 52,14 46,50 6,54" fill="#285943" stroke="#285943" strokeWidth="2" strokeLinejoin="round" />
      {/* Blue Cells */}
      <polygon points="14,20 50,16 44,48 8,52" fill="#3B82F6" opacity="0.85" />
      {/* Grid lines */}
      <line x1="26" y1="18" x2="20" y2="50" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
      <line x1="38" y1="17" x2="32" y2="49" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
      <line x1="11" y1="36" x2="47" y2="32" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
      {/* Sun Ray Reflection */}
      <polygon points="34,17 44,16 38,48 28,49" fill="#FFFFFF" opacity="0.25" />
      {/* Cute Little Sun Spark */}
      <circle cx="48" cy="14" r="3" fill="#F59E0B" />
    </svg>
  );
}

/**
 * Green Energy Leaf Character
 */
export function GreenEnergyLeaf({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 6C14 12 10 24 16 34C20 40 28 42 34 38C40 34 42 22 38 14C36 10 30 6 24 6Z"
        fill="#78A66A"
        stroke="#285943"
        strokeWidth="2.2"
      />
      {/* Vein */}
      <path d="M24 10C24 20 25 32 23 42" stroke="#DCECB5" strokeWidth="2" strokeLinecap="round" />
      {/* Face */}
      <circle cx="20" cy="22" r="1.8" fill="#285943" />
      <circle cx="28" cy="22" r="1.8" fill="#285943" />
      <path d="M22 26Q24 29 26 26" stroke="#285943" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Interactive Smart Electricity Meter
 * Displays animated digital units that update with user slider!
 */
export function InteractiveElectricityMeter({ units = 100, width = 240 }) {
  // Clamp angle for gauge needle (from -60deg at 0 kWh to +60deg at 1000 kWh)
  const angle = -60 + (Math.min(1000, Math.max(0, units)) / 1000) * 120;

  return (
    <div style={{
      width: '100%',
      maxWidth: `${width}px`,
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      border: '2px solid var(--fresh-green)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Cute Antenna & Ears */}
      <div style={{
        position: 'absolute',
        top: '6px',
        right: '12px',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#10B981',
        boxShadow: '0 0 8px #10B981'
      }} />

      {/* Meter Header Label */}
      <div style={{
        fontSize: '11px',
        fontWeight: 800,
        color: 'var(--primary-forest)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>⚡</span>
        <span>SMART METER DIAL</span>
      </div>

      {/* Analog Gauge with Live Moving Needle */}
      <div style={{ position: 'relative', width: '90px', height: '50px' }}>
        <svg width="90" height="50" viewBox="0 0 90 50">
          {/* Gauge Arc */}
          <path
            d="M 15 45 A 35 35 0 0 1 75 45"
            fill="none"
            stroke="var(--bg-subtle)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Active Colored Arc */}
          <path
            d="M 15 45 A 35 35 0 0 1 75 45"
            fill="none"
            stroke="var(--fresh-green)"
            strokeWidth="8"
            strokeDasharray="110"
            strokeDashoffset={Math.max(0, 110 - (units / 1000) * 110)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.25s ease' }}
          />
          {/* Center Pivot */}
          <circle cx="45" cy="45" r="5" fill="#285943" />
          {/* Gauge Needle */}
          <line
            x1="45"
            y1="45"
            x2="45"
            y2="15"
            stroke="#F2A65A"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              transformOrigin: '45px 45px',
              transform: `rotate(${angle}deg)`,
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
        </svg>
      </div>

      {/* Digital LCD Display with Live Value */}
      <div style={{
        backgroundColor: '#1C2E24',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: '6px',
        width: '100%',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
        border: '1px solid #285943'
      }}>
        <span
          key={units}
          style={{
            fontFamily: 'monospace',
            fontSize: '20px',
            fontWeight: 800,
            color: '#34D399',
            letterSpacing: '0.08em',
            animation: 'digitBump 0.2s ease-out'
          }}
        >
          {String(units).padStart(4, '0')}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#A7F3D0' }}>
          kWh
        </span>
      </div>

      {/* Cute Friendly Meter Face */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#285943' }} />
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)'
        }}>
          {units <= 100 ? '🌱 Baseline Tier' : units <= 300 ? '⚡ Standard Tier' : '🔥 Higher Tier'}
        </div>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#285943' }} />
      </div>
    </div>
  );
}

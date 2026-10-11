import React from 'react';

// Cute cartoon bill icon with rupee and green leaf
export function CartoonBillIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="12" y="8" width="40" height="48" rx="8" fill="#FFFFFF" stroke="#285943" strokeWidth="2.5" />
      <path d="M20 18H44" stroke="#DCECB5" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 28H36" stroke="#E8E3D7" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 36H32" stroke="#E8E3D7" strokeWidth="3" strokeLinecap="round" />
      {/* Rupee Symbol Badge */}
      <circle cx="42" cy="38" r="11" fill="#78A66A" />
      <text x="42" y="43" fill="#FFFFFF" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">₹</text>
      {/* Cartoon smiling face */}
      <circle cx="24" cy="46" r="2" fill="#285943" />
      <circle cx="32" cy="46" r="2" fill="#285943" />
      <path d="M26 49Q28 52 30 49" stroke="#285943" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Cheerful savings icon with sprout and coin
export function CartoonSavingsIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Pot */}
      <path d="M18 42L22 56H42L46 42H18Z" fill="#F2A65A" stroke="#285943" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 40H48" stroke="#285943" strokeWidth="3" strokeLinecap="round" />
      {/* Cartoon eyes on pot */}
      <circle cx="28" cy="48" r="1.8" fill="#285943" />
      <circle cx="36" cy="48" r="1.8" fill="#285943" />
      <path d="M30 51Q32 53 34 51" stroke="#285943" strokeWidth="1.5" strokeLinecap="round" />
      {/* Sprout plant */}
      <path d="M32 40V24" stroke="#78A66A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 30C26 26 22 30 22 30C22 30 24 36 32 34" fill="#78A66A" stroke="#285943" strokeWidth="1.5" />
      <path d="M32 26C38 22 42 26 42 26C42 26 40 32 32 30" fill="#DCECB5" stroke="#285943" strokeWidth="1.5" />
      {/* Floating golden coin with rupee */}
      <circle cx="32" cy="14" r="10" fill="#F59E0B" stroke="#285943" strokeWidth="2" />
      <text x="32" y="18" fill="#FFFFFF" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">₹</text>
    </svg>
  );
}

// Planet / leaf sustainability icon
export function CartoonPlanetIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="22" fill="#DCECB5" stroke="#285943" strokeWidth="2.5" />
      {/* Land shapes */}
      <path d="M22 24C26 22 30 24 33 22C36 20 40 22 44 26C46 30 42 36 38 38C34 40 28 42 24 38C20 34 18 28 22 24Z" fill="#78A66A" />
      {/* Cute smiling face */}
      <circle cx="28" cy="31" r="2" fill="#285943" />
      <circle cx="36" cy="31" r="2" fill="#285943" />
      <path d="M30 35Q32 38 34 35" stroke="#285943" strokeWidth="1.8" strokeLinecap="round" />
      {/* Small leaf on top */}
      <path d="M32 10C35 5 40 8 40 8C40 8 39 13 34 12" fill="#78A66A" stroke="#285943" strokeWidth="1.5" />
    </svg>
  );
}

// Step 1: Input meter icon
export function CartoonStep1Icon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <rect x="8" y="10" width="40" height="36" rx="10" fill="#EEF6DF" stroke="#285943" strokeWidth="2.5" />
      <rect x="15" y="16" width="26" height="14" rx="4" fill="#FFFFFF" stroke="#78A66A" strokeWidth="1.5" />
      <text x="28" y="27" fill="#285943" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="monospace">350 kWh</text>
      <circle cx="20" cy="38" r="3" fill="#78A66A" />
      <circle cx="36" cy="38" r="3" fill="#F2A65A" />
      <path d="M24 38H32" stroke="#285943" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Step 2: Tariff calculator icon
export function CartoonStep2Icon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <rect x="10" y="8" width="36" height="40" rx="8" fill="#FFFFFF" stroke="#285943" strokeWidth="2.5" />
      <rect x="16" y="14" width="24" height="10" rx="3" fill="#DCECB5" />
      <text x="28" y="22" fill="#285943" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">MERC TARIFF</text>
      <circle cx="18" cy="31" r="2.5" fill="#78A66A" />
      <circle cx="28" cy="31" r="2.5" fill="#78A66A" />
      <circle cx="38" cy="31" r="2.5" fill="#78A66A" />
      <circle cx="18" cy="40" r="2.5" fill="#78A66A" />
      <circle cx="28" cy="40" r="2.5" fill="#78A66A" />
      <rect x="34" y="37" width="8" height="6" rx="2" fill="#F2A65A" />
    </svg>
  );
}

// Step 3: Clean impact / tree icon
export function CartoonStep3Icon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M28 46V32" stroke="#285943" strokeWidth="4" strokeLinecap="round" />
      <circle cx="28" cy="24" r="16" fill="#78A66A" stroke="#285943" strokeWidth="2.5" />
      <circle cx="23" cy="21" r="10" fill="#DCECB5" />
      {/* Cartoon eyes on tree */}
      <circle cx="25" cy="24" r="1.8" fill="#285943" />
      <circle cx="31" cy="24" r="1.8" fill="#285943" />
      <path d="M26 27Q28 29 30 27" stroke="#285943" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

import React from 'react';

// Dhow sail icon
export function DhowIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 6V54" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 10C40 18 52 38 52 48H32V10Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 18C26 26 14 38 12 48H32V18Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 50C16 54 48 54 58 50C54 58 10 58 6 50Z" fill={color} />
      <path d="M4 56C18 60 46 60 60 56" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  );
}

// Swahili Geometric Carved Lattice Motif (as background tile or accent)
export function SwahiliPatternBg({ className = "opacity-10", color = "#0B2545" }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="swahili-lattice" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke={color} strokeWidth="1" />
          <path d="M20 6L34 20L20 34L6 20Z" fill="none" stroke={color} strokeWidth="0.75" />
          <circle cx="20" cy="20" r="3" fill={color} />
          <circle cx="0" cy="0" r="2" fill={color} />
          <circle cx="40" cy="0" r="2" fill={color} />
          <circle cx="0" cy="40" r="2" fill={color} />
          <circle cx="40" cy="40" r="2" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#swahili-lattice)" />
    </svg>
  );
}

// Luggage Tag Grommet / Punch Hole
export function TagGrommet({ className = "w-5 h-5", metalColor = "#13B5B1" }) {
  return (
    <div className={`rounded-full border-2 border-amber-600/40 bg-[#F6EBD9] shadow-inner flex items-center justify-center ${className}`}>
      <div className="w-2.5 h-2.5 rounded-full bg-[#0B2545] shadow-xs"></div>
    </div>
  );
}

// Swahili Coral Stone Arch Frame
export function FortJesusArch({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden swahili-arch border-2 border-amber-800/20 shadow-xl ${className}`}>
      {children}
    </div>
  );
}

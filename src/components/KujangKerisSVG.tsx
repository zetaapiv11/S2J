import React from 'react';

export const KujangSVG: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none drop-shadow-[0_0_25px_rgba(16,185,129,0.3)] ${className}`}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Gradients */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBDF83" />
          <stop offset="40%" stopColor="#EAB308" />
          <stop offset="70%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#854D0E" />
        </linearGradient>
        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="85%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      {/* Decorative Traditional Circular Motif Behind */}
      <circle cx="100" cy="300" r="85" stroke="url(#goldGradient)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
      <circle cx="100" cy="300" r="75" stroke="#10B981" strokeWidth="1" opacity="0.3" />

      {/* Main Kujang Blade (Organic traditional crescent shape) */}
      <g filter="url(#gold-glow)">
        {/* Cutting blade part */}
        <path
          d="M 125 150 
             C 125 180, 115 220, 105 250 
             C 95 280, 80 320, 82 360 
             C 84 390, 95 420, 100 450 
             L 90 450 
             C 85 410, 70 380, 68 350 
             C 65 310, 78 260, 90 210 
             C 100 170, 110 120, 125 150 Z"
          fill="url(#bladeGradient)"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
        />

        {/* The crescent hook/crown at the top ("papatuk" and "eluk") */}
        <path
          d="M 125 150 
             C 135 140, 145 130, 138 115 
             C 132 105, 120 115, 115 125 
             C 105 140, 110 160, 125 150 Z"
          fill="url(#goldGradient)"
        />

        {/* Comb elements on back ("Eluk" hook highlights) */}
        <path
          d="M 68 350
             C 50 345, 45 358, 55 365
             C 65 370, 60 380, 68 385"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
        />
        <path
          d="M 80 290
             C 65 285, 60 295, 70 302
             C 80 308, 75 315, 78 320"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
        />

        {/* Sacred Holes (Lubang Kujang / "Mata" - representing traditional elements) */}
        {/* 5 holes indicating high value */}
        <circle cx="102" cy="220" r="4.5" fill="#13151A" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <circle cx="95" cy="260" r="4" fill="#13151A" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <circle cx="89" cy="300" r="3.5" fill="#13151A" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <circle cx="85" cy="340" r="3" fill="#13151A" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <circle cx="86" cy="380" r="2.5" fill="#13151A" stroke="url(#goldGradient)" strokeWidth="1.5" />

        {/* Fine gold ornament engraving line along the spine */}
        <path
          d="M 112 180 C 104 230, 92 310, 93 392"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Blade ring connection / Selut ring */}
        <ellipse cx="95" cy="450" rx="12" ry="5" fill="url(#goldGradient)" stroke="#854D0E" strokeWidth="1" />

        {/* Stylized Handle / Garan (Curved traditional bird head form / "Suku") */}
        <path
          d="M 95 454
             C 95 470, 110 490, 115 505
             C 120 520, 105 540, 90 535
             C 80 530, 75 515, 80 500
             C 83 490, 85 475, 85 454 Z"
          fill="url(#emeraldGradient)"
          stroke="url(#goldGradient)"
          strokeWidth="2"
        />

        {/* Traditional wrapping pattern on handle */}
        <path d="M 87 470 Q 101 475, 93 480" stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" />
        <path d="M 85 490 Q 104 495, 96 500" stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" />
        <path d="M 83 510 Q 105 515, 94 520" stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" />

        {/* Handle cap gem jewel */}
        <circle cx="95" cy="532" r="3.5" fill="#FBDF83" />
      </g>
    </svg>
  );
};

export const KerisSVG: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none drop-shadow-[0_0_25px_rgba(245,158,11,0.3)] ${className}`}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="amber-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Gradients */}
        <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBDF83" />
          <stop offset="40%" stopColor="#EAB308" />
          <stop offset="70%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#854D0E" />
        </linearGradient>
        <linearGradient id="goldCopperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="pamorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="20%" stopColor="#B45309" stopOpacity="0.2" />
          <stop offset="35%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="65%" stopColor="#E2E8F0" />
          <stop offset="80%" stopColor="#B45309" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Decorative Traditional Circular Motif Behind */}
      <circle cx="100" cy="300" r="85" stroke="url(#goldGradient2)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
      <circle cx="100" cy="300" r="75" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />

      {/* Main Keris Luk (Wavy traditional dagger form) */}
      <g filter="url(#amber-glow)">
        
        {/* The asymmetrical base ring / Ganja Keris */}
        <path
          d="M 60 410 
             L 140 405 
             C 145 420, 130 422, 115 421 
             L 80 423 
             C 65 423, 55 420, 60 410 Z"
          fill="url(#goldGradient2)"
          stroke="#78350F"
          strokeWidth="1.5"
        />
        {/* Ganja tooth ornamentation */}
        <path d="M 125 406 L 133 416 L 123 414 Z" fill="url(#goldGradient2)" />

        {/* The Wavy Blade (Luk 9 - representative of royal Javanese design) */}
        <path
          d="M 120 405
             C 114 360, 80 370, 78 340
             C 76 312, 116 322, 118 290
             C 120 262, 82 272, 80 240
             C 78 212, 118 222, 120 190
             C 122 165, 86 175, 84 145
             C 82 120, 114 125, 112 100
             C 110 82, 95 85, 100 60
             C 98 83, 112 80, 116 97
             C 120 115, 96 122, 94 140
             C 92 162, 128 152, 130 178
             C 132 202, 92 212, 94 238
             C 96 262, 134 252, 136 278
             C 138 302, 98 312, 100 338
             C 102 362, 134 352, 132 385
             L 120 405 Z"
          fill="url(#pamorGradient)"
          stroke="url(#goldGradient2)"
          strokeWidth="2.3"
        />

        {/* Sacred pamor line decoration across waves (Middle line representing integration) */}
        <path
          d="M 100 68
             C 105 90, 103 110, 112 125
             C 120 140, 100 165, 112 188
             C 124 210, 104 235, 115 258
             C 126 280, 108 305, 117 325
             C 126 345, 112 375, 101 405"
          fill="none"
          stroke="url(#goldGradient2)"
          strokeWidth="1.5"
          strokeDasharray="5 3"
        />

        {/* Base carvings inside blade (Gandrung) */}
        <path
          d="M 94 380 Q 106 390, 114 400"
          stroke="url(#goldGradient2)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="103" cy="384" r="3" fill="#FBDF83" />

        {/* Selut (embellished collar ring below blade) */}
        <ellipse cx="100" cy="426" rx="9" ry="6" fill="url(#goldGradient2)" stroke="#78350F" strokeWidth="1" />

        {/* Handle / Ukiran Keris (Stylized curved figure/wood form - typically "Nunggul Semi") */}
        <path
          d="M 100 432
             C 100 450, 85 460, 82 475
             C 79 490, 90 515, 105 520
             C 120 525, 125 500, 115 480
             C 112 474, 114 465, 113 458
             C 112 450, 105 440, 105 432 Z"
          fill="url(#goldCopperGradient)"
          stroke="url(#goldGradient2)"
          strokeWidth="2"
        />

        {/* Handle carving lines / motifs */}
        <path d="M 95 460 Q 105 455, 110 465" stroke="url(#goldGradient2)" strokeWidth="1" fill="none" />
        <path d="M 90 478 Q 105 478, 112 485" stroke="url(#goldGradient2)" strokeWidth="1.5" fill="none" />
        <path d="M 95 495 Q 105 500, 108 490" stroke="url(#goldGradient2)" strokeWidth="1" fill="none" />
        
        {/* Red ruby highlight representing burning passion of brotherhood on handle base */}
        <circle cx="98" cy="502" r="3.5" fill="#EF4444" stroke="#ffffff" strokeWidth="0.5" />
      </g>
    </svg>
  );
};

export const CrossedKujangKeris: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center w-full max-w-[280px] h-[280px] ${className}`}>
      {/* Golden radiating aura behind */}
      <div className="absolute inset-0 bg-radial from-yellow-500/10 via-amber-600/5 to-transparent rounded-full filter blur-xl animate-pulse" />
      
      {/* Background traditional ring overlay */}
      <div className="absolute w-[80%] h-[80%] border border-dashed border-yellow-500/30 rounded-full animate-[spin_120s_linear_infinite]" />
      <div className="absolute w-[68%] h-[68%] border border-emerald-500/20 rounded-full animate-[spin_80s_linear_infinite_reverse]" />

      {/* Handshake/Brotherhood overlay glowing in center */}
      <div className="absolute z-10 w-16 h-16 bg-zinc-900/90 border border-yellow-500/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-400">
          <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18 10h4" />
          <path d="m11.5 7.5 3 3" />
          <path d="m17 11-4.5 4.5a1.5 1.5 0 0 1-2.12 0l-.88-.88a1.5 1.5 0 0 1 0-2.12L14 8" />
        </svg>
      </div>

      {/* Kujang (Sunda weapon) - slanted left */}
      <div className="absolute inset-0 flex items-center justify-center transform -rotate-[30deg] translate-x-[-15px]">
        <KujangSVG className="w-full h-full max-h-[190px] drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
      </div>

      {/* Keris (Jawa weapon) - slanted right */}
      <div className="absolute inset-0 flex items-center justify-center transform rotate-[30deg] translate-x-[15px]">
        <KerisSVG className="w-full h-full max-h-[190px] drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" />
      </div>
    </div>
  );
};

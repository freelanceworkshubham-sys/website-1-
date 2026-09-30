import React from 'react';

export const SolarLandscapeArtwork: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none z-0">
      {/* Sky Gradient Base */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #6FAAD9 0%, #8FBFE2 28%, #BED9EE 52%, #DCECF6 72%, #A4C59A 100%)'
        }}
      />

      {/* Atmospheric Cloud Layers */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
          <defs>
            <filter id="cloud-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="30" />
            </filter>
            <linearGradient id="cloud-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="140" rx="380" ry="120" fill="url(#cloud-grad)" filter="url(#cloud-blur)" />
          <ellipse cx="800" cy="110" rx="420" ry="100" fill="url(#cloud-grad)" filter="url(#cloud-blur)" />
          <ellipse cx="1300" cy="160" rx="350" ry="110" fill="url(#cloud-grad)" filter="url(#cloud-blur)" />
        </svg>
      </div>

      {/* Subtle "SOLAR ENERGY" Watermark across Mountain Horizon (Matches Image Exactly) */}
      <div className="absolute top-[16%] left-0 right-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span 
          className="text-white/20 font-black tracking-[0.22em] text-[5.5rem] md:text-[9rem] lg:text-[11.5rem] uppercase whitespace-nowrap"
          style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            textShadow: '0 2px 20px rgba(255,255,255,0.15)',
            transform: 'translateY(-10%) scaleY(1.05)'
          }}
        >
          SOLAR ENERGY
        </span>
      </div>

      {/* Mountain Ranges & Mist & Solar Arrays SVG */}
      <svg
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for Mountains */}
          <linearGradient id="mountain-far" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6C838F" />
            <stop offset="60%" stopColor="#8DA3AF" />
            <stop offset="100%" stopColor="#A8BCC5" />
          </linearGradient>

          <linearGradient id="mountain-mid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#556F62" />
            <stop offset="50%" stopColor="#4A6557" />
            <stop offset="100%" stopColor="#6B8574" />
          </linearGradient>

          <linearGradient id="mountain-near" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A4A33" />
            <stop offset="60%" stopColor="#1E3E28" />
            <stop offset="100%" stopColor="#16311E" />
          </linearGradient>

          <linearGradient id="mist-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E2EEF5" stopOpacity="0" />
            <stop offset="50%" stopColor="#E2EEF5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#E2EEF5" stopOpacity="0" />
          </linearGradient>

          {/* Solar Panel Realistic Surface Gradients */}
          <linearGradient id="panel-surface-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9E6F2" />
            <stop offset="25%" stopColor="#B3CBE0" />
            <stop offset="65%" stopColor="#6E8EAA" />
            <stop offset="100%" stopColor="#3C566E" />
          </linearGradient>

          <linearGradient id="panel-surface-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C8DCED" />
            <stop offset="40%" stopColor="#96B4CE" />
            <stop offset="100%" stopColor="#496580" />
          </linearGradient>

          <linearGradient id="panel-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Terraced Agricultural Field Pattern */}
          <linearGradient id="field-pattern-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4D6B3E" />
            <stop offset="50%" stopColor="#638848" />
            <stop offset="100%" stopColor="#3E5830" />
          </linearGradient>

          <linearGradient id="field-pattern-2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#7E9E52" />
            <stop offset="100%" stopColor="#517237" />
          </linearGradient>

          {/* Grid pattern for the solar photovoltaic cells */}
          <pattern id="solar-grid-pattern-1" width="16" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-15) skewX(25)">
            <rect width="16" height="12" fill="none" stroke="#253A4E" strokeWidth="0.75" />
            <line x1="0" y1="6" x2="16" y2="6" stroke="#466580" strokeWidth="0.4" />
            <line x1="8" y1="0" x2="8" y2="12" stroke="#466580" strokeWidth="0.4" />
          </pattern>

          <pattern id="solar-grid-pattern-2" width="18" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(22) skewX(-20)">
            <rect width="18" height="14" fill="none" stroke="#1D3042" strokeWidth="0.8" />
            <line x1="0" y1="7" x2="18" y2="7" stroke="#3D566E" strokeWidth="0.4" />
            <line x1="9" y1="0" x2="9" y2="14" stroke="#3D566E" strokeWidth="0.4" />
          </pattern>
        </defs>

        {/* 1. Distant Mountain Silhouette (Soft Gray-Blue) */}
        <path
          d="M0,320 
             Q120,290 240,310 
             T480,270 
             Q640,240 760,260 
             T1020,285 
             Q1180,250 1320,295 
             T1440,310 
             L1440,550 L0,550 Z"
          fill="url(#mountain-far)"
          opacity="0.85"
        />

        {/* 2. Morning Valley Mist Layer (Diffused White) */}
        <path
          d="M0,310 Q360,275 720,295 T1440,300 L1440,370 Q1080,390 720,365 T0,380 Z"
          fill="url(#mist-grad)"
        />

        {/* 3. Mid-range Mountain Ridges with Forest Textures */}
        <path
          d="M0,360 
             C180,330 310,380 460,345 
             C620,310 740,350 890,325 
             C1050,300 1190,360 1330,335 
             C1390,325 1420,340 1440,350 
             L1440,650 L0,650 Z"
          fill="url(#mountain-mid)"
        />

        {/* Another Soft Mist Drift */}
        <ellipse cx="720" cy="345" rx="550" ry="25" fill="#E8F2F8" opacity="0.6" />
        <ellipse cx="320" cy="360" rx="300" ry="18" fill="#E8F2F8" opacity="0.5" />
        <ellipse cx="1120" cy="350" rx="320" ry="20" fill="#E8F2F8" opacity="0.55" />

        {/* 4. Rolling Green Hills & Terraced Landscape Forefront */}
        <path
          d="M0,420 
             C200,380 380,440 600,410 
             C820,380 1020,440 1240,415 
             C1340,405 1400,425 1440,430 
             L1440,900 L0,900 Z"
          fill="#314B29"
        />

        {/* Terraced Agricultural Field Patches (As seen in the image behind and next to the solar array) */}
        <polygon points="560,480 780,450 890,530 630,580" fill="url(#field-pattern-1)" opacity="0.9" />
        <polygon points="630,580 890,530 980,640 680,680" fill="url(#field-pattern-2)" opacity="0.85" />
        <polygon points="480,520 620,485 670,570 510,610" fill="#4B6A34" opacity="0.8" />
        <polygon points="880,510 1080,480 1160,570 960,610" fill="#3D5A2B" opacity="0.9" />

        {/* 5. THE MASSIVE GEOMETRIC SOLAR PANEL FARM (Matches the central image feature!) */}
        {/* Left Wing of the Isometric Solar Farm */}
        <polygon
          points="200,530 720,420 720,530 180,650"
          fill="url(#panel-surface-1)"
          stroke="#1F3447"
          strokeWidth="2"
        />
        {/* Photovoltaic Cell Grid Overlay Left */}
        <polygon
          points="200,530 720,420 720,530 180,650"
          fill="url(#solar-grid-pattern-1)"
          opacity="0.8"
        />
        {/* Sky reflection sheen left */}
        <polygon
          points="200,530 720,420 720,530 180,650"
          fill="url(#panel-sheen)"
          style={{ mixBlendMode: 'overlay' }}
        />

        {/* Right Wing of the Isometric Solar Farm */}
        <polygon
          points="720,420 1280,520 1280,630 720,530"
          fill="url(#panel-surface-2)"
          stroke="#192A3A"
          strokeWidth="2"
        />
        {/* Photovoltaic Cell Grid Overlay Right */}
        <polygon
          points="720,420 1280,520 1280,630 720,530"
          fill="url(#solar-grid-pattern-2)"
          opacity="0.8"
        />
        {/* Sky reflection sheen right */}
        <polygon
          points="720,420 1280,520 1280,630 720,530"
          fill="url(#panel-sheen)"
          style={{ mixBlendMode: 'overlay' }}
        />

        {/* Edge Frame / Border line between the two massive arrays */}
        <line x1="720" y1="420" x2="720" y2="530" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.75" />
        <line x1="200" y1="530" x2="720" y2="420" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
        <line x1="720" y1="420" x2="1280" y2="520" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />

        {/* Secondary Solar Sub-Arrays across the agricultural landscape */}
        <polygon points="520,540 680,500 700,570 540,610" fill="url(#panel-surface-1)" opacity="0.9" />
        <polygon points="730,535 880,505 910,575 750,615" fill="url(#panel-surface-2)" opacity="0.9" />

        {/* 6. Lush Forefront Green Forests & Rolling Hills (Rich Deep Greenery) */}
        <path
          d="M-50,620 
             C150,560 320,680 520,640 
             C720,600 880,720 1100,660 
             C1260,620 1380,700 1500,650 
             L1500,950 L-50,950 Z"
          fill="url(#mountain-near)"
        />

        {/* Deep Green Tree Canopy Textures & Gradients */}
        <path
          d="M-20,700 
             Q120,670 240,710 
             T520,680 
             Q720,650 900,700 
             T1280,690 
             Q1380,670 1480,710 
             L1480,950 L-20,950 Z"
          fill="#102517"
        />

        {/* Bottom Center Curved Grass Earth Sphere (Matches bottom of user image!) */}
        <ellipse
          cx="720"
          cy="920"
          rx="520"
          ry="140"
          fill="#2C6826"
        />
        <ellipse
          cx="720"
          cy="930"
          rx="480"
          ry="120"
          fill="#1F511A"
        />
        <ellipse
          cx="720"
          cy="915"
          rx="460"
          ry="70"
          fill="#3E8335"
          opacity="0.7"
        />
      </svg>

      {/* Vignette Overlay & Darkening for High-Contrast Hero Text Legibility */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(8,16,12,0.3) 0%, rgba(8,16,12,0.1) 40%, rgba(5,13,8,0.7) 80%, rgba(5,13,8,0.95) 100%)'
        }}
      />
      
      {/* Left Bottom Vignette for Headline Contrast */}
      <div 
        className="absolute bottom-0 left-0 w-full md:w-3/4 h-3/4 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 15% 85%, rgba(4,12,7,0.85) 0%, rgba(4,12,7,0.4) 55%, transparent 80%)'
        }}
      />

      {/* Right Bottom Vignette for Stat Cards & Awards Contrast */}
      <div 
        className="absolute bottom-0 right-0 w-full md:w-2/3 h-2/3 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 85% 85%, rgba(4,12,7,0.8) 0%, rgba(4,12,7,0.3) 50%, transparent 80%)'
        }}
      />
    </div>
  );
};

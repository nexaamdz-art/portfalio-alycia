import React, { useMemo } from 'react';

// Deterministic pseudo-random helper to keep star positions stable across renders
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function GeometricTechBG() {
  // Generate a field of natural night sky stars with deterministic positions and sizes
  const stars = useMemo(() => {
    return Array.from({ length: 95 }).map((_, i) => {
      const x = seededRandom(i * 17 + 1) * 100;
      const y = seededRandom(i * 31 + 5) * 100;
      const size = 0.8 + seededRandom(i * 13 + 3) * 1.8;
      const opacity = 0.35 + seededRandom(i * 23 + 7) * 0.6;
      const delay = (seededRandom(i * 41 + 11) * 4).toFixed(2);
      const isSlow = i % 3 === 0;
      const color =
        i % 5 === 0
          ? '#e879f9' // soft magenta/pink
          : i % 4 === 0
          ? '#93c5fd' // faint cyan/ice blue
          : i % 3 === 0
          ? '#d8b4fe' // soft lavender
          : '#ffffff'; // crisp white

      return { id: i, x, y, size, opacity, delay, isSlow, color };
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      id="starry-night-sky-background"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Atmospheric Deep Violet/Purple Nebula Glows */}
      {/* Main aura behind the character on the right as seen in reference photo */}
      <div
        className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[650px] h-[750px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.26) 0%, rgba(107, 33, 168, 0.16) 45%, rgba(49, 20, 50, 0) 75%)',
          filter: 'blur(45px)',
        }}
      />
      {/* Secondary soft purple ambient glow on the upper-mid canvas */}
      <div
        className="absolute top-10 left-[35%] w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(192, 132, 252, 0.12) 0%, rgba(49, 20, 50, 0) 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 2. Scattered Night Sky Twinkling Stars */}
      <div className="absolute inset-0 w-full h-full">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full ${
              star.isSlow ? 'animate-twinkle-slow' : 'animate-twinkle'
            }`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.opacity,
              boxShadow:
                star.size > 1.8
                  ? `0 0 6px ${star.color}, 0 0 12px rgba(232, 121, 249, 0.4)`
                  : `0 0 3px ${star.color}`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 3. Luminous 4-Point Sparkling Star Flares (Matching reference photo) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle glow filter for constellation lines and star nodes */}
          <filter id="star-bloom" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="major-star-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="outerGlow" />
            <feGaussianBlur stdDeviation="1.5" result="innerGlow" />
            <feMerge>
              <feMergeNode in="outerGlow" />
              <feMergeNode in="innerGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Star Sparkle Symbol */}
          <g id="sparkle-star">
            <path
              d="M 0,-14 Q 0,0 14,0 Q 0,0 0,14 Q 0,0 -14,0 Q 0,0 0,-14 Z"
              fill="#ffffff"
              filter="url(#major-star-glow)"
            />
            <circle cx="0" cy="0" r="2.5" fill="#fbcfe8" />
          </g>

          <g id="medium-sparkle">
            <path
              d="M 0,-9 Q 0,0 9,0 Q 0,0 0,9 Q 0,0 -9,0 Q 0,0 0,-9 Z"
              fill="#ffffff"
              filter="url(#star-bloom)"
            />
            <circle cx="0" cy="0" r="1.8" fill="#e879f9" />
          </g>
        </defs>

        {/* Hero Sparkling Stars at Key Celestial Coordinates */}
        <use href="#sparkle-star" x="120" y="240" className="animate-twinkle opacity-90" style={{ animationDelay: '0.8s' }} />
        <use href="#medium-sparkle" x="380" y="110" className="animate-twinkle-slow opacity-80" style={{ animationDelay: '1.7s' }} />
        <use href="#sparkle-star" x="680" y="85" className="animate-twinkle opacity-85" style={{ animationDelay: '2.4s' }} />
        <use href="#medium-sparkle" x="910" y="190" className="animate-twinkle-slow opacity-90" style={{ animationDelay: '0.5s' }} />
        <use href="#sparkle-star" x="1340" y="130" className="animate-twinkle opacity-95" style={{ animationDelay: '3.1s' }} />
        <use href="#medium-sparkle" x="620" y="780" className="animate-twinkle opacity-75" style={{ animationDelay: '1.2s' }} />
        <use href="#sparkle-star" x="1360" y="740" className="animate-twinkle-slow opacity-90" style={{ animationDelay: '2.8s' }} />

        {/* 4. EXACT Geometric Star Constellations (Matching reference image) */}

        {/* -------------------------------------------------------------------
            Constellation 1: Mid-Upper Left (Behind and around 'Alycia')
            A multi-faceted origami/celestial polygon star cluster
           ------------------------------------------------------------------- */}
        <g filter="url(#star-bloom)" className="animate-constellation opacity-80" style={{ animationDelay: '0s' }}>
          {/* Luminous Connecting Geometric Lines */}
          <g stroke="rgba(216, 180, 254, 0.45)" strokeWidth="0.85" fill="none">
            <line x1="430" y1="410" x2="480" y2="340" />
            <line x1="480" y1="340" x2="550" y2="310" />
            <line x1="550" y1="310" x2="610" y2="360" />
            <line x1="610" y1="360" x2="650" y2="470" />
            <line x1="650" y1="470" x2="570" y2="520" />
            <line x1="570" y1="520" x2="470" y2="490" />
            <line x1="470" y1="490" x2="430" y2="410" />

            {/* Inner Diagonal Facets */}
            <line x1="480" y1="340" x2="570" y2="520" stroke="rgba(244, 114, 182, 0.4)" />
            <line x1="430" y1="410" x2="550" y2="310" stroke="rgba(216, 180, 254, 0.35)" />
            <line x1="550" y1="310" x2="570" y2="520" stroke="rgba(244, 114, 182, 0.45)" />
            <line x1="480" y1="340" x2="610" y2="360" stroke="rgba(192, 132, 252, 0.4)" />
            <line x1="470" y1="490" x2="610" y2="360" stroke="rgba(216, 180, 254, 0.3)" />
          </g>

          {/* Glowing Constellation Star Vertices */}
          <circle cx="430" cy="410" r="2.8" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="480" cy="340" r="3.2" fill="#fbcfe8" filter="url(#major-star-glow)" />
          <circle cx="550" cy="310" r="3.8" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="610" cy="360" r="3" fill="#e879f9" />
          <circle cx="650" cy="470" r="3.4" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="570" cy="520" r="3.2" fill="#d8b4fe" />
          <circle cx="470" cy="490" r="3" fill="#ffffff" />
        </g>

        {/* -------------------------------------------------------------------
            Constellation 2: Lower Left (Beneath the descriptive statement)
            Angular geometric star constellation
           ------------------------------------------------------------------- */}
        <g filter="url(#star-bloom)" className="animate-constellation opacity-75" style={{ animationDelay: '2.5s' }}>
          <g stroke="rgba(216, 180, 254, 0.45)" strokeWidth="0.85" fill="none">
            <line x1="250" y1="770" x2="310" y2="720" />
            <line x1="310" y1="720" x2="390" y2="740" />
            <line x1="390" y1="740" x2="460" y2="710" />
            <line x1="460" y1="710" x2="490" y2="800" />
            <line x1="490" y1="800" x2="410" y2="830" />
            <line x1="410" y1="830" x2="320" y2="800" />
            <line x1="320" y1="800" x2="250" y2="770" />

            {/* Inner Cross Connections */}
            <line x1="310" y1="720" x2="410" y2="830" stroke="rgba(244, 114, 182, 0.35)" />
            <line x1="390" y1="740" x2="320" y2="800" stroke="rgba(192, 132, 252, 0.35)" />
            <line x1="390" y1="740" x2="490" y2="800" stroke="rgba(244, 114, 182, 0.4)" />
            <line x1="250" y1="770" x2="410" y2="830" stroke="rgba(216, 180, 254, 0.25)" />
          </g>

          <circle cx="250" cy="770" r="2.8" fill="#ffffff" />
          <circle cx="310" cy="720" r="3.2" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="390" cy="740" r="3.5" fill="#fbcfe8" filter="url(#major-star-glow)" />
          <circle cx="460" cy="710" r="2.8" fill="#e879f9" />
          <circle cx="490" cy="800" r="3.4" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="410" cy="830" r="3" fill="#d8b4fe" />
          <circle cx="320" cy="800" r="2.8" fill="#ffffff" />
        </g>

        {/* -------------------------------------------------------------------
            Constellation 3: Top Right (Right quadrant, high in the sky)
            Faceted 3D low-poly star web matching reference photo
           ------------------------------------------------------------------- */}
        <g filter="url(#star-bloom)" className="animate-constellation opacity-85" style={{ animationDelay: '1.2s' }}>
          <g stroke="rgba(216, 180, 254, 0.5)" strokeWidth="0.9" fill="none">
            <line x1="1100" y1="280" x2="1140" y2="190" />
            <line x1="1140" y1="190" x2="1240" y2="180" />
            <line x1="1240" y1="180" x2="1320" y2="230" />
            <line x1="1320" y1="230" x2="1370" y2="330" />
            <line x1="1370" y1="330" x2="1280" y2="380" />
            <line x1="1280" y1="380" x2="1180" y2="360" />
            <line x1="1180" y1="360" x2="1100" y2="280" />

            {/* Internal 3D Triangulation */}
            <line x1="1140" y1="190" x2="1280" y2="380" stroke="rgba(244, 114, 182, 0.45)" />
            <line x1="1240" y1="180" x2="1180" y2="360" stroke="rgba(192, 132, 252, 0.45)" />
            <line x1="1240" y1="180" x2="1280" y2="380" stroke="rgba(216, 180, 254, 0.4)" />
            <line x1="1100" y1="280" x2="1240" y2="180" stroke="rgba(244, 114, 182, 0.35)" />
            <line x1="1180" y1="360" x2="1320" y2="230" stroke="rgba(216, 180, 254, 0.3)" />
            <line x1="1140" y1="190" x2="1320" y2="230" stroke="rgba(244, 114, 182, 0.35)" />
          </g>

          <circle cx="1100" cy="280" r="3.2" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="1140" cy="190" r="3.8" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="1240" cy="180" r="4.2" fill="#fbcfe8" filter="url(#major-star-glow)" />
          <circle cx="1320" cy="230" r="3.6" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="1370" cy="330" r="3" fill="#e879f9" />
          <circle cx="1280" cy="380" r="3.5" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="1180" cy="360" r="3" fill="#d8b4fe" />
        </g>

        {/* -------------------------------------------------------------------
            Constellation 4: Lower Right (Mid-lower right corner)
            Sprawling celestial polygon constellation
           ------------------------------------------------------------------- */}
        <g filter="url(#star-bloom)" className="animate-constellation opacity-80" style={{ animationDelay: '3.8s' }}>
          <g stroke="rgba(216, 180, 254, 0.48)" strokeWidth="0.9" fill="none">
            <line x1="1150" y1="620" x2="1220" y2="570" />
            <line x1="1220" y1="570" x2="1310" y2="610" />
            <line x1="1310" y1="610" x2="1380" y2="690" />
            <line x1="1380" y1="690" x2="1350" y2="780" />
            <line x1="1350" y1="780" x2="1240" y2="820" />
            <line x1="1240" y1="820" x2="1160" y2="760" />
            <line x1="1160" y1="760" x2="1150" y2="620" />

            {/* Internal 3D Triangles */}
            <line x1="1220" y1="570" x2="1240" y2="820" stroke="rgba(244, 114, 182, 0.4)" />
            <line x1="1310" y1="610" x2="1160" y2="760" stroke="rgba(192, 132, 252, 0.4)" />
            <line x1="1220" y1="570" x2="1380" y2="690" stroke="rgba(216, 180, 254, 0.35)" />
            <line x1="1150" y1="620" x2="1310" y2="610" stroke="rgba(244, 114, 182, 0.35)" />
            <line x1="1160" y1="760" x2="1350" y2="780" stroke="rgba(216, 180, 254, 0.35)" />
          </g>

          <circle cx="1150" cy="620" r="3" fill="#ffffff" />
          <circle cx="1220" cy="570" r="3.6" fill="#fbcfe8" filter="url(#major-star-glow)" />
          <circle cx="1310" cy="610" r="3.8" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="1380" cy="690" r="3.2" fill="#d8b4fe" />
          <circle cx="1350" cy="780" r="3.5" fill="#ffffff" filter="url(#major-star-glow)" />
          <circle cx="1240" cy="820" r="3" fill="#e879f9" />
          <circle cx="1160" cy="760" r="3.2" fill="#ffffff" filter="url(#major-star-glow)" />
        </g>
      </svg>
    </div>
  );
}

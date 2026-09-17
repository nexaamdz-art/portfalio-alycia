import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { DEFAULT_WORK_PROJECTS } from '../work/data/defaultProjects';
import type { WorkProject } from '../work/types';

interface ProjectDisplayItem {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  image: string;
  color: string;
  url: string;
}

const PROJECT_IMAGES_MAP: Record<string, string> = {
  'museum-of-weed':
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=900',
  'paper-planes':
    'https://images.unsplash.com/photo-1517976487588-41dfb37c050a?auto=format&fit=crop&q=80&w=900',
  'prometheus':
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=900',
  'under-the-skin':
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=900',
  'a-z-of-ai':
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=900',
  'dreamwave':
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=900',
  'pottermore':
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=900',
  'sonos-waves':
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=900',
};

const PROJECTS_DATA: ProjectDisplayItem[] = DEFAULT_WORK_PROJECTS.map((p) => {
  const dateLines = p.date.split('\n');
  const cat = dateLines[2] || dateLines[0] || 'INTERACTIVE';
  return {
    id: p.perma,
    title: p.title,
    client: p.clientName || 'Client Project',
    category: cat,
    description: p.subhead || p.body.slice(0, 100) + '...',
    image: PROJECT_IMAGES_MAP[p.perma] || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=900',
    color: p.color ? `#${p.color}` : '#9333ea',
    url: p.projectURL || p.caseStudyURL || '#',
  };
});

interface ProjectsCarouselProps {
  projects?: ProjectDisplayItem[];
  cardWidth?: number;
  cardHeight?: number;
  spacing?: number;
  speed?: number;
  tilt?: number;
  perspective?: number;
}

export default function ProjectsSection({
  projects = PROJECTS_DATA,
  cardWidth = 330,
  cardHeight = 440,
  spacing = 2.8,
  speed = 4.5,
  tilt = -6.5,
  perspective = 2600,
}: ProjectsCarouselProps) {
  const count = projects.length;
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const rotYRef = useRef<number>(0);
  const velRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dragRef = useRef<{ active: boolean; startX: number; lastX: number }>({
    active: false,
    startX: 0,
    lastX: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  // Geometric 3D radius calculation
  const angle = 360 / count;
  const factor = 1 + spacing * 0.15;
  const radius = (cardWidth * factor) / (2 * Math.tan(Math.PI / count));
  const degPerSec = speed * 4.2;

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const applyTransform = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
    };
    applyTransform();

    const renderLoop = (now: number) => {
      const dt = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = now;
      const f = Math.min(dt, 0.1);
      const d = dragRef.current;

      if (!d.active) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * f;
          velRef.current *= 0.94; // Smooth inertial deceleration
        } else {
          rotYRef.current += degPerSec * f; // Continuous automatic horizontal rotation
        }
      }

      applyTransform();
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, degPerSec, count]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      lastX: e.clientX,
    };
    velRef.current = 0;
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    d.lastX = e.clientX;

    // Direct rotation response on drag
    const sensitivity = 0.28;
    rotYRef.current += dx * sensitivity;
    velRef.current = dx * sensitivity * 45; // Store velocity for smooth throw release
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    dragRef.current.active = false;
    setIsDragging(false);
  };

  return (
    <section
      id="projects"
      aria-label="Featured Projects"
      dir="ltr"
      className="w-full py-28 px-6 sm:px-10 lg:px-12 xl:px-16 relative z-10 flex flex-col items-center justify-center bg-[#311432] overflow-hidden"
    >
      {/* Background ambient radial glow matching dark purple palette */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-indigo-900/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center mb-16 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium uppercase tracking-wider mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Selected Work</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
        >
          Featured Projects
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto"
        >
          Drag horizontally to explore the 3D interactive showcase of recent creative engineering and immersive digital productions.
        </motion.p>
      </div>

      {/* 3D Round Carousel Stage */}
      <div
        style={{
          width: '100%',
          height: cardHeight + 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          background: 'transparent',
          perspective: `${perspective}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative z-10 select-none"
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt}deg)`,
          }}
        >
          <div
            ref={ringRef}
            style={{
              position: 'relative',
              width: cardWidth,
              height: cardHeight,
              transformStyle: 'preserve-3d',
            }}
          >
            {projects.map((item, index) => {
              const cardAngle = index * angle;
              return (
                <div
                  key={item.id || index}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                  className="rounded-2xl"
                >
                  {/* Front Card Face */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '20px',
                      overflow: 'hidden',
                      backfaceVisibility: 'hidden',
                      boxShadow: '0 20px 45px rgba(0,0,0,0.65), 0 0 20px rgba(147, 51, 234, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: '#240d25',
                    }}
                    className="flex flex-col justify-between group transition-all duration-300"
                  >
                    {/* Background Project Image Layer */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
                      />
                      {/* Dark Purple Gradient Overlay for seamless legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#311432] via-[#311432]/75 to-black/30" />
                    </div>

                    {/* Top Content: Badges */}
                    <div className="relative z-10 p-5 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 shadow-sm">
                        {item.client}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase text-slate-300 bg-black/40 backdrop-blur-sm border border-white/10">
                        {item.category}
                      </span>
                    </div>

                    {/* Bottom Content: Title & Description */}
                    <div className="relative z-10 p-5 flex flex-col gap-2">
                      <h3 className="font-sans-modern text-xl font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-sans-modern text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-medium text-pink-300 group-hover:text-pink-200 flex items-center gap-1.5 transition-colors">
                          Explore Project <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Back Card Face for clean 3D occlusion */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '20px',
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      backgroundImage: `linear-gradient(135deg, rgba(30,10,60,0.92), rgba(11,4,22,0.95)), url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      filter: 'brightness(0.35)',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

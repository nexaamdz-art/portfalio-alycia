import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Sparkles, X, CheckCircle2, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_WORK_PROJECTS } from '../work/data/defaultProjects';

interface ProjectDisplayItem {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  fullBody?: string;
  image: string;
  logo?: string;
  color: string;
  url: string;
  tags?: string;
}

const PROJECT_LOGOS_MAP: Record<string, string> = {
  'hijab-soul': '/assets/images/hijab-soul-icon.jpg',
};

const PROJECT_IMAGES_MAP: Record<string, string> = {
  'hijab-soul': '/assets/images/hijab-soul-cover.jpg',
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
    fullBody: p.body,
    image: PROJECT_IMAGES_MAP[p.perma] || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=900',
    logo: PROJECT_LOGOS_MAP[p.perma] || (p.projectLogo && p.projectLogo.startsWith('/assets') ? p.projectLogo : undefined),
    color: p.color ? `#${p.color}` : '#9333ea',
    url: p.projectURL || p.caseStudyURL || '#',
    tags: p.tags,
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
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    lastX: number;
    isLockedHorizontal: boolean;
    isLockedVertical: boolean;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    isLockedHorizontal: false,
    isLockedVertical: false,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDisplayItem | null>(null);
  const dragDistanceRef = useRef<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isPhone = screenWidth < 640;
  const effectiveCardWidth = isPhone ? Math.min(270, screenWidth - 64) : cardWidth;
  const effectiveCardHeight = isPhone ? 370 : cardHeight;
  const effectivePerspective = isPhone ? 1900 : perspective;
  const effectiveSpacing = isPhone ? 2.4 : spacing;

  // Geometric 3D radius calculation
  const angle = 360 / count;
  const factor = 1 + effectiveSpacing * 0.15;
  const radius = (effectiveCardWidth * factor) / (2 * Math.tan(Math.PI / count));
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
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      isLockedHorizontal: false,
      isLockedVertical: false,
    };
    dragDistanceRef.current = 0;
    velRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;

    if (!d.isLockedHorizontal && !d.isLockedVertical) {
      const dx = Math.abs(e.clientX - d.startX);
      const dy = Math.abs(e.clientY - d.startY);

      if (dy > 8 && dy > dx) {
        // User intends to scroll the page vertically -> release and allow natural browser scrolling
        d.isLockedVertical = true;
        d.active = false;
        setIsDragging(false);
        return;
      } else if (dx > 8 && dx >= dy) {
        // User intends to swipe the 3D ring horizontally
        d.isLockedHorizontal = true;
        setIsDragging(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } else {
        return;
      }
    }

    if (!d.isLockedHorizontal) return;

    const dx = e.clientX - d.lastX;
    dragDistanceRef.current += Math.abs(dx);
    d.lastX = e.clientX;

    // Direct rotation response on drag
    const sensitivity = isPhone ? 0.38 : 0.28;
    rotYRef.current += dx * sensitivity;
    velRef.current = dx * sensitivity * 45; // Store velocity for smooth throw release
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.isLockedHorizontal) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
    dragRef.current.active = false;
    dragRef.current.isLockedHorizontal = false;
    dragRef.current.isLockedVertical = false;
    setIsDragging(false);
  };

  const spin = (direction: 'prev' | 'next') => {
    velRef.current = direction === 'next' ? -angle * 3.6 : angle * 3.6;
  };

  const handleCardClick = (item: ProjectDisplayItem) => {
    // Only open if the user didn't drag extensively
    if (dragDistanceRef.current < 10) {
      setSelectedProject(item);
    }
  };

  return (
    <section
      id="projects"
      aria-label="Featured Projects"
      dir="ltr"
      className="w-full py-20 sm:py-28 px-4 sm:px-10 lg:px-12 xl:px-16 relative z-10 flex flex-col items-center justify-center bg-transparent overflow-hidden"
    >
      {/* Background ambient radial glow matching dark purple palette */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-indigo-900/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16 max-w-2xl relative z-10">
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
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
        >
          Featured Projects
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto"
        >
          Drag horizontally to explore or click any project card to view complete live case studies, architectures, and demo deployments.
        </motion.p>
      </div>

      {/* 3D Round Carousel Stage */}
      <div
        style={{
          width: '100%',
          height: effectiveCardHeight + (isPhone ? 70 : 120),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          background: 'transparent',
          perspective: `${effectivePerspective}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
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
              width: effectiveCardWidth,
              height: effectiveCardHeight,
              transformStyle: 'preserve-3d',
            }}
          >
            {projects.map((item, index) => {
              const cardAngle = index * angle;
              return (
                <div
                  key={item.id || index}
                  onClick={() => handleCardClick(item)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                  className="rounded-2xl cursor-pointer"
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
                    className="flex flex-col justify-between group transition-all duration-300 hover:border-purple-400/50"
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
                      <div className="flex items-center gap-2.5">
                        {item.logo && (
                          <img
                            src={item.logo}
                            alt={`${item.title} icon`}
                            className="w-8 h-8 rounded-xl object-cover border border-amber-400/50 shadow-md shadow-black/60 bg-black/60 shrink-0"
                          />
                        )}
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 shadow-sm">
                          {item.client}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase text-slate-300 bg-black/40 backdrop-blur-sm border border-white/10">
                        {item.category}
                      </span>
                    </div>

                    {/* Bottom Content: Title & Description */}
                    <div className="relative z-10 p-5 flex flex-col gap-2">
                      <h3 className="font-sans-modern text-xl font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="font-sans-modern text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-medium text-pink-300 group-hover:text-pink-200 flex items-center gap-1.5 transition-colors">
                          View Case Study <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                        {item.url && item.url !== '#' && (
                          <span className="text-[11px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                            Live Demo
                          </span>
                        )}
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

      {/* Mobile & Touch Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6 z-20">
        <button
          type="button"
          onClick={() => spin('prev')}
          aria-label="Previous project"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-slate-200 text-xs font-medium transition backdrop-blur-md cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-4 h-4 text-purple-300" />
          <span>Previous</span>
        </button>

        <span className="text-[11px] text-slate-400 font-medium">
          Swipe or tap to explore
        </span>

        <button
          type="button"
          onClick={() => spin('next')}
          aria-label="Next project"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-slate-200 text-xs font-medium transition backdrop-blur-md cursor-pointer shadow-lg"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4 text-pink-300" />
        </button>
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#260f27] border border-purple-500/30 rounded-2xl shadow-2xl text-slate-100 p-5 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white transition-colors z-30 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedProject.client}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {selectedProject.category}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                {selectedProject.logo && (
                  <img
                    src={selectedProject.logo}
                    alt={`${selectedProject.title} emblem`}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400/50 shadow-xl shadow-amber-950/40 bg-black/60 shrink-0 p-0.5"
                  />
                )}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {selectedProject.title}
                  </h3>
                  <p className="text-purple-300 text-sm font-medium">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Preview Image Banner */}
              <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-6 relative border border-white/10">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#260f27] via-transparent to-transparent" />
              </div>

              {/* Full Description & Overview */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Project Overview
                </h4>
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                  {selectedProject.fullBody || selectedProject.description}
                </p>
              </div>

              {/* Key Features / Algerian Architecture specific if hijab-soul */}
              {selectedProject.id === 'hijab-soul' && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Key Capabilities &amp; Local Integrations
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-200">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>58-Wilaya Delivery Engine:</strong> Dynamic automated pricing for both Home &amp; Desk deliveries across all Algerian provinces.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Cart &amp; COD Checkout:</strong> Optimized Cash-on-Delivery flow with instant Algerian DZD pricing and phone verification.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Admin Dashboard:</strong> Real-time inventory tracking, order status management, and sales analytics.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Bilingual &amp; RTL:</strong> Full Arabic RTL layout support and mobile-first experience for local shoppers.</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Tech Stack Tags */}
              {selectedProject.tags && (
                <div className="mb-8">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    Technologies &amp; Architecture
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.split(',').map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-slate-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
                {selectedProject.url && selectedProject.url !== '#' && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/40 transition-all transform hover:scale-[1.02]"
                  >
                    <span>Launch Live Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

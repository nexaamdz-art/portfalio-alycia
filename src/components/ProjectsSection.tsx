import { memo, useState, useEffect, useRef } from 'react';
import { WorkExperience } from '../work';

export const ProjectsSection = memo(function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldRenderWork, setShouldRenderWork] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

      // When the page is at the top (Home section), do not execute Work until user scrolls toward Projects
      if (scrollY < 50 && rect.top > windowHeight * 0.5) {
        return;
      }

      // Check if Projects section is visible or within view margin
      if (rect.top < windowHeight + 100 && rect.bottom > -100) {
        setShouldRenderWork(true);
      }

      // Calculate progress of scroll through the distributed Projects section (0.0 to 1.0)
      const totalDistance = el.offsetHeight - windowHeight;
      if (totalDistance > 0) {
        const progress = Math.min(Math.max(-rect.top / totalDistance, 0), 1);
        setScrollProgress(progress);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const rect = entry.boundingClientRect;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

        // Prevent false positives on initial load when page is at the top
        if (scrollY < 50 && rect.top > windowHeight * 0.5) {
          return;
        }

        if (entry.isIntersecting) {
          setShouldRenderWork(true);
        }
      },
      {
        threshold: [0.01, 0.1],
        rootMargin: '0px',
      }
    );

    observer.observe(el);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Projects"
      className="w-full min-h-[700vh] relative bg-[#0b0416] border-0 border-none outline-none"
    >
      {/* Sticky container that keeps the 3D Work experience pinned during the distributed scroll */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#0b0416] border-0 border-none outline-none">
        
        {/* Title Overlay */}
        <div 
          className="absolute top-12 md:top-20 left-6 sm:left-10 lg:left-16 z-20 pointer-events-none transition-all duration-300"
          style={{
            opacity: Math.max(1 - scrollProgress * 15, 0),
            transform: `translateY(${-scrollProgress * 600}px)`,
          }}
        >
          <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(64px, 7vw, 112px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            <span style={{ color: '#F5F7FF' }}>What I've</span>
            <br />
            <span style={{ background: 'linear-gradient(to right, #A8C7FF, #1677FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Built</span>
          </h2>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '18px', color: '#A8B3C7', lineHeight: 1.6, maxWidth: '520px', marginTop: '1.5rem' }}>
            Explore a curated collection of my most recent work and creative projects. Each piece reflects a commitment to clean code, immersive design, and engaging digital experiences.
          </p>
        </div>

        {shouldRenderWork ? (
          <WorkExperience baseRoute="/works" progress={scrollProgress} />
        ) : (
          <div className="w-full h-full flex items-center justify-center pointer-events-none bg-[#0b0416]" />
        )}
      </div>
    </section>
  );
});

export default ProjectsSection;

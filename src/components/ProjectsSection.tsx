import { memo, useState, useEffect, useRef } from 'react';
import { WorkExperience } from '../work';

export const ProjectsSection = memo(function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldRenderWork, setShouldRenderWork] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkVisibility = () => {
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
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    // Initial check (in case page loaded already scrolled to #projects)
    checkVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Projects"
      className="w-full min-h-screen relative overflow-hidden bg-[#0b0416] border-0 border-none outline-none"
    >
      {shouldRenderWork ? (
        <WorkExperience baseRoute="/works" />
      ) : (
        <div className="w-full min-h-screen flex items-center justify-center pointer-events-none bg-[#0b0416]" />
      )}
    </section>
  );
});

export default ProjectsSection;

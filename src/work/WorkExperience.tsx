import { useEffect, useRef, memo } from 'react';
import type { WorkExperienceProps } from './types';
import { DEFAULT_WORK_PROJECTS } from './data/defaultProjects';
import {
  DEFAULT_WORK_CONFIG,
  setupWorkRuntime,
  ensurePreload,
  ensureScript,
  openProjectSlug,
  closeProjectDetail,
} from './utils/workBridge';
import './work.css';

export const WorkExperience = memo(function WorkExperience({
  baseRoute = '/work',
  projects = DEFAULT_WORK_PROJECTS,
  initialSlug,
  onProjectSelect,
  onProjectClose,
  className = '',
  style,
  progress,
}: WorkExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectCallbackRef = useRef(onProjectSelect);
  const closeCallbackRef = useRef(onProjectClose);
  const isDetailOpenRef = useRef(false);

  selectCallbackRef.current = onProjectSelect;
  closeCallbackRef.current = onProjectClose;

  // Synchronize normalized progress (0.0 to 1.0) with the internal 3D scroll controller
  useEffect(() => {
    if (typeof progress !== 'number') return;
    const stageEl = document.getElementById('Stage');
    if (!stageEl) return;

    // Find all scrollable elements inside Stage (such as the FXScroll container)
    const scrollContainers = stageEl.querySelectorAll<HTMLElement>('*');
    for (let i = 0; i < scrollContainers.length; i++) {
      const el = scrollContainers[i];
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 0) {
        const maxScroll = el.scrollHeight - el.clientHeight;
        el.scrollTop = progress * maxScroll;
      }
    }
  }, [progress]);

  useEffect(() => {
    const handleStageWheel = (e: WheelEvent) => {
      // When 3D project detail is not open, forward wheel to window so main page scrolls
      if (!isDetailOpenRef.current) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY, behavior: 'auto' });
      }
    };

    const updateStageVisibility = (inView: boolean) => {
      const stageEl = document.getElementById('Stage');
      if (stageEl) {
        if (containerRef.current && stageEl.parentElement !== containerRef.current) {
          containerRef.current.appendChild(stageEl);
        }
        if (inView || isDetailOpenRef.current) {
          stageEl.style.display = 'block';
          stageEl.style.pointerEvents = 'auto';
        } else {
          stageEl.style.display = 'none';
          stageEl.style.pointerEvents = 'none';
        }
      }
    };

    // Ensure we continually check and reparent Stage if the script recreates it or creates it late
    const stageCheckInterval = setInterval(() => {
      const stageEl = document.getElementById('Stage');
      if (stageEl) {
        if (containerRef.current && stageEl.parentElement !== containerRef.current) {
          containerRef.current.appendChild(stageEl);
        }
        updateStageVisibility(isInViewport);

        if (!(stageEl as any).__wheelBound) {
          (stageEl as any).__wheelBound = true;
          stageEl.addEventListener('wheel', handleStageWheel, { passive: false });
        }
      }
    }, 250);

    // 2. IntersectionObserver to only activate Stage when Projects is actually in view
    let isInViewport = false;
    let hasLoadedScript = false;

    const checkIsActuallyInView = (rect: DOMRectReadOnly | DOMRect) => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollY < 50 && rect.top > windowHeight * 0.5) {
        return false;
      }
      return rect.top < windowHeight && rect.bottom > 0;
    };

    const loadWorkScript = () => {
      if (hasLoadedScript) return;
      hasLoadedScript = true;
      // Configure runtime environment ONLY when actually loaded
      setupWorkRuntime(baseRoute, projects, DEFAULT_WORK_CONFIG);
      ensurePreload(DEFAULT_WORK_CONFIG.preloadLinkId, DEFAULT_WORK_CONFIG.appScriptPath);
      ensureScript(DEFAULT_WORK_CONFIG.appScriptId, DEFAULT_WORK_CONFIG.appScriptPath).then(() => {
        if ((window as any).AppState) {
          (window as any).AppState.set('hasMusic', false);
          (window as any).AppState.set('Global/audioEnabled', false);
        }
        if ((window as any).Tests) {
          (window as any).Tests.noMusic = () => true;
        }
        updateStageVisibility(isInViewport);
        if (initialSlug) {
          setTimeout(() => {
            openProjectSlug(initialSlug);
          }, 300);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isInViewport = entry.isIntersecting && checkIsActuallyInView(entry.boundingClientRect);
        if (isInViewport) {
          loadWorkScript();
        }
        updateStageVisibility(isInViewport);
      },
      {
        threshold: [0, 0.05, 0.2, 0.5],
        rootMargin: '0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = checkIsActuallyInView(rect);
      if (inView !== isInViewport) {
        isInViewport = inView;
        if (inView) {
          loadWorkScript();
        }
        updateStageVisibility(inView);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 4. Listen to project selection / close custom events dispatched by the 3D scene
    const handleProjectEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        project: unknown;
        previous: unknown;
      }>;
      const project = customEvent.detail?.project;
      if (project) {
        isDetailOpenRef.current = true;
        updateStageVisibility(true);
        selectCallbackRef.current?.(project as never);
      } else {
        isDetailOpenRef.current = false;
        updateStageVisibility(isInViewport);
        closeCallbackRef.current?.();
      }
    };

    window.addEventListener('work:project-change', handleProjectEvent);

    return () => {
      observer.disconnect();
      clearInterval(stageCheckInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('work:project-change', handleProjectEvent);

      // Hide WebGL Stage so it doesn't overlay or intercept clicks in other sections
      const stage = document.getElementById('Stage');
      if (stage) {
        stage.style.display = 'none';
        stage.style.pointerEvents = 'none';
      }

      // Close open project detail overlay state if active
      closeProjectDetail();
    };
  }, [baseRoute, projects, initialSlug]);

  return (
    <div
      ref={containerRef}
      id="work-experience-root"
      className={`work-experience-container relative w-full h-full min-h-screen overflow-hidden bg-[#311432] border-0 border-none outline-none ${className}`}
      style={style}
    />
  );
});

export default WorkExperience;


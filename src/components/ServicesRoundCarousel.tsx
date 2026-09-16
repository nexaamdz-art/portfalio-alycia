import React, { useEffect, useRef } from "react";

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  category: string;
  badge: string;
  gradient: string;
  image: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 1,
    title: "Web Development",
    category: "Modern Web",
    description: "Fast, fully responsive modern websites built with cutting-edge technologies.",
    badge: "Most Popular",
    gradient: "linear-gradient(135deg, rgba(30,27,75,0.85) 0%, rgba(67,56,202,0.85) 100%)",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "E-Commerce Solutions",
    category: "Online Store",
    description: "Comprehensive e-commerce platforms with seamless shopping and payment integrations.",
    badge: "High Conversion",
    gradient: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(2,132,199,0.85) 100%)",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Progressive Web Apps",
    category: "PWAs",
    description: "Advanced web applications that run with the speed and feel of native apps.",
    badge: "Next-Gen Tech",
    gradient: "linear-gradient(135deg, rgba(49,27,146,0.85) 0%, rgba(123,31,162,0.85) 100%)",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "UI/UX Design",
    category: "User Experience",
    description: "Unique and attractive designs that ensure optimal user experience and highlight your brand.",
    badge: "Creative Design",
    gradient: "linear-gradient(135deg, rgba(6,78,59,0.85) 0%, rgba(16,185,129,0.85) 100%)",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Interactive 3D Web",
    category: "Immersive Web",
    description: "Interactive 3D web experiences that increase engagement and make your site stand out.",
    badge: "Immersive",
    gradient: "linear-gradient(135deg, rgba(136,19,55,0.85) 0%, rgba(225,29,72,0.85) 100%)",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "MVP & Startups",
    category: "Prototyping",
    description: "Transforming startup ideas into launch-ready prototypes to quickly meet market demands.",
    badge: "End-to-End",
    gradient: "linear-gradient(135deg, rgba(76,29,149,0.85) 0%, rgba(124,58,237,0.85) 100%)",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800",
  },
];

interface ServicesCarouselProps {
  services?: ServiceItem[];
  imageWidth?: number;
  imageHeight?: number;
  spacing?: number;
  speed?: number;
  direction?: "right" | "left";
  drag?: boolean;
  sensitivity?: number;
  tilt?: number;
  perspective?: number;
  cornerRadius?: number;
  innerDim?: number;
  background?: string;
  style?: React.CSSProperties;
}

export default function ServicesRoundCarousel({
  services = SERVICES_DATA,
  imageWidth = 320,
  imageHeight = 380,
  spacing = 3,
  speed = 5,
  direction = "right",
  drag = true,
  sensitivity = 5,
  tilt = -6,
  perspective = 2500,
  cornerRadius = 24,
  innerDim = 3.5,
  background = "transparent",
  style = {},
}: ServicesCarouselProps) {
  const items = services.length > 0 ? services : SERVICES_DATA;
  const count = items.length;

  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const rotYRef = useRef(0);
  const velRef = useRef(0);
  const lastRef = useRef(0);
  const dragRef = useRef({ active: false, x: 0 });

  const angle = 360 / count;
  const factor = 1 + spacing * 0.15;
  const radius = (imageWidth * factor) / (2 * Math.tan(Math.PI / count));
  const radiusPx = cornerRadius;
  const degPerSec = speed * 6 * (direction === "left" ? -1 : 1);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const apply = () =>
      (ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`);
    apply();

    const draw = (now: number) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);
      const d = dragRef.current;
      if (!d.active) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * f;
          velRef.current *= 0.94;
        } else {
          rotYRef.current += degPerSec * f;
        }
      }
      apply();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, degPerSec, count]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!drag) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { active: true, x: e.clientX };
    velRef.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    const k = 0.3 * sensitivity;
    rotYRef.current += dx * k;
    velRef.current = dx * k * 60;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    dragRef.current.active = false;
  };

  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: radiusPx,
    overflow: "hidden",
    backfaceVisibility: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
  };

  return (
    <section id="services" className="w-full py-24 flex flex-col items-center justify-center min-h-screen relative z-10 px-6 sm:px-10 lg:px-12 xl:px-16" dir="ltr">
      {/* Header Section */}
      <div className="text-center mb-16 px-4 max-w-2xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Our Specialized Services
        </h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          We transform your ideas into integrated digital solutions. Partner with us from concept and design to a successful launch, delivered on time and with exceptional quality.
        </p>
      </div>

      {/* Carousel Container */}
      <div
        style={{
          ...style,
          width: "100%",
          height: imageHeight + 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background,
          perspective: `${perspective}px`,
          cursor: drag ? "grab" : "default",
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt}deg)`,
          }}
        >
          <div
            ref={ringRef}
            style={{
              position: "relative",
              width: imageWidth,
              height: imageHeight,
              transformStyle: "preserve-3d",
            }}
          >
            {items.map((item, i) => {
              return (
                <div
                  key={item.id || i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front Card Face */}
                  <div
                    style={{
                      ...faceBase,
                      backgroundImage: `${item.gradient}, url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      color: "#fff",
                      direction: "ltr",
                    }}
                  >
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-sky-300 mb-4">
                        {item.badge}
                      </span>
                      <p className="text-xs text-slate-300 font-sans tracking-wider mb-1 uppercase">
                        {item.category}
                      </p>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed opacity-90 font-sans-modern">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-sm font-medium text-sky-200 cursor-pointer hover:text-white transition-colors">
                        Inquire about service &rarr;
                      </span>
                    </div>
                  </div>

                  {/* Back Card Face */}
                  <div
                    style={{
                      ...faceBase,
                      transform: "rotateY(180deg)",
                      backgroundImage: `${item.gradient}, url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: `brightness(${innerDim / 10})`,
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

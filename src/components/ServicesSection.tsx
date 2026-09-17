import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Code,
  ShoppingBag,
  Layers,
  Palette,
  Box,
  Rocket,
  type LucideIcon,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  icon: LucideIcon;
}

const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'service-web-dev',
    title: 'Modern Web Development',
    icon: Code,
  },
  {
    id: 'service-ecommerce',
    title: 'E-Commerce Solutions',
    icon: ShoppingBag,
  },
  {
    id: 'service-pwa',
    title: 'Progressive Web Apps (PWAs)',
    icon: Layers,
  },
  {
    id: 'service-uiux',
    title: 'UI/UX Design',
    icon: Palette,
  },
  {
    id: 'service-3d-web',
    title: 'Interactive 3D Web Experiences',
    icon: Box,
  },
  {
    id: 'service-mvp',
    title: 'Startup & MVP Solutions',
    icon: Rocket,
  },
];

interface TiltCardProps {
  key?: React.Key;
  service: ServiceItem;
  index: number;
}

function ServiceCard({ service, index }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = service.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt calculation (-10 to +10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      id={service.id}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12, // 120ms staggered delay between each card
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="perspective-1000 w-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out'
            : 'transform 0.5s ease-out, box-shadow 0.5s ease-out, border-color 0.5s ease-out',
        }}
        className={`relative group flex items-center gap-5 p-6 rounded-2xl bg-[#240d25]/85 backdrop-blur-md border cursor-pointer select-none transition-all duration-300 ${
          isHovered
            ? 'border-transparent shadow-[0_0_30px_rgba(147,51,234,0.45),0_0_15px_rgba(219,39,119,0.3)]'
            : 'border-white/10 hover:border-purple-500/30'
        }`}
      >
        {/* Purple-to-pink gradient border glow wrapper on hover */}
        <div
          aria-hidden="true"
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 -z-10 transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Inner background mask to preserve card body darkness */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-[#240d25] -z-[5] pointer-events-none"
        />

        {/* Gradient Icon Badge */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-purple-500/30 shrink-0 group-hover:border-pink-500/50 group-hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-300" />
          <IconComponent className="w-6 h-6 text-purple-300 group-hover:text-pink-200 transition-colors duration-300" />
        </div>

        {/* Service Title Only */}
        <h3 className="font-sans-modern text-lg md:text-xl font-semibold text-white tracking-tight leading-snug group-hover:text-purple-100 transition-colors duration-200">
          {service.title}
        </h3>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section
      id="services"
      aria-label="Services"
      dir="ltr"
      className="w-full py-28 px-6 sm:px-10 lg:px-12 xl:px-16 relative z-10 flex flex-col items-center justify-center bg-transparent"
    >
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-900/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center mb-16 max-w-2xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
        >
          Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto"
        >
          End-to-end digital expertise engineered to bring visionary products and immersive experiences to life.
        </motion.p>
      </div>

      {/* Grid Layout: 2 or 3 columns on desktop */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7 relative z-10">
        {SERVICES_LIST.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

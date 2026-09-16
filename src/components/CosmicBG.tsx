import React, { useEffect, useRef } from "react";

interface CosmicBGProps {
  coreColor?: string;
  midColor?: string;
  accentColor?: string;
  outerColor?: string;
  brightness?: number;
  speed?: number;
  rotation?: number;
}

export default function CosmicBG({
  coreColor = "#6823C3",
  midColor = "#007BFF",
  accentColor = "#9900FF",
  outerColor = "#0F172A",
  brightness = 35,
  speed = 15,
  rotation = 10,
}: CosmicBGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      time += 0.001 * speed;
      
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.max(width, height) * 0.8;

      // Base background
      ctx.fillStyle = outerColor;
      ctx.fillRect(0, 0, width, height);

      // Create complex cosmic gradient
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((time * rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      const gradient = ctx.createRadialGradient(
        centerX + Math.sin(time) * 100, 
        centerY + Math.cos(time) * 100, 
        0, 
        centerX, 
        centerY, 
        maxRadius
      );

      gradient.addColorStop(0, coreColor);
      gradient.addColorStop(0.3, midColor);
      gradient.addColorStop(0.6, accentColor);
      gradient.addColorStop(1, "transparent");

      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = brightness / 100;
      ctx.fillStyle = gradient;
      ctx.fillRect(-width, -height, width * 3, height * 3);
      
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [coreColor, midColor, accentColor, outerColor, brightness, speed, rotation]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{ filter: "blur(40px)" }}
    />
  );
}

"use client";

import React, { useEffect, useState } from "react";

export function OceanBackground() {
  const [bubbles, setBubbles] = useState<
    {
      id: number;
      left: number;
      size: number;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    // Generate random bubbles on client side to avoid hydration mismatch
    const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 10 + 5, // 5px to 15px
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * 10,
    }));

    // Use a small timeout to ensure this runs after mount, or just set it directly.
    // Since we are in useEffect with [], it runs once after mount.
    // The linter warning is about synchronous updates, but here it's the intended behavior for client-side only generation.
    // However, to satisfy the linter and ensure it's treated as an effect of mounting:
    const timer = setTimeout(() => {
      setBubbles(newBubbles);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Deep Ocean Gradient Base */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0f172a_0%,#020617_100%)]" />

      {/* Sunlight Caustics Effect (Top) */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_-20%,#22d3ee_0%,transparent_50%)] animate-pulse-slow" />

      {/* Secondary Light Source (Deep Teal) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#2dd4bf_0%,transparent_60%)]" />

      {/* Animated Bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute -bottom-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          style={{
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animation: `float-up ${bubble.duration}s linear infinite`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}

      {/* Noise Texture Overlay for "Water" feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Cfilter id=%27g%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23g)%27 opacity=%270.5%27/%3E%3C/svg%3E')] mix-blend-overlay" />

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          50% {
            transform: translateY(-50vh) translateX(20px);
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(-20px);
            opacity: 0;
          }
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

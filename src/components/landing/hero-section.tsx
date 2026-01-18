import Link from "next/link";
import { ArrowRight, Anchor } from "lucide-react";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        Now covering all Western Australian waters
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg max-w-4xl mx-auto leading-[1.1]">
        <span className="block text-transparent bg-clip-text bg-linear-to-b from-white to-white/70">
          Navigate the Fishing&apos;s
        </span>
        <span className="block text-transparent bg-clip-text bg-linear-to-b from-cyan-200 to-cyan-500">
          Rules & Regulations
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
        Your intelligent companion for recreational fishing. Instantly access
        bag limits, size rules, and species identification powered by AI.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <Link
          href="/chat"
          className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-cyan-600 rounded-full hover:bg-cyan-500 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 focus:ring-offset-slate-900"
        >
          <span className="mr-2">Start Exploring</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/about"
          className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-300 transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white backdrop-blur-sm"
        >
          <Anchor className="w-4 h-4 mr-2" />
          How it works
        </Link>
      </div>
    </div>
  );
}

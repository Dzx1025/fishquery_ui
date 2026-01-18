import Image from "next/image";
import Link from "next/link";
import { OceanBackground } from "@/components/landing/ocean-background";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFeatures } from "@/components/landing/landing-features";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <OceanBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center">
              <Image
                src="/favicon.ico"
                alt="FishQuery Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              FishQuery
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="https://www.dpird.wa.gov.au/individuals/recreational-fishing/recreational-fishing-guides/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block text-sm font-medium text-white hover:text-cyan-300 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-sm font-semibold text-white transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 gap-20">
        <HeroSection />
        <LandingFeatures />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} FishQuery. All rights reserved.</p>
      </footer>
    </main>
  );
}

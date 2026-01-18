import Image from "next/image";
import Link from "next/link";
import { OceanBackground } from "@/components/landing/ocean-background";
import { Sparkles, Clock, Gift, Waves } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <OceanBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/30 transition-all">
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
          </Link>

          <Link
            href="/chat"
            className="px-6 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold text-white transition-all shadow-lg shadow-cyan-900/20"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-3xl w-full text-center space-y-12">
          {/* Hero Section */}
          <section className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-medium backdrop-blur-sm">
              <Sparkles size={14} />
              Simple & Transparent
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Free for <span className="text-cyan-400">Everyone</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              FishQuery is currently a free tool for all recreational fishers. I
              believe that access to sustainable fishing information should be
              open to all.
            </p>
          </section>

          {/* Pricing Card */}
          <section className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-8 md:p-12 rounded-4xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden">
              <div className="flex flex-col items-center space-y-8">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Gift size={40} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">
                    Current Plan: $0
                  </h2>
                  <p className="text-cyan-400 font-medium">30 chats per day</p>
                </div>

                <ul className="space-y-4 text-left w-full max-w-xs mx-auto">
                  <li className="flex items-center gap-3 text-slate-300">
                    <Waves className="text-cyan-500 w-5 h-5 shrink-0" />
                    <span>All WA Fishing Rules</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <Waves className="text-cyan-500 w-5 h-5 shrink-0" />
                    <span>AI Species Identification</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <Waves className="text-cyan-500 w-5 h-5 shrink-0" />
                    <span>Location-based Regulations</span>
                  </li>
                </ul>

                <Link
                  href="/chat"
                  className="w-full py-4 rounded-2xl bg-white text-slate-950 font-bold hover:bg-cyan-50 transition-colors text-center"
                >
                  Start Fishing Now
                </Link>
              </div>
            </div>
          </section>

          {/* Future Note */}
          <section className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4 text-left max-w-2xl mx-auto">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-white font-semibold">
                Future Considerations
              </h4>
              <p className="text-slate-400 text-sm">
                While FishQuery is free today, I may introduce premium features
                or subscription plans in the future to support ongoing
                development and server costs.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} FishQuery. Keeping the ocean accessible.
        </p>
      </footer>
    </main>
  );
}

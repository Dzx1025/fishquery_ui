import Image from "next/image";
import Link from "next/link";
import { OceanBackground } from "@/components/landing/ocean-background";
import { Anchor, Shield, Info, Waves, User } from "lucide-react";

export default function AboutPage() {
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
      <div className="flex-1 flex flex-col items-center pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-4xl w-full space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-medium backdrop-blur-sm">
              <Info size={14} />
              The Mission
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Protecting our Oceans through{" "}
              <span className="text-cyan-400">Knowledge</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              FishQuery was born from a simple observation: recreational fishing
              rules are complex, location-dependent, and often hard to find when
              you&apos;re actually on the water. I built this AI-powered
              companion to make sustainable fishing accessible to everyone.
            </p>
          </section>

          {/* Values Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Compliance</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                I simplify complex legal jargon into clear, actionable rules so
                you can fish with confidence and stay within the law.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Waves size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Sustainability</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                By making bag and size limits easy to understand, I hope to help
                protect fish stocks for future generations of anglers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                <Anchor size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Accessibility</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you&apos;re a seasoned pro or a first-timer, my natural
                language interface makes finding rules as easy as asking a
                friend.
              </p>
            </div>
          </section>

          {/* Story Section */}
          <section className="relative p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-cyan-900/40 to-slate-900/40 border border-cyan-500/20 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 text-cyan-400">
                <User size={24} />
                <h2 className="text-3xl font-bold text-white">
                  The Solo Developer Story
                </h2>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  As an independent developer based in Western Australia, I
                  understand the unique challenges of navigating one of the
                  world&apos;s most diverse marine environments. From the
                  Ningaloo Reef to the Great Southern, regulations change as
                  quickly as the tides.
                </p>
                <p>
                  I combined my passion for fishing with state-of-the-art Large
                  Language Models and official DPIRD data to create a tool that
                  works in real-time. FishQuery is a solo project dedicated to
                  providing instant, accurate answers without the need to flip
                  through outdated brochures.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} FishQuery. Built with passion for the
          blue planet.
        </p>
      </footer>
    </main>
  );
}

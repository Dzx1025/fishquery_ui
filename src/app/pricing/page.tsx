"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-chart-4/5 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="px-6 py-6 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Chat
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
              <Image
                src="/favicon.ico"
                alt="FQ"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-black tracking-tight">FishQuery</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="h-3 w-3" />
            Coming Soon
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 font-serif">
              Premium Plans are Underway
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
              We&apos;re currently fine-tuning our membership features to
              provide you with the best experience. Stay tuned for advanced
              tools and increased limits.
            </p>
          </div>

          <div className="pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Take Me Back to Chat
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold font-serif opacity-50">
          FishQuery © 2026 • Made for Western Australia
        </p>
      </footer>
    </div>
  );
}

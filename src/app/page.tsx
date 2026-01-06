"use client"

import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Settings,
  ShieldCheck,
  MessageSquare,
  MapPin,
  ExternalLink,
  ChevronRight,
  Send,
  User,
  Info,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-all overflow-hidden border border-border/50">
              <img src="/favicon.ico" alt="FQ" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight hidden min-[460px]:block">FishQuery</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-80 hidden sm:block">WA Rules Assistant</span>
            </div>
          </Link>


          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            <div className="flex items-center gap-1 border-l border-border pl-3">
              <Link href="/login">
                <button className="text-sm font-bold text-muted-foreground hover:text-foreground px-3 py-2 sm:px-4 rounded-full transition-colors">
                  Log in
                </button>
              </Link>
            </div>

            <Link href="/chat">
              <button className="hidden sm:flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] hover:shadow-primary/30 active:scale-95 text-nowrap">
                Launch Chat
              </button>
              <button className="sm:hidden flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] hover:shadow-primary/30 active:scale-95 text-nowrap">
                Chat
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background py-16 md:py-32">
          <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary border border-primary/20">
                <ShieldCheck className="h-4 w-4" />
                Official WA Fishing Guidelines
              </div>
              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
                Navigate WA Fishing Rules with <span className="text-primary italic">Confidence.</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground font-sans leading-relaxed md:text-xl">
                Instant, AI-powered answers for Western Australia&apos;s recreational fishing regulations, size limits, and species identification.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/chat">
                  <button className="group flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-2xl active:scale-95">
                    Start Chatting Now <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
                <a href="https://www.dpird.wa.gov.au/individuals/recreational-fishing/recreational-fishing-guides/" target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 rounded-2xl border border-border bg-background px-8 py-4 text-lg font-bold shadow-sm transition-all hover:bg-muted/50">
                    Read the Rules
                  </button>
                </a>
              </div>
            </div>

            {/* Chat Mockup */}
            <div className="relative group">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative flex flex-col rounded-[2rem] border border-border bg-card shadow-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] md:aspect-auto">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden border border-border/50">
                      <img src="/assistant-avatar.png" alt="Assistant" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-bold">FishQuery Assistant</span>
                      <span className="text-[10px] text-chart-3 font-bold uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="h-8 w-8 rounded-full bg-muted flex flex-shrink-0 items-center justify-center"><User className="h-4 w-4" /></div>
                    <div className="rounded-2xl rounded-tr-none bg-muted px-4 py-2.5 text-sm font-medium max-w-[80%]">
                      Can I keep a West Australian Dhufish in the Perth region right now?
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full flex flex-shrink-0 items-center justify-center overflow-hidden border border-border/50">
                      <img src="/assistant-avatar.png" alt="Assistant" className="h-full w-full object-cover" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-primary text-primary-foreground px-4 py-3 text-sm font-medium shadow-lg shadow-primary/10 max-w-[85%] leading-relaxed">
                      <p className="mb-2 italic opacity-90">Checking DPIRD 2025 Guidelines...</p>
                      Yes, but currently the West Coast Bioregion is in an <span className="underline decoration-2 font-bold underline-offset-2">open season</span>.
                      <ul className="mt-2 space-y-1 list-disc list-inside text-xs opacity-90 font-sans">
                        <li>Min Size: 500mm</li>
                        <li>Bag Limit: 1 per person</li>
                        <li>Boat Limit: 2 per boat</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="h-8 w-8 rounded-full bg-muted flex flex-shrink-0 items-center justify-center"><User className="h-4 w-4" /></div>
                    <div className="rounded-2xl rounded-tr-none bg-muted px-4 py-2.5 text-sm font-medium">
                      Thanks! What about the closed season dates?
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-muted/30 border-t border-border mt-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask about rules, bag limits..."
                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      readOnly
                    />
                    <button className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-primary text-primary-foreground">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative background stuff */}
          <div className="absolute top-1/4 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl -z-0" />
          <div className="absolute bottom-0 right-0 h-[600px] w-[600px] bg-[radial-gradient(circle_at_bottom_right,var(--color-primary),transparent_70%)] opacity-[0.03] -z-0" />
        </section>

        {/* Features / Trust Section */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl mb-16 space-y-4">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">Why use FishQuery?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We bridge the gap between complex legal documents and the instant answers you need while on the water.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ShieldCheck className="h-7 w-7" />}
                title="Official Data Sync"
                description="Our AI models are trained and updated daily with guidelines from WA Department of Primary Industries and Regional Development."
              />
              <FeatureCard
                icon={<MapPin className="h-7 w-7" />}
                title="Location Aware"
                description="Get rules specific to the bioregion you are currently in. Marine parks, sanctuary zones, and local restrictions included."
              />
              <FeatureCard
                icon={<MessageSquare className="h-7 w-7" />}
                title="Plain Language"
                description="No more scrolling through PDFs. Ask in plain English and get straightforward answers about boat limits and gear restrictions."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 border-t border-border">
          <div className="mx-auto max-w-5xl rounded-[3rem] bg-foreground text-background p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black">Ready for your next catch?</h2>
              <p className="text-lg opacity-80 max-w-xl mx-auto">
                Join thousands of responsible WA anglers using FishQuery to protect our marine life and stay compliant.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/chat">
                  <button className="rounded-full bg-background text-foreground px-10 py-4 font-bold transition-transform hover:scale-105 active:scale-95">
                    Launch Assistant
                  </button>
                </Link>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 h-full w-full opacity-20 bg-[radial-gradient(circle_at_top_right,var(--color-primary),transparent_50%)]" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
                  <img src="/favicon.ico" alt="FQ" className="h-full w-full object-cover" />
                </div>
                <span className="text-xl font-bold tracking-tight">FishQuery</span>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
                FishQuery is an AI-powered assistant designed to help West Australian recreational fishers understand and comply with local regulations.
              </p>
              <div className="flex items-center gap-3 text-xs font-bold font-sans rounded-lg bg-chart-4/10 text-chart-4 border border-chart-4/20 p-4">
                <Info className="h-4 w-4 flex-shrink-0" />
                <span>DISCLAIMER: This is an AI tool. Always verify rules with official DPIRD sources before fishing.</span>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Resources</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="https://www.wa.gov.au/organisation/department-of-primary-industries-and-regional-development" target="_blank" rel="noopener noreferrer" className="hover:text-primary">DPIRD Website</a></li>
                <li><a href="https://rules.fish.wa.gov.au/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Species Guide</a></li>
                <li><a href="https://www.dpird.wa.gov.au/individuals/recreational-fishing/recreational-fishing-guides/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Fishing Rules Guide</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Contact</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="https://dzx1025.com/" className="hover:text-primary">Support</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-8 text-xs font-medium text-muted-foreground">
            <p>© 2026 FishQuery Assistant. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/Dzx1025/fishquery_ui" className="flex items-center gap-1 hover:text-foreground">GitHub <ExternalLink className="h-3 w-3" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:translate-y-[-4px]">
      <div className="mb-6 h-14 w-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  )
}

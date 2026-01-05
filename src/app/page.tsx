"use client"

import { ModeToggle } from "@/components/mode-toggle";
import {
  Plus,
  Search,
  Settings,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">F</div>
            <span className="text-xl font-bold tracking-tight">FishQuery UI</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
              <a href="#" className="hover:text-foreground transition-colors">Components</a>
              <a href="#" className="hover:text-foreground transition-colors">Themes</a>
              <a href="#" className="hover:text-foreground transition-colors">Docs</a>
            </div>
            <ModeToggle />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 space-y-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-primary px-8 py-20 text-primary-foreground shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-white/20">
              <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
              v1.0.0 Now Available
            </div>
            <h1 className="font-serif text-5xl font-bold leading-tight md:text-6xl">
              Beautifully crafted for <span className="italic font-light">modern</span> web apps.
            </h1>
            <p className="text-lg text-primary-foreground/80 font-sans leading-relaxed">
              Explore our design system powered by OKLCH colors, fluid typography, and dynamic shadow systems.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary transition-all hover:scale-105 hover:shadow-lg active:scale-95">
                Go Fishing <ArrowRight className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold backdrop-blur-sm transition-all hover:bg-white/10">
                View GitHub
              </button>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 right-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl underline" />
        </section>

        {/* Color Palette */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">System Colors</h2>
            <p className="text-muted-foreground italic">Powered by OKLCH for consistent perceived lightness.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            <ColorSwatch name="Primary" bg="bg-primary" text="text-primary-foreground" />
            <ColorSwatch name="Secondary" bg="bg-secondary" text="text-secondary-foreground" />
            <ColorSwatch name="Muted" bg="bg-muted" text="text-muted-foreground" />
            <ColorSwatch name="Accent" bg="bg-accent" text="text-accent-foreground" />
            <ColorSwatch name="Card" bg="bg-card" text="text-card-foreground" border="border border-border" />
            <ColorSwatch name="Popover" bg="bg-popover" text="text-popover-foreground" border="border border-border" />
            <ColorSwatch name="Destructive" bg="bg-destructive" text="text-destructive-foreground" />
            <ColorSwatch name="Background" bg="bg-background" text="text-foreground" border="border border-border" />
          </div>
        </section>

        {/* Typography & Shadows */}
        <div className="grid gap-12 md:grid-cols-2">
          {/* Typography */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Typography</h2>
            <div className="space-y-6 rounded-2xl border border-border p-8">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Sans-Serif (Default)</p>
                <p className="font-sans text-3xl font-medium">Inter Interface Text</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Serif</p>
                <p className="font-serif text-3xl italic">Elegant Lora Display</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Monospace</p>
                <p className="font-mono text-xl text-primary">const fish = "query";</p>
              </div>
            </div>
          </section>

          {/* Shadows & Radii */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">Elevations</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex h-32 items-center justify-center rounded-sm bg-card shadow-sm border border-border/50 font-medium">shadow-sm</div>
              <div className="flex h-32 items-center justify-center rounded-md bg-card shadow-md border border-border/50 font-medium">shadow-md</div>
              <div className="flex h-32 items-center justify-center rounded-lg bg-card shadow-lg border border-border/50 font-medium">shadow-lg</div>
              <div className="flex h-32 items-center justify-center rounded-xl bg-card shadow-xl border border-border/50 font-medium">shadow-xl</div>
            </div>
          </section>
        </div>

        {/* Components Preview */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">Interactive Components</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Action Card */}
            <div className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Search Database</h3>
              <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                Connect your data sources and perform high-speed queries across all fish species.
              </p>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:bg-secondary/80">
                Launch Search
              </button>
            </div>

            {/* Status Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  <Clock className="h-3 w-3" /> Processing
                </span>
                <Settings className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Latest Analysis</h3>
              <div className="space-y-3">
                <StatusItem icon={<CheckCircle2 className="text-green-500" />} label="Database Connection" status="Healthy" />
                <StatusItem icon={<CheckCircle2 className="text-green-500" />} label="Query Engine" status="Optimal" />
                <StatusItem icon={<AlertCircle className="text-amber-500" />} label="Storage Capacity" status="85% Full" />
              </div>
            </div>

            {/* Activity Card */}
            <div className="rounded-3xl bg-secondary/30 p-6 border border-border/50 backdrop-blur-sm shadow-2xs">
              <h3 className="mb-6 text-xl font-bold">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionButton icon={<Plus className="h-4 w-4" />} label="New Project" />
                <QuickActionButton icon={<ExternalLink className="h-4 w-4" />} label="Export Data" />
                <QuickActionButton icon={<CheckCircle2 className="h-4 w-4" />} label="Verify All" />
                <QuickActionButton icon={<Search className="h-4 w-4" />} label="Advanced" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-muted-foreground">
          <p>© 2026 FishQuery UI System. Designed with precision.</p>
        </div>
      </footer>
    </div>
  );
}

function ColorSwatch({ name, bg, text, border = "" }: { name: string, bg: string, text: string, border?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`aspect-square w-full rounded-2xl ${bg} ${border} shadow-sm transition-transform hover:scale-105 active:scale-95`} />
      <span className="text-xs font-semibold text-center">{name}</span>
    </div>
  )
}

function StatusItem({ icon, label, status }: { icon: React.ReactNode, label: string, status: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{status}</span>
    </div>
  )
}

function QuickActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 rounded-2xl bg-background p-4 text-sm font-medium border border-border/50 shadow-sm transition-all hover:shadow-md hover:bg-accent hover:text-accent-foreground active:scale-95">
      {icon}
      <span>{label}</span>
    </button>
  )
}

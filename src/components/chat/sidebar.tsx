"use client"

import * as React from "react"
import { ShieldCheck, MessageSquare, Info, ChevronRight } from "lucide-react"

function SidebarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-primary/10 hover:text-primary text-muted-foreground group">
            <div className="p-1.5 rounded-lg bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                {icon}
            </div>
            <span>{label}</span>
            <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    )
}

export function ChatSidebar() {
    return (
        <aside className="hidden md:flex flex-col w-72 border-r border-border bg-muted/30 p-4 space-y-6">
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">Quick Actions</h3>
                <div className="grid gap-2">
                    <SidebarButton icon={<ShieldCheck className="h-4 w-4" />} label="Review Daily Limits" />
                    <SidebarButton icon={<MessageSquare className="h-4 w-4" />} label="Species ID Guide" />
                </div>
            </div>
            <div className="mt-auto p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Info className="h-4 w-4" />
                    <span className="text-xs font-bold">Safe Fishing</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Always carry a physical copy of the fishing guide in areas with poor mobile reception.
                </p>
            </div>
        </aside>
    )
}

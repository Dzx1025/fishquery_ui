"use client"

import * as React from "react"
import { Source } from "@/types/chat"
import { SourceBadge } from "./source-badge"

export function SourcesList({ sources }: { sources: Source[] }) {
    if (sources.length === 0) return null

    return (
        <div className="mt-3 pt-3 border-t border-border/50">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Sources
            </div>
            <div className="flex flex-wrap gap-1.5">
                {sources.map((source) => (
                    <SourceBadge key={source.id} source={source} />
                ))}
            </div>
        </div>
    )
}

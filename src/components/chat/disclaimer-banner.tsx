"use client";

import { ShieldCheck } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-chart-4/5 border-b border-chart-4/10 px-6 py-2.5 flex items-center justify-center gap-2 text-[11px] font-semibold text-chart-4/80 font-serif">
      <ShieldCheck className="h-3 w-3" />
      <span>
        AI powered by official DPIRD 2025 guidelines. Always verify local signs.
      </span>
    </div>
  );
}

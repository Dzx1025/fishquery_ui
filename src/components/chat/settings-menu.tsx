"use client";

import * as React from "react";
import { Settings, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function SettingsMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 flex items-center justify-center">
        <Settings className="h-5 w-5 text-muted-foreground opacity-50" />
      </div>
    );
  }

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full hover:bg-muted transition-all duration-200 group ${
          isOpen ? "bg-muted text-primary" : "text-muted-foreground"
        }`}
        title="Settings"
      >
        <Settings
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-90 text-primary" : "group-hover:rotate-45"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-64 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="px-4 pb-2 border-b border-border/50 mb-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Preferences
            </h4>
          </div>

          <div className="px-2">
            <div className="flex flex-col gap-1">
              <div className="px-3 pt-1 pb-2 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-tight">
                Appearance
              </div>
              <div className="grid grid-cols-3 gap-1 px-1">
                {themes.map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[10px] font-bold tracking-tight">
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 px-2 pt-2 border-t border-border/50">
            <div className="px-3 py-1 mb-1">
              <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tight">
                System Info
              </span>
            </div>
            <div className="px-3 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-medium">App Version</span>
              <span className="font-bold opacity-50">v0.1.0-alpha</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

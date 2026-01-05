"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Use useLayoutEffect equivalent pattern to avoid cascading renders
    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Show placeholder during SSR to prevent hydration mismatch
    if (!mounted) {
        return <div className="w-[100px] h-9" /> // Placeholder to prevent layout shift
    }

    return (
        <div className="flex items-center rounded-full bg-muted/50 p-1 border border-border/50 backdrop-blur-sm">
            <button
                onClick={() => setTheme("light")}
                className={`rounded-full p-1.5 transition-all ${theme === "light"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                title="Light Mode"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`rounded-full p-1.5 transition-all ${theme === "dark"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                title="Dark Mode"
            >
                <Moon className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`rounded-full p-1.5 transition-all ${theme === "system"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                title="Follow System"
            >
                <Monitor className="h-4 w-4" />
            </button>
        </div>
    )
}

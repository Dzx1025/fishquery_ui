"use client"

import * as React from "react"
import { Send } from "lucide-react"

const RECOMMENDED_QUESTIONS: string[] = [
    "What is the boat limit for Western rock lobsters?",
    "What should I do if I catch an undersized fish?",
    "How should I measure a fish correctly?",
    "What licence exemptions apply to Aboriginal fishers?",
    "Is there a daily bag limit for southern garfish?",
    "What is shark depredation and how can it be mitigated?",
    "What is the purpose of using a release weight?",
    "Do I need a fishing licence to fish from a boat?",
    "What are the bag limits for demersal scalefish in the West Coast bioregion?",
    "Can I continue fishing once I've reached my daily bag limit?",
]

export function InitialQuestionScreen({
    onSubmit,
    isLoading
}: {
    onSubmit: (question: string) => void
    isLoading: boolean
}) {
    const [input, setInput] = React.useState("")

    // Randomly select 4 questions on mount (fixed impure function lint error)
    const [randomQuestions] = React.useState(() => {
        const shuffled = [...RECOMMENDED_QUESTIONS].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 4)
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        onSubmit(input.trim())
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 overflow-hidden">
                        <img src="/favicon.ico" alt="FQ" className="h-full w-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">What can I help you with?</h1>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Ask about WA fishing rules, size limits, bag limits, or species identification.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <div className="relative flex items-center rounded-[1.5rem] border border-border bg-card shadow-2xl transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50 overflow-hidden">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., What is the bag limit for barramundi?"
                            className="w-full py-4 pl-6 pr-16 bg-transparent text-sm focus:outline-none font-medium placeholder:text-muted-foreground/60"
                            disabled={isLoading}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap justify-center gap-2">
                    {randomQuestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => setInput(suggestion)}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                <p className="text-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-40">
                    FishQuery may make mistakes. Verify with DPIRD.
                </p>
            </div>
        </div>
    )
}

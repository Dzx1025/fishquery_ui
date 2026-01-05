"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import {
    Send,
    ArrowLeft,
    User,
    Settings,
    MessageSquare,
    Info,
    ShieldCheck,
    MoreVertical,
    Paperclip,
    Image as ImageIcon,
    Mic,
    ChevronRight
} from "lucide-react"

export default function ChatPage() {
    const router = useRouter()
    const [input, setInput] = React.useState("")
    const [messages, setMessages] = React.useState([
        {
            id: 1,
            role: "assistant",
            content: "Hello! I'm your FishQuery assistant. I can help you with Western Australia's recreational fishing rules, size limits, and species identification. What would you like to know today?",
            timestamp: "10:30 AM"
        }
    ])

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const newMessage = {
            id: messages.length + 1,
            role: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages([...messages, newMessage])
        setInput("")

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                role: "assistant",
                content: "I'm currently a demo. In a live version, I would query the DPIRD database for official Western Australia fishing regulations based on your question.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
        }, 1000)
    }

    return (
        <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/")}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                        title="Back to home"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <span className="text-xl font-bold tracking-tighter">FQ</span>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-base font-bold">FishQuery Assistant</span>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-chart-3 animate-pulse" />
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Online • Official Data</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                        <Settings className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground md:hidden">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Desktop Only */}
                <aside className="hidden md:flex flex-col w-72 border-r border-border bg-muted/30 p-4 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">Quick Actions</h3>
                        <div className="grid gap-2">
                            <SidebarButton icon={<ShieldCheck className="h-4 w-4" />} label="Review Daily Limits" />
                            <SidebarButton icon={<MessageSquare className="h-4 w-4" />} label="Species ID Guide" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">Recent Queries</h3>
                        <div className="space-y-1 text-sm font-medium text-muted-foreground overflow-y-auto max-h-[300px]">
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">Dhufish size limit Perth</button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">Rock Lobster rules 2024</button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">Marine Park zones near Hillarys</button>
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

                {/* Chat Interface */}
                <div className="flex-1 flex flex-col relative bg-background/50">
                    {/* Disclaimer Banner */}
                    <div className="bg-chart-4/5 border-b border-chart-4/10 px-6 py-2.5 flex items-center justify-center gap-2 text-[11px] font-semibold text-chart-4/80">
                        <ShieldCheck className="h-3 w-3" />
                        <span>AI powered by official DPIRD 2024 guidelines. Always verify local signs.</span>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    }`}>
                                    {msg.role === "assistant" ? <span className="font-bold text-xs">FQ</span> : <User className="h-5 w-5" />}
                                </div>
                                <div className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "items-end" : ""}`}>
                                    <div className={`rounded-2xl px-5 py-3 text-sm font-medium shadow-sm leading-relaxed ${msg.role === "assistant"
                                        ? "bg-card border border-border text-foreground rounded-tl-none"
                                        : "bg-primary text-primary-foreground rounded-tr-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground px-1 uppercase tracking-tighter opacity-60">
                                        {msg.timestamp}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-gradient-to-t from-background to-transparent">
                        <form
                            onSubmit={handleSend}
                            className="max-w-4xl mx-auto relative group"
                        >
                            <div className="relative flex items-center rounded-[1.5rem] border border-border bg-card shadow-2xl transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50 overflow-hidden">
                                <div className="flex items-center gap-1 pl-4 pr-2 border-r border-border py-3">
                                    <button type="button" className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                                        <Paperclip className="h-4 w-4" />
                                    </button>
                                    <button type="button" className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                                        <ImageIcon className="h-4 w-4" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask FishQuery about WA fishing rules..."
                                    className="w-full py-4 pl-4 pr-24 bg-transparent text-sm focus:outline-none font-medium placeholder:text-muted-foreground/60"
                                />
                                <div className="absolute right-2 flex items-center gap-1">
                                    <button type="button" className="hidden sm:flex p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
                                        <Mic className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="submit"
                                        className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <p className="text-[10px] text-center mt-4 text-muted-foreground font-medium uppercase tracking-widest opacity-40">
                            FishQuery may make mistakes. Verify with DPIRD.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SidebarButton({ icon, label }: { icon: React.ReactNode, label: string }) {
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

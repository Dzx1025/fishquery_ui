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
    ChevronRight,
    UserCircle,
    LogIn,
    Square
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000"

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

// --- Types ---
interface Source {
    type: "source"
    sourceType: "document"
    id: string
    title: string
    document: {
        content: string
        metadata: Record<string, unknown>
        score: number
        index: number
    }
}

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    sources?: Source[]
    timestamp: string
}

interface CitationPart {
    type: "text" | "citation"
    content: string
    source?: Source
}

// --- Citation Parsing ---
function parseCitations(text: string, sources: Source[]): CitationPart[] {
    const parts: CitationPart[] = []
    const regex = /\[citation:(\d+)\]/g
    let lastIndex = 0
    let match

    const sourceMap = new Map<number, Source>()
    sources.forEach((s) => {
        sourceMap.set(s.document.index, s)
    })

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: "text", content: text.slice(lastIndex, match.index) })
        }
        const sourceIndex = parseInt(match[1])
        const source = sourceMap.get(sourceIndex)
        parts.push({
            type: "citation",
            content: `[${sourceIndex}]`,
            source,
        })
        lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
        parts.push({ type: "text", content: text.slice(lastIndex) })
    }

    return parts
}

// --- Source Modal ---
function SourceModal({ source, onClose }: { source: Source; onClose: () => void }) {
    // Close on escape key
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {source.document.index}
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-sm">{source.title}</h3>
                            <p className="text-[10px] text-muted-foreground font-medium">
                                Relevance Score: {(source.document.score * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        Content
                    </div>
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-xl p-4 border border-border/50">
                        {source.document.content}
                    </div>

                    {source.document.metadata && Object.keys(source.document.metadata).length > 0 && (
                        <div className="mt-4">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                                Metadata
                            </div>
                            <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-2">
                                {Object.entries(source.document.metadata).map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-2 text-xs">
                                        <span className="font-bold text-muted-foreground min-w-[80px]">{key}:</span>
                                        <span className="text-foreground break-all">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- Citation Link Component ---
function CitationLink({ source, label }: { source?: Source; label: string }) {
    const [showPopover, setShowPopover] = React.useState(false)
    const [showModal, setShowModal] = React.useState(false)

    if (!source) {
        return <span className="text-muted-foreground">{label}</span>
    }

    return (
        <>
            <span className="relative inline-block">
                <button
                    className="text-primary hover:text-primary/80 font-semibold cursor-pointer hover:underline underline-offset-2"
                    onMouseEnter={() => setShowPopover(true)}
                    onMouseLeave={() => setShowPopover(false)}
                    onClick={() => setShowModal(true)}
                >
                    {label}
                </button>
                {showPopover && !showModal && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-card border border-border rounded-xl shadow-xl z-50 text-sm animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                        <div className="font-bold text-foreground mb-1 text-xs">{source.title}</div>
                        <div className="text-muted-foreground line-clamp-3 text-[11px] leading-relaxed">
                            {source.document.content}
                        </div>
                        <div className="mt-2 text-[10px] text-primary font-medium">
                            Click to view full source
                        </div>
                    </div>
                )}
            </span>
            {showModal && <SourceModal source={source} onClose={() => setShowModal(false)} />}
        </>
    )
}

// --- Message Content with Citations ---
function MessageContent({ content, sources }: { content: string; sources: Source[] }) {
    const parts = React.useMemo(
        () => parseCitations(content, sources),
        [content, sources]
    )

    return (
        <div className="whitespace-pre-wrap leading-relaxed">
            {parts.map((part, i) =>
                part.type === "citation" ? (
                    <CitationLink key={i} source={part.source} label={part.content} />
                ) : (
                    <span key={i}>{part.content}</span>
                )
            )}
        </div>
    )
}

// --- Source Badge with Hover and Click ---
function SourceBadge({ source }: { source: Source }) {
    const [showPopover, setShowPopover] = React.useState(false)
    const [showModal, setShowModal] = React.useState(false)

    return (
        <>
            <span className="relative inline-block">
                <button
                    className="inline-flex items-center px-2 py-1 rounded-md bg-muted/50 text-[10px] text-muted-foreground font-medium hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    onMouseEnter={() => setShowPopover(true)}
                    onMouseLeave={() => setShowPopover(false)}
                    onClick={() => setShowModal(true)}
                >
                    [{source.document.index}] {source.title}
                </button>
                {showPopover && !showModal && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-card border border-border rounded-xl shadow-xl z-50 text-sm animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                        <div className="font-bold text-foreground mb-1 text-xs">{source.title}</div>
                        <div className="text-muted-foreground line-clamp-3 text-[11px] leading-relaxed">
                            {source.document.content}
                        </div>
                        <div className="mt-2 text-[10px] text-primary font-medium">
                            Click to view full source
                        </div>
                    </div>
                )}
            </span>
            {showModal && <SourceModal source={source} onClose={() => setShowModal(false)} />}
        </>
    )
}

// --- Sources List ---
function SourcesList({ sources }: { sources: Source[] }) {
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

// --- Entry Screen ---
function ChatEntryScreen({ onSelectMode }: { onSelectMode: (mode: "anonymous" | "login") => void }) {
    return (
        <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                        <span className="text-3xl font-bold tracking-tighter">FQ</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Start Chatting</h1>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        Ask questions about Western Australia&apos;s recreational fishing rules, size limits, and species identification.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => onSelectMode("anonymous")}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-all group"
                    >
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <UserCircle className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-bold">Continue as Guest</div>
                            <div className="text-sm text-muted-foreground">No account needed. Chat history saved locally.</div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>

                    <button
                        onClick={() => onSelectMode("login")}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-all group"
                    >
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <LogIn className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-bold">Log in</div>
                            <div className="text-sm text-muted-foreground">Sync history across devices.</div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                </div>

                <p className="text-center text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest">
                    Powered by official DPIRD guidelines
                </p>
            </div>
        </div>
    )
}

// --- Initial Question Screen ---
function InitialQuestionScreen({
    onSubmit,
    isLoading
}: {
    onSubmit: (question: string) => void
    isLoading: boolean
}) {
    const [input, setInput] = React.useState("")

    // Randomly select 4 questions on mount
    const randomQuestions = React.useMemo(() => {
        const shuffled = [...RECOMMENDED_QUESTIONS].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, 4)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        onSubmit(input.trim())
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                        <span className="text-3xl font-bold tracking-tighter">FQ</span>
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

// --- Sidebar Button ---
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

// --- Main Chat Page ---
export default function ChatPage() {
    const router = useRouter()
    const [accessMode, setAccessMode] = React.useState<"anonymous" | "login" | null>(null)
    const [chatId, setChatId] = React.useState<string | null>(null)
    const [messages, setMessages] = React.useState<Message[]>([])
    const [input, setInput] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [currentSources, setCurrentSources] = React.useState<Source[]>([])
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const abortControllerRef = React.useRef<AbortController | null>(null)

    // Scroll to bottom on new messages
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Handle mode selection
    const handleModeSelect = (mode: "anonymous" | "login") => {
        if (mode === "login") {
            router.push("/login")
        } else {
            setAccessMode(mode)
        }
    }

    // Create chat session
    const createChatSession = async (message: string): Promise<string> => {
        const res = await fetch(`${API_URL}/api/chat/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
            credentials: "include",
        })
        if (!res.ok) {
            throw new Error("Failed to create chat session")
        }
        const data = await res.json()
        return data.chat_id
    }

    // Send message and handle SSE stream
    const sendMessage = async (content: string, existingChatId: string) => {
        const res = await fetch(`${API_URL}/api/chat/${existingChatId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Stream-Protocol": "ai-sdk",
            },
            body: JSON.stringify({ message: content }),
            credentials: "include",
            signal: abortControllerRef.current?.signal,
        })

        if (!res.ok) {
            throw new Error("Failed to send message")
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let assistantContent = ""
        const collectedSources: Source[] = []

        // Add empty assistant message
        const assistantMsgId = `assistant-${Date.now()}`
        setMessages((prev) => [
            ...prev,
            {
                id: assistantMsgId,
                role: "assistant",
                content: "",
                sources: [],
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
        ])

        let buffer = ""

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
                if (line.startsWith("event: ")) {
                    // Event type line, we handle data in next line
                    continue
                }
                if (line.startsWith("data: ")) {
                    const dataStr = line.slice(6)
                    if (dataStr === "[DONE]") continue

                    try {
                        const parsed = JSON.parse(dataStr)

                        // Handle source events
                        if (parsed.type === "source" && parsed.value) {
                            const sourceData = parsed.value
                            collectedSources.push(sourceData)
                            setCurrentSources([...collectedSources])
                        }

                        // Handle text-delta events
                        if (parsed.type === "text-delta" && parsed.value?.delta) {
                            assistantContent += parsed.value.delta
                            setMessages((prev) => {
                                const updated = [...prev]
                                const lastMsg = updated[updated.length - 1]
                                if (lastMsg && lastMsg.role === "assistant") {
                                    updated[updated.length - 1] = {
                                        ...lastMsg,
                                        content: assistantContent,
                                        sources: collectedSources,
                                    }
                                }
                                return updated
                            })
                        }
                    } catch {
                        // Ignore parse errors
                    }
                }
            }
        }

        // Final update with all sources
        setMessages((prev) => {
            const updated = [...prev]
            const lastMsg = updated[updated.length - 1]
            if (lastMsg && lastMsg.role === "assistant") {
                updated[updated.length - 1] = {
                    ...lastMsg,
                    content: assistantContent,
                    sources: collectedSources,
                }
            }
            return updated
        })
    }

    // Handle first question from initial screen
    const handleFirstQuestion = async (question: string) => {
        setIsLoading(true)
        abortControllerRef.current = new AbortController()

        try {
            // Create chat session first
            const newChatId = await createChatSession(question)
            setChatId(newChatId)

            // Add user message
            const userMsgId = `user-${Date.now()}`
            setMessages([
                {
                    id: userMsgId,
                    role: "user",
                    content: question,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
            ])

            // Send the message to get response
            await sendMessage(question, newChatId)
        } catch (error) {
            console.error("Failed to start chat:", error)
        } finally {
            setIsLoading(false)
            abortControllerRef.current = null
        }
    }

    // Handle subsequent messages
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading || !chatId) return

        const question = input.trim()
        setInput("")
        setIsLoading(true)
        abortControllerRef.current = new AbortController()

        // Add user message
        const userMsgId = `user-${Date.now()}`
        setMessages((prev) => [
            ...prev,
            {
                id: userMsgId,
                role: "user",
                content: question,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
        ])

        try {
            await sendMessage(question, chatId)
        } catch (error) {
            console.error("Failed to send message:", error)
        } finally {
            setIsLoading(false)
            abortControllerRef.current = null
        }
    }

    // Stop generation
    const handleStop = () => {
        abortControllerRef.current?.abort()
        setIsLoading(false)
    }

    // Reset chat
    const resetChat = () => {
        setChatId(null)
        setMessages([])
        setCurrentSources([])
        setInput("")
    }

    // Show entry screen if no mode selected
    if (!accessMode) {
        return (
            <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
                <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md">
                    <button
                        onClick={() => router.push("/")}
                        className="p-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    <ModeToggle />
                </header>
                <ChatEntryScreen onSelectMode={handleModeSelect} />
            </div>
        )
    }

    // Show initial question screen if no chat started
    if (!chatId) {
        return (
            <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
                <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md">
                    <button
                        onClick={() => setAccessMode(null)}
                        className="p-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    <ModeToggle />
                </header>
                <InitialQuestionScreen onSubmit={handleFirstQuestion} isLoading={isLoading} />
                <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-center gap-2 text-[10px] font-semibold text-muted-foreground/60">
                    <ShieldCheck className="h-3 w-3" />
                    <span>AI powered by official DPIRD 2025 guidelines</span>
                </div>
            </div>
        )
    }

    // Main chat interface
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
                                <span className={`h-2 w-2 rounded-full ${isLoading ? "bg-chart-4 animate-pulse" : "bg-chart-3"}`} />
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                    {isLoading ? "Thinking..." : "Online"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={resetChat}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
                    >
                        New Chat
                    </button>
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
                        <span>AI powered by official DPIRD 2025 guidelines. Always verify local signs.</span>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                        {messages.map((message) => {
                            const isUser = message.role === "user"

                            return (
                                <div
                                    key={message.id}
                                    className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
                                >
                                    <div
                                        className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isUser
                                            ? "bg-muted text-muted-foreground"
                                            : "bg-primary text-primary-foreground"
                                            }`}
                                    >
                                        {isUser ? (
                                            <User className="h-5 w-5" />
                                        ) : (
                                            <span className="font-bold text-xs">FQ</span>
                                        )}
                                    </div>
                                    <div
                                        className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[70%] ${isUser ? "items-end" : ""
                                            }`}
                                    >
                                        <div
                                            className={`rounded-2xl px-5 py-3 text-sm font-medium shadow-sm ${isUser
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-card border border-border text-foreground rounded-tl-none"
                                                }`}
                                        >
                                            {isUser ? (
                                                <p>{message.content}</p>
                                            ) : message.content === "" && isLoading ? (
                                                <div className="flex gap-1.5 py-1">
                                                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                                                </div>
                                            ) : (
                                                <>
                                                    <MessageContent
                                                        content={message.content}
                                                        sources={message.sources || []}
                                                    />
                                                    {message.sources && message.sources.length > 0 && (
                                                        <SourcesList sources={message.sources} />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground px-1 uppercase tracking-tighter opacity-60">
                                            {message.timestamp}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}

                        {isLoading && messages[messages.length - 1]?.role === "user" && (
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                    <span className="font-bold text-xs">FQ</span>
                                </div>
                                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-5 py-3">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-gradient-to-t from-background to-transparent">
                        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
                            <div className="relative flex items-center rounded-[1.5rem] border border-border bg-card shadow-2xl transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50 overflow-hidden">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask FishQuery about WA fishing rules..."
                                    className="w-full py-4 pl-6 pr-24 bg-transparent text-sm focus:outline-none font-medium placeholder:text-muted-foreground/60"
                                    disabled={isLoading}
                                />
                                <div className="absolute right-2 flex items-center gap-1">
                                    {isLoading ? (
                                        <button
                                            type="button"
                                            onClick={handleStop}
                                            className="p-2.5 rounded-xl bg-destructive text-destructive-foreground shadow-lg hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <Square className="h-5 w-5" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={!input.trim()}
                                            className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            <Send className="h-5 w-5" />
                                        </button>
                                    )}
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

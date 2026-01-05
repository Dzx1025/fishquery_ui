"use client"

import * as React from "react"
import { User } from "lucide-react"
import { Message } from "@/types/chat"
import { MessageContent } from "./message-content"
import { SourcesList } from "./sources-list"

interface ChatMessageProps {
    message: Message
    isLoading: boolean
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
    const isUser = message.role === "user"
    const showLoading = !isUser && message.content === "" && isLoading

    return (
        <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
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
                    ) : showLoading ? (
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
}

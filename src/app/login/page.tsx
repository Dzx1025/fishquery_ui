"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.push("/")}
                    className="p-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </button>
                <ModeToggle />
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-2">
                        <div className="mx-auto h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 mb-4">
                            <span className="text-2xl font-bold tracking-tighter">FQ</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground text-sm">
                            Log in to your FishQuery account to save your favorite spots and rules.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold px-1" htmlFor="email">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-sm font-semibold" htmlFor="password">Password</label>
                                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:translate-y-[-1px] hover:shadow-xl active:scale-95 transition-all">
                            Log in
                        </button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-bold text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </main>

            <footer className="p-6 text-center text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-50">
                © 2026 FishQuery Assistant • Responsible Fishing WA
            </footer>
        </div>
    )
}

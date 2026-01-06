"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { register } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(email, username, password);
      if (res.status === "success") {
        setSuccess(res.message || "Registration successful");
        // Refresh auth state to get the newly logged-in user
        await checkAuth();
        // Redirect after a brief delay to show success message
        setTimeout(() => {
          router.push("/chat");
        }, 500);
      } else {
        // Handle error response
        if (res.errors) {
          // Get first error from errors object
          const firstError = Object.values(res.errors)[0]?.[0];
          setError(
            firstError ||
              res.message ||
              "Registration failed. Please try again.",
          );
        } else {
          setError(res.message || "Registration failed. Please try again.");
        }
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

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

      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-[450px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 mb-4 overflow-hidden">
              <Image
                src="/favicon.ico"
                alt="FQ"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Join FishQuery to stay updated on WA fishing rules and manage your
              custom alerts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-chart-3/10 border border-chart-3/20 text-chart-3 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold px-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="fish_master_wa"
                  className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold px-1" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold px-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground px-1 font-medium">
                Must be at least 8 characters long.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:translate-y-[-1px] hover:shadow-xl active:scale-95 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-chart-3/80 pt-4">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure encryption enabled</span>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-50">
        © 2026 FishQuery Assistant • Pro-Angler Environment
      </footer>
    </div>
  );
}

"use client";

import * as React from "react";
import { User, LogOut, Loader2, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function UserProfileButton() {
  const { user, isAuthenticated, loading, logout, fetchProfile } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const handleClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setIsFetching(true);
    await fetchProfile();
    setIsFetching(false);
    setIsOpen(true);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    window.location.href = "/chat";
  };

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleClick}
        disabled={isFetching}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted transition-colors disabled:opacity-70"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {isFetching ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : (
            <User className="h-4 w-4 text-primary" />
          )}
        </div>
        {user && (
          <>
            <span className="text-sm font-semibold">{user.username}</span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {isOpen && user && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg py-2 z-50">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily Usage</span>
              <span className="font-medium">
                {user.messages_used_today}/{user.daily_message_quota}
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (user.messages_used_today / user.daily_message_quota) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Plan</span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  user.subscription_type === "premium"
                    ? "bg-chart-4/10 text-chart-4"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {user.subscription_type}
              </span>
            </div>
          </div>
          <div className="px-2 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

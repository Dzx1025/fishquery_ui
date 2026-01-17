"use client";

import * as React from "react";
import { AlertCircle, X } from "lucide-react";

interface ErrorModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export function ErrorModal({ show, message, onClose }: ErrorModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-destructive/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Message Limit Reached
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          {message.toLowerCase().includes("upgrade") && (
            <a
              href="/pricing"
              className="px-5 py-2.5 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Upgrade Plan
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

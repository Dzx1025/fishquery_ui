// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth, AuthState } from "@/lib/hooks/useAuth";
import { LoginCredentials, RegisterData, UserProfile } from "@/lib/types";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialAuthState?: {
    isAuthenticated: boolean;
    user: UserProfile | null;
  };
}

export function AuthProvider({
  children,
  initialAuthState,
}: AuthProviderProps) {
  const auth = useAuth(initialAuthState);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

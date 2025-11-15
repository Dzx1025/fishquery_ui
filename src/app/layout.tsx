import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import dynamic from "next/dynamic";

const AppSidebar = dynamic(() => import("@/components/sidebar/app-sidebar"), {
  ssr: true, // Server-side Render
});
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";

import {AuthProvider} from "@/contexts/auth-context";
import {getAuthStatus} from "@/lib/server-auth";
import {ApolloWrapper} from "@/apollo/provider";
import {Toaster} from "sonner";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FishQuery - AI Assistant",
  description: "Ask questions and get intelligent answers",
};

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  // Get authentication status server-side before rendering
  const {isAuthenticated, user} = await getAuthStatus();

  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Toaster/>
      {/* Pass the server-side authentication state to the client */}
      <AuthProvider initialAuthState={{isAuthenticated, user}}>
        <ApolloWrapper>
          {isAuthenticated ? (
            <SidebarProvider>
              <AppSidebar/>
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
          ) : (
            // For unauthenticated users
            <main className="min-h-screen">
              {children}
            </main>
          )}
        </ApolloWrapper>
      </AuthProvider>
    </ThemeProvider>
    </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/useAuth";
import { ApolloWrapper } from "@/components/apollo-provider";

export const metadata: Metadata = {
  title: {
    default: "FishQuery - WA Fishing Rules Assistant",
    template: "%s | FishQuery",
  },
  description:
    "AI-powered assistant for Western Australia recreational fishing regulations. Get instant answers about bag limits, size limits, and species identification.",
  keywords: [
    "WA fishing",
    "Western Australia fishing rules",
    "fishing regulations",
    "bag limits",
    "size limits",
    "DPIRD",
    "recreational fishing",
  ],
  authors: [{ name: "FishQuery" }],
  openGraph: {
    title: "FishQuery - WA Fishing Rules Assistant",
    description:
      "AI-powered assistant for Western Australia recreational fishing regulations.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700;800;900&family=Lora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ApolloWrapper>{children}</ApolloWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Merriweather, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/useAuth";
import { ApolloWrapper } from "@/components/apollo-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

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
      <body
        className={`${inter.variable} ${merriweather.variable} ${firaCode.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
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

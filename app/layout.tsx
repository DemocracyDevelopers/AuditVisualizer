import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Image from "next/image";
import ClientTourProvider from "./ClientTourProvider";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuditVisualizer",
  description: "Visualize audit data interactively",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Prevent hydration mismatch warnings caused by theme switching */}
      <body className={inter.className}>
        {/* ThemeProvider wraps the entire app to manage dark/light mode by toggling CSS classes on <html> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* ClientTourProvider manages the step-by-step onboarding tour */}
          <ClientTourProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              {/* ---------- App Header ---------- */}
              <header className="flex items-center border-b border-border py-2 px-4">
                <Image src="/Logo.png" alt="Logo" width={80} height={80} />
                <h1 className="ml-4 text-3xl font-bold">AuditVisualizer</h1>

                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </header>

              {/* ---------- Main Content Area ---------- */}
              <main className="flex flex-col flex-grow">{children}</main>
            </div>
          </ClientTourProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

/* app/layout.tsx */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Image from "next/image";
import ClientTourProvider from "./ClientTourProvider";

import { ThemeProvider } from "@/components/theme/theme-provider"; // 🌑 ① 引入
import { ThemeToggle } from "@/components/theme/theme-toggle"; // 🌑 ② 可选：切换按钮

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
      {" "}
      {/* 🌑 ③ 防止首屏水合警告 */}
      <body className={inter.className}>
        {/* 🌑 ④ ThemeProvider 最外层包裹，负责给 <html> 加/删 class="dark" */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientTourProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              {/* ---------- Header ---------- */}
              <header className="flex items-center border-b border-border py-2 px-4">
                <Image src="/Logo.png" alt="Logo" width={80} height={80} />
                <h1 className="ml-4 text-3xl font-bold">AuditVisualizer</h1>

                {/* 🌑 ⑤ 右侧放一个主题切换按钮（可删） */}
                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </header>

              {/* ---------- Main ---------- */}
              <main className="flex flex-col flex-grow">{children}</main>
            </div>
          </ClientTourProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

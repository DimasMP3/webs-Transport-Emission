"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";

/**
 * Client-side providers & persistent layout shell.
 * Shows top Navbar only on /dashboard/* routes.
 * Landing page (/) gets a clean, full-width layout.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/calculator") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/import");

  return (
    <ThemeProvider>
      {isDashboard ? (
        <div className="flex min-h-screen flex-col bg-[#F9FAFB] dark:bg-black">
          <Navbar />
          <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 transition-all">
            {children}
          </main>
        </div>
      ) : (
        <>{children}</>
      )}
    </ThemeProvider>
  );
}

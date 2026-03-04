"use client";

import React from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";

/**
 * Client-side providers & persistent layout shell.
 * Wraps every page with the theme context and sidebar navigation.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                {/* Main content area — offset by sidebar width */}
                <main className="flex-1 ml-16 lg:ml-56 transition-[margin] duration-200">
                    {children}
                </main>
            </div>
        </ThemeProvider>
    );
}

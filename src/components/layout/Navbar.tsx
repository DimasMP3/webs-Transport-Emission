"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Leaf, LayoutDashboard, Calculator, Upload, FileBarChart, Sun, Moon } from "lucide-react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Calculator", href: "/calculator", icon: Calculator },
    { label: "Import Data", href: "/import", icon: Upload },
    { label: "Reports", href: "/reports", icon: FileBarChart },
];

export default function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                        <Leaf className="h-5 w-5" />
                    </div>
                    <span className="hidden sm:block text-lg font-bold tracking-tight text-foreground">
                        Metropolia MRV
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <Link
                        href="/"
                        className="group relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                        <span className="relative z-10 hidden md:block">
                            Home
                        </span>
                    </Link>
                    {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "group relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "text-emerald-700 dark:text-emerald-400"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                {isActive && (
                                    <span className="absolute inset-0 z-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30" />
                                )}
                                <Icon className={cn("relative z-10 h-4 w-4 shrink-0 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
                                <span className={cn("relative z-10 hidden md:block", isActive ? "font-semibold" : "")}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        aria-label="Toggle Theme"
                    >
                        {theme === "light" ? (
                            <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
                        ) : (
                            <Sun className="h-4 w-4 transition-transform hover:rotate-12" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
    Leaf,
    LayoutDashboard,
    Calculator,
    Upload,
    FileBarChart,
    Sun,
    Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// ========================
// Navigation items
// ========================
const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Calculator", href: "/calculator", icon: Calculator },
    { label: "Import Data", href: "/import", icon: Upload },
    { label: "Reports", href: "/reports", icon: FileBarChart },
];

// ========================
// Sidebar Component
// ========================
export default function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <TooltipProvider delayDuration={0}>
            <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col items-center border-r bg-card py-4 transition-colors lg:w-56">
                {/* Logo */}
                <div className="flex h-10 w-full items-center gap-2 px-4 mb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <Leaf className="h-5 w-5" />
                    </div>
                    <span className="hidden lg:block text-sm font-bold tracking-tight text-foreground">
                        Metropolia MRV
                    </span>
                </div>

                <Separator className="mb-4 w-10 lg:w-[calc(100%-2rem)]" />

                {/* Nav Links */}
                <nav className="flex flex-1 flex-col gap-1 w-full px-2">
                    {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Tooltip key={href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                        )}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span className="hidden lg:block">{label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="lg:hidden">
                                    {label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="flex flex-col items-center gap-2 px-2 w-full">
                    <Separator className="mb-2 w-10 lg:w-[calc(100%-0rem)]" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleTheme}
                                className="w-full justify-start gap-3 px-3"
                            >
                                {theme === "light" ? (
                                    <Moon className="h-4 w-4 shrink-0" />
                                ) : (
                                    <Sun className="h-4 w-4 shrink-0" />
                                )}
                                <span className="hidden lg:block text-sm">
                                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                                </span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="lg:hidden">
                            Toggle Theme
                        </TooltipContent>
                    </Tooltip>
                </div>
            </aside>
        </TooltipProvider>
    );
}

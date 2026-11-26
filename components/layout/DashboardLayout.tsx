"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import useAuth from "@/features/hooks/useAuth";
import { SidebarItem } from "@/lib/constants/student_sidebar";
import { cn, getImageUrl } from "@/lib/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarItems: SidebarItem[];
    role?: string;
}


export default function DashboardLayout({
    children,
    sidebarItems,
    role = "Student",
}: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    const initials = user?.fullName
        ? user.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?";

    return (
        <div className="flex h-screen bg-background overflow-hidden">


            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            <aside
                className={cn(
                    "fixed md:static inset-y-0 left-0 z-30",
                    "flex flex-col w-64 bg-card border-r border-border",
                    "transition-transform duration-200 ease-in-out",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >

                <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-bold">G</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">GramaMaster</span>
                    <button
                        className="ml-auto md:hidden text-muted-foreground"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-border">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 w-full transition-colors"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Logout
                    </button>
                </div>
            </aside>


            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                <header className="flex items-center justify-between px-4 h-16 border-b border-border bg-card shrink-0">

                    <button
                        className="md:hidden text-muted-foreground hover:text-foreground"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>


                    <div className="ml-auto flex items-center gap-2">


                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        <div className="flex items-center gap-2.5">
                            {user?.profileImageUrl ? (
                                <img
                                    src={getImageUrl(user.profileImageUrl)}
                                    alt={user.fullName}
                                    className="w-8 h-8 rounded-full object-cover border border-border"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground text-xs font-bold">
                                        {initials}
                                    </span>
                                </div>
                            )}
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium leading-none">{user?.fullName ?? "User"}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>

            </div>
        </div>
    );
}
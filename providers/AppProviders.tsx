"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthProviders";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppProviders({ children }: { children: ReactNode }) {
    const scriptProps =
        typeof window === "undefined"
            ? undefined
            : ({ type: "application/json" } as const);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            scriptProps={scriptProps}
        >
            <AuthProvider>
                <TooltipProvider delay={200}>{children}</TooltipProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

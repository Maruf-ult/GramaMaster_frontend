import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthProviders";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>

            <AuthProvider>
                <TooltipProvider delay={200}>
                    {children}
                </TooltipProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
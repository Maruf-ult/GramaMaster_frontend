import React from "react";
import Link from "next/link";
import { BookOpenCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-muted/20">

            <header className="p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
                    <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                        <BookOpenCheck className="w-5 h-5" />
                    </div>
                    <span>GramaMaster</span>
                </Link>
            </header>


            <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
                {children}
            </main>


            <footer className="p-6 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} GramaMaster. All rights reserved.
            </footer>
        </div>
    );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error("[Teacher Error]", error); }, [error]);
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            {error.message || "Could not load this page."}
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Retry
          </Button>
          <Button size="sm" onClick={() => router.push("/teacher/dashboard")}>
            <LayoutDashboard className="w-4 h-4 mr-1.5" />
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
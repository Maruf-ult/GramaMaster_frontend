"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
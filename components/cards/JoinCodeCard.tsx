import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function JoinCodeCard({ code, teamName }: { code: string, teamName: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Join code copied!");
        setTimeout(() => setCopied(false), 2000);
    }; return (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between gap-3">
            <div>
                <p className="text-xs text-muted-foreground">Join code for</p>
                <p className="text-sm font-semibold">{teamName}</p>
                <p className="font-mono text-lg font-bold tracking-widest text-primary mt-1">
                    {code}
                </p>
            </div>
            <button
                onClick={handleCopy}
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary shrink-0"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );
}
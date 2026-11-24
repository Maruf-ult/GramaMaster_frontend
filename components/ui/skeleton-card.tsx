import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 max-w-5xl">

            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-32 rounded-lg" />
            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                ))}
            </div>


            <div className="grid md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                        <Skeleton className="h-4 w-32" />
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="space-y-1.5">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-28" />
                                    <Skeleton className="h-3 w-10" />
                                </div>
                                <Skeleton className="h-1.5 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="space-y-5 max-w-5xl">
            <div className="space-y-2">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-56" />
            </div>

            <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-24 rounded-full" />
                ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-1.5 w-full rounded-full" />
                        <div className="flex gap-1.5">
                            <Skeleton className="h-7 flex-1 rounded-lg" />
                            <Skeleton className="h-7 flex-1 rounded-lg" />
                            <Skeleton className="h-7 flex-1 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
    return (
        <div className="space-y-5 max-w-6xl">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-9 w-28 rounded-lg" />
            </div>

            <div className="flex gap-2">
                <Skeleton className="h-9 w-64 rounded-md" />
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-20 rounded-lg" />
                ))}
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-4 py-3 flex gap-4">
                    {[40, 56, 20, 20, 24, 16].map((w, i) => (
                        <Skeleton key={i} className={`h-3 w-${w}`} />
                    ))}
                </div>
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="border-b border-border last:border-0 px-4 py-3.5 flex gap-4 items-center">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex gap-1.5 ml-auto">
                            <Skeleton className="h-7 w-7 rounded-lg" />
                            <Skeleton className="h-7 w-7 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ChatSkeleton() {
    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="pb-3 border-b border-border flex items-center gap-2.5">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
            <div className="space-y-5 py-4">
                {[true, false, true, false].map((isBot, i) => (
                    <div key={i} className={`flex items-end gap-2.5 ${isBot ? "" : "flex-row-reverse"}`}>
                        <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                        <Skeleton className={`h-16 ${isBot ? "w-72" : "w-56"} rounded-2xl`} />
                    </div>
                ))}
            </div>
            <div className="border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
                <Skeleton className="flex-1 h-5" />
                <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
        </div>
    );
}
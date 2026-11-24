export function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary">{value}</div>
            <div className="text-sm text-muted-foreground mt-1">{label}</div>
        </div>
    );
}
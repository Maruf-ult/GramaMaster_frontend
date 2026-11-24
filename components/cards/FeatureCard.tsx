
export function FeatureCard({
    icon: Icon,
    color,
    title,
    description,
}: {
    icon: React.ElementType;
    color: string;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 hover:border-primary/40 hover:shadow-sm transition-all">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
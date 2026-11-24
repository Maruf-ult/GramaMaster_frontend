export function Step({
    num,
    title,
    description,
}: {
    num: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {num}
            </div>
            <div>
                <h4 className="font-semibold text-sm">{title}</h4>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
export function ScoreRing({ percentage }: { percentage: number }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const filled = (percentage / 100) * circumference;
    const color =
        percentage >= 80 ? "#22c55e"
            : percentage >= 50 ? "#f97316"
                : "#ef4444";
    return (
        <svg width="100" height="100" className="-rotate-90">
            {/* Track */}
            <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
            />
            {/* Fill */}
            <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeDasharray={`${filled} ${circumference}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
        </svg>
    );
}
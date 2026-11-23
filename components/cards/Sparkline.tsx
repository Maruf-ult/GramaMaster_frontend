import { PerformanceTrendRequest } from "@/types/analytics";

// ── Sparkline (performance trend) ─────────────────────────────────────────────
export function Sparkline({ data }: { data: PerformanceTrendRequest[] }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
        Not enough data yet.
      </div>
    );
  }
  const values = data.map((d) => d.score);
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 400;
  const H = 80;
  const pad = 8;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  // area fill
  const area = `${pad},${H - pad} ${polyline} ${W - pad},${H - pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area */}
      <polygon points={area} fill="url(#sparkGrad)" />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots */}
      {pts.map((pt, i) => {
        const [x, y] = pt.split(",").map(Number);
        return (
          <circle
            key={i}
            cx={x} cy={y} r="3"
            fill="hsl(var(--primary))"
          />
        );
      })}
    </svg>
  );
}

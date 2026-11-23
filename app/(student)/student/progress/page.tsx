import { AIExplanationDrawer } from "@/components/ai/AIExplanationDrawer";
import { AccuracyBar } from "@/components/cards/AccuracyBar";
import { Sparkline } from "@/components/cards/Sparkline";
import { WeakTopicRow } from "@/components/cards/weakTopicRow";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { TopicRecommendationDto } from "@/types/ai";
import { PerformanceTrendRequest, TopicStatisticsRequest } from "@/types/analytics";
import { ApiResponse } from "@/types/common";
import { AlertTriangle, BookOpen, Lightbulb, Loader2, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProgressPage() {
  const [recommendation, setRecommendation] = useState<TopicRecommendationDto | null>(null);
  const [trend, setTrend] = useState<PerformanceTrendRequest[]>([]);
  const [topicStats, setTopicStats] = useState<TopicStatisticsRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [explanationId, setExplanationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [recRes, tredRes, statsRes] = await Promise.all([
          apiClient<ApiResponse<TopicRecommendationDto>>(apiEndpoints.ai.weakTopics),
          apiClient<ApiResponse<PerformanceTrendRequest[]>>(apiEndpoints.analytics.performanceTrend),
          apiClient<ApiResponse<TopicStatisticsRequest[]>>(apiEndpoints.analytics.topics),
        ]);

        if (recRes.success && recRes.data) {
          setRecommendation(recRes.data);
        }
        if (tredRes.success && tredRes.data) {
          setTrend(tredRes.data);
        } if (statsRes.success && statsRes.data) {
          setTopicStats(statsRes.data);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load progress data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <>
      <div className="space-y-6 max-w-5xl">

        <div>
          <h1 className="text-xl font-bold">Progress & Analysis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            See where you stand and what to focus on next.
          </p>
        </div>

        {recommendation && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Lightbulb className="w-4 h-4" />
              {recommendation.title}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {recommendation.recommendation}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Performance Trend</h2>
            </div>
            <Sparkline data={trend} />

            {trend.length > 1 && (
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>
                  {new Date(trend[0].date).toLocaleDateString("en-BD", {
                    day: "2-digit", month: "short",
                  })}
                </span>
                <span>
                  {new Date(trend[trend.length - 1].date).toLocaleDateString("en-BD", {
                    day: "2-digit", month: "short",
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Topic Overview</h2>
            </div>
            <div className="space-y-2.5">
              {topicStats.length === 0 && (
                <p className="text-xs text-muted-foreground">No topic data yet.</p>
              )}
              {topicStats.slice(0, 5).map((t) => (
                <AccuracyBar key={t.topicId} topic={t} />
              ))}
            </div>
          </div>
        </div>
        {topicStats.length > 5 && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">All Topics</h2>
            </div>
            <div className="space-y-3">
              {topicStats.map((t) => (
                <AccuracyBar key={t.topicId} topic={t} />
              ))}
            </div>
          </div>
        )}

        {recommendation?.weakTopics && recommendation.weakTopics.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-semibold text-red-500">Focus Areas</h2>
              <span className="ml-auto text-xs text-muted-foreground">
                Click &quot;AI Help&quot; for a detailed explanation
              </span>
            </div>
            <div className="divide-y divide-border">
              {recommendation.weakTopics.map((t) => (
                <WeakTopicRow
                  key={t.topicId}
                  topic={t}
                  onExplain={(id) => setExplanationId(id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AIExplanationDrawer
        answerSubmissionId={explanationId}
        onClose={() => setExplanationId(null)}
      />
    </>
  );
}
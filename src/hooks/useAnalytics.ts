"use client";

import { useState, useEffect, useCallback } from "react";

interface NumericMetrics {
  total_papers: number; //
  summarised_papers: number;
  coverage_pct: number;
  collections: number;
  notes: number;
  time_saved_hours: number;
  streak_days: number;
  research_activity: {
    uploads: number[];
    summaries: number[];
    notes: number[];
  };
  most_active: {
    collection: Array<{_id: string, count: number}>;
    tag: Array<{_id: string, count: number}>;
    year: Array<{_id: number, count: number}>;
    month: Array<{_id: number, count: number}>;
    day: Array<{_id: number, count: number}>;
  };
  papers_by_month: Array<{name: string, value: number}>;
}

interface AIInsights {
  trend_gaps: string[];
  recommendations: { title: string; reason: string }[];
  assistant_cards: { title: string; body: string }[];
}

export interface UseAnalyticsProps {
  userEmail: string;
}

/* ─────────────── Hook ─────────────────────────────────── */
export function useAnalytics({ userEmail }: UseAnalyticsProps) {
  /* ─ state + fetchAll unchanged ─────────────────────────────── */
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [metrics, setMetrics]   = useState<NumericMetrics | null>(null);
  const [insights, setInsights] = useState<AIInsights  | null>(null);

  
  const fetchAll = useCallback(async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const [mRes, iRes] = await Promise.all([
        fetch(`http://localhost:8000/analytics/metrics/${userEmail}`),
        fetch(`http://localhost:8000/analytics/insights/${userEmail}`)
      ]);
      if (!mRes.ok || !iRes.ok) throw new Error("API error");
      setMetrics(await mRes.json());
      setInsights(await iRes.json());

      setError(null);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ----- formatters (pure) ----- */
  const formatCards = useCallback(() => {
    if (!metrics) return [];
    const pct = (n: number) => `${n.toFixed(0)}%`;
    return [
      {
        title: "Research Coverage",
        value: pct(metrics.coverage_pct),
        change: "+0%",
        trend : "neutral",
        icon  : "CheckCircle2",
        description: "Papers with complete summaries",
      },
      {
        title: "Knowledge Depth",
        value: metrics.notes,
        change: "+0",
        trend : "neutral",
        icon  : "Layers",
        description: "Total notes across papers",
      },
      {
        title: "Research Efficiency",
        value: pct((metrics.summarised_papers || 0 / metrics.total_papers || 0) * 100),
        change: "+0%",
        trend : "neutral",
        icon  : "Zap",
        description: "Summaries vs uploads",
      },
      {
        title: "Topic Diversity",
        value: insights ? insights.trend_gaps.length : 0,
        change: "+0",
        trend : "neutral",
        icon  : "Tag",
        description: "Emerging / under-represented topics",
      },
    ];
  }, [metrics, insights]);

  const formatTopicDistribution = useCallback(() => {
    if (!insights) return [];
    const size = insights.trend_gaps.length || 1;
    return insights.trend_gaps.map(n => ({ name: n, value: 1 / size }));
  }, [insights]);

  const formatResearchActivity = useCallback(() => {
    if (!metrics) return [];
    return metrics.research_activity.uploads.map((_, i) => ({
      day: `D${i + 1}`,
      papers:     metrics.research_activity.uploads[i],
      summaries:  metrics.research_activity.summaries[i],
      notes:      metrics.research_activity.notes[i],
    }));
  }, [metrics]);

  const formatPaperInsights = useCallback(() => {
     // '{ collection: { _id: string; count: number; }[]; tag: { _id: string; count: number; }[]; year: { _id: number; count: number; }[]; month: { _id: number; count: number; }[]; day: { _id: number; count: number; }[] }'
    if (!metrics) return [];
    const { most_active } = metrics;
    const { collection, tag, year, month, day } = most_active;
    const collectionInsights = collection.map((item) => ({
      title: item._id,
      value: item.count,
      type: "collection",
    }));
    const tagInsights = tag.map((item) => ({
      title: item._id,
      value: item.count,
      type: "tag",
    }));
    const yearInsights = year.map((item) => ({
      title: item._id.toString(),
      value: item.count,
      type: "year",
    }));
    const monthInsights = month.map((item) => ({
      title: item._id.toString(),
      value: item.count,
      type: "month",
    }));
    const dayInsights = day.map((item) => ({  
      title: item._id.toString(),
      value: item.count,
      type: "day",
    }));
    return [...collectionInsights, ...tagInsights, ...yearInsights, ...monthInsights, ...dayInsights];
  }, [metrics]);

  

  /* ----- memoised getters returned to the page ----- */
  const getResearchMetrics        = useCallback(() => formatCards(),            [formatCards]);
  const getTopicDistribution      = useCallback(() => formatTopicDistribution(),[formatTopicDistribution]);
  const getResearchActivity       = useCallback(() => formatResearchActivity(), [formatResearchActivity]);
  const getPapersByMonth          = useCallback(() => metrics?.papers_by_month ?? [], [metrics]); // placeholder
  const getPaperInsights           = useCallback(() => formatPaperInsights(), [formatPaperInsights]);
  const getResearchRecommendations= useCallback(() => insights?.recommendations ?? [], [insights]);
  const getAIInsights             = useCallback(() => insights?.assistant_cards ?? [], [insights]);
  const getTrendingTopics         = useCallback(() => insights?.trend_gaps ?? [],      [insights]);
  const getResearchTags           = useCallback(() => insights?.trend_gaps ?? [],      [insights]);


  return {
    loading,
    error,
    hasData: !!metrics && !!insights,
    getResearchMetrics, // Research Insights cards
    getTopicDistribution, // Topic Distribution pie chart
    getResearchActivity, // Research Activity line chart
    getPapersByMonth, // Papers Over Time Barchart * issue
    getPaperInsights,
    getResearchRecommendations, //Research Recommendations
    getAIInsights,
    getTrendingTopics,
    getResearchTags,
    refreshAnalytics: fetchAll,
  };
}

export default useAnalytics;

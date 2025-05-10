"use client"

import { useState, useCallback } from "react"

// Types for our analytics data
export interface ResearchMetric {
  title: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
  icon: string
  description: string
}

export interface TopicDistribution {
  name: string
  value: number
}

export interface ResearchActivity {
  day: string
  papers: number
  notes: number
  summaries: number
}

export interface PapersByMonth {
  month: string
  papers: number
}

export interface ResearchRecommendation {
  title: string
  authors: string
  relevance: string
  reason: string
}

export interface AIInsight {
  type: "knowledge_gap" | "citation_pattern" | "reading_suggestion"
  title: string
  content: string
  icon: string
}

export interface UseAnalyticsProps {
  userEmail: string
  timeframe?: "7d" | "30d" | "90d"
}

export function useAnalytics({ userEmail, timeframe = "30d" }: UseAnalyticsProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [hasData, setHasData] = useState<boolean>(true)

  // Function to get research metrics
  const getResearchMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Check if user has data
      const isNewUser = Math.random() > 0.8 // 20% chance of being a new user for demo
      setHasData(!isNewUser)

      if (isNewUser) {
        return []
      }

      return [
        {
          title: "Research Coverage",
          value: "68%",
          change: "+12%",
          trend: "up",
          icon: "CheckCircle2",
          description: "Papers with complete summaries",
        },
        {
          title: "Knowledge Depth",
          value: "24",
          change: "+5",
          trend: "up",
          icon: "Layers",
          description: "Papers with detailed notes",
        },
        {
          title: "Research Efficiency",
          value: "85%",
          change: "+7%",
          trend: "up",
          icon: "Zap",
          description: "AI-assisted summaries",
        },
        {
          title: "Topic Diversity",
          value: "7",
          change: "+2",
          trend: "up",
          icon: "Tag",
          description: "Unique research areas",
        },
      ]
    } catch (err) {
      setError("Failed to fetch research metrics")
      console.error("Error fetching metrics:", err)
      return []
    } finally {
      setLoading(false)
    }
  }, [userEmail, timeframe])

  // Function to get topic distribution
  const getTopicDistribution = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (!hasData) return []

      return [
        { name: "Machine Learning", value: 35 },
        { name: "Neural Networks", value: 25 },
        { name: "Computer Vision", value: 20 },
        { name: "NLP", value: 15 },
        { name: "Reinforcement Learning", value: 5 },
      ]
    } catch (err) {
      console.error("Error fetching topic distribution:", err)
      return []
    }
  }, [hasData, timeframe])

  // Function to get research activity
  const getResearchActivity = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (!hasData) return []

      return [
        { day: "Mon", papers: 2, notes: 5, summaries: 3 },
        { day: "Tue", papers: 1, notes: 3, summaries: 2 },
        { day: "Wed", papers: 3, notes: 7, summaries: 4 },
        { day: "Thu", papers: 0, notes: 2, summaries: 1 },
        { day: "Fri", papers: 2, notes: 6, summaries: 3 },
        { day: "Sat", papers: 1, notes: 4, summaries: 2 },
        { day: "Sun", papers: 0, notes: 1, summaries: 0 },
      ]
    } catch (err) {
      console.error("Error fetching research activity:", err)
      return []
    }
  }, [hasData, timeframe])

  // Function to get papers by month
  const getPapersByMonth = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (!hasData) return []

      return [
        { month: "Jan", papers: 3 },
        { month: "Feb", papers: 5 },
        { month: "Mar", papers: 7 },
        { month: "Apr", papers: 4 },
        { month: "May", papers: 6 },
        { month: "Jun", papers: 8 },
      ]
    } catch (err) {
      console.error("Error fetching papers by month:", err)
      return []
    }
  }, [hasData, timeframe])

  // Function to get research recommendations
  const getResearchRecommendations = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (!hasData) return []

      return [
        {
          title: "Exploring Multimodal Learning for Vision-Language Tasks",
          authors: "Zhang et al.",
          relevance: "98%",
          reason: "Aligns with your interest in computer vision and NLP",
        },
        {
          title: "Recent Advances in Reinforcement Learning: A Survey",
          authors: "Johnson et al.",
          relevance: "92%",
          reason: "Fills a gap in your current research portfolio",
        },
        {
          title: "Transformer Architectures for Medical Image Analysis",
          authors: "Patel et al.",
          relevance: "87%",
          reason: "Extends your work on transformers to a new domain",
        },
      ]
    } catch (err) {
      console.error("Error fetching research recommendations:", err)
      return []
    }
  }, [hasData])

  // Function to get AI insights
  const getAIInsights = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (!hasData) return []

      return [
        {
          type: "knowledge_gap",
          title: "Knowledge Gaps",
          content:
            "Based on your current papers, you might want to explore more about reinforcement learning and federated learning to round out your knowledge in machine learning.",
          icon: "Sparkles",
        },
        {
          type: "citation_pattern",
          title: "Citation Patterns",
          content:
            "Your most cited papers focus on neural networks. Consider creating a dedicated collection for these high-impact papers to better organize your references.",
          icon: "TrendingUp",
        },
        {
          type: "reading_suggestion",
          title: "Reading Suggestion",
          content:
            'You haven\'t reviewed any papers in the "Transformer Architecture" collection in 2 weeks. Consider scheduling time to revisit these papers to maintain continuity in your research.',
          icon: "BookOpen",
        },
      ]
    } catch (err) {
      console.error("Error fetching AI insights:", err)
      return []
    }
  }, [hasData])

  // Function to get trending topics
  const getTrendingTopics = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (!hasData) return []

      return [
        { name: "Large Language Models", growth: "+42%", papers: 124 },
        { name: "Multimodal Learning", growth: "+38%", papers: 87 },
        { name: "Reinforcement Learning", growth: "+28%", papers: 65 },
        { name: "Generative AI", growth: "+25%", papers: 112 },
        { name: "Federated Learning", growth: "+18%", papers: 43 },
      ]
    } catch (err) {
      console.error("Error fetching trending topics:", err)
      return []
    }
  }, [hasData])

  // Function to get research tags
  const getResearchTags = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (!hasData) return []

      return [
        { name: "Machine Learning", count: 15},
        { name: "Neural Networks", count: 12},
        { name: "Deep Learning", count: 10},
        { name: "Computer Vision", count: 8},
        { name: "NLP", count: 7},
        { name: "Transformers", count: 6},
        { name: "GANs", count: 5},
        { name: "Reinforcement Learning", count: 4},
        { name: "Transfer Learning", count: 3},
        { name: "Attention Mechanisms", count: 3},
        { name: "Embeddings", count: 2},
        { name: "Multimodal", count: 2},
      ]
    } catch (err) {
      console.error("Error fetching research tags:", err)
      return []
    }
  }, [hasData])

  // Refresh analytics with a different timeframe
  const refreshAnalytics = useCallback((newTimeframe: "7d" | "30d" | "90d") => {
    // In a real implementation, this would update the timeframe and refetch
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return {
    loading,
    error,
    hasData,
    getResearchMetrics,
    getTopicDistribution,
    getResearchActivity,
    getPapersByMonth,
    getResearchRecommendations,
    getAIInsights,
    getTrendingTopics,
    getResearchTags,
    refreshAnalytics,
  }
}

"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/layout"
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  Brain,
  Lightbulb,
  BookOpen,
  Sparkles,
  Tag,
  Zap,
  CheckCircle2,
  Layers,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/hooks/useAnalytics"
import { EmptyState } from "@/components/empty-state"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"

// Color palette for charts
const COLORS = ["#000000", "#444444", "#777777", "#AAAAAA", "#DDDDDD"]
const DARK_COLORS = ["#FFFFFF", "#CCCCCC", "#999999", "#666666", "#333333"]

interface TooltipProps {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  theme?: string
}

// Custom tooltip component for better visibility in both light and dark modes
const CustomTooltip = ({ active, payload, label, theme }: TooltipProps & { theme: string | undefined }) => {
  if (!active || !payload || !payload.length) return null

  const isDark = theme === "dark"

  return (
    <div
      className={cn(
        "rounded-lg p-3 shadow-lg border",
        isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-zinc-200 text-zinc-900",
      )}
    >
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}: </span>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Custom pie chart label renderer to prevent text overflow
const renderCustomizedPieLabel = ({ cx, cy, midAngle, outerRadius, percent, name, theme }: {
  cx: number
  cy: number
  midAngle: number
  outerRadius: number
  percent: number
  name: string
  theme?: string | undefined
}) => {
  const RADIAN = Math.PI / 180
  const radius = outerRadius * 1.2
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const isDark = theme === "dark"

  // Truncate long names
  const displayName = name.length > 15 ? name.substring(0, 12) + "..." : name

  return (
    <text
      x={x}
      y={y}
      fill={isDark ? "#CCCCCC" : "#333333"}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${displayName} ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Map icon strings to Lucide icons
const iconMap: Record<string, React.ReactNode> = {
  CheckCircle2: <CheckCircle2 className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Tag: <Tag className="h-4 w-4" />,
  Sparkles: <Sparkles className="h-4 w-4 mr-2" />,
  TrendingUp: <TrendingUp className="h-4 w-4 mr-2" />,
  BookOpen: <BookOpen className="h-4 w-4 mr-2" />,
}

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "90d">("30d")
  const [metrics, setMetrics] = useState<any[]>([])
  const [topicDistribution, setTopicDistribution] = useState<any[]>([])
  const [researchActivity, setResearchActivity] = useState<any[]>([])
  const [papersByMonth, setPapersByMonth] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [aiInsights, setAIInsights] = useState<any[]>([])
  const [trendingTopics, setTrendingTopics] = useState<any[]>([])
  const [researchTags, setResearchTags] = useState<any[]>([])
  const { theme } = useTheme()
  const { data: session } = useSession();


  const {
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
  } = useAnalytics({
    userEmail: session?.user?.email || "",
    timeframe: selectedTimeframe,
  })

  // Load all data on initial render
  useEffect(() => {
    const loadData = async () => {
      const metricsData = await getResearchMetrics()
      setMetrics(metricsData)

      const topicData = await getTopicDistribution()
      setTopicDistribution(topicData)

      const activityData = await getResearchActivity()
      setResearchActivity(activityData)

      const papersData = await getPapersByMonth()
      setPapersByMonth(papersData)

      const recommendationsData = await getResearchRecommendations()
      setRecommendations(recommendationsData)

      const insightsData = await getAIInsights()
      setAIInsights(insightsData)

      const trendingData = await getTrendingTopics()
      setTrendingTopics(trendingData)

      const tagsData = await getResearchTags()
      setResearchTags(tagsData)
    }

    loadData()
  }, [
    getResearchMetrics,
    getTopicDistribution,
    getResearchActivity,
    getPapersByMonth,
    getResearchRecommendations,
    getAIInsights,
    getTrendingTopics,
    getResearchTags,
  ])

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: "7d" | "30d" | "90d") => {
    setSelectedTimeframe(timeframe)
    refreshAnalytics(timeframe)
  }

    // Get chart colors based on theme
    const getChartColors = useCallback(() => {
      return theme === "dark" ? DARK_COLORS : COLORS
    }, [theme])
  
    // Get grid and axis colors based on theme
    const getGridColor = useCallback(() => {
      return theme === "dark" ? "#444444" : "#DDDDDD"
    }, [theme])
  
    const getAxisColor = useCallback(() => {
      return theme === "dark" ? "#AAAAAA" : "#666666"
    }, [theme])
  
    // Get bar fill color based on theme
    const getBarFill = useCallback(() => {
      return theme === "dark" ? "#FFFFFF" : "#000000"
    }, [theme])


  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Research Insights</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your research journey.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Mar 1 - Mar 15</span>
            </Button>
            <Link href='/dashboard/papers'>
            <Button variant="default" size="sm" className="h-9">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              <span>Upload</span>
            </Button>
            </Link>
          </div>
        </div>

        {loading && !metrics.length ? (
          // Loading state
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 w-24 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                  <div className="h-4 w-32 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          // Error state
          <Card className="border-destructive/50 bg-destructive/10">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button onClick={() => getResearchMetrics()} className="mt-4" variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : !hasData ? (
          // Empty state for new users
          <EmptyState
            title="No research data yet"
            description="Start by uploading papers or creating collections to see insights about your research."
            icon={<FileText className="h-10 w-10 text-muted-foreground" />}
            actions={
              <>
                <Button>Upload Papers</Button>
                <Button variant="outline">Create Collection</Button>
              </>
            }
          />
        ) : (
          // Data loaded successfully
          <>
            {/* User-Centric Research Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <InsightCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  trend={metric.trend}
                  icon={iconMap[metric.icon] || <FileText className="h-4 w-4" />}
                  description={metric.description}
                />
              ))}
            </div>

            {/* AI Insight Card */}
            <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">AI Research Insight</CardTitle>
                  <CardDescription>Based on your recent papers</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Your research is heavily focused on <strong>machine learning techniques</strong>. Consider exploring{" "}
                  <strong>reinforcement learning</strong> which appears in only 5% of your papers but is trending in 28%
                  of recent publications in your field.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    Trending: Reinforcement Learning
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    Gap: Multimodal Models
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    Opportunity: LLM Applications
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                <Sparkles className="mr-1 h-3 w-3" /> Updated today based on 1,245 recent publications
              </CardFooter>
            </Card>

            {/* Research Recommendations - Moved outside of tabs as requested */}
            <Card>
              <CardHeader>
                <CardTitle>Research Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions based on your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((paper, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium flex-1">{paper.title}</p>
                          <Badge variant="outline" className="bg-primary/5 text-center min-w-[60px]">
                            {paper.relevance}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{paper.authors}</p>
                        <p className="text-xs text-muted-foreground mt-1">{paper.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Tabs */}
            <Tabs defaultValue="insights" className="mt-2">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="papers">Papers</TabsTrigger>
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Button
                    variant={selectedTimeframe === "7d" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => handleTimeframeChange("7d")}
                  >
                    7d
                  </Button>
                  <Button
                    variant={selectedTimeframe === "30d" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => handleTimeframeChange("30d")}
                  >
                    30d
                  </Button>
                  <Button
                    variant={selectedTimeframe === "90d" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => handleTimeframeChange("90d")}
                  >
                    90d
                  </Button>
                </div>
              </div>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Research Activity</CardTitle>
                      <CardDescription>Your daily research engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={researchActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                            <XAxis
                              dataKey="day"
                              stroke={getAxisColor()}
                              tick={{ fill: getAxisColor() }}
                              tickLine={{ stroke: getAxisColor() }}
                            />
                            <YAxis
                              stroke={getAxisColor()}
                              tick={{ fill: getAxisColor() }}
                              tickLine={{ stroke: getAxisColor() }}
                            />
                            <Tooltip content={<CustomTooltip theme={theme} />} />
                            <Area
                              type="monotone"
                              dataKey="papers"
                              stackId="1"
                              stroke={theme === "dark" ? "#FFFFFF" : "#000000"}
                              fill={theme === "dark" ? "#FFFFFF" : "#000000"}
                              fillOpacity={0.8}
                              name="Papers"
                            />
                            <Area
                              type="monotone"
                              dataKey="notes"
                              stackId="1"
                              stroke={theme === "dark" ? "#AAAAAA" : "#555555"}
                              fill={theme === "dark" ? "#AAAAAA" : "#555555"}
                              fillOpacity={0.6}
                              name="Notes"
                            />
                            <Area
                              type="monotone"
                              dataKey="summaries"
                              stackId="1"
                              stroke={theme === "dark" ? "#666666" : "#999999"}
                              fill={theme === "dark" ? "#666666" : "#999999"}
                              fillOpacity={0.4}
                              name="Summaries"
                            />
                            <Legend
                              wrapperStyle={{
                                paddingTop: "10px",
                                color: getAxisColor(),
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Topic Distribution</CardTitle>
                      <CardDescription>Research areas in your papers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={topicDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={(props) => renderCustomizedPieLabel({ ...props, theme })}
                            >
                              {topicDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip theme={theme} />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="papers" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Papers Over Time</CardTitle>
                      <CardDescription>Your research paper collection growth</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={papersByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
                            <XAxis
                              dataKey="month"
                              stroke={getAxisColor()}
                              tick={{ fill: getAxisColor() }}
                              tickLine={{ stroke: getAxisColor() }}
                            />
                            <YAxis
                              stroke={getAxisColor()}
                              tick={{ fill: getAxisColor() }}
                              tickLine={{ stroke: getAxisColor() }}
                            />
                            <Tooltip content={<CustomTooltip theme={theme} />} />
                            <Bar
                              dataKey="papers"
                              fill={getBarFill()}
                              name="Papers"
                              // Add a stroke to make bars visible in dark mode
                              stroke={theme === "dark" ? "#FFFFFF" : "none"}
                              strokeWidth={theme === "dark" ? 1 : 0}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Paper Insights</CardTitle>
                      <CardDescription>Analysis of your research papers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Average Paper Age</p>
                          <p className="text-sm">8 months</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Most Active Collection</p>
                          <p className="text-sm">Machine Learning (12 papers)</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Most Annotated Paper</p>
                          <p className="text-sm">Neural Networks (8 notes)</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Papers Needing Review</p>
                          <p className="text-sm">3 papers</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Recently Added</p>
                          <p className="text-sm">2 this week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="topics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trending Research Topics</CardTitle>
                      <CardDescription>Popular topics in your field</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trendingTopics.map((topic, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <TrendingUp className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{topic.name}</p>
                                <p className="text-xs text-muted-foreground">{topic.papers} papers</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-primary/5">
                              {topic.growth}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Research Tags</CardTitle>
                      <CardDescription>Most used tags in your papers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {researchTags.map((tag, i) => (
                          <Badge
                            key={i}
                            className={cn(
                              "px-3 py-1 text-xs bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300",
                            )}
                          >
                            {tag.name} ({tag.count})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Improved AI Research Assistant */}
            <Card className="bg-gradient-to-br from-zinc-900 to-black border-none text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-white" />
                  <span>AI Research Assistant</span>
                </CardTitle>
                <CardDescription className="text-zinc-300">
                  Personalized insights based on your research patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="rounded-lg bg-zinc-800 p-4">
                      <h3 className="text-sm font-medium text-white mb-2 flex items-center">
                        {iconMap[insight.icon] || <Sparkles className="h-4 w-4 mr-2 text-zinc-300" />}
                        {insight.title}
                      </h3>
                      <p className="text-xs text-zinc-300">{insight.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

interface InsightCardProps {
  title: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
  description: string
}

function InsightCard({ title, value, change, trend, icon, description }: InsightCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", "bg-primary/10")}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-xs",
              trend === "up" ? "text-black dark:text-white" : "",
              trend === "down" ? "text-black dark:text-white" : "",
              trend === "neutral" ? "text-muted-foreground" : "",
            )}
          >
            {trend === "up" && <TrendingUp className="mr-1 inline-block h-3 w-3" />}
            {trend === "down" && <TrendingDown className="mr-1 inline-block h-3 w-3" />}
            {change}
          </span>
          <span className="text-xs text-muted-foreground">from last period</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

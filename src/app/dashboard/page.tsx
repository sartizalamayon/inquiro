import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/layout"
import { BarChart3, FileText, FolderOpen, TrendingUp, Users, Calendar, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your research activity.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Mar 1 - Mar 15</span>
            </Button>
            <Button variant="default" size="sm" className="h-9">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Papers" value="24" change="+2" trend="up" icon={<FileText className="h-4 w-4" />} />
          <StatsCard title="Collections" value="7" change="+1" trend="up" icon={<FolderOpen className="h-4 w-4" />} />
          <StatsCard title="Collaborators" value="5" change="0" trend="neutral" icon={<Users className="h-4 w-4" />} />
          <StatsCard
            title="Research Activity"
            value="+12%"
            change="5%"
            trend="up"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="papers">Papers</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Last 30 days</span>
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Research Activity</CardTitle>
                <CardDescription>Your research activity over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Analytics Chart Placeholder</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Papers</CardTitle>
                  <CardDescription>Your most viewed research papers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">Research Paper {i}</p>
                          <p className="text-xs text-muted-foreground">42 views</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-green-500">
                          <TrendingUp className="h-3 w-3" />
                          <span>12%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Collections</CardTitle>
                  <CardDescription>Your most active research collections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "AI Research", papers: 8 },
                      { name: "Machine Learning", papers: 5 },
                      { name: "Data Science", papers: 12 },
                    ].map((collection, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                          <FolderOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{collection.name}</p>
                          <p className="text-xs text-muted-foreground">{collection.papers} papers</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="papers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Papers Analytics</CardTitle>
                <CardDescription>Insights about your research papers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Papers Analytics Placeholder</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Collections Analytics</CardTitle>
                <CardDescription>Insights about your research collections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Collections Analytics Placeholder</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <div className="mt-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent research activities</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Research Paper 1 Summarized",
                    time: "2 hours ago",
                    icon: <FileText className="h-5 w-5 text-primary" />,
                  },
                  {
                    title: "Added to AI Collection",
                    time: "Yesterday",
                    icon: <FolderOpen className="h-5 w-5 text-primary" />,
                  },
                  {
                    title: "Shared Paper with Team",
                    time: "2 days ago",
                    icon: <Users className="h-5 w-5 text-primary" />,
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", "bg-primary/10")}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs">
          <span
            className={cn(
              "mr-1",
              trend === "up" ? "text-green-500" : "",
              trend === "down" ? "text-red-500" : "",
              trend === "neutral" ? "text-muted-foreground" : "",
            )}
          >
            {trend === "up" && <TrendingUp className="mr-1 inline-block h-3 w-3" />}
            {trend === "down" && <TrendingDown className="mr-1 inline-block h-3 w-3" />}
            {change}
          </span>
          <span className="text-muted-foreground">from last week</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Make sure to import this
import { TrendingDown } from "lucide-react"


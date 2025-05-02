"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, SlidersHorizontal, Tag, Users, X, History, Clock, Sparkles, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/layout"
import { useTopTags } from "@/hooks/useTopTags"
import { useTopAuthors } from "@/hooks/useTopAuthors"
import { cn } from "@/lib/utils"
import { SearchResultCard } from "@/components/search/search-result-card" 
import { YearRangeSlider } from "@/components/search/year-range-slider"
import { ScoreRangeSlider } from "@/components/search/score-range-slider"

// Updated search result interface
interface SearchResult {
  _id: string
  _score: number
  userUploadName: string
  title: string
  authors: string[]
  research_problem: string
  date_published: string
  tags: string[]
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [yearRange, setYearRange] = useState<[number, number]>([1990, new Date().getFullYear()])
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 1])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [tab, setTab] = useState("all")

  // Fetch top tags and authors
  const { tags: topTags, loading: tagsLoading } = useTopTags()
  const { authors: topAuthors, loading: authorsLoading } = useTopAuthors()

  // Apply filters to results

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault()
    const effectiveQuery = customQuery ?? query
    if (!effectiveQuery.trim()) return

    setLoading(true)
    try {
      const searchRequest = {
        query: effectiveQuery,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        authors: selectedAuthors.length > 0 ? selectedAuthors : undefined,
        year_range: yearRange,
        score_range: scoreRange
      }

      const response = await fetch("/api/papers/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchRequest),
      })

      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setResults(data.results)

      if (!searchHistory.includes(effectiveQuery)) {
        setSearchHistory((prev) => [effectiveQuery, ...prev].slice(0, 10))
      }
    } catch (error) {
      console.error("Error searching papers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaperClick = (paperId: string) => {
    router.push(`/dashboard/paper/${paperId}`)
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleAuthorToggle = (author: string) => {
    setSelectedAuthors((prev) => (prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]))
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSelectedAuthors([])
    setYearRange([1990, new Date().getFullYear()])
    setScoreRange([0, 1])
  }

  // Regular function to handle history item clicks
  const handleHistoryItemClick = (historyQuery: string) => {
    setQuery(historyQuery)
    setTab("all")
    handleSearch(undefined, historyQuery)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Natural Language Paper Search</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Search for research papers using natural language. Try queries like recent papers about transformer models
            in NLP or quantum computing papers from 2020 to 2023
          </p>
        </div>

        <Tabs value={tab} className="mb-8" onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="mb-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
              <CardHeader className="pb-3">
                <CardTitle>Search Parameters</CardTitle>
                <CardDescription>Enter your search query in natural language</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                      <Input
                        type="text"
                        placeholder="e.g., Recent papers on large language models in healthcare"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="min-w-[100px] bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
                    >
                      {loading ? "Searching..." : "Search"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 border-zinc-200 dark:border-zinc-800"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                          <div className="space-y-6">
                            <div>
                              <Label className="flex items-center gap-2 mb-2 text-zinc-900 dark:text-zinc-100">
                                <Tag className="h-4 w-4" />
                                Common Tags
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {tagsLoading ? (
                                  <div className="text-sm text-zinc-500 dark:text-zinc-400">Loading tags...</div>
                                ) : (
                                  topTags.map((tag) => (
                                    <Badge
                                      key={tag.name}
                                      variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                                      className={cn(
                                        "cursor-pointer",
                                        selectedTags.includes(tag.name)
                                          ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
                                          : "border-zinc-200 dark:border-zinc-800",
                                      )}
                                      onClick={() => handleTagToggle(tag.name)}
                                    >
                                      {tag.name} ({tag.count})
                                    </Badge>
                                  ))
                                )}
                              </div>
                            </div>

                            <div>
                              <Label className="flex items-center gap-2 mb-2 text-zinc-900 dark:text-zinc-100">
                                <Calendar className="h-4 w-4" />
                                Year Range
                              </Label>
                              <YearRangeSlider
                                minYear={1950}
                                maxYear={new Date().getFullYear()}
                                value={yearRange}
                                onChange={setYearRange}
                              />
                            </div>

                            <div>
                              <ScoreRangeSlider
                                value={scoreRange}
                                onChange={setScoreRange}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label className="flex items-center gap-2 mb-2 text-zinc-900 dark:text-zinc-100">
                                <Users className="h-4 w-4" />
                                Common Authors
                              </Label>
                              <ScrollArea className="h-[200px] border rounded-md p-2 border-zinc-200 dark:border-zinc-800">
                                <div className="space-y-2">
                                  {authorsLoading ? (
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Loading authors...</div>
                                  ) : (
                                    topAuthors.map((author) => (
                                      <div key={author.name} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`author-${author.name}`}
                                          checked={selectedAuthors.includes(author.name)}
                                          onCheckedChange={() => handleAuthorToggle(author.name)}
                                          className="border-zinc-300 dark:border-zinc-700"
                                        />
                                        <label
                                          htmlFor={`author-${author.name}`}
                                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
                                        >
                                          {author.name} ({author.count})
                                        </label>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </ScrollArea>
                            </div>

                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="flex items-center gap-2 border-zinc-200 dark:border-zinc-800"
                              >
                                <X className="h-3 w-3" />
                                Clear Filters
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </CardContent>
            </Card>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm"
                  >
                    <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800"></div>
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-2/3">
                          <div className="h-7 bg-zinc-100 dark:bg-zinc-900 rounded-md w-full mb-3 animate-pulse"></div>
                          <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-1/2 animate-pulse"></div>
                        </div>
                        <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-full animate-pulse"></div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-full animate-pulse"></div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-md w-2/3 animate-pulse"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-7 bg-zinc-100 dark:bg-zinc-900 rounded-md w-24 animate-pulse"></div>
                        <div className="h-7 bg-zinc-100 dark:bg-zinc-900 rounded-md w-24 animate-pulse"></div>
                        <div className="h-7 bg-zinc-100 dark:bg-zinc-900 rounded-md w-24 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Search Results ({results.length})
                  </h2>
                  {(selectedTags.length > 0 || selectedAuthors.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="flex items-center gap-2 border-zinc-200 dark:border-zinc-800"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>

                <AnimatePresence>
                  {results.map((paper, index) => (
                    <motion.div
                      key={paper._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <SearchResultCard paper={paper} onClick={handlePaperClick} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : query ? (
              <Card className="p-8 text-center border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-zinc-100 dark:bg-zinc-900 p-3">
                    <Search className="h-6 w-6 text-zinc-400 dark:text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No results found</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
                    We could not find any papers matching your search criteria. Try adjusting your filters or using
                    different keywords.
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-2 border-zinc-200 dark:border-zinc-800"
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-zinc-100 dark:bg-zinc-900 p-3">
                    <Sparkles className="h-6 w-6 text-zinc-400 dark:text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Discover Research Papers</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
                    Enter a natural language query to find relevant research papers. You can ask for specific topics,
                    time periods, or research fields.
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Try these example queries:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Latest papers on transformer models",
                        "Healthcare AI research from 2020-2023",
                        "Quantum computing breakthroughs",
                      ].map((example) => (
                        <Badge
                          key={example}
                          variant="outline"
                          className="cursor-pointer border-zinc-200 dark:border-zinc-800"
                          onClick={() => {
                            setQuery(example);
                            handleSearch(undefined, example);
                          }}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
              <CardHeader>
                <CardTitle>Search History</CardTitle>
                <CardDescription>Your recent search queries</CardDescription>
              </CardHeader>
              <CardContent>
                {searchHistory.length > 0 ? (
                  <div className="space-y-2">
                    {searchHistory.map((historyItem, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                        onClick={() => handleHistoryItemClick(historyItem)}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                          <span className="text-zinc-700 dark:text-zinc-300">{historyItem}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    <History className="h-12 w-12 mx-auto mb-2 text-zinc-300 dark:text-zinc-700" />
                    <p>No search history yet</p>
                    <p className="text-sm">Your recent searches will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

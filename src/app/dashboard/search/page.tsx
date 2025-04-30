"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Tag,
  BookOpen,
  Users,
  ArrowUpDown,
  X,
  ChevronDown,
  Sparkles,
  History,
  Clock,
  Filter,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/layout"

interface PaperResult {
  paper_id: string
  title: string
  authors: string[]
  summary_preview: string
  metadata: {
    field: string
    year: number
    tags: string[]
  }
  relevance_score?: number
}

// Sample research fields
const RESEARCH_FIELDS = [
  "Computer Science",
  "Machine Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Artificial Intelligence",
  "Robotics",
  "Quantum Computing",
  "Bioinformatics",
  "Neuroscience",
  "Physics",
  "Mathematics",
  "Chemistry",
  "Biology",
  "Medicine",
  "Economics",
  "Psychology",
  "Sociology",
]

// Sample tags
const COMMON_TAGS = [
  "Deep Learning",
  "Neural Networks",
  "Transformers",
  "GPT",
  "BERT",
  "Reinforcement Learning",
  "Computer Vision",
  "NLP",
  "Healthcare",
  "Climate Change",
  "Ethics",
  "Explainable AI",
  "Top"
]

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PaperResult[]>([])
  const [filteredResults, setFilteredResults] = useState<PaperResult[]>([])
  const [loading, setLoading] = useState(false)
  const [yearRange, setYearRange] = useState([2000, 2023])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOption, setSortOption] = useState("relevance")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")

  // Apply filters and sorting to results
  useEffect(() => {
    if (results.length === 0) {
      setFilteredResults([])
      return
    }

    let filtered = [...results]

    // Apply year filter
    filtered = filtered.filter((paper) => paper.metadata.year >= yearRange[0] && paper.metadata.year <= yearRange[1])

    // Apply field filter
    if (selectedFields.length > 0) {
      filtered = filtered.filter((paper) => selectedFields.includes(paper.metadata.field))
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((paper) => paper.metadata.tags.some((tag) => selectedTags.includes(tag)))
    }

    // Apply sorting
    if (sortOption === "year-desc") {
      filtered.sort((a, b) => b.metadata.year - a.metadata.year)
    } else if (sortOption === "year-asc") {
      filtered.sort((a, b) => a.metadata.year - b.metadata.year)
    } else if (sortOption === "relevance" && filtered[0]?.relevance_score !== undefined) {
      filtered.sort((a, b) => (a.relevance_score || 0) - (b.relevance_score || 0))
    }

    setFilteredResults(filtered)
  }, [results, yearRange, selectedFields, selectedTags, sortOption])

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/papers/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()
      setResults(data.results)

      // Add to search history if not already present
      if (!searchHistory.includes(query)) {
        setSearchHistory((prev) => [query, ...prev].slice(0, 10))
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

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setYearRange([2000, 2023])
    setSelectedFields([])
    setSelectedTags([])
    setSortOption("relevance")
  }

  const useHistoryQuery = useCallback(
    (historyQuery: string) => {
      setQuery(historyQuery)
      setTimeout(() => handleSearch(), 0)
    },
    [handleSearch],
  )

  const handleHistoryItemClick = (historyQuery: string) => {
    useHistoryQuery(historyQuery)
  }

  return (
    <DashboardLayout>
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Natural Language Paper Search</h1>
        <p className="text-gray-500">
          Search for research papers using natural language. Try queries like "recent papers about transformer models in
          NLP" or "quantum computing papers from 2020 to 2023"
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
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
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Search Parameters</CardTitle>
              <CardDescription>Enter your search query in natural language</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="e.g., Recent papers on large language models in healthcare"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="min-w-[100px]">
                    {loading ? "Searching..." : "Search"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Year Range: {yearRange[0]} - {yearRange[1]}
                              </Label>
                            </div>
                            <Slider
                              value={yearRange}
                              min={1950}
                              max={2023}
                              step={1}
                              onValueChange={(value) => setYearRange(value as number[])}
                              className="py-4"
                            />
                          </div>

                          <div>
                            <Label className="flex items-center gap-2 mb-2">
                              <BookOpen className="h-4 w-4" />
                              Research Fields
                            </Label>
                            <ScrollArea className="h-[150px] border rounded-md p-2">
                              <div className="space-y-2">
                                {RESEARCH_FIELDS.map((field) => (
                                  <div key={field} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`field-${field}`}
                                      checked={selectedFields.includes(field)}
                                      onCheckedChange={() => handleFieldToggle(field)}
                                    />
                                    <label
                                      htmlFor={`field-${field}`}
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {field}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="flex items-center gap-2 mb-2">
                              <Tag className="h-4 w-4" />
                              Common Tags
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {COMMON_TAGS.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                                  className="cursor-pointer"
                                  onClick={() => handleTagToggle(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="flex items-center gap-2 mb-2">
                              <ArrowUpDown className="h-4 w-4" />
                              Sort By
                            </Label>
                            <Select value={sortOption} onValueChange={setSortOption}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="relevance">Relevance</SelectItem>
                                <SelectItem value="year-desc">Newest First</SelectItem>
                                <SelectItem value="year-asc">Oldest First</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearFilters}
                              className="flex items-center gap-2"
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
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Search Results ({filteredResults.length})</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Active Filters</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2 text-xs text-gray-500">
                      <div className="mb-1">
                        <strong>Year Range:</strong> {yearRange[0]} - {yearRange[1]}
                      </div>
                      {selectedFields.length > 0 && (
                        <div className="mb-1">
                          <strong>Fields:</strong> {selectedFields.join(", ")}
                        </div>
                      )}
                      {selectedTags.length > 0 && (
                        <div className="mb-1">
                          <strong>Tags:</strong> {selectedTags.join(", ")}
                        </div>
                      )}
                      <div>
                        <strong>Sort:</strong> {sortOption}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <AnimatePresence>
                {filteredResults.map((paper, index) => (
                  <motion.div
                    key={paper.paper_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-all border-l-4 hover:border-l-8 border-l-gray-800"
                      onClick={() => handlePaperClick(paper.paper_id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{paper.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          {paper.authors.join(", ")}
                          <Separator orientation="vertical" className="h-4" />
                          <Calendar className="h-3 w-3" />
                          {paper.metadata.year}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{paper.summary_preview}</p>
                      </CardContent>
                      <CardFooter className="pt-0 flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {paper.metadata.field}
                        </Badge>
                        {paper.metadata.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                        {paper.relevance_score !== undefined && (
                          <Badge variant="default" className="ml-auto flex items-center gap-1 bg-amber-500">
                            <Sparkles className="h-3 w-3" />
                            Score: {(1 - paper.relevance_score).toFixed(2)}
                          </Badge>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : query ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-gray-100 p-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  We couldn't find any papers matching your search criteria. Try adjusting your filters or using
                  different keywords.
                </p>
                <Button variant="outline" onClick={clearFilters} className="mt-2">
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="rounded-full bg-gray-100 p-3">
                  <Sparkles className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">Discover Research Papers</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Enter a natural language query to find relevant research papers. You can ask for specific topics, time
                  periods, or research fields.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Try these example queries:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "Latest papers on transformer models",
                      "Healthcare AI research from 2020-2023",
                      "Quantum computing breakthroughs",
                    ].map((example) => (
                      <Badge
                        key={example}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          setQuery(example)
                          setTimeout(() => handleSearch(), 0)
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
          <Card>
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
                      className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleHistoryItemClick(historyItem)}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{historyItem}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
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

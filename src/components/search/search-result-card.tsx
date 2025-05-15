"use client"

import { motion } from "framer-motion"
import { ChevronRight, Calendar, FileText, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useHtmlParser } from "@/hooks/useHtmlParser"

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

interface SearchResultCardProps {
  paper: SearchResult
  onClick: (paperId: string) => void
}

export function SearchResultCard({ paper, onClick }: SearchResultCardProps) {
  const { parseHtml, truncateText } = useHtmlParser()

  // Add a safety check to prevent errors when paper is undefined
  if (!paper) {
    return null
  }

  // Parse the HTML content from research_problem
  const plainTextProblem = parseHtml(paper.research_problem)

  // Calculate score percentage for display
  const scorePercentage = Math.round(paper._score * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onClick(paper._id)}
    >
      {/* Subtle gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-black opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Score indicator as an elegant vertical gradient */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[3px]"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${paper._score * 0.3 + 0.1}) 0%, rgba(0,0,0,${paper._score * 0.1}) 100%)`,
          backgroundImage: `linear-gradient(to bottom, rgba(161,161,161,${paper._score * 0.3 + 0.1}) 0%, rgba(161,161,161,${paper._score * 0.1}) 100%)`,
        }}
      ></div>

      {/* Hover indicator */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:right-4">
        <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 shadow-sm">
          <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 pr-16 leading-tight tracking-tight">
            {paper.title}
          </h3>

          <div className="absolute top-5 right-5">
            <div className="flex items-center justify-center h-8 px-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 font-medium">{scorePercentage}%</span>
            </div>
          </div>
        </div>

        {paper.authors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 text-sm text-zinc-600 dark:text-zinc-400">
            <User className="h-3.5 w-3.5 opacity-70" />
            <span className="line-clamp-1 text-xs">{paper.authors.join(", ")}</span>
          </div>
        )}

        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-2 leading-relaxed">
          {truncateText(plainTextProblem, 180)}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mt-auto">
          {paper.userUploadName && (
            <div className="flex items-center px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <FileText className="h-3 w-3 mr-1.5 text-zinc-500 dark:text-zinc-400" />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{paper.userUploadName}</span>
            </div>
          )}

          {paper.date_published && (
            <div className="flex items-center px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Calendar className="h-3 w-3 mr-1.5 text-zinc-500 dark:text-zinc-400" />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{paper.date_published}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mt-1">
            {paper.tags?.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="px-2 py-0 h-5 text-xs bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {tag}
              </Badge>
            ))}
            {paper.tags?.length > 3 && (
              <Badge
                variant="outline"
                className="px-2 py-0 h-5 text-xs bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                +{paper.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Elegant bottom border that appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  )
}

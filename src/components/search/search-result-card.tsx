"use client"
import { motion } from "framer-motion"
import { BookOpen, Calendar, ChevronRight, Sparkles, User } from "lucide-react"

interface SearchResultCardProps {
  paper: {
    _id: string
    _score: number
    userUploadName: string
    title: string
    authors: string[]
    research_problem: string
    date_published: string
    tags: string[]
  }
  onClick: (id: string) => void
}

export function SearchResultCard({ paper, onClick }: SearchResultCardProps) {
  // Add a safety check to prevent errors when paper is undefined
  if (!paper) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onClick(paper._id)}
    >
      {/* Elegant gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-black opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Score indicator as an elegant vertical gradient */}
      <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-zinc-400 to-zinc-200 dark:from-zinc-600 dark:to-zinc-800"></div>

      {/* Hover indicator */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:right-4">
        <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 shadow-sm">
          <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>

      <div className="relative p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1.5 max-w-[calc(100%-120px)]">
            <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
              {paper.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-500 dark:text-zinc-400 text-sm">
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                <span className="text-sm font-medium">{paper.authors.join(", ")}</span>
              </div>

              {paper.date_published && (
                <div className="flex items-center">
                  <span className="inline-block h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-1"></span>
                  <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                  <span className="text-sm">{paper.date_published}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-9 px-3 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-zinc-500 dark:text-zinc-400" />
              <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                {paper._score.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{paper.research_problem}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center px-3 py-1.5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <BookOpen className="h-3.5 w-3.5 mr-2 text-zinc-500 dark:text-zinc-400" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{paper.userUploadName}</span>
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

          <div className="flex flex-wrap gap-1.5">
            {paper.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Elegant bottom border that appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  )
}

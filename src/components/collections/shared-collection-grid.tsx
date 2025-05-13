"use client"
import { Users, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SharedCollectionGrid() {
  const router = useRouter()

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => router.push("/dashboard/collections/shared")}
      role="button"
      tabIndex={0}
      aria-label="View shared collections"
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
              <Users className="h-[18px] w-[18px] text-zinc-600 dark:text-zinc-400" />
            </span>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">Shared with me</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Collections shared by other researchers</p>

        {/* View button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

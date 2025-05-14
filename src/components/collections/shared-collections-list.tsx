"use client"
import { Folder, Clock, MoreHorizontal, File, User, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Collection } from "@/types/collection"

interface SharedCollectionsListProps {
  collections: Collection[]
  onSelect: (collection: Collection) => void
  onRemoveAccess: (collectionId: string) => void
  accessLevels: Record<string, string>
}

export function SharedCollectionsList({
  collections,
  onSelect,
  onRemoveAccess,
  accessLevels,
}: SharedCollectionsListProps) {
  // Get badge color based on access level
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "scan":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "modify":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
      case "control":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <div
            key={collection._id}
            className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm hover:shadow-md transition-all"
            onClick={() => onSelect(collection)}
            role="button"
            tabIndex={0}
            aria-label={`Open ${collection.name} collection`}
          >
            <div className="p-5">
              {/* Header row */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                    <Folder className="h-[18px] w-[18px] text-zinc-600 dark:text-zinc-400" />
                  </span>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{collection.name}</h3>
                </div>

                {/* three-dot menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>

                  {/* Menu items */}
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        requestAnimationFrame(() => onSelect(collection))
                      }}
                    >
                      Open collection
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        requestAnimationFrame(() => onRemoveAccess(collection._id))
                      }}
                      className="text-red-600 dark:text-red-400"
                      variant="destructive"
                    >
                      Remove access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800 text-[13px] text-zinc-500 dark:text-zinc-400 mb-4">
                <div className="flex items-center gap-1.5 pr-3">
                  <File className="h-[14px] w-[14px]" />
                  <span>{collection.papers.length} papers</span>
                </div>
                <div className="flex items-center gap-1.5 pl-3">
                  <Clock className="h-[14px] w-[14px]" />
                  <span>
                    Updated{" "}
                    {formatDistanceToNow(new Date(collection.updated_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Access level badge */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {collection.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="h-5 px-2 text-xs bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Badge
                  variant="outline"
                  className={`h-5 px-2 text-xs flex items-center gap-1 ${getAccessLevelColor(accessLevels[collection._id])}`}
                >
                  <User className="h-3 w-3" />
                  {accessLevels[collection._id]}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
            <Users className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          </div>
          <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">No shared collections</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
            No one has shared any collections with you yet
          </p>
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import { Folder, MoreHorizontal, File, Clock } from "lucide-react"
import type { Collection} from "@/types/collection"
import { formatDistanceToNow } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RenameCollectionDialog } from "@/components/collections/rename-collection-dialog"
import { DeleteCollectionDialog } from "@/components/collections/delete-collection-dialog"



interface CollectionGridProps {
  collections: Collection[]
  onSelect: (collection: Collection) => void
  onRename: (id: string, newName: string) => void
  onDelete: (id: string) => void
  setIsCreateDialogOpen: (isOpen: boolean) => void
}

export function CollectionGrid({ collections, onSelect, onRename, onDelete, setIsCreateDialogOpen }: CollectionGridProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null)

  const handleRenameClick = (collection: Collection) => {
    setActiveCollection(collection)
    setRenameDialogOpen(true)
  }

  const handleDeleteClick = (collection: Collection) => {
    setActiveCollection(collection)
    setDeleteDialogOpen(true)
  }

  const handleRename = (newName: string) => {
    if (activeCollection) {
      onRename(activeCollection._id, newName)
      setRenameDialogOpen(false)
    }
  }

  const handleDelete = () => {
    if (activeCollection) {
      onDelete(activeCollection._id)
      setDeleteDialogOpen(false)
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
            {/* ── Header row ─────────────────────────────────── */}
            <div className="flex items-start justify-between mb-5">
              {/* icon + name */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                  <Folder className="h-[18px] w-[18px] text-zinc-600 dark:text-zinc-400" />
                </span>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {collection.name}
                </h3>
              </div>
        
              {/* three-dot menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
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
                      e.preventDefault();
                      e.stopPropagation();
                      requestAnimationFrame(() => onSelect(collection))
                    }
                  }
                  >
                    Open collection
                  </DropdownMenuItem>
        
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      requestAnimationFrame(() => handleRenameClick(collection))
                    }
                    }
                  >
                    Rename
                  </DropdownMenuItem>
        
                  <DropdownMenuSeparator />
        
                  <DropdownMenuItem
                    onClick={(e) =>{
                      e.stopPropagation();
                      requestAnimationFrame(() => handleDeleteClick(collection))
                    }
                    }
                    className="text-red-600 dark:text-red-400"
                    variant="destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        
            {/* ── Stats row ─────────────────────────────────── */}
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
        
            {/* ── Tags row ───────────────────────────────────── */}
            {collection.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {collection.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="h-5 px-2 text-xs bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {tag}
                  </Badge>
                ))}
                {collection.tags.length > 3 && (
                  <Badge
                    variant="outline"
                    className="h-5 px-2 text-xs bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    +{collection.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        ))}
      </div>

      {collections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
            <Folder className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
          </div>
          <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">No collections yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
            Create your first collection to organize your research papers
          </p>
          <Button
            onClick={() => {setIsCreateDialogOpen(true)}}
            className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
          >
            <Folder className="mr-2 h-4 w-4" />
            Create Collection
          </Button>
        </div>
      )}

      <RenameCollectionDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={activeCollection?.name || ""}
        onRename={handleRename}
      />

      <DeleteCollectionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        collectionName={activeCollection?.name || ""}
        onDelete={handleDelete}
      />
    </>
  )
}

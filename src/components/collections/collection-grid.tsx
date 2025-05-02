"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Folder, MoreHorizontal, Tag, File, Clock } from "lucide-react"
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
}

export function CollectionGrid({ collections, onSelect, onRename, onDelete }: CollectionGridProps) {
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
        {collections.map((collection, index) => (
          <motion.div
            key={collection._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-black opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-300 via-zinc-200 to-zinc-300 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 opacity-50 group-hover:opacity-80 transition-opacity duration-300" />

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => onSelect(collection)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${collection.name} collection`}
                >
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 mr-3">
                    <Folder className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    {collection.name}
                  </h3>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onSelect(collection)}>Open collection</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRenameClick(collection)}>Rename</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(collection)}
                      className="text-red-600 dark:text-red-400"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                <File className="h-4 w-4 mr-1.5" />
                <span>{collection.papers.length} papers</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1.5" />
                <span>Updated {formatDistanceToNow(new Date(collection.updated_at), { addSuffix: true })}</span>
              </div>

              {collection.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Tag className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 mr-1" />
                  {collection.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="px-2 py-0 h-5 text-xs bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {collection.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="px-2 py-0 h-5 text-xs bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      +{collection.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Clickable overlay for the entire card */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => onSelect(collection)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${collection.name} collection`}
            />
          </motion.div>
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
            onClick={() => {}}
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

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MoreHorizontal, Tag, Plus, Search, File, Trash2, X, Edit, Calendar, FolderOpen } from "lucide-react"
import type { Collection, Paper } from "@/types/collection"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RenameCollectionDialog } from "@/components/collections/rename-collection-dialog"
import { DeleteCollectionDialog } from "@/components/collections/delete-collection-dialog"
import { AddTagDialog } from "@/components/collections/add-tag-dialog"
import { AddPaperDialog } from "@/components/collections/add-paper-dialog"


interface CollectionDetailProps {
  collection: Collection
  papers: Paper[]
  onBack: () => void
  onRename: (newName: string) => void
  onDelete: () => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onAddPaper: (paperId: string) => void
  onRemovePaper: (paperId: string) => void
  onPaperClick: (paperId: string) => void
  availablePapers: Paper[]
}

export function CollectionDetail({
  collection,
  papers,
  onBack,
  onRename,
  onDelete,
  onAddTag,
  onRemoveTag,
  onAddPaper,
  onRemovePaper,
  onPaperClick,
  availablePapers,
}: CollectionDetailProps) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addTagDialogOpen, setAddTagDialogOpen] = useState(false)
  const [addPaperDialogOpen, setAddPaperDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPapers = papers.filter((paper) => paper.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to collections</span>
          </Button>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 mr-3">
              <FolderOpen className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{collection.name}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Updated {formatDistanceToNow(new Date(collection.updated_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddPaperDialogOpen(true)}
            className="border-zinc-200 dark:border-zinc-800"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Add Paper
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddTagDialogOpen(true)}>
                <Tag className="mr-2 h-4 w-4" />
                Add Tag
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600 dark:text-red-400">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {collection.tags.length > 0 && (
          <>
            {collection.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="px-2.5 py-0.5 bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="ml-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 p-0.5"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag} tag</span>
                </button>
              </Badge>
            ))}
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAddTagDialogOpen(true)}
          className="h-7 px-2 text-xs border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Tag
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        <Input
          type="text"
          placeholder="Search papers in this collection..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black"
        />
      </div>

      <div className="border rounded-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center">
            <File className="h-4 w-4 text-zinc-500 dark:text-zinc-400 mr-2" />
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Papers ({papers.length})</h3>
          </div>
          {papers.length > 0 && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {filteredPapers.length} of {papers.length} papers
            </span>
          )}
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper) => (
              <div
                key={paper._id}
                className="group px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 flex items-center justify-between cursor-pointer"
                onClick={() => onPaperClick(paper._id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 mr-3">
                      <File className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{paper.title}</h4>
                      <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{paper.date_published || "No date"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemovePaper(paper._id)
                  }}
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="sr-only">Remove paper</span>
                </Button>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              {searchQuery ? (
                <div className="text-zinc-500 dark:text-zinc-400">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No papers match your search</p>
                </div>
              ) : papers.length === 0 ? (
                <div className="text-zinc-500 dark:text-zinc-400">
                  <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No papers in this collection</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddPaperDialogOpen(true)}
                    className="mt-4 border-zinc-200 dark:border-zinc-800"
                  >
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Add Paper
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <RenameCollectionDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={collection.name}
        onRename={onRename}
      />

      <DeleteCollectionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        collectionName={collection.name}
        onDelete={onDelete}
      />

      <AddTagDialog
        open={addTagDialogOpen}
        onOpenChange={setAddTagDialogOpen}
        onAddTag={onAddTag}
        existingTags={collection.tags}
      />

      <AddPaperDialog
        open={addPaperDialogOpen}
        onOpenChange={setAddPaperDialogOpen}
        onAddPaper={onAddPaper}
        availablePapers={availablePapers.filter((paper) => !collection.papers.includes(paper._id))}
      />
    </div>
  )
}

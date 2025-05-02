"use client"

import type React from "react"

import { useState } from "react"
import { Search, File } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Paper } from "@/types/collection"

interface AddPaperDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPaper: (paperId: string) => void
  availablePapers: Paper[]
}

export function AddPaperDialog({ open, onOpenChange, onAddPaper, availablePapers }: AddPaperDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null)

  const filteredPapers = availablePapers.filter((paper) =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPaperId) {
      onAddPaper(selectedPaperId)
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setSearchQuery("")
    setSelectedPaperId(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Paper to Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers..."
              className="pl-9 border-zinc-200 dark:border-zinc-800"
              autoFocus
            />
          </div>

          <div className="border rounded-md border-zinc-200 dark:border-zinc-800">
            <ScrollArea className="h-[300px]">
              {filteredPapers.length > 0 ? (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredPapers.map((paper) => (
                    <div
                      key={paper._id}
                      className={`px-4 py-3 cursor-pointer flex items-center ${
                        selectedPaperId === paper._id
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                      onClick={() => setSelectedPaperId(paper._id)}
                    >
                      <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 mr-3">
                        <File className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{paper.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{paper.date_published || "No date"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <Search className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mb-2" />
                  <p className="text-zinc-500 dark:text-zinc-400 text-center">
                    {availablePapers.length === 0 ? "No papers available to add" : "No papers match your search"}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              className="border-zinc-200 dark:border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedPaperId}
              className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
            >
              Add Paper
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

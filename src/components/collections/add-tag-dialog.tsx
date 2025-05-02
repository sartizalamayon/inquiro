"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTag: (tag: string) => void
  existingTags: string[]
}

export function AddTagDialog({ open, onOpenChange, onAddTag, existingTags }: AddTagDialogProps) {
  const [tag, setTag] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTag = tag.trim()

    if (!trimmedTag) {
      setError("Tag cannot be empty")
      return
    }

    if (existingTags.includes(trimmedTag)) {
      setError("This tag already exists")
      return
    }

    onAddTag(trimmedTag)
    setTag("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="tag" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Tag Name
            </label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value)
                setError("")
              }}
              placeholder="Enter tag name"
              className="border-zinc-200 dark:border-zinc-800"
              autoFocus
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTag("")
                setError("")
                onOpenChange(false)
              }}
              className="border-zinc-200 dark:border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
            >
              Add Tag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

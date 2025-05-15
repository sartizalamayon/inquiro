"use client"

import { useState, useEffect, useRef } from "react"
import { FolderPlus, Search, Plus, Check, Folder, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Collection } from "@/types/collection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type RefObject } from "react"

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: MouseEvent | TouchEvent) => void,
  ): void {
    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        const el = ref?.current
        if (!el || el.contains(event.target as Node)) {
          return
        }
  
        handler(event)
      }
  
      document.addEventListener("mousedown", listener)
      document.addEventListener("touchstart", listener)
  
      return () => {
        document.removeEventListener("mousedown", listener)
        document.removeEventListener("touchstart", listener)
      }
    }, [ref, handler])
}

interface SaveToCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paperId: string
}

export function SaveToCollectionDialog({ open, onOpenChange, paperId }: SaveToCollectionDialogProps) {
  const { data: session } = useSession()
  const userEmail = session?.user?.email || ""
  const modalRef = useRef<HTMLDivElement>(null)

  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [activeTab, setActiveTab] = useState("existing")

  // Handle click outside to close
  useOnClickOutside(modalRef, () => {
    if (open) onOpenChange(false)
  })

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  // Fetch user's collections
  useEffect(() => {
    if (!open || !userEmail) return

    const fetchCollections = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/collections?user_email=${encodeURIComponent(userEmail)}`)
        if (!response.ok) throw new Error("Failed to fetch collections")

        const data = await response.json()
        setCollections(data)

        // If collections exist, select the first one by default
        if (data.length > 0) {
          setSelectedCollectionId(data[0]._id)
        } else {
          // If no collections, switch to the "new" tab
          setActiveTab("new")
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
        toast.error("Failed to load collections")
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [open, userEmail])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSearchQuery("")
        setNewCollectionName("")
        if (collections.length > 0) {
          setSelectedCollectionId(collections[0]._id)
          setActiveTab("existing")
        } else {
          setActiveTab("new")
        }
      }, 100)
    }
  }, [open, collections])

  // Filter collections based on search query
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Save paper to existing collection
  const saveToExistingCollection = async () => {
    if (!selectedCollectionId || !userEmail) {
      toast.error("Please select a collection")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/collections/${selectedCollectionId}/papers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper_id: paperId,
          user_email: userEmail,
        }),
      })

      if (!response.ok) throw new Error("Failed to save paper to collection")

      toast.success("Paper saved to collection")
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving paper:", error)
      toast.error("Failed to save paper to collection")
    } finally {
      setSaving(false)
    }
  }

  // Create new collection and save paper to it
  const createAndSave = async () => {
    if (!newCollectionName.trim() || !userEmail) {
      toast.error("Please enter a collection name")
      return
    }

    setSaving(true)
    try {
      // First create the collection
      const createResponse = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCollectionName,
          tags: [],
          user_email: userEmail,
        }),
      })

      if (!createResponse.ok) throw new Error("Failed to create collection")

      const newCollection = await createResponse.json()

      // Then add the paper to the new collection
      const addResponse = await fetch(`/api/collections/${newCollection._id}/papers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paper_id: paperId,
          user_email: userEmail,
        }),
      })

      if (!addResponse.ok) throw new Error("Failed to add paper to new collection")

      toast.success(`Paper saved to "${newCollectionName}"`)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating collection and saving paper:", error)
      toast.error("Failed to create collection and save paper")
    } finally {
      setSaving(false)
    }
  }

  // Handle save button click based on active tab
  const handleSave = () => {
    if (activeTab === "existing") {
      saveToExistingCollection()
    } else {
      createAndSave()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-lg bg-white dark:bg-zinc-950 shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in-0 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <FolderPlus className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Save to Collection</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Add this paper to one of your research collections</p>
        </div>

        <Separator className="my-2" />

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="existing" className="text-sm">
                Existing Collection
              </TabsTrigger>
              <TabsTrigger value="new" className="text-sm">
                New Collection
              </TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4">
              {/* Search input */}
              {collections.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              )}

              {/* Collections list */}
              {loading ? (
                <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">Loading collections...</div>
              ) : filteredCollections.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {searchQuery ? "No collections match your search" : "You don't have any collections yet"}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("new")} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Create a new collection
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-auto pr-1">
                  {filteredCollections.map((collection) => (
                    <div
                      key={collection._id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors",
                        selectedCollectionId === collection._id
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                      )}
                      onClick={() => setSelectedCollectionId(collection._id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-900">
                          <Folder className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">{collection.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{collection.papers.length} papers</p>
                        </div>
                      </div>

                      {selectedCollectionId === collection._id && (
                        <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-collection-name" className="text-sm font-medium">
                  Collection name
                </Label>
                <Input
                  id="new-collection-name"
                  placeholder="Enter collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        {/* Footer */}
        <div className="p-4 flex flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-200 dark:border-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              (activeTab === "existing" && !selectedCollectionId) ||
              (activeTab === "new" && !newCollectionName.trim()) ||
              saving ||
              !userEmail
            }
            className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
}

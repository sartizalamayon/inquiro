"use client"

import { useState, useEffect, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/layout"
import { SharedCollectionsList } from "@/components/collections/shared-collections-list"
import { CollectionDetail } from "@/components/collections/collection-detail"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { useSharedCollections } from "@/hooks/useSharedCollections"
import { usePapers } from "@/hooks/usePapers"
import type { Collection, Paper } from "@/types/collection"

export default function SharedCollectionsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userEmail = session?.user?.email || ""

  // 1) shared‐collections hook
  const {
    collections,
    accessLevels,
    loading: loadingShared,
    error: sharedError,
    fetchSharedCollections,
    removeAccess,
  } = useSharedCollections({ userEmail })

  

  // local UI state
  const [selected, setSelected] = useState<Collection | null>(null)
  const [collPapers, setCollPapers]       = useState<Paper[]>([])
  const [availPapers, setAvailPapers]     = useState<Paper[]>([])

  // 2) all papers (for adds/removes)
  const [papers, setPapers] = useState<Paper[]>([])

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch(`http://localhost:8000/paper`)
        if (!res.ok) throw new Error("Failed to fetch papers")
        const data = await res.json()
        setPapers(data)
      } catch (error) {
        console.error("Error fetching papers:", error)
        toast.error("Failed to fetch papers")
      }
    }

    if (userEmail) {
      fetchPapers()
    }
  }, [userEmail])

  
  // on mount: load shared collections & all papers
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/dashboard/collections/shared")
      return
    }
    if (userEmail) {
      fetchSharedCollections()
    }
  }, [userEmail, status, fetchSharedCollections, router])

  // whenever selected / papers change, recalc lists
  useEffect(() => {
    if (!selected) return
    console.log(papers)
    setCollPapers(
      papers.filter((p) => selected.papers.includes(p._id)).map(p => ({
        ...p,
        date_published: p.date_published || "",
      }))
    )
    setAvailPapers(
      papers.filter((p) => !selected.papers.includes(p._id)).map(p => ({
        ...p,
        date_published: p.date_published || "",
      }))
    )
  }, [selected, papers])

  // common helper: reload both lists
  const reloadAll = async () => {
    await fetchSharedCollections()
    // re-select to pick up updated tags/papers
    if (selected) {
      const updated = (await fetch(`http://localhost:8000/collections/${selected._id}`))
                        .json() as Promise<Collection>
      setSelected(await updated)
    }
  }

  // ── Action handlers ─────────────────────────────────────────

  const handleRemoveAccess = async (id: string) => {
    if (await removeAccess(id)) {
      toast.success("Access removed")
      setSelected(null)
      fetchSharedCollections()
    } else {
      toast.error("Failed to remove access")
    }
  }

  const handleBack = () => setSelected(null)

  const handleRename = async (newName: string) => {
    const res = await fetch(
      `http://localhost:8000/collections/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      }
    )
    if (res.ok) {
      toast.success("Renamed!")
      await reloadAll()
    } else {
      toast.error("Rename failed")
    }
  }

  const handleDelete = async () => {
    const res = await fetch(
      `http://localhost:8000/collections/${selected._id}`, {
        method: "DELETE",
      }
    )
    if (res.ok) {
      toast.success("Collection deleted")
      setSelected(null)
      fetchSharedCollections()
    } else {
      toast.error("Delete failed")
    }
  }

  const handleAddTag = async (tag: string) => {
    const res = await fetch(
      `http://localhost:8000/collections/${selected._id}/tags/${encodeURIComponent(tag)}`,
      { method: "POST" }
    )
    if (res.ok) {
      toast.success("Tag added")
      await reloadAll()
    } else {
      toast.error("Add tag failed")
    }
  }

  const handleRemoveTag = async (tag: string) => {
    const res = await fetch(
      `http://localhost:8000/collections/${selected._id}/tags/${encodeURIComponent(tag)}`,
      { method: "DELETE" }
    )
    if (res.ok) {
      toast.success("Tag removed")
      await reloadAll()
    } else {
      toast.error("Remove tag failed")
    }
  }

  const handleAddPaper = async (paperId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/collections/${selected?._id}/papers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({paper:paperId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add paper to collection');
        toast.error("Add paper failed")
      }
  }
  catch (error) {
    console.error("Error adding paper:", error)
    toast.error("Failed to add paper")
  }
  }

  const handleRemovePaper = async (paperId: string) => {
    const res = await fetch(
      `http://localhost:8000/collections/${selected._id}/papers/${paperId}?user_email=${userEmail}`,
      { method: "DELETE" }
    )
    if (res.ok) {
      toast.success("Paper removed")
      await reloadAll()
    } else {
      toast.error("Remove paper failed")
    }
  }

  const handlePaperClick = (id: string) => router.push(`/dashboard/paper/${id}`)

  // ── Render ─────────────────────────────────────────────────────

  if (status === "loading" || loadingShared) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <p>Loading shared collections…</p>
        </div>
      </DashboardLayout>
    )
  }

  if (sharedError) {
    return (
      <DashboardLayout>
        <div className="container mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error loading shared collections
          </h1>
          <Button onClick={fetchSharedCollections}>Try Again</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        { !selected ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost" size="icon"
                  onClick={() => router.push("/dashboard/collections")}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold">Shared Collections</h1>
              </div>
              <p className="text-zinc-500">
                Collections shared with you by other researchers
              </p>
            </div>

            <SharedCollectionsList
              collections={collections}
              accessLevels={accessLevels}
              onSelect={setSelected}
              onRemoveAccess={handleRemoveAccess}
            />
          </>
        ) : (
          <CollectionDetail
            collection={selected}
            papers={collPapers}
            availablePapers={availPapers}
            onBack={handleBack}
            onRename={handleRename}
            onDelete={handleDelete}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onAddPaper={handleAddPaper}
            onRemovePaper={handleRemovePaper}
            onPaperClick={handlePaperClick}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

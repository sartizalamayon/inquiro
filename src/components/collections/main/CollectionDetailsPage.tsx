"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { CollectionDetail } from "@/components/collections/collection-detail"
import { Button } from "@/components/ui/button"
import { useCollections } from "@/hooks/useCollections"
import { usePapers } from "@/hooks/usePapers"
import type { Paper } from "@/types/collection"

interface Props {
  collectionId: string
  onBack: () => void
}

export function CollectionDetailsPage({ collectionId, onBack }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userEmail = session?.user?.email || ""

  // load collection & paper hooks
  const {
    collections,
    loading: collLoading,
    error: collError,
    updateCollection,
    deleteCollection,
    addTagToCollection,
    removeTagFromCollection,
    addPaperToCollection,
    removePaperFromCollection,
    fetchCollections,
  } = useCollections({ userEmail })

  const { data: papers = [], refetch: refetchPapers } = usePapers(userEmail, "")

  // our local copy of the current collection
  const [collection, setCollection] = useState(() =>
    collections.find((c) => c._id === collectionId) || null
  )

  // available papers not yet in this collection
  const [availablePapers, setAvailablePapers] = useState<Paper[]>([])

  // whenever collections or papers change, keep local state in sync
  useEffect(() => {
    if (collections.length) {
      const c = collections.find((c) => c._id === collectionId) || null
      setCollection(c)
    }
  }, [collections, collectionId])

  useEffect(() => {
    if (papers.length && collection) {
      setAvailablePapers(
        papers
          .filter((p) => !collection.papers.includes(p._id))
          .map((p) => ({
            ...p,
            date_published: p.date_published || "",
          }))
      )
    }
  }, [papers, collection])

  // initial data load
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/dashboard/collections")
    } else if (userEmail) {
      fetchCollections()
      refetchPapers()
    }
  }, [status, userEmail, fetchCollections, refetchPapers, router])

  if (status === "loading" || collLoading || !collection) {
    return (
        <div className="col-span-full flex flex-col items-center gap-2 py-16">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading collection…</p>
        </div>
    )
  }

  if (collError) {
    return (
        <div className="container mx-auto text-center py-16">
          <h2 className="text-red-600">Error loading collection</h2>
          <p>{collError}</p>
          <Button onClick={() => fetchCollections()}>Retry</Button>
        </div>
    )
  }

  // CRUD handlers bound to the current collection
  const handleRename = (newName: string) => {
    updateCollection(collection._id, { name: newName })
  }
  const handleDelete = () => {
    deleteCollection(collection._id)
    onBack()
  }
  const handleAddTag = (tag: string) => addTagToCollection(collection._id, tag)
  const handleRemoveTag = (tag: string) => removeTagFromCollection(collection._id, tag)
  const handleAddPaper = (paperId: string) => addPaperToCollection(collection._id, paperId)
  const handleRemovePaper = (paperId: string) => removePaperFromCollection(collection._id, paperId)
  const handlePaperClick = (paperId: string) => router.push(`/dashboard/paper/${paperId}`)



  return (
      <CollectionDetail
        collection={collection}
        papers={papers.filter((p) => collection.papers.includes(p._id))}
        availablePapers={availablePapers}
        onBack={onBack}
        onRename={handleRename}
        onDelete={handleDelete}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onAddPaper={handleAddPaper}
        onRemovePaper={handleRemovePaper}
        onPaperClick={handlePaperClick}
      />

  )
}

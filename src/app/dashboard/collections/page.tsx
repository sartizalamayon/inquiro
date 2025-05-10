"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { CollectionGrid } from "@/components/collections/collection-grid"
import { CollectionDetail } from "@/components/collections/collection-detail"
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import type { Collection, Paper } from "@/types/collection"
import { useCollections } from "@/hooks/useCollections"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { usePapers } from "@/hooks/usePapers" 

export default function CollectionsPage() {
  const router = useRouter()
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [availablePapers, setAvailablePapers] = useState<Paper[]>([])

  const { data: session, status } = useSession()
  const userEmail = session?.user?.email || ""
  
  // Use our custom hook with user email
  const {
    collections,
    loading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addTagToCollection,
    removeTagFromCollection,
    addPaperToCollection,
    removePaperFromCollection,
  } = useCollections({ userEmail })

  const {
    data: papers = [],
    refetch,
  } = usePapers(userEmail, "")

  // Fetch collections when session is loaded and userEmail is available
  useEffect(() => {
    if (status === "loading") {
      <div className="col-span-full flex flex-col items-center gap-2 py-16">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading Collections...</p>
        </div>
    };
    
    if (userEmail) {
      fetchCollections();
      
      if (papers.length > 0) {
        const formattedPapers = papers?.map((paper: {
          _id: string;
          user_email: string;
          title: string;
          date_published?: string;
        }) => ({
          _id: paper._id,
          user_email: paper.user_email,
          title: paper.title,
          date_published: paper.date_published || "",
        }));
  
        setAvailablePapers(formattedPapers);
      }

    } else if (status === "unauthenticated") {
      // Redirect to login if not authenticated
      router.push('/signin?callbackUrl=/dashboard/collections');
    }
  }, [userEmail, status, fetchCollections, router, papers]);



  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="col-span-full flex flex-col items-center gap-2 py-16">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading Collections...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Function to create a new collection
  const handleCreateCollection = (name: string, tags: string[]) => {
    createCollection(name, tags)
    setIsCreateDialogOpen(false)
  }

  // Function to rename a collection
  const handleRenameCollection = (id: string, newName: string) => {
    updateCollection(id, { name: newName })
    if (selectedCollection && selectedCollection._id === id) {
      setSelectedCollection({ ...selectedCollection, name: newName })
    }
  }

  // Function to delete a collection
  const handleDeleteCollection = (id: string) => {
    deleteCollection(id)
    if (selectedCollection && selectedCollection._id === id) {
      setSelectedCollection(null)
    }
  }

  // Function to add a tag to a collection
  const handleAddTag = (collectionId: string, tag: string) => {
    addTagToCollection(collectionId, tag)
    if (selectedCollection && selectedCollection._id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        tags: [...selectedCollection.tags, tag],
      })
    }
  }

  // Function to remove a tag from a collection
  const handleRemoveTag = (collectionId: string, tag: string) => {
    removeTagFromCollection(collectionId, tag)
    if (selectedCollection && selectedCollection._id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        tags: selectedCollection.tags.filter((t) => t !== tag),
      })
    }
  }

  // Function to add a paper to a collection
  const handleAddPaper = (collectionId: string, paperId: string) => {
    addPaperToCollection(collectionId, paperId)
    if (selectedCollection && selectedCollection._id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        papers: [...selectedCollection.papers, paperId],
      })
    }
  }

  // Function to remove a paper from a collection
  const handleRemovePaper = (collectionId: string, paperId: string) => {
    removePaperFromCollection(collectionId, paperId)
    if (selectedCollection && selectedCollection._id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        papers: selectedCollection.papers.filter((p) => p !== paperId),
      })
    }
  }

  // Function to get papers for a collection
  const getCollectionPapers = (collection: Collection) => {
    return availablePapers.filter((paper) => collection.papers.includes(paper._id))
  }

  // Function to navigate to paper detail page
  const handlePaperClick = (paperId: string) => {
    router.push(`/dashboard/paper/${paperId}`)
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error loading collections</h1>
          <p className="mb-4">{error}</p>
          <Button onClick={() => fetchCollections()}>Try Again</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        {!selectedCollection && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Collections</h1>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                Organize your research papers into custom collections
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </div>
        )}

        {loading && !selectedCollection ? (
          <div className="col-span-full flex flex-col items-center gap-2 py-16">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading Collections...</p>
          </div>
        ) : selectedCollection ? (
          <CollectionDetail
            collection={selectedCollection}
            papers={getCollectionPapers(selectedCollection)}
            onBack={() => setSelectedCollection(null)}
            onRename={(newName) => handleRenameCollection(selectedCollection._id, newName)}
            onDelete={() => handleDeleteCollection(selectedCollection._id)}
            onAddTag={(tag) => handleAddTag(selectedCollection._id, tag)}
            onRemoveTag={(tag) => handleRemoveTag(selectedCollection._id, tag)}
            onAddPaper={(paperId) => handleAddPaper(selectedCollection._id, paperId)}
            onRemovePaper={(paperId) => handleRemovePaper(selectedCollection._id, paperId)}
            onPaperClick={handlePaperClick}
            availablePapers={availablePapers.filter((paper) => !selectedCollection.papers.includes(paper._id))}
          />
        ) : (
          <CollectionGrid
            collections={collections}
            onSelect={setSelectedCollection}
            onRename={handleRenameCollection}
            onDelete={handleDeleteCollection}
            setIsCreateDialogOpen ={setIsCreateDialogOpen}
          />
        )}

        <CreateCollectionDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreate={handleCreateCollection}
        />
      </div>
    </DashboardLayout>
  )
}

"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import type { Collection, Paper } from "@/types/collection"
import { useCollections } from "@/hooks/useCollections"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { CollectionGridWithShared } from "@/components/collections/collection-grid-with-shared"
import { CollectionDetailsPage } from "@/components/collections/main/CollectionDetailsPage"

export default function CollectionsPage() {
  const router = useRouter()
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

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
    deleteCollection
  } = useCollections({ userEmail })



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
    
    } else if (status === "unauthenticated") {
      // Redirect to login if not authenticated
      router.push('/signin?callbackUrl=/dashboard/collections');
    }
  }, [userEmail, status, fetchCollections, router]);



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
          <CollectionDetailsPage
    collectionId={selectedCollection._id}
    onBack={() => setSelectedCollection(null)}
  />
        ) : (
          <CollectionGridWithShared
        collections={collections}
        onSelect={setSelectedCollection}
        onRename={handleRenameCollection}
        onDelete={handleDeleteCollection}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
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

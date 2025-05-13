"use client"
import { CollectionGrid } from "@/components/collections/collection-grid"
import { SharedCollectionGrid } from "@/components/collections/shared-collection-grid"
import type { Collection } from "@/types/collection"

interface CollectionGridWithSharedProps {
  collections: Collection[]
  onSelect: (collection: Collection) => void
  onRename: (id: string, newName: string) => void
  onDelete: (id: string) => void
  setIsCreateDialogOpen: (isOpen: boolean) => void
}

export function CollectionGridWithShared({
  collections,
  onSelect,
  onRename,
  onDelete,
  setIsCreateDialogOpen,
}: CollectionGridWithSharedProps) {
  return (
    <div className="space-y-6">
      {/* First row with Shared Collection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SharedCollectionGrid />
      </div>


      {/* Regular collections */}
      <CollectionGrid
        collections={collections}
        onSelect={onSelect}
        onRename={onRename}
        onDelete={onDelete}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
      />
    </div>
  )
}

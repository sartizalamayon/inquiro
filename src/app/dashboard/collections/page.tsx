"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/layout"
import { CollectionGrid } from "@/components/collections/collection-grid"
import { CollectionDetail } from "@/components/collections/collection-detail"
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Collection, Paper } from "@/types/collection"
  

// Dummy data for collections
const dummyCollections: Collection[] = [
  {
    _id: "col1",
    user_id: "user1",
    name: "AI Research",
    tags: ["artificial intelligence", "machine learning", "neural networks"],
    papers: ["paper1", "paper2", "paper3"],
    created_at: new Date("2023-01-15").toISOString(),
    updated_at: new Date("2023-04-22").toISOString(),
  },
  {
    _id: "col2",
    user_id: "user1",
    name: "Quantum Computing",
    tags: ["quantum", "computing", "physics"],
    papers: ["paper4", "paper5"],
    created_at: new Date("2023-02-10").toISOString(),
    updated_at: new Date("2023-05-18").toISOString(),
  },
  {
    _id: "col3",
    user_id: "user1",
    name: "Medical Research",
    tags: ["medicine", "healthcare", "biology"],
    papers: ["paper6", "paper7", "paper8", "paper9"],
    created_at: new Date("2023-03-05").toISOString(),
    updated_at: new Date("2023-06-12").toISOString(),
  },
  {
    _id: "col4",
    user_id: "user1",
    name: "Climate Science",
    tags: ["climate", "environment", "sustainability"],
    papers: ["paper10", "paper11"],
    created_at: new Date("2023-03-20").toISOString(),
    updated_at: new Date("2023-06-25").toISOString(),
  },
]

// Dummy data for papers
const dummyPapers: Paper[] = [
  {
    _id: "paper1",
    user_email: "user@example.com",
    title: "Advances in Large Language Models",
    date_published: "2023-01-10",
  },
  {
    _id: "paper2",
    user_email: "user@example.com",
    title: "Transformer Architecture Improvements",
    date_published: "2023-02-15",
  },
  {
    _id: "paper3",
    user_email: "user@example.com",
    title: "Reinforcement Learning from Human Feedback",
    date_published: "2023-03-20",
  },
  {
    _id: "paper4",
    user_email: "user@example.com",
    title: "Quantum Supremacy Experiments",
    date_published: "2023-01-05",
  },
  {
    _id: "paper5",
    user_email: "user@example.com",
    title: "Quantum Error Correction Methods",
    date_published: "2023-02-25",
  },
  {
    _id: "paper6",
    user_email: "user@example.com",
    title: "Novel Cancer Treatment Approaches",
    date_published: "2023-01-30",
  },
  {
    _id: "paper7",
    user_email: "user@example.com",
    title: "mRNA Vaccine Development",
    date_published: "2023-03-10",
  },
  {
    _id: "paper8",
    user_email: "user@example.com",
    title: "Neurological Disease Research",
    date_published: "2023-04-05",
  },
  {
    _id: "paper9",
    user_email: "user@example.com",
    title: "Genomic Sequencing Advancements",
    date_published: "2023-05-12",
  },
  {
    _id: "paper10",
    user_email: "user@example.com",
    title: "Climate Change Mitigation Strategies",
    date_published: "2023-02-20",
  },
  {
    _id: "paper11",
    user_email: "user@example.com",
    title: "Ocean Acidification Studies",
    date_published: "2023-04-15",
  },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(dummyCollections)
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Function to create a new collection
  const handleCreateCollection = (name: string, tags: string[]) => {
    const newCollection: Collection = {
      _id: `col${collections.length + 1}`,
      user_id: "user1",
      name,
      tags,
      papers: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setCollections([...collections, newCollection])
    setIsCreateDialogOpen(false)
  }

  // Function to rename a collection
  const handleRenameCollection = (id: string, newName: string) => {
    setCollections(
      collections.map((col) =>
        col._id === id ? { ...col, name: newName, updated_at: new Date().toISOString() } : col,
      ),
    )
    if (selectedCollection && selectedCollection._id === id) {
      setSelectedCollection({ ...selectedCollection, name: newName })
    }
  }

  // Function to delete a collection
  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter((col) => col._id !== id))
    if (selectedCollection && selectedCollection._id === id) {
      setSelectedCollection(null)
    }
  }

  // Function to add a tag to a collection
  const handleAddTag = (collectionId: string, tag: string) => {
    setCollections(
      collections.map((col) =>
        col._id === collectionId
          ? {
              ...col,
              tags: [...col.tags, tag],
              updated_at: new Date().toISOString(),
            }
          : col,
      ),
    )
    if (selectedCollection && selectedCollection._id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        tags: [...selectedCollection.tags, tag],
      })
    }
  }

  // Function to remove a tag from a collection
  const handleRemoveTag = (collectionId: string, tag: string) => {
    setCollections(
      collections.map((col) =>
        col._id === collectionId
          ? {
              ...col,
              tags: col.tags.filter((t) => t !== tag),
              updated_at: new Date().toISOString(),
            }
          : col,
      ),
    )
    if (selectedCollection && selectedCollection._id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        tags: selectedCollection.tags.filter((t) => t !== tag),
      })
    }
  }

  // Function to add a paper to a collection
  const handleAddPaper = (collectionId: string, paperId: string) => {
    setCollections(
      collections.map((col) =>
        col._id === collectionId
          ? {
              ...col,
              papers: [...col.papers, paperId],
              updated_at: new Date().toISOString(),
            }
          : col,
      ),
    )
    if (selectedCollection && selectedCollection._id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        papers: [...selectedCollection.papers, paperId],
      })
    }
  }

  // Function to remove a paper from a collection
  const handleRemovePaper = (collectionId: string, paperId: string) => {
    setCollections(
      collections.map((col) =>
        col._id === collectionId
          ? {
              ...col,
              papers: col.papers.filter((p) => p !== paperId),
              updated_at: new Date().toISOString(),
            }
          : col,
      ),
    )
    if (selectedCollection && selectedCollection._id === collectionId) {
      setSelectedCollection({
        ...selectedCollection,
        papers: selectedCollection.papers.filter((p) => p !== paperId),
      })
    }
  }

  // Function to get papers for a collection
  const getCollectionPapers = (collection: Collection) => {
    return dummyPapers.filter((paper) => collection.papers.includes(paper._id))
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
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

        <AnimatePresence mode="wait">
          {selectedCollection ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
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
                availablePapers={Object.values(dummyPapers)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CollectionGrid
                collections={collections}
                onSelect={setSelectedCollection}
                onRename={handleRenameCollection}
                onDelete={handleDeleteCollection}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <CreateCollectionDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreate={handleCreateCollection}
        />
      </div>
    </DashboardLayout>
  )
}

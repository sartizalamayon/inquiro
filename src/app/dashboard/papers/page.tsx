"use client"

import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"

import { usePapers } from "@/hooks/usePaper" 
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { FileText, Plus, Search, Clock, MoreHorizontal, Loader2 } from "lucide-react"

export default function PapersPage() {
  // Grab user email from NextAuth (no checks, just use it)
  const { data: session } = useSession()
  const userEmail = session?.user?.email || ""

  // Local state for search input
  const [searchValue, setSearchValue] = useState("")

  // File input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 1) Use the custom hook to fetch papers
  const {
    data: papers = [],
    isLoading: isFetching,
    isError,
    error,
    refetch,
  } = usePapers(userEmail, searchValue)

  // 2) Mutation for uploading PDFs
  const { mutate: uploadPdf, isLoading: isUploading } = useMutation({
    mutationFn: async (formData: FormData) => {
      // POST to your FastAPI endpoint
      const res = await fetch("http://localhost:8000/paper/extract-pdf", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        throw new Error("Upload failed")
      }
      return res.json()
    },
    onSuccess: () => {
      // Refetch papers to see the newly uploaded one
      refetch()
    },
    onError: (err) => {
      console.error("Error uploading file:", err)
    },
  })

  // 3) Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userEmail) return

    const formData = new FormData()
    formData.append("pdf", file)
    formData.append("email", userEmail)

    uploadPdf(formData)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // 4) Render the page
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Title & subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Research Papers</h1>
            <p className="text-muted-foreground">Upload, summarize, and manage your research papers</p>
          </div>
        </div>

        {/* Only a search input (no filters) */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search papers..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* Papers grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Upload New Paper Card */}
          <Card className="flex flex-col items-center justify-center border-dashed p-6 hover:border-primary/50 hover:bg-muted/50 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Upload New Paper</h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Upload a PDF to get an AI-generated summary
            </p>
            <Button
              className="mt-4"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                "Upload PDF"
              )}
            </Button>
            {/* If uploading, you can show a small spinner */}
            {isUploading && (
              <CardContent className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Summarizing...</span>
              </CardContent>
            )}
          </Card>

          {/* Handling states: loading, error, empty data, or normal list */}
          {isFetching && papers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-2 py-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading papers...</p>
            </div>
          ) : isError ? (
            <div className="col-span-full text-red-500">
              Error fetching papers: {(error as Error).message}
            </div>
          ) : papers.length === 0 ? (
            <div className="col-span-full text-sm text-muted-foreground py-2">
              No papers found. Try uploading one!
            </div>
          ) : (
            // Render the list of papers
            papers.map((paper: any, i: number) => {
              const authors =
                paper.authors?.map((a: any) => a.name).join(", ") || "No authors"
              const dateText = paper.created_at
                ? new Date(paper.created_at).toLocaleDateString()
                : "Unknown date"
              const tags = paper.metadata?.tags || []

              return (
                <Card
                  key={i}
                  className="flex flex-col h-full transition-all hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {paper.title || "Untitled Paper"}
                        </CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-1">
                      Authors: {authors}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.map((tag: string, j: number) => (
                        <Badge key={j} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {paper.summary?.research_problem || "No excerpt available."}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{dateText}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

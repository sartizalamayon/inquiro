"use client"

import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { usePapers } from "@/hooks/usePapers" 
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { 
  FileText, Plus, Search, Clock, MoreHorizontal, Loader2, 
  CheckCircle, AlertCircle, Trash2, FolderPlus, X, SlidersHorizontal
} from "lucide-react"
import { useRouter } from "next/navigation"

// Custom dialog component
const DeleteConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium">
            Delete Paper
          </h3>
          <p className="mt-2 text-muted-foreground">
            Are you sure you want to delete {title === "Processing Error" ? "this failed paper" : `"${title}"`}?
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 bg-muted/40 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

// Fields Manager component
const FieldsManager = ({ 
  fields, 
  setFields,
  isOpen,
  setIsOpen
}: { 
  fields: string[];
  setFields: React.Dispatch<React.SetStateAction<string[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newField, setNewField] = useState("")
  
  const handleAddField = () => {
    if (!newField.trim()) return
    
    setFields(prev => [...prev, newField.trim()])
    setNewField("")
  }
  
  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }
  
  if (!isOpen) return null;

  
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium">
            Custom Summary Fields
          </h3>
          
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Standard fields like Research Problem, Methodology, and Key Findings are included by default.
                  Add custom fields below that are important for your research.
                </p>
                
                <div className="p-3 bg-muted rounded-md mt-3 space-y-2">
                  <h4 className="text-sm font-medium">Standard fields included:</h4>
                  <div className="space-y-2 text-sm max-h-[180px] overflow-y-auto pr-2">
                    <div>
                      <span className="font-medium">Research Problem:</span> The core challenge or question the paper aims to address.
                    </div>
                    <div>
                      <span className="font-medium">Objective:</span> The specific goals and aims of the research.
                    </div>
                    <div>
                      <span className="font-medium">Key Findings:</span> The main results and discoveries reported in the paper.
                    </div>
                    <div>
                      <span className="font-medium">Methods:</span> The techniques, approaches, or methodologies used in the research.
                    </div>
                    <div>
                      <span className="font-medium">Numbers:</span> Key statistics, measurements, or numerical results from the paper.
                    </div>
                    <div>
                      <span className="font-medium">Dataset:</span> Information about the data used in the research.
                    </div>
                    <div>
                      <span className="font-medium">Baseline Comparisons:</span> How the research compares to existing approaches or baselines.
                    </div>
                    <div>
                      <span className="font-medium">Limitations:</span> Constraints, weaknesses, or boundaries of the research.
                    </div>
                    <div>
                      <span className="font-medium">Future Work:</span> Potential directions for continued research or development.
                    </div>
                    <div>
                      <span className="font-medium">Novelty Statement:</span> What makes this research new, unique, or innovative.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Add a custom field (e.g., Industry Impact)"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddField();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddField}>Add</Button>
              </div>
              
              {fields.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Your custom fields:</h3>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={index} className="flex items-center justify-between border rounded-md p-2">
                        <span>{field}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveField(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No custom fields added yet.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 bg-muted/40 border-t">
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

// Paper type definition
interface Author {
  name: string;
  affiliation: string;
  email: string;
}

interface PaperMetadata {
  doi: string;
  conference: string;
  tags: string[];
}

interface PaperSummary {
  research_problem: string;
  objective: string;
  key_findings: string;
  methods: string;
  numbers: string;
  dataset: string;
  baseline_comparisons: string;
  limitations: string;
  future_work: string;
  novelty_statement: string;
  user_given_fields: Array<{
    field_name: string;
    value: string;
  }>
}

interface Paper {
  _id: string;
  title: string;
  authors: Author[];
  date_published: string;
  metadata: PaperMetadata;
  summary: PaperSummary;
  references: string[];
  user_email: string;
  created_at: string;
}

export default function PapersPage() {
  const router = useRouter()
  // Grab user email from NextAuth (no checks, just use it)
  const { data: session } = useSession()
  const userEmail = session?.user?.email || ""

  // Local state for search input
  const [searchValue, setSearchValue] = useState("")
  
  // Add upload progress state
  const [uploadStage, setUploadStage] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [paperToDelete, setPaperToDelete] = useState<{paperId: string, title: string} | null>(null)

  // File input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Custom fields state
  const [customFields, setCustomFields] = useState<string[]>([])
  const [fieldsModalOpen, setFieldsModalOpen] = useState(false)

  // 1) Use the custom hook to fetch papers
  const {
    data: papers = [],
    isLoading: isFetching,
    isError,
    error,
    refetch,
  } = usePapers(userEmail, searchValue)

  // 2) Mutation for uploading PDFs
  const { mutate: uploadPdf } = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        setUploadStage("uploading")
        setUploadProgress(15)
        toast.info("Starting paper upload and processing")
        
        // Simulate progress during upload
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            // Progress to 75% during processing, final 25% when complete
            if (prev < 75) return prev + 3
            return prev
          })
        }, 1000)
        
        // POST to your FastAPI endpoint
        const res = await fetch("http://localhost:8000/paper/extract-pdf", {
          method: "POST",
          body: formData,
        })
        
        if (!res.ok) {
          clearInterval(progressInterval)
          setUploadStage("error")
          
          // Attempt to get the error message from the response
          let errorMessage = "Upload failed";
          try {
            const errorData = await res.json();
            if (errorData && errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch {
            // If we can't parse the error response as JSON, use status text
            errorMessage = res.statusText || "Server error occurred";
          }
          
          throw new Error(errorMessage);
        }
        
        setUploadStage("processing")
        const data = await res.json()
        
        // Complete the progress animation
        setUploadProgress(100)
        setUploadStage("completed")
        clearInterval(progressInterval)
        
        return data
      } catch (err) {
        setUploadStage("error")
        setUploadProgress(0)
        throw err
      }
    },
    onSuccess: () => {
      // Refetch papers to see the newly uploaded one
      toast.success("Paper processed successfully")
      setTimeout(() => {
        // Reset the upload state after a short delay
        setUploadStage("idle")
        setUploadProgress(0)
        // Reset the file input to allow uploading the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        refetch()
      }, 1500)
    },
    onError: (err) => {
      console.error("Error uploading file:", err)
      toast.error("Failed to process paper. Please try again.")
      setUploadStage("error")
      // Reset the file input to allow trying again with the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
  })

  // 3) Mutation for deleting papers
  const { mutate: deletePaper } = useMutation({
    mutationFn: async ({ paperId, email }: { paperId: string, email: string }) => {
      const res = await fetch(`http://localhost:8000/paper/${paperId}?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      })
      
      if (!res.ok) {
        throw new Error("Failed to delete paper")
      }
      
      return res.json()
    },
    onSuccess: () => {
      toast.success("Paper removed successfully")
      refetch()
    },
    onError: (err) => {
      console.error("Error deleting paper:", err)
      toast.error("Failed to remove paper")
    },
  })

  // 3) Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userEmail) return

    const formData = new FormData()
    formData.append("pdf", file)
    formData.append("email", userEmail)
    
    // Include custom fields in the request
    if (customFields.length > 0) {
      formData.append("fields", JSON.stringify(customFields))
    }

    uploadPdf(formData)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Get upload status content
  const getUploadStatusContent = () => {
    switch (uploadStage) {
      case "uploading":
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Uploading paper...</span>
          </>
        )
      case "processing":
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Analyzing content...</span>
          </>
        )
      case "completed":
        return (
          <>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span>Processing complete!</span>
          </>
        )
      case "error":
        return (
          <>
            <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
            <span>Processing failed</span>
          </>
        )
      default:
        return "Upload PDF"
    }
  }

  // 4) Render the page
  return (
    <DashboardLayout>
      {/* Fields manager modal */}
      <FieldsManager
        fields={customFields}
        setFields={setCustomFields}
        isOpen={fieldsModalOpen}
        setIsOpen={setFieldsModalOpen}
      />
      
      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (paperToDelete) {
            deletePaper({
              paperId: paperToDelete.paperId,
              email: userEmail
            });
            setDeleteDialogOpen(false);
            setPaperToDelete(null);
          }
        }}
        title={paperToDelete?.title || ""}
      />
      
      <div className="flex flex-col gap-6">
        {/* Title & subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Research Papers</h1>
            <p className="text-muted-foreground">Upload, summarize, and manage your research papers</p>
          </div>
        </div>

        {/* Search and Fields controls in a single row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          
          <Button 
            variant="outline" 
            onClick={() => setFieldsModalOpen(true)}
            className="self-start sm:self-auto"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <span className="text-primary font-medium">Fields</span>
          </Button>
        </div>

        {/* Papers grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Upload New Paper Card */}
          <Card className="flex flex-col min-h-[250px] items-center justify-center border-dashed p-6 hover:border-primary/50 hover:bg-muted/50 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-center">Upload New Paper</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Upload a PDF to get an AI-generated summary
            </p>
            
            {/* Processing status */}
            {uploadStage !== "idle" && (
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>{uploadStage === "uploading" ? "Uploading..." : "Processing..."}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}
            
            <Button
              className="mt-6"
              onClick={handleUploadClick}
              disabled={uploadStage !== "idle" && uploadStage !== "error"}
            >
              <div className="flex items-center gap-2">
                {getUploadStatusContent()}
              </div>
            </Button>
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
            papers.map((paper: Paper, i: number) => {
              const authors =
                paper.authors?.map((a: Author) => a.name).join(", ") || "No authors"
              const dateText = paper.created_at
                ? new Date(paper.created_at).toLocaleDateString()
                : "Unknown date"
              const tags = paper.metadata?.tags || []
              
              // Check if this is an error paper
              const isErrorPaper = paper.title === "Error Processing Document" || 
                                  paper.title === "Processing Error" ||
                                  paper.title === "Parsing Error - Please try again"
              
              return (
                <Card
                  key={i}
                  className={`flex flex-col min-h-[250px] transition-all hover:shadow-md ${isErrorPaper ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30' : ''}`}
                >
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 w-full overflow-hidden">
                        <div className="flex-shrink-0 mt-1">
                          {isErrorPaper ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <CardTitle className={`text-base font-semibold line-clamp-2 break-words ${isErrorPaper ? 'text-red-600 dark:text-red-400' : ''}`}>
                            {isErrorPaper ? "Processing Error" : (paper.title || "Untitled Paper")}
                          </CardTitle>
                          <CardDescription className="line-clamp-1 mt-1 text-sm">
                            {isErrorPaper ? "Error occurred during processing" : `Authors: ${authors}`}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 mt-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem 
                              disabled={isErrorPaper}
                              onClick={() => toast.info("Add to collection feature coming soon")}>
                              <FolderPlus className="mr-2 h-4 w-4" />
                              <span>Add to Collection</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              variant="destructive"
                              onClick={() => {
                                setPaperToDelete({
                                  paperId: paper._id,
                                  title: paper.title
                                });
                                setDeleteDialogOpen(true);
                              }}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {isErrorPaper ? (
                        <Badge variant="destructive" className="text-xs">Failed</Badge>
                      ) : (
                        tags.slice(0, 2).map((tag: string, j: number) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      )}
                      {!isErrorPaper && tags.length > 2 && (
                        <Badge variant="outline" className="text-xs font-normal">
                          +{tags.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 flex-1">
                    <p className={`text-sm ${isErrorPaper ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                      {isErrorPaper 
                        ? (paper.summary?.research_problem || "An error occurred while processing this document. Please try again with a different document.") 
                        : (paper.summary?.research_problem || "No excerpt available.")}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{dateText}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        if (isErrorPaper) {
                          setPaperToDelete({
                            paperId: paper._id,
                            title: "Processing Error"
                          });
                          setDeleteDialogOpen(true);
                        } else {
                          router.push(`/dashboard/paper/${paper._id}`)
                        }
                      }}
                    >
                      {isErrorPaper ? "Remove" : "View"}
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

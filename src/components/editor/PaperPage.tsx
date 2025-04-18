// app/paper/[paper_id]/PaperPage.tsx
"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { usePaper } from "@/hooks/usePaper";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye, Bookmark, Sun, Moon, User, Save } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import SectionEditor from "./SectionEditor";
import Image from "next/image";
// Type definition for a paper object
interface Author {
  name: string;
  affiliation: string;
  email: string;
}

interface Metadata {
  doi: string;
  conference: string;
  tags: string[];
}

interface UserGivenField {
  field_name: string;
  value: string;
}

interface Summary {
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
  user_given_fields: UserGivenField[];
}

// Note interface
interface Note {
  sectionId: string;
  content: string;
}

const PaperPage = ({ paperId }: { paperId: string }) => {
  const { data: paper, isLoading, isError, refetch } = usePaper(paperId);
  const [isEditMode, setIsEditMode] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [updatedContent, setUpdatedContent] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  // Handle section content update
  const handleContentUpdate = useCallback((sectionId: string, content: string) => {
    setUpdatedContent(prev => ({
      ...prev,
      [sectionId]: content
    }));
  }, []);

  // Save all changes to backend
  const saveChanges = useCallback(async () => {
    if (Object.keys(updatedContent).length === 0) return;
    
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      
      // The backend now handles both formats, so we can send it wrapped
      const response = await fetch(`http://localhost:8000/paper/${paperId}/update`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sections: updatedContent }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(`Failed to save changes: ${response.status}`);
      }
      
      // Clear the updatedContent after successful save
      setUpdatedContent({});
      setSaveSuccess(true);
      
      // Refetch the paper data to get the latest version
      await refetch();
      
      // Show success message temporarily
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  }, [updatedContent, paperId, refetch]);

  // Toggle edit mode and save changes if needed
  const toggleEditMode = useCallback(async () => {
    if (isEditMode && Object.keys(updatedContent).length > 0) {
      // Save changes when switching from edit to view mode
      await saveChanges();
    }
    setIsEditMode(prev => !prev);
  }, [isEditMode, updatedContent, saveChanges]);

  // Create a function to handle adding or updating a note
  const saveNote = useCallback(() => {
    if (!activeNote || !noteContent.trim()) return;

    setNotes((prev) => {
      const existingNoteIndex = prev.findIndex((note) => note.sectionId === activeNote);
      if (existingNoteIndex >= 0) {
        const newNotes = [...prev];
        newNotes[existingNoteIndex] = { ...newNotes[existingNoteIndex], content: noteContent };
        return newNotes;
      }
      return [...prev, { sectionId: activeNote, content: noteContent }];
    });

    // Reset the active note and content
    setActiveNote(null);
    setNoteContent("");
  }, [activeNote, noteContent]);

  // Handle section selection for note
  const selectSectionForNote = useCallback((sectionId: string) => {
    setActiveNote(sectionId);
    const existingNote = notes.find((note) => note.sectionId === sectionId);
    setNoteContent(existingNote?.content || "");
  }, [notes]);

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Generate section list for navigation
  const sectionsList = useMemo(() => {
    if (!paper) return [];

    const sections = [
      { id: "metadata", label: "Metadata" },
      ...Object.keys(paper.summary || {}).filter(key => key !== "user_given_fields").map(key => ({
        id: key,
        label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      }))
    ];

    // Add user given fields if they exist
    if (paper.summary?.user_given_fields?.length > 0) {
      paper.summary.user_given_fields.forEach((field: UserGivenField) => {
        sections.push({
          id: `user_field_${field.field_name}`,
          label: field.field_name
        });
      });
    }

    // Add references if they exist
    if (paper.references?.length > 0) {
      sections.push({ id: "references", label: "References" });
    }

    return sections;
  }, [paper]);

  // Check if a section has a note
  const hasNote = useCallback((sectionId: string) => {
    return notes.some(note => note.sectionId === sectionId);
  }, [notes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading paper...</div>
      </div>
    );
  }

  if (isError || !paper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg">Error loading paper</div>
        <Button asChild><Link href="/dashboard">Go Back</Link></Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold truncate hidden md:block max-w-[300px] sm:max-w-[500px] lg:max-w-[800px]">
              {paper.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditMode && Object.keys(updatedContent).length > 0 && (
              <Button 
                variant="default" 
                size="sm"
                onClick={saveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
            
            {saveSuccess && (
              <span className="text-sm text-green-600 dark:text-green-500 animate-fade-in-out">
                Changes saved!
              </span>
            )}
            
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant={isEditMode ? "secondary" : "outline"} 
              size="sm"
              onClick={toggleEditMode}
              disabled={isSaving}
            >
              {isEditMode ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Avatar>
              <div className="Avatar-image">
                <img src={session?.user?.image || undefined} alt="User" className="rounded-full w-8 h-8"/>
                
              </div>
              
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebars */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside className="hidden md:block w-64 border-r p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4">Sections</h2>
          <div className="space-y-1">
            {sectionsList.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
                {hasNote(section.id) && (
                  <Badge variant="secondary" className="ml-auto">Note</Badge>
                )}
              </Button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="container py-6 px-4 max-w-4xl mx-auto space-y-8">
              {/* Metadata Section */}
              <section 
                ref={(el) => { sectionRefs.current['metadata'] = el; }}
                id="metadata"
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold tracking-tight">Metadata</h2>
                <Card className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{paper.title}</h3>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {paper.date_published && (
                        <div>Published: {new Date(paper.date_published).toLocaleDateString()}</div>
                      )}
                      {paper.metadata.doi && <div>DOI: {paper.metadata.doi}</div>}
                      {paper.metadata.conference && <div>Conference: {paper.metadata.conference}</div>}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Authors</h4>
                    <div className="space-y-2">
                      {paper.authors.map((author: Author, index: number) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{author.name}</div>
                          {author.affiliation && (
                            <div className="text-muted-foreground">{author.affiliation}</div>
                          )}
                          {author.email && (
                            <div className="text-muted-foreground">{author.email}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {paper.metadata.tags && paper.metadata.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {paper.metadata.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </section>
              
              {/* Summary Sections */}
              {Object.entries(paper.summary || {})
                .filter(([key]) => key !== 'user_given_fields')
                .map(([key, value]) => (
                  <section 
                    key={key}
                    id={key}
                    ref={(el) => { sectionRefs.current[key] = el; }}
                    className="space-y-4"
                  >
                    <h2 className="text-2xl font-bold tracking-tight capitalize">
                      {key.split('_').join(' ')}
                    </h2>
                    <Card className="p-6">
                      <SectionEditor
                        content={value as string}
                        isEditable={isEditMode}
                        sectionId={key}
                        onUpdate={(content) => handleContentUpdate(key, content)}
                      />
                    </Card>
                  </section>
                ))
              }
              
              {/* User given fields */}
              {paper.summary?.user_given_fields?.map((field: UserGivenField) => (
                <section 
                  key={`user_field_${field.field_name}`}
                  id={`user_field_${field.field_name}`}
                  ref={(el) => { sectionRefs.current[`user_field_${field.field_name}`] = el; }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold tracking-tight capitalize">
                    {field.field_name}
                  </h2>
                  <Card className="p-6">
                    <SectionEditor
                      content={field.value}
                      isEditable={isEditMode}
                      sectionId={`user_field_${field.field_name}`}
                      onUpdate={(content) => handleContentUpdate(`user_field_${field.field_name}`, content)}
                    />
                  </Card>
                </section>
              ))}
              
              {/* References */}
              {paper.references && paper.references.length > 0 && (
                <section 
                  id="references"
                  ref={(el) => { sectionRefs.current['references'] = el; }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold tracking-tight">References</h2>
                  <Card className="p-6">
                    <ul className="space-y-2 list-decimal pl-5">
                      {paper.references.map((reference, index) => (
                        <li key={index} className="text-sm">{reference}</li>
                      ))}
                    </ul>
                  </Card>
                </section>
              )}
            </div>
          </ScrollArea>
        </main>

        {/* Right Sidebar - Notes */}
        <aside className="hidden lg:block w-72 border-l p-4">
          <h2 className="font-semibold mb-4">Notes</h2>
          
          {activeNote ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium capitalize">
                {sectionsList.find(s => s.id === activeNote)?.label || activeNote}
              </h3>
              <textarea
                className="w-full min-h-[200px] p-2 text-sm rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add your notes here..."
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setActiveNote(null);
                  setNoteContent("");
                }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={saveNote}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <Card key={note.sectionId} className="p-3">
                    <h3 className="text-sm font-medium capitalize mb-1">
                      {sectionsList.find(s => s.id === note.sectionId)?.label || note.sectionId}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">{note.content.substring(0, 100)}...</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs"
                      onClick={() => selectSectionForNote(note.sectionId)}
                    >
                      Edit
                    </Button>
                  </Card>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No notes yet. Select a section to add notes.
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Add a note</h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {sectionsList.map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => selectSectionForNote(section.id)}
                    >
                      {section.label}
                      {hasNote(section.id) && (
                        <Badge variant="secondary" className="ml-auto text-xs">Note</Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PaperPage;

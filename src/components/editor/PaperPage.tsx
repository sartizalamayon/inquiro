// app/paper/[paper_id]/PaperPage.tsx
"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { usePaper } from "@/hooks/usePaper";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Eye, Bookmark, Sun, Moon, Save, Wifi, WifiOff, AlertCircle, Trash2, PlusCircle, StickyNote } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import SectionEditor from "./SectionEditor";
import useWebSocketEditor from "@/hooks/useWebSocketEditor";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Type definition for a user given field
interface UserGivenField {
  field_name: string;
  value: string;
}

// Note interface
interface Note {
  _id?: string;
  paper_id: string;
  user_email: string;
  section_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

const PaperPage = ({ paperId }: { paperId: string }) => {
  const { data: paper, isLoading, isError, refetch } = usePaper(paperId);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [updatedContent, setUpdatedContent] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const lastUpdateRef = useRef<Record<string, number>>({});
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  // Reference to control the popover for mobile
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);

  // Use the custom hook for notes
  const { 
    data: notes = [], 
    isLoading: isLoadingNotes 
  } = useNotes(paperId, session?.user?.email || undefined);

  // WebSocket integration
  const { connected, sendUpdate, error: wsError } = useWebSocketEditor({
    paperId,
    onExternalUpdate: (sectionId: string) => {
      const now = Date.now();
      const lastUpdate = lastUpdateRef.current[sectionId] || 0;
      
      if (now - lastUpdate > 2000) {
        lastUpdateRef.current[sectionId] = now;
        refetch().catch(err => console.error('Error refetching paper:', err));
      }
    }
  });

  // Handle WebSocket errors
  useEffect(() => {
    if (wsError) {
      toast.error(wsError);
    }
  }, [wsError]);

  // Handle section content update
  const handleContentUpdate = useCallback((sectionId: string, content: string) => {
    try {
      if (connected && isEditMode) {
        sendUpdate(sectionId, content);
        lastUpdateRef.current[sectionId] = Date.now();
      } else {
        setUpdatedContent(prev => ({ ...prev, [sectionId]: content }));
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content.');
    }
  }, [connected, sendUpdate, isEditMode]);

  // Save content changes
  const saveChanges = useCallback(async () => {
    if (Object.keys(updatedContent).length === 0) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch(`http://localhost:8000/paper/${paperId}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: updatedContent }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to save changes: ${errorData.detail || response.status}`);
      }
      setUpdatedContent({});
      setSaveSuccess(true);
      toast.success('Changes saved successfully!');
      await refetch();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: unknown) {
      console.error('Error saving changes:', error);
      const message = error instanceof Error ? error.message : 'Failed to save changes';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [updatedContent, paperId, refetch]);

  // Toggle edit mode
  const toggleEditMode = useCallback(async () => {
    if (isEditMode && Object.keys(updatedContent).length > 0) {
      await saveChanges();
    }
    if (isEditMode) {
      await refetch(); // Ensure latest data after saving/switching mode
    }
    setIsEditMode(prev => !prev);
  }, [isEditMode, updatedContent, saveChanges, refetch]);

  // Check if a section has a note
  const hasNote = useCallback((sectionId: string) => {
    return notes.some((note: Note) => note.section_id === sectionId);
  }, [notes]);

  // Set the active note section for adding/editing
  const handleNoteSelection = useCallback((sectionId: string) => {
    const existingNote = notes.find((note: Note) => note.section_id === sectionId);
    setActiveNote(sectionId);
    setNoteContent(existingNote ? existingNote.content : "");
    
    // For small screens, open the popover when adding a note
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        popoverTriggerRef.current?.click();
      }, 0);
    }
  }, [notes]);

  // --- Note Mutations --- 
  const createNoteMutation = useMutation({
    mutationFn: async (newNote: Omit<Note, '_id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch('http://localhost:8000/notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      if (!response.ok) throw new Error('Failed to create note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', paperId] });
      toast.success('Note created');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to create note';
      toast.error(message);
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ noteId, content }: { noteId: string; content: string }) => {
      const response = await fetch(`http://localhost:8000/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to update note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', paperId] });
      toast.success('Note updated');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to update note';
      toast.error(message);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await fetch(`http://localhost:8000/notes/${noteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete note');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', paperId] });
      toast.success('Note deleted');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete note';
      toast.error(message);
    },
  });

  // Save or Update Note Action
  const saveNote = useCallback(() => {
    if (!activeNote || !noteContent.trim() || !session?.user?.email) return;
    
    const existingNote = notes.find((note: Note) => note.section_id === activeNote);
    
    if (existingNote && existingNote._id) {
      updateNoteMutation.mutate({ noteId: existingNote._id, content: noteContent });
    } else {
      createNoteMutation.mutate({
        paper_id: paperId,
        user_email: session.user.email,
        section_id: activeNote,
        content: noteContent,
      });
    }
    setActiveNote(null);
    setNoteContent("");
  }, [activeNote, noteContent, notes, paperId, session?.user?.email, createNoteMutation, updateNoteMutation]);

  // Delete Note Action
  const deleteNote = useCallback((noteId: string) => {
    deleteNoteMutation.mutate(noteId);
  }, [deleteNoteMutation]);

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
      })),
      ...(paper.summary?.user_given_fields?.map((field: UserGivenField) => ({
          id: `user_field_${field.field_name}`,
          label: field.field_name
      })) || []),
    ];
    if (paper.image_urls?.length > 0) sections.push({ id: "images", label: "Images" });
    if (paper.references?.length > 0) sections.push({ id: "references", label: "References" });
    return sections;
  }, [paper]);

  // --- Render Helper Components --- 
  const renderWebSocketStatus = () => (
    <div className={`flex items-center text-xs ${connected ? 'text-green-600 dark:text-green-500' : 'text-amber-600 dark:text-amber-500 animate-pulse'}`}>
      {connected ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
      <span>{connected ? 'Live' : 'Offline'}</span>
        </div>
      );

  const renderWebSocketError = () => wsError ? (
      <div className="flex items-center text-red-600 dark:text-red-500 text-xs">
        <AlertCircle className="h-4 w-4 mr-1" />
        <span className="truncate max-w-[200px]">{wsError}</span>
      </div>
  ) : null;

  // Render the notes content (used in both sidebar and popover)
  const renderNotesContent = () => (
    <div className="space-y-4">
      {activeNote ? (
        <div className="space-y-3">
          <Textarea
            className="w-full h-40 text-sm resize-none dark:bg-gray-800 dark:border-gray-700"
            placeholder="Add your notes here..."
            value={noteContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={saveNote} disabled={createNoteMutation.isPending || updateNoteMutation.isPending}>
              {(createNoteMutation.isPending || updateNoteMutation.isPending) ? 'Saving...' : 'Save'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setActiveNote(null); setNoteContent(""); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="text-sm">
          {isLoadingNotes ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-5 w-5 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
              <span>Loading notes...</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-muted-foreground border rounded-md p-4 text-center">
              <p>No notes yet.</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => handleNoteSelection("metadata")}>
                  <PlusCircle className="h-3 w-3 mr-1" /> Add your first note
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)] md:h-auto md:max-h-[calc(100vh-150px)]">
              <div className="space-y-3 pb-4 pr-2">
                {notes.map((note: Note) => {
                  const sectionName = sectionsList.find(s => s.id === note.section_id)?.label;
    return (
                    <Card key={note._id} className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-sm truncate max-w-[150px]">{sectionName || note.section_id}</h5>
                        <div className="flex space-x-2 ml-2 shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 flex items-center" 
                            onClick={() => handleNoteSelection(note.section_id)}
                          >
                            <Edit className="h-3 w-3 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 flex items-center text-destructive hover:bg-destructive/10" 
                            onClick={() => note._id && deleteNote(note._id)} 
                            disabled={deleteNoteMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs mb-2 whitespace-pre-wrap">{note.content}</p>
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => scrollToSection(note.section_id)}>
                        Go to section
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
      </div>
    );

  // --- Loading / Error States --- 
  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading paper...</div>;
  if (isError || !paper) return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div>Error loading paper</div>
        <Button asChild><Link href="/dashboard">Go Back</Link></Button>
      </div>
    );

  // --- Main Render --- 
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14 px-4">
          {/* Left Header */} 
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
          {/* Right Header */} 
          <div className="flex items-center gap-2">
            {isEditMode && renderWebSocketStatus()}
            {renderWebSocketError()}
            
            {/* Mobile Notes Button/Popover */} 
            <div className="lg:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    ref={popoverTriggerRef}
                    variant="outline" 
                    size="icon"
                  >
                    <StickyNote className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 mr-4 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Notes</h3>
                    {notes.length > 0 && (
                      <Badge variant="secondary">{notes.length}</Badge>
                    )}
                  </div>
                  {renderNotesContent()} 
                </PopoverContent>
              </Popover>
            </div>
            
            {isEditMode && !connected && Object.keys(updatedContent).length > 0 && (
              <Button variant="default" size="sm" onClick={saveChanges} disabled={isSaving}>
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <><Save className="h-4 w-4 mr-2" /> Save Changes</>
                )}
              </Button>
            )}
            
            {saveSuccess && (
              <span className="text-sm text-green-600 dark:text-green-500 animate-fade-in-out">Saved!</span>
            )}
            
            {!isEditMode && (
              <Button variant="outline" size="sm" onClick={() => console.log("Save to collection")}>
                <Bookmark className="h-4 w-4 mr-2" /> Save to collection
            </Button>
            )}
            <Button variant={isEditMode ? "secondary" : "outline"} size="sm" onClick={toggleEditMode} disabled={isSaving}>
              {isEditMode ? (<><Eye className="h-4 w-4 mr-2" /> View</>) : (<><Edit className="h-4 w-4 mr-2" /> Edit</>)}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {session?.user && (
              <Avatar className="h-8 w-8">
                <img src={session.user.image || "https://github.com/shadcn.png"} alt={session.user.name || "User"} />
              </Avatar>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */} 
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <aside className="hidden md:block w-64 border-r p-4 overflow-auto fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-background">
          <nav>
            <ul className="space-y-1">
              {sectionsList.map((section) => (
                <li key={section.id}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto py-2 ${hasNote(section.id) ? "font-semibold" : ""}`}
                    onClick={() => scrollToSection(section.id)}
                  >
                    {section.label}
                    {hasNote(section.id) && (
                      <Badge variant="outline" className="ml-auto">Note</Badge>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */} 
        <main className="flex-1 overflow-auto md:ml-64 lg:mr-72">
            <div className="container px-4 py-6 max-w-4xl mx-auto space-y-8">
              {/* Metadata section */}
            <section id="metadata" ref={(el) => { sectionRefs.current['metadata'] = el; }} className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight flex items-center">
                Metadata
                <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleNoteSelection("metadata")}>
                  <PlusCircle className="h-3 w-3 mr-1" /> Add Note
                </Button>
              </h2>
                <Card className="p-6">
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{paper.title}</h1>
                    <div className="space-y-1">
                      {paper.authors.map((author: { name: string, affiliation: string, email: string }, index: number) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{author.name}</div>
                          <div className="text-muted-foreground">{author.affiliation}</div>
                          {author.email && <div className="text-muted-foreground">{author.email}</div>}
                        </div>
                      ))}
                    </div>
                  {paper.metadata?.tags?.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {paper.metadata.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </section>
              
              {/* Summary Sections */}
              {Object.entries(paper?.summary || {})
                .filter(([key]) => key !== 'user_given_fields')
                .map(([key, value]) => (
                <section key={key} id={key} ref={(el) => { sectionRefs.current[key] = el; }} className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight capitalize flex items-center">
                      {key.split('_').join(' ')}
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleNoteSelection(key)}>
                      <PlusCircle className="h-3 w-3 mr-1" /> Add Note
                    </Button>
                    </h2>
                    <Card className="p-6">
                      <SectionEditor
                        content={value as string}
                        isEditable={isEditMode}
                        sectionId={key}
                        onUpdate={(content) => handleContentUpdate(key, content)}
                      immediateUpdate={connected} 
                      />
                    </Card>
                  </section>
              ))}
              
              {/* User given fields */}
              {paper.summary?.user_given_fields?.map((field: UserGivenField) => (
              <section key={`user_field_${field.field_name}`} id={`user_field_${field.field_name}`} ref={(el) => { sectionRefs.current[`user_field_${field.field_name}`] = el; }} className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight capitalize flex items-center">
                    {field.field_name}
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleNoteSelection(`user_field_${field.field_name}`)}>
                    <PlusCircle className="h-3 w-3 mr-1" /> Add Note
                  </Button>
                  </h2>
                  <Card className="p-6">
                    <SectionEditor
                      content={field.value}
                      isEditable={isEditMode}
                      sectionId={`user_field_${field.field_name}`}
                      onUpdate={(content) => handleContentUpdate(`user_field_${field.field_name}`, content)}
                    immediateUpdate={connected} 
                    />
                  </Card>
                </section>
              ))}
              
              {/* Images section */}
            {paper.image_urls?.length > 0 && (
              <section id="images" ref={(el) => { sectionRefs.current['images'] = el; }} className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight flex items-center">
                  Images
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleNoteSelection("images")}>
                    <PlusCircle className="h-3 w-3 mr-1" /> Add Note
                  </Button>
                </h2>
                    <Card className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paper.image_urls.map((image: string, index: number) => (
                      <img key={index} src={image} alt={`Paper Image ${index + 1}`} className="w-full h-auto rounded-md" />
                        ))}
                      </div>
                    </Card>
                  </section>
            )}
              
              {/* References section */}
            {paper.references?.length > 0 && (
              <section id="references" ref={(el) => { sectionRefs.current['references'] = el; }} className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight flex items-center">
                  References
                  <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleNoteSelection("references")}>
                    <PlusCircle className="h-3 w-3 mr-1" /> Add Note
                  </Button>
                </h2>
                  <Card className="p-6">
                    <ul className="space-y-2 list-decimal pl-5">
                      {paper.references.map((reference: string, index: number) => (
                        <li key={index} className="text-sm">{reference}</li>
                      ))}
                    </ul>
                  </Card>
                </section>
              )}
            </div>
        </main>

        {/* Right Sidebar - Notes (Desktop Only) */} 
        <aside className="hidden lg:block w-72 border-l p-4 overflow-auto fixed top-14 right-0 h-[calc(100vh-3.5rem)] bg-background">
           <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Notes</h3>
                {notes.length > 0 && (
                <Badge variant="secondary">{notes.length}</Badge>
                )}
              </div>
          {renderNotesContent()} 
        </aside>
      </div>
    </div>
  );
};

export default PaperPage;

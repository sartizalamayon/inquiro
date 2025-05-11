'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Bold, Italic, List, ListOrdered, Code, Strikethrough, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Parse HTML content safely
const parseInnerHTML = (html: string) => {
  try {
    return html || '<p>Nothing about this section is found.</p>'
  } catch (e) {
    console.error('Error parsing HTML:', e)
    return '<p>Error displaying content</p>'
  }
}

interface SectionEditorProps {
  content: string
  isEditable: boolean
  sectionId: string
  onUpdate?: (content: string) => void
  immediateUpdate?: boolean // If true, trigger onUpdate immediately for formats/blur
}

export function SectionEditor({
  content,
  isEditable,
  sectionId,
  onUpdate,
  immediateUpdate = false
}: SectionEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [initialContent] = useState(() => parseInnerHTML(content || ''));
  // Remove currentContent state, rely on editor.getHTML()
  const lastSavedContentRef = useRef(initialContent);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save function for typing
  const debouncedSave = useCallback((editorInstance: Editor) => {
    if (!onUpdate) return;
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    const html = editorInstance.getHTML();
    
    updateTimeoutRef.current = setTimeout(() => {
      if (html !== lastSavedContentRef.current) {
        onUpdate(html);
        lastSavedContentRef.current = html;
      }
    }, 1000); // Standard 1-second debounce for typing
  }, [onUpdate]);

  // Immediate save function for formatting actions or blur
  const immediateSave = useCallback((editorInstance: Editor) => {
    if (!onUpdate) return;
    // Clear any pending debounced save
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    const html = editorInstance.getHTML();
    if (html !== lastSavedContentRef.current) {
      onUpdate(html);
      lastSavedContentRef.current = html;
    }
  }, [onUpdate]);

  // Create custom link extension
  const CustomLink = Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-500 underline cursor-pointer',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
  })
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomLink,
    ],
    content: initialContent,
    editable: isEditable,
    editorProps: {
      attributes: {
        class: 'min-h-[150px] prose max-w-none dark:prose-invert focus:outline-none' // Added dark:prose-invert
      }
    },
    onFocus: () => setIsFocused(true),
    onBlur: ({ editor: editorInstance }) => {
      setIsFocused(false);
      // Use immediate save on blur if needed, otherwise rely on debounce
      if (immediateUpdate && editorInstance) {
        immediateSave(editorInstance);
      }
    },
    onUpdate: ({ editor: editorInstance }) => {
      if (!editorInstance) return;
      // Use debounced save for continuous typing
      debouncedSave(editorInstance);
    },
    onCreate: ({ editor: editorInstance }) => {
      if (editorInstance) {
        lastSavedContentRef.current = editorInstance.getHTML();
      }
    },
    immediatelyRender: false,
  });
  
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [editor, isEditable]);

  // Update content when it changes from props
  useEffect(() => {
    if (editor && content && !isFocused) {
      const parsedContent = parseInnerHTML(content);
      const editorContent = editor.getHTML();
      
      // Only update if the external content is different from the editor's current content
      if (parsedContent !== editorContent) {
        // Use setContent to avoid triggering the onUpdate handler unnecessarily
        editor.commands.setContent(parsedContent, false);
        // Update the last saved ref to prevent immediate saving of external content
        lastSavedContentRef.current = parsedContent;
      }
    }
  // Depend on content and editor only. isFocused check happens inside.
  }, [content, editor]); 

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Function to apply formatting and trigger immediate save if necessary
  const applyFormat = useCallback((command: () => void) => {
    if (!editor) return;
    command();
    // If immediateUpdate is true, save changes right away
    if (immediateUpdate) {
      immediateSave(editor);
    }
    // Ensure editor remains focused after button click
    editor.commands.focus(); 
  }, [editor, immediateUpdate, immediateSave]);

  // Add link function
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      editor.commands.focus();
      return;
    }

    const commandToRun = () => {
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        let processedUrl = url.trim();
        if (!/^https?:\/\//i.test(processedUrl)) {
          processedUrl = 'https://' + processedUrl;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: processedUrl }).run();
      }
    };
    
    applyFormat(commandToRun);

  }, [editor, applyFormat]);

  // Note: No need for formatCommands wrapper anymore if applyFormat handles it

  if (!isEditable) {
    return (
      <div 
        className="prose prose-sm md:prose-base max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: parseInnerHTML(content) }}
        data-section-id={sectionId}
      />
    );
  }

  if (!editor) {
    return <div>Loading editor...</div>; // Or some placeholder
  }

  return (
    <div className="border-none" data-section-id={sectionId}>
      {isEditable && (
        <div className="flex flex-wrap items-center gap-1 mb-2 p-1 border rounded-md bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat(() => editor.chain().focus().toggleBold().run())}
            className={`tiptap-toolbar-button ${editor.isActive('bold') ? 'bg-muted' : ''}`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat(() => editor.chain().focus().toggleItalic().run())}
            className={`tiptap-toolbar-button ${editor.isActive('italic') ? 'bg-muted' : ''}`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat(() => editor.chain().focus().toggleStrike().run())}
            className={`tiptap-toolbar-button ${editor.isActive('strike') ? 'bg-muted' : ''}`}
            title="Strike-through"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            // Use the refactored setLink which calls applyFormat internally
            onClick={setLink} 
            className={`tiptap-toolbar-button ${editor.isActive('link') ? 'bg-muted' : ''}`}
            title="Add link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat(() => editor.chain().focus().toggleBulletList().run())}
            className={`tiptap-toolbar-button ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
            title="Bullet list"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat(() => editor.chain().focus().toggleOrderedList().run())}
            className={`tiptap-toolbar-button ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
            title="Ordered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat(() => editor.chain().focus().toggleCodeBlock().run())}
            className={`tiptap-toolbar-button ${editor.isActive('codeBlock') ? 'bg-muted' : ''}`}
            title="Code block"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div 
        className={`border rounded-md ${isFocused ? 'ring-2 ring-primary/50' : ''}`}
        // Remove onClick focus, it might interfere
      >
        <EditorContent 
          editor={editor} 
          className="p-2 prose-pre:whitespace-pre-wrap prose-pre:break-words"
        />
      </div>
    </div>
  );
}

export default SectionEditor 
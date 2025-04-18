'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Bold, Italic, List, ListOrdered, Code, Strikethrough, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SectionEditorProps {
  content: string
  isEditable: boolean
  onUpdate?: (content: string) => void
}

// Parse HTML content safely
const parseHTML = (html: string) => {
  try {
    return html || '<p></p>'
  } catch (e) {
    console.error('Error parsing HTML:', e)
    return '<p>Error displaying content</p>'
  }
}

const SectionEditor = ({ content, isEditable, onUpdate }: SectionEditorProps) => {
  const editorRef = useRef<Editor | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [initialContent] = useState(() => parseHTML(content))
  const [debouncedUpdate, setDebouncedUpdate] = useState<NodeJS.Timeout | null>(null)
  
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
      StarterKit.configure({
        heading: {
          levels: [3, 4] // Only allow h3 and h4
        },
      }),
      CustomLink
    ],
    content: initialContent,
    editable: isEditable,
    onUpdate: ({ editor }) => {
      // Debounce the update to prevent too many saves
      if (debouncedUpdate) clearTimeout(debouncedUpdate)
      const timeout = setTimeout(() => {
        const html = editor.getHTML()
        onUpdate?.(html)
      }, 500) // Wait 500ms before updating
      setDebouncedUpdate(timeout)
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[100px] prose prose-sm md:prose-base max-w-none dark:prose-invert p-2 rounded-md prose-pre:whitespace-pre-wrap prose-pre:break-words',
        spellcheck: 'true',
      }
    }
  })
  
  // Store the editor reference
  useEffect(() => {
    if (editor) {
      editorRef.current = editor
    }
    
    // Clean up debounce on unmount
    return () => {
      if (debouncedUpdate) clearTimeout(debouncedUpdate)
    }
  }, [editor, debouncedUpdate])

  // Handle changes to editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable)
      // No auto-focus anymore
    }
  }, [editor, isEditable])

  // Update content when it changes from props (but only when not focused to avoid conflicts)
  useEffect(() => {
    if (editor && content && !isFocused) {
      const currentContent = editor.getHTML()
      const parsedContent = parseHTML(content)
      
      // Only update if content is different to avoid cursor position loss
      if (parsedContent !== currentContent) {
        editor.commands.setContent(parsedContent, false)
      }
    }
  }, [content, editor, isFocused])

  // Add link function
  const setLink = useCallback(() => {
    if (!editor) return
    
    // Get the current selection text
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    
    // cancelled
    if (url === null) return
    
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    
    // Ensure URL has a protocol
    let processedUrl = url.trim()
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl
    }
    
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: processedUrl }).run()
  }, [editor])

  if (!isEditable) {
    return (
      <div 
        className="prose prose-sm md:prose-base max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: parseHTML(content) }}
      />
    )
  }

  return (
    <div className="border-none">
      {isEditable && editor && (
        <div className="flex flex-wrap items-center gap-1 mb-2 p-1 border rounded-md bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-muted' : ''}
            title="Strike-through"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={editor.isActive('link') ? 'bg-muted' : ''}
            title="Add link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            title="Bullet list"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
            title="Ordered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
            title="Code block"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className={`border rounded-md ${isFocused ? 'ring-2 ring-primary/50' : ''}`}>
        <EditorContent 
          editor={editor} 
          className="prose-pre:whitespace-pre-wrap prose-pre:break-words"
        />
      </div>
    </div>
  )
}

export default SectionEditor 
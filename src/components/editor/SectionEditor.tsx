'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Bold, Italic, List, ListOrdered, Code, Heading1, Heading2, Strikethrough } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SectionEditorProps {
  content: string
  isEditable: boolean
  sectionId: string
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

const SectionEditor = ({ content, isEditable, sectionId, onUpdate }: SectionEditorProps) => {
  const editorRef = useRef<Editor | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [initialSetupDone, setInitialSetupDone] = useState(false)
  
  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content: parseHTML(content),
    editable: isEditable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onUpdate?.(html)
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[100px] prose prose-sm md:prose-base max-w-none dark:prose-invert p-2 rounded-md',
        spellcheck: 'true',
      }
    }
  })
  
  // Store the editor reference
  useEffect(() => {
    if (editor) {
      editorRef.current = editor
    }
  }, [editor])

  // Handle changes to editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable)
      
      // Focus the editor when it becomes editable
      if (isEditable && !initialSetupDone) {
        setTimeout(() => {
          editor.commands.focus('end')
          setInitialSetupDone(true)
        }, 100)
      }
    }
  }, [editor, isEditable, initialSetupDone])

  // Update content when it changes from props and editor exists
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

  // Focus the editor
  const focusEditor = useCallback(() => {
    if (editor && isEditable && !isFocused) {
      editor.commands.focus('end')
    }
  }, [editor, isEditable, isFocused])

  if (!isEditable) {
    return (
      <div 
        className="prose prose-sm md:prose-base max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: parseHTML(content) }}
      />
    )
  }

  return (
    <div className="border-none" onClick={focusEditor}>
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
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
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
          onClick={focusEditor}
        />
      </div>
    </div>
  )
}

export default SectionEditor 
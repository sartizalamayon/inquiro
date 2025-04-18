'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Code, Heading1, Heading2, Strikethrough } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SectionEditorProps {
  content: string
  isEditable: boolean
  sectionId: string  // Keeping this for future use with section-specific features
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
  const [htmlContent, setHtmlContent] = useState(parseHTML(content))

  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content: htmlContent,
    editable: isEditable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setHtmlContent(html)
      onUpdate?.(html)
    }
  })

  // Update editor when content or editable state changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable)
    }
  }, [editor, isEditable])

  useEffect(() => {
    if (editor && content !== htmlContent) {
      editor.commands.setContent(parseHTML(content))
      setHtmlContent(parseHTML(content))
    }
  }, [content, editor, htmlContent])

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
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-muted' : ''}
            title="Strike-through"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            title="Bullet list"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
            title="Ordered list"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <Button
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
      
      <EditorContent 
        editor={editor} 
        className="prose prose-sm md:prose-base max-w-none dark:prose-invert min-h-[100px] focus:outline-none"
      />
    </div>
  )
}

export default SectionEditor 
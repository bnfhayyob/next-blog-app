'use client'
import React, { useRef, useEffect } from 'react'

const Editor = ({ value, onChange, placeholder = "Write your blog content here..." }) => {
    const editorRef = useRef(null)

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || ''
        }
    }, [value])

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
    }

    const insertLink = () => {
        const url = prompt('Enter URL:')
        if (url) {
            formatText('createLink', url)
        }
    }

    const ToolbarButton = ({ onClick, icon, title }) => (
        <button
            type="button"
            onClick={onClick}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={title}
        >
            {icon}
        </button>
    )

    return (
        <div className="custom-editor-wrapper border border-gray-300 rounded">
            {/* Toolbar */}
            <div className="toolbar bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                <ToolbarButton
                    onClick={() => formatText('formatBlock', 'h1')}
                    icon={<span className="font-bold">H1</span>}
                    title="Heading 1"
                />
                <ToolbarButton
                    onClick={() => formatText('formatBlock', 'h2')}
                    icon={<span className="font-bold">H2</span>}
                    title="Heading 2"
                />
                <ToolbarButton
                    onClick={() => formatText('formatBlock', 'h3')}
                    icon={<span className="font-bold">H3</span>}
                    title="Heading 3"
                />

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <ToolbarButton
                    onClick={() => formatText('bold')}
                    icon={<span className="font-bold">B</span>}
                    title="Bold"
                />
                <ToolbarButton
                    onClick={() => formatText('italic')}
                    icon={<span className="italic">I</span>}
                    title="Italic"
                />
                <ToolbarButton
                    onClick={() => formatText('underline')}
                    icon={<span className="underline">U</span>}
                    title="Underline"
                />
                <ToolbarButton
                    onClick={() => formatText('strikeThrough')}
                    icon={<span className="line-through">S</span>}
                    title="Strikethrough"
                />

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <ToolbarButton
                    onClick={() => formatText('insertUnorderedList')}
                    icon={<span>• List</span>}
                    title="Bullet List"
                />
                <ToolbarButton
                    onClick={() => formatText('insertOrderedList')}
                    icon={<span>1. List</span>}
                    title="Numbered List"
                />

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <ToolbarButton
                    onClick={() => formatText('justifyLeft')}
                    icon={<span>≡</span>}
                    title="Align Left"
                />
                <ToolbarButton
                    onClick={() => formatText('justifyCenter')}
                    icon={<span>≣</span>}
                    title="Align Center"
                />
                <ToolbarButton
                    onClick={() => formatText('justifyRight')}
                    icon={<span>≡</span>}
                    title="Align Right"
                />

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <ToolbarButton
                    onClick={insertLink}
                    icon={<span>🔗</span>}
                    title="Insert Link"
                />
                <ToolbarButton
                    onClick={() => formatText('formatBlock', 'blockquote')}
                    icon={<span>"</span>}
                    title="Quote"
                />

                <div className="w-px h-8 bg-gray-300 mx-1"></div>

                <ToolbarButton
                    onClick={() => formatText('removeFormat')}
                    icon={<span>✕</span>}
                    title="Clear Formatting"
                />
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="editor-content p-4 min-h-[400px] outline-none focus:ring-2 focus:ring-gray-300"
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />
        </div>
    )
}

export default Editor

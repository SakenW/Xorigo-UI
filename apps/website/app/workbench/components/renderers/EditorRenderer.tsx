'use client'

import React, { useState, useRef, useEffect } from 'react'

interface EditorRendererProps {
  value?: string
  onChange?: (value: string) => void
  toolbar?: string[]
  placeholder?: string
  updateProp?: (prop: string, value: any) => void
}

export default function EditorRenderer({
  value = '',
  onChange,
  toolbar = ['bold', 'italic', 'underline', 'link', 'image', 'ul', 'ol', 'quote', 'code'],
  placeholder = '请输入内容...',
  updateProp
}: EditorRendererProps) {
  const [content, setContent] = useState(value)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setContent(value)
  }, [value])

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML
    setContent(newContent)
    if (onChange) onChange(newContent)
    if (updateProp) updateProp('value', newContent)
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleBold = () => {
    setIsBold(!isBold)
    execCommand('bold')
  }

  const handleItalic = () => {
    setIsItalic(!isItalic)
    execCommand('italic')
  }

  const handleUnderline = () => {
    setIsUnderline(!isUnderline)
    execCommand('underline')
  }

  const handleLink = () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString() || ''
    setLinkText(selectedText)
    setLinkUrl('https://')
    setShowLinkModal(true)
  }

  const handleImage = () => {
    const imageUrl = prompt('请输入图片URL:', 'https://')
    if (imageUrl) {
      execCommand('insertImage', imageUrl)
    }
  }

  const handleUnorderedList = () => {
    execCommand('insertUnorderedList')
  }

  const handleOrderedList = () => {
    execCommand('insertOrderedList')
  }

  const handleQuote = () => {
    execCommand('formatBlock', 'blockquote')
  }

  const handleCode = () => {
    execCommand('formatBlock', 'pre')
  }

  const handleLinkSubmit = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl)
      setShowLinkModal(false)
      setLinkUrl('')
      setLinkText('')
    }
  }

  const handleLinkCancel = () => {
    setShowLinkModal(false)
    setLinkUrl('')
    setLinkText('')
  }

  const insertTextAtCursor = (text: string) => {
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)
    if (range) {
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
      handleContentChange({ currentTarget: editorRef.current } as React.FormEvent<HTMLDivElement>)
    }
  }

  const insertEmoji = (emoji: string) => {
    insertTextAtCursor(emoji)
  }

  return (
    <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {toolbar.includes('bold') && (
          <button
            type="button"
            onClick={handleBold}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isBold ? 'bg-blue-200 dark:bg-blue-800' : ''}`}
            title="粗体"
          >
            <strong>B</strong>
          </button>
        )}

        {toolbar.includes('italic') && (
          <button
            type="button"
            onClick={handleItalic}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isItalic ? 'bg-blue-200 dark:bg-blue-800' : ''}`}
            title="斜体"
          >
            <em>I</em>
          </button>
        )}

        {toolbar.includes('underline') && (
          <button
            type="button"
            onClick={handleUnderline}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isUnderline ? 'bg-blue-200 dark:bg-blue-800' : ''}`}
            title="下划线"
          >
            <u>U</u>
          </button>
        )}

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {toolbar.includes('link') && (
          <button
            type="button"
            onClick={handleLink}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="链接"
          >
            🔗
          </button>
        )}

        {toolbar.includes('image') && (
          <button
            type="button"
            onClick={handleImage}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="图片"
          >
            🖼️
          </button>
        )}

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {toolbar.includes('ul') && (
          <button
            type="button"
            onClick={handleUnorderedList}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="无序列表"
          >
            ☰
          </button>
        )}

        {toolbar.includes('ol') && (
          <button
            type="button"
            onClick={handleOrderedList}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="有序列表"
          >
            📝
          </button>
        )}

        {toolbar.includes('quote') && (
          <button
            type="button"
            onClick={handleQuote}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="引用"
          >
            💬
          </button>
        )}

        {toolbar.includes('code') && (
          <button
            type="button"
            onClick={handleCode}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="代码块"
          >
            {'</>'}
          </button>
        )}

        <div className="flex-1" />

        {/* 快捷插入 */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">快速插入:</span>
          {['😊', '👍', '❤️', '🎉', '⭐', '🔥', '✅', '❌', '⚠️', '📝'].map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="p-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 编辑区域 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        className="min-h-[200px] p-4 bg-white dark:bg-gray-900 focus:outline-none"
        style={{ minHeight: '200px' }}
        dangerouslySetInnerHTML={{
          __html: content || `<p class="text-gray-400 dark:text-gray-500">${placeholder}</p>`
        }}
        suppressHydrationWarning
      />

      {/* 链接弹窗 */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
              插入链接
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  链接文本
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="显示文本"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  链接URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleLinkCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                取消
              </button>
              <button
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 状态信息 */}
      <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>字数: {content.replace(/<[^>]*>/g, '').length}</span>
          <span>工具栏: {toolbar.join(', ')}</span>
          <span>状态: 可编辑</span>
        </div>
      </div>
    </div>
  )
}
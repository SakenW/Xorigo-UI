'use client'

import { useState, useCallback } from 'react'

/**
 * 复制到剪贴板 Hook - 封装复制功能
 * 提供复制状态和错误处理
 */
export function useCopyToClipboard(timeout: number = 2000) {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    try {
      // 尝试使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // 降级方案：使用 document.execCommand
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const result = document.execCommand('copy')
        document.body.removeChild(textArea)

        if (!result) {
          throw new Error('Failed to copy text')
        }
      }

      setCopiedText(text)
      setIsCopied(true)
      setError(null)

      // 自动重置状态
      if (timeout > 0) {
        setTimeout(() => {
          setIsCopied(false)
          setCopiedText(null)
        }, timeout)
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy text'
      setError(errorMessage)
      setIsCopied(false)
      return false
    }
  }, [timeout])

  const reset = useCallback(() => {
    setIsCopied(false)
    setCopiedText(null)
    setError(null)
  }, [])

  return {
    copiedText,
    isCopied,
    error,
    copy,
    reset,
  }
}
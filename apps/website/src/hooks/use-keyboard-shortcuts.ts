'use client'

import { useEffect, useCallback } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  description: string
  action: () => void
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  preventDefault?: boolean
}

/**
 * 键盘快捷键管理钩子
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        (shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey) &&
        (shortcut.shiftKey ? event.shiftKey : !event.shiftKey) &&
        (shortcut.altKey ? event.altKey : !event.altKey) &&
        (shortcut.metaKey ? event.metaKey : !event.metaKey)
      )
    })

    if (matchingShortcut) {
      if (preventDefault) {
        event.preventDefault()
      }
      matchingShortcut.action()
    }
  }, [enabled, shortcuts, preventDefault])

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])

  return {
    shortcuts: shortcuts.map(shortcut => ({
      ...shortcut,
      keys: [
        shortcut.ctrlKey && 'Ctrl',
        shortcut.shiftKey && 'Shift',
        shortcut.altKey && 'Alt',
        shortcut.metaKey && 'Cmd',
        shortcut.key.toUpperCase()
      ].filter(Boolean).join(' + ')
    }))
  }
}

/**
 * 工作台专用快捷键
 */
export function useWorkbenchShortcuts({
  onToggleSidebar,
  onFocusSearch,
  onClearSearch,
  onNextCategory,
  onPreviousCategory,
  onToggleTheme,
  onShowHelp,
  onToggleAIAssistant
}: {
  onToggleSidebar?: () => void
  onFocusSearch?: () => void
  onClearSearch?: () => void
  onNextCategory?: () => void
  onPreviousCategory?: () => void
  onToggleTheme?: () => void
  onShowHelp?: () => void
  onToggleAIAssistant?: () => void
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'b',
      ctrlKey: true,
      description: '切换侧边栏',
      action: () => onToggleSidebar?.()
    },
    {
      key: '/',
      description: '聚焦搜索',
      action: () => onFocusSearch?.()
    },
    {
      key: 'Escape',
      description: '清除搜索',
      action: () => onClearSearch?.()
    },
    {
      key: 'ArrowDown',
      description: '下一个分类',
      action: () => onNextCategory?.()
    },
    {
      key: 'ArrowUp',
      description: '上一个分类',
      action: () => onPreviousCategory?.()
    },
    {
      key: 't',
      ctrlKey: true,
      description: '切换主题',
      action: () => onToggleTheme?.()
    },
    {
      key: '?',
      shiftKey: true,
      description: '显示帮助',
      action: () => onShowHelp?.()
    },
    {
      key: 'h',
      ctrlKey: true,
      description: '显示帮助',
      action: () => onShowHelp?.()
    },
    {
      key: 'a',
      ctrlKey: true,
      description: 'AI 助手',
      action: () => onToggleAIAssistant?.()
    },
    {
      key: 'i',
      ctrlKey: true,
      shiftKey: true,
      description: 'AI 助手',
      action: () => onToggleAIAssistant?.()
    }
  ]

  return useKeyboardShortcuts(shortcuts)
}
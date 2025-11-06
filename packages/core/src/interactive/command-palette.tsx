'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSevenAxisTheme } from '../theme/use-theme'
import { cn } from '../utils/cn'

// Command interface for type safety
export interface Command {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string[]
  category?: string
  keywords?: string[]
  action: () => void | Promise<void>
  disabled?: boolean
  danger?: boolean
}

// Command group interface
export interface CommandGroup {
  title?: string
  commands: Command[]
}

// Command palette props
export interface CommandPaletteProps {
  /** Whether the command palette is open */
  open?: boolean
  /** Called when the command palette requests to close */
  onClose?: () => void
  /** Array of command groups */
  commands?: CommandGroup[]
  /** Placeholder text for the search input */
  placeholder?: string
  /** Maximum number of recent commands to show */
  maxRecentCommands?: number
  /** Whether to show recently used commands */
  showRecentCommands?: boolean
  /** Custom keybinding to open the palette */
  keybinding?: string[]
  /** Whether to show categories */
  showCategories?: boolean
  /** Custom className for styling */
  className?: string
  /** Custom style object */
  style?: React.CSSProperties
  /** Ref for the command palette container */
  ref?: React.RefObject<HTMLDivElement>
}

// Internal types
interface RecentCommand {
  commandId: string
  timestamp: number
}

export const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({
    open = false,
    onClose,
    commands = [],
    placeholder = 'Type a command or search...',
    maxRecentCommands = 5,
    showRecentCommands = true,
    keybinding = ['cmd', 'k'],
    showCategories = true,
    className,
    style,
    ...props
  }, ref) => {
    const { theme } = useSevenAxisTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [recentCommands, setRecentCommands] = useState<RecentCommand[]>([])
    const [isExecuting, setIsExecuting] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const commandsRef = useRef(commands)

    // Update commands ref when commands change
    useEffect(() => {
      commandsRef.current = commands
    }, [commands])

    // Load recent commands from localStorage
    useEffect(() => {
      try {
        const saved = localStorage.getItem('xorigo-command-palette-recent')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            setRecentCommands(parsed)
          }
        }
      } catch (error) {
        console.warn('Failed to load recent commands:', error)
      }
    }, [])

    // Save recent commands to localStorage
    const saveRecentCommand = useCallback((commandId: string) => {
      setRecentCommands(prev => {
        const filtered = prev.filter(cmd => cmd.commandId !== commandId)
        const updated = [{ commandId, timestamp: Date.now() }, ...filtered].slice(0, maxRecentCommands)

        try {
          localStorage.setItem('xorigo-command-palette-recent', JSON.stringify(updated))
        } catch (error) {
          console.warn('Failed to save recent commands:', error)
        }

        return updated
      })
    }, [maxRecentCommands])

    // Flatten all commands
    const allCommands = useMemo(() => {
      return commands.flatMap(group => group.commands)
    }, [commands])

    // Filter commands based on search query
    const filteredCommands = useMemo(() => {
      if (!searchQuery.trim()) {
        return commands
      }

      const query = searchQuery.toLowerCase()

      return commands.map(group => {
        const filtered = group.commands.filter(command => {
          const searchText = `${command.title} ${command.description || ''} ${command.keywords?.join(' ') || ''}`.toLowerCase()
          return searchText.includes(query)
        })

        return { ...group, commands: filtered }
      }).filter(group => group.commands.length > 0)
    }, [commands, searchQuery])

    // Get recent commands
    const recentCommandsList = useMemo(() => {
      if (!showRecentCommands || searchQuery.trim()) return []

      const recentIds = recentCommands.map(cmd => cmd.commandId)
      const recent = recentIds
        .map(id => allCommands.find(cmd => cmd.id === id))
        .filter((cmd): cmd is Command => cmd !== undefined && !cmd.disabled)

      return recent.length > 0 ? [{ title: 'Recent', commands: recent }] : []
    }, [recentCommands, allCommands, showRecentCommands, searchQuery])

    // Combine recent and filtered commands
    const displayCommands = useMemo(() => {
      if (searchQuery.trim()) {
        return filteredCommands
      }
      return [...recentCommandsList, ...filteredCommands]
    }, [recentCommandsList, filteredCommands, searchQuery])

    // Calculate total command count
    const totalCommandCount = useMemo(() => {
      return displayCommands.reduce((total, group) => total + group.commands.length, 0)
    }, [displayCommands])

    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
      if (!open) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => (prev + 1) % totalCommandCount)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => (prev - 1 + totalCommandCount) % totalCommandCount)
          break
        case 'Enter':
          event.preventDefault()
          handleExecuteSelected()
          break
        case 'Escape':
          event.preventDefault()
          onClose?.()
          break
      }
    }, [open, totalCommandCount, onClose])

    // Handle global keybinding
    useEffect(() => {
      const handleGlobalKeyDown = (event: KeyboardEvent) => {
        // Check if keybinding is pressed (Cmd/Ctrl + K by default)
        const cmdPressed = event.metaKey || event.ctrlKey
        const kPressed = event.key.toLowerCase() === 'k'

        if (cmdPressed && kPressed) {
          event.preventDefault()
          if (open) {
            onClose?.()
          } else {
            inputRef.current?.focus()
          }
        }
      }

      document.addEventListener('keydown', handleGlobalKeyDown)
      return () => document.removeEventListener('keydown', handleGlobalKeyDown)
    }, [open, onClose])

    // Handle keyboard navigation for command selection
    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    // Focus input when opened
    useEffect(() => {
      if (open) {
        inputRef.current?.focus()
        setSearchQuery('')
        setSelectedIndex(0)
      }
    }, [open])

    // Execute selected command
    const handleExecuteSelected = useCallback(async () => {
      if (isExecuting || totalCommandCount === 0) return

      let currentIndex = selectedIndex
      for (const group of displayCommands) {
        if (currentIndex < group.commands.length) {
          const command = group.commands[currentIndex]
          if (!command.disabled) {
            setIsExecuting(true)
            try {
              await command.action()
              saveRecentCommand(command.id)
              onClose?.()
            } catch (error) {
              console.error('Command execution failed:', error)
            } finally {
              setIsExecuting(false)
            }
          }
          break
        }
        currentIndex -= group.commands.length
      }
    }, [selectedIndex, displayCommands, isExecuting, totalCommandCount, saveRecentCommand, onClose])

    // Handle command click
    const handleCommandClick = useCallback(async (command: Command) => {
      if (command.disabled || isExecuting) return

      setIsExecuting(true)
      try {
        await command.action()
        saveRecentCommand(command.id)
        onClose?.()
      } catch (error) {
        console.error('Command execution failed:', error)
      } finally {
        setIsExecuting(false)
      }
    }, [isExecuting, saveRecentCommand, onClose])

    // Handle click outside to close
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          onClose?.()
        }
      }

      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, onClose])

    // Motion variants
    const overlayVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    }

    const paletteVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: -10
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30
        }
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        transition: {
          duration: 0.15
        }
      }
    }

    const commandVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
          delay: i * 0.05,
          type: 'spring',
          stiffness: 300,
          damping: 30
        }
      }),
      hover: {
        x: 4,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
      },
      selected: {
        x: 4,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
      }
    }

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              variants={overlayVariants}
              onClick={onClose}
            />

            {/* Command Palette */}
            <motion.div
              ref={(node) => {
                containerRef.current = node
                if (typeof ref === 'function') {
                  ref(node)
                } else if (ref) {
                  ref.current = node
                }
              }}
              className={cn(
                // Base styles
                'relative w-full max-w-2xl mx-4',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'rounded-lg shadow-2xl',
                'overflow-hidden',
                // Theme integration
                'bg-[var(--color-surface-primary)]',
                'border-[var(--color-border-primary)]',
                'shadow-[var(--shadow-lg)]',
                className
              )}
              style={{
                backgroundColor: 'var(--color-surface-primary)',
                borderColor: 'var(--color-border-primary)',
                ...style
              }}
              variants={paletteVariants}
              {...props}
            >
              {/* Search Input */}
              <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                   style={{ borderColor: 'var(--color-border-secondary)' }}>
                <div className="flex-1 flex items-center gap-3">
                  {/* Search Icon */}
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-gray-500"
                    style={{ color: 'var(--color-text-tertiary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>

                  {/* Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    style={{
                      color: 'var(--color-text-primary)',
                      placeholderColor: 'var(--color-text-tertiary)'
                    }}
                  />

                  {/* Loading indicator */}
                  {isExecuting && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                         style={{ borderColor: 'var(--color-primary-500)' }} />
                  )}
                </div>

                {/* Keyboard shortcut hint */}
                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 ml-3"
                     style={{ color: 'var(--color-text-tertiary)' }}>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                       style={{
                         backgroundColor: 'var(--color-surface-tertiary)',
                         borderColor: 'var(--color-border-secondary)'
                       }}>
                    {keybinding[0] === 'cmd' ? '⌘' : 'Ctrl'}
                  </kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                       style={{
                         backgroundColor: 'var(--color-surface-tertiary)',
                         borderColor: 'var(--color-border-secondary)'
                       }}>
                    {keybinding[1]?.toUpperCase()}
                  </kbd>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-[60vh] overflow-y-auto">
                {displayCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                       style={{ color: 'var(--color-text-tertiary)' }}>
                    No commands found
                  </div>
                ) : (
                  <div className="py-2">
                    {displayCommands.map((group, groupIndex) => (
                      <div key={group.title || groupIndex}>
                        {/* Group Title */}
                        {group.title && (
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                               style={{ color: 'var(--color-text-tertiary)' }}>
                            {group.title}
                          </div>
                        )}

                        {/* Commands */}
                        {group.commands.map((command, commandIndex) => {
                          const globalIndex = displayCommands
                            .slice(0, groupIndex)
                            .reduce((sum, g) => sum + g.commands.length, 0) + commandIndex
                          const isSelected = globalIndex === selectedIndex

                          return (
                            <motion.div
                              key={command.id}
                              custom={globalIndex}
                              initial="hidden"
                              animate="visible"
                              whileHover="hover"
                              variants={commandVariants}
                              className={cn(
                                'flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors',
                                'hover:bg-gray-50 dark:hover:bg-gray-700',
                                isSelected && 'bg-blue-50 dark:bg-blue-900/20',
                                command.disabled && 'opacity-50 cursor-not-allowed',
                                command.danger && 'hover:bg-red-50 dark:hover:bg-red-900/20'
                              )}
                              style={{
                                backgroundColor: isSelected
                                  ? 'var(--color-primary-50)'
                                  : 'transparent',
                                color: isSelected
                                  ? 'var(--color-primary-700)'
                                  : 'var(--color-text-primary)'
                              }}
                              onClick={() => handleCommandClick(command)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                            >
                              {/* Icon */}
                              {command.icon && (
                                <div className="w-5 h-5 flex-shrink-0">
                                  {command.icon}
                                </div>
                              )}

                              {/* Command Info */}
                              <div className="flex-1 min-w-0">
                                <div className={cn(
                                  'font-medium truncate',
                                  command.danger && 'text-red-600 dark:text-red-400'
                                )}
                                     style={{
                                       color: command.danger
                                         ? 'var(--color-danger-600)'
                                         : 'inherit'
                                     }}>
                                  {command.title}
                                </div>
                                {command.description && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate"
                                       style={{ color: 'var(--color-text-secondary)' }}>
                                    {command.description}
                                  </div>
                                )}
                              </div>

                              {/* Shortcut */}
                              {command.shortcut && (
                                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"
                                     style={{ color: 'var(--color-text-tertiary)' }}>
                                  {command.shortcut.map((key, index) => (
                                    <React.Fragment key={index}>
                                      {index > 0 && <span>+</span>}
                                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 text-xs"
                                           style={{
                                             backgroundColor: 'var(--color-surface-tertiary)',
                                             borderColor: 'var(--color-border-secondary)'
                                           }}>
                                        {key}
                                      </kbd>
                                    </React.Fragment>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                   style={{
                     borderColor: 'var(--color-border-secondary)',
                     color: 'var(--color-text-tertiary)'
                   }}>
                <div className="flex items-center gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Execute</span>
                  <span>esc Close</span>
                </div>
                {totalCommandCount > 0 && (
                  <div>
                    {selectedIndex + 1} / {totalCommandCount}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

CommandPalette.displayName = 'CommandPalette'
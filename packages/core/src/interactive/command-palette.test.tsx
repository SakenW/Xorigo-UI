import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from '../utils/jest-axe-mock'
import { CommandPalette, Command } from './command-palette'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock theme provider
vi.mock('../../theme-provider', () => ({
  useTheme: () => ({
    theme: 'light'
  })
}))

// Mock utils
vi.mock('../../utils/cn', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}))

describe('CommandPalette', () => {
  const mockCommands = [
    {
      id: 'cmd-1',
      title: 'New Document',
      description: 'Create a new document',
      shortcut: ['cmd', 'n'],
      category: 'File',
      action: vi.fn()
    },
    {
      id: 'cmd-2',
      title: 'Save Document',
      description: 'Save the current document',
      shortcut: ['cmd', 's'],
      category: 'File',
      action: vi.fn()
    },
    {
      id: 'cmd-3',
      title: 'Copy',
      description: 'Copy selected text',
      shortcut: ['cmd', 'c'],
      category: 'Edit',
      action: vi.fn()
    },
    {
      id: 'cmd-4',
      title: 'Paste',
      description: 'Paste from clipboard',
      shortcut: ['cmd', 'v'],
      category: 'Edit',
      action: vi.fn()
    },
    {
      id: 'cmd-5',
      title: 'Delete Item',
      description: 'Delete selected item',
      shortcut: ['cmd', 'd'],
      category: 'File',
      action: vi.fn(),
      danger: true
    },
    {
      id: 'cmd-6',
      title: 'Disabled Command',
      description: 'This command is disabled',
      action: vi.fn(),
      disabled: true
    }
  ]

  const mockCommandGroups = [
    {
      title: 'File',
      commands: mockCommands.filter(cmd => cmd.category === 'File')
    },
    {
      title: 'Edit',
      commands: mockCommands.filter(cmd => cmd.category === 'Edit')
    }
  ]

  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    commands: mockCommandGroups
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders correctly when open', () => {
      render(<CommandPalette {...defaultProps} />)

      expect(screen.getByPlaceholderText('Type a command or search...')).toBeInTheDocument()
      expect(screen.getByText('File')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('New Document')).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
    })

    it('does not render when closed', () => {
      render(<CommandPalette {...defaultProps} open={false} />)

      expect(screen.queryByPlaceholderText('Type a command or search...')).not.toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      render(
        <CommandPalette
          {...defaultProps}
          placeholder="Search commands..."
        />
      )

      expect(screen.getByPlaceholderText('Search commands...')).toBeInTheDocument()
    })

    it('renders custom icon for commands', () => {
      const commandsWithIcon = [
        {
          id: 'cmd-icon',
          title: 'Command with Icon',
          action: vi.fn(),
          icon: <div data-testid="custom-icon">Icon</div>
        }
      ]

      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands: commandsWithIcon }]}
        />
      )

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('shows empty state when no commands match search', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Type a command or search...')
      await user.type(searchInput, 'nonexistent')

      expect(screen.getByText('No commands found')).toBeInTheDocument()
    })
  })

  describe('Search functionality', () => {
    it('filters commands based on search query', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Type a command or search...')
      await user.type(searchInput, 'new')

      expect(screen.getByText('New Document')).toBeInTheDocument()
      expect(screen.queryByText('Save Document')).not.toBeInTheDocument()
    })

    it('searches in descriptions and keywords', async () => {
      const commandsWithKeywords = [
        {
          id: 'cmd-keywords',
          title: 'Special Command',
          description: 'Does something special',
          keywords: ['magic', 'special'],
          action: vi.fn()
        }
      ]

      const user = userEvent.setup()
      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands: commandsWithKeywords }]}
        />
      )

      const searchInput = screen.getByPlaceholderText('Type a command or search...')

      await user.type(searchInput, 'magic')
      expect(screen.getByText('Special Command')).toBeInTheDocument()

      await user.clear(searchInput)
      await user.type(searchInput, 'something special')
      expect(screen.getByText('Special Command')).toBeInTheDocument()
    })

    it('hides empty groups after filtering', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Type a command or search...')
      await user.type(searchInput, 'new')

      // Should only show File group (contains "New Document")
      expect(screen.getByText('File')).toBeInTheDocument()
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })
  })

  describe('Keyboard navigation', () => {
    it('focuses input when opened', () => {
      render(<CommandPalette {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Type a command or search...')
      expect(searchInput).toHaveFocus()
    })

    it('navigates down with arrow key', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      await user.keyboard('{ArrowDown}')

      // First command should be selected
      const firstCommand = screen.getByText('New Document')
      expect(firstCommand.closest('[style*="background-color"]')).toBeInTheDocument()
    })

    it('navigates up with arrow key', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      // Go down twice, then up once
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowUp}')

      // Should be back to first command
      const firstCommand = screen.getByText('New Document')
      expect(firstCommand.closest('[style*="background-color"]')).toBeInTheDocument()
    })

    it('wraps navigation when reaching boundaries', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      // Go to last command
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      // Go down again should wrap to first
      await user.keyboard('{ArrowDown}')
      const firstCommand = screen.getByText('New Document')
      expect(firstCommand.closest('[style*="background-color"]')).toBeInTheDocument()

      // Go up from first should go to last
      await user.keyboard('{ArrowUp}')
      const lastCommand = screen.getByText('Disabled Command')
      expect(lastCommand.closest('[style*="background-color"]')).toBeInTheDocument()
    })

    it('executes command with Enter key', async () => {
      const mockAction = vi.fn()
      const commands = [
        {
          id: 'cmd-test',
          title: 'Test Command',
          action: mockAction
        }
      ]

      const user = userEvent.setup()
      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands }]}
        />
      )

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockAction).toHaveBeenCalled()
      })
    })

    it('closes with Escape key', async () => {
      const mockOnClose = vi.fn()
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} onClose={mockOnClose} />)

      await user.keyboard('{Escape}')

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('resets search and selection when reopened', async () => {
      const { rerender } = render(<CommandPalette {...defaultProps} />)

      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText('Type a command or search...')

      await user.type(searchInput, 'test')
      await user.keyboard('{ArrowDown}')

      // Close and reopen
      rerender(<CommandPalette {...defaultProps} open={false} />)
      rerender(<CommandPalette {...defaultProps} open={true} />)

      // Should be reset
      expect(searchInput).toHaveValue('')
      expect(searchInput).toHaveFocus()
    })
  })

  describe('Command execution', () => {
    it('executes command on click', async () => {
      const mockAction = vi.fn()
      const commands = [
        {
          id: 'cmd-click',
          title: 'Clickable Command',
          action: mockAction
        }
      ]

      const user = userEvent.setup()
      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands }]}
        />
      )

      const command = screen.getByText('Clickable Command')
      await user.click(command)

      await waitFor(() => {
        expect(mockAction).toHaveBeenCalled()
      })
    })

    it('closes palette after successful command execution', async () => {
      const mockAction = vi.fn()
      const mockOnClose = vi.fn()
      const commands = [
        {
          id: 'cmd-close',
          title: 'Close Command',
          action: mockAction
        }
      ]

      const user = userEvent.setup()
      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands }]}
          onClose={mockOnClose}
        />
      )

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockAction).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('handles async command execution', async () => {
      const mockAction = vi.fn().mockResolvedValue(undefined)
      const mockOnClose = vi.fn()
      const commands = [
        {
          id: 'cmd-async',
          title: 'Async Command',
          action: mockAction
        }
      ]

      const user = userEvent.setup()
      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands }]}
          onClose={mockOnClose}
        />
      )

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockAction).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('does not execute disabled commands', async () => {
      const mockAction = vi.fn()
      const commands = [
        {
          id: 'cmd-disabled',
          title: 'Disabled Command',
          action: mockAction,
          disabled: true
        }
      ]

      const user = userEvent.setup()
      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands }]}
        />
      )

      const command = screen.getByText('Disabled Command')
      await user.click(command)

      expect(mockAction).not.toHaveBeenCalled()
    })

    it('shows loading state during execution', async () => {
      let resolveAction: (value: void) => void
      const mockAction = vi.fn(() => new Promise<void>(resolve => {
        resolveAction = resolve
      }))
      const commands = [
        {
          id: 'cmd-loading',
          title: 'Loading Command',
          action: mockAction
        }
      ]

      const user = userEvent.setup()
      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands }]}
        />
      )

      await user.keyboard('{Enter}')

      // Should show loading indicator
      expect(screen.getByRole('generic', { name: /loading/i })).toBeInTheDocument()

      // Resolve the action
      resolveAction!()

      await waitFor(() => {
        expect(screen.queryByRole('generic', { name: /loading/i })).not.toBeInTheDocument()
      })
    })
  })

  describe('Recent commands', () => {
    it('displays recently used commands', async () => {
      // Set up recent commands in localStorage
      const recentCommands = [
        { commandId: 'cmd-1', timestamp: Date.now() - 1000 },
        { commandId: 'cmd-3', timestamp: Date.now() - 2000 }
      ]
      localStorageMock.setItem('xorigo-command-palette-recent', JSON.stringify(recentCommands))

      render(<CommandPalette {...defaultProps} />)

      expect(screen.getByText('Recent')).toBeInTheDocument()
      expect(screen.getByText('New Document')).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
    })

    it('saves executed command to recent commands', async () => {
      const mockAction = vi.fn()
      const commands = [
        {
          id: 'cmd-recent',
          title: 'Recent Test Command',
          action: mockAction
        }
      ]

      const user = userEvent.setup()
      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands }]}
        />
      )

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'xorigo-command-palette-recent',
          expect.stringContaining('cmd-recent')
        )
      })
    })

    it('limits number of recent commands', () => {
      const manyRecentCommands = Array.from({ length: 10 }, (_, i) => ({
        commandId: `cmd-${i}`,
        timestamp: Date.now() - i * 1000
      }))
      localStorageMock.setItem('xorigo-command-palette-recent', JSON.stringify(manyRecentCommands))

      render(<CommandPalette {...defaultProps} maxRecentCommands={3} />)

      // Should only show 3 recent commands
      expect(screen.getByText('Recent')).toBeInTheDocument()
      expect(screen.getAllByText(/Document|Copy|Paste/)).toHaveLength(3)
    })

    it('does not show recent commands during search', async () => {
      const recentCommands = [
        { commandId: 'cmd-1', timestamp: Date.now() }
      ]
      localStorageMock.setItem('xorigo-command-palette-recent', JSON.stringify(recentCommands))

      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Type a command or search...')
      await user.type(searchInput, 'new')

      // Should not show "Recent" section during search
      expect(screen.queryByText('Recent')).not.toBeInTheDocument()
    })
  })

  describe('Global keybinding', () => {
    it('opens palette with Cmd/Ctrl+K', async () => {
      const mockOnClose = vi.fn()
      const { rerender } = render(
        <CommandPalette
          {...defaultProps}
          open={false}
          onClose={mockOnClose}
        />
      )

      // Press Cmd+K (or Ctrl+K)
      await userEvent.keyboard('{Meta>}k{/Meta}')

      // Should trigger open (but we can't test state change directly)
      // Instead, we can test that the key event is prevented
      expect(document.activeElement).not.toBe(document.body)
    })

    it('closes palette with Cmd/Ctrl+K when open', async () => {
      const mockOnClose = vi.fn()
      render(<CommandPalette {...defaultProps} onClose={mockOnClose} />)

      await userEvent.keyboard('{Meta>}k{/Meta}')

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('supports custom keybinding', async () => {
      const mockOnClose = vi.fn()
      render(
        <CommandPalette
          {...defaultProps}
          open={false}
          onClose={mockOnClose}
          keybinding={['ctrl', 'shift', 'p']}
        />
      )

      await userEvent.keyboard('{Control>}{Shift>}p{/Shift}{/Control}')

      // Should trigger keybinding
      expect(document.activeElement).not.toBe(document.body)
    })
  })

  describe('Click outside to close', () => {
    it('closes when clicking outside', async () => {
      const mockOnClose = vi.fn()
      render(<CommandPalette {...defaultProps} onClose={mockOnClose} />)

      // Click outside the palette
      fireEvent.mouseDown(document.body)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('does not close when clicking inside', async () => {
      const mockOnClose = vi.fn()
      render(<CommandPalette {...defaultProps} onClose={mockOnClose} />)

      // Click inside the palette
      const palette = screen.getByRole('textbox')
      fireEvent.mouseDown(palette)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<CommandPalette {...defaultProps} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('supports keyboard navigation without mouse', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      // Navigate through all commands using keyboard
      for (let i = 0; i < 6; i++) {
        await user.keyboard('{ArrowDown}')
      }

      // Should be able to navigate and execute with keyboard only
      await user.keyboard('{Enter}')

      expect(mockCommands[0].action).toHaveBeenCalled()
    })

    it('announces keyboard shortcuts properly', () => {
      render(<CommandPalette {...defaultProps} />)

      // Check that shortcuts are displayed
      expect(screen.getByText('⌘')).toBeInTheDocument()
      expect(screen.getByText('N')).toBeInTheDocument()
      expect(screen.getByText('S')).toBeInTheDocument()
    })

    it('provides proper focus management', () => {
      const { rerender } = render(<CommandPalette {...defaultProps} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveFocus()

      // Close and reopen
      rerender(<CommandPalette {...defaultProps} open={false} />)
      rerender(<CommandPalette {...defaultProps} open={true} />)

      // Should refocus input when reopened
      expect(input).toHaveFocus()
    })
  })

  describe('Styling and theming', () => {
    it('applies custom className', () => {
      render(
        <CommandPalette
          {...defaultProps}
          className="custom-palette-class"
        />
      )

      const palette = document.querySelector('.custom-palette-class')
      expect(palette).toBeInTheDocument()
    })

    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'red' }
      render(
        <CommandPalette
          {...defaultProps}
          style={customStyle}
        />
      )

      const palette = screen.getByRole('textbox').closest('[style*="background-color"]')
      expect(palette).toHaveStyle('background-color: red')
    })

    it('shows danger styling for dangerous commands', () => {
      render(<CommandPalette {...defaultProps} />)

      const dangerousCommand = screen.getByText('Delete Item')
      expect(dangerousCommand.closest('[style*="color"]')).toHaveStyle()
    })

    it('shows disabled styling for disabled commands', () => {
      render(<CommandPalette {...defaultProps} />)

      const disabledCommand = screen.getByText('Disabled Command')
      const disabledElement = disabledCommand.closest('.opacity-50')
      expect(disabledElement).toBeInTheDocument()
    })
  })

  describe('Footer navigation hints', () => {
    it('shows navigation hints', () => {
      render(<CommandPalette {...defaultProps} />)

      expect(screen.getByText('↑↓ Navigate')).toBeInTheDocument()
      expect(screen.getByText('↵ Execute')).toBeInTheDocument()
      expect(screen.getByText('esc Close')).toBeInTheDocument()
    })

    it('shows command counter', () => {
      render(<CommandPalette {...defaultProps} />)

      expect(screen.getByText('1 / 6')).toBeInTheDocument()
    })

    it('updates counter when navigating', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('2 / 6')).toBeInTheDocument()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('3 / 6')).toBeInTheDocument()
    })

    it('hides counter when no commands', async () => {
      const user = userEvent.setup()
      render(<CommandPalette {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('Type a command or search...')
      await user.type(searchInput, 'nonexistent')

      expect(screen.queryByText(/\d+ \/ \d+/)).not.toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('handles command execution errors gracefully', async () => {
      const mockAction = vi.fn().mockRejectedValue(new Error('Test error'))
      const commands = [
        {
          id: 'cmd-error',
          title: 'Error Command',
          action: mockAction
        }
      ]

      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <CommandPalette
          {...defaultProps}
          commands={[{ commands }]}
        />
      )

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Command execution failed:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })

    it('handles localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(<CommandPalette {...defaultProps} />)

      // Should not crash
      expect(screen.getByPlaceholderText('Type a command or search...')).toBeInTheDocument()

      consoleSpy.mockRestore()
    })
  })
})
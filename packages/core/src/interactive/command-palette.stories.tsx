'use client'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CommandPalette, Command, CommandGroup } from './command-palette'

// Sample commands for stories
const sampleCommands: CommandGroup[] = [
  {
    title: 'File Operations',
    commands: [
      {
        id: 'new-file',
        title: 'New File',
        description: 'Create a new file in the current project',
        shortcut: ['cmd', 'n'],
        action: () => console.log('New file created'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )
      },
      {
        id: 'open-file',
        title: 'Open File',
        description: 'Open an existing file',
        shortcut: ['cmd', 'o'],
        action: () => console.log('Open file dialog'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        )
      },
      {
        id: 'save-file',
        title: 'Save File',
        description: 'Save the current file',
        shortcut: ['cmd', 's'],
        action: () => console.log('File saved'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
          </svg>
        )
      },
      {
        id: 'export-file',
        title: 'Export File',
        description: 'Export file in different format',
        shortcut: ['cmd', 'e'],
        action: () => console.log('Export file'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      }
    ]
  },
  {
    title: 'Edit Operations',
    commands: [
      {
        id: 'undo',
        title: 'Undo',
        description: 'Undo the last action',
        shortcut: ['cmd', 'z'],
        action: () => console.log('Undo action'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        )
      },
      {
        id: 'redo',
        title: 'Redo',
        description: 'Redo the last undone action',
        shortcut: ['cmd', 'shift', 'z'],
        action: () => console.log('Redo action'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        )
      },
      {
        id: 'copy',
        title: 'Copy',
        description: 'Copy selected content',
        shortcut: ['cmd', 'c'],
        action: () => console.log('Copy content'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        id: 'paste',
        title: 'Paste',
        description: 'Paste content from clipboard',
        shortcut: ['cmd', 'v'],
        action: () => console.log('Paste content'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        )
      }
    ]
  },
  {
    title: 'View Options',
    commands: [
      {
        id: 'toggle-sidebar',
        title: 'Toggle Sidebar',
        description: 'Show or hide the sidebar',
        action: () => console.log('Toggle sidebar'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )
      },
      {
        id: 'toggle-dark-mode',
        title: 'Toggle Dark Mode',
        description: 'Switch between light and dark themes',
        action: () => console.log('Toggle theme'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )
      },
      {
        id: 'fullscreen',
        title: 'Toggle Fullscreen',
        description: 'Enter or exit fullscreen mode',
        action: () => console.log('Toggle fullscreen'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )
      }
    ]
  },
  {
    title: 'Dangerous Actions',
    commands: [
      {
        id: 'delete-file',
        title: 'Delete File',
        description: 'Permanently delete the current file',
        shortcut: ['cmd', 'delete'],
        action: () => console.log('Delete file'),
        danger: true,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )
      },
      {
        id: 'clear-cache',
        title: 'Clear Cache',
        description: 'Clear all cached data and settings',
        action: () => console.log('Clear cache'),
        danger: true,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      }
    ]
  }
]

const meta: Meta<typeof CommandPalette> = {
  title: 'Interactive/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
CommandPalette is a searchable, keyboard-navigable command palette that allows users to quickly execute actions through typing and keyboard shortcuts.

## Features

- **Search & Filter**: Find commands by typing
- **Keyboard Navigation**: Full keyboard support with arrow keys and shortcuts
- **Recent Commands**: Shows recently used commands for quick access
- **Custom Commands**: Define your own commands with actions
- **Theme Integration**: Works with all Xorigo UI themes
- **Accessibility**: Full ARIA support and keyboard navigation
- **Custom Styling**: Extensible with custom classes and styles

## Usage

The CommandPalette opens with Cmd/Ctrl+K by default and supports:
- Arrow keys for navigation
- Enter to execute selected command
- Escape to close
- Click outside to close

## Keyboard Shortcuts

- \`Cmd/Ctrl + K\`: Toggle command palette
- \`↑↓\`: Navigate commands
- \`Enter\`: Execute selected command
- \`Escape\`: Close palette
        `
      }
    }
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the command palette is open'
    },
    onClose: {
      action: 'closed',
      description: 'Called when the command palette requests to close'
    },
    commands: {
      control: 'object',
      description: 'Array of command groups with commands'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input'
    },
    maxRecentCommands: {
      control: 'number',
      description: 'Maximum number of recent commands to show'
    },
    showRecentCommands: {
      control: 'boolean',
      description: 'Whether to show recently used commands'
    },
    keybinding: {
      control: 'object',
      description: 'Custom keybinding to open the palette'
    },
    showCategories: {
      control: 'boolean',
      description: 'Whether to show categories'
    },
    className: {
      control: 'text',
      description: 'Custom className for styling'
    }
  }
}

export default meta
type Story = StoryObj<typeof CommandPalette>

// Base story
export const Default: Story = {
  args: {
    open: true,
    commands: sampleCommands,
    onClose: () => console.log('CommandPalette closed')
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open)

    return (
      <div style={{ padding: '20px' }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Toggle CommandPalette (Cmd/Ctrl+K)
        </button>

        <CommandPalette
          {...args}
          open={open}
          onClose={() => {
            setOpen(false)
            args.onClose()
          }}
        />
      </div>
    )
  }
}

// Minimal example
export const Minimal: Story = {
  args: {
    open: true,
    commands: [
      {
        commands: [
          {
            id: 'simple-1',
            title: 'Simple Command 1',
            action: () => console.log('Simple 1')
          },
          {
            id: 'simple-2',
            title: 'Simple Command 2',
            description: 'With description',
            action: () => console.log('Simple 2')
          }
        ]
      }
    ],
    placeholder: 'Type a command...',
    showRecentCommands: false
  }
}

// With custom keybinding
export const CustomKeybinding: Story = {
  args: {
    open: true,
    commands: sampleCommands,
    keybinding: ['ctrl', 'shift', 'p'],
    placeholder: 'Press Ctrl+Shift+P or start typing...'
  }
}

// Without categories
export const NoCategories: Story = {
  args: {
    open: true,
    commands: [
      {
        commands: sampleCommands.flatMap(group => group.commands)
      }
    ],
    showCategories: false,
    placeholder: 'Search all commands...'
  }
}

// With disabled commands
export const WithDisabledCommands: Story = {
  args: {
    open: true,
    commands: [
      {
        title: 'Available Commands',
        commands: [
          {
            id: 'enabled-1',
            title: 'Enabled Command',
            description: 'This command can be executed',
            shortcut: ['cmd', 'e'],
            action: () => console.log('Enabled command executed')
          },
          {
            id: 'disabled-1',
            title: 'Disabled Command',
            description: 'This command is currently disabled',
            shortcut: ['cmd', 'd'],
            action: () => console.log('This should not execute'),
            disabled: true
          }
        ]
      }
    ]
  }
}

// With async commands
export const AsyncCommands: Story = {
  args: {
    open: true,
    commands: [
      {
        title: 'Async Operations',
        commands: [
          {
            id: 'async-1',
            title: 'Load Data',
            description: 'Simulates loading data from API',
            shortcut: ['cmd', 'l'],
            action: async () => {
              await new Promise(resolve => setTimeout(resolve, 2000))
              console.log('Data loaded')
            }
          },
          {
            id: 'async-2',
            title: 'Process File',
            description: 'Simulates file processing',
            shortcut: ['cmd', 'p'],
            action: async () => {
              await new Promise(resolve => setTimeout(resolve, 1000))
              console.log('File processed')
            }
          }
        ]
      }
    ]
  }
}

// Custom styling
export const CustomStyling: Story = {
  args: {
    open: true,
    commands: sampleCommands,
    className: 'border-2 border-purple-500 shadow-purple-500/20',
    style: {
      borderRadius: '12px',
      border: '2px solid #8b5cf6',
      boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)'
    }
  }
}

// Empty state
export const EmptyState: Story = {
  args: {
    open: true,
    commands: [],
    placeholder: 'No commands available'
  }
}

// With many commands (performance test)
export const ManyCommands: Story = {
  args: {
    open: true,
    commands: Array.from({ length: 10 }, (_, i) => ({
      title: `Category ${i + 1}`,
      commands: Array.from({ length: 20 }, (_, j) => ({
        id: `cmd-${i}-${j}`,
        title: `Command ${i + 1}-${j + 1}`,
        description: `Description for command ${i + 1}-${j + 1}`,
        shortcut: ['cmd', `${i + 1}`],
        action: () => console.log(`Command ${i + 1}-${j + 1} executed`)
      }))
    }))
  }
}

// Interactive demo
export const InteractiveDemo: Story = {
  args: {
    open: true,
    commands: sampleCommands
  },
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [lastAction, setLastAction] = useState<string>('')
    const [actionCount, setActionCount] = useState(0)

    const enhancedCommands = sampleCommands.map(group => ({
      ...group,
      commands: group.commands.map(cmd => ({
        ...cmd,
        action: () => {
          setLastAction(cmd.title)
          setActionCount(prev => prev + 1)
          console.log(`Executed: ${cmd.title}`)
        }
      }))
    }))

    return (
      <div style={{ padding: '20px', minHeight: '400px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3>Interactive CommandPalette Demo</h3>
          <p>Press Cmd/Ctrl+K or click the button to open the command palette.</p>

          <button
            onClick={() => setOpen(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Open CommandPalette
          </button>
        </div>

        {lastAction && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <strong>Last Action:</strong> {lastAction}
            <br />
            <strong>Total Actions:</strong> {actionCount}
          </div>
        )}

        <CommandPalette
          {...args}
          open={open}
          commands={enhancedCommands}
          onClose={() => setOpen(false)}
        />
      </div>
    )
  }
}
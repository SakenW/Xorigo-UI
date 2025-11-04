import React, { useState } from 'react'
import { CommandPalette } from './command-palette'

// Example usage of CommandPalette component
export const CommandPaletteExample = () => {
  const [open, setOpen] = useState(false)
  const [lastAction, setLastAction] = useState<string>('')

  const exampleCommands = [
    {
      title: 'File Operations',
      commands: [
        {
          id: 'new-file',
          title: 'New File',
          description: 'Create a new file',
          shortcut: ['cmd', 'n'] as const,
          action: () => {
            setLastAction('Created new file')
            console.log('New file created')
          },
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )
        },
        {
          id: 'save-file',
          title: 'Save File',
          description: 'Save the current file',
          shortcut: ['cmd', 's'] as const,
          action: () => {
            setLastAction('File saved')
            console.log('File saved')
          }
        }
      ]
    },
    {
      title: 'View Options',
      commands: [
        {
          id: 'toggle-theme',
          title: 'Toggle Theme',
          description: 'Switch between light and dark mode',
          action: () => {
            setLastAction('Theme toggled')
            console.log('Theme toggled')
          }
        },
        {
          id: 'fullscreen',
          title: 'Toggle Fullscreen',
          description: 'Enter or exit fullscreen mode',
          action: () => {
            setLastAction('Fullscreen toggled')
            console.log('Fullscreen toggled')
          }
        }
      ]
    },
    {
      title: 'Dangerous Actions',
      commands: [
        {
          id: 'delete-all',
          title: 'Delete All Data',
          description: 'Permanently delete all data (cannot be undone)',
          shortcut: ['cmd', 'shift', 'd'] as const,
          action: () => {
            setLastAction('WARNING: Delete all data action executed')
            console.log('Delete all data')
          },
          danger: true
        }
      ]
    }
  ]

  return (
    <div style={{ padding: '20px', minHeight: '400px' }}>
      <h2>CommandPalette Example</h2>

      <div style={{ marginBottom: '20px' }}>
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
            fontWeight: '500',
            marginBottom: '10px'
          }}
        >
          Open CommandPalette (Cmd/Ctrl+K)
        </button>

        <p style={{ fontSize: '14px', color: '#666' }}>
          Or press Cmd/Ctrl+K to open the command palette
        </p>
      </div>

      {lastAction && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <strong>Last Action:</strong> {lastAction}
        </div>
      )}

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={exampleCommands}
        placeholder="Type a command or search..."
        showRecentCommands={true}
        maxRecentCommands={3}
      />

      <div style={{ marginTop: '30px' }}>
        <h3>Features demonstrated:</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>✅ Keyboard navigation (↑↓ to navigate, Enter to execute, Escape to close)</li>
          <li>✅ Global shortcut (Cmd/Ctrl+K)</li>
          <li>✅ Search and filtering</li>
          <li>✅ Command groups and categories</li>
          <li>✅ Keyboard shortcuts display</li>
          <li>✅ Custom icons</li>
          <li>✅ Dangerous actions with special styling</li>
          <li>✅ Recent commands tracking</li>
          <li>✅ Theme integration</li>
          <li>✅ Smooth animations</li>
        </ul>
      </div>
    </div>
  )
}

export default CommandPaletteExample
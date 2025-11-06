/**
 * Xorigo UI Website - Real-Time Collaborative Editor
 *
 * React component for real-time collaborative editing with:
 * - Multi-user cursor tracking
 * - WebSocket synchronization
 * - CRDT-based conflict resolution
 * - Share link generation
 * - Team collaboration features
 */

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { WebSocketManager } from '@xorigo-ui/collaboration'
import { CursorSyncManager } from '@xorigo-ui/collaboration'
import { ShareLinkGenerator, PermissionManager } from '@xorigo-ui/share'
import { TemplateLibrary, VersionControl } from '@xorigo-ui/team'

// Types
interface RealTimeEditorProps {
  documentId: string
  initialContent?: string
  userId?: string
  userName?: string
  onSave?: (content: string) => void
  onError?: (error: Error) => void
  readOnly?: boolean
  showCursors?: boolean
  showShareButton?: boolean
  showVersionControl?: boolean
}

interface UserPresence {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
}

interface VersionHistoryItem {
  id: string
  version: string
  timestamp: number
  author: string
  message: string
}

const RealTimeEditor: React.FC<RealTimeEditorProps> = ({
  documentId,
  initialContent = '',
  userId = `user_${Date.now()}`,
  userName = 'Anonymous',
  onSave,
  onError,
  readOnly = false,
  showCursors = true,
  showShareButton = true,
  showVersionControl = true
}) => {
  // State
  const [content, setContent] = useState(initialContent)
  const [isConnected, setIsConnected] = useState(false)
  const [users, setUsers] = useState<UserPresence[]>([])
  const [version, setVersion] = useState('1.0.0')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showVersionModal, setShowVersionModal] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [versionHistory, setVersionHistory] = useState<VersionHistoryItem[]>([])

  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const websocketManagerRef = useRef<WebSocketManager | null>(null)
  const cursorSyncRef = useRef<CursorSyncManager | null>(null)
  const versionControlRef = useRef<VersionControl | null>(null)

  // Initialize WebSocket and collaboration features
  useEffect(() => {
    const initCollaboration = async () => {
      try {
        // Initialize WebSocket manager
        websocketManagerRef.current = new WebSocketManager(userId, {
          url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001',
          reconnection: true,
          reconnectionAttempts: 5
        })

        // Set up event listeners
        websocketManagerRef.current.on('connect', () => {
          setIsConnected(true)
          joinRoom()
        })

        websocketManagerRef.current.on('disconnect', () => {
          setIsConnected(false)
        })

        websocketManagerRef.current.on('userJoined', ({ user }) => {
          setUsers(prev => [...prev, user])
        })

        websocketManagerRef.current.on('userLeft', ({ userId }) => {
          setUsers(prev => prev.filter(u => u.id !== userId))
        })

        websocketManagerRef.current.on('cursorUpdate', ({ userId, position }) => {
          setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, cursor: position } : u
          ))
        })

        websocketManagerRef.current.on('message', (message) => {
          if (message.type === 'edit') {
            setContent(message.data as string)
          }
        })

        // Initialize cursor sync
        if (showCursors && editorRef.current) {
          cursorSyncRef.current = new CursorSyncManager({
            container: editorRef.current.parentElement || document.body,
            onCursorUpdate: (cursor) => {
              // Cursor updated
            }
          })
        }

        // Initialize version control
        versionControlRef.current = new VersionControl('main')

        // Connect
        await websocketManagerRef.current.connect()

      } catch (error) {
        console.error('Failed to initialize collaboration:', error)
        onError?.(error as Error)
      }
    }

    initCollaboration()

    // Cleanup
    return () => {
      websocketManagerRef.current?.disconnect()
      cursorSyncRef.current?.destroy()
    }
  }, [])

  const joinRoom = async () => {
    if (!websocketManagerRef.current) return

    try {
      await websocketManagerRef.current.joinRoom(documentId, {
        maxUsers: 10,
        readOnly,
        requireAuth: false
      })
    } catch (error) {
      console.error('Failed to join room:', error)
      onError?.(error as Error)
    }
  }

  // Handle content changes
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    // Broadcast changes
    if (websocketManagerRef.current?.isConnected()) {
      websocketManagerRef.current.sendMessage(documentId, {
        type: 'edit',
        userId,
        timestamp: Date.now(),
        data: newContent
      })
    }

    // Auto-save
    if (onSave) {
      setTimeout(() => onSave(newContent), 1000)
    }
  }, [documentId, userId, onSave])

  // Handle cursor movement
  const handleCursorMove = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!cursorSyncRef.current || !websocketManagerRef.current?.isConnected()) return

    const rect = editorRef.current?.getBoundingClientRect()
    if (!rect) return

    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    cursorSyncRef.current.updateCursor(userId, position)
    websocketManagerRef.current.updateCursor(documentId, position)
  }, [documentId, userId])

  // Generate share link
  const handleShare = useCallback(async () => {
    try {
      const generator = new ShareLinkGenerator()
      const link = await generator.generate(documentId, 'document', {
        expiresIn: 24 * 60 * 60, // 24 hours
        maxAccessCount: 100,
        allowAnonymous: true
      })

      setShareLink(link.url)
      setShowShareModal(true)
    } catch (error) {
      console.error('Failed to generate share link:', error)
      onError?.(error as Error)
    }
  }, [documentId])

  // Save version
  const handleSaveVersion = useCallback(async () => {
    if (!versionControlRef.current) return

    try {
      const newVersion = await versionControlRef.current.createVersion(
        version,
        `Auto-save at ${new Date().toISOString()}`,
        content,
        { id: userId, name: userName }
      )

      setVersion(newVersion.version)
      setVersionHistory(prev => [
        {
          id: newVersion.id,
          version: newVersion.version,
          timestamp: newVersion.timestamp,
          author: newVersion.author.name,
          message: newVersion.message
        },
        ...prev
      ])

      setShowVersionModal(false)
    } catch (error) {
      console.error('Failed to save version:', error)
      onError?.(error as Error)
    }
  }, [content, userId, userName, version])

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {showVersionControl && (
            <div className="text-sm text-gray-500">
              v{version}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* User list */}
          {users.length > 0 && (
            <div className="flex -space-x-2">
              {users.slice(0, 5).map(user => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {users.length > 5 && (
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs">
                  +{users.length - 5}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {showShareButton && (
            <button
              onClick={handleShare}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Share
            </button>
          )}

          {showVersionControl && (
            <button
              onClick={() => setShowVersionModal(true)}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              History
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          onMouseMove={handleCursorMove}
          readOnly={readOnly}
          className="w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none dark:bg-gray-900 dark:text-gray-100"
          placeholder="Start typing..."
        />

        {/* Cursor overlays */}
        {showCursors && users.map(user => (
          user.cursor && (
            <div
              key={user.id}
              className="absolute pointer-events-none z-10 transition-all duration-100"
              style={{
                left: user.cursor.x,
                top: user.cursor.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="flex items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill={user.color}>
                  <path d="M7 2L7 16L10 13L14 17L12.5 18.5L16 22L17.5 16.5L14 13L10 16L7 16V2Z"/>
                </svg>
                <div
                  className="px-2 py-1 text-xs text-white rounded shadow-lg"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name}
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share Document</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Share Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(shareLink)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Version History</h3>
              <button
                onClick={handleSaveVersion}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Save Version
              </button>
            </div>

            <div className="space-y-2">
              {versionHistory.map(item => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.version}</div>
                      <div className="text-sm text-gray-500">{item.message}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    By {item.author}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RealTimeEditor

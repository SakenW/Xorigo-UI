'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { getCollaborationService, type CollaborationService } from './services/collaboration-service'
import type {
  User,
  EditOperation,
  CursorPosition,
  SelectionRange,
  ConflictResolution,
  CollaborationSession,
  UserStatus
} from './types'

// ============================================================================
// 编辑器变体配置
// ============================================================================

const editorVariants = cva(
  'relative rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        focused: 'border-blue-500 ring-1 ring-blue-500/20 bg-white dark:bg-gray-900',
        error: 'border-red-500 ring-1 ring-red-500/20 bg-red-50 dark:bg-red-950',
        collaboration: 'border-purple-200 ring-1 ring-purple-500/20 bg-purple-50 dark:border-purple-700 dark:bg-purple-950'
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

const cursorVariants = cva(
  'absolute w-0.5 transition-all duration-150',
  {
    variants: {
      variant: {
        default: 'bg-blue-500',
        user: 'h-5',
        selection: 'bg-blue-200 opacity-50 h-5'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const userIndicatorVariants = cva(
  'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200',
  {
    variants: {
      status: {
        online: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        offline: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        away: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
        editing: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      }
    }
  }
)

// ============================================================================
// 组件 Props
// ============================================================================

interface RealTimeEditorProps extends VariantProps<typeof editorVariants> {
  documentId: string
  userId: string
  initialContent?: string
  language?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
  onContentChange?: (content: string, operation: EditOperation) => void
  onUserJoined?: (user: User) => void
  onUserLeft?: (userId: string) => void
  onConflictDetected?: (conflict: ConflictResolution) => void
  onCursorMove?: (cursor: CursorPosition) => void
  onSelectionChange?: (selection: SelectionRange) => void
}

// ============================================================================
// 光标组件
// ============================================================================

interface UserCursorProps {
  cursor: CursorPosition
  selection?: SelectionRange
  userName: string
  userColor: string
  isSelection?: boolean
}

function UserCursor({ cursor, selection, userName, userColor, isSelection }: UserCursorProps) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    // 计算光标位置（这里简化处理，实际需要根据编辑器的行高和字符宽度计算）
    const lineHeight = 24 // 假设行高
    const charWidth = 8 // 假设字符宽度

    setPosition({
      top: cursor.line * lineHeight,
      left: cursor.column * charWidth,
      width: isSelection && selection ? Math.abs(selection.end.column - selection.start.column) * charWidth : 2,
      height: lineHeight
    })
  }, [cursor, selection, isSelection])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={cn(cursorVariants({ variant: isSelection ? 'selection' : 'user' }))}
        style={{
          ...position,
          backgroundColor: isSelection ? `${userColor}33` : userColor,
          borderColor: userColor,
        }}
      >
        {!isSelection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-6 left-0 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
            style={{ backgroundColor: userColor }}
          >
            {userName}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// 用户状态指示器
// ============================================================================

interface UserStatusIndicatorProps {
  user: User
  onClick?: () => void
}

function UserStatusIndicator({ user, onClick }: UserStatusIndicatorProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(userIndicatorVariants({ status: user.status }))}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: user.color }}
      />
      <span className="truncate max-w-24">{user.name}</span>
      {user.status === 'editing' && (
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      )}
    </motion.button>
  )
}

// ============================================================================
// 冲突解决弹窗
// ============================================================================

interface ConflictResolutionModalProps {
  conflict: ConflictResolution
  onResolve: (resolution: ConflictResolution) => void
  onDismiss: () => void
}

function ConflictResolutionModal({ conflict, onResolve, onDismiss }: ConflictResolutionModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              检测到编辑冲突
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              另一个用户同时编辑了相同内容
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              您的修改:
            </p>
            <p className="text-sm text-gray-900 dark:text-white font-mono">
              {conflict.originalOperation.content}
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
              其他用户的修改:
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-100 font-mono">
              {conflict.resolvedOperation.content}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onResolve(conflict)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            接受其他用户的修改
          </button>
          <button
            onClick={() => onResolve({
              ...conflict,
              resolvedOperation: conflict.originalOperation
            })}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            保留我的修改
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================================
// 主组件
// ============================================================================

export function RealTimeEditor({
  documentId,
  userId,
  initialContent = '',
  language = 'typescript',
  placeholder = '开始输入...',
  disabled = false,
  readOnly = false,
  variant,
  size,
  className,
  onContentChange,
  onUserJoined,
  onUserLeft,
  onConflictDetected,
  onCursorMove,
  onSelectionChange
}: RealTimeEditorProps) {
  // 核心状态
  const [content, setContent] = useState(initialContent)
  const [isConnected, setIsConnected] = useState(false)
  const [session, setSession] = useState<CollaborationSession | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [userCursors, setUserCursors] = useState<Map<string, CursorPosition>>(new Map())
  const [userSelections, setUserSelections] = useState<Map<string, SelectionRange>>(new Map())
  const [activeConflict, setActiveConflict] = useState<ConflictResolution | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    line: 0,
    column: 0,
    userId,
    userName: '当前用户',
    color: '#3B82F6',
    timestamp: new Date()
  })

  // 引用
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const collaborationServiceRef = useRef<CollaborationService | null>(null)

  // 初始化协作服务
  useEffect(() => {
    if (!documentId || !userId) return

    const service = getCollaborationService({
      documentId,
      userId,
      onUserJoined: (user) => {
        setOnlineUsers(prev => [...prev.filter(u => u.id !== user.id), user])
        onUserJoined?.(user)
      },
      onUserLeft: (leftUserId) => {
        setOnlineUsers(prev => prev.filter(u => u.id !== leftUserId))
        setUserCursors(prev => {
          const newMap = new Map(prev)
          newMap.delete(leftUserId)
          return newMap
        })
        setUserSelections(prev => {
          const newMap = new Map(prev)
          newMap.delete(leftUserId)
          return newMap
        })
        onUserLeft?.(leftUserId)
      },
      onContentChanged: (operation) => {
        // 应用远程操作
        setContent(prev => applyOperation(prev, operation))
        onContentChange?.(content, operation)
      },
      onConflictDetected: (conflict) => {
        setActiveConflict(conflict)
        onConflictDetected?.(conflict)
      },
      onError: (error) => {
        console.error('Collaboration service error:', error)
      }
    })

    collaborationServiceRef.current = service

    // 连接到协作会话
    service.connect()

    // 监听服务事件
    service.on('session_joined', (sessionData: CollaborationSession) => {
      setSession(sessionData)
      setOnlineUsers(sessionData.users)
      setIsConnected(true)
    })

    service.on('cursor_position', (cursor: CursorPosition) => {
      if (cursor.userId !== userId) {
        setUserCursors(prev => new Map(prev.set(cursor.userId, cursor)))
      }
    })

    service.on('selection_range', (selection: SelectionRange) => {
      if (selection.userId !== userId) {
        setUserSelections(prev => new Map(prev.set(selection.userId, selection)))
      }
    })

    service.on('user_status', (data: { userId: string; status: UserStatus }) => {
      setOnlineUsers(prev => prev.map(user =>
        user.id === data.userId ? { ...user, status: data.status } : user
      ))
    })

    return () => {
      service.disconnect()
    }
  }, [documentId, userId])

  // 处理内容变化
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly || disabled) return

    const newContent = e.target.value
    const operation: EditOperation = {
      id: generateOperationId(),
      type: 'insert',
      userId,
      timestamp: new Date(),
      content: newContent,
      position: cursorPosition,
      version: session?.version || 0
    }

    setContent(newContent)

    // 发送操作到协作服务
    if (collaborationServiceRef.current) {
      collaborationServiceRef.current.sendEditOperation(operation)
    }

    onContentChange?.(newContent, operation)
  }, [userId, cursorPosition, session, readOnly, disabled, onContentChange])

  // 处理光标位置变化
  const handleCursorPositionChange = useCallback(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const text = textarea.value
    const cursorIndex = textarea.selectionStart

    // 计算行和列
    const lines = text.substring(0, cursorIndex).split('\n')
    const line = lines.length - 1
    const column = lines[lines.length - 1].length

    const newCursor: CursorPosition = {
      line,
      column,
      userId,
      userName: '当前用户',
      color: '#3B82F6',
      timestamp: new Date()
    }

    setCursorPosition(newCursor)

    // 发送光标位置
    if (collaborationServiceRef.current) {
      collaborationServiceRef.current.sendCursorPosition(newCursor)
    }

    onCursorMove?.(newCursor)
  }, [userId, onCursorMove])

  // 处理选择变化
  const handleSelectionChange = useCallback(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const text = textarea.value
    const startIndex = textarea.selectionStart
    const endIndex = textarea.selectionEnd

    if (startIndex === endIndex) return

    // 计算起始和结束位置的行列
    const startLines = text.substring(0, startIndex).split('\n')
    const endLines = text.substring(0, endIndex).split('\n')

    const startLine = startLines.length - 1
    const startColumn = startLines[startLines.length - 1].length
    const endLine = endLines.length - 1
    const endColumn = endLines[endLines.length - 1].length

    const selection: SelectionRange = {
      start: {
        line: startLine,
        column: startColumn,
        userId,
        userName: '当前用户',
        color: '#3B82F6',
        timestamp: new Date()
      },
      end: {
        line: endLine,
        column: endColumn,
        userId,
        userName: '当前用户',
        color: '#3B82F6',
        timestamp: new Date()
      },
      userId,
      userName: '当前用户',
      color: '#3B82F6',
      timestamp: new Date()
    }

    // 发送选择范围
    if (collaborationServiceRef.current) {
      collaborationServiceRef.current.sendSelectionRange(selection)
    }

    onSelectionChange?.(selection)
  }, [userId, onSelectionChange])

  // 处理焦点变化
  const handleFocus = useCallback(() => {
    setIsFocused(true)
    if (collaborationServiceRef.current) {
      collaborationServiceRef.current.sendUserStatus('editing')
    }
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (collaborationServiceRef.current) {
      collaborationServiceRef.current.sendUserStatus('online')
    }
  }, [])

  // 解决冲突
  const handleConflictResolve = useCallback((resolution: ConflictResolution) => {
    setActiveConflict(null)

    if (collaborationServiceRef.current) {
      collaborationServiceRef.current.resolveConflict(resolution.operationId, resolution)
    }
  }, [])

  // 生成操作ID
  const generateOperationId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // 应用操作到内容
  const applyOperation = useCallback((currentContent: string, operation: EditOperation): string => {
    switch (operation.type) {
      case 'insert':
        return currentContent
      case 'delete':
        return currentContent
      case 'replace':
        return currentContent
      default:
        return currentContent
    }
  }, [])

  // 获取编辑器变体
  const editorVariant = useMemo(() => {
    if (activeConflict) return 'error'
    if (onlineUsers.length > 1) return 'collaboration'
    if (isFocused) return 'focused'
    return 'default'
  }, [activeConflict, onlineUsers.length, isFocused])

  return (
    <div className={cn('relative', className)}>
      {/* 连接状态指示器 */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          isConnected ? 'bg-green-500' : 'bg-red-500'
        )} />
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {isConnected ? '已连接' : '连接中...'}
        </span>
      </div>

      {/* 在线用户指示器 */}
      <AnimatePresence>
        {onlineUsers.filter(u => u.id !== userId).map(user => (
          <div key={user.id} className="absolute top-2 left-2 z-10">
            <UserStatusIndicator user={user} />
          </div>
        ))}
      </AnimatePresence>

      {/* 编辑器容器 */}
      <div
        ref={containerRef}
        className={cn(editorVariants({ variant: editorVariant, size }), className)}
        onClick={() => textareaRef.current?.focus()}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onSelect={handleSelectionChange}
          onKeyUp={handleCursorPositionChange}
          onMouseUp={handleCursorPositionChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className="w-full h-64 p-4 bg-transparent outline-none resize-none font-mono text-sm leading-6"
          style={{ minHeight: '200px' }}
        />

        {/* 用户光标和选择 */}
        {Array.from(userCursors.entries()).map(([userId, cursor]) => {
          const user = onlineUsers.find(u => u.id === userId)
          const selection = userSelections.get(userId)

          if (!user) return null

          return (
            <UserCursor
              key={userId}
              cursor={cursor}
              selection={selection}
              userName={user.name}
              userColor={user.color}
              isSelection={!!selection}
            />
          )
        })}
      </div>

      {/* 协作状态栏 */}
      {onlineUsers.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-700 dark:text-purple-300">
              正在协作:
            </span>
            <div className="flex -space-x-2">
              {onlineUsers.map(user => (
                <div
                  key={user.id}
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <span className="text-xs text-purple-600 dark:text-purple-400">
            实时协作已启用
          </span>
        </motion.div>
      )}

      {/* 冲突解决弹窗 */}
      <AnimatePresence>
        {activeConflict && (
          <ConflictResolutionModal
            conflict={activeConflict}
            onResolve={handleConflictResolve}
            onDismiss={() => setActiveConflict(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
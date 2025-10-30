/**
 * 协作编辑 Hook
 * 提供实时协作编辑的核心功能
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getCollaborationService, type CollaborationService } from '../services/collaboration-service'
import type {
  User,
  EditOperation,
  CursorPosition,
  SelectionRange,
  ConflictResolution,
  CollaborationSession,
  UseCollaborationOptions
} from '../types'

export interface UseCollaborationReturn {
  // 连接状态
  isConnected: boolean
  isConnecting: boolean
  error: string | null

  // 会话信息
  session: CollaborationSession | null
  onlineUsers: User[]
  currentUser: User | null

  // 光标和选择
  userCursors: Map<string, CursorPosition>
  userSelections: Map<string, SelectionRange>

  // 操作
  connect: () => Promise<void>
  disconnect: () => void
  sendEditOperation: (operation: EditOperation) => void
  sendCursorPosition: (cursor: CursorPosition) => void
  sendSelectionRange: (selection: SelectionRange) => void
  resolveConflict: (conflict: ConflictResolution, resolution: ConflictResolution) => void

  // 事件处理
  onUserJoined: (callback: (user: User) => void) => void
  onUserLeft: (callback: (userId: string) => void) => void
  onContentChanged: (callback: (operation: EditOperation) => void) => void
  onConflictDetected: (callback: (conflict: ConflictResolution) => void) => void
  onError: (callback: (error: any) => void) => void
}

export function useCollaboration(options: UseCollaborationOptions): UseCollaborationReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<CollaborationSession | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userCursors, setUserCursors] = useState<Map<string, CursorPosition>>(new Map())
  const [userSelections, setUserSelections] = useState<Map<string, SelectionRange>>(new Map())

  const serviceRef = useRef<CollaborationService | null>(null)
  const eventCallbacksRef = useRef<{
    onUserJoined: ((user: User) => void)[]
    onUserLeft: ((userId: string) => void)[]
    onContentChanged: ((operation: EditOperation) => void)[]
    onConflictDetected: ((conflict: ConflictResolution) => void)[]
    onError: ((error: any) => void)[]
  }>({
    onUserJoined: [],
    onUserLeft: [],
    onContentChanged: [],
    onConflictDetected: [],
    onError: []
  })

  // 初始化服务
  useEffect(() => {
    if (!options.documentId || !options.userId) return

    const service = getCollaborationService({
      ...options,
      onUserJoined: (user) => {
        setOnlineUsers(prev => [...prev.filter(u => u.id !== user.id), user])
        eventCallbacksRef.current.onUserJoined.forEach(callback => callback(user))
        options.onUserJoined?.(user)
      },
      onUserLeft: (userId) => {
        setOnlineUsers(prev => prev.filter(u => u.id !== userId))
        setUserCursors(prev => {
          const newMap = new Map(prev)
          newMap.delete(userId)
          return newMap
        })
        setUserSelections(prev => {
          const newMap = new Map(prev)
          newMap.delete(userId)
          return newMap
        })
        eventCallbacksRef.current.onUserLeft.forEach(callback => callback(userId))
        options.onUserLeft?.(userId)
      },
      onContentChanged: (operation) => {
        eventCallbacksRef.current.onContentChanged.forEach(callback => callback(operation))
        options.onContentChanged?.(operation)
      },
      onConflictDetected: (conflict) => {
        eventCallbacksRef.current.onConflictDetected.forEach(callback => callback(conflict))
        options.onConflictDetected?.(conflict)
      },
      onError: (error) => {
        setError(error.message)
        eventCallbacksRef.current.onError.forEach(callback => callback(error))
        options.onError?.(error)
      }
    })

    serviceRef.current = service

    // 监听服务事件
    service.on('session_joined', (sessionData: CollaborationSession) => {
      setSession(sessionData)
      setOnlineUsers(sessionData.users)
      setCurrentUser(sessionData.users.find(u => u.id === options.userId) || null)
    })

    service.on('cursor_position', (cursor: CursorPosition) => {
      if (cursor.userId !== options.userId) {
        setUserCursors(prev => new Map(prev.set(cursor.userId, cursor)))
      }
    })

    service.on('selection_range', (selection: SelectionRange) => {
      if (selection.userId !== options.userId) {
        setUserSelections(prev => new Map(prev.set(selection.userId, selection)))
      }
    })

    service.on('user_status', (data: { userId: string; status: User['status'] }) => {
      setOnlineUsers(prev => prev.map(user =>
        user.id === data.userId ? { ...user, status: data.status } : user
      ))
    })

    return () => {
      service.disconnect()
    }
  }, [options])

  // 连接到协作会话
  const connect = useCallback(async () => {
    if (!serviceRef.current) return

    setIsConnecting(true)
    setError(null)

    try {
      await serviceRef.current.connect()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // 断开连接
  const disconnect = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.disconnect()
      setIsConnected(false)
      setSession(null)
      setOnlineUsers([])
      setCurrentUser(null)
      setUserCursors(new Map())
      setUserSelections(new Map())
    }
  }, [])

  // 发送编辑操作
  const sendEditOperation = useCallback((operation: EditOperation) => {
    if (serviceRef.current) {
      serviceRef.current.sendEditOperation(operation)
    }
  }, [])

  // 发送光标位置
  const sendCursorPosition = useCallback((cursor: CursorPosition) => {
    if (serviceRef.current) {
      serviceRef.current.sendCursorPosition(cursor)
    }
  }, [])

  // 发送选择范围
  const sendSelectionRange = useCallback((selection: SelectionRange) => {
    if (serviceRef.current) {
      serviceRef.current.sendSelectionRange(selection)
    }
  }, [])

  // 解决冲突
  const resolveConflict = useCallback((conflict: ConflictResolution, resolution: ConflictResolution) => {
    if (serviceRef.current) {
      serviceRef.current.resolveConflict(conflict.operationId, resolution)
    }
  }, [])

  // 事件处理函数
  const onUserJoined = useCallback((callback: (user: User) => void) => {
    eventCallbacksRef.current.onUserJoined.push(callback)
  }, [])

  const onUserLeft = useCallback((callback: (userId: string) => void) => {
    eventCallbacksRef.current.onUserLeft.push(callback)
  }, [])

  const onContentChanged = useCallback((callback: (operation: EditOperation) => void) => {
    eventCallbacksRef.current.onContentChanged.push(callback)
  }, [])

  const onConflictDetected = useCallback((callback: (conflict: ConflictResolution) => void) => {
    eventCallbacksRef.current.onConflictDetected.push(callback)
  }, [])

  const onError = useCallback((callback: (error: any) => void) => {
    eventCallbacksRef.current.onError.push(callback)
  }, [])

  return {
    isConnected,
    isConnecting,
    error,
    session,
    onlineUsers,
    currentUser,
    userCursors,
    userSelections,
    connect,
    disconnect,
    sendEditOperation,
    sendCursorPosition,
    sendSelectionRange,
    resolveConflict,
    onUserJoined,
    onUserLeft,
    onContentChanged,
    onConflictDetected,
    onError
  }
}
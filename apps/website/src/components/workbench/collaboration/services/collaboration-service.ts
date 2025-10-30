/**
 * 协作编辑核心服务
 * 处理实时协作、WebSocket连接、冲突检测和解决
 */

import type {
  User,
  EditOperation,
  WebSocketMessage,
  CollaborationSession,
  CursorPosition,
  SelectionRange,
  ConflictResolution,
  CollaborationEvent,
  UseCollaborationOptions,
  CollaborationConfig,
  ApiResponse
} from '../types'

export class CollaborationService {
  private ws: WebSocket | null = null
  private session: CollaborationSession | null = null
  private config: CollaborationConfig
  private options: UseCollaborationOptions
  private reconnectAttempts = 0
  private heartbeatInterval: NodeJS.Timeout | null = null
  private pendingOperations: EditOperation[] = []
  private eventListeners: Map<string, Function[]> = new Map()

  constructor(options: UseCollaborationOptions) {
    this.options = options
    this.config = this.mergeConfig(options.config)
  }

  private mergeConfig(userConfig?: Partial<CollaborationConfig>): CollaborationConfig {
    const defaultConfig: CollaborationConfig = {
      websocket: {
        url: 'wss://api.xorigo-ui.com/ws',
        reconnectInterval: 3000,
        maxReconnectAttempts: 10,
        heartbeatInterval: 30000,
        timeout: 10000
      },
      versionControl: {
        autoSave: true,
        autoSaveInterval: 5000,
        maxVersions: 100,
        compressionEnabled: true,
        diffAlgorithm: 'myers'
      },
      sharing: {
        defaultExpiryDays: 30,
        maxAccessCount: 1000,
        requirePasswordForPublic: false,
        allowAnonymousComments: true,
        enableLinkTracking: true
      },
      templates: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['.ts', '.tsx', '.js', '.jsx', '.json', '.md'],
        enableVersioning: true,
        enableRating: true,
        requireApproval: false,
        categories: ['layout', 'component', 'pattern', 'business-logic']
      },
      realTime: {
        enableRealTimeEditing: true,
        cursorUpdateInterval: 1000,
        conflictResolutionStrategy: 'operational_transform',
        maxConcurrentUsers: 50,
        enablePresenceIndicators: true
      }
    }

    return {
      websocket: { ...defaultConfig.websocket, ...userConfig?.websocket },
      versionControl: { ...defaultConfig.versionControl, ...userConfig?.versionControl },
      sharing: { ...defaultConfig.sharing, ...userConfig?.sharing },
      templates: { ...defaultConfig.templates, ...userConfig?.templates },
      realTime: { ...defaultConfig.realTime, ...userConfig?.realTime }
    }
  }

  // 连接到协作会话
  async connect(): Promise<void> {
    try {
      if (this.ws?.readyState === WebSocket.OPEN) {
        return
      }

      this.ws = new WebSocket(this.config.websocket.url)

      this.ws.onopen = this.handleWebSocketOpen.bind(this)
      this.ws.onmessage = this.handleWebSocketMessage.bind(this)
      this.ws.onclose = this.handleWebSocketClose.bind(this)
      this.ws.onerror = this.handleWebSocketError.bind(this)

      await this.waitForConnection()
    } catch (error) {
      this.options.onError?.({
        code: 'CONNECTION_ERROR',
        message: 'Failed to connect to collaboration server',
        details: { error }
      })
    }
  }

  // 断开连接
  disconnect(): void {
    this.clearHeartbeat()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.session = null
    this.pendingOperations = []
  }

  // 发送WebSocket消息
  private sendMessage(type: string, payload: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, queuing message')
      return
    }

    const message: WebSocketMessage = {
      type: type as any,
      payload,
      userId: this.options.userId,
      timestamp: new Date(),
      messageId: this.generateMessageId()
    }

    this.ws.send(JSON.stringify(message))
  }

  // 处理WebSocket连接打开
  private handleWebSocketOpen(): void {
    console.log('WebSocket connected')
    this.reconnectAttempts = 0

    // 加入协作会话
    this.sendMessage('join_session', {
      documentId: this.options.documentId,
      userId: this.options.userId
    })

    // 启动心跳
    this.startHeartbeat()
  }

  // 处理WebSocket消息
  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      this.handleIncomingMessage(message)
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  // 处理WebSocket连接关闭
  private handleWebSocketClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason)
    this.clearHeartbeat()

    // 自动重连
    if (event.code !== 1000 && this.reconnectAttempts < this.config.websocket.maxReconnectAttempts) {
      this.scheduleReconnect()
    }
  }

  // 处理WebSocket错误
  private handleWebSocketError(error: Event): void {
    console.error('WebSocket error:', error)
    this.options.onError?.({
      code: 'WEBSOCKET_ERROR',
      message: 'WebSocket connection error',
      details: { error }
    })
  }

  // 处理收到的消息
  private handleIncomingMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'session_joined':
        this.handleSessionJoined(message.payload)
        break
      case 'user_joined':
        this.handleUserJoined(message.payload)
        break
      case 'user_left':
        this.handleUserLeft(message.payload)
        break
      case 'cursor_position':
        this.handleCursorPosition(message.payload)
        break
      case 'selection_range':
        this.handleSelectionRange(message.payload)
        break
      case 'edit_operation':
        this.handleEditOperation(message.payload)
        break
      case 'conflict_detected':
        this.handleConflictDetected(message.payload)
        break
      case 'user_status':
        this.handleUserStatus(message.payload)
        break
      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  // 处理会话加入成功
  private handleSessionJoined(payload: any): void {
    this.session = payload.session
    this.emit('session_joined', payload.session)
  }

  // 处理用户加入
  private handleUserJoined(payload: any): void {
    this.emit('user_joined', payload.user)
    this.options.onUserJoined?.(payload.user)
  }

  // 处理用户离开
  private handleUserLeft(payload: any): void {
    this.emit('user_left', payload.userId)
    this.options.onUserLeft?.(payload.userId)
  }

  // 处理光标位置更新
  private handleCursorPosition(payload: any): void {
    this.emit('cursor_position', payload.cursor)
  }

  // 处理选择范围更新
  private handleSelectionRange(payload: any): void {
    this.emit('selection_range', payload.selection)
  }

  // 处理编辑操作
  private handleEditOperation(payload: any): void {
    const operation: EditOperation = payload.operation
    this.emit('edit_operation', operation)
    this.options.onContentChanged?.(operation)
  }

  // 处理冲突检测
  private handleConflictDetected(payload: any): void {
    const conflict: ConflictResolution = payload.conflict
    this.emit('conflict_detected', conflict)
    this.options.onConflictDetected?.(conflict)
  }

  // 处理用户状态更新
  private handleUserStatus(payload: any): void {
    this.emit('user_status', payload)
  }

  // 发送编辑操作
  sendEditOperation(operation: EditOperation): void {
    this.sendMessage('edit_operation', { operation })
  }

  // 发送光标位置
  sendCursorPosition(cursor: CursorPosition): void {
    this.sendMessage('cursor_position', { cursor })
  }

  // 发送选择范围
  sendSelectionRange(selection: SelectionRange): void {
    this.sendMessage('selection_range', { selection })
  }

  // 发送用户状态
  sendUserStatus(status: User['status']): void {
    this.sendMessage('user_status', { status })
  }

  // 解决冲突
  resolveConflict(conflictId: string, resolution: ConflictResolution): void {
    this.sendMessage('conflict_resolved', {
      conflictId,
      resolution
    })
  }

  // 等待WebSocket连接
  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('WebSocket not initialized'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'))
      }, this.config.websocket.timeout)

      this.ws.addEventListener('open', () => {
        clearTimeout(timeout)
        resolve()
      }, { once: true })

      this.ws.addEventListener('error', () => {
        clearTimeout(timeout)
        reject(new Error('Connection failed'))
      }, { once: true })
    })
  }

  // 安排重连
  private scheduleReconnect(): void {
    setTimeout(() => {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.websocket.maxReconnectAttempts})`)
      this.connect()
    }, this.config.websocket.reconnectInterval)
  }

  // 启动心跳
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendMessage('heartbeat', { timestamp: new Date() })
    }, this.config.websocket.heartbeatInterval)
  }

  // 清除心跳
  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // 生成消息ID
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // 事件监听器管理
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => callback(data))
    }
  }

  // 获取当前会话信息
  getSession(): CollaborationSession | null {
    return this.session
  }

  // 获取连接状态
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  // 获取当前在线用户
  getOnlineUsers(): User[] {
    return this.session?.users.filter(user => user.status === 'online') || []
  }

  // 应用操作转换
  applyOperationalTransform(operation: EditOperation, pendingOperations: EditOperation[]): EditOperation {
    let transformedOperation = { ...operation }

    for (const pendingOp of pendingOperations) {
      transformedOperation = this.transformOperation(transformedOperation, pendingOp)
    }

    return transformedOperation
  }

  // 转换单个操作
  private transformOperation(op1: EditOperation, op2: EditOperation): EditOperation {
    // 实现操作转换算法
    if (op1.position.line < op2.position.line) {
      return op1
    } else if (op1.position.line > op2.position.line) {
      return {
        ...op1,
        position: {
          ...op1.position,
          line: op1.position.line + (op2.type === 'insert' ? 1 : op2.type === 'delete' ? -1 : 0)
        }
      }
    } else {
      // 同一行
      if (op1.position.column <= op2.position.column) {
        return op1
      } else {
        const offset = op2.type === 'insert' ? op2.content.length : (op2.type === 'delete' ? -op2.length! : 0)
        return {
          ...op1,
          position: {
            ...op1.position,
            column: op1.position.column + offset
          }
        }
      }
    }
  }

  // 检测操作冲突
  detectConflict(operation: EditOperation, existingOperations: EditOperation[]): ConflictResolution | null {
    // 检查是否存在冲突
    for (const existingOp of existingOperations) {
      if (this.hasConflict(operation, existingOp)) {
        return {
          operationId: operation.id,
          conflictType: 'concurrent_edit',
          resolutionStrategy: this.config.realTime.conflictResolutionStrategy,
          resolvedOperation: operation,
          originalOperation: existingOp,
          timestamp: new Date()
        }
      }
    }

    return null
  }

  // 检查两个操作是否冲突
  private hasConflict(op1: EditOperation, op2: EditOperation): boolean {
    // 简单的冲突检测逻辑
    if (op1.position.line !== op2.position.line) {
      return false
    }

    const op1End = op1.position.column + (op1.type === 'insert' ? op1.content.length : (op1.length || 0))
    const op2End = op2.position.column + (op2.type === 'insert' ? op2.content.length : (op2.length || 0))

    return !(op1End <= op2.position.column || op2End <= op1.position.column)
  }

  // 批量发送操作
  sendBatchOperations(operations: EditOperation[]): void {
    this.sendMessage('batch_operations', { operations })
  }

  // 同步文档状态
  async syncDocument(): Promise<ApiResponse> {
    try {
      this.sendMessage('sync_request', {
        documentId: this.options.documentId,
        lastKnownVersion: this.session?.version
      })

      return {
        success: true,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: 'Failed to sync document',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }
}

// 导出单例实例
let collaborationServiceInstance: CollaborationService | null = null

export function getCollaborationService(options: UseCollaborationOptions): CollaborationService {
  if (!collaborationServiceInstance) {
    collaborationServiceInstance = new CollaborationService(options)
  }
  return collaborationServiceInstance
}

// 清理函数
export function cleanupCollaborationService(): void {
  if (collaborationServiceInstance) {
    collaborationServiceInstance.disconnect()
    collaborationServiceInstance = null
  }
}
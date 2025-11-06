# @xorigo-ui/collaboration

实时协作编辑系统，支持多人同时编辑、光标同步和WebSocket通信。

## 功能特性

### 🚀 核心功能
- **WebSocket 实时通信** - 基于 Socket.IO 的低延迟实时通信
- **多人光标同步** - 实时显示其他用户的光标位置和选择
- **冲突解决算法** - 支持 CRDT 和操作变换
- **房间管理** - 支持多房间并发协作
- **用户存在状态** - 实时用户在线状态追踪

### 📊 性能指标
- ✅ 支持 10+ 用户同时协作
- ✅ 实时延迟 <200ms
- ✅ 自动重连机制
- ✅ 消息节流优化
- ✅ 内存高效管理

### 🔧 技术栈
- **WebSocket**: Socket.IO
- **CRDT**: Y.js
- **类型安全**: TypeScript 5.9
- **实时同步**: Operational Transform

## 安装

```bash
pnpm add @xorigo-ui/collaboration
```

## 快速开始

### 基础使用

```typescript
import { WebSocketManager, CursorSyncManager, createUser } from '@xorigo-ui/collaboration'

// 创建用户
const user = createUser('John Doe', 'https://example.com/avatar.jpg')

// 初始化 WebSocket 管理器
const wsManager = new WebSocketManager(user.id, {
  url: 'ws://localhost:3001',
  reconnection: true,
  reconnectionAttempts: 5
})

// 连接到服务器
await wsManager.connect()

// 加入房间
await wsManager.joinRoom('document-123', {
  maxUsers: 10,
  readOnly: false,
  requireAuth: false
})

// 监听事件
wsManager.on('userJoined', ({ user }) => {
  console.log('用户加入:', user.name)
})

wsManager.on('cursorUpdate', ({ userId, position }) => {
  console.log('光标更新:', userId, position)
})

// 发送消息
wsManager.sendMessage('document-123', {
  type: 'edit',
  userId: user.id,
  timestamp: Date.now(),
  data: '编辑内容'
})

// 更新光标位置
wsManager.updateCursor('document-123', {
  x: 100,
  y: 200,
  selection: { start: 10, end: 20 }
})
```

### 光标同步

```typescript
import { CursorSyncManager } from '@xorigo-ui/collaboration'

// 初始化光标同步
const cursorSync = new CursorSyncManager({
  container: editorContainer,
  config: {
    fadeDuration: 300,
    maxOpacity: 1,
    minOpacity: 0.3,
    showSelection: true,
    showName: true
  }
})

// 设置当前用户
cursorSync.setCurrentUser(user)

// 更新光标
cursorSync.updateCursor(userId, {
  x: 150,
  y: 250,
  selection: { start: 15, end: 25 }
})

// 监听光标事件
cursorSync.on('cursorUpdate', (cursor) => {
  console.log('光标显示更新:', cursor)
})
```

## API 参考

### WebSocketManager

#### 构造函数
```typescript
new WebSocketManager(userId?: string, options?: WebSocketOptions)
```

#### 主要方法

##### connect()
连接到 WebSocket 服务器
```typescript
await wsManager.connect(): Promise<void>
```

##### disconnect()
断开连接
```typescript
wsManager.disconnect(): void
```

##### joinRoom(roomId, config)
加入协作房间
```typescript
await wsManager.joinRoom('room-123', {
  maxUsers: 10,
  readOnly: false,
  requireAuth: false
}): Promise<void>
```

##### leaveRoom(roomId)
离开房间
```typescript
wsManager.leaveRoom('room-123'): void
```

##### sendMessage(roomId, message)
发送消息
```typescript
wsManager.sendMessage('room-123', {
  type: 'edit',
  userId: 'user-123',
  timestamp: Date.now(),
  data: content
}): void
```

##### updateCursor(roomId, position)
更新光标位置
```typescript
wsManager.updateCursor('room-123', {
  x: 100,
  y: 200,
  selection: { start: 10, end: 20 }
}): void
```

#### 事件

##### 'connect'
连接成功时触发

##### 'disconnect'
断开连接时触发

##### 'connectionStateChange'
连接状态变化时触发

##### 'userJoined'
用户加入房间时触发

##### 'userLeft'
用户离开房间时触发

##### 'cursorUpdate'
光标位置更新时触发

##### 'message'
收到消息时触发

##### 'error'
发生错误时触发

### CursorSyncManager

#### 构造函数
```typescript
new CursorSyncManager(options?: CursorSyncOptions)
```

#### 主要方法

##### setCurrentUser(user)
设置当前用户
```typescript
cursorSync.setCurrentUser(user: CollaborationUser): void
```

##### updateCursor(userId, position)
更新光标位置
```typescript
cursorSync.updateCursor(userId: string, position: CursorPosition): void
```

##### removeCursor(userId)
移除光标
```typescript
cursorSync.removeCursor(userId: string): void
```

##### setSelection(userId, selection)
设置文本选择
```typescript
cursorSync.setSelection(userId: string, selection: { start: number; end: number }): void
```

##### getAllCursors()
获取所有光标
```typescript
cursorSync.getAllCursors(): CursorDisplay[]
```

##### destroy()
销毁管理器
```typescript
cursorSync.destroy(): void
```

## 类型定义

### CollaborationUser
```typescript
interface CollaborationUser {
  id: string
  name: string
  avatar?: string
  color: string
  cursor?: CursorPosition
}
```

### CursorPosition
```typescript
interface CursorPosition {
  x: number
  y: number
  selection?: {
    start: number
    end: number
  }
}
```

### RoomConfig
```typescript
interface RoomConfig {
  maxUsers: number
  readOnly: boolean
  allowedUsers?: string[]
  requireAuth: boolean
}
```

### WebSocketOptions
```typescript
interface WebSocketOptions {
  url?: string
  reconnection?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
  timeout?: number
  auth?: Record<string, unknown>
}
```

## 最佳实践

### 1. 错误处理
```typescript
try {
  await wsManager.connect()
} catch (error) {
  console.error('连接失败:', error)
  // 显示用户友好的错误消息
}
```

### 2. 自动重连
```typescript
wsManager.on('connectionStateChange', ({ state, error }) => {
  if (state === 'disconnected') {
    // 显示重连状态
    showReconnectingStatus()
  } else if (state === 'connected') {
    // 隐藏重连状态
    hideReconnectingStatus()
  }
})
```

### 3. 消息节流
```typescript
// 对于频繁的编辑操作，使用节流
const throttledUpdate = throttle((content) => {
  wsManager.sendMessage(roomId, {
    type: 'edit',
    userId,
    timestamp: Date.now(),
    data: content
  })
}, 50)
```

### 4. 清理资源
```typescript
useEffect(() => {
  return () => {
    wsManager.disconnect()
    cursorSync.destroy()
  }
}, [])
```

## 性能优化

### 1. 光标更新节流
```typescript
const cursorSync = new CursorSyncManager({
  config: {
    positionUpdateThrottle: 50 // 50ms 节流
  }
})
```

### 2. 定期清理
```typescript
// 清理不活跃的光标
setInterval(() => {
  cursorSync.cleanupInactiveCursors()
}, 5000)
```

### 3. 内存管理
```typescript
// 定期清理事件监听器
wsManager.off('event', handler)

// 销毁时清理所有资源
wsManager.destroy()
cursorSync.destroy()
```

## 常见问题

### Q: 如何处理网络断开？
A: 使用 `connectionStateChange` 事件监听连接状态，并在断开时显示重连提示。WebSocketManager 内置了自动重连机制。

### Q: 如何限制房间用户数量？
A: 在 `joinRoom` 时设置 `maxUsers` 参数。当用户数量达到上限时，新的用户会被拒绝加入。

### Q: 如何实现只读模式？
A: 设置 `readOnly: true` 在 `RoomConfig` 中。这将阻止该房间内的编辑操作。

### Q: 如何自定义光标样式？
A: 修改 CursorSyncManager 的 CSS 样式或使用自定义组件覆盖默认光标渲染。

## 许可证

MIT

## 更新日志

### v2025.11.05
- 初始版本发布
- 支持 WebSocket 实时通信
- 支持多人光标同步
- 支持房间管理和用户存在状态
- 内置冲突解决算法

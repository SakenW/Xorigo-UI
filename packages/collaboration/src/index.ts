/**
 * Xorigo UI Collaboration
 *
 * Real-time collaborative editing system with WebSocket support,
 * multi-user cursor tracking, and CRDT-based synchronization.
 */

export { WebSocketManager } from './websocket-manager'
export type {
  WebSocketManager as IWebSocketManager,
  WebSocketOptions,
  Room,
  RoomConfig,
  CollaborationMessage,
  CollaborationUser,
  CursorPosition,
  SyncState
} from './types'

export { CursorSyncManager } from './cursor-sync'
export type {
  CursorDisplay,
  CursorDisplayConfig,
  CursorSyncOptions
} from './cursor-sync'

export {
  generateUserId,
  generateRoomId,
  getRandomColor,
  createUser,
  calculateDistance,
  throttle,
  debounce,
  formatTimestamp,
  isValidCursorPosition,
  mergeUpdates,
  generateChecksum,
  validateRoomId,
  getConnectionRetryDelay
} from './utils'

// Version
export const VERSION = '2025.11.05'

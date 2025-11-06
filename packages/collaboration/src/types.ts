/**
 * Xorigo UI Collaboration - Type Definitions
 */

import { Socket } from 'socket.io-client'

export interface CollaborationUser {
  id: string
  name: string
  avatar?: string
  color: string
  cursor?: CursorPosition
}

export interface CursorPosition {
  x: number
  y: number
  selection?: {
    start: number
    end: number
  }
}

export interface CollaborationMessage {
  type: 'cursor' | 'selection' | 'edit' | 'presence' | 'sync'
  userId: string
  timestamp: number
  data: unknown
}

export interface WebSocketOptions {
  url?: string
  reconnection?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
  timeout?: number
  auth?: Record<string, unknown>
}

export interface RoomConfig {
  maxUsers: number
  readOnly: boolean
  allowedUsers?: string[]
  requireAuth: boolean
}

export interface Room {
  id: string
  config: RoomConfig
  users: Map<string, CollaborationUser>
  createdAt: number
  lastActivity: number
}

export interface ConflictResolutionOptions {
  strategy: 'last-writer-wins' | 'operational-transform' | 'crdt'
  mergeThreshold: number
  timeout: number
}

export interface SyncState {
  documentId: string
  version: number
  checksum: string
  lastSync: number
}

export type EventCallback<T = unknown> = (data: T) => void

export interface WebSocketManager extends EventEmitter {
  connect(): Promise<void>
  disconnect(): void
  joinRoom(roomId: string, config: RoomConfig): Promise<void>
  leaveRoom(roomId: string): void
  sendMessage(roomId: string, message: CollaborationMessage): void
  updateCursor(roomId: string, position: CursorPosition): void
  updatePresence(presence: Partial<CollaborationUser>): void
  getRoom(roomId: string): Room | undefined
  getUsers(roomId: string): CollaborationUser[]
  isConnected(): boolean
  getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'error'
}

// Simple EventEmitter implementation
export interface EventEmitter {
  on<T>(event: string, callback: EventCallback<T>): void
  off<T>(event: string, callback: EventCallback<T>): void
  emit<T>(event: string, data: T): void
}

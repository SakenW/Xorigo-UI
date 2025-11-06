/**
 * Xorigo UI Collaboration - Utility Functions
 */

import { CollaborationUser, CursorPosition } from './types'

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateRoomId(): string {
  return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#D4A5A5', '#C9ADA7'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function createUser(name: string, avatar?: string): CollaborationUser {
  return {
    id: generateUserId(),
    name,
    avatar,
    color: getRandomColor()
  }
}

export function calculateDistance(pos1: CursorPosition, pos2: CursorPosition): number {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

export function isValidCursorPosition(pos: CursorPosition): boolean {
  return typeof pos.x === 'number' &&
         typeof pos.y === 'number' &&
         pos.x >= 0 &&
         pos.y >= 0 &&
         (!pos.selection || (
           typeof pos.selection.start === 'number' &&
           typeof pos.selection.end === 'number' &&
           pos.selection.start >= 0 &&
           pos.selection.end >= pos.selection.start
         ))
}

export function mergeUpdates(
  local: unknown,
  remote: unknown,
  timestamp: number
): unknown {
  // Simple LWW (Last Writer Wins) implementation
  // In a real CRDT implementation, this would be more sophisticated
  return {
    data: local,
    remote,
    timestamp,
    resolved: true
  }
}

export function generateChecksum(data: string): string {
  // Simple checksum generation (in production, use a proper hash function)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

export function validateRoomId(roomId: string): boolean {
  return /^room_[0-9]+_[a-z0-9]+$/.test(roomId)
}

export function getConnectionRetryDelay(attempt: number): number {
  // Exponential backoff with jitter
  const baseDelay = 1000
  const maxDelay = 30000
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
  return delay + Math.random() * 1000
}

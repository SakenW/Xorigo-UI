/**
 * Xorigo UI Collaboration - Cursor Synchronization
 *
 * Manages real-time cursor tracking and display for multiple concurrent users.
 * Supports smooth cursor animations, presence indicators, and conflict resolution.
 */

import { CursorPosition, CollaborationUser, EventEmitter } from './types'
import { throttle, debounce, isValidCursorPosition } from './utils'

export interface CursorDisplay {
  userId: string
  user: CollaborationUser
  position: CursorPosition
  timestamp: number
  visible: boolean
}

export interface CursorDisplayConfig {
  fadeDuration: number
  maxOpacity: number
  minOpacity: number
  blurRadius: number
  animationDuration: number
  showSelection: boolean
  showName: boolean
  positionUpdateThrottle: number
  cleanupInterval: number
}

export interface CursorSyncOptions {
  container?: HTMLElement
  config?: Partial<CursorDisplayConfig>
  onCursorUpdate?: (display: CursorDisplay) => void
  onUserJoin?: (user: CollaborationUser) => void
  onUserLeave?: (userId: string) => void
}

/**
 * Cursor Synchronization Manager
 *
 * Handles:
 * - Real-time cursor position tracking
 * - Smooth cursor animations and transitions
 * - Cursor presence indicators and user names
 * - Automatic cleanup of inactive cursors
 * - Throttled updates for performance optimization
 */
export class CursorSyncManager extends EventEmitter {
  private cursors = new Map<string, CursorDisplay>()
  private options: Required<CursorSyncOptions>
  private cleanupTimer: NodeJS.Timeout | null = null
  private positionUpdateHandler: (pos: CursorPosition) => void
  private visibilityHandler: () => void
  private currentUserId: string | null = null

  constructor(options: CursorSyncOptions = {}) {
    super()
    this.options = {
      container: options.container || document.body,
      config: {
        fadeDuration: options.config?.fadeDuration || 300,
        maxOpacity: options.config?.maxOpacity || 1,
        minOpacity: options.config?.minOpacity || 0.3,
        blurRadius: options.config?.blurRadius || 2,
        animationDuration: options.config?.animationDuration || 200,
        showSelection: options.config?.showSelection ?? true,
        showName: options.config?.showName ?? true,
        positionUpdateThrottle: options.config?.positionUpdateThrottle || 50,
        cleanupInterval: options.config?.cleanupInterval || 5000,
        ...options.config
      },
      onCursorUpdate: options.onCursorUpdate || (() => {}),
      onUserJoin: options.onUserJoin || (() => {}),
      onUserLeave: options.onUserLeave || (() => {})
    }

    // Throttled position update handler
    this.positionUpdateHandler = throttle(
      this.handlePositionUpdate.bind(this),
      this.options.config.positionUpdateThrottle
    )

    // Visibility change handler for cleanup
    this.visibilityHandler = debounce(
      this.handleVisibilityChange.bind(this),
      1000
    )

    this.setupEventListeners()
    this.startCleanupTimer()
  }

  private setupEventListeners(): void {
    if (typeof window !== 'undefined') {
      document.addEventListener('mousemove', this.positionUpdateHandler)
      document.addEventListener('visibilitychange', this.visibilityHandler)
      window.addEventListener('beforeunload', () => {
        this.destroy()
      })
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupInactiveCursors()
    }, this.options.config.cleanupInterval)
  }

  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  private handlePositionUpdate(event: MouseEvent): void {
    if (!this.currentUserId) return

    const position: CursorPosition = {
      x: event.clientX,
      y: event.clientY
    }

    if (isValidCursorPosition(position)) {
      this.updateCurrentUserCursor(position)
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Hide all cursors when document is hidden
      this.cursors.forEach(cursor => {
        cursor.visible = false
        this.updateCursorDisplay(cursor)
      })
    } else {
      // Show cursors when document becomes visible
      this.cursors.forEach(cursor => {
        cursor.visible = true
        this.updateCursorDisplay(cursor)
      })
    }
  }

  private cleanupInactiveCursors(): void {
    const now = Date.now()
    const timeout = 30000 // 30 seconds

    this.cursors.forEach((cursor, userId) => {
      if (now - cursor.timestamp > timeout) {
        this.removeCursor(userId)
        this.options.onUserLeave(userId)
        this.emit('userLeave', { userId })
      }
    })
  }

  private updateCurrentUserCursor(position: CursorPosition): void {
    if (!this.currentUserId) return

    const cursor = this.cursors.get(this.currentUserId)
    if (cursor) {
      cursor.position = position
      cursor.timestamp = Date.now()
      cursor.visible = true
      this.updateCursorDisplay(cursor)
      this.options.onCursorUpdate(cursor)
      this.emit('cursorUpdate', cursor)
    }
  }

  private updateCursorDisplay(cursor: CursorDisplay): void {
    // Create or update cursor element
    const element = this.getOrCreateCursorElement(cursor.userId)
    if (!element) return

    // Update position with smooth animation
    element.style.transform = `translate(${cursor.position.x}px, ${cursor.position.y}px)`

    // Update opacity based on visibility
    const opacity = cursor.visible ? this.options.config.maxOpacity : this.options.config.minOpacity
    element.style.opacity = opacity.toString()

    // Add animation class for smooth transitions
    element.classList.add('cursor-animating')

    // Update user name display
    if (this.options.config.showName) {
      const nameElement = element.querySelector('.cursor-name')
      if (nameElement) {
        nameElement.textContent = cursor.user.name
      }
    }

    // Update selection display
    if (this.options.config.showSelection && cursor.position.selection) {
      const selectionElement = element.querySelector('.cursor-selection')
      if (selectionElement) {
        const { start, end } = cursor.position.selection
        selectionElement.classList.toggle('visible', start !== end)
      }
    }
  }

  private getOrCreateCursorElement(userId: string): HTMLElement | null {
    let element = document.getElementById(`cursor-${userId}`)

    if (!element) {
      element = document.createElement('div')
      element.id = `cursor-${userId}`
      element.className = 'collaboration-cursor'
      element.innerHTML = this.createCursorHTML()
      this.options.container.appendChild(element)
    }

    return element
  }

  private createCursorHTML(): string {
    return `
      <div class="cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 2L7 16L10 13L14 17L12.5 18.5L16 22L17.5 16.5L14 13L10 16L7 16V2Z"/>
        </svg>
      </div>
      <div class="cursor-name"></div>
      <div class="cursor-selection"></div>
    `
  }

  setCurrentUser(user: CollaborationUser): void {
    this.currentUserId = user.id

    let cursor = this.cursors.get(user.id)
    if (!cursor) {
      cursor = {
        userId: user.id,
        user,
        position: { x: 0, y: 0 },
        timestamp: Date.now(),
        visible: true
      }
      this.cursors.set(user.id, cursor)
      this.options.onUserJoin(user)
      this.emit('userJoin', { user })
    } else {
      cursor.user = { ...cursor.user, ...user }
    }

    this.updateCursorDisplay(cursor)
  }

  updateCursor(userId: string, position: CursorPosition): void {
    const cursor = this.cursors.get(userId)
    if (!cursor || !isValidCursorPosition(position)) return

    cursor.position = position
    cursor.timestamp = Date.now()
    cursor.visible = true

    this.updateCursorDisplay(cursor)
    this.options.onCursorUpdate(cursor)
    this.emit('cursorUpdate', cursor)
  }

  removeCursor(userId: string): void {
    const cursor = this.cursors.get(userId)
    if (!cursor) return

    // Fade out cursor
    const element = document.getElementById(`cursor-${userId}`)
    if (element) {
      element.style.transition = `opacity ${this.options.config.fadeDuration}ms`
      element.style.opacity = '0'

      setTimeout(() => {
        element.remove()
      }, this.options.config.fadeDuration)
    }

    this.cursors.delete(userId)
    this.emit('cursorRemove', { userId })
  }

  setSelection(userId: string, selection: { start: number; end: number }): void {
    const cursor = this.cursors.get(userId)
    if (!cursor) return

    cursor.position.selection = selection
    this.updateCursorDisplay(cursor)
    this.emit('selectionUpdate', { userId, selection })
  }

  hideCursor(userId: string): void {
    const cursor = this.cursors.get(userId)
    if (!cursor) return

    cursor.visible = false
    this.updateCursorDisplay(cursor)
    this.emit('cursorHide', { userId })
  }

  showCursor(userId: string): void {
    const cursor = this.cursors.get(userId)
    if (!cursor) return

    cursor.visible = true
    this.updateCursorDisplay(cursor)
    this.emit('cursorShow', { userId })
  }

  getCursor(userId: string): CursorDisplay | undefined {
    return this.cursors.get(userId)
  }

  getAllCursors(): CursorDisplay[] {
    return Array.from(this.cursors.values())
  }

  getCursorCount(): number {
    return this.cursors.size
  }

  updateConfig(newConfig: Partial<CursorDisplayConfig>): void {
    this.options.config = { ...this.options.config, ...newConfig }
    this.cursors.forEach(cursor => this.updateCursorDisplay(cursor))
    this.emit('configUpdate', this.options.config)
  }

  setContainer(container: HTMLElement): void {
    // Remove existing cursor elements from old container
    this.cursors.forEach((_, userId) => {
      const element = document.getElementById(`cursor-${userId}`)
      if (element) {
        element.remove()
      }
    })

    this.options.container = container

    // Recreate cursor elements in new container
    this.cursors.forEach(cursor => this.updateCursorDisplay(cursor))
    this.emit('containerUpdate', container)
  }

  destroy(): void {
    // Clean up all cursor elements
    this.cursors.forEach((_, userId) => {
      const element = document.getElementById(`cursor-${userId}`)
      if (element) {
        element.remove()
      }
    })

    // Remove event listeners
    if (typeof window !== 'undefined') {
      document.removeEventListener('mousemove', this.positionUpdateHandler)
      document.removeEventListener('visibilitychange', this.visibilityHandler)
    }

    this.stopCleanupTimer()
    this.cursors.clear()
    this.clear()
  }
}

export default CursorSyncManager

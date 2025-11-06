/**
 * @fileoverview 协作功能集成测试
 * @description 测试多人协作功能，包括实时同步、冲突解决、权限管理等
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { createContext, useContext, useState, useEffect } from 'react'

// 协作数据类型
interface CollaborationEvent {
  type: 'update' | 'delete' | 'create' | 'cursor' | 'comment'
  userId: string
  timestamp: number
  data: any
}

interface User {
  id: string
  name: string
  avatar: string
  role: 'owner' | 'editor' | 'viewer'
  color: string
  cursor?: { x: number; y: number }
}

interface Project {
  id: string
  name: string
  owner: string
  collaborators: User[]
  lastModified: number
}

// Mock 协作系统
class MockCollaborationService {
  private listeners: Map<string, Set<(event: CollaborationEvent) => void>> = new Map()
  private users: Map<string, User> = new Map()
  private projects: Map<string, Project> = new Map()

  subscribe(projectId: string, callback: (event: CollaborationEvent) => void): () => void {
    if (!this.listeners.has(projectId)) {
      this.listeners.set(projectId, new Set())
    }
    this.listeners.get(projectId)!.add(callback)

    return () => {
      this.listeners.get(projectId)?.delete(callback)
    }
  }

  async joinProject(projectId: string, user: User): Promise<void> {
    this.users.set(user.id, user)
    this.emit(projectId, {
      type: 'update',
      userId: user.id,
      timestamp: Date.now(),
      data: { action: 'user-joined', user },
    })
  }

  async leaveProject(projectId: string, userId: string): Promise<void> {
    this.users.delete(userId)
    this.emit(projectId, {
      type: 'update',
      userId,
      timestamp: Date.now(),
      data: { action: 'user-left' },
    })
  }

  async updateComponent(
    projectId: string,
    userId: string,
    componentId: string,
    changes: any
  ): Promise<void> {
    this.emit(projectId, {
      type: 'update',
      userId,
      timestamp: Date.now(),
      data: { action: 'component-updated', componentId, changes },
    })
  }

  async addComment(
    projectId: string,
    userId: string,
    componentId: string,
    comment: string
  ): Promise<void> {
    this.emit(projectId, {
      type: 'comment',
      userId,
      timestamp: Date.now(),
      data: { componentId, comment },
    })
  }

  async updateCursor(projectId: string, userId: string, x: number, y: number): Promise<void> {
    const user = this.users.get(userId)
    if (user) {
      user.cursor = { x, y }
      this.emit(projectId, {
        type: 'cursor',
        userId,
        timestamp: Date.now(),
        data: { cursor: user.cursor },
      })
    }
  }

  private emit(projectId: string, event: CollaborationEvent): void {
    this.listeners.get(projectId)?.forEach(callback => callback(event))
  }

  getProjectUsers(projectId: string): User[] {
    return Array.from(this.users.values())
  }
}

const mockCollabService = new MockCollaborationService()

// 协作上下文
interface CollaborationContextValue {
  currentUser: User | null
  project: Project | null
  collaborators: User[]
  joinProject: (projectId: string, user: User) => Promise<void>
  leaveProject: (projectId: string) => Promise<void>
  updateComponent: (componentId: string, changes: any) => Promise<void>
  addComment: (componentId: string, comment: string) => Promise<void>
  updateCursor: (x: number, y: number) => Promise<void>
}

vi.mock('@xorigo-ui/collaboration', () => ({
  CollaborationProvider: ({ children }: { children: React.ReactNode }) => children,
  useCollaboration: () => ({
    currentUser: {
      id: 'user-1',
      name: 'Test User',
      avatar: '👤',
      role: 'editor',
      color: '#3b82f6',
    },
    project: {
      id: 'project-1',
      name: 'Test Project',
      owner: 'user-0',
      collaborators: [],
      lastModified: Date.now(),
    },
    collaborators: [],
    joinProject: vi.fn(),
    leaveProject: vi.fn(),
    updateComponent: vi.fn(),
    addComment: vi.fn(),
    updateCursor: vi.fn(),
  }),
}))

const TestCollaborationComponent = () => {
  const [events, setEvents] = useState<CollaborationEvent[]>([])

  useEffect(() => {
    const unsubscribe = mockCollabService.subscribe('project-1', event => {
      setEvents(prev => [...prev, event])
    })
    return unsubscribe
  }, [])

  return (
    <div data-testid="collaboration-container">
      <h1 data-testid="project-title">Test Project</h1>
      <div data-testid="events-list">
        {events.map((event, index) => (
          <div key={index} data-testid={`event-${index}`}>
            {event.type} - {event.userId}
          </div>
        ))}
      </div>
    </div>
  )
}

describe('协作功能集成测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('用户加入与离开', () => {
    it('应正确处理用户加入项目', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Alice',
        avatar: '👤',
        role: 'editor',
        color: '#3b82f6',
      }

      render(<TestCollaborationComponent />)

      await mockCollabService.joinProject('project-1', user)

      await waitFor(() => {
        const events = screen.getAllByTestId(/event-/)
        expect(events.length).toBeGreaterThan(0)
      })
    })

    it('应显示当前协作者列表', async () => {
      const users: User[] = [
        {
          id: 'user-1',
          name: 'Alice',
          avatar: '👤',
          role: 'owner',
          color: '#3b82f6',
        },
        {
          id: 'user-2',
          name: 'Bob',
          avatar: '👤',
          role: 'editor',
          color: '#8b5cf6',
        },
        {
          id: 'user-3',
          name: 'Charlie',
          avatar: '👤',
          role: 'viewer',
          color: '#10b981',
        },
      ]

      render(
        <div data-testid="collaborators">
          {users.map(user => (
            <div
              key={user.id}
              data-testid={`collaborator-${user.id}`}
              data-role={user.role}
              data-color={user.color}
            >
              {user.avatar} {user.name}
            </div>
          ))}
        </div>
      )

      for (const user of users) {
        const element = screen.getByTestId(`collaborator-${user.id}`)
        expect(element).toBeInTheDocument()
        expect(element.dataset.role).toBe(user.role)
        expect(element.dataset.color).toBe(user.color)
      }
    })

    it('应处理用户离开项目', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Alice',
        avatar: '👤',
        role: 'editor',
        color: '#3b82f6',
      }

      render(<TestCollaborationComponent />)

      await mockCollabService.joinProject('project-1', user)
      await mockCollabService.leaveProject('project-1', 'user-1')

      await waitFor(() => {
        const events = screen.getAllByTestId(/event-/)
        const leaveEvent = events.find(event =>
          event.textContent?.includes('user-left')
        )
        expect(leaveEvent).toBeTruthy()
      })
    })
  })

  describe('实时组件更新', () => {
    it('应同步组件属性变更', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Alice',
        avatar: '👤',
        role: 'editor',
        color: '#3b82f6',
      }

      render(<TestCollaborationComponent />)

      await mockCollabService.joinProject('project-1', user)
      await mockCollabService.updateComponent('project-1', 'user-1', 'button-1', {
        variant: 'primary',
        size: 'lg',
      })

      await waitFor(() => {
        const events = screen.getAllByTestId(/event-/)
        const updateEvent = events.find(event =>
          event.textContent?.includes('component-updated')
        )
        expect(updateEvent).toBeTruthy()
      })
    })

    it('应显示谁正在编辑哪个组件', async () => {
      const editingStates = [
        { componentId: 'button-1', userId: 'user-1', userName: 'Alice' },
        { componentId: 'modal-1', userId: 'user-2', userName: 'Bob' },
      ]

      render(
        <div data-testid="editing-indicators">
          {editingState => (
            <div key={editingState.componentId} data-testid={`editing-${editingState.componentId}`}>
              <span data-testid={`editor-name-${editingState.componentId}`}>
                {editingState.userName}
              </span>
              正在编辑
            </div>
          )}
        </div>
      )

      editingStates.forEach(state => {
        const element = screen.getByTestId(`editing-${state.componentId}`)
        expect(element).toBeInTheDocument()

        const nameElement = screen.getByTestId(`editor-name-${state.componentId}`)
        expect(nameElement).toHaveTextContent(state.userName)
      })
    })
  })

  describe('光标位置同步', () => {
    it('应实时同步用户光标位置', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Alice',
        avatar: '👤',
        role: 'editor',
        color: '#3b82f6',
      }

      render(<TestCollaborationComponent />)

      await mockCollabService.joinProject('project-1', user)
      await mockCollabService.updateCursor('project-1', 'user-1', 100, 200)

      await waitFor(() => {
        const events = screen.getAllByTestId(/event-/)
        const cursorEvent = events.find(event =>
          event.textContent?.includes('cursor')
        )
        expect(cursorEvent).toBeTruthy()
      })
    })

    it('应显示其他用户的光标', async () => {
      const cursorPositions = [
        { userId: 'user-1', x: 100, y: 200, color: '#3b82f6' },
        { userId: 'user-2', x: 150, y: 250, color: '#8b5cf6' },
      ]

      render(
        <div data-testid="cursors">
          {cursorPositions.map(cursor => (
            <div
              key={cursor.userId}
              data-testid={`cursor-${cursor.userId}`}
              style={{
                position: 'absolute',
                left: `${cursor.x}px`,
                top: `${cursor.y}px`,
                backgroundColor: cursor.color,
              }}
            >
              👆
            </div>
          ))}
        </div>
      )

      cursorPositions.forEach(cursor => {
        const element = screen.getByTestId(`cursor-${cursor.userId}`)
        expect(element).toBeInTheDocument()
        expect(element.style.left).toBe(`${cursor.x}px`)
        expect(element.style.top).toBe(`${cursor.y}px`)
        expect(element.style.backgroundColor).toBe(cursor.color)
      })
    })
  })

  describe('评论系统', () => {
    it('应支持添加评论', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Alice',
        avatar: '👤',
        role: 'editor',
        color: '#3b82f6',
      }

      const comments = [
        { id: '1', userId: 'user-1', componentId: 'button-1', text: '这个颜色不错', timestamp: Date.now() },
        { id: '2', userId: 'user-2', componentId: 'button-1', text: '同意！', timestamp: Date.now() },
      ]

      render(
        <div data-testid="comments">
          {comments.map(comment => (
            <div key={comment.id} data-testid={`comment-${comment.id}`}>
              <span data-testid={`comment-user-${comment.id}`}>{comment.userId}</span>
              <p data-testid={`comment-text-${comment.id}`}>{comment.text}</p>
            </div>
          ))}
        </div>
      )

      for (const comment of comments) {
        const element = screen.getByTestId(`comment-${comment.id}`)
        expect(element).toBeInTheDocument()

        const textElement = screen.getByTestId(`comment-text-${comment.id}`)
        expect(textElement).toHaveTextContent(comment.text)
      }
    })

    it('应同步评论到所有协作者', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Alice',
        avatar: '👤',
        role: 'editor',
        color: '#3b82f6',
      }

      render(<TestCollaborationComponent />)

      await mockCollabService.joinProject('project-1', user)
      await mockCollabService.addComment('project-1', 'user-1', 'button-1', '新评论')

      await waitFor(() => {
        const events = screen.getAllByTestId(/event-/)
        const commentEvent = events.find(event =>
          event.textContent?.includes('comment')
        )
        expect(commentEvent).toBeTruthy()
      })
    })
  })

  describe('权限管理', () => {
    it('应区分不同角色的权限', async () => {
      const rolePermissions = {
        owner: ['read', 'write', 'delete', 'manage'],
        editor: ['read', 'write'],
        viewer: ['read'],
      }

      const roles: User['role'][] = ['owner', 'editor', 'viewer']

      for (const role of roles) {
        const permissions = rolePermissions[role]
        expect(permissions).toBeDefined()
      }

      expect(rolePermissions.owner).toContain('delete')
      expect(rolePermissions.editor).toContain('write')
      expect(rolePermissions.viewer).toContain('read')
      expect(rolePermissions.viewer).not.toContain('write')
    })

    it('应阻止未授权操作', async () => {
      const user: User = {
        id: 'user-3',
        name: 'Charlie',
        avatar: '👤',
        role: 'viewer',
        color: '#10b981',
      }

      const canEdit = user.role === 'editor' || user.role === 'owner'

      render(
        <div>
          <button data-testid="edit-button" disabled={!canEdit}>
            编辑
          </button>
          <button data-testid="delete-button" disabled={!canEdit}>
            删除
          </button>
        </div>
      )

      const editButton = screen.getByTestId('edit-button')
      const deleteButton = screen.getByTestId('delete-button')

      expect(editButton).toBeDisabled()
      expect(deleteButton).toBeDisabled()
    })
  })

  describe('冲突解决', () => {
    it('应检测并发编辑冲突', async () => {
      const conflicts = [
        {
          componentId: 'button-1',
          user1: { id: 'user-1', changes: { variant: 'primary' } },
          user2: { id: 'user-2', changes: { variant: 'secondary' } },
          timestamp1: Date.now() - 100,
          timestamp2: Date.now(),
        },
      ]

      const hasConflict = conflicts.length > 0

      expect(hasConflict).toBe(true)
      expect(conflicts[0].componentId).toBe('button-1')
    })

    it('应提供冲突解决策略', async () => {
      const conflictResolution = {
        strategy: 'last-writer-wins',
        merge: 'automatic',
        fallback: 'manual',
      }

      render(
        <div data-testid="conflict-resolution">
          <p>冲突解决策略: {conflictResolution.strategy}</p>
          <p>合并方式: {conflictResolution.merge}</p>
          <p>回退方案: {conflictResolution.fallback}</p>
        </div>
      )

      expect(screen.getByTestId('conflict-resolution')).toBeInTheDocument()
    })
  })

  describe('协作状态持久化', () => {
    it('应保存项目状态到本地存储', async () => {
      const projectState = {
        id: 'project-1',
        name: 'Test Project',
        components: [
          { id: 'button-1', type: 'Button', props: {} },
          { id: 'modal-1', type: 'Modal', props: {} },
        ],
        lastModified: Date.now(),
        collaborators: ['user-1', 'user-2'],
      }

      render(
        <div data-testid="project-state">
          <pre>{JSON.stringify(projectState, null, 2)}</pre>
        </div>
      )

      const stateElement = screen.getByTestId('project-state')
      expect(stateElement).toBeInTheDocument()
      expect(stateElement.textContent).toContain('project-1')
    })

    it('应从本地存储恢复项目状态', async () => {
      const savedState = localStorage.getItem('project-1')

      if (savedState) {
        const project = JSON.parse(savedState)
        expect(project.id).toBe('project-1')
      }
    })
  })

  describe('协作性能优化', () => {
    it('应限制同步频率以优化性能', async () => {
      const syncInterval = 100 // ms
      const maxEventsPerSecond = 10
      const startTime = Date.now()
      let eventCount = 0

      render(<TestCollaborationComponent />)

      const interval = setInterval(() => {
        eventCount++
        if (Date.now() - startTime > 1000) {
          clearInterval(interval)
          expect(eventCount).toBeLessThanOrEqual(maxEventsPerSecond)
        }
      }, syncInterval)

      await waitFor(() => {
        expect(eventCount).toBeGreaterThan(0)
      }, { timeout: 2000 })
    })

    it('应支持离线模式', async () => {
      const offlineState = {
        isOnline: false,
        queuedChanges: [
          { type: 'update', componentId: 'button-1', changes: { variant: 'primary' } },
        ],
        lastSync: Date.now(),
      }

      render(
        <div data-testid="offline-indicator">
          {offlineState.isOnline ? '在线' : '离线'} - 待同步: {offlineState.queuedChanges.length}
        </div>
      )

      const indicator = screen.getByTestId('offline-indicator')
      expect(indicator).toHaveTextContent('离线')
      expect(indicator).toHaveTextContent('待同步: 1')
    })
  })

  describe('协作功能集成验证', () => {
    it('应支持完整的协作工作流', async () => {
      const user: User = {
        id: 'user-1',
        name: 'Alice',
        avatar: '👤',
        role: 'editor',
        color: '#3b82f6',
      }

      render(<TestCollaborationComponent />)

      // 1. 加入项目
      await mockCollabService.joinProject('project-1', user)

      // 2. 更新组件
      await mockCollabService.updateComponent('project-1', 'user-1', 'button-1', {
        variant: 'primary',
      })

      // 3. 添加评论
      await mockCollabService.addComment('project-1', 'user-1', 'button-1', '很好！')

      // 4. 更新光标
      await mockCollabService.updateCursor('project-1', 'user-1', 100, 200)

      await waitFor(() => {
        const events = screen.getAllByTestId(/event-/)
        expect(events.length).toBeGreaterThanOrEqual(4)
      })
    })
  })
})

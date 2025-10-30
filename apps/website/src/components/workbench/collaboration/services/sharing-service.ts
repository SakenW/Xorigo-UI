/**
 * 分享和评论服务
 * 处理文档分享、链接生成、评论系统和反馈收集
 */

import type {
  ShareableLink,
  Comment,
  Annotation,
  UseSharingOptions,
  ApiResponse
} from '../types'

export class SharingService {
  private options: UseSharingOptions
  private shareableLinks: Map<string, ShareableLink> = new Map()
  private comments: Map<string, Comment[]> = new Map()
  private annotations: Map<string, Annotation[]> = new Map()

  constructor(options: UseSharingOptions) {
    this.options = options
  }

  // 创建分享链接
  async createShareableLink(linkData: {
    expiresAt?: Date
    maxAccess?: number
    password?: string
    permissions: Partial<{
      canView: boolean
      canEdit: boolean
      canComment: boolean
      canDownload: boolean
      canShare: boolean
      requiresApproval: boolean
    }>
  }): Promise<ApiResponse<ShareableLink>> {
    try {
      const shareableLink: ShareableLink = {
        id: this.generateLinkId(),
        token: this.generateLinkToken(),
        documentId: this.options.documentId,
        createdBy: this.getCurrentUser(),
        createdAt: new Date(),
        expiresAt: linkData.expiresAt,
        maxAccess: linkData.maxAccess,
        password: linkData.password,
        permissions: {
          canView: true,
          canEdit: false,
          canComment: true,
          canDownload: false,
          canShare: false,
          requiresApproval: false,
          ...linkData.permissions
        },
        isActive: true,
        accessCount: 0
      }

      this.shareableLinks.set(shareableLink.id, shareableLink)
      this.options.onLinkCreated?.(shareableLink)

      return {
        success: true,
        data: shareableLink,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LINK_CREATE_ERROR',
          message: 'Failed to create shareable link',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 访问分享链接
  async accessShareableLink(token: string, password?: string): Promise<ApiResponse<{
    link: ShareableLink
    document: any
  }>> {
    try {
      const link = Array.from(this.shareableLinks.values()).find(l => l.token === token)

      if (!link) {
        throw new Error('Shareable link not found')
      }

      if (!link.isActive) {
        throw new Error('Shareable link is inactive')
      }

      if (link.expiresAt && link.expiresAt < new Date()) {
        throw new Error('Shareable link has expired')
      }

      if (link.maxAccess && link.accessCount >= link.maxAccess) {
        throw new Error('Shareable link access limit exceeded')
      }

      if (link.password && link.password !== password) {
        throw new Error('Invalid password')
      }

      // 增加访问计数
      link.accessCount++
      this.shareableLinks.set(link.id, link)

      const accessInfo = {
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        ip: '127.0.0.1' // 实际应该从请求中获取
      }

      this.options.onLinkAccessed?.(link.id, accessInfo)

      // 这里应该加载实际文档内容
      const document = await this.loadDocument(link.documentId, link.versionId)

      return {
        success: true,
        data: { link, document },
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LINK_ACCESS_ERROR',
          message: 'Failed to access shareable link',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 更新分享链接
  async updateShareableLink(linkId: string, updateData: {
    expiresAt?: Date
    maxAccess?: number
    isActive?: boolean
    permissions?: Partial<ShareableLink['permissions']>
  }): Promise<ApiResponse<ShareableLink>> {
    try {
      const link = this.shareableLinks.get(linkId)
      if (!link) {
        throw new Error('Shareable link not found')
      }

      const updatedLink = {
        ...link,
        ...updateData,
        permissions: {
          ...link.permissions,
          ...updateData.permissions
        }
      }

      this.shareableLinks.set(linkId, updatedLink)

      return {
        success: true,
        data: updatedLink,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LINK_UPDATE_ERROR',
          message: 'Failed to update shareable link',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 删除分享链接
  async deleteShareableLink(linkId: string): Promise<ApiResponse<void>> {
    try {
      this.shareableLinks.delete(linkId)

      return {
        success: true,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LINK_DELETE_ERROR',
          message: 'Failed to delete shareable link',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 获取分享链接列表
  async getShareableLinks(): Promise<ApiResponse<ShareableLink[]>> {
    try {
      const links = Array.from(this.shareableLinks.values()).filter(
        link => link.documentId === this.options.documentId
      )

      return {
        success: true,
        data: links,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LINKS_GET_ERROR',
          message: 'Failed to get shareable links',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 添加评论
  async addComment(commentData: {
    content: string
    position?: {
      line: number
      column: number
    }
    selection?: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
    parentId?: string
    tags?: string[]
  }): Promise<ApiResponse<Comment>> {
    try {
      const comment: Comment = {
        id: this.generateCommentId(),
        content: commentData.content,
        author: this.getCurrentUser(),
        documentId: this.options.documentId,
        position: commentData.position ? {
          line: commentData.position.line,
          column: commentData.position.column,
          userId: this.options.userId,
          userName: '当前用户',
          color: '#3B82F6',
          timestamp: new Date()
        } : undefined,
        selection: commentData.selection ? {
          start: {
            line: commentData.selection.start.line,
            column: commentData.selection.start.column,
            userId: this.options.userId,
            userName: '当前用户',
            color: '#3B82F6',
            timestamp: new Date()
          },
          end: {
            line: commentData.selection.end.line,
            column: commentData.selection.end.column,
            userId: this.options.userId,
            userName: '当前用户',
            color: '#3B82F6',
            timestamp: new Date()
          },
          userId: this.options.userId,
          userName: '当前用户',
          color: '#3B82F6',
          timestamp: new Date()
        } : undefined,
        parentId: commentData.parentId,
        replies: [],
        status: 'active',
        tags: commentData.tags || [],
        reactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isResolved: false
      }

      // 如果是回复，添加到父评论的回复列表
      if (comment.parentId) {
        const documentComments = this.comments.get(this.options.documentId) || []
        const parentComment = documentComments.find(c => c.id === comment.parentId)
        if (parentComment) {
          parentComment.replies.push(comment)
          this.comments.set(this.options.documentId, documentComments)
        }
      } else {
        // 添加新评论
        const documentComments = this.comments.get(this.options.documentId) || []
        documentComments.push(comment)
        this.comments.set(this.options.documentId, documentComments)
      }

      this.options.onCommentAdded?.(comment)

      return {
        success: true,
        data: comment,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMMENT_ADD_ERROR',
          message: 'Failed to add comment',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 解决评论
  async resolveComment(commentId: string): Promise<ApiResponse<Comment>> {
    try {
      const documentComments = this.comments.get(this.options.documentId) || []
      const comment = this.findCommentRecursive(documentComments, commentId)

      if (!comment) {
        throw new Error('Comment not found')
      }

      comment.isResolved = true
      comment.resolvedBy = this.getCurrentUser()
      comment.resolvedAt = new Date()
      comment.status = 'resolved'

      this.comments.set(this.options.documentId, documentComments)

      return {
        success: true,
        data: comment,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMMENT_RESOLVE_ERROR',
          message: 'Failed to resolve comment',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 添加评论反应
  async addCommentReaction(commentId: string, emoji: string): Promise<ApiResponse<Comment>> {
    try {
      const documentComments = this.comments.get(this.options.documentId) || []
      const comment = this.findCommentRecursive(documentComments, commentId)

      if (!comment) {
        throw new Error('Comment not found')
      }

      // 检查用户是否已经添加了相同的反应
      const existingReaction = comment.reactions.find(
        r => r.userId === this.options.userId && r.emoji === emoji
      )

      if (existingReaction) {
        // 移除反应
        comment.reactions = comment.reactions.filter(r => r.id !== existingReaction.id)
      } else {
        // 添加新反应
        comment.reactions.push({
          id: this.generateReactionId(),
          userId: this.options.userId,
          emoji,
          createdAt: new Date()
        })
      }

      this.comments.set(this.options.documentId, documentComments)

      return {
        success: true,
        data: comment,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMMENT_REACTION_ERROR',
          message: 'Failed to add comment reaction',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 获取评论
  async getComments(versionId?: string): Promise<ApiResponse<Comment[]>> {
    try {
      const documentComments = this.comments.get(this.options.documentId) || []

      // 过滤版本特定的评论
      const filteredComments = versionId
        ? documentComments.filter(comment => !comment.versionId || comment.versionId === versionId)
        : documentComments

      return {
        success: true,
        data: filteredComments,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMMENTS_GET_ERROR',
          message: 'Failed to get comments',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 添加标注
  async addAnnotation(annotationData: {
    type: 'highlight' | 'note' | 'suggestion' | 'warning' | 'error'
    content: string
    position: {
      line: number
      column: number
    }
    selection?: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
    style?: {
      color: string
      backgroundColor?: string
      borderColor?: string
    }
    isPublic?: boolean
  }): Promise<ApiResponse<Annotation>> {
    try {
      const annotation: Annotation = {
        id: this.generateAnnotationId(),
        type: annotationData.type,
        content: annotationData.content,
        author: this.getCurrentUser(),
        position: {
          line: annotationData.position.line,
          column: annotationData.position.column,
          userId: this.options.userId,
          userName: '当前用户',
          color: '#3B82F6',
          timestamp: new Date()
        },
        selection: annotationData.selection ? {
          start: {
            line: annotationData.selection.start.line,
            column: annotationData.selection.start.column,
            userId: this.options.userId,
            userName: '当前用户',
            color: '#3B82F6',
            timestamp: new Date()
          },
          end: {
            line: annotationData.selection.end.line,
            column: annotationData.selection.end.column,
            userId: this.options.userId,
            userName: '当前用户',
            color: '#3B82F6',
            timestamp: new Date()
          },
          userId: this.options.userId,
          userName: '当前用户',
          color: '#3B82F6',
          timestamp: new Date()
        } : undefined,
        style: {
          color: annotationData.style?.color || this.getDefaultColorForType(annotationData.type),
          backgroundColor: annotationData.style?.backgroundColor,
          borderColor: annotationData.style?.borderColor
        },
        isPublic: annotationData.isPublic ?? true,
        createdAt: new Date()
      }

      const documentAnnotations = this.annotations.get(this.options.documentId) || []
      documentAnnotations.push(annotation)
      this.annotations.set(this.options.documentId, documentAnnotations)

      return {
        success: true,
        data: annotation,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ANNOTATION_ADD_ERROR',
          message: 'Failed to add annotation',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 获取标注
  async getAnnotations(versionId?: string): Promise<ApiResponse<Annotation[]>> {
    try {
      const documentAnnotations = this.annotations.get(this.options.documentId) || []

      // 过滤版本特定的标注
      const filteredAnnotations = versionId
        ? documentAnnotations.filter(annotation => !annotation.versionId || annotation.versionId === versionId)
        : documentAnnotations

      return {
        success: true,
        data: filteredAnnotations,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ANNOTATIONS_GET_ERROR',
          message: 'Failed to get annotations',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 工具方法

  private getCurrentUser(): any {
    return {
      id: this.options.userId || 'current-user',
      name: 'Current User',
      email: 'user@example.com',
      status: 'online' as const,
      lastSeen: new Date(),
      color: '#3B82F6',
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true,
        canManageTemplates: true,
        canDelete: true
      }
    }
  }

  private generateLinkId(): string {
    return `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateLinkToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private generateCommentId(): string {
    return `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateReactionId(): string {
    return `reaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateAnnotationId(): string {
    return `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private findCommentRecursive(comments: Comment[], commentId: string): Comment | null {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment
      }

      const found = this.findCommentRecursive(comment.replies, commentId)
      if (found) {
        return found
      }
    }
    return null
  }

  private getDefaultColorForType(type: Annotation['type']): string {
    switch (type) {
      case 'highlight':
        return '#FEF3C7'
      case 'note':
        return '#DBEAFE'
      case 'suggestion':
        return '#D1FAE5'
      case 'warning':
        return '#FED7AA'
      case 'error':
        return '#FEE2E2'
      default:
        return '#E5E7EB'
    }
  }

  private async loadDocument(documentId: string, versionId?: string): Promise<any> {
    // 这里应该实现实际的文档加载逻辑
    return {
      id: documentId,
      content: 'Document content here...',
      version: versionId || 'latest'
    }
  }

  // 公共API方法

  async getShareableLink(linkId: string): Promise<ShareableLink | null> {
    return this.shareableLinks.get(linkId) || null
  }

  async getComment(commentId: string): Promise<Comment | null> {
    const documentComments = this.comments.get(this.options.documentId) || []
    return this.findCommentRecursive(documentComments, commentId)
  }

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    try {
      const documentComments = this.comments.get(this.options.documentId) || []

      const removeCommentRecursive = (comments: Comment[]): Comment[] => {
        return comments.filter(comment => {
          if (comment.id === commentId) {
            return false
          }
          comment.replies = removeCommentRecursive(comment.replies)
          return true
        })
      }

      const updatedComments = removeCommentRecursive(documentComments)
      this.comments.set(this.options.documentId, updatedComments)

      return {
        success: true,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMMENT_DELETE_ERROR',
          message: 'Failed to delete comment',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  async deleteAnnotation(annotationId: string): Promise<ApiResponse<void>> {
    try {
      const documentAnnotations = this.annotations.get(this.options.documentId) || []
      const updatedAnnotations = documentAnnotations.filter(a => a.id !== annotationId)
      this.annotations.set(this.options.documentId, updatedAnnotations)

      return {
        success: true,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ANNOTATION_DELETE_ERROR',
          message: 'Failed to delete annotation',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }
}

// 导出单例实例
let sharingServiceInstance: SharingService | null = null

export function getSharingService(options: UseSharingOptions): SharingService {
  const serviceKey = `${options.documentId}-${options.userId}`

  if (!sharingServiceInstance || sharingServiceInstance['documentId'] !== options.documentId) {
    sharingServiceInstance = new SharingService(options)
    sharingServiceInstance['documentId'] = options.documentId
  }

  return sharingServiceInstance
}
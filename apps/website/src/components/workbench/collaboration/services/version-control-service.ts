/**
 * 版本控制服务
 * 处理Git风格的版本管理、分支创建和合并
 */

import type {
  Version,
  Branch,
  MergeRequest,
  VersionChange,
  UseVersionControlOptions,
  ApiResponse
} from '../types'

export class VersionControlService {
  private options: UseVersionControlOptions
  private versions: Map<string, Version> = new Map()
  private branches: Map<string, Branch> = new Map()
  private mergeRequests: Map<string, MergeRequest> = new Map()
  private currentBranchId: string | null = null

  constructor(options: UseVersionControlOptions) {
    this.options = options
    this.initializeDefaultBranch()
  }

  // 初始化默认分支
  private async initializeDefaultBranch(): Promise<void> {
    const mainBranch: Branch = {
      id: 'main',
      name: 'main',
      description: '主分支',
      headVersionId: 'v1.0.0',
      baseVersionId: '',
      author: {
        id: 'system',
        name: 'System',
        email: 'system@xorigo-ui.com',
        status: 'online',
        lastSeen: new Date(),
        color: '#6B7280',
        permissions: {
          canEdit: true,
          canComment: true,
          canShare: true,
          canManageTemplates: true,
          canDelete: true
        }
      },
      createdAt: new Date(),
      isMain: true,
      isProtected: true,
      collaborators: []
    }

    this.branches.set('main', mainBranch)
    this.currentBranchId = 'main'

    // 创建初始版本
    const initialVersion: Version = {
      id: 'v1.0.0',
      version: '1.0.0',
      name: 'Initial Version',
      description: '初始版本',
      author: mainBranch.author,
      timestamp: new Date(),
      changes: [],
      parents: [],
      tags: ['initial'],
      isMainBranch: true,
      branchName: 'main'
    }

    this.versions.set('v1.0.0', initialVersion)
  }

  // 创建新版本
  async createVersion(versionData: {
    name: string
    description?: string
    changes: VersionChange[]
    tags?: string[]
  }): Promise<ApiResponse<Version>> {
    try {
      const currentBranch = this.getCurrentBranch()
      if (!currentBranch) {
        throw new Error('No current branch')
      }

      const lastVersion = this.versions.get(currentBranch.headVersionId)
      const versionNumber = this.generateVersionNumber(lastVersion)

      const newVersion: Version = {
        id: `v${versionNumber}`,
        version: versionNumber,
        name: versionData.name,
        description: versionData.description,
        author: this.getCurrentUser(),
        timestamp: new Date(),
        changes: versionData.changes,
        parents: [currentBranch.headVersionId],
        tags: versionData.tags || [],
        isMainBranch: currentBranch.isMain,
        branchName: currentBranch.name
      }

      // 保存版本
      this.versions.set(newVersion.id, newVersion)

      // 更新分支
      currentBranch.headVersionId = newVersion.id
      this.branches.set(currentBranch.id, currentBranch)

      this.options.onVersionCreated?.(newVersion)

      return {
        success: true,
        data: newVersion,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'VERSION_CREATE_ERROR',
          message: 'Failed to create version',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 创建新分支
  async createBranch(branchData: {
    name: string
    description?: string
    baseVersionId?: string
  }): Promise<ApiResponse<Branch>> {
    try {
      const currentBranch = this.getCurrentBranch()
      const baseVersionId = branchData.baseVersionId || currentBranch?.headVersionId

      if (!baseVersionId) {
        throw new Error('No base version specified')
      }

      const baseVersion = this.versions.get(baseVersionId)
      if (!baseVersion) {
        throw new Error('Base version not found')
      }

      const newBranch: Branch = {
        id: this.generateBranchId(branchData.name),
        name: branchData.name,
        description: branchData.description,
        headVersionId: baseVersionId,
        baseVersionId,
        author: this.getCurrentUser(),
        createdAt: new Date(),
        isMain: false,
        isProtected: false,
        collaborators: []
      }

      this.branches.set(newBranch.id, newBranch)
      this.options.onBranchCreated?.(newBranch)

      return {
        success: true,
        data: newBranch,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BRANCH_CREATE_ERROR',
          message: 'Failed to create branch',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 切换分支
  async switchBranch(branchId: string): Promise<ApiResponse<void>> {
    try {
      const branch = this.branches.get(branchId)
      if (!branch) {
        throw new Error('Branch not found')
      }

      this.currentBranchId = branchId
      return {
        success: true,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BRANCH_SWITCH_ERROR',
          message: 'Failed to switch branch',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 创建合并请求
  async createMergeRequest(requestData: {
    title: string
    description?: string
    sourceBranchId: string
    targetBranchId: string
    reviewers?: string[]
  }): Promise<ApiResponse<MergeRequest>> {
    try {
      const sourceBranch = this.branches.get(requestData.sourceBranchId)
      const targetBranch = this.branches.get(requestData.targetBranchId)

      if (!sourceBranch || !targetBranch) {
        throw new Error('Source or target branch not found')
      }

      // 计算差异
      const changes = await this.calculateDiff(sourceBranch.headVersionId, targetBranch.headVersionId)
      const conflicts = await this.detectConflicts(sourceBranch.headVersionId, targetBranch.headVersionId)

      const mergeRequest: MergeRequest = {
        id: this.generateMergeRequestId(),
        title: requestData.title,
        description: requestData.description,
        sourceBranch: sourceBranch.name,
        targetBranch: targetBranch.name,
        author: this.getCurrentUser(),
        reviewers: this.getReviewers(requestData.reviewers || []),
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
        conflicts,
        changes
      }

      this.mergeRequests.set(mergeRequest.id, mergeRequest)
      this.options.onMergeRequested?.(mergeRequest)

      return {
        success: true,
        data: mergeRequest,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MERGE_REQUEST_CREATE_ERROR',
          message: 'Failed to create merge request',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 合并分支
  async mergeBranch(mergeRequestId: string, mergeData?: {
    strategy?: 'merge' | 'squash' | 'rebase'
    conflictResolutions?: Record<string, string>
  }): Promise<ApiResponse<Version>> {
    try {
      const mergeRequest = this.mergeRequests.get(mergeRequestId)
      if (!mergeRequest) {
        throw new Error('Merge request not found')
      }

      if (mergeRequest.status !== 'approved') {
        throw new Error('Merge request is not approved')
      }

      const sourceBranch = this.branches.get(mergeRequest.sourceBranch)
      const targetBranch = this.branches.get(mergeRequest.targetBranch)

      if (!sourceBranch || !targetBranch) {
        throw new Error('Source or target branch not found')
      }

      // 解决冲突
      if (mergeRequest.conflicts.length > 0 && mergeData?.conflictResolutions) {
        await this.resolveConflicts(mergeRequest.conflicts, mergeData.conflictResolutions)
      }

      // 创建合并版本
      const mergedVersion: Version = {
        id: `v${this.generateVersionNumber(this.versions.get(targetBranch.headVersionId))}`,
        version: this.generateVersionNumber(this.versions.get(targetBranch.headVersionId)),
        name: `Merge ${sourceBranch.name} into ${targetBranch.name}`,
        description: mergeRequest.description,
        author: this.getCurrentUser(),
        timestamp: new Date(),
        changes: mergeRequest.changes,
        parents: [targetBranch.headVersionId, sourceBranch.headVersionId],
        tags: ['merge'],
        isMainBranch: targetBranch.isMain,
        branchName: targetBranch.name
      }

      this.versions.set(mergedVersion.id, mergedVersion)
      targetBranch.headVersionId = mergedVersion.id
      this.branches.set(targetBranch.id, targetBranch)

      // 更新合并请求状态
      mergeRequest.status = 'merged'
      mergeRequest.updatedAt = new Date()
      this.mergeRequests.set(mergeRequestId, mergeRequest)

      return {
        success: true,
        data: mergedVersion,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MERGE_ERROR',
          message: 'Failed to merge branch',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 获取版本历史
  async getVersionHistory(branchId?: string, limit = 50): Promise<ApiResponse<Version[]>> {
    try {
      const targetBranchId = branchId || this.currentBranchId
      if (!targetBranchId) {
        throw new Error('No branch specified')
      }

      const branch = this.branches.get(targetBranchId)
      if (!branch) {
        throw new Error('Branch not found')
      }

      const history: Version[] = []
      let currentVersionId = branch.headVersionId

      while (currentVersionId && history.length < limit) {
        const version = this.versions.get(currentVersionId)
        if (!version) break

        history.unshift(version)
        currentVersionId = version.parents[0] // 只追踪第一个父版本
      }

      return {
        success: true,
        data: history,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'VERSION_HISTORY_ERROR',
          message: 'Failed to get version history',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 比较版本
  async compareVersions(versionId1: string, versionId2: string): Promise<ApiResponse<{
    version1: Version
    version2: Version
    changes: VersionChange[]
    conflicts: any[]
  }>> {
    try {
      const version1 = this.versions.get(versionId1)
      const version2 = this.versions.get(versionId2)

      if (!version1 || !version2) {
        throw new Error('Version not found')
      }

      const changes = await this.calculateDiff(versionId1, versionId2)
      const conflicts = await this.detectConflicts(versionId1, versionId2)

      return {
        success: true,
        data: {
          version1,
          version2,
          changes,
          conflicts
        },
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'VERSION_COMPARE_ERROR',
          message: 'Failed to compare versions',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 回滚到指定版本
  async revertToVersion(versionId: string, reason?: string): Promise<ApiResponse<Version>> {
    try {
      const targetVersion = this.versions.get(versionId)
      if (!targetVersion) {
        throw new Error('Target version not found')
      }

      const currentBranch = this.getCurrentBranch()
      if (!currentBranch) {
        throw new Error('No current branch')
      }

      const revertVersion: Version = {
        id: `v${this.generateVersionNumber(this.versions.get(currentBranch.headVersionId))}`,
        version: this.generateVersionNumber(this.versions.get(currentBranch.headVersionId)),
        name: `Revert to ${targetVersion.version}`,
        description: reason || `Revert to version ${targetVersion.version}`,
        author: this.getCurrentUser(),
        timestamp: new Date(),
        changes: targetVersion.changes.map(change => ({
          ...change,
          type: change.type === 'add' ? 'delete' : change.type === 'delete' ? 'add' : 'modify' as any
        })),
        parents: [currentBranch.headVersionId],
        tags: ['revert'],
        isMainBranch: currentBranch.isMain,
        branchName: currentBranch.name
      }

      this.versions.set(revertVersion.id, revertVersion)
      currentBranch.headVersionId = revertVersion.id
      this.branches.set(currentBranch.id, currentBranch)

      return {
        success: true,
        data: revertVersion,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'VERSION_REVERT_ERROR',
          message: 'Failed to revert version',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 工具方法

  private getCurrentBranch(): Branch | null {
    if (!this.currentBranchId) return null
    return this.branches.get(this.currentBranchId) || null
  }

  private getCurrentUser(): any {
    // 这里应该从用户服务获取当前用户信息
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

  private generateVersionNumber(lastVersion?: Version): string {
    if (!lastVersion) {
      return '1.0.0'
    }

    const parts = lastVersion.version.split('.').map(Number)
    parts[2]++ // 增加补丁版本号

    return parts.join('.')
  }

  private generateBranchId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  }

  private generateMergeRequestId(): string {
    return `mr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getReviewers(reviewIds: string[]): any[] {
    return reviewIds.map(id => ({
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      status: 'online' as const,
      lastSeen: new Date(),
      color: '#6B7280',
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true,
        canManageTemplates: false,
        canDelete: false
      }
    }))
  }

  private async calculateDiff(versionId1: string, versionId2: string): Promise<VersionChange[]> {
    // 简化的差异计算
    const version1 = this.versions.get(versionId1)
    const version2 = this.versions.get(versionId2)

    if (!version1 || !version2) {
      return []
    }

    // 这里应该实现真正的diff算法
    return [
      {
        type: 'modify',
        path: '/example',
        content: 'modified content',
        oldContent: 'original content',
        metadata: { diff: '...' }
      }
    ]
  }

  private async detectConflicts(versionId1: string, versionId2: string): Promise<any[]> {
    // 简化的冲突检测
    return []
  }

  private async resolveConflicts(conflicts: any[], resolutions: Record<string, string>): Promise<void> {
    // 实现冲突解决逻辑
  }

  // 公共API方法

  async getAllBranches(): Promise<Branch[]> {
    return Array.from(this.branches.values())
  }

  async getBranch(branchId: string): Promise<Branch | null> {
    return this.branches.get(branchId) || null
  }

  async getVersion(versionId: string): Promise<Version | null> {
    return this.versions.get(versionId) || null
  }

  async getMergeRequests(status?: MergeRequest['status']): Promise<MergeRequest[]> {
    const requests = Array.from(this.mergeRequests.values())
    return status ? requests.filter(req => req.status === status) : requests
  }

  async getMergeRequest(requestId: string): Promise<MergeRequest | null> {
    return this.mergeRequests.get(requestId) || null
  }

  async deleteBranch(branchId: string): Promise<ApiResponse<void>> {
    try {
      const branch = this.branches.get(branchId)
      if (!branch) {
        throw new Error('Branch not found')
      }

      if (branch.isMain || branch.isProtected) {
        throw new Error('Cannot delete main or protected branch')
      }

      this.branches.delete(branchId)

      return {
        success: true,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BRANCH_DELETE_ERROR',
          message: 'Failed to delete branch',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }
}

// 导出单例实例
let versionControlServiceInstance: VersionControlService | null = null

export function getVersionControlService(options: UseVersionControlOptions): VersionControlService {
  const serviceKey = `${options.documentId}-${options.userId}`

  if (!versionControlServiceInstance || versionControlServiceInstance['documentId'] !== options.documentId) {
    versionControlServiceInstance = new VersionControlService(options)
    versionControlServiceInstance['documentId'] = options.documentId
  }

  return versionControlServiceInstance
}
/**
 * Xorigo UI Team - Version Control
 *
 * Advanced version control system for templates and team resources.
 * Supports branching, merging, conflict resolution, and detailed change history.
 */

import { nanoid } from 'nanoid'
import { diffLines, createTwoFilesPatch } from 'diff'
import semver from 'semver'
import {
  Version,
  VersionBranch,
  MergeRequest,
  ChangeSet,
  Commit,
  VersionHistory
} from './types'
import { formatTimestamp } from './utils'

// Validation schemas
const CommitSchema = {
  message: z.string().min(1).max(500),
  author: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional()
  }),
  content: z.unknown(),
  parentCommit: z.string().optional(),
  branch: z.string().optional()
}

/**
 * Version Control Manager
 *
 * Features:
 * - Semantic versioning (SemVer)
 * - Branching and merging
 * - Conflict detection and resolution
 * - Change history and diffs
 * - Merge requests and reviews
 * - Rollback capabilities
 */
export class VersionControl {
  private versions: Map<string, Version> = new Map()
  private branches: Map<string, VersionBranch> = new Map()
  private commits: Map<string, Commit> = new Map()
  private mergeRequests: Map<string, MergeRequest> = new Map()
  private currentBranch: string

  constructor(initialBranch: string = 'main') {
    this.currentBranch = initialBranch
    this.createBranch(initialBranch, null, 'Initial branch')
  }

  /**
   * Create a new version (tag/commit)
   */
  async createVersion(
    version: string,
    message: string,
    content: unknown,
    author: { id: string; name: string; email?: string },
    branch: string = this.currentBranch
  ): Promise<Version> {
    // Validate semver format
    if (!semver.valid(version)) {
      throw new Error(`Invalid version format: ${version}. Use semantic versioning (e.g., 1.0.0)`)
    }

    const branchData = this.branches.get(branch)
    if (!branchData) {
      throw new Error(`Branch not found: ${branch}`)
    }

    // Check if version already exists
    const existing = Array.from(this.versions.values()).find(v => v.version === version)
    if (existing) {
      throw new Error(`Version ${version} already exists`)
    }

    const versionId = nanoid(16)
    const parentVersion = this.getLatestVersion(branch)

    // Create commit
    const commitId = nanoid(16)
    const commit: Commit = {
      id: commitId,
      message,
      author,
      timestamp: Date.now(),
      content,
      parentCommit: parentVersion?.commitId || null,
      branch
    }
    this.commits.set(commitId, commit)

    // Create version
    const newVersion: Version = {
      id: versionId,
      version,
      commitId,
      branch,
      message,
      author,
      timestamp: Date.now(),
      content,
      previousVersion: parentVersion?.version || null,
      metadata: {
        semver: version
      }
    }

    this.versions.set(versionId, newVersion)
    branchData.latestVersion = versionId
    branchData.versions.push(versionId)

    return newVersion
  }

  /**
   * Get a specific version
   */
  getVersion(versionId: string): Version | null {
    return this.versions.get(versionId) || null
  }

  /**
   * Get latest version on a branch
   */
  getLatestVersion(branch: string = this.currentBranch): Version | null {
    const branchData = this.branches.get(branch)
    if (!branchData || !branchData.latestVersion) return null

    return this.versions.get(branchData.latestVersion) || null
  }

  /**
   * Get all versions
   */
  getAllVersions(branch?: string): Version[] {
    let versions = Array.from(this.versions.values())

    if (branch) {
      versions = versions.filter(v => v.branch === branch)
    }

    // Sort by timestamp (newest first)
    return versions.sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Create a new branch
   */
  async createBranch(
    name: string,
    fromVersionId: string | null,
    description?: string
  ): Promise<VersionBranch> {
    if (this.branches.has(name)) {
      throw new Error(`Branch ${name} already exists`)
    }

    const branchId = nanoid(12)
    const branch: VersionBranch = {
      id: branchId,
      name,
      description: description || '',
      createdAt: Date.now(),
      createdBy: 'system',
      versions: [],
      latestVersion: null,
      parentBranch: null,
      isMerged: false,
      mergeRequests: []
    }

    if (fromVersionId) {
      const fromVersion = this.versions.get(fromVersionId)
      if (!fromVersion) {
        throw new Error(`Source version not found: ${fromVersionId}`)
      }
      branch.parentBranch = fromVersion.branch
      branch.latestVersion = fromVersionId
    }

    this.branches.set(name, branch)
    return branch
  }

  /**
   * Switch to a branch
   */
  switchBranch(name: string): void {
    if (!this.branches.has(name)) {
      throw new Error(`Branch not found: ${name}`)
    }
    this.currentBranch = name
  }

  /**
   * Get branch information
   */
  getBranch(name: string): VersionBranch | null {
    return this.branches.get(name) || null
  }

  /**
   * Get all branches
   */
  getAllBranches(): VersionBranch[] {
    return Array.from(this.branches.values())
  }

  /**
   * Create a merge request
   */
  async createMergeRequest(
    sourceBranch: string,
    targetBranch: string,
    title: string,
    description: string,
    createdBy: string
  ): Promise<MergeRequest> {
    if (!this.branches.has(sourceBranch)) {
      throw new Error(`Source branch not found: ${sourceBranch}`)
    }

    if (!this.branches.has(targetBranch)) {
      throw new Error(`Target branch not found: ${targetBranch}`)
    }

    const mrId = nanoid(16)

    const mergeRequest: MergeRequest = {
      id: mrId,
      sourceBranch,
      targetBranch,
      title,
      description,
      createdBy,
      createdAt: Date.now(),
      status: 'open',
      reviews: [],
      conflicts: [],
      changes: [],
      mergedAt: null,
      mergedBy: null
    }

    this.mergeRequests.set(mrId, mergeRequest)

    // Add to branch
    const sourceBranchData = this.branches.get(sourceBranch)!
    sourceBranchData.mergeRequests.push(mrId)

    return mergeRequest
  }

  /**
   * Get merge request
   */
  getMergeRequest(mrId: string): MergeRequest | null {
    return this.mergeRequests.get(mrId) || null
  }

  /**
   * Get all merge requests
   */
  getAllMergeRequests(status?: 'open' | 'merged' | 'closed'): MergeRequest[] {
    let requests = Array.from(this.mergeRequests.values())

    if (status) {
      requests = requests.filter(mr => mr.status === status)
    }

    return requests.sort((a, b) => b.createdAt - a.createdAt)
  }

  /**
   * Analyze merge conflicts
   */
  analyzeMerge(
    sourceBranch: string,
    targetBranch: string
  ): {
    hasConflicts: boolean
    conflicts: Array<{
      file: string
      type: 'add-add' | 'add-del' | 'del-del' | 'mod-mod' | 'content'
      sourceContent?: unknown
      targetContent?: unknown
    }>
  } {
    const sourceVersion = this.getLatestVersion(sourceBranch)
    const targetVersion = this.getLatestVersion(targetBranch)

    if (!sourceVersion || !targetVersion) {
      return { hasConflicts: false, conflicts: [] }
    }

    const conflicts: Array<{
      file: string
      type: 'add-add' | 'add-del' | 'del-del' | 'mod-mod' | 'content'
      sourceContent?: unknown
      targetContent?: unknown
    }> = []

    // Simple conflict detection (in production, use proper diff tools)
    // For this example, we'll do a basic comparison

    if (sourceVersion.content && targetVersion.content) {
      const sourceStr = JSON.stringify(sourceVersion.content)
      const targetStr = JSON.stringify(targetVersion.content)

      const diff = diffLines(targetStr, sourceStr)

      diff.forEach(part => {
        if (part.added && !part.removed) {
          conflicts.push({
            file: 'content',
            type: 'add-add',
            sourceContent: sourceVersion.content
          })
        } else if (!part.added && part.removed) {
          conflicts.push({
            file: 'content',
            type: 'del-del',
            targetContent: targetVersion.content
          })
        }
      })
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    }
  }

  /**
   * Merge branches
   */
  async merge(
    sourceBranch: string,
    targetBranch: string,
    mergeRequestId?: string,
    resolvedBy?: { id: string; name: string }
  ): Promise<Version> => {
    const sourceVersion = this.getLatestVersion(sourceBranch)
    const targetVersion = this.getLatestVersion(targetBranch)

    if (!sourceVersion) {
      throw new Error(`No version found in source branch: ${sourceBranch}`)
    }

    if (!targetVersion) {
      throw new Error(`No version found in target branch: ${targetBranch}`)
    }

    // Check for conflicts
    const analysis = this.analyzeMerge(sourceBranch, targetBranch)
    if (analysis.hasConflicts && !mergeRequestId) {
      throw new Error('Merge conflicts detected. Create a merge request first.')
    }

    // Create merge commit
    const mergedVersion = await this.createVersion(
      this.bumpPatchVersion(targetVersion.version),
      `Merge ${sourceBranch} into ${targetBranch}`,
      sourceVersion.content,
      resolvedBy || sourceVersion.author,
      targetBranch
    )

    // Update merge request
    if (mergeRequestId) {
      const mr = this.mergeRequests.get(mergeRequestId)
      if (mr) {
        mr.status = 'merged'
        mr.mergedAt = Date.now()
        mr.mergedBy = resolvedBy?.id || null
      }
    }

    // Mark source branch as merged
    const sourceBranchData = this.branches.get(sourceBranch)
    if (sourceBranchData) {
      sourceBranchData.isMerged = true
    }

    return mergedVersion
  }

  /**
   * Get change history (diff between versions)
   */
  getChanges(
    fromVersionId: string,
    toVersionId: string
  ): {
    changes: ChangeSet[]
    diff: string
  } {
    const fromVersion = this.versions.get(fromVersionId)
    const toVersion = this.versions.get(toVersionId)

    if (!fromVersion || !toVersion) {
      throw new Error('One or both versions not found')
    }

    const fromStr = JSON.stringify(fromVersion.content, null, 2)
    const toStr = JSON.stringify(toVersion.content, null, 2)

    const diff = createTwoFilesPatch(
      `${fromVersion.version}`,
      `${toVersion.version}`,
      fromStr,
      toStr
    )

    // Create change sets
    const changes: ChangeSet[] = []

    if (fromStr !== toStr) {
      changes.push({
        type: 'modified',
        path: 'content',
        from: fromVersion.content,
        to: toVersion.content,
        timestamp: toVersion.timestamp,
        author: toVersion.author
      })
    }

    return { changes, diff }
  }

  /**
   * Rollback to a previous version
   */
  async rollback(
    versionId: string,
    reason: string,
    user: { id: string; name: string; email?: string }
  ): Promise<Version> {
    const targetVersion = this.versions.get(versionId)
    if (!targetVersion) {
      throw new Error(`Version not found: ${versionId}`)
    }

    // Create a new version with the content from the rollback target
    const newVersion = await this.createVersion(
      this.bumpMinorVersion(targetVersion.version),
      `Rollback to ${targetVersion.version}: ${reason}`,
      targetVersion.content,
      user,
      targetVersion.branch
    )

    return newVersion
  }

  /**
   * Get version history
   */
  getVersionHistory(
    versionId: string,
    limit: number = 50
  ): VersionHistory {
    const version = this.versions.get(versionId)
    if (!version) {
      throw new Error(`Version not found: ${versionId}`)
    }

    const history: Version[] = []
    let current = version

    while (current && history.length < limit) {
      history.push(current)
      if (!current.previousVersion) break

      const previous = Array.from(this.versions.values())
        .find(v => v.version === current!.previousVersion && v.branch === current!.branch)
      current = previous || null
    }

    return {
      version,
      history,
      total: history.length
    }
  }

  /**
   * Compare two versions
   */
  compareVersions(
    versionId1: string,
    versionId2: string
  ): {
    newer: Version | null
    older: Version | null
    diff: string
  } {
    const v1 = this.versions.get(versionId1)
    const v2 = this.versions.get(versionId2)

    if (!v1 || !v2) {
      throw new Error('One or both versions not found')
    }

    const newer = v1.timestamp > v2.timestamp ? v1 : v2
    const older = v1.timestamp > v2.timestamp ? v2 : v1

    const { diff } = this.getChanges(versionId1, versionId2)

    return {
      newer,
      older,
      diff
    }
  }

  private bumpPatchVersion(version: string): string {
    const parsed = semver.parse(version)
    if (!parsed) throw new Error(`Invalid version: ${version}`)
    return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`
  }

  private bumpMinorVersion(version: string): string {
    const parsed = semver.parse(version)
    if (!parsed) throw new Error(`Invalid version: ${version}`)
    return `${parsed.major}.${parsed.minor + 1}.${parsed.patch}`
  }

  /**
   * Export version control history
   */
  exportHistory(): string {
    const data = {
      versions: Array.from(this.versions.values()),
      branches: Array.from(this.branches.values()),
      commits: Array.from(this.commits.values()),
      mergeRequests: Array.from(this.mergeRequests.values()),
      exportedAt: Date.now()
    }

    return JSON.stringify(data, null, 2)
  }

  /**
   * Clean up old versions
   */
  cleanup(daysToKeep: number = 365): number {
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
    let cleaned = 0

    // Keep all versions on main branch
    const mainVersions = Array.from(this.versions.values())
      .filter(v => v.branch === 'main')
      .map(v => v.id)

    for (const [id, version] of this.versions.entries()) {
      if (
        version.timestamp < cutoff &&
        !mainVersions.includes(id) &&
        version.branch !== 'main'
      ) {
        this.versions.delete(id)
        cleaned++
      }
    }

    return cleaned
  }
}

export default VersionControl

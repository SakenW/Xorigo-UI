/**
 * Xorigo UI Team - Version Control Type Definitions
 */

export interface Version {
  id: string
  version: string
  commitId: string
  branch: string
  message: string
  author: {
    id: string
    name: string
    email?: string
  }
  timestamp: number
  content: unknown
  previousVersion: string | null
  metadata?: Record<string, unknown>
}

export interface VersionBranch {
  id: string
  name: string
  description: string
  createdAt: number
  createdBy: string
  versions: string[]
  latestVersion: string | null
  parentBranch: string | null
  isMerged: boolean
  mergeRequests: string[]
}

export interface MergeRequest {
  id: string
  sourceBranch: string
  targetBranch: string
  title: string
  description: string
  createdBy: string
  createdAt: number
  status: 'open' | 'merged' | 'closed'
  reviews: Array<{
    reviewerId: string
    status: 'approved' | 'rejected' | 'pending'
    comments?: string
    timestamp: number
  }>
  conflicts: Array<{
    file: string
    type: 'add-add' | 'add-del' | 'del-del' | 'mod-mod' | 'content'
    sourceContent?: unknown
    targetContent?: unknown
  }>
  changes: ChangeSet[]
  mergedAt: number | null
  mergedBy: string | null
}

export interface ChangeSet {
  type: 'added' | 'removed' | 'modified'
  path: string
  from?: unknown
  to?: unknown
  timestamp: number
  author: {
    id: string
    name: string
    email?: string
  }
}

export interface Commit {
  id: string
  message: string
  author: {
    id: string
    name: string
    email?: string
  }
  timestamp: number
  content: unknown
  parentCommit: string | null
  branch: string
}

export interface VersionHistory {
  version: Version
  history: Version[]
  total: number
}

export interface VersionCompare {
  version1: Version
  version2: Version
  diff: string
  changes: ChangeSet[]
}

export interface BranchInfo {
  name: string
  description: string
  versionCount: number
  latestVersion: Version | null
  isDefault: boolean
  isMerged: boolean
  createdAt: number
}

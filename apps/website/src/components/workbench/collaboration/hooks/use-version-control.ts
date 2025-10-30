/**
 * 版本控制 Hook
 * 提供 Git 风格的版本管理功能
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getVersionControlService, type VersionControlService } from '../services/version-control-service'
import type {
  Version,
  Branch,
  MergeRequest,
  UseVersionControlOptions
} from '../types'

export interface UseVersionControlReturn {
  // 状态
  versions: Version[]
  branches: Branch[]
  mergeRequests: MergeRequest[]
  currentBranch: Branch | null
  selectedVersion: Version | null
  loading: boolean
  error: string | null

  // 版本操作
  createVersion: (data: {
    name: string
    description?: string
    changes: any[]
    tags?: string[]
  }) => Promise<Version | null>
  getVersionHistory: (branchId?: string, limit?: number) => Promise<void>
  compareVersions: (versionId1: string, versionId2: string) => Promise<void>
  revertToVersion: (versionId: string, reason?: string) => Promise<void>

  // 分支操作
  createBranch: (data: {
    name: string
    description?: string
    baseVersionId?: string
  }) => Promise<Branch | null>
  switchBranch: (branchId: string) => Promise<void>
  deleteBranch: (branchId: string) => Promise<void>

  // 合并请求操作
  createMergeRequest: (data: {
    title: string
    description?: string
    sourceBranchId: string
    targetBranchId: string
    reviewers?: string[]
  }) => Promise<MergeRequest | null>
  approveMergeRequest: (requestId: string) => Promise<void>
  rejectMergeRequest: (requestId: string) => Promise<void>
  mergeBranch: (requestId: string) => Promise<void>

  // 选择操作
  selectVersion: (version: Version) => void
  selectBranch: (branch: Branch) => void

  // 工具方法
  getBranchById: (branchId: string) => Branch | null
  getVersionById: (versionId: string) => Version | null
  getMergeRequestById: (requestId: string) => MergeRequest | null
}

export function useVersionControl(options: UseVersionControlOptions): UseVersionControlReturn {
  const [versions, setVersions] = useState<Version[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [mergeRequests, setMergeRequests] = useState<MergeRequest[]>([])
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const serviceRef = useRef<VersionControlService | null>(null)

  // 初始化服务
  useEffect(() => {
    if (!options.documentId || !options.userId) return

    const service = getVersionControlService({
      ...options,
      onError: (error) => {
        setError(error.message)
        options.onError?.(error)
      }
    })

    serviceRef.current = service

    loadData()

    return () => {
      // 清理服务实例
    }
  }, [options])

  // 加载数据
  const loadData = useCallback(async () => {
    if (!serviceRef.current) return

    setLoading(true)
    setError(null)

    try {
      const [versionsData, branchesData, mergeRequestsData] = await Promise.all([
        serviceRef.current.getVersionHistory(),
        serviceRef.current.getAllBranches(),
        serviceRef.current.getMergeRequests()
      ])

      setVersions(versionsData.success ? versionsData.data : [])
      setBranches(branchesData)
      setMergeRequests(mergeRequestsData)

      // 设置当前分支
      const mainBranch = branchesData.find(b => b.isMain)
      setCurrentBranch(mainBranch || branchesData[0] || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  // 创建版本
  const createVersion = useCallback(async (data: {
    name: string
    description?: string
    changes: any[]
    tags?: string[]
  }): Promise<Version | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.createVersion(data)
      if (result.success && result.data) {
        setVersions(prev => [result.data!, ...prev])
        setSelectedVersion(result.data)
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create version')
      return null
    }
  }, [])

  // 获取版本历史
  const getVersionHistory = useCallback(async (branchId?: string, limit = 50) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.getVersionHistory(branchId, limit)
      if (result.success) {
        setVersions(result.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get version history')
    }
  }, [])

  // 比较版本
  const compareVersions = useCallback(async (versionId1: string, versionId2: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.compareVersions(versionId1, versionId2)
      if (result.success) {
        // 这里可以实现版本比较UI
        console.log('Version comparison:', result.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compare versions')
    }
  }, [])

  // 回滚到指定版本
  const revertToVersion = useCallback(async (versionId: string, reason?: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.revertToVersion(versionId, reason)
      if (result.success && result.data) {
        setVersions(prev => [result.data!, ...prev])
        await loadData()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revert version')
    }
  }, [loadData])

  // 创建分支
  const createBranch = useCallback(async (data: {
    name: string
    description?: string
    baseVersionId?: string
  }): Promise<Branch | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.createBranch(data)
      if (result.success && result.data) {
        setBranches(prev => [...prev, result.data!])
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create branch')
      return null
    }
  }, [])

  // 切换分支
  const switchBranch = useCallback(async (branchId: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.switchBranch(branchId)
      if (result.success) {
        const branch = await serviceRef.current.getBranch(branchId)
        if (branch) {
          setCurrentBranch(branch)
          await getVersionHistory(branchId)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch branch')
    }
  }, [getVersionHistory])

  // 删除分支
  const deleteBranch = useCallback(async (branchId: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.deleteBranch(branchId)
      if (result.success) {
        setBranches(prev => prev.filter(b => b.id !== branchId))
        if (currentBranch?.id === branchId) {
          const mainBranch = branches.find(b => b.isMain)
          setCurrentBranch(mainBranch || branches[0] || null)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete branch')
    }
  }, [currentBranch, branches])

  // 创建合并请求
  const createMergeRequest = useCallback(async (data: {
    title: string
    description?: string
    sourceBranchId: string
    targetBranchId: string
    reviewers?: string[]
  }): Promise<MergeRequest | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.createMergeRequest(data)
      if (result.success && result.data) {
        setMergeRequests(prev => [...prev, result.data!])
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create merge request')
      return null
    }
  }, [])

  // 批准合并请求
  const approveMergeRequest = useCallback(async (requestId: string) => {
    // 这里应该实现批准逻辑
    console.log('Approving merge request:', requestId)
  }, [])

  // 拒绝合并请求
  const rejectMergeRequest = useCallback(async (requestId: string) => {
    // 这里应该实现拒绝逻辑
    console.log('Rejecting merge request:', requestId)
  }, [])

  // 合并分支
  const mergeBranch = useCallback(async (requestId: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.mergeBranch(requestId)
      if (result.success && result.data) {
        setVersions(prev => [result.data!, ...prev])
        setMergeRequests(prev => prev.map(mr =>
          mr.id === requestId ? { ...mr, status: 'merged' as const } : mr
        ))
        await loadData()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to merge branch')
    }
  }, [loadData])

  // 选择版本
  const selectVersion = useCallback((version: Version) => {
    setSelectedVersion(version)
  }, [])

  // 选择分支
  const selectBranch = useCallback((branch: Branch) => {
    switchBranch(branch.id)
  }, [switchBranch])

  // 工具方法
  const getBranchById = useCallback((branchId: string): Branch | null => {
    return branches.find(b => b.id === branchId) || null
  }, [branches])

  const getVersionById = useCallback((versionId: string): Version | null => {
    return versions.find(v => v.id === versionId) || null
  }, [versions])

  const getMergeRequestById = useCallback((requestId: string): MergeRequest | null => {
    return mergeRequests.find(mr => mr.id === requestId) || null
  }, [mergeRequests])

  return {
    versions,
    branches,
    mergeRequests,
    currentBranch,
    selectedVersion,
    loading,
    error,
    createVersion,
    getVersionHistory,
    compareVersions,
    revertToVersion,
    createBranch,
    switchBranch,
    deleteBranch,
    createMergeRequest,
    approveMergeRequest,
    rejectMergeRequest,
    mergeBranch,
    selectVersion,
    selectBranch,
    getBranchById,
    getVersionById,
    getMergeRequestById
  }
}
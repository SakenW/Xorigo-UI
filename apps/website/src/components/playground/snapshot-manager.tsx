/**
 * @fileoverview Snapshot Manager - 快照管理器
 * 支持创建、恢复、删除和编辑快照
 */

'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { useSnapshots, useCompareMode, type Snapshot } from '@/stores/playground.store'

// ===== 主组件 =====

export function SnapshotManager() {
  const {
    snapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    updateSnapshot,
  } = useSnapshots()

  const { setCompareMode, setCompareSnapshots } = useCompareMode()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSnapshots, setSelectedSnapshots] = useState<string[]>([])

  // 过滤快照
  const filteredSnapshots = useMemo(() => {
    if (!searchQuery) return snapshots

    const query = searchQuery.toLowerCase()
    return snapshots.filter(
      (snapshot) =>
        snapshot.name.toLowerCase().includes(query) ||
        snapshot.description?.toLowerCase().includes(query) ||
        snapshot.tags?.some((tag) => tag.toLowerCase().includes(query))
    )
  }, [snapshots, searchQuery])

  // 排序快照 (最新的在前)
  const sortedSnapshots = useMemo(() => {
    return [...filteredSnapshots].sort((a, b) => b.timestamp - a.timestamp)
  }, [filteredSnapshots])

  // 处理快照选择
  const toggleSnapshotSelection = (id: string) => {
    setSelectedSnapshots((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id)
      } else {
        // 最多选择 2 个快照用于对比
        if (prev.length >= 2) {
          return [...prev.slice(1), id]
        }
        return [...prev, id]
      }
    })
  }

  // 进入对比模式
  const handleCompare = () => {
    if (selectedSnapshots.length === 2) {
      setCompareSnapshots(selectedSnapshots[0], selectedSnapshots[1])
      setCompareMode(true)
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">快照管理</h3>
            <Badge variant="default" className="text-xs">
              {snapshots.length} 个快照
            </Badge>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            创建快照
          </Button>
        </div>

        {/* 搜索框 */}
        <input
          type="text"
          placeholder="搜索快照..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* 对比模式按钮 */}
        {selectedSnapshots.length === 2 && (
          <div className="mt-3">
            <Button variant="secondary" size="sm" onClick={handleCompare} className="w-full">
              <CompareIcon className="w-4 h-4 mr-1" />
              对比选中的快照
            </Button>
          </div>
        )}
      </div>

      {/* 快照列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedSnapshots.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchQuery ? '未找到匹配的快照' : '还没有保存的快照'}
          </div>
        ) : (
          sortedSnapshots.map((snapshot) => (
            <SnapshotCard
              key={snapshot.id}
              snapshot={snapshot}
              isSelected={selectedSnapshots.includes(snapshot.id)}
              onSelect={() => toggleSnapshotSelection(snapshot.id)}
              onRestore={() => restoreSnapshot(snapshot.id)}
              onDelete={() => deleteSnapshot(snapshot.id)}
              onUpdate={(updates) => updateSnapshot(snapshot.id, updates)}
            />
          ))
        )}
      </div>

      {/* 创建快照对话框 */}
      {showCreateDialog && (
        <CreateSnapshotDialog
          onClose={() => setShowCreateDialog(false)}
          onCreate={(name, description) => {
            createSnapshot(name, description)
            setShowCreateDialog(false)
          }}
        />
      )}
    </div>
  )
}

// ===== 快照卡片组件 =====

interface SnapshotCardProps {
  snapshot: Snapshot
  isSelected: boolean
  onSelect: () => void
  onRestore: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<Snapshot>) => void
}

function SnapshotCard({
  snapshot,
  isSelected,
  onSelect,
  onRestore,
  onDelete,
  onUpdate,
}: SnapshotCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(snapshot.name)
  const [editDescription, setEditDescription] = useState(snapshot.description || '')

  const handleSave = () => {
    onUpdate({
      name: editName,
      description: editDescription,
    })
    setIsEditing(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card
      className={`transition-all ${
        isSelected ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950' : ''
      }`}
    >
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="快照名称"
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="快照描述 (可选)"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex items-center space-x-2">
              <Button variant="default" size="sm" onClick={handleSave}>
                保存
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                取消
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    className="w-4 h-4 rounded border-border text-primary-500 focus:ring-2 focus:ring-primary-500"
                  />
                  <h4 className="font-medium">{snapshot.name}</h4>
                </div>
                {snapshot.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {snapshot.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>{formatDate(snapshot.timestamp)}</span>
              <span>{snapshot.componentState.name}</span>
            </div>

            {snapshot.tags && snapshot.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {snapshot.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" onClick={onRestore}>
                <RestoreIcon className="w-3 h-3 mr-1" />
                恢复
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon className="w-3 h-3 mr-1" />
                编辑
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <DeleteIcon className="w-3 h-3 mr-1" />
                删除
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ===== 创建快照对话框 =====

interface CreateSnapshotDialogProps {
  onClose: () => void
  onCreate: (name: string, description?: string) => void
}

function CreateSnapshotDialog({ onClose, onCreate }: CreateSnapshotDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), description.trim() || undefined)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h3 className="text-lg font-semibold">创建快照</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              快照名称 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如: 默认状态"
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">描述 (可选)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如: 按钮的默认状态配置"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center space-x-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              取消
            </Button>
            <Button
              variant="default"
              onClick={handleCreate}
              disabled={!name.trim()}
            >
              创建
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===== 图标组件 =====

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="8" height="8" />
      <rect x="14" y="2" width="8" height="8" />
      <line x1="6" y1="14" x2="6" y2="22" />
      <line x1="18" y1="14" x2="18" y2="22" />
    </svg>
  )
}

function RestoreIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 9a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 5" />
      <path d="M21 3v4h-4" />
      <path d="M21 15a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 19" />
      <path d="M3 21v-4h4" />
    </svg>
  )
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

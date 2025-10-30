'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitCompare,
  FileText,
  Plus,
  Minus,
  Edit3,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Download,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Code,
  Layout,
  Palette,
  Settings,
  Package
} from 'lucide-react'

// 变更类型定义
interface DiffChange {
  id: string
  type: 'addition' | 'deletion' | 'modification'
  category: 'component' | 'configuration' | 'style' | 'property' | 'layout'
  path: string
  name: string
  description: string
  oldValue?: any
  newValue?: any
  severity: 'low' | 'medium' | 'high' | 'critical'
  impact: {
    performance: number // 0-100
    compatibility: number // 0-100
    functionality: number // 0-100
  }
  metadata: {
    linesAdded: number
    linesRemoved: number
    filesAffected: string[]
  }
}

interface DiffStatistics {
  totalChanges: number
  additions: number
  deletions: number
  modifications: number
  linesAdded: number
  linesRemoved: number
  filesChanged: number
  categories: {
    component: number
    configuration: number
    style: number
    property: number
    layout: number
  }
  severity: {
    low: number
    medium: number
    high: number
    critical: number
  }
}

interface VersionDiffViewerProps {
  fromVersion: string
  toVersion: string
  changes: DiffChange[]
  statistics: DiffStatistics
  onApplyChange?: (change: DiffChange) => void
  onRevertChange?: (change: DiffChange) => void
  className?: string
}

export function VersionDiffViewer({
  fromVersion,
  toVersion,
  changes,
  statistics,
  onApplyChange,
  onRevertChange,
  className
}: VersionDiffViewerProps) {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyChanged, setShowOnlyChanged] = useState(true)
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed')
  const [sortOrder, setSortOrder] = useState<'severity' | 'impact' | 'category'>('severity')

  // 分类图标映射
  const categoryIcons = {
    component: Package,
    configuration: Settings,
    style: Palette,
    property: Edit3,
    layout: Layout
  }

  // 严重程度颜色映射
  const severityColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    critical: 'text-red-600 bg-red-50 border-red-200'
  }

  // 过滤和排序变更
  const filteredAndSortedChanges = useMemo(() => {
    let filtered = changes

    // 按类别过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(change => change.category === selectedCategory)
    }

    // 按严重程度过滤
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(change => change.severity === selectedSeverity)
    }

    // 按搜索查询过滤
    if (searchQuery) {
      filtered = filtered.filter(change =>
        change.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        change.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        change.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return severityOrder[b.severity] - severityOrder[a.severity]
        case 'impact':
          const impactA = Math.max(a.impact.performance, a.impact.compatibility, a.impact.functionality)
          const impactB = Math.max(b.impact.performance, b.impact.compatibility, b.impact.functionality)
          return impactB - impactA
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

    return filtered
  }, [changes, selectedCategory, selectedSeverity, searchQuery, sortOrder])

  // 展开/收起变更详情
  const toggleChangeExpanded = (changeId: string) => {
    setExpandedChanges(prev => {
      const newSet = new Set(prev)
      if (newSet.has(changeId)) {
        newSet.delete(changeId)
      } else {
        newSet.add(changeId)
      }
      return newSet
    })
  }

  // 获取变更类型图标
  const getChangeIcon = (type: DiffChange['type']) => {
    switch (type) {
      case 'addition':
        return <Plus className="w-4 h-4 text-green-500" />
      case 'deletion':
        return <Minus className="w-4 h-4 text-red-500" />
      case 'modification':
        return <Edit3 className="w-4 h-4 text-blue-500" />
    }
  }

  // 格式化JSON值
  const formatJSONValue = (value: any) => {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  // 计算总体影响评分
  const calculateOverallImpact = (impact: DiffChange['impact']) => {
    return Math.round((impact.performance + impact.compatibility + impact.functionality) / 3)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 头部信息 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">版本对比详情</h3>
          <p className="text-sm text-muted-foreground">
            {fromVersion} → {toVersion} 的详细变更对比
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* 视图模式切换 */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'compact' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              简洁
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'detailed' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              详细
            </button>
          </div>

          {/* 导出按钮 */}
          <button
            onClick={() => {
              // 导出对比结果
              console.log('导出对比结果')
            }}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
          >
            <Download className="w-4 h-4" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-background border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">{statistics.totalChanges}</p>
              <p className="text-sm text-muted-foreground">总变更数</p>
            </div>
            <GitCompare className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="p-4 bg-background border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">+{statistics.linesAdded}</p>
              <p className="text-sm text-muted-foreground">新增行数</p>
            </div>
            <Plus className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="p-4 bg-background border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">-{statistics.linesRemoved}</p>
              <p className="text-sm text-muted-foreground">删除行数</p>
            </div>
            <Minus className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="p-4 bg-background border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{statistics.filesChanged}</p>
              <p className="text-sm text-muted-foreground">文件变更</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* 分类统计 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(statistics.categories).map(([category, count]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          return (
            <div key={category} className="p-3 bg-background border rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{category}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 严重程度分布 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(statistics.severity).map(([severity, count]) => (
          <div key={severity} className={`p-3 border rounded-lg ${severityColors[severity as keyof typeof severityColors]}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{count}</p>
                <p className="text-xs capitalize">{severity}</p>
              </div>
              {severity === 'critical' && <AlertCircle className="w-4 h-4" />}
              {severity === 'high' && <XCircle className="w-4 h-4" />}
              {severity === 'medium' && <AlertCircle className="w-4 h-4" />}
              {severity === 'low' && <CheckCircle className="w-4 h-4" />}
            </div>
          </div>
        ))}
      </div>

      {/* 过滤器 */}
      <div className="p-4 bg-background border rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索变更..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 类别过滤 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有类别</option>
            <option value="component">组件</option>
            <option value="configuration">配置</option>
            <option value="style">样式</option>
            <option value="property">属性</option>
            <option value="layout">布局</option>
          </select>

          {/* 严重程度过滤 */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有严重程度</option>
            <option value="critical">严重</option>
            <option value="high">高</option>
            <option value="medium">中等</option>
            <option value="low">低</option>
          </select>

          {/* 排序方式 */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="severity">按严重程度</option>
            <option value="impact">按影响程度</option>
            <option value="category">按类别</option>
          </select>
        </div>
      </div>

      {/* 变更列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">
            变更详情 ({filteredAndSortedChanges.length} 项)
          </h4>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const allIds = new Set(filteredAndSortedChanges.map(c => c.id))
                setExpandedChanges(allIds)
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              全部展开
            </button>
            <span className="text-muted-foreground">/</span>
            <button
              onClick={() => setExpandedChanges(new Set())}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              全部收起
            </button>
          </div>
        </div>

        <AnimatePresence>
          {filteredAndSortedChanges.map((change) => {
            const isExpanded = expandedChanges.has(change.id)
            const Icon = categoryIcons[change.category]
            const overallImpact = calculateOverallImpact(change.impact)

            return (
              <motion.div
                key={change.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`border rounded-lg overflow-hidden transition-all ${
                  severityColors[change.severity]
                }`}
              >
                {/* 变更头部 */}
                <div
                  className="p-4 cursor-pointer hover:bg-opacity-80"
                  onClick={() => toggleChangeExpanded(change.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {/* 变更类型图标 */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50">
                        {getChangeIcon(change.type)}
                      </div>

                      {/* 变更信息 */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-medium text-foreground">{change.name}</h5>
                          <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${severityColors[change.severity]}`}>
                            {change.severity}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {change.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Icon className="w-3 h-3" />
                            <span className="capitalize">{change.category}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <span className="font-mono">{change.path}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <span className="text-green-500">+{change.metadata.linesAdded}</span>
                            <span className="text-red-500">-{change.metadata.linesRemoved}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <span>影响: {overallImpact}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 展开/收起图标 */}
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 详细信息 */}
                {isExpanded && viewMode === 'detailed' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-current/20 bg-black/5"
                  >
                    <div className="p-4 space-y-4">
                      {/* 影响评估 */}
                      <div>
                        <h6 className="text-sm font-medium mb-2">影响评估</h6>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">性能</span>
                              <span className="text-xs font-medium">{change.impact.performance}%</span>
                            </div>
                            <div className="w-full bg-black/10 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${change.impact.performance}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">兼容性</span>
                              <span className="text-xs font-medium">{change.impact.compatibility}%</span>
                            </div>
                            <div className="w-full bg-black/10 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${change.impact.compatibility}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">功能</span>
                              <span className="text-xs font-medium">{change.impact.functionality}%</span>
                            </div>
                            <div className="w-full bg-black/10 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${change.impact.functionality}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 值变更对比 */}
                      {(change.oldValue !== undefined || change.newValue !== undefined) && (
                        <div>
                          <h6 className="text-sm font-medium mb-2">值变更对比</h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {change.oldValue !== undefined && (
                              <div>
                                <div className="flex items-center space-x-1 mb-1">
                                  <Minus className="w-3 h-3 text-red-500" />
                                  <span className="text-xs text-muted-foreground">原值</span>
                                </div>
                                <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                                  <pre className="text-xs text-red-800 whitespace-pre-wrap overflow-x-auto">
                                    {formatJSONValue(change.oldValue)}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {change.newValue !== undefined && (
                              <div>
                                <div className="flex items-center space-x-1 mb-1">
                                  <Plus className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-muted-foreground">新值</span>
                                </div>
                                <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                                  <pre className="text-xs text-green-800 whitespace-pre-wrap overflow-x-auto">
                                    {formatJSONValue(change.newValue)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 影响文件 */}
                      {change.metadata.filesAffected.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium mb-2">影响的文件</h6>
                          <div className="flex flex-wrap gap-2">
                            {change.metadata.filesAffected.map((file, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-black/10 rounded-md text-xs font-mono"
                              >
                                {file}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-current/20">
                        {onRevertChange && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRevertChange(change)
                            }}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                          >
                            <Minus className="w-4 h-4" />
                            <span>撤销变更</span>
                          </button>
                        )}

                        {onApplyChange && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onApplyChange(change)
                            }}
                            className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                          >
                            <Plus className="w-4 h-4" />
                            <span>应用变更</span>
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(JSON.stringify(change, null, 2))
                          }}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                          <span>复制</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 空状态 */}
      {filteredAndSortedChanges.length === 0 && (
        <div className="py-12 text-center">
          <GitCompare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">未找到变更</h4>
          <p className="text-sm text-muted-foreground">
            尝试调整过滤条件或搜索关键词
          </p>
        </div>
      )}
    </div>
  )
}
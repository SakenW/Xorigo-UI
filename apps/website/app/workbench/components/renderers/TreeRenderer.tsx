'use client'

import React, { useState } from 'react'

interface TreeNode {
  key: string
  title: string
  children?: TreeNode[]
  disabled?: boolean
  icon?: string
  level?: number
}

interface TreeRendererProps {
  treeData?: TreeNode[]
  defaultExpandAll?: boolean
  showLine?: boolean
  showIcon?: boolean
  selectable?: boolean
  checkable?: boolean
  draggable?: boolean
  searchValue?: string
  updateProp?: (prop: string, value: any) => void
}

export default function TreeRenderer({
  treeData = [
    {
      key: '1',
      title: '根节点1',
      icon: '📁',
      children: [
        {
          key: '1-1',
          title: '子节点1-1',
          icon: '📄',
          children: [
            { key: '1-1-1', title: '叶子节点1-1-1', icon: '📝' },
            { key: '1-1-2', title: '叶子节点1-1-2', icon: '📝' }
          ]
        },
        {
          key: '1-2',
          title: '子节点1-2',
          icon: '📄',
          children: [
            { key: '1-2-1', title: '叶子节点1-2-1', icon: '📝' }
          ]
        }
      ]
    },
    {
      key: '2',
      title: '根节点2',
      icon: '📁',
      children: [
        {
          key: '2-1',
          title: '子节点2-1',
          icon: '📄'
        },
        {
          key: '2-2',
          title: '子节点2-2',
          icon: '📄',
          disabled: true
        }
      ]
    },
    {
      key: '3',
      title: '根节点3',
      icon: '📁'
    }
  ],
  defaultExpandAll = true,
  showLine = true,
  showIcon = true,
  selectable = true,
  checkable = false,
  draggable = false,
  searchValue = '',
  updateProp
}: TreeRendererProps) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(
    defaultExpandAll ? getAllKeys(treeData) : []
  )
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOverNode, setDragOverNode] = useState<string | null>(null)

  // 获取所有节点key
  function getAllKeys(nodes: TreeNode[]): string[] {
    const keys: string[] = []
    function traverse(nodeList: TreeNode[]) {
      nodeList.forEach(node => {
        keys.push(node.key)
        if (node.children) {
          traverse(node.children)
        }
      })
    }
    traverse(nodes)
    return keys
  }

  // 切换展开/收起
  const handleExpand = (key: string) => {
    setExpandedKeys(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  // 选择节点
  const handleSelect = (key: string) => {
    if (!selectable) return
    setSelectedKeys(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  // 勾选节点
  const handleCheck = (key: string) => {
    if (!checkable) return
    setCheckedKeys(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  // 拖拽开始
  const handleDragStart = (key: string) => {
    if (!draggable) return
    setDraggedNode(key)
  }

  // 拖拽经过
  const handleDragOver = (key: string) => {
    if (!draggable || !draggedNode) return
    setDragOverNode(key)
  }

  // 拖拽结束
  const handleDragEnd = () => {
    setDraggedNode(null)
    setDragOverNode(null)
  }

  // 搜索高亮
  const highlightText = (text: string, search: string) => {
    if (!search) return text
    const parts = text.split(new RegExp(`(${search})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 dark:bg-yellow-600 text-black dark:text-white px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  // 渲染树节点
  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedKeys.includes(node.key)
    const isSelected = selectedKeys.includes(node.key)
    const isChecked = checkedKeys.includes(node.key)
    const hasChildren = node.children && node.children.length > 0
    const isDraggedOver = dragOverNode === node.key
    const isDragged = draggedNode === node.key

    return (
      <div key={node.key} className="select-none">
        <div
          className={`
            flex items-center py-1 px-2 cursor-pointer rounded transition-colors group
            ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
            ${node.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isDraggedOver ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
            ${isDragged ? 'opacity-50' : ''}
          `}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          draggable={draggable && !node.disabled}
          onDragStart={() => handleDragStart(node.key)}
          onDragOver={() => handleDragOver(node.key)}
          onDragEnd={handleDragEnd}
        >
          {/* 展开/收起图标 */}
          {hasChildren && (
            <button
              onClick={() => handleExpand(node.key)}
              className="mr-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              style={{ width: '16px', height: '16px' }}
            >
              <svg
                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6 12l4-4-4-4v8z"/>
              </svg>
            </button>
          )}

          {/* 占位符 */}
          {!hasChildren && <span className="w-4 inline-block"></span>}

          {/* 复选框 */}
          {checkable && (
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleCheck(node.key)}
              disabled={node.disabled}
              className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
          )}

          {/* 图标 */}
          {showIcon && node.icon && (
            <span className="mr-2 text-sm">
              {node.icon}
            </span>
          )}

          {/* 标题 */}
          <span
            className={`flex-1 text-sm ${node.disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={() => {
              if (hasChildren) {
                handleExpand(node.key)
              }
              handleSelect(node.key)
            }}
          >
            {highlightText(node.title, searchValue)}
          </span>

          {/* 拖拽指示器 */}
          {draggable && !node.disabled && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
            </span>
          )}
        </div>

        {/* 连接线 */}
        {showLine && hasChildren && isExpanded && (
          <div className="relative" style={{ paddingLeft: `${level * 20 + 20}px` }}>
            <div className="absolute left-0 top-0 w-px h-full bg-gray-300 dark:bg-gray-600" style={{ left: '8px' }}></div>
          </div>
        )}

        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div className={showLine ? '' : ''}>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  // 展开/收起全部
  const handleExpandAll = () => {
    setExpandedKeys(getAllKeys(treeData))
  }

  const handleCollapseAll = () => {
    setExpandedKeys([])
  }

  // 清除选择
  const handleClearSelection = () => {
    setSelectedKeys([])
    setCheckedKeys([])
  }

  return (
    <div className="w-full">
      {/* 工具栏 */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            树形控件
          </h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExpandAll}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              展开全部
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              收起全部
            </button>
            <button
              onClick={handleClearSelection}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              清除选择
            </button>
          </div>
        </div>

        {/* 功能开关 */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={showLine}
              onChange={(e) => updateProp && updateProp('showLine', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-gray-600 dark:text-gray-400">显示连接线</label>
          </div>
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={showIcon}
              onChange={(e) => updateProp && updateProp('showIcon', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-gray-600 dark:text-gray-400">显示图标</label>
          </div>
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={selectable}
              onChange={(e) => updateProp && updateProp('selectable', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-gray-600 dark:text-gray-400">可选择</label>
          </div>
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={checkable}
              onChange={(e) => updateProp && updateProp('checkable', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-gray-600 dark:text-gray-400">可勾选</label>
          </div>
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={draggable}
              onChange={(e) => updateProp && updateProp('draggable', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-gray-600 dark:text-gray-400">可拖拽</label>
          </div>
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={defaultExpandAll}
              onChange={(e) => updateProp && updateProp('defaultExpandAll', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-gray-600 dark:text-gray-400">默认展开</label>
          </div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="mb-4">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => updateProp && updateProp('searchValue', e.target.value)}
          placeholder="搜索节点..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
        />
      </div>

      {/* 树形结构 */}
      <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px]">
        {treeData.length > 0 ? (
          <div>
            {treeData.map(node => renderTreeNode(node))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            暂无数据
          </div>
        )}
      </div>

      {/* 状态信息 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>总节点: {getAllKeys(treeData).length}</div>
          <div>展开节点: {expandedKeys.length}</div>
          <div>选中节点: {selectedKeys.length}</div>
          <div>勾选节点: {checkedKeys.length}</div>
          <div>搜索关键词: {searchValue || '无'}</div>
          <div>可拖拽: {draggable ? '是' : '否'}</div>
        </div>
      </div>
    </div>
  )
}
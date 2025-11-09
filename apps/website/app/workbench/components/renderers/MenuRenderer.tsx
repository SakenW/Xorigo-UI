'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MenuItem {
  id: string
  label: string
  icon?: string
  href?: string
  children?: MenuItem[]
  disabled?: boolean
  badge?: string
}

interface MenuRendererProps {
  type?: 'dropdown' | 'sidebar' | 'context' | 'mega'
  items?: MenuItem[]
  variant?: 'default' | 'solid' | 'borderless'
  size?: 'sm' | 'md' | 'lg'
  position?: 'left' | 'right' | 'center'
  updateProp?: (prop: string, value: any) => void
}

const defaultItems: MenuItem[] = [
  {
    id: '1',
    label: '文件',
    icon: '📄',
    children: [
      { id: '1-1', label: '新建文件', href: '#new' },
      { id: '1-2', label: '打开文件', href: '#open' },
      { id: '1-3', label: '保存', href: '#save', badge: 'Ctrl+S' },
    ]
  },
  {
    id: '2',
    label: '编辑',
    icon: '✏️',
    children: [
      { id: '2-1', label: '撤销', href: '#undo', badge: 'Ctrl+Z' },
      { id: '2-2', label: '重做', href: '#redo', badge: 'Ctrl+Y' },
      { id: '2-3', label: '复制', href: '#copy' },
      { id: '2-4', label: '粘贴', href: '#paste' },
    ]
  },
  {
    id: '3',
    label: '视图',
    icon: '👁️',
    children: [
      { id: '3-1', label: '放大', href: '#zoom-in' },
      { id: '3-2', label: '缩小', href: '#zoom-out' },
      { id: '3-3', label: '全屏', href: '#fullscreen' },
    ]
  },
  {
    id: '4',
    label: '帮助',
    icon: '❓',
    children: [
      { id: '4-1', label: '文档', href: '#docs' },
      { id: '4-2', label: '快捷键', href: '#shortcuts' },
      { id: '4-3', label: '关于', href: '#about' },
    ]
  },
]

export default function MenuRenderer({
  type = 'dropdown',
  items = defaultItems,
  variant = 'default',
  size = 'md',
  position = 'left',
  updateProp
}: MenuRendererProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id)
    } else {
      setActiveItem(item.id)
      if (updateProp) {
        updateProp('selectedItem', item.label)
      }
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return 'bg-blue-600 text-white hover:bg-blue-700'
      case 'borderless':
        return 'text-gray-700 hover:bg-gray-100'
      default:
        return 'text-gray-700 hover:bg-gray-100 border border-gray-200'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-sm'
      case 'lg':
        return 'px-4 py-2 text-base'
      default:
        return 'px-3 py-1.5 text-sm'
    }
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = activeItem === item.id
    const isSubmenuOpen = openSubmenu === item.id

    return (
      <div key={item.id} className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          className={`
            w-full text-left flex items-center justify-between
            ${getVariantStyles()}
            ${getSizeStyles()}
            ${isActive ? 'bg-blue-50 border-blue-300' : ''}
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            rounded-md transition-all duration-200
          `}
        >
          <div className="flex items-center space-x-2">
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            {item.badge && (
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <motion.span
                animate={{ rotate: isSubmenuOpen ? 90 : 0 }}
                className="text-gray-400"
              >
                ▶
              </motion.span>
            )}
          </div>
        </motion.button>

        <AnimatePresence>
          {hasChildren && isSubmenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`
                ${depth === 0 ? 'absolute left-full ml-1 top-0' : 'relative mt-1'}
                bg-white border border-gray-200 rounded-lg shadow-lg
                overflow-hidden
                z-50
              `}
            >
              {item.children?.map((child) => renderMenuItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const renderDropdownMenu = () => (
    <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
      <div className="space-y-1">
        {items.map((item) => renderMenuItem(item))}
      </div>
    </div>
  )

  const renderSidebarMenu = () => (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">导航菜单</h3>
      <div className="space-y-1">
        {items.map((item) => renderMenuItem(item))}
      </div>
    </div>
  )

  const renderContextMenu = () => (
    <div className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
      <div className="space-y-1">
        {items.map((item) => renderMenuItem(item))}
      </div>
    </div>
  )

  const renderMegaMenu = () => (
    <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="p-6">
        <div className="grid grid-cols-4 gap-8">
          {items.map((section) => (
            <div key={section.id} className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                {section.icon && <span>{section.icon}</span>}
                <span>{section.label}</span>
              </h4>
              <div className="space-y-1">
                {section.children?.map((item) => renderMenuItem(item))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full">
      {/* 配置面板 */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Menu 配置</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-600">类型</label>
            <select
              value={type}
              onChange={(e) => updateProp?.('type', e.target.value)}
              className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="dropdown">下拉菜单</option>
              <option value="sidebar">侧边栏</option>
              <option value="context">上下文菜单</option>
              <option value="mega">超级菜单</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600">样式</label>
            <select
              value={variant}
              onChange={(e) => updateProp?.('variant', e.target.value)}
              className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="default">默认</option>
              <option value="solid">实心</option>
              <option value="borderless">无边框</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600">尺寸</label>
            <select
              value={size}
              onChange={(e) => updateProp?.('size', e.target.value)}
              className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="sm">小</option>
              <option value="md">中</option>
              <option value="lg">大</option>
            </select>
          </div>
        </div>
      </div>

      {/* 菜单预览 */}
      <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
        {type === 'dropdown' && renderDropdownMenu()}
        {type === 'sidebar' && renderSidebarMenu()}
        {type === 'context' && renderContextMenu()}
        {type === 'mega' && renderMegaMenu()}
      </div>

      {/* 状态信息 */}
      {activeItem && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            选中项目: <span className="font-semibold">{activeItem}</span>
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Menu Component - 支持多层级菜单、多种样式和交互效果
      </div>
    </div>
  )
}
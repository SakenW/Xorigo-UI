'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar, type SidebarItem, Badge } from '@xorigo-ui/core'
import { cn } from '@/utils'
import { componentCategories } from '../../data/component-classification'

interface WorkbenchLayoutProps {
  children: React.ReactNode
  className?: string
  selectedCategory?: string
  onCategorySelect?: (categoryId: string) => void
}

/**
 * 工作台布局组件 - 包含左侧组件分类导航和主内容区域
 */
export function WorkbenchLayout({
  children,
  className,
  selectedCategory = 'all',
  onCategorySelect
}: WorkbenchLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 将组件分类转换为三层SidebarItems：分类 → 子分类 → 具体组件
  const buildComponentNavigation = (): SidebarItem[] => {
    const totalComponents = componentCategories.reduce((total, cat) => total + cat.components.length, 0)

    const items: SidebarItem[] = [
      {
        id: 'all',
        label: '全部组件',
        icon: '🎯',
        active: selectedCategory === 'all',
        badge: totalComponents.toString(),
      },
      {
        id: 'separator-base',
        label: 'Base 基础组件',
        icon: '🎨',
        active: false,
        children: [
          {
            id: 'base-buttons',
            label: '按钮类',
            icon: '🔘',
            active: selectedCategory === 'base-buttons',
            children: [
              {
                id: 'component-Button',
                label: 'Button 按钮',
                icon: '🔘',
                active: selectedCategory === 'component-Button',
                badge: '11变体+6尺寸+特殊样式',
              },
            ],
          },
          {
            id: 'base-text',
            label: '文本类',
            icon: '📝',
            active: selectedCategory === 'base-text',
            children: [
              {
                id: 'component-Typography',
                label: 'Typography 排版',
                icon: '📄',
                active: selectedCategory === 'component-Typography',
                badge: '15变体+9权重+7颜色',
              },
              {
                id: 'component-Kbd',
                label: 'Kbd 键盘',
                icon: '⌨️',
                active: selectedCategory === 'component-Kbd',
              },
            ],
          },
          {
            id: 'base-display',
            label: '展示类',
            icon: '👁️',
            active: selectedCategory === 'base-display',
            children: [
              {
                id: 'component-Icon',
                label: 'Icon 图标',
                icon: '🎨',
                active: selectedCategory === 'component-Icon',
              },
              {
                id: 'component-Avatar',
                label: 'Avatar 头像',
                icon: '👤',
                active: selectedCategory === 'component-Avatar',
              },
              {
                id: 'component-AvatarGroup',
                label: 'AvatarGroup 头像组',
                icon: '👥',
                active: selectedCategory === 'component-AvatarGroup',
              },
              {
                id: 'component-Badge',
                label: 'Badge 徽章',
                icon: '🏷️',
                active: selectedCategory === 'component-Badge',
                badge: '9变体+4尺寸+计数/状态',
              },
            ],
          },
          {
            id: 'base-separator',
            label: '分隔类',
            icon: '➖',
            active: selectedCategory === 'base-separator',
            children: [
              {
                id: 'component-Separator',
                label: 'Separator 分隔线',
                icon: '➖',
                active: selectedCategory === 'component-Separator',
                badge: '2方向',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-form',
        label: 'Form 表单组件',
        icon: '📝',
        active: false,
        children: [
          {
            id: 'form-inputs',
            label: '输入类',
            icon: '📝',
            active: selectedCategory === 'form-inputs',
            children: [
              {
                id: 'component-Input',
                label: 'Input 输入框',
                icon: '📝',
                active: selectedCategory === 'component-Input',
                badge: '6变体+3尺寸+浮动标签',
              },
              {
                id: 'component-Textarea',
                label: 'Textarea 文本域',
                icon: '📄',
                active: selectedCategory === 'component-Textarea',
              },
              {
                id: 'component-SearchInput',
                label: 'SearchInput 搜索框',
                icon: '🔍',
                active: selectedCategory === 'component-SearchInput',
              },
            ],
          },
          {
            id: 'form-selection',
            label: '选择类',
            icon: '✅',
            active: selectedCategory === 'form-selection',
            children: [
              {
                id: 'component-Select',
                label: 'Select 选择器',
                icon: '📋',
                active: selectedCategory === 'component-Select',
                badge: '多选/搜索',
              },
              {
                id: 'component-Checkbox',
                label: 'Checkbox 复选框',
                icon: '☑️',
                active: selectedCategory === 'component-Checkbox',
              },
              {
                id: 'component-Radio',
                label: 'Radio 单选框',
                icon: '🔘',
                active: selectedCategory === 'component-Radio',
              },
              {
                id: 'component-Switch',
                label: 'Switch 开关',
                icon: '🔀',
                active: selectedCategory === 'component-Switch',
              },
              {
                id: 'component-Combobox',
                label: 'Combobox 组合框',
                icon: '🔗',
                active: selectedCategory === 'component-Combobox',
                badge: '自动完成',
              },
            ],
          },
          {
            id: 'form-controls',
            label: '控制器',
            icon: '🎛️',
            active: selectedCategory === 'form-controls',
            children: [
              {
                id: 'component-Slider',
                label: 'Slider 滑块',
                icon: '🎚️',
                active: selectedCategory === 'component-Slider',
              },
            ],
          },
          {
            id: 'form-containers',
            label: '表单容器',
            icon: '📦',
            active: selectedCategory === 'form-containers',
            children: [
              {
                id: 'component-Form',
                label: 'Form 表单',
                icon: '📋',
                active: selectedCategory === 'component-Form',
                badge: '验证',
              },
              {
                id: 'component-FormField',
                label: 'FormField 表单字段',
                icon: '🏷️',
                active: selectedCategory === 'component-FormField',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-data-display',
        label: 'Data Display 数据展示',
        icon: '📊',
        active: false,
        children: [
          {
            id: 'data-cards',
            label: '卡片类',
            icon: '🃏',
            active: selectedCategory === 'data-cards',
            children: [
              {
                id: 'component-Card',
                label: 'Card 卡片',
                icon: '🃏',
                active: selectedCategory === 'component-Card',
                badge: '9变体+交互效果',
              },
              {
                id: 'component-AdvancedCard',
                label: 'AdvancedCard 高级卡片',
                icon: '🎴',
                active: selectedCategory === 'component-AdvancedCard',
              },
              {
                id: 'component-Surface',
                label: 'Surface 表面',
                icon: '📋',
                active: selectedCategory === 'component-Surface',
              },
            ],
          },
          {
            id: 'data-structures',
            label: '结构类',
            icon: '🏗️',
            active: selectedCategory === 'data-structures',
            children: [
              {
                id: 'component-Table',
                label: 'Table 表格',
                icon: '📊',
                active: selectedCategory === 'component-Table',
                badge: '排序/分页',
              },
              {
                id: 'component-List',
                label: 'List 列表',
                icon: '📝',
                active: selectedCategory === 'component-List',
              },
              {
                id: 'component-Accordion',
                label: 'Accordion 手风琴',
                icon: '🪗',
                active: selectedCategory === 'component-Accordion',
                badge: '多面板',
              },
              {
                id: 'component-Carousel',
                label: 'Carousel 轮播',
                icon: '🎠',
                active: selectedCategory === 'component-Carousel',
                badge: '自动播放',
              },
            ],
          },
          {
            id: 'data-code',
            label: '代码类',
            icon: '💻',
            active: selectedCategory === 'data-code',
            children: [
              {
                id: 'component-Code',
                label: 'Code 代码',
                icon: '💻',
                active: selectedCategory === 'component-Code',
                badge: '语法高亮',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-layout',
        label: 'Layout 布局组件',
        icon: '📐',
        active: false,
        children: [
          {
            id: 'layout-containers',
            label: '容器类',
            icon: '📦',
            active: selectedCategory === 'layout-containers',
            children: [
              {
                id: 'component-Container',
                label: 'Container 容器',
                icon: '📦',
                active: selectedCategory === 'component-Container',
                badge: '响应式',
              },
              {
                id: 'component-Box',
                label: 'Box 盒子',
                icon: '📦',
                active: selectedCategory === 'component-Box',
              },
              {
                id: 'component-Panel',
                label: 'Panel 面板',
                icon: '📋',
                active: selectedCategory === 'component-Panel',
              },
              {
                id: 'component-ScrollArea',
                label: 'ScrollArea 滚动区域',
                icon: '📜',
                active: selectedCategory === 'component-ScrollArea',
                badge: '虚拟滚动',
              },
            ],
          },
          {
            id: 'layout-systems',
            label: '布局系统',
            icon: '🏗️',
            active: selectedCategory === 'layout-systems',
            children: [
              {
                id: 'component-Flex',
                label: 'Flex 弹性布局',
                icon: '🔀',
                active: selectedCategory === 'component-Flex',
                badge: '响应式',
              },
              {
                id: 'component-Grid',
                label: 'Grid 网格布局',
                icon: '⊞',
                active: selectedCategory === 'component-Grid',
                badge: '12列',
              },
            ],
          },
          {
            id: 'layout-spacing',
            label: '间距类',
            icon: '📏',
            active: selectedCategory === 'layout-spacing',
            children: [
              {
                id: 'component-Spacer',
                label: 'Spacer 间距',
                icon: '📏',
                active: selectedCategory === 'component-Spacer',
                badge: '任意尺寸',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-navigation',
        label: 'Navigation 导航组件',
        icon: '🧭',
        active: false,
        children: [
          {
            id: 'nav-tabs',
            label: '标签类',
            icon: '🏷️',
            active: selectedCategory === 'nav-tabs',
            children: [
              {
                id: 'component-Tabs',
                label: 'Tabs 标签页',
                icon: '🏷️',
                active: selectedCategory === 'component-Tabs',
                badge: '4变体+3尺寸+4位置+动画',
              },
            ],
          },
          {
            id: 'nav-menus',
            label: '菜单类',
            icon: '📋',
            active: selectedCategory === 'nav-menus',
            children: [
              {
                id: 'component-Menu',
                label: 'Menu 菜单',
                icon: '📋',
                active: selectedCategory === 'component-Menu',
                badge: '下拉菜单',
              },
              {
                id: 'component-Breadcrumb',
                label: 'Breadcrumb 面包屑',
                icon: '🧭',
                active: selectedCategory === 'component-Breadcrumb',
                badge: '路径导航',
              },
              {
                id: 'component-Pagination',
                label: 'Pagination 分页',
                icon: '📄',
                active: selectedCategory === 'component-Pagination',
                badge: '页面导航',
              },
            ],
          },
          {
            id: 'nav-layout',
            label: '导航布局',
            icon: '🗺️',
            active: selectedCategory === 'nav-layout',
            children: [
              {
                id: 'component-Navbar',
                label: 'Navbar 导航栏',
                icon: '🎯',
                active: selectedCategory === 'component-Navbar',
              },
              {
                id: 'component-Sidebar',
                label: 'Sidebar 侧边栏',
                icon: '📋',
                active: selectedCategory === 'component-Sidebar',
                badge: '可折叠',
              },
              {
                id: 'component-DataTable',
                label: 'DataTable 数据表格',
                icon: '📊',
                active: selectedCategory === 'component-DataTable',
                badge: '排序/筛选',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-feedback',
        label: 'Feedback 反馈组件',
        icon: '💬',
        active: false,
        children: [
          {
            id: 'feedback-alerts',
            label: '提示类',
            icon: '📢',
            active: selectedCategory === 'feedback-alerts',
            children: [
              {
                id: 'component-Alert',
                label: 'Alert 警告',
                icon: '⚠️',
                active: selectedCategory === 'component-Alert',
                badge: '4变体+动画+可关闭',
              },
              {
                id: 'component-Toast',
                label: 'Toast 消息',
                icon: '🍞',
                active: selectedCategory === 'component-Toast',
                badge: '自动消失',
              },
              {
                id: 'component-Notification',
                label: 'Notification 通知',
                icon: '📢',
                active: selectedCategory === 'component-Notification',
              },
            ],
          },
          {
            id: 'feedback-loading',
            label: '加载类',
            icon: '⏳',
            active: selectedCategory === 'feedback-loading',
            children: [
              {
                id: 'component-Loading',
                label: 'Loading 加载',
                icon: '⏳',
                active: selectedCategory === 'component-Loading',
                badge: '3尺寸+遮罩层+文本',
              },
              {
                id: 'component-Spinner',
                label: 'Spinner 旋转器',
                icon: '🔄',
                active: selectedCategory === 'component-Spinner',
              },
              {
                id: 'component-Progress',
                label: 'Progress 进度条',
                icon: '📊',
                active: selectedCategory === 'component-Progress',
                badge: '2种类型',
              },
              {
                id: 'component-Skeleton',
                label: 'Skeleton 骨架屏',
                icon: '🦴',
                active: selectedCategory === 'component-Skeleton',
                badge: '动画',
              },
            ],
          },
          {
            id: 'feedback-theme',
            label: '主题类',
            icon: '🎨',
            active: selectedCategory === 'feedback-theme',
            children: [
              {
                id: 'component-ThemeToggle',
                label: 'ThemeToggle 主题切换',
                icon: '🌓',
                active: selectedCategory === 'component-ThemeToggle',
                badge: '10主题',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-overlay',
        label: 'Overlay 弹层组件',
        icon: '🔳',
        active: false,
        children: [
          {
            id: 'overlay-modals',
            label: '模态类',
            icon: '🪟',
            active: selectedCategory === 'overlay-modals',
            children: [
              {
                id: 'component-Modal',
                label: 'Modal 模态框',
                icon: '🪟',
                active: selectedCategory === 'component-Modal',
                badge: '5变体+5尺寸+Drawer',
              },
              {
                id: 'component-Dialog',
                label: 'Dialog 对话框',
                icon: '💬',
                active: selectedCategory === 'component-Dialog',
              },
              {
                id: 'component-Sheet',
                label: 'Sheet 工作表',
                icon: '📄',
                active: selectedCategory === 'component-Sheet',
                badge: '4方向',
              },
            ],
          },
          {
            id: 'overlay-drawers',
            label: '抽屉类',
            icon: '📂',
            active: selectedCategory === 'overlay-drawers',
            children: [
              {
                id: 'component-Drawer',
                label: 'Drawer 抽屉',
                icon: '📂',
                active: selectedCategory === 'component-Drawer',
                badge: '4位置',
              },
            ],
          },
          {
            id: 'overlay-popovers',
            label: '弹出类',
            icon: '💭',
            active: selectedCategory === 'overlay-popovers',
            children: [
              {
                id: 'component-Popover',
                label: 'Popover 气泡',
                icon: '💭',
                active: selectedCategory === 'component-Popover',
                badge: '4方向',
              },
              {
                id: 'component-Tooltip',
                label: 'Tooltip 提示框',
                icon: '💬',
                active: selectedCategory === 'component-Tooltip',
                badge: '5变体+3尺寸+4位置+箭头',
              },
              {
                id: 'component-HoverCard',
                label: 'HoverCard 悬停卡片',
                icon: '🃏',
                active: selectedCategory === 'component-HoverCard',
              },
            ],
          },
          {
            id: 'overlay-special',
            label: '特殊弹层',
            icon: '✨',
            active: selectedCategory === 'overlay-special',
            children: [
              {
                id: 'component-Lightbox',
                label: 'Lightbox 灯箱',
                icon: '🖼️',
                active: selectedCategory === 'component-Lightbox',
                badge: '图片预览',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-composite',
        label: 'Composite 复合组件',
        icon: '🧩',
        active: false,
        children: [
          {
            id: 'composite-ui',
            label: 'UI模式',
            icon: '🎨',
            active: selectedCategory === 'composite-ui',
            children: [
              {
                id: 'component-AnimatedCard',
                label: 'AnimatedCard 动画卡片',
                icon: '🎴',
                active: selectedCategory === 'component-AnimatedCard',
                badge: '动画',
              },
              {
                id: 'component-ResponsiveLayout',
                label: 'ResponsiveLayout 响应式布局',
                icon: '📱',
                active: selectedCategory === 'component-ResponsiveLayout',
                badge: '断点适配',
              },
              {
                id: 'component-BasicHeader',
                label: 'BasicHeader 基础头部',
                icon: '🎯',
                active: selectedCategory === 'component-BasicHeader',
              },
            ],
          },
          {
            id: 'composite-groups',
            label: '组合类',
            icon: '🔗',
            active: selectedCategory === 'composite-groups',
            children: [
              {
                id: 'component-InputGroup',
                label: 'InputGroup 输入组',
                icon: '📝',
                active: selectedCategory === 'component-InputGroup',
              },
              {
                id: 'component-ButtonGroup',
                label: 'ButtonGroup 按钮组',
                icon: '🔘',
                active: selectedCategory === 'component-ButtonGroup',
                badge: '垂直/水平',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-system',
        label: 'System 系统组件',
        icon: '⚙️',
        active: false,
        children: [
          {
            id: 'system-providers',
            label: '提供者',
            icon: '🏗️',
            active: selectedCategory === 'system-providers',
            children: [
              {
                id: 'component-ConfigProvider',
                label: 'ConfigProvider 配置',
                icon: '⚙️',
                active: selectedCategory === 'component-ConfigProvider',
                badge: '全局配置',
              },
            ],
          },
          {
            id: 'system-portals',
            label: '传送门',
            icon: '🚪',
            active: selectedCategory === 'system-portals',
            children: [
              {
                id: 'component-Portal',
                label: 'Portal 传送门',
                icon: '🚪',
                active: selectedCategory === 'component-Portal',
              },
            ],
          },
          {
            id: 'system-focus',
            label: '焦点管理',
            icon: '🎯',
            active: selectedCategory === 'system-focus',
            children: [
              {
                id: 'component-FocusTrap',
                label: 'FocusTrap 焦点陷阱',
                icon: '🪤',
                active: selectedCategory === 'component-FocusTrap',
              },
              {
                id: 'component-FocusScope',
                label: 'FocusScope 焦点范围',
                icon: '🎯',
                active: selectedCategory === 'component-FocusScope',
              },
            ],
          },
          {
            id: 'system-utils',
            label: '工具类',
            icon: '🛠️',
            active: selectedCategory === 'system-utils',
            children: [
              {
                id: 'component-ScrollLock',
                label: 'ScrollLock 滚动锁定',
                icon: '🔒',
                active: selectedCategory === 'component-ScrollLock',
              },
              {
                id: 'component-DismissableLayer',
                label: 'DismissableLayer 可关闭层',
                icon: '❌',
                active: selectedCategory === 'component-DismissableLayer',
              },
              {
                id: 'component-VisuallyHidden',
                label: 'VisuallyHidden 视觉隐藏',
                icon: '👻',
                active: selectedCategory === 'component-VisuallyHidden',
                badge: '无障碍',
              },
            ],
          },
        ],
      },
      {
        id: 'separator-visualization',
        label: 'Visualization 可视化组件',
        icon: '📈',
        active: false,
        children: [
          {
            id: 'viz-charts',
            label: '图表类',
            icon: '📊',
            active: selectedCategory === 'viz-charts',
            children: [
              {
                id: 'component-Chart',
                label: 'Chart 图表基础',
                icon: '📊',
                active: selectedCategory === 'component-Chart',
                badge: '多类型',
              },
              {
                id: 'component-BarChart',
                label: 'BarChart 柱状图',
                icon: '📊',
                active: selectedCategory === 'component-BarChart',
                badge: '垂直/水平',
              },
              {
                id: 'component-LineChart',
                label: 'LineChart 折线图',
                icon: '📈',
                active: selectedCategory === 'component-LineChart',
                badge: '平滑曲线',
              },
              {
                id: 'component-PieChart',
                label: 'PieChart 饼图',
                icon: '🥧',
                active: selectedCategory === 'component-PieChart',
                badge: '环形图',
              },
            ],
          },
          {
            id: 'viz-gauges',
            label: '仪表类',
            icon: '🎚️',
            active: selectedCategory === 'viz-gauges',
            children: [
              {
                id: 'component-Gauge',
                label: 'Gauge 仪表盘',
                icon: '🎚️',
                active: selectedCategory === 'component-Gauge',
                badge: '多分段',
              },
              {
                id: 'component-Stat',
                label: 'Stat 统计数值',
                icon: '📊',
                active: selectedCategory === 'component-Stat',
                badge: '趋势显示',
              },
            ],
          },
        ],
      },
    ]

    return items
  }

  const handleItemClick = (item: SidebarItem) => {
    // 处理三层导航点击：分类 → 子分类 → 具体组件
    if (onCategorySelect) {
      if (item.id === 'all') {
        // 全部组件
        onCategorySelect('all')
      } else if (item.id.startsWith('component-')) {
        // 具体组件层级（第三层）
        onCategorySelect(item.id)
      } else if (!item.children) {
        // 子分类层级（第二层）
        onCategorySelect(item.id)
      }
      // 第一层分类有children，不需要处理
    }
  }

  const navigationItems = buildComponentNavigation()

  return (
    <div className={cn('flex h-screen bg-gray-50', className)}>
      {/* 左侧导航 */}
      <div className="relative z-20">
        <Sidebar
          items={navigationItems}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          logo={
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
          }
          logoText="Xorigo UI"
          footer={
            <div className="space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                v2.0.1
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                智能工作台
              </div>
            </div>
          }
          onItemClick={handleItemClick}
          width="280px"
          collapsedWidth="64px"
          className="border-r border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部信息栏 */}
        <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              智能工作台
            </h1>

            {/* 当前分类信息 - 支持三层导航显示 */}
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {selectedCategory === 'all'
                  ? `🎯 全部组件 (${componentCategories.reduce((total, cat) => total + cat.components.length, 0)})`
                  : selectedCategory.startsWith('component-')
                    ? (() => {
                        const componentName = selectedCategory.replace('component-', '')
                        const category = componentCategories.find(c =>
                          c.components.some(comp => comp.name === componentName)
                        )
                        return category ? `${category.icon} ${componentName}` : componentName
                      })()
                    : (() => {
                        // 获取友好的分类显示名称
                        const displayNameMap: Record<string, string> = {
                          'base-buttons': '🔘 按钮类',
                          'base-text': '📝 文本类',
                          'base-display': '👁️ 展示类',
                          'base-separator': '➖ 分隔类',
                          'form-inputs': '📝 输入类',
                          'form-selection': '✅ 选择类',
                          'form-controls': '🎛️ 控制器',
                          'form-containers': '📦 表单容器',
                          'data-cards': '🃏 卡片类',
                          'data-structures': '🏗️ 结构类',
                          'data-code': '💻 代码类',
                          'layout-containers': '📦 容器类',
                          'layout-systems': '🏗️ 布局系统',
                          'layout-spacing': '📏 间距类',
                          'nav-tabs': '🏷️ 标签类',
                          'nav-menus': '📋 菜单类',
                          'nav-layout': '🗺️ 导航布局',
                          'feedback-alerts': '📢 提示类',
                          'feedback-loading': '⏳ 加载类',
                          'feedback-theme': '🎨 主题类',
                          'overlay-modals': '🪟 模态类',
                          'overlay-drawers': '📂 抽屉类',
                          'overlay-popovers': '💭 弹出类',
                          'overlay-special': '✨ 特殊弹层',
                          'composite-ui': '🎨 UI模式',
                          'composite-groups': '🔗 组合类',
                          'system-providers': '🏗️ 提供者',
                          'system-portals': '🚪 传送门',
                          'system-focus': '🎯 焦点管理',
                          'system-utils': '🛠️ 工具类',
                          'viz-charts': '📊 图表类',
                          'viz-gauges': '🎚️ 仪表类',
                        }

                        if (displayNameMap[selectedCategory]) {
                          return displayNameMap[selectedCategory]
                        }

                        // 第一层大分类
                        const category = componentCategories.find(c => c.id === selectedCategory)
                        return category ? `${category.icon} ${category.name}` : selectedCategory
                      })()
                }
              </Badge>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                开发环境就绪
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              React 19 • TypeScript 5.9 • Tailwind CSS 4
            </div>
            <button
              onClick={() => window.open('https://github.com/xorigo-ui/xorigo-ui', '_blank')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* 移动端遮罩 */}
      {!sidebarCollapsed && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}

WorkbenchLayout.displayName = 'WorkbenchLayout'
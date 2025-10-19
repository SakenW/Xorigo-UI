'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

// 添加渐变动画样式
const gradientStyles = `
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .gradient-animated {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }
`

// 在组件挂载时注入样式
if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = gradientStyles
  document.head.appendChild(styleElement)
}
import { Input } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Typography } from '@xorigo-ui/core'
import { ComponentCard, CodeBlock } from '@xorigo-ui/core'
import { GradientDemonstrator } from '../gradient-demonstrator/gradient-demonstrator'
import { getAllComponents } from '../../../data/component-classification'
import { ComponentPropertiesDrawer } from './component-properties-drawer'
import { WorkbenchLayout } from '../workbench-layout'
import { MasonryLayout } from '../shared/masonry-layout'

/**
 * 搜索框变体配置 - 应用 ComponentCard 优雅设计
 */
const searchBoxVariants = cva(
  'relative transition-all duration-300 rounded-2xl overflow-hidden',
  {
    variants: {
      focused: {
        true: [
          'ring-1 ring-inset ring-blue-500/20',
          'shadow-[0_4px_12px_rgba(59,130,246,0.08),0_2px_4px_rgba(59,130,246,0.04)]',
          'bg-white'
        ].join(' '),
        false: [
          'ring-1 ring-inset ring-black/5',
          'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
          'hover:ring-black/10',
          'hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.06)]',
          'bg-white'
        ].join(' ')
      }
    }
  }
)

interface SmartWorkbenchProps {
  className?: string
}

export function SmartWorkbench({ className }: SmartWorkbenchProps) {
  const [selectedComponent, setSelectedComponent] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mounted, setMounted] = useState(false)

  const components = getAllComponents()
  const categories = Array.from(new Set(components.map(comp => comp.category)))

  useEffect(() => {
    setMounted(true)
  }, [])

  // 智能搜索逻辑 - 支持三层导航筛选
  const filteredComponents = components.filter(component => {
    const matchesSearch = searchTerm === '' ||
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())

    // 支持三层导航筛选
    let matchesCategory = selectedCategory === 'all'

    if (!matchesCategory) {
      if (selectedCategory.startsWith('component-')) {
        // 第三层：具体组件筛选
        const componentName = selectedCategory.replace('component-', '')
        matchesCategory = component.name === componentName
      } else if (selectedCategory.includes('-')) {
        // 第二层：子分类筛选（如 base-buttons, form-inputs）
        const categoryMap: Record<string, string[]> = {
          'base-buttons': ['Button'],
          'base-text': ['Typography', 'Kbd'],
          'base-display': ['Icon', 'Avatar', 'AvatarGroup', 'Badge'],
          'base-separator': ['Separator'],
          'form-inputs': ['Input', 'Textarea', 'SearchInput'],
          'form-selection': ['Select', 'Checkbox', 'Radio', 'Switch', 'Combobox'],
          'form-controls': ['Slider'],
          'form-containers': ['Form', 'FormField'],
          'data-cards': ['Card', 'AdvancedCard', 'Surface'],
          'data-structures': ['Table', 'List', 'Accordion', 'Carousel'],
          'data-code': ['Code'],
          'layout-containers': ['Container', 'Box', 'Panel', 'ScrollArea'],
          'layout-systems': ['Flex', 'Grid'],
          'layout-spacing': ['Spacer'],
          'nav-tabs': ['Tabs'],
          'nav-menus': ['Menu', 'Breadcrumb', 'Pagination'],
          'nav-layout': ['Navbar', 'Sidebar', 'DataTable'],
          'feedback-alerts': ['Alert', 'Toast', 'Notification'],
          'feedback-loading': ['Loading', 'Spinner', 'Progress', 'Skeleton'],
          'feedback-theme': ['ThemeToggle'],
          'overlay-modals': ['Modal', 'Dialog', 'Sheet'],
          'overlay-drawers': ['Drawer'],
          'overlay-popovers': ['Popover', 'Tooltip', 'HoverCard'],
          'overlay-special': ['Lightbox'],
          'composite-ui': ['AnimatedCard', 'ResponsiveLayout', 'BasicHeader'],
          'composite-groups': ['InputGroup', 'ButtonGroup'],
          'system-providers': ['ConfigProvider'],
          'system-portals': ['Portal'],
          'system-focus': ['FocusTrap', 'FocusScope'],
          'system-utils': ['ScrollLock', 'DismissableLayer', 'VisuallyHidden'],
          'gradient-text': ['GradientText'],
          'gradient-background': ['GradientBackground'],
          'gradient-border': ['GradientBorder'],
          'gradient-demo': ['GradientDemo'],
          'viz-charts': ['Chart', 'BarChart', 'LineChart', 'PieChart'],
          'viz-gauges': ['Gauge', 'Stat'],
        }

        const allowedComponents = categoryMap[selectedCategory] || []
        matchesCategory = allowedComponents.includes(component.name)
      } else {
        // 第一层：大分类筛选（如 base, form, layout）
        matchesCategory = component.category === selectedCategory
      }
    }

    return matchesSearch && matchesCategory
  })

  // 搜索结果 - 转换为瀑布流所需格式
  const masonryItems = filteredComponents.map((component) => ({
    id: component.name,
    content: null, // 我们使用children render prop
    // 预估高度：根据组件类型和内容复杂度估算
    height: getEstimatedHeight(component)
  }))

  /**
   * 根据组件类型和内容预估高度 - 精确的组件特定估算
   */
  function getEstimatedHeight(component: any): number {
    // 基于实际组件内容的精确高度估算
    const heightMap: Record<string, number> = {
      // 基础组件 - 实际测量高度
      'Button': 416,      // 8个按钮网格 (2x4) + 间距
      'Typography': 304,  // 标题 + 段落文本
      'Icon': 280,        // 简单图标展示
      'Avatar': 280,      // 头像展示
      'AvatarGroup': 280, // 头像组展示
      'Badge': 284,       // 3个徽章 + 间距
      'Separator': 268,   // 分隔线展示
      'Kbd': 268,         // 键盘提示展示

      // 布局组件
      'Container': 280,   // 简单容器展示
      'Box': 268,         // 最小容器展示
      'Panel': 280,       // 面板容器展示
      'ScrollArea': 280,  // 滚动容器展示
      'Flex': 280,        // 弹性布局展示
      'Grid': 280,        // 网格布局展示
      'Spacer': 268,      // 间距组件展示

      // 导航组件
      'Tabs': 284,        // 2个标签 + 间距
      'Menu': 280,        // 菜单展示
      'Breadcrumb': 268,  // 面包屑展示
      'Pagination': 280,  // 分页展示
      'Navbar': 304,      // 导航栏展示
      'Sidebar': 280,     // 侧边栏展示
      'DataTable': 280,   // 数据表格导航

      // 表单组件 - 基于实际Input展示内容
      'Input': 416,       // 4个输入框 + 图标
      'Textarea': 280,    // 文本域展示
      'Select': 280,      // 选择器展示
      'Checkbox': 280,    // 复选框展示
      'Radio': 280,       // 单选框展示
      'Switch': 280,      // 开关展示
      'Slider': 280,      // 滑块展示
      'Combobox': 280,    // 组合框展示
      'SearchInput': 280, // 搜索输入框展示
      'Form': 280,        // 表单容器展示
      'FormField': 280,   // 表单字段展示

      // 数据展示组件
      'Card': 296,        // Card示例内容
      'AdvancedCard': 280, // 高级卡片展示
      'Surface': 280,     // 表面容器展示
      'Table': 280,       // 表格展示
      'List': 280,        // 列表展示
      'Accordion': 280,   // 手风琴展示
      'Carousel': 280,    // 轮播展示
      'Code': 280,        // 代码展示
      'AdvancedCard': 280, // 高级卡片展示

      // 反馈组件
      'Alert': 284,       // Alert提示内容
      'Toast': 280,       // 消息提示展示
      'Notification': 280, // 通知展示
      'Loading': 304,     // 加载动画 + 文本
      'Spinner': 280,     // 旋转加载器
      'Skeleton': 280,    // 骨架屏展示
      'Progress': 280,    // 进度条展示
      'ThemeToggle': 280, // 主题切换展示

      // 弹层组件
      'Modal': 284,       // 模态框按钮
      'Dialog': 280,      // 对话框展示
      'Drawer': 280,      // 抽屉展示
      'Popover': 280,     // 气泡展示
      'Tooltip': 304,     // 悬停提示 + Tooltip
      'HoverCard': 280,   // 悬停卡片展示
      'Lightbox': 280,    // 灯箱展示
      'Sheet': 280,       // 工作表展示

      // 复合组件
      'AnimatedCard': 280, // 动画卡片展示
      'InputGroup': 280,  // 输入组展示
      'ButtonGroup': 280, // 按钮组展示
      'ResponsiveLayout': 280, // 响应式布局展示
      'BasicHeader': 280, // 基础头部展示

      // 系统组件
      'ConfigProvider': 280, // 配置提供者展示
      'Portal': 280,       // 传送门展示
      'FocusTrap': 280,    // 焦点陷阱展示
      'FocusScope': 280,   // 焦点范围展示
      'ScrollLock': 280,   // 滚动锁定展示
      'DismissableLayer': 280, // 可关闭层展示
      'VisuallyHidden': 280, // 视觉隐藏展示

      // 可视化组件
      'Chart': 280,        // 图表基础展示
      'BarChart': 280,     // 柱状图展示
      'LineChart': 280,    // 折线图展示
      'PieChart': 280,     // 饼图展示
      'Gauge': 280,        // 仪表盘展示
      'Stat': 280,        // 统计数值展示
    }

    // 使用精确的高度映射，如果没有则使用默认高度
    let baseHeight = heightMap[component.name] || 300

    // 为代码块特别处理 - Button和Input有大量代码示例
    if (['Button', 'Input'].includes(component.name)) {
      baseHeight += 140 // 额外的代码块高度
    }

    // 根据描述长度微调
    const descriptionLength = component.description?.length || 0
    if (descriptionLength > 50) {
      baseHeight += Math.min(Math.floor(descriptionLength / 50) * 8, 24)
    }

    // 添加间距以减少空位 - 所有组件增加8px基础间距
    baseHeight += 8

    // 为特定组件添加额外补偿以匹配实际渲染高度
    const compensations: Record<string, number> = {
      'Typography': -4,  // Typography通常比预估的要小
      'Icon': -12,       // Icon组件很简洁
      'Avatar': -12,     // Avatar组件很简洁
      'AvatarGroup': -12,
      'Badge': -8,       // Badge组件较小
      'Separator': -16,  // Separator很细
      'Kbd': -16,        // Kbd组件较小
      'Container': -8,   // Container是简单容器
      'Box': -16,        // Box是最小容器
      'Panel': -8,       // Panel容器
      'Flex': -12,       // Flex布局组件
      'Grid': -12,       // Grid布局组件
      'Spacer': -20,     // Spacer是空白组件
      'Menu': -8,        // Menu组件
      'Breadcrumb': -16, // Breadcrumb较小
      'Navbar': 0,       // Navbar保持原高度
      'Sidebar': -8,     // Sidebar组件
      'DataTable': -8,   // DataTable导航
      'Select': -8,      // Select组件
      'Checkbox': -12,   // Checkbox较小
      'Radio': -12,      // Radio较小
      'Switch': -12,     // Switch较小
      'Slider': -8,      // Slider组件
      'Combobox': -8,    // Combobox组件
      'SearchInput': -8, // SearchInput组件
      'Form': -12,       // Form容器
      'FormField': -12,  // FormField组件
      'List': -12,       // List组件
      'Code': -12,       // Code展示组件
      'Surface': -8,     // Surface容器
      'Toast': -16,      // Toast较小
      'Notification': -8, // Notification组件
      'Spinner': -12,    // Spinner较小
      'Skeleton': -12,   // Skeleton较小
      'Progress': -12,   // Progress较小
      'ThemeToggle': -12, // ThemeToggle较小
      'Dialog': -12,     // Dialog组件
      'Drawer': -8,      // Drawer组件
      'Popover': -12,    // Popover较小
      'HoverCard': -12,  // HoverCard较小
      'Lightbox': -8,    // Lightbox组件
      'Sheet': -8,       // Sheet组件
      'InputGroup': -12, // InputGroup组件
      'ButtonGroup': -12, // ButtonGroup组件
      'ResponsiveLayout': -8, // ResponsiveLayout组件
      'BasicHeader': -8, // BasicHeader组件
      'ConfigProvider': -16, // ConfigProvider是逻辑组件
      'Portal': -16,     // Portal是逻辑组件
      'FocusTrap': -16,  // FocusTrap是逻辑组件
      'FocusScope': -16, // FocusScope是逻辑组件
      'ScrollLock': -16, // ScrollLock是逻辑组件
      'DismissableLayer': -16, // DismissableLayer是逻辑组件
      'VisuallyHidden': -20, // VisuallyHidden是隐藏组件
      'Chart': -12,       // Chart组件
      'BarChart': -12,    // BarChart组件
      'LineChart': -12,   // LineChart组件
      'PieChart': -12,    // PieChart组件
      'Gauge': -8,        // Gauge组件
      'Stat': -12,        // Stat组件
    }

    // 应用补偿
    baseHeight += compensations[component.name] || 0

    return Math.max(Math.round(baseHeight), 240) // 最小高度240px
  }

  // 获取推荐组件
  const recommendedComponents = components.slice(0, 6)

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 处理分类选择
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <WorkbenchLayout
      className={className}
      selectedCategory={selectedCategory}
      onCategorySelect={handleCategorySelect}
    >
      <div className="p-6">
        {/* 智能搜索区域 */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(searchBoxVariants({ focused: isSearchFocused }))}
          >
            <div className="p-6">
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
                <Input
                  placeholder="搜索组件名称、功能或描述... (例如: 按钮、表单、导航)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-12 pr-4 h-14 text-base border-0 bg-transparent focus:outline-none focus:ring-0"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 智能推荐标签 */}
              {!searchTerm && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">智能推荐</span>
                    <Badge variant="outline" className="text-xs">AI</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['按钮组件', '表单输入', '数据展示', '导航菜单', '模态对话框', '布局容器'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg border border-blue-200/30 hover:border-blue-300/50 transition-all duration-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

                          </div>
          </motion.div>
        </div>

        {/* 组件标题和统计信息 */}
        <div className="mb-8 pb-6 border-b-2 border-[var(--border-secondary)]">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            智能组件工作台
          </h1>
          <p className="mt-2 text-base text-[var(--text-tertiary)]">
            展示所有组件的变体、尺寸和状态。支持多种视觉风格，提供完整的交互反馈和无障碍支持。
          </p>

          {/* 统计信息 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-primary-action)]/10 text-[var(--bg-primary-action)] border border-[var(--bg-primary-action)]/20">
              {filteredComponents.length} 个组件
            </span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-secondary-action)]/10 text-[var(--bg-secondary-action)] border border-[var(--bg-secondary-action)]/20">
                {selectedCategory}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--bg-success)]/10 text-[var(--bg-success)] border border-[var(--bg-success)]/20">
              完整无障碍支持
            </span>
          </div>
        </div>

        {/* 现代化瀑布流布局 */}
        <div className="relative w-full min-h-[400px]">
          <MasonryLayout
            items={masonryItems}
            columns={3}
            gap={24}
            enableAnimation={true}
            itemClassName="masonry-item"
            onAnimationComplete={() => {
              // 动画完成回调
            }}
          >
            {(item) => {
              const component = filteredComponents.find(c => c.name === item.id)
              if (!component) return null

              return (
                <ComponentCard
                key={component.name}
                variant="default"
                density="compact"
                title={component.name}
                subtitle={component.description}
                showcase={
                  <div className="flex flex-col items-center gap-2 p-3 bg-[var(--bg-secondary)]/50 rounded-lg min-h-[100px] justify-center">
                    <div className="text-xl mb-1">🎨</div>
                    <div className="text-sm text-[var(--text-tertiary)] text-center">
                      {component.category} 组件
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {component.name === 'Button' && (
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <Button size="sm" variant="primary">主要</Button>
                          <Button size="sm" variant="secondary">次要</Button>
                          <Button size="sm" variant="success">成功</Button>
                          <Button size="sm" variant="warning">警告</Button>
                          <Button size="sm" variant="danger">危险</Button>
                          <Button size="sm" variant="ghost">幽灵</Button>
                          <Button size="sm" variant="link">链接</Button>
                          <Button size="sm" variant="outline">边框</Button>
                        </div>
                      )}
                      {component.name === 'Input' && (
                        <div className="flex flex-col gap-2 w-full">
                          <Input size="sm" placeholder="默认样式" />
                          <Input size="sm" variant="outlined" placeholder="轮廓样式" />
                          <Input size="sm" variant="filled" placeholder="填充样式" />
                          <Input size="sm" leftIcon={<span>🔍</span>} placeholder="左图标" />
                        </div>
                      )}
                      {component.name === 'Card' && (
                        <div className="p-3 bg-white rounded-lg border border-[var(--border-secondary)] shadow-sm">
                          <div className="text-sm font-medium">Card 示例</div>
                        </div>
                      )}
                      {component.name === 'Modal' && (
                        <Button size="sm" variant="primary">打开模态框</Button>
                      )}
                      {component.name === 'Alert' && (
                        <div className="p-2 bg-[var(--bg-info)]/10 border border-[var(--bg-info)]/20 rounded text-sm text-[var(--bg-info)]">
                          Alert 提示
                        </div>
                      )}
                      {component.name === 'Typography' && (
                        <div className="text-center">
                          <Typography variant="h3">标题</Typography>
                          <Typography variant="p">段落文本</Typography>
                        </div>
                      )}
                      {component.name === 'Tabs' && (
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-[var(--bg-primary-action)]/10 text-[var(--bg-primary-action)] rounded text-sm">标签1</span>
                          <span className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded text-sm">标签2</span>
                        </div>
                      )}
                      {component.name === 'Tooltip' && (
                        <div className="relative group">
                          <Button size="sm" variant="ghost">悬停提示</Button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--bg-inverse)] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Tooltip 提示
                          </div>
                        </div>
                      )}
                      {component.name === 'Loading' && (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--bg-primary-action)] border-t-transparent"></div>
                          <span className="text-sm text-[var(--text-tertiary)]">加载中...</span>
                        </div>
                      )}
                      {component.name === 'Badge' && (
                        <div className="flex gap-2">
                          <Badge variant="default">默认</Badge>
                          <Badge variant="primary">主要</Badge>
                          <Badge variant="success">成功</Badge>
                        </div>
                      )}
                      {/* 渐变组件展示 */}
                      {component.name === 'GradientText' && (
                        <div className="text-center space-y-2">
                          <div className="inline-block">
                            <div style={{
                              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                              渐变文字
                            </div>
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)]">
                            支持动态分类
                          </div>
                        </div>
                      )}
                      {component.name === 'GradientBackground' && (
                        <div className="w-full p-3 rounded-lg text-white text-center text-xs relative overflow-hidden" style={{
                          background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
                          backgroundSize: '200% 200%',
                          animation: 'gradient-shift 3s ease infinite'
                        }}>
                          <div className="relative z-10">
                            <div className="font-medium">渐变背景</div>
                            <div className="text-xs opacity-90 mt-1">支持动画效果</div>
                          </div>
                        </div>
                      )}
                      {component.name === 'GradientBorder' && (
                        <div className="w-full p-3 rounded-lg text-center text-xs relative" style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b)',
                          backgroundSize: '200% 200%',
                          animation: 'gradient-shift 3s ease infinite',
                          padding: '2px'
                        }}>
                          <div className="bg-white rounded p-2">
                            <div className="font-medium text-gray-800">渐变边框</div>
                            <div className="text-xs text-gray-600 mt-1">动态彩色边框</div>
                          </div>
                        </div>
                      )}
                      {component.name === 'GradientDemo' && (
                        <div className="text-center space-y-2">
                          <div className="text-lg mb-1">🌈</div>
                          <div className="text-xs text-[var(--text-tertiary)] font-medium">
                            渐变演示系统
                          </div>
                          <div className="flex justify-center gap-1 mt-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                          </div>
                        </div>
                      )}
                      {/* 其他组件的默认展示 */}
                      {!['Button', 'Input', 'Card', 'Modal', 'Alert', 'Typography', 'Tabs', 'Tooltip', 'Loading', 'Badge', 'GradientText', 'GradientBackground', 'GradientBorder', 'GradientDemo'].includes(component.name) && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[var(--bg-tertiary)] rounded flex items-center justify-center text-sm font-bold">
                            {component.name.charAt(0)}
                          </div>
                          <span className="text-sm text-[var(--text-secondary)]">{component.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                }
                usage={
                  <CodeBlock
                    code={component.name === 'Button' ? `import { Button } from '@xorigo-ui/core'

// 变体样式
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="success">成功按钮</Button>
<Button variant="warning">警告按钮</Button>
<Button variant="danger">危险按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="link">链接按钮</Button>
<Button variant="outline">边框按钮</Button>

// 尺寸规格
<Button size="xs">超小按钮</Button>
<Button size="sm">小型按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大型按钮</Button>
<Button size="xl">超大按钮</Button>
<Button size="2xl">特大按钮</Button>

// 特殊状态
<Button variant="primary" disabled>禁用状态</Button>
<Button variant="primary" loading>加载状态</Button>
<Button variant="primary" leftIcon={<span>→</span>}>左图标</Button>
<Button variant="primary" iconOnly ariaLabel="星标">☆</Button>
<Button variant="primary" fullWidth>全宽按钮</Button>` :
                          component.name === 'Input' ? `import { Input } from '@xorigo-ui/core'

// 变体样式
<Input variant="default" placeholder="默认样式" />
<Input variant="filled" placeholder="填充样式" />
<Input variant="outlined" placeholder="轮廓样式" />
<Input variant="underlined" placeholder="下划线样式" />
<Input variant="ghost" placeholder="幽灵样式" />
<Input variant="neon" placeholder="霓虹样式" />

// 尺寸规格
<Input size="sm" placeholder="小型输入框" />
<Input size="md" placeholder="中型输入框" />
<Input size="lg" placeholder="大型输入框" />

// 特殊功能
<Input label="标签文本" placeholder="带标签的输入框" />
<Input error="错误信息" placeholder="错误状态" />
<Input leftIcon={<span>🔍</span>} placeholder="左图标" />
<Input rightIcon={<span>👁️</span>} placeholder="右图标" />
<Input clearable placeholder="可清除" />
<Input showPasswordToggle type="password" placeholder="密码输入" />
<Input floatingLabel label="浮动标签" placeholder="" />` :
                          component.name === 'GradientText' ? `import { GradientText } from '@xorigo-ui/core'

// 基础用法
<GradientText category="ui-basic">
  渐变文字
</GradientText>

// 不同分类
<GradientText category="navigation">导航文字</GradientText>
<GradientText category="feedback">反馈文字</GradientText>
<GradientText category="data-display">数据文字</GradientText>

// 状态变化
<GradientText category="ui-basic" state="hover">悬停状态</GradientText>
<GradientText category="ui-basic" state="selected">选中状态</GradientText>

// 自定义标签
<GradientText category="forms" as="h1">标题渐变</GradientText>
<GradientText category="charts" as="span">内联渐变</GradientText>` :
                          component.name === 'GradientBackground' ? `import { GradientBackground } from '@xorigo-ui/core'

// 基础用法
<GradientBackground category="ui-basic">
  内容区域
</GradientBackground>

// 动画效果
<GradientBackground category="feedback" animated={true}>
  动画背景
</GradientBackground>

// 不同分类
<GradientBackground category="navigation">导航背景</GradientBackground>
<GradientBackground category="overlays">覆盖层背景</GradientBackground>

// 状态变化
<GradientBackground category="inputs" state="hover">悬停背景</GradientBackground>
<GradientBackground category="layout" state="selected">选中背景</GradientBackground>` :
                          component.name === 'GradientBorder' ? `import { GradientBorder } from '@xorigo-ui/core'

// 基础用法
<GradientBorder category="ui-basic">
  内容区域
</GradientBorder>

// 动画效果
<GradientBorder category="charts" animated={true}>
  动画边框
</GradientBorder>

// 不同分类
<GradientBorder category="navigation">导航边框</GradientBorder>
<GradientBorder category="forms">表单边框</GradientBorder>

// 状态变化
<GradientBorder category="feedback" state="hover">悬停边框</GradientBorder>
<GradientBorder category="layout" state="selected">选中边框</GradientBorder>` :
                          component.name === 'GradientDemo' ? `import { GradientDemo } from '@xorigo-ui/core'

// 完整演示系统
<GradientDemo />

// 组件特性：
// - 10个组件分类配色方案
// - 3种状态变化 (normal, hover, selected)
// - 交互式标签导航 (总览、组件、状态、代码)
// - 实时预览和代码示例
// - 令牌化渐变系统
// - 完全消除硬编码

// 支持的组件分类：
// ui-basic, inputs, navigation, feedback, overlays,
// data-display, layout, charts, forms, utilities` :
                          `import { ${component.name} } from '@xorigo-ui/core'

// 基础用法
<${component.name} />

// 更多示例请查看文档`}
                    language="tsx"
                    title={`${component.name} 组件示例`}
                    copyable
                  />
                }
              />
            )
          }}
          </MasonryLayout>

          {/* 空状态处理 */}
          {masonryItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到匹配的组件</h3>
                <p className="text-gray-600 mb-6">尝试调整搜索关键词或选择不同的分类</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                >
                  清除过滤条件
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* 属性编辑器 - 抽屉式面板 */}
        <AnimatePresence>
          {selectedComponent && (
            <ComponentPropertiesDrawer
              component={selectedComponent}
              isOpen={!!selectedComponent}
              onClose={() => setSelectedComponent(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </WorkbenchLayout>
  )
}
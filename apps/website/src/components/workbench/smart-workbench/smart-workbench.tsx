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
import { MasonryLayoutV2 } from '../shared/masonry-layout-v2'

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

  // 搜索结果 - 转换为瀑布流所需格式（简化版）
  const masonryItems = filteredComponents.map((component) => ({
    id: component.name,
    content: null, // 我们使用children render prop
  }))


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

        {/* 现代化瀑布流布局 - 使用简化版 */}
        <div className="relative w-full min-h-[400px]">
          <MasonryLayoutV2
            items={masonryItems}
            columns={3}
            gap={24}
            enableAnimation={true}
            itemClassName="masonry-item"
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
          </MasonryLayoutV2>

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
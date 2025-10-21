'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge, Button } from '@xorigo-ui/core'
import { CodeBlock } from '@xorigo-ui/core'
import { cn } from '@/utils'
import { ComponentPropertyEditor } from '../component-previews/component-property-editor'

interface EnhancedComponentCardProps {
  component: {
    name: string
    description: string
    category: string
  }
  showcase?: React.ReactNode
  usage?: React.ReactNode
  variant?: 'default' | 'compact' | 'detailed'
  density?: 'compact' | 'comfortable' | 'spacious'
  interactive?: boolean
  className?: string
}

/**
 * 增强组件卡片 - 包含丰富的预览效果和交互动画
 */
export function EnhancedComponentCard({
  component,
  showcase,
  usage,
  variant = 'default',
  density = 'comfortable',
  interactive = true,
  className
}: EnhancedComponentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPropertyEditor, setShowPropertyEditor] = useState(false)
  const [componentProperties, setComponentProperties] = useState<Record<string, any>>({})

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -4 },
    tap: { scale: 0.98 }
  }

  const densityClasses = {
    compact: 'p-4',
    comfortable: 'p-6',
    spacious: 'p-8'
  }

  const getComponentIcon = (name: string) => {
    const iconMap: Record<string, string> = {
      'Button': '🔘',
      'Input': '📝',
      'Card': '🃏',
      'Modal': '🪟',
      'Alert': '📢',
      'Typography': '📄',
      'Tabs': '🏷️',
      'Tooltip': '💬',
      'Loading': '⏳',
      'Badge': '🏷️',
      'Avatar': '👤',
      'AvatarGroup': '👥',
      'Icon': '🎨',
      'Separator': '➖',
      'Kbd': '⌨️',
      'Textarea': '📄',
      'SearchInput': '🔍',
      'Select': '📋',
      'Checkbox': '☑️',
      'Radio': '🔘',
      'Switch': '🔀',
      'Combobox': '🔗',
      'Slider': '🎚️',
      'Form': '📋',
      'FormField': '🏷️',
      'AdvancedCard': '🎴',
      'Surface': '📋',
      'Table': '📊',
      'List': '📝',
      'Accordion': '🪗',
      'Carousel': '🎠',
      'Code': '💻',
      'Container': '📦',
      'Box': '📦',
      'Panel': '📋',
      'ScrollArea': '📜',
      'Flex': '🔀',
      'Grid': '⊞',
      'Spacer': '📏',
      'Menu': '📋',
      'Breadcrumb': '🧭',
      'Pagination': '📄',
      'Navbar': '🎯',
      'Sidebar': '📋',
      'DataTable': '📊',
      'Toast': '🍞',
      'Notification': '📢',
      'Spinner': '🔄',
      'Progress': '📊',
      'Skeleton': '🦴',
      'ThemeToggle': '🌓',
      'Dialog': '💬',
      'Sheet': '📄',
      'Popover': '💭',
      'HoverCard': '🃏',
      'Lightbox': '🖼️',
      'AnimatedCard': '🎴',
      'ResponsiveLayout': '📱',
      'BasicHeader': '🎯',
      'InputGroup': '📝',
      'ButtonGroup': '🔘',
      'ConfigProvider': '⚙️',
      'Portal': '🚪',
      'FocusTrap': '🪤',
      'FocusScope': '🎯',
      'ScrollLock': '🔒',
      'DismissableLayer': '❌',
      'VisuallyHidden': '👻',
      'GradientText': '📝',
      'GradientBackground': '🎨',
      'GradientBorder': '🔲',
      'GradientDemo': '🌈',
      'Chart': '📊',
      'BarChart': '📊',
      'LineChart': '📈',
      'PieChart': '🥧',
      'Gauge': '🎚️',
      'Stat': '📊'
    }

    return iconMap[name] || '🎨'
  }

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'base': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      'form': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      'data-display': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      'layout': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
      'navigation': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
      'feedback': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      'overlay': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
      'composite': 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800',
      'system': 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
      'gradient': 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 dark:from-purple-900/20 dark:to-pink-900/20 dark:text-purple-400 dark:border-purple-800',
      'visualization': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800'
    }

    return colorMap[category] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
  }

  const getCategoryLabel = (category: string) => {
    const labelMap: Record<string, string> = {
      'base': '基础组件',
      'form': '表单组件',
      'data-display': '数据展示',
      'layout': '布局组件',
      'navigation': '导航组件',
      'feedback': '反馈组件',
      'overlay': '弹层组件',
      'composite': '复合组件',
      'system': '系统组件',
      'gradient': '渐变组件',
      'visualization': '可视化组件'
    }

    return labelMap[category] || category
  }

  // 处理属性变化
  const handlePropertyChange = (property: string, value: any) => {
    if (property === 'reset') {
      setComponentProperties({})
    } else {
      setComponentProperties(prev => ({
        ...prev,
        [property]: value
      }))
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden',
        densityClasses[density],
        interactive && 'cursor-pointer',
        isHovered && 'ring-2 ring-blue-500/20 dark:ring-blue-400/20',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 卡片头部 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {getComponentIcon(component.name)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {component.name}
            </h3>
            <Badge
              variant="outline"
              className={cn('text-xs font-medium', getCategoryColor(component.category))}
            >
              {getCategoryLabel(component.category)}
            </Badge>
          </div>
        </div>

        {/* 交互按钮 */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setShowPropertyEditor(!showPropertyEditor)}
            className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
            title="属性编辑"
          >
            ⚙️
          </button>
          <button
            onClick={() => setShowCode(!showCode)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            title="查看代码"
          >
            {'</>'}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            title={isExpanded ? '收起' : '展开'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* 描述 */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {component.description}
      </p>

      {/* 组件预览区域 */}
      {showcase && (
        <div className={cn(
          'mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700',
          'min-h-[120px] flex items-center justify-center'
        )}>
          {showcase}
        </div>
      )}

      {/* 快速操作按钮 */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '收起详情' : '查看详情'}
        </Button>
        <Button
          size="sm"
          variant="primary"
          className="flex-1"
          onClick={() => setShowCode(!showCode)}
        >
          {showCode ? '隐藏代码' : '查看代码'}
        </Button>
      </div>

      {/* 展开区域 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 overflow-hidden"
          >
            <div className="space-y-4">
              {/* 属性编辑器 */}
              {showPropertyEditor && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">属性编辑器</h4>
                    <button
                      onClick={() => setShowPropertyEditor(false)}
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                    >
                      ✕
                    </button>
                  </div>
                  <ComponentPropertyEditor
                    component={component}
                    onPropertyChange={handlePropertyChange}
                    className="max-h-96 overflow-y-auto"
                  />
                </div>
              )}

              {/* 快速操作标签 */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPropertyEditor(!showPropertyEditor)}
                  className={showPropertyEditor ? 'bg-purple-100 border-purple-300 text-purple-700' : ''}
                >
                  ⚙️ 属性编辑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCode(!showCode)}
                  className={showCode ? 'bg-blue-100 border-blue-300 text-blue-700' : ''}
                >
                  {'</>'} 查看代码
                </Button>
              </div>

              {/* 特性列表 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">组件特性</h4>
                <div className="flex flex-wrap gap-2">
                  {['响应式设计', '无障碍支持', '主题定制', 'TypeScript 支持'].map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 当前属性显示 */}
              {Object.keys(componentProperties).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">当前属性</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto">
                      {JSON.stringify(componentProperties, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* 使用场景 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">使用场景</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  适用于表单输入、数据展示、用户交互等多种场景，提供一致的用户体验。
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 代码区域 */}
      <AnimatePresence>
        {showCode && usage && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 overflow-hidden"
          >
            <div className="max-h-96 overflow-auto">
              {usage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬停状态指示器 */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </motion.div>
      )}
    </motion.div>
  )
}
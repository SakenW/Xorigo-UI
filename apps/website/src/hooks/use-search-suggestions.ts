'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

// 组件名称列表，用于搜索建议
const COMPONENT_NAMES = [
  'Button', 'Input', 'Card', 'Modal', 'Alert', 'Typography', 'Tabs', 'Tooltip',
  'Loading', 'Badge', 'Avatar', 'AvatarGroup', 'Icon', 'Separator', 'Kbd',
  'Textarea', 'SearchInput', 'Select', 'Checkbox', 'Radio', 'Switch', 'Combobox',
  'Slider', 'Form', 'FormField', 'AdvancedCard', 'Surface', 'Table', 'List',
  'Accordion', 'Carousel', 'Code', 'Container', 'Box', 'Panel', 'ScrollArea',
  'Flex', 'Grid', 'Spacer', 'Menu', 'Breadcrumb', 'Pagination', 'Navbar',
  'Sidebar', 'DataTable', 'Toast', 'Notification', 'Spinner', 'Progress',
  'Skeleton', 'ThemeToggle', 'Dialog', 'Sheet', 'Popover', 'HoverCard',
  'Lightbox', 'AnimatedCard', 'ResponsiveLayout', 'BasicHeader', 'InputGroup',
  'ButtonGroup', 'ConfigProvider', 'Portal', 'FocusTrap', 'FocusScope',
  'ScrollLock', 'DismissableLayer', 'VisuallyHidden', 'GradientText',
  'GradientBackground', 'GradientBorder', 'GradientDemo', 'Chart', 'BarChart',
  'LineChart', 'PieChart', 'Gauge', 'Stat'
]

// 功能关键词，用于搜索建议
const FUNCTION_KEYWORDS = [
  '按钮组件', '表单输入', '数据展示', '导航菜单', '模态对话框', '布局容器',
  '卡片组件', '加载动画', '主题切换', '响应式设计', '无障碍支持',
  '渐变背景', '动画效果', '表格组件', '选择器', '开关组件', '进度条',
  '提示信息', '面包屑导航', '分页组件', '输入验证', '拖拽排序',
  '虚拟滚动', '懒加载', '搜索过滤', '数据可视化', '图表统计',
  '手风琴', '轮播图', '时间选择', '颜色选择', '文件上传',
  '评分组件', '步骤条', '标签页', '树形控件', '级联选择',
  '自动完成', '穿梭框', '图片预览', '二维码', '日历组件'
]

/**
 * 搜索建议钩子
 */
export function useSearchSuggestions(searchTerm: string, maxSuggestions: number = 8) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 生成搜索建议
  const generateSuggestions = useCallback((term: string): string[] => {
    if (!term || term.trim().length < 1) {
      return []
    }

    const normalizedTerm = term.toLowerCase().trim()
    const allSuggestions = [...COMPONENT_NAMES, ...FUNCTION_KEYWORDS]

    // 按匹配度排序的建议
    const scoredSuggestions = allSuggestions
      .map(suggestion => {
        const normalizedSuggestion = suggestion.toLowerCase()
        let score = 0

        // 完全匹配
        if (normalizedSuggestion === normalizedTerm) {
          score = 100
        }
        // 开头匹配
        else if (normalizedSuggestion.startsWith(normalizedTerm)) {
          score = 80
        }
        // 包含匹配
        else if (normalizedSuggestion.includes(normalizedTerm)) {
          score = 60
        }
        // 模糊匹配（字符相似度）
        else {
          const commonChars = normalizedTerm.split('').filter(char =>
            normalizedSuggestion.includes(char)
          ).length
          score = (commonChars / normalizedTerm.length) * 40
        }

        // 长度越接近，分数越高
        const lengthDiff = Math.abs(normalizedSuggestion.length - normalizedTerm.length)
        const lengthScore = Math.max(0, 20 - lengthDiff * 2)
        score += lengthScore

        return { suggestion, score }
      })
      .filter(({ score }) => score > 20) // 过滤低分建议
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions)
      .map(({ suggestion }) => suggestion)

    return scoredSuggestions
  }, [maxSuggestions])

  // 当搜索词变化时更新建议
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 1) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    // 模拟异步加载（实际应用中可以调用 API）
    const timer = setTimeout(() => {
      const newSuggestions = generateSuggestions(searchTerm)
      setSuggestions(newSuggestions)
      setIsLoading(false)
    }, 150) // 添加轻微延迟以避免频繁更新

    return () => clearTimeout(timer)
  }, [searchTerm, generateSuggestions])

  // 热门搜索建议（当没有搜索词时显示）
  const popularSuggestions = useMemo(() => {
    return [
      '按钮组件', '表单输入', '数据展示', '导航菜单',
      '模态对话框', '布局容器', '卡片组件', '加载动画'
    ]
  }, [])

  return {
    suggestions,
    isLoading,
    popularSuggestions,
    hasSuggestions: suggestions.length > 0,
    showSuggestions: searchTerm.trim().length >= 1 && suggestions.length > 0
  }
}
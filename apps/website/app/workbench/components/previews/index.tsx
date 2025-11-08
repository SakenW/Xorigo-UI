'use client'

import React from 'react'

// 导入所有类别的预览组件
import { FormPreviews } from './FormPreviews'
import { DisplayPreviews } from './DisplayPreviews'
import { FeedbackPreviews } from './FeedbackPreviews'
import { NavigationPreviews } from './NavigationPreviews'
import { LayoutPreviews } from './LayoutPreviews'
import { DataDisplayPreviews } from './DataDisplayPreviews'
import { InputEnhancedPreviews } from './InputEnhancedPreviews'

interface ComponentPreviewThumbnailProps {
  componentName: string
  className?: string
}

// 组件类别映射
const COMPONENT_CATEGORIES = {
  forms: FormPreviews,
  display: DisplayPreviews,
  feedback: FeedbackPreviews,
  navigation: NavigationPreviews,
  layout: LayoutPreviews,
  'data-display': DataDisplayPreviews,
  'input-enhanced': InputEnhancedPreviews,
} as const

// 获取组件所属的类别
function getComponentCategory(componentName: string): keyof typeof COMPONENT_CATEGORIES {
  const formComponents = ['TextInput', 'PasswordInput', 'NumberInput', 'EmailInput', 'PhoneInput', 'Select', 'Checkbox', 'Radio', 'Switch', 'Button']
  const displayComponents = ['Heading', 'Text', 'Label', 'Badge', 'Tag', 'Divider', 'Card']
  const feedbackComponents = ['Alert', 'Message', 'Progress', 'Spinner', 'Empty']
  const navigationComponents = ['Menu', 'Breadcrumb', 'Pagination', 'Steps', 'Anchor', 'BackTop']
  const layoutComponents = ['Row', 'Col', 'Collapse']
  const dataDisplayComponents = ['Table', 'List', 'Tree', 'Timeline']
  const inputEnhancedComponents = ['DatePicker', 'ColorPicker', 'Upload', 'Editor']

  if (formComponents.includes(componentName)) return 'forms'
  if (displayComponents.includes(componentName)) return 'display'
  if (feedbackComponents.includes(componentName)) return 'feedback'
  if (navigationComponents.includes(componentName)) return 'navigation'
  if (layoutComponents.includes(componentName)) return 'layout'
  if (dataDisplayComponents.includes(componentName)) return 'data-display'
  if (inputEnhancedComponents.includes(componentName)) return 'input-enhanced'

  return 'display' // 默认类别
}

// 主要的组件预览缩略图组件
export function ComponentPreviewThumbnail({ componentName, className = "" }: ComponentPreviewThumbnailProps) {
  // 获取组件类别
  const category = getComponentCategory(componentName)
  const PreviewComponent = COMPONENT_CATEGORIES[category]

  // 渲染对应的预览组件
  const renderPreview = () => {
    const preview = PreviewComponent({ componentName })
    if (preview) return preview

    // 如果没有找到对应的预览组件，显示默认的组件名称
    return (
      <div className="w-full max-w-xs p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {componentName}
        </p>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderPreview()}
    </div>
  )
}

// 导出所有预览组件，以便外部可以直接使用
export {
  FormPreviews,
  DisplayPreviews,
  FeedbackPreviews,
  NavigationPreviews,
  LayoutPreviews,
  DataDisplayPreviews,
  InputEnhancedPreviews,
}

// 导出组件类别映射，便于外部扩展
export { COMPONENT_CATEGORIES }
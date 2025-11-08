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

// 新增的预览组件
import { ChartPreview } from './ChartsPreviews'
import { BlockPreview } from './BlocksPreviews'
import { AdvancedDataDisplayPreview } from './AdvancedDataDisplayPreviews'
import { EnhancedInputsPreview } from './EnhancedInputsPreviews'
import { FeedbackMotionPreview } from './FeedbackMotionPreviews'
import { OtherComponentsPreview } from './OtherComponentsPreviews'

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
  charts: ChartPreview,
  blocks: BlockPreview,
  'advanced-data-display': AdvancedDataDisplayPreview,
  'enhanced-inputs': EnhancedInputsPreview,
  'feedback-motion': FeedbackMotionPreview,
  'other-components': OtherComponentsPreview,
} as const

// 获取组件所属的类别
function getComponentCategory(componentName: string): keyof typeof COMPONENT_CATEGORIES {
  // 原有的39个核心组件
  const formComponents = ['TextInput', 'PasswordInput', 'NumberInput', 'EmailInput', 'PhoneInput', 'Select', 'Checkbox', 'Radio', 'Switch', 'Button']
  const displayComponents = ['Heading', 'Text', 'Label', 'Badge', 'Tag', 'Divider', 'Card']
  const feedbackComponents = ['Alert', 'Message', 'Progress', 'Spinner']
  const navigationComponents = ['Menu', 'Breadcrumb', 'Pagination', 'Steps', 'Anchor', 'BackTop']
  const layoutComponents = ['Row', 'Col', 'Collapse']
  const dataDisplayComponents = ['Table', 'List', 'Tree', 'Timeline']
  const inputEnhancedComponents = ['DatePicker', 'ColorPicker', 'Upload', 'Editor']

  // 新增的图表组件 (19个)
  const chartComponents = [
    'AreaChart', 'BarChart', 'LineChart', 'PieChart', 'ColumnChart',
    'DonutChart', 'FunnelChart', 'GaugeChart', 'RadarChart', 'Heatmap',
    'MiniChart', 'Sparkline', 'ChartContainer', 'ChartTooltip',
    'Legend', 'Axis', 'GridLines', 'SimpleMode', 'ChartArea'
  ]

  // 新增的业务区块组件 (15个)
  const blockComponents = [
    'HeroSection', 'FeatureSection', 'PricingSection', 'TestimonialSection',
    'LoginSection', 'RegisterSection', 'AuthCard', 'ResetPasswordSection',
    'CallToActionSection', 'FAQSection', 'ChartPanel', 'KPOverview',
    'StatsGrid', 'FilterBar', 'ActivityFeed'
  ]

  // 新增的高级数据展示组件 (15个)
  const advancedDataDisplayComponents = [
    'Avatar', 'AvatarGroup', 'ChipDisplay', 'StatisticCard', 'DataGrid',
    'DescriptionList', 'KeyValueList', 'ListItem', 'InfoTooltip',
    'Steps', 'Timeline'
  ]

  // 新增的输入增强组件 (15个)
  const enhancedInputComponents = [
    'Autocomplete', 'ButtonGroup', 'CheckboxGroup', 'Chip', 'ColorPicker',
    'DatePicker', 'DateTimePicker', 'TimePicker', 'FileUpload',
    'IconButton', 'RadioGroup', 'RangeSlider', 'Rating', 'Toggle',
    'UploadButton'
  ]

  // 新增的反馈动效组件 (13个)
  const feedbackMotionComponents = [
    'Announcement', 'Banner', 'Empty', 'EmptyState', 'InlineAlert',
    'Loader', 'Result', 'Skeleton', 'SkeletonAvatar', 'SkeletonBlock',
    'SkeletonText', 'Snackbar'
  ]

  // 新增的其他专业组件 (19个)
  const otherComponents = [
    // 布局组件
    'AppLayout', 'Gap', 'PageContainer', 'Space', 'Wrap',
    // 导航组件
    'AppShell', 'ContextualMenu', 'Link', 'NavLink', 'NavMenu',
    'SegmentedControl', 'Sidenav', 'SkipNav', 'Stepper', 'Topbar',
    // 浮层组件
    'ConfirmDialog', 'ImagePreview', 'SidePanel'
  ]

  // 检查各个类别
  if (formComponents.includes(componentName)) return 'forms'
  if (displayComponents.includes(componentName)) return 'display'
  if (feedbackComponents.includes(componentName)) return 'feedback'
  if (navigationComponents.includes(componentName)) return 'navigation'
  if (layoutComponents.includes(componentName)) return 'layout'
  if (dataDisplayComponents.includes(componentName)) return 'data-display'
  if (inputEnhancedComponents.includes(componentName)) return 'input-enhanced'

  // 新增类别检查
  if (chartComponents.includes(componentName)) return 'charts'
  if (blockComponents.includes(componentName)) return 'blocks'
  if (advancedDataDisplayComponents.includes(componentName)) return 'advanced-data-display'
  if (enhancedInputComponents.includes(componentName)) return 'enhanced-inputs'
  if (feedbackMotionComponents.includes(componentName)) return 'feedback-motion'
  if (otherComponents.includes(componentName)) return 'other-components'

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
  ChartPreview,
  BlockPreview,
  AdvancedDataDisplayPreview,
  EnhancedInputsPreview,
  FeedbackMotionPreview,
  OtherComponentsPreview,
}

// 导出组件类别映射，便于外部扩展
export { COMPONENT_CATEGORIES }
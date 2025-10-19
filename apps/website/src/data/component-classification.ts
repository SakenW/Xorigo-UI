/**
 * Xorigo UI 组件分类映射配置
 *
 * 基于唯一事实文档的9大分类体系
 * 将现有组件映射到规范的分类结构
 */

import { ComponentType } from 'react'

// ============================================================================
// 组件分类体系 - 基于 SHARED/COMPONENT-CLASSIFICATION-SYSTEM.md
// ============================================================================

export interface ComponentInfo {
  name: string
  description: string
  variants?: string[]
  props?: string[]
  category: string
  subcategory?: string
}

export interface ComponentCategory {
  id: string
  name: string
  icon: string
  description: string
  components: ComponentInfo[]
  order: number
}

// ============================================================================
// 1. 🎨 Base (基础组件) - 最基础的UI构建块
// ============================================================================
const baseComponents: ComponentInfo[] = [
  {
    name: 'Button',
    description: '按钮组件 - 支持多种变体和尺寸',
    variants: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    props: ['variant', 'size', 'disabled', 'loading'],
    category: 'base'
  },
  {
    name: 'Typography',
    description: '文本/排版组件',
    variants: ['h1', 'h2', 'h3', 'h4', 'body', 'caption'],
    props: ['variant', 'weight', 'color', 'align'],
    category: 'base'
  },
  {
    name: 'Icon',
    description: '图标注册/渲染组件',
    props: ['name', 'size', 'color'],
    category: 'base'
  },
  {
    name: 'Avatar',
    description: '头像组件',
    props: ['src', 'alt', 'size', 'fallback'],
    category: 'base'
  },
  {
    name: 'Badge',
    description: '徽章组件',
    variants: ['default', 'success', 'warning', 'error'],
    props: ['variant', 'size', 'color'],
    category: 'base'
  },
  {
    name: 'AvatarGroup',
    description: '头像组组件',
    props: ['max', 'size', 'avatars'],
    category: 'base'
  },
  {
    name: 'Separator',
    description: '分隔线组件',
    variants: ['horizontal', 'vertical'],
    props: ['orientation', 'decorative'],
    category: 'base'
  },
  {
    name: 'Kbd',
    description: '键盘提示组件',
    props: ['children', 'size'],
    category: 'base'
  }
]

// ============================================================================
// 2. 📐 Layout (布局组件) - 页面布局和空间分配
// ============================================================================
const layoutComponents: ComponentInfo[] = [
  {
    name: 'Container',
    description: '页面容器/宽度限制',
    props: ['maxWidth', 'centered', 'padding'],
    category: 'layout'
  },
  {
    name: 'Flex',
    description: '弹性布局组件',
    props: ['direction', 'justify', 'align', 'gap', 'wrap'],
    category: 'layout'
  },
  {
    name: 'Grid',
    description: '网格布局组件',
    props: ['columns', 'gap', 'areas'],
    category: 'layout'
  },
  {
    name: 'Box',
    description: '最小容器/Box',
    props: ['padding', 'margin', 'display', 'position'],
    category: 'layout'
  },
  {
    name: 'Spacer',
    description: '空白间距组件',
    props: ['size', 'direction'],
    category: 'layout'
  },
  {
    name: 'Panel',
    description: '面板容器组件',
    props: ['title', 'padding', 'bordered'],
    category: 'layout'
  },
  {
    name: 'ScrollArea',
    description: '滚动容器/虚拟滚动适配位',
    props: ['direction', 'scrollbar', 'className'],
    category: 'layout'
  }
]

// ============================================================================
// 3. 🧭 Navigation (导航组件) - 提供导航和路由功能
// ============================================================================
const navigationComponents: ComponentInfo[] = [
  {
    name: 'Tabs',
    description: '标签页组件',
    props: ['defaultValue', 'orientation', 'activationMode'],
    category: 'navigation'
  },
  {
    name: 'Menu',
    description: '菜单组件',
    props: ['items', 'orientation', 'trigger'],
    category: 'navigation'
  },
  {
    name: 'Breadcrumb',
    description: '面包屑导航',
    props: ['items', 'separator', 'maxItems'],
    category: 'navigation'
  },
  {
    name: 'Pagination',
    description: '分页组件',
    props: ['currentPage', 'totalPages', 'onPageChange'],
    category: 'navigation'
  },
  {
    name: 'Navbar',
    description: '导航栏组件',
    props: ['title', 'actions', 'position'],
    category: 'navigation'
  },
  {
    name: 'Sidebar',
    description: '侧边栏组件',
    props: ['open', 'onOpenChange', 'position'],
    category: 'navigation'
  },
  {
    name: 'DataTable',
    description: '数据表格导航',
    props: ['data', 'columns', 'sortable', 'filterable'],
    category: 'navigation'
  }
]

// ============================================================================
// 4. 📝 Form (表单组件) - 用户输入数据的核心交互组件
// ============================================================================
const formComponents: ComponentInfo[] = [
  {
    name: 'Input',
    description: '输入组件',
    variants: ['text', 'email', 'password', 'search'],
    props: ['type', 'placeholder', 'disabled', 'error'],
    category: 'form'
  },
  {
    name: 'Textarea',
    description: '文本域组件',
    props: ['placeholder', 'rows', 'disabled', 'resize'],
    category: 'form'
  },
  {
    name: 'Select',
    description: '选择组件',
    props: ['options', 'placeholder', 'multiple', 'searchable'],
    category: 'form'
  },
  {
    name: 'Checkbox',
    description: '复选框组件',
    props: ['checked', 'onCheckedChange', 'disabled', 'label'],
    category: 'form'
  },
  {
    name: 'Radio',
    description: '单选框组件',
    props: ['value', 'onValueChange', 'options', 'disabled'],
    category: 'form'
  },
  {
    name: 'Switch',
    description: '开关组件',
    props: ['checked', 'onCheckedChange', 'disabled', 'label'],
    category: 'form'
  },
  {
    name: 'Slider',
    description: '滑块组件',
    props: ['value', 'onValueChange', 'min', 'max', 'step'],
    category: 'form'
  },
  {
    name: 'Combobox',
    description: '组合框/自动完成组件',
    props: ['options', 'searchable', 'multiple', 'placeholder'],
    category: 'form'
  },
  {
    name: 'SearchInput',
    description: '搜索输入框',
    props: ['placeholder', 'onSearch', 'loading', 'clearable'],
    category: 'form'
  },
  {
    name: 'Form',
    description: '表单容器组件',
    props: ['onSubmit', 'defaultValues', 'validation'],
    category: 'form'
  },
  {
    name: 'FormField',
    description: '表单字段组件',
    props: ['name', 'label', 'error', 'required'],
    category: 'form'
  }
]

// ============================================================================
// 5. 📊 Data Display (数据展示组件) - 数据展示和可视化
// ============================================================================
const dataDisplayComponents: ComponentInfo[] = [
  {
    name: 'Card',
    description: '卡片组件',
    variants: ['default', 'outlined', 'elevated'],
    props: ['title', 'subtitle', 'actions', 'variant'],
    category: 'data-display'
  },
  {
    name: 'AdvancedCard',
    description: '高级卡片组件',
    props: ['title', 'image', 'actions', 'footer'],
    category: 'data-display'
  },
  {
    name: 'Table',
    description: '表格组件',
    props: ['data', 'columns', 'sortable', 'pagination'],
    category: 'data-display'
  },
  {
    name: 'List',
    description: '列表组件',
    props: ['items', 'renderItem', 'spacing'],
    category: 'data-display'
  },
  {
    name: 'Accordion',
    description: '手风琴组件',
    props: ['items', 'multiple', 'collapsible'],
    category: 'data-display'
  },
  {
    name: 'Carousel',
    description: '轮播组件',
    props: ['items', 'autoPlay', 'navigation', 'indicators'],
    category: 'data-display'
  },
  {
    name: 'Code',
    description: '代码展示组件',
    props: ['code', 'language', 'showLineNumbers'],
    category: 'data-display'
  },
  {
    name: 'Surface',
    description: '表面容器组件',
    props: ['variant', 'padding', 'bordered', 'shadow'],
    category: 'data-display'
  }
]

// ============================================================================
// 6. 💬 Feedback (反馈组件) - 用户操作反馈和状态提示
// ============================================================================
const feedbackComponents: ComponentInfo[] = [
  {
    name: 'Alert',
    description: '警告提示组件',
    variants: ['info', 'success', 'warning', 'error'],
    props: ['variant', 'title', 'description', 'closable'],
    category: 'feedback'
  },
  {
    name: 'Toast',
    description: '消息提示组件',
    variants: ['success', 'error', 'warning', 'info'],
    props: ['variant', 'title', 'description', 'duration'],
    category: 'feedback'
  },
  {
    name: 'Loading',
    description: '加载指示器组件',
    props: ['size', 'color', 'overlay'],
    category: 'feedback'
  },
  {
    name: 'Spinner',
    description: '旋转加载指示器',
    props: ['size', 'color', 'speed'],
    category: 'feedback'
  },
  {
    name: 'Skeleton',
    description: '骨架屏组件',
    props: ['lines', 'animated', 'variant'],
    category: 'feedback'
  },
  {
    name: 'Progress',
    description: '进度条组件',
    variants: ['linear', 'circular'],
    props: ['value', 'max', 'variant', 'color'],
    category: 'feedback'
  },
  {
    name: 'ThemeToggle',
    description: '主题切换组件',
    props: ['themes', 'defaultTheme'],
    category: 'feedback'
  },
  {
    name: 'Notification',
    description: '通知组件',
    props: ['type', 'title', 'message', 'duration'],
    category: 'feedback'
  }
]

// ============================================================================
// 7. 🧩 Composite (复合组件) - 由基础组件组合的复杂功能组件
// ============================================================================
const compositeComponents: ComponentInfo[] = [
  {
    name: 'AnimatedCard',
    description: '动画卡片组件',
    props: ['children', 'animation', 'delay'],
    category: 'composite',
    subcategory: 'ui-pattern'
  },
  {
    name: 'InputGroup',
    description: '输入组组件',
    props: ['children', 'size', 'variant'],
    category: 'composite',
    subcategory: 'functional'
  },
  {
    name: 'ButtonGroup',
    description: '按钮组组件',
    props: ['children', 'orientation', 'variant'],
    category: 'composite',
    subcategory: 'functional'
  },
  {
    name: 'ResponsiveLayout',
    description: '响应式布局组件',
    props: ['children', 'breakpoints', 'sidebar'],
    category: 'composite',
    subcategory: 'ui-pattern'
  },
  {
    name: 'BasicHeader',
    description: '基础头部组件',
    props: ['title', 'navigation', 'actions'],
    category: 'composite',
    subcategory: 'ui-pattern'
  }
]

// ============================================================================
// 8. ⚙️ System (系统组件) - 系统级和主题相关的基础设施
// ============================================================================
const systemComponents: ComponentInfo[] = [
  {
    name: 'ConfigProvider',
    description: '配置提供者组件',
    props: ['theme', 'direction', 'colorScheme'],
    category: 'system'
  },
  {
    name: 'Portal',
    description: '传送门组件',
    props: ['children', 'container'],
    category: 'system'
  },
  {
    name: 'FocusTrap',
    description: '焦点陷阱组件',
    props: ['enabled', 'onFocusEnter', 'onFocusExit'],
    category: 'system'
  },
  {
    name: 'FocusScope',
    description: '焦点范围组件',
    props: ['trapped', 'onMount', 'onUnmount'],
    category: 'system'
  },
  {
    name: 'ScrollLock',
    description: '滚动锁定组件',
    props: ['locked', 'shim'],
    category: 'system'
  },
  {
    name: 'DismissableLayer',
    description: '可关闭层组件',
    props: ['onDismiss', 'disableOutsidePointerEvents'],
    category: 'system'
  },
  {
    name: 'VisuallyHidden',
    description: '视觉隐藏组件',
    props: ['children', 'focusable'],
    category: 'system'
  }
]

// ============================================================================
// 9. 🌈 Gradient (渐变组件) - 渐变效果和视觉增强组件
// ============================================================================
const gradientComponents: ComponentInfo[] = [
  {
    name: 'GradientText',
    description: '渐变文字组件 - 支持令牌化配色和状态变化',
    variants: ['ui-basic', 'inputs', 'navigation', 'feedback', 'overlays', 'data-display', 'layout', 'charts', 'forms', 'utilities'],
    props: ['category', 'state', 'as', 'className'],
    category: 'gradient'
  },
  {
    name: 'GradientBackground',
    description: '渐变背景组件 - 支持动画和令牌化配色',
    variants: ['ui-basic', 'inputs', 'navigation', 'feedback', 'overlays', 'data-display', 'layout', 'charts', 'forms', 'utilities'],
    props: ['category', 'state', 'animated', 'as', 'className'],
    category: 'gradient'
  },
  {
    name: 'GradientBorder',
    description: '渐变边框组件 - 支持动画和令牌化配色',
    variants: ['ui-basic', 'inputs', 'navigation', 'feedback', 'overlays', 'data-display', 'layout', 'charts', 'forms', 'utilities'],
    props: ['category', 'state', 'animated', 'as', 'className'],
    category: 'gradient'
  },
  {
    name: 'GradientDemo',
    description: '渐变演示组件 - 完整的渐变系统演示和交互',
    props: ['activeTab', 'selectedCategory', 'onCategoryChange'],
    category: 'gradient'
  }
]

// ============================================================================
// 10. 📈 Visualization (可视化组件) - 数据可视化和图表组件
// ============================================================================
const visualizationComponents: ComponentInfo[] = [
  {
    name: 'Chart',
    description: '图表基础组件',
    props: ['data', 'type', 'config'],
    category: 'visualization'
  },
  {
    name: 'BarChart',
    description: '柱状图组件',
    props: ['data', 'orientation', 'colors'],
    category: 'visualization'
  },
  {
    name: 'LineChart',
    description: '折线图组件',
    props: ['data', 'points', 'smooth'],
    category: 'visualization'
  },
  {
    name: 'PieChart',
    description: '饼图组件',
    props: ['data', 'colors', 'labels'],
    category: 'visualization'
  },
  {
    name: 'Gauge',
    description: '仪表盘组件',
    props: ['value', 'min', 'max', 'segments'],
    category: 'visualization'
  },
  {
    name: 'Stat',
    description: '统计数值组件',
    props: ['value', 'label', 'trend', 'format'],
    category: 'visualization'
  }
]

// ============================================================================
// 弹层组件 (Overlays) - 独立分类
// ============================================================================
const overlayComponents: ComponentInfo[] = [
  {
    name: 'Modal',
    description: '模态框组件',
    props: ['open', 'onOpenChange', 'size', 'centered'],
    category: 'overlay'
  },
  {
    name: 'Dialog',
    description: '对话框组件',
    props: ['open', 'onOpenChange', 'title', 'description'],
    category: 'overlay'
  },
  {
    name: 'Drawer',
    description: '抽屉组件',
    props: ['open', 'onOpenChange', 'position', 'size'],
    category: 'overlay'
  },
  {
    name: 'Popover',
    description: '气泡组件',
    props: ['open', 'onOpenChange', 'trigger', 'content'],
    category: 'overlay'
  },
  {
    name: 'Tooltip',
    description: '提示框组件',
    props: ['content', 'delay', 'placement'],
    category: 'overlay'
  },
  {
    name: 'HoverCard',
    description: '悬停卡片组件',
    props: ['open', 'onOpenChange', 'trigger'],
    category: 'overlay'
  },
  {
    name: 'Lightbox',
    description: '灯箱组件',
    props: ['open', 'onOpenChange', 'images', 'index'],
    category: 'overlay'
  },
  {
    name: 'Sheet',
    description: '工作表组件',
    props: ['open', 'onOpenChange', 'side', 'size'],
    category: 'overlay'
  }
]

// ============================================================================
// 完整分类配置
// ============================================================================

export const componentCategories: ComponentCategory[] = [
  {
    id: 'base',
    name: 'Base 基础组件',
    icon: '🎨',
    description: '最基础的UI构建块，不可再分的功能单元',
    components: baseComponents,
    order: 1
  },
  {
    id: 'layout',
    name: 'Layout 布局组件',
    icon: '📐',
    description: '页面布局和空间分配的基础组件',
    components: layoutComponents,
    order: 2
  },
  {
    id: 'navigation',
    name: 'Navigation 导航组件',
    icon: '🧭',
    description: '提供导航和路由功能的组件',
    components: navigationComponents,
    order: 3
  },
  {
    id: 'form',
    name: 'Form 表单组件',
    icon: '📝',
    description: '用户输入数据的核心交互组件',
    components: formComponents,
    order: 4
  },
  {
    id: 'data-display',
    name: 'Data Display 数据展示',
    icon: '📊',
    description: '数据展示和图表可视化组件',
    components: dataDisplayComponents,
    order: 5
  },
  {
    id: 'feedback',
    name: 'Feedback 反馈组件',
    icon: '💬',
    description: '用户操作反馈和状态提示组件',
    components: feedbackComponents,
    order: 6
  },
  {
    id: 'overlay',
    name: 'Overlay 弹层组件',
    icon: '🔳',
    description: '覆盖层和弹出显示组件',
    components: overlayComponents,
    order: 7
  },
  {
    id: 'composite',
    name: 'Composite 复合组件',
    icon: '🧩',
    description: '由基础组件组合而成的复杂功能组件',
    components: compositeComponents,
    order: 8
  },
  {
    id: 'system',
    name: 'System 系统组件',
    icon: '⚙️',
    description: '系统级和主题相关的基础设施组件',
    components: systemComponents,
    order: 9
  },
  {
    id: 'gradient',
    name: 'Gradient 渐变组件',
    icon: '🌈',
    description: '渐变效果和视觉增强组件，支持令牌化配色',
    components: gradientComponents,
    order: 10
  },
  {
    id: 'visualization',
    name: 'Visualization 可视化组件',
    icon: '📈',
    description: '数据可视化和图表组件',
    components: visualizationComponents,
    order: 11
  }
]

// ============================================================================
// 工具函数
// ============================================================================

export const getAllComponents = (): ComponentInfo[] => {
  return componentCategories.flatMap(category => category.components)
}

export const getComponentsByCategory = (categoryId: string): ComponentInfo[] => {
  const category = componentCategories.find(cat => cat.id === categoryId)
  return category?.components || []
}

export const searchComponents = (query: string): ComponentInfo[] => {
  const lowercaseQuery = query.toLowerCase()
  return getAllComponents().filter(component =>
    component.name.toLowerCase().includes(lowercaseQuery) ||
    component.description.toLowerCase().includes(lowercaseQuery)
  )
}

export const getComponentByName = (name: string): ComponentInfo | undefined => {
  return getAllComponents().find(component => component.name === name)
}
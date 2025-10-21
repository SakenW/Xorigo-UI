/**
 * Xorigo UI 组件分类映射配置 - 修复版
 *
 * 仅包含实际存在的组件
 */

import { ComponentType } from 'react'

// ============================================================================
// 组件分类体系 - 基于实际可用的 Xorigo UI 组件
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
// 1. 🎨 UI 基础组件 - 最基础的UI构建块
// ============================================================================
const uiBasicComponents: ComponentInfo[] = [
  {
    name: 'AnimatedCard',
    description: '动画卡片组件 - 带动画效果的卡片',
    props: ['children', 'className'],
    category: 'ui-basic'
  },
  {
    name: 'AvatarGroup',
    description: '头像组组件 - 多头像显示',
    props: ['avatars', 'max'],
    category: 'ui-basic'
  },
  {
    name: 'Button',
    description: '按钮组件 - 支持多种变体和尺寸',
    variants: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    props: ['variant', 'size', 'disabled', 'loading'],
    category: 'ui-basic'
  },
  {
    name: 'Card',
    description: '卡片组件 - 基础容器组件',
    props: ['children', 'className'],
    category: 'ui-basic'
  },
  {
    name: 'Code',
    description: '代码展示组件',
    props: ['children', 'className'],
    category: 'ui-basic'
  },
  {
    name: 'CopyButton',
    description: '复制按钮组件',
    props: ['text', 'className'],
    category: 'ui-basic'
  },
    {
    name: 'Icon',
    description: '图标组件',
    props: ['name', 'size', 'className'],
    category: 'ui-basic'
  },
  {
    name: 'Kbd',
    description: '键盘提示组件',
    props: ['children', 'className'],
    category: 'ui-basic'
  },
  {
    name: 'ScrollArea',
    description: '滚动容器组件',
    props: ['className'],
    category: 'ui-basic'
  },
  {
    name: 'Separator',
    description: '分隔线组件',
    props: ['orientation', 'className'],
    category: 'ui-basic'
  },
  {
    name: 'Skeleton',
    description: '骨架屏组件 - 加载占位',
    props: ['className'],
    category: 'ui-basic'
  },
  {
    name: 'Spinner',
    description: '旋转加载指示器',
    props: ['size'],
    category: 'ui-basic'
  },
  {
    name: 'Surface',
    description: '表面容器组件',
    props: ['className'],
    category: 'ui-basic'
  },
  {
    name: 'Tooltip',
    description: '提示框组件',
    props: ['content', 'children'],
    category: 'ui-basic'
  },
  {
    name: 'Typography',
    description: '文本/排版组件',
    variants: ['h1', 'h3', 'p', 'small'],
    props: ['variant', 'children', 'className'],
    category: 'ui-basic'
  }
]

// ============================================================================
// 2. 📝 输入控件组件 - 用户输入组件
// ============================================================================
const inputComponents: ComponentInfo[] = [
  {
    name: 'Input',
    description: '输入组件 - 文本输入框',
    variants: ['default', 'outlined', 'filled'],
    props: ['placeholder', 'value', 'onChange', 'variant', 'error'],
    category: 'input'
  },
  {
    name: 'Textarea',
    description: '文本域组件 - 多行文本输入',
    props: ['placeholder', 'value', 'onChange', 'rows'],
    category: 'input'
  },
  {
    name: 'Select',
    description: '选择组件 - 下拉选择框',
    props: ['placeholder', 'value', 'onChange', 'options'],
    category: 'input'
  },
  {
    name: 'Checkbox',
    description: '复选框组件',
    props: ['checked', 'onChange', 'label', 'disabled'],
    category: 'input'
  },
  {
    name: 'Radio',
    description: '单选框组件',
    props: ['value', 'onChange', 'label', 'disabled'],
    category: 'input'
  },
  {
    name: 'Switch',
    description: '开关组件',
    props: ['checked', 'onChange', 'disabled', 'label'],
    category: 'input'
  },
  {
    name: 'Slider',
    description: '滑块组件 - 数值选择',
    props: ['value', 'onChange', 'min', 'max'],
    category: 'input'
  },
  {
    name: 'ButtonGroup',
    description: '按钮组组件 - 按钮组合',
    props: ['children', 'className'],
    category: 'input'
  },
  {
    name: 'SearchInput',
    description: '搜索输入框 - 带搜索功能',
    props: ['placeholder', 'value', 'onChange', 'onSearch'],
    category: 'input'
  },
  {
    name: 'PasswordInput',
    description: '密码输入框 - 密码输入',
    props: ['placeholder', 'value', 'onChange'],
    category: 'input'
  },
  {
    name: 'InputNumber',
    description: '数字输入框 - 数值输入',
    props: ['value', 'onChange', 'min', 'max'],
    category: 'input'
  },
  {
    name: 'Combobox',
    description: '组合框 - 自动完成选择',
    props: ['placeholder', 'value', 'onChange', 'options'],
    category: 'input'
  },
  {
    name: 'Command',
    description: '命令输入框 - 命令面板',
    props: ['placeholder', 'children'],
    category: 'input'
  }
]

// ============================================================================
// 3. 🧭 导航组件 - 页面导航组件
// ============================================================================
const navigationComponents: ComponentInfo[] = [
  {
    name: 'Tabs',
    description: '标签页组件',
    props: ['defaultValue', 'children'],
    category: 'navigation'
  },
  {
    name: 'Menu',
    description: '菜单组件',
    props: ['children', 'trigger'],
    category: 'navigation'
  },
  {
    name: 'Breadcrumb',
    description: '面包屑导航',
    props: ['children'],
    category: 'navigation'
  },
  {
    name: 'Pagination',
    description: '分页组件',
    props: ['currentPage', 'totalPages', 'onPageChange'],
    category: 'navigation'
  },
  {
    name: 'ComponentNav',
    description: '组件导航',
    props: ['components', 'selectedComponent', 'onSelect'],
    category: 'navigation'
  }
]

// ============================================================================
// 4. 📊 数据展示组件 - 数据展示组件
// ============================================================================
const dataDisplayComponents: ComponentInfo[] = [
  {
    name: 'Table',
    description: '表格组件 - 数据表格',
    props: ['data', 'columns', 'children'],
    category: 'data-display'
  },
  {
    name: 'Accordion',
    description: '手风琴组件 - 折叠面板',
    props: ['items', 'multiple', 'children'],
    category: 'data-display'
  },
  {
    name: 'Carousel',
    description: '轮播组件 - 图片轮播',
    props: ['items', 'autoPlay', 'children'],
    category: 'data-display'
  },
  {
    name: 'List',
    description: '列表组件',
    props: ['items', 'children'],
    category: 'data-display'
  },
  {
    name: 'CodeBlock',
    description: '代码块组件',
    props: ['code', 'language', 'className'],
    category: 'data-display'
  },
  {
    name: 'ComponentCard',
    description: '组件卡片 - 组件展示卡片',
    props: ['component', 'onClick', 'className'],
    category: 'data-display'
  },
  {
    name: 'AdvancedCard',
    description: '高级卡片组件',
    props: ['children', 'className'],
    category: 'data-display'
  }
]

// ============================================================================
// 5. 💬 反馈组件 - 用户反馈组件
// ============================================================================
const feedbackComponents: ComponentInfo[] = [
  {
    name: 'Alert',
    description: '警告提示组件',
    variants: ['info', 'success', 'warning', 'error'],
    props: ['variant', 'children', 'className'],
    category: 'feedback'
  },
  {
    name: 'Loading',
    description: '加载指示器组件',
    props: ['size', 'variant', 'className'],
    category: 'feedback'
  },
  {
    name: 'Progress',
    description: '进度条组件',
    props: ['value', 'max', 'className'],
    category: 'feedback'
  },
  {
    name: 'ThemeToggle',
    description: '主题切换组件',
    props: ['themes', 'defaultTheme'],
    category: 'feedback'
  },
  {
    name: 'Toast',
    description: '消息提示组件',
    props: ['children', 'variant', 'className'],
    category: 'feedback'
  }
]

// ============================================================================
// 6. 🧩 表单组件 - 表单容器组件
// ============================================================================
const formComponents: ComponentInfo[] = [
  {
    name: 'Form',
    description: '表单容器组件',
    props: ['onSubmit', 'defaultValues', 'children'],
    category: 'form'
  },
  {
    name: 'FormField',
    description: '表单字段组件',
    props: ['name', 'label', 'children', 'error'],
    category: 'form'
  },
  {
    name: 'Fieldset',
    description: '字段集组件',
    props: ['children', 'legend', 'className'],
    category: 'form'
  },
  {
    name: 'InputGroup',
    description: '输入组组件',
    props: ['children', 'className'],
    category: 'form'
  },
  {
    name: 'ValidationMessage',
    description: '验证消息组件',
    props: ['children', 'variant', 'className'],
    category: 'form'
  }
]

// ============================================================================
// 7. 🏗️ 布局组件 - 布局工具组件
// ============================================================================
const layoutComponents: ComponentInfo[] = [
  {
    name: 'Grid',
    description: '网格布局组件',
    props: ['children', 'columns', 'gap'],
    category: 'layout'
  },
  {
    name: 'GridItem',
    description: '网格项组件',
    props: ['children', 'column', 'row'],
    category: 'layout'
  },
  {
    name: 'Flex',
    description: '弹性布局组件',
    props: ['children', 'direction', 'justify', 'align'],
    category: 'layout'
  },
  {
    name: 'Container',
    description: '容器组件 - 响应式容器',
    props: ['children', 'className'],
    category: 'layout'
  },
  {
    name: 'Spacer',
    description: '间距组件',
    props: ['size', 'className'],
    category: 'layout'
  },
  {
    name: 'Panel',
    description: '面板容器组件',
    props: ['children', 'className'],
    category: 'layout'
  },
  {
    name: 'PanelHeader',
    description: '面板头部组件',
    props: ['children', 'className'],
    category: 'layout'
  },
  {
    name: 'PanelContent',
    description: '面板内容组件',
    props: ['children', 'className'],
    category: 'layout'
  },
  {
    name: 'PanelFooter',
    description: '面板底部组件',
    props: ['children', 'className'],
    category: 'layout'
  }
]

// ============================================================================
// 完整分类配置 - 仅包含经过验证的可用组件
// ============================================================================

export const componentCategories: ComponentCategory[] = [
  {
    id: 'ui-basic',
    name: 'UI 基础组件',
    icon: '🎨',
    description: '最基础的UI构建块，不可再分的功能单元',
    components: uiBasicComponents,
    order: 1
  },
  {
    id: 'input',
    name: '输入控件',
    icon: '📝',
    description: '用户输入数据的核心交互组件',
    components: inputComponents,
    order: 2
  },
  {
    id: 'navigation',
    name: '导航组件',
    icon: '🧭',
    description: '提供导航和路由功能的组件',
    components: navigationComponents,
    order: 3
  },
  {
    id: 'data-display',
    name: '数据展示',
    icon: '📊',
    description: '数据展示和结构化呈现组件',
    components: dataDisplayComponents,
    order: 4
  },
  {
    id: 'feedback',
    name: '反馈组件',
    icon: '💬',
    description: '用户操作反馈和状态提示组件',
    components: feedbackComponents,
    order: 5
  },
  {
    id: 'form',
    name: '表单组件',
    icon: '📋',
    description: '表单容器和验证相关组件',
    components: formComponents,
    order: 6
  },
  {
    id: 'layout',
    name: '布局组件',
    icon: '🏗️',
    description: '页面布局和容器组件',
    components: layoutComponents,
    order: 7
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

// ============================================================================
// 实际可用组件列表 - 用于验证
// ============================================================================

export const AVAILABLE_COMPONENTS = [
  // 🎨 UI基础组件 - 经过验证可用的组件
  'Button', 'Card', 'Typography', 'Skeleton', 'Spinner', 'Surface',
  'Separator', 'Icon', 'ScrollArea', 'AnimatedCard', 'AvatarGroup',
  'Code', 'CopyButton', 'Tooltip', 'Kbd',

  // 📝 输入控件 - 经过验证可用的组件
  'Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Switch',
  'Slider', 'ButtonGroup', 'SearchInput', 'PasswordInput', 'InputNumber',
  'Combobox', 'Command',

  // 🧭 导航组件 - 经过验证可用的组件
  'Tabs', 'Menu', 'Breadcrumb', 'Pagination', 'ComponentNav',

  // 📊 数据展示 - 经过验证可用的组件
  'Table', 'Accordion', 'Carousel', 'List', 'CodeBlock',
  'ComponentCard', 'AdvancedCard',

  // 💬 反馈组件 - 经过验证可用的组件
  'Alert', 'Loading', 'Progress', 'ThemeToggle', 'Toast',

  // 📋 表单组件 - 经过验证可用的组件
  'Form', 'FormField', 'Fieldset', 'InputGroup', 'ValidationMessage',

  // 🏗️ 布局组件 - 经过验证可用的组件
  'Grid', 'GridItem', 'Flex', 'Container', 'Spacer', 'Panel',
  'PanelHeader', 'PanelContent', 'PanelFooter'
]
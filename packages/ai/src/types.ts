/**
 * AI助手自然语言解析器类型定义
 */

export type Language = 'zh' | 'en'

/**
 * 意图分类类型
 */
export enum IntentType {
  // 代码生成
  CREATE_COMPONENT = 'create_component',
  MODIFY_COMPONENT = 'modify_component',
  ADD_FEATURE = 'add_feature',

  // 代码审查
  REVIEW_CODE = 'review_code',
  CHECK_SECURITY = 'check_security',
  CHECK_PERFORMANCE = 'check_performance',

  // 重构优化
  REFACTOR_CODE = 'refactor_code',
  OPTIMIZE_PERFORMANCE = 'optimize_performance',
  IMPROVE_ACCESSIBILITY = 'improve_accessibility',

  // 调试
  DEBUG_ERROR = 'debug_error',
  EXPLAIN_CODE = 'explain_code',
  FIX_BUG = 'fix_bug',

  // 辅助功能
  GENERATE_DOCS = 'generate_docs',
  ADD_TESTS = 'add_tests',
  GENERATE_EXAMPLES = 'generate_examples'
}

/**
 * 组件类型
 */
export enum ComponentType {
  BUTTON = 'button',
  INPUT = 'input',
  TABLE = 'table',
  CARD = 'card',
  MODAL = 'modal',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SWITCH = 'switch',
  TOOLTIP = 'tooltip',
  TABS = 'tabs',
  NAVIGATION = 'navigation',
  FORM = 'form',
  CONTAINER = 'container',
  TEXT = 'text',
  IMAGE = 'image',
  LAYOUT = 'layout',
  DATA_DISPLAY = 'data-display',
  FEEDBACK = 'feedback',
  OVERLAY = 'overlay'
}

/**
 * 组件属性类型
 */
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'solid'
  | 'minimal'

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ComponentTheme =
  | 'light'
  | 'dark'
  | 'auto'
  | 'sepia'
  | 'forest'
  | 'ocean'
  | 'sunset'

export type ComponentDensity = 'compact' | 'comfortable' | 'spacious'

export type ComponentMotion = 'none' | 'subtle' | 'moderate' | 'dynamic'

/**
 * 样式属性
 */
export interface StyleAttributes {
  theme?: ComponentTheme
  density?: ComponentDensity
  motion?: ComponentMotion
  rounded?: boolean
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadow?: boolean
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  gradient?: boolean
  animation?: string
  customCSS?: string
}

/**
 * 组件属性
 */
export interface ComponentProps {
  size?: ComponentSize
  variant?: ComponentVariant
  disabled?: boolean
  loading?: boolean
  error?: boolean
  success?: boolean
  required?: boolean
  readOnly?: boolean
  selected?: boolean
  active?: boolean
  expandable?: boolean
  collapsible?: boolean
  sortable?: boolean
  filterable?: boolean
  paginated?: boolean
  virtual?: boolean
  async?: boolean
  multiple?: boolean
  clearable?: boolean
  searchable?: boolean
  draggable?: boolean
  resizable?: boolean
}

/**
 * 实体抽取结果
 */
export interface Entity {
  type: 'component' | 'property' | 'value' | 'action' | 'style' | 'constraint'
  value: string
  confidence: number
  startIndex: number
  endIndex: number
  metadata?: Record<string, any>
}

/**
 * 意图分类结果
 */
export interface IntentClassification {
  primary: IntentType
  confidence: number
  secondary?: Array<{
    type: IntentType
    confidence: number
  }>
}

/**
 * 解析结果
 */
export interface ParseResult {
  intent: IntentClassification
  component?: ComponentType
  props: ComponentProps
  style: StyleAttributes
  entities: Entity[]
  requirements: string[]
  constraints: string[]
  language: Language
  confidence: number
  suggestions?: string[]
  context?: Record<string, any>
}

/**
 * Claude API响应
 */
export interface ClaudeResponse {
  content: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
  stop_reason?: string
}

/**
 * 解析器配置
 */
export interface ParserConfig {
  language: Language
  model?: 'claude-3-sonnet-20240229' | 'claude-3-opus-20240229' | 'claude-3-haiku-20240307'
  temperature?: number
  maxTokens?: number
  timeout?: number
  enableCache?: boolean
  cacheTTL?: number
  maxRetries?: number
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  latency: number // 毫秒
  tokenCount: number
  cost: number // USD
  cacheHit: boolean
  retries: number
}

/**
 * 解析错误
 */
export interface ParseError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

/**
 * 组件映射表
 */
export const COMPONENT_ALIASES: Record<Language, Record<string, ComponentType>> = {
  zh: {
    '按钮': ComponentType.BUTTON,
    '输入框': ComponentType.INPUT,
    '表格': ComponentType.TABLE,
    '卡片': ComponentType.CARD,
    '模态框': ComponentType.MODAL,
    '弹窗': ComponentType.MODAL,
    '下拉框': ComponentType.DROPDOWN,
    '选择器': ComponentType.DROPDOWN,
    '复选框': ComponentType.CHECKBOX,
    '单选框': ComponentType.RADIO,
    '开关': ComponentType.SWITCH,
    '提示': ComponentType.TOOLTIP,
    '标签页': ComponentType.TABS,
    '导航': ComponentType.NAVIGATION,
    '表单': ComponentType.FORM,
    '容器': ComponentType.CONTAINER,
    '文本': ComponentType.TEXT,
    '图片': ComponentType.IMAGE,
    '布局': ComponentType.LAYOUT
  },
  en: {
    'button': ComponentType.BUTTON,
    'input': ComponentType.INPUT,
    'table': ComponentType.TABLE,
    'card': ComponentType.CARD,
    'modal': ComponentType.MODAL,
    'dialog': ComponentType.MODAL,
    'dropdown': ComponentType.DROPDOWN,
    'select': ComponentType.DROPDOWN,
    'checkbox': ComponentType.CHECKBOX,
    'radio': ComponentType.RADIO,
    'switch': ComponentType.SWITCH,
    'tooltip': ComponentType.TOOLTIP,
    'tabs': ComponentType.TABS,
    'navigation': ComponentType.NAVIGATION,
    'nav': ComponentType.NAVIGATION,
    'form': ComponentType.FORM,
    'container': ComponentType.CONTAINER,
    'wrapper': ComponentType.CONTAINER,
    'text': ComponentType.TEXT,
    'image': ComponentType.IMAGE,
    'layout': ComponentType.LAYOUT
  }
}

/**
 * 属性映射表
 */
export const PROPERTY_ALIASES: Record<Language, Record<string, string>> = {
  zh: {
    '大小': 'size',
    '尺寸': 'size',
    '变体': 'variant',
    '样式': 'variant',
    '禁用': 'disabled',
    '不可用': 'disabled',
    '加载': 'loading',
    '错误': 'error',
    '成功': 'success',
    '必填': 'required',
    '只读': 'readOnly',
    '选中': 'selected',
    '激活': 'active',
    '可展开': 'expandable',
    '可折叠': 'collapsible',
    '可排序': 'sortable',
    '可过滤': 'filterable',
    '分页': 'paginated',
    '虚拟滚动': 'virtual',
    '异步': 'async',
    '多选': 'multiple',
    '可清除': 'clearable',
    '可搜索': 'searchable',
    '可拖拽': 'draggable',
    '可调整大小': 'resizable'
  },
  en: {
    'size': 'size',
    'variant': 'variant',
    'style': 'variant',
    'disabled': 'disabled',
    'loading': 'loading',
    'error': 'error',
    'success': 'success',
    'required': 'required',
    'readonly': 'readOnly',
    'selected': 'selected',
    'active': 'active',
    'expandable': 'expandable',
    'collapsible': 'collapsible',
    'sortable': 'sortable',
    'filterable': 'filterable',
    'paginated': 'paginated',
    'virtual': 'virtual',
    'async': 'async',
    'multiple': 'multiple',
    'clearable': 'clearable',
    'searchable': 'searchable',
    'draggable': 'draggable',
    'resizable': 'resizable'
  }
}

/**
 * 值映射表
 */
export const VALUE_ALIASES: Record<string, Record<string, any>> = {
  size: {
    'xs': 'xs',
    'extra small': 'xs',
    '超小': 'xs',
    'sm': 'sm',
    'small': 'sm',
    '小': 'sm',
    'md': 'md',
    'medium': 'md',
    '中': 'md',
    'lg': 'lg',
    'large': 'lg',
    '大': 'lg',
    'xl': 'xl',
    'extra large': 'xl',
    '超大': 'xl'
  },
  variant: {
    'primary': 'primary',
    '主要': 'primary',
    '默认': 'primary',
    'secondary': 'secondary',
    '次要': 'secondary',
    'outline': 'outline',
    '边框': 'outline',
    'ghost': 'ghost',
    '透明': 'ghost',
    'link': 'link',
    '链接': 'link',
    'solid': 'solid',
    '实心': 'solid',
    'minimal': 'minimal',
    '简约': 'minimal'
  },
  theme: {
    'light': 'light',
    '浅色': 'light',
    '明亮': 'light',
    'dark': 'dark',
    '深色': 'dark',
    '暗色': 'dark',
    'auto': 'auto',
    '自动': 'auto',
    '跟随系统': 'auto',
    'sepia': 'sepia',
    '怀旧': 'sepia',
    'forest': 'forest',
    '森林': 'forest',
    'ocean': 'ocean',
    '海洋': 'ocean',
    'sunset': 'sunset',
    '日落': 'sunset'
  },
  density: {
    'compact': 'compact',
    '紧凑': 'compact',
    'comfortable': 'comfortable',
    '舒适': 'comfortable',
    'spacious': 'spacious',
    '宽松': 'spacious'
  }
}

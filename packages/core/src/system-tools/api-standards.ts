/**
 * Xorigo UI API 一致性规范定义
 *
 * 此文件定义了所有Xorigo UI组件必须遵循的API设计规范
 * 确保组件库的一致性、可预测性和可维护性
 */

// ============================================================================
// 基础API规范接口
// ============================================================================

/**
 * 组件基础尺寸规范
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * 组件变体规范
 */
export type VariantType = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

/**
 * 组件状态规范
 */
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'loading' | 'focus'

/**
 * 颜色主题规范
 */
export type ColorTheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

/**
 * 圆角规范
 */
export type BorderRadiusVariant = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

// ============================================================================
// 标准Props接口规范
// ============================================================================

/**
 * 所有组件必须实现的基础Props接口
 */
export interface BaseComponentProps {
  /** 唯一标识符，用于测试和引用 */
  id?: string
  /** 自定义类名，用于样式扩展 */
  className?: string
  /** 测试ID，用于测试框架 */
  'data-testid'?: string
  /** ARIA标签，提升可访问性 */
  'aria-label'?: string
  /** ARIA描述，提升可访问性 */
  'aria-describedby'?: string
  /** 是否禁用组件 */
  disabled?: boolean
  /** 是否只读模式 */
  readOnly?: boolean
  /** 是否必需字段 */
  required?: boolean
  /** 自定义样式对象 */
  style?: React.CSSProperties
  /** 子元素 */
  children?: React.ReactNode
}

/**
 * 可交互组件Props接口规范
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  /** 点击事件处理器 */
  onClick?: (event: React.MouseEvent) => void
  /** 焦点获得事件处理器 */
  onFocus?: (event: React.FocusEvent) => void
  /** 焦点失去事件处理器 */
  onBlur?: (event: React.FocusEvent) => void
  /** 键盘按下事件处理器 */
  onKeyDown?: (event: React.KeyboardEvent) => void
  /** 键盘抬起事件处理器 */
  onKeyUp?: (event: React.KeyboardEvent) => void
  /** 鼠标进入事件处理器 */
  onMouseEnter?: (event: React.MouseEvent) => void
  /** 鼠标离开事件处理器 */
  onMouseLeave?: (event: React.MouseEvent) => void
}

/**
 * 表单组件Props接口规范
 */
export interface FormComponentProps extends InteractiveComponentProps {
  /** 表单字段名称 */
  name?: string
  /** 表单字段值 */
  value?: any
  /** 默认值 */
  defaultValue?: any
  /** 占位符文本 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 验证错误信息 */
  error?: string
  /** 帮助文本 */
  helperText?: string
  /** 值变更回调 */
  onChange?: (value: any, event?: React.ChangeEvent) => void
  /** 失焦回调 */
  onBlur?: (event: React.FocusEvent) => void
}

/**
 * 布局组件Props接口规范
 */
export interface LayoutComponentProps extends BaseComponentProps {
  /** 组件尺寸 */
  size?: SizeVariant
  /** 是否全宽 */
  fullWidth?: boolean
  /** 是否全高 */
  fullHeight?: boolean
  /** 最大宽度 */
  maxWidth?: string | number
  /** 最小宽度 */
  minWidth?: string | number
  /** 最大高度 */
  maxHeight?: string | number
  /** 最小高度 */
  minHeight?: string | number
  /** 内边距 */
  padding?: string | number
  /** 外边距 */
  margin?: string | number
}

/**
 * 主题集成Props接口规范
 */
export interface ThemedComponentProps extends BaseComponentProps {
  /** 颜色主题 */
  colorTheme?: ColorTheme
  /** 组件变体 */
  variant?: VariantType
  /** 组件尺寸 */
  size?: SizeVariant
  /** 圆角变体 */
  borderRadius?: BorderRadiusVariant
  /** 是否覆盖主题样式 */
  overrideTheme?: boolean
}

// ============================================================================
// 组件分类API规范
// ============================================================================

/**
 * 按钮类组件API规范
 */
export interface ButtonLikeComponentProps extends ThemedComponentProps, InteractiveComponentProps {
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
  /** 是否加载中 */
  loading?: boolean
  /** 加载中文本 */
  loadingText?: string
  /** 是否禁用加载时的点击 */
  disableWhileLoading?: boolean
  /** 左侧图标 */
  leftIcon?: React.ReactNode
  /** 右侧图标 */
  rightIcon?: React.ReactNode
  /** 按钮形状 */
  shape?: 'rectangular' | 'rounded' | 'pill' | 'circle'
}

/**
 * 输入类组件API规范
 */
export interface InputLikeComponentProps extends FormComponentProps, ThemedComponentProps {
  /** 输入类型 */
  inputType?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search'
  /** 是否自动聚焦 */
  autoFocus?: boolean
  /** 最大长度 */
  maxLength?: number
  /** 最小长度 */
  minLength?: number
  /** 输入模式 */
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url'
  /** 是否自动完成 */
  autoComplete?: string
  /** 前缀元素 */
  prefix?: React.ReactNode
  /** 后缀元素 */
  suffix?: React.ReactNode
  /** 是否清除按钮 */
  clearable?: boolean
  /** 清除回调 */
  onClear?: () => void
}

/**
 * 展示类组件API规范
 */
export interface DisplayComponentProps extends ThemedComponentProps {
  /** 显示文本 */
  text?: string
  /** 是否支持多行 */
  multiline?: boolean
  /** 文本对齐 */
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  /** 文本截断 */
  truncation?: boolean
  /** 最大行数 */
  maxLines?: number
  /** 是否支持选择 */
  selectable?: boolean
}

/**
 * 容器类组件API规范
 */
export interface ContainerComponentProps extends LayoutComponentProps, ThemedComponentProps {
  /** 容器方向 */
  direction?: 'horizontal' | 'vertical'
  /** 内容对齐 */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** 主轴对齐 */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  /** 是否换行 */
  wrap?: boolean | 'reverse' | 'nowrap'
  /** 元素间距 */
  gap?: string | number
  /** 是否隐藏溢出 */
  overflow?: boolean | 'auto' | 'scroll' | 'hidden'
}

// ============================================================================
// 高级API规范
// ============================================================================

/**
 * 动画组件Props规范
 */
export interface AnimatedComponentProps extends BaseComponentProps {
  /** 是否启用动画 */
  animated?: boolean
  /** 动画延迟 */
  animationDelay?: number
  /** 动画持续时间 */
  animationDuration?: number
  /** 动画缓动函数 */
  animationEasing?: string
  /** 自定义动画变体 */
  animationVariants?: Record<string, any>
  /** 动画开始回调 */
  onAnimationStart?: () => void
  /** 动画完成回调 */
  onAnimationComplete?: () => void
}

/**
 * 异步组件Props规范
 */
export interface AsyncComponentProps extends BaseComponentProps {
  /** 数据加载函数 */
  loadData?: () => Promise<any>
  /** 是否自动加载 */
  autoLoad?: boolean
  /** 加载状态渲染器 */
  loadingRenderer?: () => React.ReactNode
  /** 错误状态渲染器 */
  errorRenderer?: (error: Error) => React.ReactNode
  /** 空状态渲染器 */
  emptyRenderer?: () => React.ReactNode
  /** 重试回调 */
  onRetry?: () => void
  /** 缓存配置 */
  cacheConfig?: {
    enabled: boolean
    ttl?: number
    key?: string
  }
}

/**
 * 可访问性Props规范
 */
export interface AccessibilityProps {
  /** 角色属性 */
  role?: string
  /** 是否实时区域 */
  'aria-live'?: 'polite' | 'assertive' | 'off'
  /** 是否繁忙状态 */
  'aria-busy'?: boolean
  /** 当前值 */
  'aria-valuenow'?: number
  /** 最小值 */
  'aria-valuemin'?: number
  /** 最大值 */
  'aria-valuemax'?: number
  /** 文本值 */
  'aria-valuetext'?: string
  /** 是否展开 */
  'aria-expanded'?: boolean
  /** 是否选中 */
  'aria-selected'?: boolean
  /** 是否禁用 */
  'aria-disabled'?: boolean
  /** 是否必需 */
  'aria-required'?: boolean
  /** 是否无效 */
  'aria-invalid'?: boolean
  /** 错误消息 */
  'aria-errormessage'?: string
}

// ============================================================================
// 组件元数据规范
// ============================================================================

/**
 * 组件元数据接口
 */
export interface ComponentMetadata {
  /** 组件名称 */
  name: string
  /** 组件分类 */
  category: 'primitive' | 'form' | 'layout' | 'navigation' | 'overlay' | 'feedback' | 'display'
  /** 组件描述 */
  description: string
  /** 组件版本 */
  version: string
  /** 组件状态 */
  status: 'stable' | 'beta' | 'alpha' | 'deprecated'
  /** 组件标签 */
  tags: string[]
  /** 相关组件 */
  relatedComponents: string[]
  /** 依赖的组件 */
  dependencies: string[]
  /** 支持的主题 */
  supportedThemes: string[]
  /** 是否支持七轴主题系统 */
  supportsSevenAxis: boolean
  /** 示例代码 */
  examples: {
    title: string
    description: string
    code: string
  }[]
  /** API文档 */
  api: {
    props: Record<string, {
      type: string
      required: boolean
      defaultValue?: any
      description: string
    }>
    returns: string
  }
}

// ============================================================================
// 验证规则规范
// ============================================================================

/**
 * API验证规则接口
 */
export interface APIValidationRule {
  /** 规则名称 */
  name: string
  /** 规则描述 */
  description: string
  /** 验证函数 */
  validate: (component: any) => ValidationResult
  /** 错误级别 */
  level: 'error' | 'warning' | 'info'
  /** 是否自动修复 */
  autoFixable?: boolean
  /** 自动修复函数 */
  autoFix?: (component: any) => any
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  /** 是否通过验证 */
  passed: boolean
  /** 错误信息 */
  errors: ValidationError[]
  /** 警告信息 */
  warnings: ValidationWarning[]
  /** 信息提示 */
  info: ValidationInfo[]
  /** 建议修复 */
  suggestions: string[]
}

/**
 * 验证错误接口
 */
export interface ValidationError {
  /** 错误消息 */
  message: string
  /** 错误位置 */
  location: string
  /** 错误代码 */
  code: string
  /** 修复建议 */
  fix?: string
}

/**
 * 验证警告接口
 */
export interface ValidationWarning {
  /** 警告消息 */
  message: string
  /** 警告位置 */
  location: string
  /** 警告代码 */
  code: string
  /** 建议信息 */
  suggestion?: string
}

/**
 * 验证信息接口
 */
export interface ValidationInfo {
  /** 信息内容 */
  message: string
  /** 信息位置 */
  location: string
  /** 信息类型 */
  type: 'suggestion' | 'best-practice' | 'optimization'
}

// ============================================================================
// 导出所有规范
// ============================================================================

export {
  // 基础类型
  type SizeVariant,
  type VariantType,
  type ComponentState,
  type ColorTheme,
  type BorderRadiusVariant,

  // 接口规范
  type BaseComponentProps,
  type InteractiveComponentProps,
  type FormComponentProps,
  type LayoutComponentProps,
  type ThemedComponentProps,
  type ButtonLikeComponentProps,
  type InputLikeComponentProps,
  type DisplayComponentProps,
  type ContainerComponentProps,
  type AnimatedComponentProps,
  type AsyncComponentProps,
  type AccessibilityProps,
  type ComponentMetadata,
  type APIValidationRule,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidationInfo,
}
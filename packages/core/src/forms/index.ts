/**
 * Forms category - 表单管理与校验分类
 *
 * 提供 16 个核心表单管理组件，专注表单结构、布局、校验和状态管理
 * 与 SSOT v2025.11.03 架构严格对齐：forms = 表单结构与校验
 *
 * 组件清单：
 * 1. FormProvider - 表单提供者，提供表单上下文和状态管理
 * 2. Form - 表单容器，提供数据管理和提交逻辑
 * 3. FormField - 字段容器，整合标签、输入、错误提示
 * 4. FormItem - 表单项容器，包装单个字段及其相关元素
 * 5. Fieldset - 字段集，支持分组和图例
 * 6. FormGroup - 表单组，支持字段分组和折叠功能
 * 7. FormLayout - 表单布局组件，支持多种布局模式
 * 8. ValidationMessage - 校验消息，统一错误/警告/成功提示
 * 9. ErrorMessage - 错误消息，显示表单字段错误和操作建议
 * 10. HelperText - 帮助文本，显示说明、提示和状态消息
 * 11. InputGroup - 输入组，前后缀组合布局
 * 12. ButtonGroup - 按钮组，互斥/多选按钮布局
 * 13. FieldLabel - 字段标签，提供字段标识和描述功能
 * 14. ValidationSummary - 校验汇总，显示多个字段的校验结果和导航跳转
 * 15. FormErrorBanner - 表单错误横幅，显示表单级别错误
 * 16. FormikAdapter - Formik 表单适配器，提供表单状态管理与 Xorigo UI 组件集成
 * 17. ZodAdapter - Zod 验证适配器，提供类型安全的表单验证功能
 *
 * 与 inputs 分类的关系：
 * - forms 专注于表单管理和校验逻辑
 * - inputs 专注于具体的输入控件实现
 * - 两者配合使用，提供完整的表单解决方案
 *
 * 技术特性：
 * ✅ 完整的表单状态管理
 * ✅ 内置校验引擎和规则系统
 * ✅ 关联校验和条件校验
 * ✅ 表单数据分析和统计
 * ✅ 多步表单支持
 * ✅ 无障碍访问优化
 * ✅ Formik 深度集成
 * ✅ Zod 深度集成
 * ✅ 异步验证支持
 * ✅ 实时验证和错误处理
 * ✅ TypeScript 类型安全
 */

// ============================================================================
// 1. 核心表单组件 (Core Form Components)
// ============================================================================

// FormProvider - 表单提供者（上下文管理）
export { FormProvider } from './form-provider'
export type { FormProviderProps } from './form-provider'
export type {
  FormValue,
  FormError,
  FormTouched,
  FormValidating,
  FormContextValue,
  FormHelpers,
} from './form-provider'

// Form - 表单容器
export { Form } from './forms-index'
export type { FormProps, FormValues, FormErrors, FormTouched } from './forms-index'

// FormField - 字段容器
export { FormField } from './form-field'
export type { FormFieldProps, FormFieldState } from './form-field'

// FormItem - 表单项容器
export { FormItem } from './form-item'
export type { FormItemProps } from './form-item'
export { useFormItem } from './form-item'

// FormikAdapter - Formik 适配器（第三方表单库集成）
export { FormikAdapter } from './formik-adapter'
export type { FormikAdapterProps } from './formik-adapter'
export {
  useFormikAdapter,
  useFormikField,
  useFormikForm,
  useFormikSubmit,
  useFormikReset,
} from './formik-adapter'
export {
  formikAdapterVariants,
  formContentVariants as formikFormContentVariants,
  submitButtonVariants as formikSubmitButtonVariants,
  resetButtonVariants as formikResetButtonVariants,
  FORMIK_ADAPTER_VARIANTS,
  FORMIK_ADAPTER_SIZES,
  FORMIK_ADAPTER_DEFAULTS,
  createFormikAdapterConfig,
  createFormikValidationRule,
  createAsyncValidator,
  createRequiredValidator,
  createEmailValidator,
  createMinLengthValidator,
  createMaxLengthValidator,
  formikAdapterMetadata,
} from './formik-adapter'

// ZodAdapter - Zod 验证适配器（第三方表单库集成）
export { ZodAdapter } from './zod-adapter'
export type { ZodAdapterProps } from './zod-adapter'
export {
  useZodAdapter,
  useZodField,
  useZodForm,
  useZodSubmit,
  useZodReset,
} from './zod-adapter'
export {
  zodAdapterVariants,
  formContentVariants as zodFormContentVariants,
  submitButtonVariants as zodSubmitButtonVariants,
  resetButtonVariants as zodResetButtonVariants,
  ZOD_ADAPTER_VARIANTS,
  ZOD_ADAPTER_SIZES,
  ZOD_ADAPTER_DEFAULTS,
  createZodValidationRule,
  createAsyncZodValidator,
  createRequiredValidator as zodCreateRequiredValidator,
  createEmailValidator as zodCreateEmailValidator,
  createMinLengthValidator as zodCreateMinLengthValidator,
  createMaxLengthValidator as zodCreateMaxLengthValidator,
  zodAdapterMetadata,
} from './zod-adapter'

// ============================================================================
// 2. 表单布局组件 (Form Layout Components)
// ============================================================================

// Fieldset - 字段集
export { Fieldset } from './fieldset'
export type { FieldsetProps, FieldsetState } from './fieldset'

// FormGroup - 表单组（新增）
export { FormGroup, NestedFormGroup } from './form-group'
export type { FormGroupProps, FormGroupContextValue, NestedFormGroupProps } from './form-group'
export {
  formGroupVariants,
  headerVariants,
  legendVariants,
  descriptionVariants,
  errorSummaryVariants
} from './form-group'

// FormLayout - 表单布局组件
export { FormLayout } from './form-layout'
export type {
  FormLayoutProps,
  FormSectionProps,
  FormGroupProps as FormLayoutGroupProps,
  FormSectionHeaderProps,
  FormLayoutContextValue,
  FormLayoutBreakpointConfig
} from './form-layout'
export {
  formLayoutVariants,
  formSectionVariants,
  formGroupVariants as formLayoutGroupVariants,
  sectionHeaderVariants
} from './form-layout'
export { useFormLayout } from './form-layout'

// InputGroup - 输入组（前后缀组合）
export { InputGroup } from './input-group'
export type { InputGroupProps, InputGroupSlot } from './input-group'

// ButtonGroup - 按钮组
export { ButtonGroup } from './button-group'
export type { ButtonGroupProps, ButtonGroupVariant } from './button-group'

// FieldLabel - 字段标签
export { FieldLabel, FieldLabelDescription } from './field-label'
export type { FieldLabelProps } from './field-label'

// ============================================================================
// 3. 表单校验组件 (Form Validation Components)
// ============================================================================

// ValidationMessage - 校验消息
export { ValidationMessage } from './validation-message'
export type { ValidationMessageProps, ValidationType, ValidationState } from './validation-message'

// ErrorMessage - 错误消息
export { ErrorMessage, ErrorMessageList, ErrorMessageGroup } from './error-message'
export type { ErrorMessageProps, ErrorMessageGroupProps, ErrorAction } from './error-message'
export {
  errorMessageVariants,
  errorIconVariants,
  actionButtonVariants,
} from './error-message'

// HelperText - 帮助文本
export { HelperText, HelperTextList } from './helper-text'
export type { HelperTextProps, HelperTextListProps, HelperLink } from './helper-text'

// ValidationSummary - 校验汇总（新增）
export { ValidationSummary } from './validation-summary'
export type { ValidationSummaryProps, ValidationSummaryItem } from './validation-summary'
export {
  validationSummaryVariants,
  headerIconVariants,
  fieldItemVariants,
} from './validation-summary'

// FormErrorBanner - 表单错误横幅（新增）
export { FormErrorBanner } from './form-error-banner'
export type { FormErrorBannerProps, ErrorAction as FormErrorAction } from './form-error-banner'
export {
  errorBannerVariants,
  bannerIconVariants,
  actionButtonVariants as formErrorBannerActionButtonVariants,
  secondaryButtonVariants,
  collapseButtonVariants,
} from './form-error-banner'

// ============================================================================
// 4. 类型重导出 (Type Re-exports)
// ============================================================================

// 表单相关类型定义
export type {
  // 表单状态类型
  FormState,
  FormStatus,
  FormMode,

  // 校验相关类型
  ValidationRule,
  ValidationSchema,
  ValidationTrigger,
  ValidateResult,

  // 字段相关类型
  FieldName,
  FieldValue,
  FieldError,
  FieldTouched,

  // 事件类型
  FormSubmitHandler,
  FormResetHandler,
  FormChangeHandler,
  FieldChangeHandler,

  // 工具类型
  FormikLikeValues,
  FormikLikeErrors,
  FormikLikeTouched
} from '../types'

// 重导出 inputs 分类组件（便于使用）
// 注意：这里仅重导出类型，实际组件从 inputs 分类导入
export type {
  // 基础输入控件类型
  InputProps as FormInputProps,
  SelectProps as FormSelectProps,
  TextareaProps as FormTextareaProps,
  CheckboxProps as FormCheckboxProps,
  RadioProps as FormRadioProps,
  SwitchProps as FormSwitchProps,
  SliderProps as FormSliderProps,
  ComboboxProps as FormComboboxProps,
  InputNumberProps as FormInputNumberProps,
  PasswordInputProps as FormPasswordInputProps,
  SearchInputProps as FormSearchInputProps
} from '../inputs'

// ============================================================================
// 5. 组件元数据 (Component Metadata)
// ============================================================================

/**
 * forms 分类组件元数据
 * 符合 v2025.11.03 SSOT 规范
 */
export const formsCategoryMetadata = {
  category: 'forms',
  title: '表单管理与校验',
  description: '专注于表单结构、布局、校验和状态管理的核心组件，与 inputs 分类配合提供完整表单解决方案',
  componentCount: 17,
  stability: 'stable' as const,

  // 组件列表
  components: [
    {
      name: 'FormProvider',
      description: '表单提供者，提供表单上下文和状态管理',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['表单状态管理', '字段验证', '提交处理', '嵌套表单支持']
    },
    {
      name: 'Form',
      description: '表单容器，提供数据管理和提交逻辑',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['受控/非受控模式', '表单校验', '提交/重置', '多步表单']
    },
    {
      name: 'FormField',
      description: '字段容器，整合标签、输入、错误提示',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['标签管理', '错误显示', '描述文本', '必填标识']
    },
    {
      name: 'FormItem',
      description: '表单项容器，包装单个字段及其相关元素',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['5种布局变体', '状态消息', '必填/可选标识', '描述和帮助文本', '禁用/只读状态']
    },
    {
      name: 'Fieldset',
      description: '字段集，支持分组和图例',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['字段分组', '图例标题', '禁用状态', '嵌套支持']
    },
    {
      name: 'FormGroup',
      description: '表单组，支持字段分组和折叠功能',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['字段分组', '组标题和描述', '组级别验证', '必填组标记', '禁用整个组', '折叠展开', '网格布局', '响应式设计', '嵌套组', '错误汇总', '自定义间距']
    },
    {
      name: 'FormLayout',
      description: '表单布局组件，支持多种布局模式和响应式设计',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['单列/双列/三列布局', '网格布局', '响应式断点', '表单分组', '表单分段', '折叠支持', '自定义标签位置', '字段跨度']
    },
    {
      name: 'ValidationMessage',
      description: '校验消息，统一错误/警告/成功提示',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['多种状态', '图标支持', '动画效果', '无障碍访问']
    },
    {
      name: 'ErrorMessage',
      description: '错误消息，显示表单字段错误和操作建议',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['多状态支持', '严重程度分级', '操作按钮', '可关闭状态', '可访问性', '动画效果']
    },
    {
      name: 'HelperText',
      description: '帮助文本，显示说明、提示和状态消息',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['多种状态', '图标显示', '链接支持', '文本截断', '无障碍访问', '动画效果']
    },
    {
      name: 'InputGroup',
      description: '输入组，前后缀组合布局',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['前缀后缀', '组合布局', '紧凑模式', '主题适配']
    },
    {
      name: 'ButtonGroup',
      description: '按钮组，互斥/多选按钮布局',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['互斥选择', '多选模式', '垂直布局', '按钮变体']
    },
    {
      name: 'FieldLabel',
      description: '字段标签，提供字段标识和描述功能',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['必填标记', '描述文本', '图标集成', '点击聚焦', '无障碍访问', '隐藏标签']
    },
    {
      name: 'ValidationSummary',
      description: '校验汇总，显示多个字段的校验结果和导航跳转',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['多字段错误展示', '分组显示', '错误级别分类', '跳转到错误字段', '自动滚动定位', '错误计数显示', '复制错误摘要', '自定义错误渲染', '图标显示', '响应式设计', '深色主题', '可访问性支持']
    },
    {
      name: 'FormErrorBanner',
      description: '表单错误横幅，显示表单级别的全局错误信息',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['5种错误类型', '自动消失', '手动关闭', '重试功能', '详情展开', '固定定位', '操作按钮', '错误代码复制', '多状态支持', '动画效果', '完整可访问性支持']
    },
    {
      name: 'FormikAdapter',
      description: 'Formik 表单适配器，提供表单状态管理与 Xorigo UI 组件集成',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['Formik 深度集成', '表单验证和错误处理', '异步验证', '字段级验证', '提交状态管理', '重置功能', '默认值设置', '表单禁用状态', '实时验证', '错误消息映射', '自定义验证规则', 'TypeScript 类型安全', '可访问性支持', '3种视觉变体', '4种尺寸规格', '4个自定义 Hook']
    },
    {
      name: 'ZodAdapter',
      description: 'Zod 验证适配器，提供类型安全的表单验证功能',
      stability: 'stable' as const,
      since: 'v1.0.0',
      features: ['Zod 模式验证适配器', '实时验证', '异步验证', '字段级验证', '自定义错误消息', '验证时机控制', '条件验证', '数组验证', '嵌套对象验证', '类型推断', '错误格式化', 'TypeScript 类型安全', 'Zod 深度集成', '可访问性支持', '3种视觉变体', '4种尺寸规格', '4个自定义 Hook']
    }
  ],

  // 设计原则
  designPrinciples: [
    '职责分离：forms 管理逻辑，inputs 提供控件',
    '完整的表单状态管理',
    '内置校验引擎',
    '关联校验支持',
    '无障碍访问优先',
    '第三方表单库适配支持'
  ],

  // 使用指南
  usage: {
    basic: '使用 FormProvider 或 Form 作为容器，FormField 或 FormItem 包装字段，HelperText/ErrorMessage/ValidationMessage 显示消息',
    validation: '内置校验规则，支持自定义校验函数和异步校验',
    layout: 'FormLayout 和 InputGroup 提供组合布局',
    accessibility: '完整的 ARIA 支持和键盘导航',
    formikIntegration: '使用 FormikAdapter 集成 Formik 表单库，支持复杂的表单验证和状态管理',
    zodIntegration: '使用 ZodAdapter 集成 Zod 验证库，提供类型安全的表单验证功能'
  },

  // 与 inputs 分类的关系
  relationshipWithInputs: {
    dependency: 'forms 依赖 inputs 提供具体输入控件',
    collaboration: 'forms 提供管理逻辑，inputs 提供交互能力',
    separation: '清晰的职责边界，避免功能重叠',
    integration: '通过 props 和回调无缝集成'
  },

  // 与 Formik 的关系
  relationshipWithFormik: {
    adapter: 'FormikAdapter 提供 Formik 与 Xorigo UI 的无缝集成',
    compatibility: '保持 Formik 所有核心功能和 API',
    enhancement: '通过 Xorigo UI 组件增强用户体验',
    typeSafety: '提供完整的 TypeScript 类型支持'
  },

  // 与 Zod 的关系
  relationshipWithZod: {
    adapter: 'ZodAdapter 提供 Zod 与 Xorigo UI 的无缝集成',
    compatibility: '保持 Zod 所有核心功能和 API',
    typeSafety: '基于 Zod 模式自动推断 TypeScript 类型',
    validation: '支持实时验证、异步验证、条件验证和复杂验证'
  },

  // 架构对齐
  architectureAlignment: {
    ssotVersion: 'v2025.11.03',
    taxonomyCategory: 'forms',
    layer: 'Component Layer',
    dependencyLevel: 4,
    dependencies: ['inputs', 'primitives', 'system', 'foundations', 'formik', 'zod'],
  }
} as const

// ============================================================================
// 6. 工具函数 (Utility Functions)
// ============================================================================

/**
 * 创建表单校验规则
 */
export const createValidationRule = (
  rule: Omit<ValidationRule, 'id'>
): ValidationRule => ({
  ...rule,
  id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9)
})

/**
 * 创建表单初始状态
 */
export const createFormState = <T extends Record<string, any>>(
  initialValues: T
): {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
} => ({
  values: initialValues,
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true
})

/**
 * 创建表单初始状态（FormProvider 版本）
 */
export const createFormInitialState = <T extends Record<string, any>>(
  initialValues: T
) => ({
  values: initialValues,
  errors: {},
  touched: {},
  validating: {},
})

/**
 * 创建表单验证规则（FormProvider 版本）
 */
export const createFormValidationRule = <T extends Record<string, any>>(
  validate: (values: T) => Partial<Record<keyof T, string>>
) => validate

/**
 * 创建表单组配置
 */
export const createFormGroupConfig = (
  options?: {
    variant?: 'default' | 'bordered' | 'ghost' | 'filled'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    layout?: 'single' | 'grid' | 'double' | 'triple'
    required?: boolean
    disabled?: boolean
    collapsible?: boolean
  }
) => {
  return {
    variant: options?.variant || 'default',
    size: options?.size || 'md',
    layout: options?.layout || 'single',
    required: options?.required || false,
    disabled: options?.disabled || false,
    collapsible: options?.collapsible || false,
  }
}

// ============================================================================
// 7. 常量 (Constants)
// ============================================================================

/**
 * 表单验证触发器
 */
export const VALIDATION_TRIGGERS = {
  ON_CHANGE: 'onChange',
  ON_BLUR: 'onBlur',
  ON_SUBMIT: 'onSubmit',
} as const

/**
 * 表单状态
 */
export const FORM_STATUS = {
  IDLE: 'idle',
  VALIDATING: 'validating',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

/**
 * FormGroup 变体常量
 */
export const FORM_GROUP_VARIANTS = {
  DEFAULT: 'default' as const,
  BORDERED: 'bordered' as const,
  GHOST: 'ghost' as const,
  FILLED: 'filled' as const,
} as const

/**
 * FormGroup 尺寸常量
 */
export const FORM_GROUP_SIZES = {
  SM: 'sm' as const,
  MD: 'md' as const,
  LG: 'lg' as const,
  XL: 'xl' as const,
} as const

/**
 * FormGroup 布局常量
 */
export const FORM_GROUP_LAYOUTS = {
  SINGLE: 'single' as const,
  GRID: 'grid' as const,
  DOUBLE: 'double' as const,
  TRIPLE: 'triple' as const,
} as const

/**
 * FormProvider 默认配置
 */
export const FORM_PROVIDER_DEFAULTS = {
  validateOnChange: true,
  validateOnBlur: true,
  disabled: false,
  readonly: false,
  enableReinitialize: false,
} as const

/**
 * FormLayout 默认配置
 */
export const FORM_LAYOUT_DEFAULTS = {
  layout: 'single' as const,
  gap: 'md' as const,
  labelWidth: 'md' as const,
  labelPosition: 'top' as const,
  align: 'stretch' as const,
  sectionSpacing: 'md' as const,
  responsive: true,
  disabled: false,
} as const

/**
 * FormGroup 默认配置
 */
export const FORM_GROUP_DEFAULTS = {
  variant: 'default' as const,
  size: 'md' as const,
  layout: 'single' as const,
  required: false,
  disabled: false,
  collapsible: false,
  showRequiredIndicator: true,
  showOptionalIndicator: false,
  defaultCollapsed: false,
} as const

/**
 * FormErrorBanner 错误类型常量
 */
export const FORM_ERROR_TYPES = {
  VALIDATION: 'validation' as const,
  NETWORK: 'network' as const,
  SERVER: 'server' as const,
  PERMISSION: 'permission' as const,
  UNKNOWN: 'unknown' as const,
} as const

/**
 * FormErrorBanner 严重程度常量
 */
export const FORM_ERROR_SEVERITY = {
  CRITICAL: 'critical' as const,
  MAJOR: 'major' as const,
  MINOR: 'minor' as const,
} as const

/**
 * FormErrorBanner 固定位置常量
 */
export const FORM_ERROR_POSITIONS = {
  TOP: 'top' as const,
  BOTTOM: 'bottom' as const,
  TOP_FULL: 'top-full' as const,
} as const

// ============================================================================
// 8. 类型守卫 (Type Guards)
// ============================================================================

/**
 * 检查是否为有效的表单值
 */
export const isFormValue = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === 'object'
}

/**
 * 检查表单是否有效
 */
export const isFormValid = (errors: any): boolean => {
  return Object.keys(errors).length === 0
}

/**
 * 检查表单是否已被修改
 */
export const isFormDirty = (touched: any): boolean => {
  return Object.values(touched).some(Boolean)
}

/**
 * 检查是否为有效的错误类型
 */
export const isFormErrorType = (type: string): type is keyof typeof FORM_ERROR_TYPES => {
  return Object.keys(FORM_ERROR_TYPES).includes(type.toUpperCase())
}

/**
 * 检查是否为有效的错误严重程度
 */
export const isFormErrorSeverity = (severity: string): severity is keyof typeof FORM_ERROR_SEVERITY => {
  return Object.keys(FORM_ERROR_SEVERITY).includes(severity.toUpperCase())
}

/**
 * 检查是否为有效的 FormGroup 变体
 */
export const isFormGroupVariant = (
  variant: string
): variant is keyof typeof FORM_GROUP_VARIANTS => {
  return Object.keys(FORM_GROUP_VARIANTS).includes(variant.toUpperCase())
}

/**
 * 检查是否为有效的 FormGroup 尺寸
 */
export const isFormGroupSize = (
  size: string
): size is keyof typeof FORM_GROUP_SIZES => {
  return Object.keys(FORM_GROUP_SIZES).includes(size.toUpperCase())
}

/**
 * 检查是否为有效的 FormGroup 布局
 */
export const isFormGroupLayout = (
  layout: string
): layout is keyof typeof FORM_GROUP_LAYOUTS => {
  return Object.keys(FORM_GROUP_LAYOUTS).includes(layout.toUpperCase())
}

// ============================================================================
// 9. 钩子函数 (Hook Functions)
// ============================================================================

/**
 * 获取表单字段属性（简化字段绑定）
 */
export const getFieldProps = <T extends Record<string, any>>(
  formContext: any,
  name: string
) => {
  return {
    name,
    value: formContext.values[name],
    error: formContext.errors[name],
    touched: formContext.touched[name] || false,
    validating: formContext.validating?.[name] || false,
    disabled: formContext.disabled || formContext.readonly,
    readonly: formContext.readonly,
    onChange: (value: any) => formContext.setFieldValue(name, value),
    onBlur: () => formContext.setFieldTouched(name, true),
  }
}

/**
 * 创建表单提交处理器
 */
export const createFormSubmitHandler = (
  onSubmit: (values: any, helpers: any) => void | Promise<void>,
  formContext: any
) => {
  return async (event?: React.FormEvent) => {
    event?.preventDefault?.()

    if (formContext.disabled || formContext.readonly || formContext.isSubmitting) {
      return
    }

    // 标记所有字段为已触摸
    const allFieldsTouched = Object.keys(formContext.values).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as any)
    formContext.setTouched(allFieldsTouched)

    // 验证表单
    const isValid = await formContext.validateForm()

    if (isValid && onSubmit) {
      try {
        await onSubmit(formContext.values, formContext)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }
  }
}

/**
 * 创建表单布局配置
 */
export const createFormLayoutConfig = (
  layout: 'single' | 'double' | 'triple' | 'grid' | 'custom' = 'single',
  options?: {
    columns?: number
    gap?: 'sm' | 'md' | 'lg' | 'xl'
    labelPosition?: 'top' | 'left' | 'right' | 'floating'
    responsive?: boolean
  }
) => {
  return {
    layout,
    ...options,
    ...FORM_LAYOUT_DEFAULTS,
  }
}

/**
 * 创建错误横幅配置
 */
export const createFormErrorBannerConfig = (
  options?: {
    variant?: 'default' | 'destructive' | 'warning' | 'info' | 'success'
    severity?: 'critical' | 'major' | 'minor'
    size?: 'sm' | 'md' | 'lg'
    autoDismiss?: number
    dismissible?: boolean
    showIcon?: boolean
    fixed?: boolean
    position?: 'top' | 'bottom' | 'top-full'
  }
) => {
  return {
    variant: options?.variant || 'destructive',
    severity: options?.severity || 'major',
    size: options?.size || 'md',
    autoDismiss: options?.autoDismiss || 0,
    dismissible: options?.dismissible !== false,
    showIcon: options?.showIcon !== false,
    fixed: options?.fixed || false,
    position: options?.position || 'top',
  }
}

// ============================================================================
// 10. 错误横幅辅助函数
// ============================================================================

/**
 * 创建错误横幅项目
 */
export const createFormErrorBannerItem = (
  message: string,
  options?: {
    errorType?: 'validation' | 'network' | 'server' | 'permission' | 'unknown'
    severity?: 'critical' | 'major' | 'minor'
    code?: string
    details?: string
  }
) => {
  return {
    message,
    errorType: options?.errorType || 'unknown',
    severity: options?.severity || 'major',
    code: options?.code,
    details: options?.details,
  }
}

/**
 * 创建错误横幅操作
 */
export const createFormErrorAction = (
  text: string,
  onClick: () => void,
  options?: {
    icon?: React.ReactNode
    disabled?: boolean
    variant?: 'primary' | 'secondary'
    external?: boolean
  }
) => {
  return {
    text,
    onClick,
    icon: options?.icon,
    disabled: options?.disabled,
    variant: options?.variant || 'primary',
    external: options?.external || false,
  }
}

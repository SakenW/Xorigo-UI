/**
 * Inputs category - 输入控件分类
 *
 * 提供 11 个核心输入控件，涵盖所有基础数据录入需求
 * 与 SSOT v2025.11.03 架构严格对齐：inputs = 输入控件本体
 *
 * 组件清单：
 * 1. Button - 通用按钮，支持变体/尺寸/状态
 * 2. Input - 基础文本输入框
 * 3. Select - 下拉选择器，支持单选/多选
 * 4. Checkbox - 复选框，支持全选/半选
 * 5. Radio - 单选框，分组管理
 * 6. Switch - 开关切换器
 * 7. Slider - 滑块范围选择器
 * 8. Textarea - 多行文本输入
 * 9. Combobox - 组合框，搜索+选择
 * 10. InputNumber - 数字输入框
 * 11. PasswordInput - 密码输入框
 * 12. SearchInput - 搜索输入框
 *
 * 技术特性：
 * ✅ 完整的 TypeScript 类型定义
 * ✅ 七轴主题系统集成
 * ✅ 可访问性支持 (ARIA)
 * ✅ 响应式设计
 * ✅ Framer Motion 动画
 * ✅ 统一的 API 设计
 */

// ============================================================================
// 1. 基础输入控件 (Basic Input Controls)
// ============================================================================

// Button - 按钮组件
export { Button } from './button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './button'

// Input - 基础文本输入
export { Input } from './input'
export type { InputProps, InputVariant, InputSize } from './input'

// Select - 下拉选择器
export { Select } from './select'
export type { SelectProps, SelectOption, SelectSize } from './select'

// ============================================================================
// 2. 选择类控件 (Selection Controls)
// ============================================================================

// Checkbox - 复选框
export { Checkbox } from './checkbox'
export type { CheckboxProps, CheckboxState } from './checkbox'

// Radio - 单选框
export { Radio } from './radio'
export type { RadioProps, RadioOption } from './radio'

// Switch - 开关切换器
export { Switch } from './switch'
export type { SwitchProps, SwitchState } from './switch'

// ============================================================================
// 3. 数值输入控件 (Numeric Input Controls)
// ============================================================================

// Slider - 滑块范围选择器
export { Slider } from './slider'
export type { SliderProps, SliderValue, SliderMark } from './slider'

// InputNumber - 数字输入框
export { InputNumber } from './input-number'
export type { InputNumberProps, InputNumberValue } from './input-number'

// ============================================================================
// 4. 文本输入控件 (Text Input Controls)
// ============================================================================

// Textarea - 多行文本输入
export { Textarea } from './textarea'
export type { TextareaProps, TextareaResize } from './textarea'

// PasswordInput - 密码输入框
export { PasswordInput } from './password-input'
export type { PasswordInputProps } from './password-input'

// SearchInput - 搜索输入框
export { SearchInput } from './search-input'
export type { SearchInputProps, SearchInputSuggestion } from './search-input'

// ============================================================================
// 5. 复合输入控件 (Compound Input Controls)
// ============================================================================

// Combobox - 组合框（搜索+选择）
export { Combobox } from './combobox'
export type { ComboboxProps, ComboboxOption, ComboboxFilter } from './combobox'

// ============================================================================
// 6. 类型重导出 (Type Re-exports)
// ============================================================================

// 通用类型定义
export type {
  // 基础输入属性
  HTMLInputProps,
  HTMLTextAreaProps,
  HTMLSelectProps,

  // 尺寸和变体
  InputSize,
  InputVariant,

  // 状态类型
  InputState,
  ValidationState,

  // 事件类型
  InputEventHandler,
  ChangeEventHandler,
  FocusEventHandler,
  BlurEventHandler,
  KeyDownEventHandler,

  // 选项类型
  OptionValue,
  OptionLabel,
  OptionDisabled
} from '../types'

// ============================================================================
// 7. 组件元数据 (Component Metadata)
// ============================================================================

/**
 * inputs 分类组件元数据
 * 符合 v2025.11.03 SSOT 规范
 */
export const inputsCategoryMetadata = {
  category: 'inputs',
  title: '输入控件',
  description: '提供完整的数据录入解决方案，涵盖文本、选择、数值等各类输入场景',
  componentCount: 12,
  stability: 'stable' as const,

  // 组件列表
  components: [
    {
      name: 'Button',
      description: '通用按钮组件，支持多种变体和尺寸',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'Input',
      description: '基础文本输入框',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'Select',
      description: '下拉选择器，支持单选和多选',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'Checkbox',
      description: '复选框，支持全选和半选状态',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'Radio',
      description: '单选框，支持分组管理',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'Switch',
      description: '开关切换器',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'Slider',
      description: '滑块范围选择器',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'Textarea',
      description: '多行文本输入',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'Combobox',
      description: '组合框，支持搜索和选择',
      stability: 'beta' as const,
      since: 'v1.2.0'
    },
    {
      name: 'InputNumber',
      description: '数字输入框',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'PasswordInput',
      description: '密码输入框，支持可见性切换',
      stability: 'stable' as const,
      since: 'v1.0.0'
    },
    {
      name: 'SearchInput',
      description: '搜索输入框，支持建议和清除',
      stability: 'stable' as const,
      since: 'v1.0.0'
    }
  ],

  // 设计原则
  designPrinciples: [
    '一致的 API 设计',
    '完整的状态管理',
    '内置校验支持',
    '键盘导航优化',
    '移动端友好'
  ],

  // 使用指南
  usage: {
    basic: '选择合适的输入控件，使用 value/onChange 进行受控模式',
    validation: '配合 form 组件使用，实现完整的表单校验',
    accessibility: '所有组件内置 ARIA 支持，无需额外配置',
    theming: '自动适配七轴主题系统'
  },

  // 架构对齐
  architectureAlignment: {
    ssotVersion: 'v2025.11.03',
    taxonomyCategory: 'inputs',
    layer: 'Component Layer',
    dependencyLevel: 3,
    dependencies: ['primitives', 'system', 'foundations']
  }
} as const
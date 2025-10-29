/**
 * Form 组件导出 - 符合七轴主题系统 v1.4 SSOT
 *
 * 表单组件集合 - Input, Select, Checkbox, Radio, Switch 等
 */

// =============================================================================
// 核心组件导出
// =============================================================================

// Input 组件系列
export {
  Input
} from './input/input'
export type {
  InputProps
} from './input/input'

// Form 组件系列
export {
  Select
} from './select'
export type {
  SelectProps
} from './select'

export {
  Checkbox
} from './checkbox'
export type {
  CheckboxProps
} from './checkbox'

export {
  Switch
} from './switch'
export type {
  SwitchProps
} from './switch'

import { Input } from './input/input'
import { Select } from './select'
import { Checkbox } from './checkbox'
import { Switch } from './switch'

// =============================================================================
// 组件集合导出
// =============================================================================

/**
 * 表单组件集合
 */
export const FormComponents = {
  Input,
  Select,
  Checkbox,
  Switch,
} as const

// =============================================================================
// 类型导出
// =============================================================================

/**
 * 所有表单组件的 Props 类型联合
 */
export type FormComponentProps = InputProps | SelectProps | CheckboxProps | SwitchProps
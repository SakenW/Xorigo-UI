/**
 * Form Components - 表单组件集合 (棕地架构 v1.5.1)
 *
 * 包含所有表单相关组件：基础输入控件、复合输入控件和表单容器组件
 * 与Xorigo UI设计系统完全集成，支持七轴主题和可访问性
 */

// ============================================================================
// 基础输入控件 (Basic Input Controls)
// ============================================================================

export { Input } from './input'
export type { InputProps } from './input'

export { Textarea } from './textarea'
export type { TextareaProps } from './textarea'

export { Select } from './select'
export type { SelectProps } from './select'

export { Checkbox } from './checkbox'
export type { CheckboxProps } from './checkbox'

export { Radio } from './radio'
export type { RadioProps } from './radio'

export { Switch } from './switch'
export type { SwitchProps } from './switch'

export { Slider } from './slider'
export type { SliderProps } from './slider'

// ============================================================================
// 复合输入控件 (Compound Input Controls)
// ============================================================================

export { InputGroup } from './input-group'
export type { InputGroupProps } from './input-group'

export { InputNumber } from './input-number'
export type { InputNumberProps } from './input-number'

export { PasswordInput } from './password-input'
export type { PasswordInputProps } from './password-input'

export { SearchInput } from './search-input'
export type { SearchInputProps } from './search-input'

export { Combobox } from './combobox'
export type { ComboboxProps } from './combobox'

export { Command } from './command'
export type { CommandProps } from './command'

export { ButtonGroup } from './button-group'
export type { ButtonGroupProps } from './button-group'

// ============================================================================
// 表单容器组件 (Form Container Components)
// ============================================================================

export { Form } from './form'
export type { FormProps } from './form'

export { FormField } from './form-field'
export type { FormFieldProps } from './form-field'

export { Fieldset } from './fieldset'
export type { FieldsetProps } from './fieldset'

export { ValidationMessage } from './validation-message'
export type { ValidationMessageProps } from './validation-message'

// ============================================================================
// Usage Examples
// ============================================================================
//
// // 导入所有表单组件
// import { Input, Select, Button, Form } from '@xorigo-ui/core'
//
// // 或者只导入表单类别
// import { Input, Select, Form, ValidationMessage } from '@xorigo-ui/core/form'
//
// // 基础用法
// <Form>
//   <FormField label="用户名" required>
//     <Input placeholder="请输入用户名" />
//   </FormField>
//   <FormField label="密码" required>
//     <PasswordInput />
//   </FormField>
// </Form>
//
// ============================================================================
/**
 * @fileoverview ZodAdapter 组件导出
 * @description Zod 验证适配器组件的完整导出，包括组件、钩子、工具函数和类型
 */

export { ZodAdapter } from './zod-adapter'
export type { ZodAdapterProps } from './zod-adapter'

// Context
export { useZodAdapter } from './zod-adapter'

// Hooks
export { useZodField, useZodForm, useZodSubmit, useZodReset } from './zod-adapter'

// Variants
export {
  zodAdapterVariants,
  formContentVariants,
  submitButtonVariants,
  resetButtonVariants,
} from './zod-adapter'

// Constants
export {
  ZOD_ADAPTER_VARIANTS,
  ZOD_ADAPTER_SIZES,
  ZOD_ADAPTER_DEFAULTS,
} from './zod-adapter'

// Utility Functions
export {
  createZodValidationRule,
  createAsyncZodValidator,
  createRequiredValidator,
  createEmailValidator,
  createMinLengthValidator,
  createMaxLengthValidator,
} from './zod-adapter'

// Metadata
export { zodAdapterMetadata } from './metadata'

// Re-export from metadata file
import { zodAdapterMetadata } from './metadata'

export { zodAdapterMetadata }

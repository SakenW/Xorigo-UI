import { z } from 'zod'

// 组件变体定义
export const ComponentVariantSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  className: z.string(),
  props: z.record(z.string(), z.any()).optional(),
})

// 组件属性定义
export const ComponentPropSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  required: z.boolean().default(false),
  defaultValue: z.any().optional(),
  options: z.array(z.string()).optional(), // 用于 enum 类型
})

// 组件定义
export const ComponentSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.enum(['ui', 'feedback', 'navigation', 'advanced', 'radix']),
  framework: z.literal('react'),
  style: z.literal('tailwind'),
  files: z.array(z.string()),
  props: z.array(ComponentPropSchema),
  variants: z.array(ComponentVariantSchema),
  example: z.string().optional(),
  accessibility: z.object({
    'aria-label': z.boolean().default(true),
    'keyboard-navigation': z.boolean().default(true),
    'screen-reader': z.boolean().default(true),
    'color-contrast': z.boolean().default(true),
  }).optional(),
  theme: z.object({
    supported: z.boolean().default(true),
    tokens: z.array(z.string()).optional(),
  }).optional(),
})

// 注册表架构
export const RegistrySchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  components: z.array(ComponentSchema),
  tokens: z.object({
    colors: z.record(z.string(), z.string()),
    spacing: z.record(z.string(), z.string()),
    typography: z.record(z.string(), z.string()),
    borderRadius: z.record(z.string(), z.string()),
  }),
  themes: z.array(z.object({
    name: z.string(),
    colors: z.record(z.string(), z.string()),
  })),
})

// 类型导出
export type ComponentVariant = z.infer<typeof ComponentVariantSchema>
export type ComponentProp = z.infer<typeof ComponentPropSchema>
export type Component = z.infer<typeof ComponentSchema>
export type Registry = z.infer<typeof RegistrySchema>
---
name: "Xorigo UI 组件 API 设计约束器"
description: "基于 Xorigo UI v1.4 SSOT 的组件 API 设计约束工具，确保所有 primitives/ 和 components/ 层组件严格遵循统一的 API 设计规范，包含 API 验证、接口生成和一致性检查功能"
author: "Xorigo UI Team"
version: "2025.11.05"
tags: ["component-api", "design-constraints", "interface-standards", "react-patterns", "typescript", "api-validation", "consistency-check"]
---

# Xorigo UI 组件 API 设计约束器

基于 Xorigo UI v1.4 SSOT 的组件 API 设计约束工具，确保所有组件严格遵循统一的 API 设计规范和最佳实践。

## 🎯 技能功能概览

**🔧 核心功能**：
- **API 设计验证器**：验证组件 API 是否符合设计标准
- **接口生成器**：自动生成符合规范的组件接口
- **一致性检查器**：检查多个组件间的 API 一致性
- **迁移助手**：帮助从旧 API 迁移到新标准
- **约束规则引擎**：强制执行 API 设计规范
- **命名规范验证**：确保文件和组件命名符合标准

## 🎯 作用域边界

**✅ 负责范围**：
- `primitives/` 层原子组件 API 规范
- `components/` 层结构组件 API 标准
- TypeScript 接口设计一致性
- React 组件模式标准化

**❌ 排除范围**：
- 样式实现细节
- 主题系统逻辑
- 网站层组件

## 🏗️ 组件目录结构约束

### Primitives 层结构

```
packages/core/src/primitives/
├── button/
│  ├── index.ts              # ✅ 统一导出
│  ├── button.tsx           # ✅ 主组件实现 (kebab-case)
│  ├── button.types.ts      # ✅ 类型定义 (kebab-case.types.ts)
│  ├── button.variants.ts   # ✅ CVA 变体定义 (kebab-case.variants.ts)
│  └── button.stories.tsx   # ✅ Storybook 故事 (kebab-case.stories.tsx)
├── card/
│  ├── index.ts
│  ├── card.tsx
│  ├── card.types.ts
│  ├── card.variants.ts
│  ├── card-header.tsx      # ✅ 子组件 (kebab-case.tsx)
│  ├── card-content.tsx     # ✅ 子组件 (kebab-case.tsx)
│  ├── card-footer.tsx      # ✅ 子组件 (kebab-case.tsx)
│  └── card.stories.tsx
├── data-table/             # ✅ 复杂组件名使用 kebab-case
│  ├── index.ts
│  ├── data-table.tsx
│  ├── data-table.types.ts
│  ├── data-table.variants.ts
│  └── data-table.stories.tsx
├── surface/
│  ├── index.ts
│  ├── surface.tsx
│  ├── surface.types.ts
│  └── surface.stories.tsx
└── index.ts                 # ✅ primitives 层统一导出
```

### Components 层结构

```
packages/core/src/components/
├── layout/
│  ├── grid/
│  │  ├── index.ts
│  │  ├── grid.tsx
│  │  ├── grid.types.ts
│  │  └── grid.stories.tsx
│  ├── container/
│  └── index.ts
├── feedback/
│  ├── alert/
│  ├── toast/
│  └── index.ts
├── navigation/
│  ├── navbar/
│  ├── sidebar/
│  └── index.ts
└── index.ts                 # ✅ components 层统一导出
```

**文件命名规范说明**：
- **所有文件名使用 kebab-case** - 现代前端最佳实践
- **组件主文件**：与目录同名 (button/button.tsx, data-table/data-table.tsx)
- **类型文件**：以 `.types.ts` 结尾 (button.types.ts, data-table.types.ts)
- **变体文件**：以 `.variants.ts` 结尾 (button.variants.ts, data-table.variants.ts)
- **Storybook 文件**：以 `.stories.tsx` 结尾 (button.stories.tsx, data-table.stories.tsx)
- **子组件文件**：使用 kebab-case (card-header.tsx, card-content.tsx, card-footer.tsx)

## 🎯 标准 API 设计模式

### 基础组件接口模板

```typescript
// 标准组件 Props 接口
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElementType>,
    VariantProps<typeof componentVariants> {

  // 🎨 变体系统
  variant?: ComponentVariant
  size?: ComponentSize

  // 🎭 状态控制
  disabled?: boolean
  loading?: boolean
  active?: boolean

  // 🎪 内容组合
  children?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode

  // 🛡️ 可访问性
  'aria-label'?: string
  'aria-describedby'?: string

  // 🧪 测试属性
  testProps?: Record<string, string>

  // 🎯 事件处理
  onClick?: (event: React.MouseEvent<HTMLElementType>) => void
  onFocus?: (event: React.FocusEvent<HTMLElementType>) => void
  onBlur?: (event: React.FocusEvent<HTMLElementType>) => void
}

// 变体定义
export const componentVariants = cva(
  "base-component-classes", {
    variants: {
      variant: {
        primary: "variant-primary-classes",
        secondary: "variant-secondary-classes",
        // ... 更多变体
      },
      size: {
        sm: "size-sm-classes",
        md: "size-md-classes",
        lg: "size-lg-classes",
        // ... 更多尺寸
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export type ComponentVariant = VariantProps<typeof componentVariants>['variant']
export type ComponentSize = VariantProps<typeof componentVariants>['size']
```

### 组件实现模板

```typescript
// 标准组件实现
export const Component = React.forwardRef<HTMLElementType, ComponentProps>(
  ({
    className,
    variant,
    size,
    disabled = false,
    loading = false,
    children,
    leftIcon,
    rightIcon,
    testProps,
    onClick,
    ...restProps
  }, ref) => {

    // 生成变体类名
    const variantClasses = componentVariants({ variant, size, disabled, loading })

    // 合并类名
    const classes = cn(variantClasses, className)

    // 事件处理器
    const handleClick = (event: React.MouseEvent<HTMLElementType>) => {
      if (disabled || loading) return
      onClick?.(event)
    }

    return (
      <ElementType
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={loading}
        onClick={handleClick}
        data-loading={loading}
        data-variant={variant}
        data-size={size}
        {...testProps}
        {...restProps}
      >
        {loading && <LoadingSpinner className="component-loading-icon" />}
        {leftIcon && <span className="component-left-icon">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="component-right-icon">{rightIcon}</span>}
      </ElementType>
    )
  }
)

Component.displayName = 'Component'

export { Component, componentVariants }
export type { ComponentProps }
```

## 🔧 具体 API 约束规范

### Button 组件 API 约束

```typescript
// button.types.ts
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {

  // 必需基础属性
  variant?: ButtonVariant
  size?: ButtonSize

  // 状态控制
  disabled?: boolean
  loading?: boolean

  // 内容增强
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  iconOnly?: boolean

  // 形状变体
  fullWidth?: boolean
  rounded?: boolean

  // 测试属性
  testProps?: Record<string, string>
}

// button.variants.ts
export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500",
        success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500",
        warning: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        link: "text-primary-500 hover:text-primary-600 underline-offset-4 hover:underline focus:ring-primary-500",
        outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500",
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-gray-800 hover:bg-white/30 focus:ring-white/50",
        neon: "bg-gray-900 text-cyan-400 border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus:ring-cyan-400",
        gradientOutline: "relative bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-500 hover:bg-purple-500 hover:text-white focus:ring-purple-500"
      },
      size: {
        sm: "h-8 px-3 text-sm gap-2",
        md: "h-10 px-4 text-base gap-2",
        lg: "h-12 px-6 text-lg gap-3",
        xl: "h-14 px-8 text-xl gap-4"
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none"
      },
      loading: {
        true: "cursor-wait"
      },
      fullWidth: {
        true: "w-full"
      },
      rounded: {
        true: "rounded-full"
      },
      iconOnly: {
        true: "p-0 aspect-square"
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
export type ButtonSize = VariantProps<typeof buttonVariants>['size']
```

### Card 组件 API 约束

```typescript
// card.types.ts
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {

  // 基础属性
  variant?: CardVariant
  interactive?: boolean

  // 状态控制
  loading?: boolean
  error?: boolean

  // 布局控制
  fullWidth?: boolean
  aspectRatio?: string | number

  // 测试属性
  testProps?: Record<string, string>
}

// 子组件接口
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: boolean | 'sm' | 'md' | 'lg'
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'space-between'
}

// card.variants.ts
export const cardVariants = cva(
  "rounded-lg border bg-white text-gray-900 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-gray-200 shadow-sm",
        elevated: "border-gray-200 shadow-lg",
        outlined: "border-2 border-gray-300 shadow-none",
        glass: "bg-white/20 backdrop-blur-md border border-white/30 shadow-lg",
        neumorphic: "bg-gray-100 border-0 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]",
        gradient: "bg-gradient-to-br from-purple-500 to-pink-500 border-0 text-white shadow-lg",
        neon: "bg-gray-900 border border-cyan-400/30 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        interactive: "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer",
        minimal: "border-0 shadow-none bg-transparent"
      },
      loading: {
        true: "opacity-60 pointer-events-none"
      },
      error: {
        true: "border-red-300 bg-red-50"
      },
      interactive: {
        true: "hover:shadow-md transition-shadow duration-200 cursor-pointer"
      },
      fullWidth: {
        true: "w-full"
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export type CardVariant = VariantProps<typeof cardVariants>['variant']
```

### Input 组件 API 约束

```typescript
// input.types.ts
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {

  // 基础属性
  variant?: InputVariant
  size?: InputSize

  // 状态控制
  error?: boolean
  success?: boolean
  warning?: boolean
  disabled?: boolean
  loading?: boolean

  // 功能增强
  label?: React.ReactNode
  helperText?: React.ReactNode
  errorMessage?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void

  // 密码输入
  type?: 'text' | 'email' | 'number' | 'password' | 'tel' | 'url'
  showPasswordToggle?: boolean

  // 字符计数
  maxLength?: number
  showCharacterCount?: boolean

  // 测试属性
  testProps?: Record<string, string>
}

// input.variants.ts
export const inputVariants = cva(
  "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus:border-primary-500 focus:ring-primary-500",
        filled: "border-transparent bg-gray-100 focus:border-primary-500 focus:ring-primary-500 focus:bg-white",
        outlined: "border-2 focus:border-primary-500 focus:ring-primary-500",
        underlined: "border-0 border-b-2 border-gray-300 rounded-none px-0 focus:border-primary-500 focus:ring-0",
        ghost: "border-transparent bg-transparent focus:bg-gray-50 focus:border-primary-500 focus:ring-primary-500",
        neon: "border-cyan-400/30 bg-gray-900 text-cyan-100 focus:border-cyan-400 focus:ring-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)] focus:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base"
      },
      error: {
        true: "border-red-500 focus:border-red-500 focus:ring-red-500"
      },
      success: {
        true: "border-green-500 focus:border-green-500 focus:ring-green-500"
      },
      warning: {
        true: "border-amber-500 focus:border-amber-500 focus:ring-amber-500"
      },
      disabled: {
        true: "bg-gray-100 text-gray-500 cursor-not-allowed"
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export type InputVariant = VariantProps<typeof inputVariants>['variant']
export type InputSize = VariantProps<typeof inputVariants>['size']
```

## 🔍 API 约束验证器

### 接口合规性检查

```typescript
// API 约束验证器
export class APIConstraintsValidator {
  static validateComponentInterface(
    componentPath: string,
    interfaceDefinition: any
  ): ValidationResult {
    const issues = []
    const warnings = []

    // 验证必需属性
    const requiredProps = ['variant', 'size', 'disabled', 'className', 'children']
    requiredProps.forEach(prop => {
      if (!(prop in interfaceDefinition)) {
        issues.push(`缺少必需属性: ${prop}`)
      }
    })

    // 验证 HTML 属性继承
    if (!interfaceDefinition.extends || !interfaceDefinition.extends.includes('HTMLAttributes')) {
      warnings.push('组件应该继承对应的 HTML 元素属性')
    }

    // 验证变体支持
    if (!interfaceDefinition.variant || !Array.isArray(interfaceDefinition.variant)) {
      issues.push('缺少 variant 属性定义')
    }

    // 验证尺寸支持
    if (!interfaceDefinition.size || !Array.isArray(interfaceDefinition.size)) {
      issues.push('缺少 size 属性定义')
    }

    // 验证可访问性属性
    const requiredAriaProps = ['aria-label', 'aria-describedby']
    requiredAriaProps.forEach(prop => {
      if (!(prop in interfaceDefinition)) {
        warnings.push(`建议添加可访问性属性: ${prop}`)
      }
    })

    return { valid: issues.length === 0, issues, warnings }
  }

  static validateComponentImplementation(
    componentPath: string,
    componentCode: string
  ): ValidationResult {
    const issues = []
    const warnings = []

    // 验证 forwardRef 使用
    if (!componentCode.includes('React.forwardRef')) {
      issues.push('组件必须使用 React.forwardRef')
    }

    // 验证 displayName 设置
    if (!componentCode.includes('displayName')) {
      warnings.push('建议设置组件 displayName')
    }

    // 验证 CVA 使用
    if (!componentCode.includes('cva(') && !componentCode.includes('class-variance-authority')) {
      issues.push('组件必须使用 CVA (class-variance-authority) 管理变体')
    }

    // 验证类名合并
    if (!componentCode.includes('cn(') && !componentCode.includes('clsx(') && !componentCode.includes('className')) {
      warnings.push('建议使用类名合并工具函数')
    }

    // 验证事件处理
    if (!componentCode.includes('onClick') && !componentCode.includes('onFocus')) {
      warnings.push('建议添加基本事件处理支持')
    }

    return { valid: issues.length === 0, issues, warnings }
  }
}
```

### 组件命名规范验证

```typescript
// 命名规范验证器
export class NamingConventionValidator {
  static validateComponentNaming(componentName: string, filePath: string): ValidationResult {
    const issues = []
    const warnings = []

    // 验证组件命名 - PascalCase
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
      issues.push(`组件名称必须使用 PascalCase: ${componentName}`)
    }

    // 验证文件命名 - kebab-case (现代前端最佳实践)
    const fileName = path.basename(filePath, '.tsx')
    if (!/^[a-z][a-z0-9-]*$/.test(fileName)) {
      issues.push(`文件名必须使用 kebab-case: ${fileName}`)
    }

    // 验证目录结构 - 适配 kebab-case 文件名
    const expectedPath = `src/primitives/${fileName}/${fileName}.tsx`
    if (filePath !== expectedPath) {
      warnings.push(`建议遵循标准目录结构: ${expectedPath}`)
    }

    return { valid: issues.length === 0, issues, warnings }
  }

  static validateFileNaming(fileName: string, fileType: 'component' | 'types' | 'variants' | 'stories' | 'test'): ValidationResult {
    const issues = []
    const warnings = []

    // 基础命名规则 - 所有文件使用 kebab-case
    if (!/^[a-z][a-z0-9-]*$/.test(fileName)) {
      issues.push(`文件名必须使用 kebab-case: ${fileName}`)
    }

    // 根据文件类型进行特定验证
    switch (fileType) {
      case 'component':
        // 组件主文件：与目录同名
        // 例如: button/button.tsx, data-table/data-table.tsx
        if (!fileName.includes('-') && fileName.length > 15) {
          warnings.push(`复杂的组件名建议使用 kebab-case 提高可读性: ${fileName}`)
        }
        break

      case 'types':
        // 类型文件：component-name.types.ts
        if (!fileName.endsWith('.types')) {
          issues.push(`类型文件必须以 .types.ts 结尾: ${fileName}`)
        }
        break

      case 'variants':
        // 变体文件：component-name.variants.ts
        if (!fileName.endsWith('.variants')) {
          issues.push(`变体文件必须以 .variants.ts 结尾: ${fileName}`)
        }
        break

      case 'stories':
        // Storybook 文件：component-name.stories.tsx
        if (!fileName.endsWith('.stories')) {
          issues.push(`Storybook 文件必须以 .stories.tsx 结尾: ${fileName}`)
        }
        break

      case 'test':
        // 测试文件：component-name.test.tsx 或 component-name.spec.tsx
        if (!fileName.endsWith('.test') && !fileName.endsWith('.spec')) {
          issues.push(`测试文件必须以 .test.tsx 或 .spec.tsx 结尾: ${fileName}`)
        }
        break
    }

    return { valid: issues.length === 0, issues, warnings }
  }

  static validatePropTypes(propTypes: any): ValidationResult {
    const issues = []
    const warnings = []

    // 验证变体命名
    if (propTypes.variant) {
      const validVariants = ['primary', 'secondary', 'success', 'warning', 'danger', 'ghost', 'link']
      propTypes.variant.forEach(variant => {
        if (!validVariants.includes(variant)) {
          warnings.push(`非标准变体名称: ${variant}`)
        }
      })
    }

    // 验证尺寸命名
    if (propTypes.size) {
      const validSizes = ['sm', 'md', 'lg', 'xl']
      propTypes.size.forEach(size => {
        if (!validSizes.includes(size)) {
          warnings.push(`非标准尺寸名称: ${size}`)
        }
      })
    }

    return { valid: issues.length === 0, issues, warnings }
  }
}
```

## 📝 现代文件命名最佳实践

### 推荐的文件命名规范

**✅ 正确的命名方式** (kebab-case 为现代前端标准):

```typescript
// 组件文件 - 使用 kebab-case
button/
├── index.ts              # 统一导出
├── button.tsx           # 主组件实现
├── button.types.ts      # 类型定义
├── button.variants.ts   # CVA 变体定义
├── button.stories.tsx   # Storybook 故事
└── button.test.tsx      # 单元测试

// 复杂组件名 - 同样使用 kebab-case
data-table/
├── index.ts
├── data-table.tsx
├── data-table.types.ts
├── data-table.variants.ts
├── data-table.stories.tsx
└── data-table.test.tsx

// 工具函数文件 - kebab-case
color-tokens.ts           # ✅ 正确：颜色令牌工具
theme-utils.ts            # ✅ 正确：主题工具函数
component-helpers.ts      # ✅ 正确：组件辅助函数

// 类型定义文件 - kebab-case
global-types.ts           # ✅ 正确：全局类型
api-types.ts              # ✅ 正确：API 类型
component-types.ts        # ✅ 正确：组件类型

// 配置文件 - kebab-case
tailwind.config.ts        # ✅ 正确：Tailwind 配置
vite.config.ts           # ✅ 正确：Vite 配置
eslint.config.js         # ✅ 正确：ESLint 配置
```

**❌ 避免的命名方式**:

```typescript
// 避免使用 camelCase 文件名
colorTokens.ts            # ❌ 应为 color-tokens.ts
buttonTypes.ts            # ❌ 应为 button.types.ts
dataTable.tsx             # ❌ 应为 data-table.tsx

// 避免使用 PascalCase 文件名
Button.tsx                # ❌ 应为 button.tsx
DataTable.tsx             # ❌ 应为 data-table.tsx
ColorTokens.ts            # ❌ 应为 color-tokens.ts

// 避免使用数字开头或特殊字符
1-utils.ts               # ❌ 不应使用数字开头
@types.ts                # ❌ 不应使用特殊符号开头
util!.ts                  # ❌ 不应使用感叹号
```

### 目录结构最佳实践

**组件目录结构**:
```typescript
packages/core/src/primitives/
├── button/
│   ├── index.ts              # 统一导出
│   ├── button.tsx           # 主组件 (kebab-case)
│   ├── button.types.ts      # 类型定义 (kebab-case.types.ts)
│   ├── button.variants.ts   # 变体定义 (kebab-case.variants.ts)
│   ├── button.stories.tsx   # 故事文件 (kebab-case.stories.tsx)
│   └── button.test.tsx      # 测试文件 (kebab-case.test.tsx)
├── data-table/              # 复杂组件名使用 kebab-case
│   ├── index.ts
│   ├── data-table.tsx
│   ├── data-table.types.ts
│   ├── data-table.variants.ts
│   ├── data-table.stories.tsx
│   └── data-table.test.tsx
└── index.ts                 # primitives 层统一导出
```

**工具函数目录结构**:
```typescript
packages/core/src/utils/
├── color-tokens.ts          # 颜色相关工具
├── theme-utils.ts           # 主题相关工具
├── component-helpers.ts     # 组件辅助函数
├── format-helpers.ts        # 格式化工具
├── validation-utils.ts      # 验证工具
└── index.ts                 # 工具函数统一导出
```

### 命名规范优势

**1. 可读性和一致性**:
- kebab-case 提供最佳的跨平台可读性
- 文件名与 URL 路径、路由保持一致风格
- 避免大小写敏感操作系统的问题

**2. 现代前端标准**:
- Next.js、Vite、Tailwind CSS 等现代工具都推荐 kebab-case
- 符合 JavaScript/TypeScript 生态系统的最佳实践
- 与包管理、模块导入保持一致性

**3. 开发体验**:
- 文件名自动补全更加友好
- 文件搜索和过滤更加高效
- 团队协作减少命名歧义

**4. 工具兼容性**:
- 与 ESLint、Prettier 等工具的最佳实践一致
- Git 钩子、CI/CD 流程中的文件处理更可靠
- 跨平台开发 (Windows/macOS/Linux) 兼容性最佳

## 🚀 使用方法

### API 合规性检查

```bash
# 验证组件接口
"验证 Button 组件的 API 接口是否符合设计规范"

# 检查组件实现
"检查 Card 组件的实现是否遵循标准模式"

# 批量验证
"验证 primitives/ 目录下所有组件的 API 设计合规性"
```

### 组件创建辅助

```bash
# 创建新组件
"创建新的 Badge 组件，遵循完整的 API 设计规范"

# 添加变体
"为 Button 组件添加新的 variant: link"

# 扩展组件
"为 Input 组件添加密码切换功能"
```

### 代码审查支持

```bash
# 代码审查
"审查这个组件的 API 设计，检查是否符合规范"

# 重构建议
"根据 API 规范重构这个组件的 Props 接口"

# 最佳实践检查
"检查组件实现是否遵循 React 最佳实践"
```

## 📋 验证报告格式

```
🔧 组件 API 设计约束验证报告
📦 组件: Button
📅 时间: 2025-01-XX

✅ 接口验证通过
- ✅ 继承 HTMLButtonElement 属性
- ✅ 实现 CVA 变体系统
- ✅ 包含必需的 Props 接口
- ✅ 文件命名遵循 kebab-case 规范

⚠️ 警告 (2)
- ⚠️ 建议添加键盘导航支持
- ⚠️ 建议优化事件处理器类型

❌ 错误 (1)
- ❌ 缺少 forwardRef 实现

🛠️ 修复建议:
1. 使用 React.forwardRef 包装组件
2. 添加 onKeyDown 事件处理
3. 完善 TypeScript 类型定义
4. 文件命名已符合现代前端 kebab-case 标准

📊 合规性评分: 85/100
🎯 API 设计质量: 良好
📝 文件命名规范: ✅ 符合 kebab-case 标准
```

## 🛡️ 质量保证

### 严格约束规则

- **接口标准化**：所有组件必须遵循统一的 Props 接口模式
- **文件命名规范**：所有文件名必须使用 kebab-case (现代前端标准)
- **变体系统**：必须使用 CVA 管理组件变体
- **类型安全**：完整的 TypeScript 类型定义和导出
- **可访问性**：必需的 ARIA 属性和键盘导航支持
- **React 模式**：forwardRef、displayName、事件处理标准化

### 自动化检查

- **构建时验证**：编译时检查 API 设计合规性
- **ESLint 规则**：自定义 ESLint 规则强制 API 标准和文件命名规范
- **TypeScript 检查**：严格的类型检查和接口验证
- **文件命名检查**：自动验证 kebab-case 文件命名规范
- **测试覆盖**：API 接口的单元测试覆盖

基于 Xorigo UI v1.4 SSOT，确保所有组件 API 设计的一致性、可维护性和用户体验。

---

## 🔗 API 设计验证器功能

### 1. API 标准验证器

```typescript
// API 标准验证器
class APIDesignValidator {
  validateComponentAPI(componentName: string, componentDefinition: ComponentDefinition): APIValidationResult {
    const result: APIValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      recommendations: [],
      score: 100
    }

    // 1. 验证基础接口继承
    this.validateBaseInterfaces(componentDefinition, result)

    // 2. 验证Props命名规范
    this.validatePropsNaming(componentDefinition, result)

    // 3. 验证事件处理器
    this.validateEventHandlers(componentDefinition, result)

    // 4. 验证可访问性
    this.validateAccessibilityProps(componentDefinition, result)

    // 5. 验证变体系统
    this.validateVariantSystem(componentDefinition, result)

    // 6. 验证TypeScript类型
    this.validateTypeScriptTypes(componentDefinition, result)

    // 计算最终得分
    result.score = this.calculateValidationScore(result)

    return result
  }

  private validatePropsNaming(definition: ComponentDefinition, result: APIValidationResult): void {
    const props = definition.props || []

    // 检查布尔值命名
    const booleanProps = props.filter(prop => prop.type === 'boolean')
    const namingIssues = booleanProps.filter(prop =>
      !prop.name.startsWith('is') &&
      !prop.name.startsWith('has') &&
      !prop.name.startsWith('should') &&
      prop.name !== 'disabled' &&
      prop.name !== 'loading' &&
      prop.name !== 'readonly'
    )

    namingIssues.forEach(issue => {
      result.warnings.push({
        type: 'boolean_naming',
        message: `布尔值Prop建议使用is/has/should前缀: ${issue.name}`,
        suggestion: this.suggestBooleanPropName(issue.name),
        severity: 'warning'
      })
    })
  }

  private validateVariantSystem(definition: ComponentDefinition, result: APIValidationResult): void {
    // 检查变体定义
    if (definition.variants) {
      // 验证尺寸变体
      const validSizes = ['xs', 'sm', 'md', 'lg', 'xl']
      const sizeVariant = definition.variants.find(v => v.name === 'size')
      if (sizeVariant) {
        const invalidSizes = Object.keys(sizeVariant.values).filter(size => !validSizes.includes(size))
        if (invalidSizes.length > 0) {
          result.errors.push({
            type: 'invalid_size_variant',
            message: `无效的尺寸变体: ${invalidSizes.join(', ')}`,
            suggestion: `使用标准尺寸: ${validSizes.join(', ')}`,
            severity: 'error'
          })
        }
      }

      // 验证变体类型
      const validVariants = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']
      const variantType = definition.variants.find(v => v.name === 'variant')
      if (variantType) {
        const invalidVariants = Object.keys(variantType.values).filter(v => !validVariants.includes(v))
        if (invalidVariants.length > 0) {
          result.warnings.push({
            type: 'non_standard_variant',
            message: `非标准变体: ${invalidVariants.join(', ')}`,
            suggestion: `考虑使用标准变体: ${validVariants.join(', ')}`,
            severity: 'warning'
          })
        }
      }
    }
  }
}
```

### 2. 组件接口生成器

```typescript
// 组件接口生成器
class ComponentInterfaceGenerator {
  generateComponentInterface(config: ComponentConfig): GeneratedInterface {
    const interfaceConfig = this.buildInterfaceConfig(config)

    return {
      interfaceDefinition: this.generateInterfaceCode(interfaceConfig),
      variantDefinition: this.generateVariantCode(interfaceConfig),
      typeDefinition: this.generateTypeCode(interfaceConfig),
      testProps: this.generateTestProps(interfaceConfig),
      accessibilityProps: this.generateAccessibilityProps(interfaceConfig),
      usageExamples: this.generateUsageExamples(interfaceConfig),
      migrationGuide: this.generateMigrationGuide(interfaceConfig)
    }
  }

  private generateInterfaceCode(config: InterfaceConfig): string {
    const imports = this.generateImports(config)
    const baseInterface = this.generateBaseInterface(config)
    const propsInterface = this.generatePropsInterface(config)
    const componentDefinition = this.generateComponentDefinition(config)

    return `${imports}

${baseInterface}

${propsInterface}

${componentDefinition}`
  }

  private generateBaseInterface(config: InterfaceConfig): string {
    const baseType = this.getBaseType(config.type, config.htmlElement)

    return `export interface ${config.name}Props
  extends ${baseType}${config.extends ? ', ' + config.extends : ''} {
  // 组件特定属性
  ${config.props.map(prop => this.generatePropDefinition(prop)).join('\n  ')}
}`
  }
}
```

### 3. API 一致性检查器

```typescript
// API 一致性检查器
class APIConsistencyChecker {
  checkConsistency(components: ComponentDefinition[]): ConsistencyReport {
    const report: ConsistencyReport = {
      overallScore: 0,
      inconsistencies: [],
      recommendations: [],
      componentScores: {}
    }

    // 检查尺寸系统一致性
    const sizeConsistency = this.checkSizeConsistency(components)
    report.inconsistencies.push(...sizeConsistency.inconsistencies)

    // 检查变体系统一致性
    const variantConsistency = this.checkVariantConsistency(components)
    report.inconsistencies.push(...variantConsistency.inconsistencies)

    // 检查事件处理器一致性
    const eventConsistency = this.checkEventConsistency(components)
    report.inconsistencies.push(...eventConsistency.inconsistencies)

    // 检查可访问性一致性
    const accessibilityConsistency = this.checkAccessibilityConsistency(components)
    report.inconsistencies.push(...accessibilityConsistency.inconsistencies)

    return report
  }

  private checkSizeConsistency(components: ComponentDefinition[]): ConsistencyCheck {
    const check: ConsistencyCheck = {
      type: 'size_consistency',
      inconsistencies: [],
      scores: {}
    }

    // 标准尺寸
    const standardSizes = ['xs', 'sm', 'md', 'lg', 'xl']

    components.forEach(component => {
      let componentScore = 100
      const componentSizes = this.getComponentSizes(component)

      // 检查是否使用了标准尺寸
      const nonStandardSizes = componentSizes.filter(size => !standardSizes.includes(size))
      if (nonStandardSizes.length > 0) {
        check.inconsistencies.push({
          component: component.name,
          type: 'non_standard_sizes',
          message: `使用了非标准尺寸: ${nonStandardSizes.join(', ')}`,
          severity: 'warning',
          suggestion: `使用标准尺寸: ${standardSizes.join(', ')}`
        })
        componentScore -= nonStandardSizes.length * 10
      }

      check.scores[component.name] = Math.max(0, componentScore)
    })

    return check
  }
}
```

### 4. API 迁移助手

```typescript
// API 迁移助手
class APIMigrationHelper {
  generateMigrationPlan(oldAPI: ComponentDefinition, newAPI: ComponentDefinition): MigrationPlan {
    return {
      breakingChanges: this.identifyBreakingChanges(oldAPI, newAPI),
      migrationSteps: this.generateMigrationSteps(oldAPI, newAPI),
      codeMapping: this.generateCodeMapping(oldAPI, newAPI),
      compatibilityLayer: this.generateCompatibilityLayer(oldAPI, newAPI),
      timeline: this.estimateMigrationTimeline(oldAPI, newAPI),
      risks: this.identifyMigrationRisks(oldAPI, newAPI)
    }
  }

  private identifyBreakingChanges(oldAPI: ComponentDefinition, newAPI: ComponentDefinition): BreakingChange[] {
    const changes: BreakingChange[] = []

    // 检查Props变更
    const oldProps = new Set(oldAPI.props?.map(p => p.name) || [])
    const newProps = new Set(newAPI.props?.map(p => p.name) || [])

    // 被移除的Props
    const removedProps = [...oldProps].filter(prop => !newProps.has(prop))
    removedProps.forEach(prop => {
      changes.push({
        type: 'prop_removed',
        prop,
        description: `属性 ${prop} 已被移除`,
        impact: 'breaking',
        migration: this.getPropMigration(prop, oldAPI, newAPI)
      })
    })

    return changes
  }
}
```

## 🚀 增强使用方法

### API 合规性检查

```bash
# 验证组件接口
"验证 Button 组件的 API 接口是否符合设计规范"

# 检查组件实现
"检查 Card 组件的实现是否遵循标准模式"

# 批量验证
"验证 primitives/ 目录下所有组件的 API 设计合规性"
```

### 组件创建与接口生成

```bash
# 创建新组件
"创建新的 Badge 组件，遵循完整的 API 设计规范"

# 生成组件接口
"为新的 Toast 组件生成符合标准的 API 接口"

# 扩展组件
"为 Input 组件添加密码切换功能"
```

### 一致性与迁移

```bash
# 检查一致性
"检查所有组件的 API 一致性，识别不一致的地方"

# 生成迁移计划
"为现有组件生成从旧 API 到新标准的迁移计划"

# API 迁移
"将现有 Button 组件迁移到新的 API 标准"
```

## 📊 增强验证报告格式

```
🔧 组件 API 设计约束验证报告
📦 组件: Button
📅 时间: 2025-01-XX

✅ 接口验证通过
- ✅ 继承 HTMLButtonElement 属性
- ✅ 实现 CVA 变体系统
- ✅ 包含必需的 Props 接口
- ✅ 文件命名遵循 kebab-case 规范
- ✅ API 设计符合标准规范

✅ 一致性检查通过
- ✅ 尺寸系统与组件库保持一致
- ✅ 变体命名符合标准规范
- ✅ 事件处理器命名规范正确

⚠️ 警告 (1)
- ⚠️ 建议添加键盘导航支持

❌ 错误 (0)

🛠️ 改进建议:
1. 添加 onKeyDown 事件处理
2. 完善可访问性支持

📊 合规性评分: 95/100
🎯 API 设计质量: 优秀
📝 文件命名规范: ✅ 符合 kebab-case 标准
🔗 API 一致性: ✅ 与组件库保持一致
```

## 📋 API 设计标准总结

### 基础Props 标准
- **StandardSizes**: xs | sm | md | lg | xl
- **StandardVariants**: primary | secondary | success | warning | danger | neutral
- **StandardStates**: disabled | loading | error | required
- **StyleExtensions**: className | style | testId | data-testid

### 接口继承层次
```
BaseComponentProps (基础组件)
├─ InteractiveComponentProps (交互组件)
├─ FormComponentProps (表单组件)
└─ CompositeComponentProps (复合组件)
```

### 命名规范
- **布尔值**: is/has/should 前缀
- **事件处理器**: on + 驼峰命名
- **测试属性**: testId, data-testid
- **可访问性**: aria-* 前缀

基于 Xorigo UI v1.4 SSOT，确保所有组件 API 设计的一致性、可维护性和用户体验，同时提供完整的API验证、生成和迁移支持。
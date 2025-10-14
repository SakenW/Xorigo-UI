/**
 * add 命令实现 - 组件脚手架生成
 *
 * 功能：
 * - 生成组件 TypeScript 文件
 * - 生成组件测试文件
 * - 生成组件文档文件
 * - 自动添加导出语句
 */

import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'

export interface AddCommandOptions {
  template: 'standard' | 'compound' | 'form' | 'layout' | 'navigation' | 'overlay'
  category?: string
  path?: string
  hasVariants?: boolean
  hasCompound?: boolean
}

// 符合v1.1标准的组件模板
const componentTemplates = {
  // 标准组件模板 - 遵循新的API设计标准
  standard: (name: string) => `import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

// CVA变体配置 - 遵循统一标准
const ${name.toLowerCase()}Variants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      // 统一5级尺寸系统
      size: {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-2.5",
        xl: "text-xl px-6 py-3",
      },
      // 统一6种语义化变体
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        neutral: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      },
      // 标准状态控制
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
      },
      loading: {
        true: "opacity-75 cursor-wait",
      },
      error: {
        true: "border-red-500 focus:ring-red-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  }
)

// 标准Props接口 - 遵循API设计标准
export interface ${name}Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
            VariantProps<typeof ${name.toLowerCase()}Variants>,
            StandardStates,
            StyleExtensions {
  /**
   * 加载状态
   * @default false
   */
  loading?: boolean
  /**
   * 左侧图标
   */
  leftIcon?: React.ReactNode
  /**
   * 右侧图标
   */
  rightIcon?: React.ReactNode
}

// 标准基础Props类型
interface StandardStates {
  disabled?: boolean
  loading?: boolean
  error?: boolean
  required?: boolean
}

interface StyleExtensions {
  className?: string
  style?: React.CSSProperties
  testId?: string
  'data-testid'?: string
  'data-component'?: string
}

/**
 * ${name} 组件
 *
 * 遵循Xorigo UI v1.1 API设计标准
 *
 * @example
 * \`\`\`tsx
 * <${name} variant="primary" size="md" loading={false}>
 *   点击我
 * </${name}>
 * \`\`\`
 */
export const ${name} = React.forwardRef<HTMLButtonElement, ${name}Props>(
  ({
    size,
    variant,
    disabled = false,
    loading = false,
    error = false,
    leftIcon,
    rightIcon,
    className,
    testId,
    children,
    ...props
  }, ref) => {
    // 生成测试Props
    const testProps = {
      'data-testid': testId || '${name.toLowerCase()}-test-id',
      'data-component': '${name.toLowerCase()}',
      'data-variant': variant,
      'data-size': size,
      'data-state': disabled ? 'disabled' : loading ? 'loading' : error ? 'error' : 'normal',
    }

    return (
      <button
        ref={ref}
        className={cn(
          ${name.toLowerCase()}Variants({
            size,
            variant,
            disabled,
            loading,
            error
          }),
          className
        )}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...testProps}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {leftIcon && <span className="mr-2">{leftIcon}</span>}

        {children}

        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

${name}.displayName = '${name}'

export { ${name.toLowerCase()}Variants }
export type ${name}Variants = VariantProps<typeof ${name.toLowerCase()}Variants>

/**
 * ${name} 组件
 *
 * @example
 * \`\`\`tsx
 * <${name} size="md" variant="primary">
 *   内容
 * </${name}>
 * \`\`\`
 */
export const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  ({ size = 'md', variant = 'default', disabled = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          '${name.toLowerCase()}',
          // Size classes
          {
            'text-sm px-3 py-1.5': size === 'sm',
            'text-base px-4 py-2': size === 'md',
            'text-lg px-6 py-3': size === 'lg',
          },
          // Variant classes
          {
            'bg-gray-100 text-gray-900': variant === 'default',
            'bg-primary-500 text-white': variant === 'primary',
            'bg-secondary-500 text-white': variant === 'secondary',
          },
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    )
  }
)

${name}.displayName = '${name}'

export default ${name}
`,

  // 复合组件模板 - 支持子组件模式
  compound: (name: string) => `import React, { createContext, useContext } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

// 复合组件上下文
interface ${name}ContextValue {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
  disabled?: boolean
}

const ${name}Context = createContext<${name}ContextValue>({})

// 使用复合组件上下文的Hook
export const use${name} = () => {
  const context = useContext(${name}Context)
  if (!context) {
    throw new Error('use${name} must be used within ${name} provider')
  }
  return context
}

// CVA变体配置
const ${name.toLowerCase()}Variants = cva(
  "rounded-lg border bg-white shadow-sm",
  {
    variants: {
      size: {
        xs: "p-2 text-xs",
        sm: "p-3 text-sm",
        md: "p-4 text-base",
        lg: "p-6 text-lg",
        xl: "p-8 text-xl",
      },
      variant: {
        primary: "border-primary-200 bg-primary-50",
        secondary: "border-gray-200 bg-gray-50",
        success: "border-green-200 bg-green-50",
        warning: "border-yellow-200 bg-yellow-50",
        danger: "border-red-200 bg-red-50",
        neutral: "border-gray-200 bg-white",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "neutral",
    },
  }
)

// 根组件Props
export interface ${name}Props
  extends React.HTMLAttributes<HTMLDivElement>,
            VariantProps<typeof ${name.toLowerCase()}Variants> {
  children: React.ReactNode
}

// 标题组件Props
export interface ${name}HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
}

// 内容组件Props
export interface ${name}BodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

// 底部组件Props
export interface ${name}FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * ${name} 复合组件根容器
 */
export const ${name}Root = React.forwardRef<HTMLDivElement, ${name}Props>(
  ({ children, size = 'md', variant = 'neutral', disabled = false, className, ...props }, ref) => {
    return (
      <${name}Context.Provider value={{ size, variant, disabled }}>
        <div
          ref={ref}
          className={cn(${name.toLowerCase()}Variants({ size, variant, disabled }), className)}
          data-component="${name.toLowerCase()}"
          data-variant={variant}
          data-size={size}
          data-state={disabled ? 'disabled' : 'normal'}
          {...props}
        >
          {children}
        </div>
      </${name}Context.Provider>
    )
  }
)

${name}Root.displayName = '${name}Root'

/**
 * ${name} 标题组件
 */
export const ${name}Header = React.forwardRef<HTMLDivElement, ${name}HeaderProps>(
  ({ title, subtitle, className, ...props }, ref) => {
    const { size } = use${name}()

    return (
      <div
        ref={ref}
        className={cn(
          "border-b border-gray-200 pb-4 mb-4",
          {
            "pb-2 mb-2": size === 'xs' || size === 'sm',
            "pb-6 mb-6": size === 'lg' || size === 'xl',
          },
          className
        )}
        {...props}
      >
        {title && (
          <h3 className={cn(
            "font-semibold text-gray-900",
            {
              "text-sm": size === 'xs',
              "text-base": size === 'sm',
              "text-lg": size === 'md',
              "text-xl": size === 'lg',
              "text-2xl": size === 'xl',
            }
          )}>
            {title}
          </h3>
        )}
        {subtitle && (
          <p className={cn(
            "text-gray-600 mt-1",
            {
              "text-xs": size === 'xs' || size === 'sm',
              "text-sm": size === 'md',
              "text-base": size === 'lg',
              "text-lg": size === 'xl',
            }
          )}>
            {subtitle}
          </p>
        )}
      </div>
    )
  }
)

${name}Header.displayName = '${name}Header'

/**
 * ${name} 内容组件
 */
export const ${name}Body = React.forwardRef<HTMLDivElement, ${name}BodyProps>(
  ({ children, className, ...props }, ref) => {
    const { size } = use${name}()

    return (
      <div
        ref={ref}
        className={cn(
          "text-gray-700",
          {
            "text-sm": size === 'xs' || size === 'sm',
            "text-base": size === 'md',
            "text-lg": size === 'lg',
            "text-xl": size === 'xl',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

${name}Body.displayName = '${name}Body'

/**
 * ${name} 底部组件
 */
export const ${name}Footer = React.forwardRef<HTMLDivElement, ${name}FooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-t border-gray-200 pt-4 mt-4 flex gap-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

${name}Footer.displayName = '${name}Footer'

// 复合组件类型定义
export interface ${name}Compound {
  Root: typeof ${name}Root
  Header: typeof ${name}Header
  Body: typeof ${name}Body
  Footer: typeof ${name}Footer
}

/**
 * ${name} 复合组件
 *
 * @example
 * \`\`\`tsx
 * <${name} variant="primary" size="md">
 *   <${name}.Header title="标题" subtitle="副标题" />
 *   <${name}.Body>
 *     内容区域
 *   </${name}.Body>
 *   <${name}.Footer>
 *     <button>操作按钮</button>
 *   </${name}.Footer>
 * </${name}>
 * \`\`\`
 */
export const ${name}: ${name}Compound = {
  Root: ${name}Root,
  Header: ${name}Header,
  Body: ${name}Body,
  Footer: ${name}Footer,
}

export { ${name.toLowerCase()}Variants }
export type ${name}Variants = VariantProps<typeof ${name.toLowerCase()}Variants>
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 组件尺寸
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 组件变体
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'secondary'
  /**
   * 是否显示
   * @default true
   */
  visible?: boolean
  /**
   * 动画配置
   */
  animation?: {
    duration?: number
    delay?: number
  }
  /**
   * 关闭回调
   */
  onClose?: () => void
}

/**
 * ${name} 高级组件
 *
 * @example
 * \`\`\`tsx
 * <${name}
 *   size="md"
 *   variant="primary"
 *   visible={isVisible}
 *   animation={{ duration: 0.3 }}
 *   onClose={() => setIsVisible(false)}
 * >
 *   内容
 * </${name}>
 * \`\`\`
 */
export const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  (
    {
      size = 'md',
      variant = 'default',
      visible = true,
      animation = {},
      onClose,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { duration = 0.2, delay = 0 } = animation

    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration, delay }}
            className={cn(
              '${name.toLowerCase()}',
              // Size classes
              {
                'text-sm px-3 py-1.5': size === 'sm',
                'text-base px-4 py-2': size === 'md',
                'text-lg px-6 py-3': size === 'lg',
              },
              // Variant classes
              {
                'bg-gray-100 text-gray-900': variant === 'default',
                'bg-primary-500 text-white': variant === 'primary',
                'bg-secondary-500 text-white': variant === 'secondary',
              },
              className
            )}
            {...props}
          >
            {children}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="关闭"
              >
                ×
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

${name}.displayName = '${name}'

export default ${name}
`,

  form: (name: string) => `import React from 'react'
import { cn } from '../../utils/cn'

export interface ${name}Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 输入框尺寸
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 输入框变体
   * @default 'default'
   */
  variant?: 'default' | 'filled' | 'outlined'
  /**
   * 是否显示错误状态
   * @default false
   */
  error?: boolean
  /**
   * 错误信息
   */
  errorMessage?: string
  /**
   * 标签文本
   */
  label?: string
  /**
   * 帮助文本
   */
  helperText?: string
}

/**
 * ${name} 表单组件
 *
 * @example
 * \`\`\`tsx
 * <${name}
 *   label="用户名"
 *   placeholder="请输入用户名"
 *   error={!!errors.username}
 *   errorMessage={errors.username}
 *   helperText="用户名长度 3-20 个字符"
 * />
 * \`\`\`
 */
export const ${name} = React.forwardRef<HTMLInputElement, ${name}Props>(
  (
    {
      size = 'md',
      variant = 'default',
      error = false,
      errorMessage,
      label,
      helperText,
      className,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId()

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block mb-2 font-medium',
              error ? 'text-red-600' : 'text-gray-700 dark:text-gray-200'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-md transition-colors',
            // Size classes
            {
              'text-sm px-3 py-1.5': size === 'sm',
              'text-base px-4 py-2': size === 'md',
              'text-lg px-5 py-3': size === 'lg',
            },
            // Variant classes
            {
              'bg-white border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200':
                variant === 'default',
              'bg-gray-100 border-0 focus:bg-gray-200': variant === 'filled',
              'bg-transparent border-2 border-gray-300 focus:border-primary-500':
                variant === 'outlined',
            },
            // Error state
            error &&
              'border-red-500 focus:border-red-500 focus:ring-red-200',
            // Disabled state
            props.disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          aria-invalid={error}
          aria-describedby={
            errorMessage ? \`\${inputId}-error\` : helperText ? \`\${inputId}-helper\` : undefined
          }
          {...props}
        />

        {errorMessage && (
          <p id={\`\${inputId}-error\`} className="mt-1 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {!errorMessage && helperText && (
          <p id={\`\${inputId}-helper\`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

${name}.displayName = '${name}'

export default ${name}
`,
}

// 测试文件模板
const testTemplate = (name: string) => `import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ${name} } from '../${name}'

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name}>测试内容</${name}>)
    expect(screen.getByText('测试内容')).toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    const { container } = render(<${name} size="lg">内容</${name}>)
    const element = container.firstChild
    expect(element).toHaveClass('text-lg')
  })

  it('applies variant classes correctly', () => {
    const { container } = render(<${name} variant="primary">内容</${name}>)
    const element = container.firstChild
    expect(element).toHaveClass('bg-primary-500')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<${name} ref={ref}>内容</${name}>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
`

// 文档模板
const docTemplate = (name: string) => `# ${name}

## 概述

${name} 组件提供 [组件功能描述]。

## 使用示例

### 基础用法

\`\`\`tsx
import { ${name} } from '@xorigo-ui/core'

export function Example() {
  return (
    <${name}>
      内容
    </${name}>
  )
}
\`\`\`

### 不同尺寸

\`\`\`tsx
<${name} size="sm">小尺寸</${name}>
<${name} size="md">中尺寸</${name}>
<${name} size="lg">大尺寸</${name}>
\`\`\`

### 不同变体

\`\`\`tsx
<${name} variant="default">默认变体</${name}>
<${name} variant="primary">主要变体</${name}>
<${name} variant="secondary">次要变体</${name}>
\`\`\`

## API

### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| size | 'sm' \\| 'md' \\| 'lg' | 'md' | 组件尺寸 |
| variant | 'default' \\| 'primary' \\| 'secondary' | 'default' | 组件变体 |
| className | string | - | 自定义类名 |
| children | ReactNode | - | 子元素 |

## 可访问性

- 支持键盘导航
- 支持屏幕阅读器
- 遵循 ARIA 规范

## 主题定制

组件样式可通过 Tailwind CSS 类名进行定制。

## 相关组件

- [相关组件1]
- [相关组件2]
`

/**
 * 执行 add 命令
 */
export async function executeAddCommand(
  componentName: string,
  options: AddCommandOptions
): Promise<void> {
  const spinner = ora('生成组件脚手架...').start()

  try {
    // 验证组件名称
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
      throw new Error('组件名称必须以大写字母开头，且仅包含字母和数字')
    }

    // 确定组件路径
    const category = options.category || 'base'
    const basePath = options.path || path.join(process.cwd(), 'packages/core/src')
    const componentDir = path.join(basePath, category)
    const componentFile = path.join(componentDir, `${componentName}.tsx`)
    const testDir = path.join(process.cwd(), 'tests/components', category)
    const testFile = path.join(testDir, `${componentName}.test.tsx`)
    const docDir = path.join(process.cwd(), 'docs/components', category)
    const docFile = path.join(docDir, `${componentName}.md`)

    // 检查组件是否已存在
    try {
      await fs.access(componentFile)
      throw new Error(`组件 ${componentName} 已存在于 ${componentFile}`)
    } catch (error) {
      // 文件不存在，继续创建
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }

    // 创建目录
    await fs.mkdir(componentDir, { recursive: true })
    await fs.mkdir(testDir, { recursive: true })
    await fs.mkdir(docDir, { recursive: true })

    spinner.text = '生成组件文件...'

    // 生成组件文件
    const template = componentTemplates[options.template]
    const componentContent = template(componentName)
    await fs.writeFile(componentFile, componentContent, 'utf-8')

    spinner.text = '生成测试文件...'

    // 生成测试文件
    const testContent = testTemplate(componentName)
    await fs.writeFile(testFile, testContent, 'utf-8')

    spinner.text = '生成文档文件...'

    // 生成文档文件
    const docContent = docTemplate(componentName)
    await fs.writeFile(docFile, docContent, 'utf-8')

    spinner.text = '更新导出文件...'

    // 更新 index.ts 导出
    const indexPath = path.join(basePath, 'index.ts')
    try {
      let indexContent = await fs.readFile(indexPath, 'utf-8')
      const exportStatement = `export * from './${category}/${componentName}'\n`

      // 检查是否已存在导出
      if (!indexContent.includes(exportStatement)) {
        // 按类别分组添加导出
        const categoryComment = `// ${category.charAt(0).toUpperCase() + category.slice(1)} components\n`
        if (indexContent.includes(categoryComment)) {
          // 在已有分类注释后添加
          indexContent = indexContent.replace(
            categoryComment,
            `${categoryComment}${exportStatement}`
          )
        } else {
          // 创建新的分类注释
          indexContent += `\n${categoryComment}${exportStatement}`
        }
        await fs.writeFile(indexPath, indexContent, 'utf-8')
      }
    } catch (error) {
      // index.ts 不存在，创建新文件
      const exportStatement = `// ${category.charAt(0).toUpperCase() + category.slice(1)} components\nexport * from './${category}/${componentName}'\n`
      await fs.writeFile(indexPath, exportStatement, 'utf-8')
    }

    spinner.succeed(chalk.green(`✨ 组件 ${chalk.bold(componentName)} 生成成功！`))

    // 输出文件路径
    console.log(chalk.gray('\n生成的文件：'))
    console.log(chalk.cyan(`  📄 组件: ${componentFile}`))
    console.log(chalk.cyan(`  🧪 测试: ${testFile}`))
    console.log(chalk.cyan(`  📚 文档: ${docFile}`))

    console.log(chalk.gray('\n下一步：'))
    console.log(chalk.yellow(`  1. 编辑组件实现: ${componentFile}`))
    console.log(chalk.yellow(`  2. 完善测试用例: ${testFile}`))
    console.log(chalk.yellow(`  3. 完善组件文档: ${docFile}`))
  } catch (error) {
    spinner.fail(chalk.red('组件生成失败'))
    throw error
  }
}

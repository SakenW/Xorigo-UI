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
  template: 'basic' | 'advanced' | 'form'
  category?: string
  path?: string
}

// 组件模板
const componentTemplates = {
  basic: (name: string) => `import React from 'react'
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
   * 是否禁用
   * @default false
   */
  disabled?: boolean
}

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

  advanced: (name: string) => `import React from 'react'
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

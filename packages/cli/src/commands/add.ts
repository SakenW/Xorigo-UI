import { Command } from 'commander'
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

// 组件模板生成函数
const createStandardTemplate = (name: string): string => {
  return `import React from 'react'
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
            VariantProps<typeof ${name.toLowerCase()}Variants> {
  /**
   * 组件内容
   */
  children?: React.ReactNode

  /**
   * 加载状态
   */
  isLoading?: boolean

  /**
   * 自定义类名
   */
  className?: string
}

/**
 * ${name} 组件 - 符合v1.1 API设计标准
 *
 * @param props - 组件属性
 * @returns JSX元素
 */
export const ${name} = React.forwardRef<HTMLButtonElement, ${name}Props>(
  ({
    children,
    className,
    disabled = false,
    isLoading = false,
    size,
    variant,
    ...props
  }, ref) => {
    // 状态映射
    const isDisabled = disabled || isLoading

    return (
      <button
        className={cn(
          ${name.toLowerCase()}Variants({
            size,
            variant,
            disabled: isDisabled,
            loading: isLoading
          }),
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center">
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
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

${name}.displayName = '${name}'

export default ${name}
`
}

// 测试模板
const testTemplate = (name: string): string => {
  return `import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ${name} } from '../${name}'

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name}>Test Button</${name}>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<${name} onClick={handleClick}>Click me</${name}>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles correctly', () => {
    render(<${name} variant="primary">Primary Button</${name}>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary-600')
  })

  it('handles disabled state', () => {
    render(<${name} disabled>Disabled Button</${name}>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50')
  })

  it('supports custom className', () => {
    render(<${name} className="custom-class">Custom Button</${name}>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('is accessible', () => {
    render(<${name} aria-label="Custom action">Action</${name}>)
    const button = screen.getByLabelText('Custom action')
    expect(button).toBeInTheDocument()
  })
})`
}

// 符合v1.1标准的组件模板
const componentTemplates: Record<string, (name: string) => string> = {
  standard: createStandardTemplate,
  compound: (name: string) => `// TODO: Implement compound template for ${name}`,
  form: (name: string) => `// TODO: Implement form template for ${name}`,
  layout: (name: string) => `// TODO: Implement layout template for ${name}`,
  navigation: (name: string) => `// TODO: Implement navigation template for ${name}`,
  overlay: (name: string) => `// TODO: Implement overlay template for ${name}`,
}

/**
 * 添加组件命令
 */
export const addCommand = new Command('add')
  .description('添加新组件到项目中')
  .argument('<name>', '组件名称')
  .option('-t, --template <type>', '组件模板类型', 'standard')
  .option('-c, --category <category>', '组件分类', 'base')
  .option('-p, --path <path>', '组件路径')
  .option('--has-variants', '是否包含变体')
  .option('--has-compound', '是否为复合组件')
  .action(async (name: string, options: AddCommandOptions) => {
    const spinner = ora('正在创建组件...').start()

    try {
      // 验证组件名称
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
        throw new Error('组件名称必须以大写字母开头，只能包含字母和数字')
      }

      // 验证模板类型
      if (!componentTemplates[options.template]) {
        throw new Error(`未知的模板类型: ${options.template}`)
      }

      // 确定组件路径
      const category = options.category || 'base'
      const basePath = options.path || path.join(process.cwd(), 'packages/core/src')
      const componentDir = path.join(basePath, category)
      const componentFile = path.join(componentDir, `${name}.tsx`)
      const testDir = path.join(process.cwd(), 'tests/components', category)
      const testFile = path.join(testDir, `${name}.test.tsx`)
      const docDir = path.join(process.cwd(), 'docs/components', category)
      const docFile = path.join(docDir, `${name}.md`)

      // 检查组件是否已存在
      try {
        await fs.access(componentFile)
        throw new Error(`组件 ${name} 已存在于 ${componentFile}`)
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
      if (!template) {
        throw new Error(`未知的组件模板: ${options.template}`)
      }
      const componentContent = template(name)
      await fs.writeFile(componentFile, componentContent, 'utf-8')

      spinner.text = '生成测试文件...'

      // 生成测试文件
      const testContent = testTemplate(name)
      await fs.writeFile(testFile, testContent, 'utf-8')

      spinner.text = '生成文档文件...'

      // 生成文档文件
      const docContent = generateComponentDoc(name, options)
      await fs.writeFile(docFile, docContent, 'utf-8')

      spinner.succeed(chalk.green(`✅ 组件 ${name} 创建成功！`))

      // 显示创建的文件
      console.log(chalk.blue('📁 创建的文件:'))
      console.log(chalk.gray(`  📄 组件: ${componentFile}`))
      console.log(chalk.gray(`  🧪 测试: ${testFile}`))
      console.log(chalk.gray(`  📚 文档: ${docFile}`))

    } catch (error) {
      spinner.fail(chalk.red('❌ 创建组件失败'))
      console.error(chalk.red('错误:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })

/**
 * 生成组件文档
 */
function generateComponentDoc(name: string, options: AddCommandOptions): string {
  return `# ${name}

## 描述

${name} 组件符合 Xorigo UI v1.1 API 设计标准，提供统一的开发体验。

## API

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| className | string | - | 自定义类名 |
| children | ReactNode | - | 子元素 |
| variant | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'primary' | 组件变体 |
| size | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'md' | 组件尺寸 |
| disabled | boolean | false | 是否禁用 |
| loading | boolean | false | 是否加载中 |

### 示例

\`\`\`tsx
import { ${name} } from '@xorigo-ui/core'

function Example() {
  return (
    <${name} variant="primary" size="md">
      Click me
    </${name}>
  )
}
\`\`\`

## 可访问性

- 支持键盘导航
- 提供适当的 ARIA 属性
- 支持屏幕阅读器

## 设计令牌

使用统一的设计令牌确保视觉一致性：

- 颜色: 使用 \`primary-*\` 令牌
- 间距: 使用标准间距系统
- 字体: 使用标准字体大小系统
`
}
import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { CopyButton } from '../ui/CopyButton'

/**
 * CodeBlock 组件变体配置
 */
const codeBlockVariants = cva(
  // 基础样式 - 使用主题令牌，优化视觉效果
  'relative rounded-xl overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-secondary)] border border-[var(--border-secondary)]',
        ghost: 'bg-transparent border border-[var(--border-tertiary)]',
        filled: 'bg-[var(--bg-contrast-low)] border border-[var(--border-primary)] shadow-md',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface CodeBlockProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof codeBlockVariants> {
  /** 代码内容 */
  code: string
  /** 编程语言 */
  language?: string
  /** 是否显示行号 */
  showLineNumbers?: boolean
  /** 是否可复制 */
  copyable?: boolean
  /** 自定义复制按钮文本 */
  copyText?: string
  /** 代码块标题 */
  title?: string
  /** 高亮的行号（如：[1, 3, 5-7]） */
  highlightLines?: (number | string)[]
  /** 最大高度（超出滚动） */
  maxHeight?: number | string
}

/**
 * CodeBlock - 代码块展示组件
 *
 * 功能特性：
 * - 语法高亮显示（使用简单的正则高亮，可扩展为shiki）
 * - 行号显示
 * - 代码复制功能
 * - 行高亮
 * - 滚动容器支持
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code={`<Button variant="primary">Click me</Button>`}
 *   language="tsx"
 *   copyable
 * />
 * ```
 */
export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      className,
      variant,
      size,
      code,
      language = 'text',
      showLineNumbers = false,
      copyable = true,
      copyText = '复制代码',
      title,
      highlightLines = [],
      maxHeight,
      ...props
    },
    ref
  ) => {
    /**
     * 将代码分割成行
     */
    const codeLines = code.split('\n')

    /**
     * 检查某行是否应该高亮
     */
    const isLineHighlighted = (lineNumber: number): boolean => {
      return highlightLines.some((range) => {
        if (typeof range === 'number') {
          return range === lineNumber
        }
        // 支持范围格式 "1-5"
        const [start, end] = range.toString().split('-').map(Number)
        return lineNumber >= start && lineNumber <= end
      })
    }

    /**
     * 简单的语法高亮（基于正则）
     * 可以后续扩展为使用 shiki 或 prism-react-renderer
     */
    const highlightSyntax = (text: string): React.ReactNode => {
      // 基础的 JSX/TSX 高亮规则
      if (language === 'tsx' || language === 'jsx' || language === 'typescript' || language === 'javascript') {
        // 这里只做简单示例，实际项目中应该使用 shiki
        return (
          <span
            dangerouslySetInnerHTML={{
              __html: text
                .replace(/(&lt;[^&]*&gt;)/g, '<span class="text-[var(--text-info)]">$1</span>') // JSX标签
                .replace(/(&quot;[^&]*&quot;)/g, '<span class="text-[var(--text-success)]">$1</span>') // 字符串
                .replace(/\b(const|let|var|function|return|import|export|from|default)\b/g, '<span class="text-[var(--text-warning)]">$1</span>') // 关键字
            }}
          />
        )
      }

      // 默认无高亮
      return <span>{text}</span>
    }

    /**
     * HTML 转义
     */
    const escapeHtml = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    return (
      <div
        ref={ref}
        className={cn(codeBlockVariants({ variant, size }), className)}
        {...props}
      >
        {/* 标题栏 - 优化渐变背景和视觉效果 */}
        {(title || copyable) && (
          <div className="relative flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border-b border-[var(--border-secondary)] backdrop-blur-sm">
            {/* 装饰性光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary-action)]/5 to-transparent opacity-50" />

            {/* 标题 */}
            {title && (
              <div className="relative flex items-center gap-2 z-10">
                <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
                {language && (
                  <span className="text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-md border border-[var(--border-tertiary)] shadow-sm">
                    {language}
                  </span>
                )}
              </div>
            )}

            {/* 复制按钮 */}
            {copyable && (
              <CopyButton
                text={code}
                variant="ghost"
                size="sm"
                defaultText={copyText}
                className="ml-auto relative z-10"
              />
            )}
          </div>
        )}

        {/* 代码内容 - 优化背景和滚动条 */}
        <div
          className="overflow-auto scrollbar-thin scrollbar-track-[var(--bg-secondary)] scrollbar-thumb-[var(--border-primary)] hover:scrollbar-thumb-[var(--border-secondary)]"
          style={{
            maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
          }}
        >
          <pre className="p-5 m-0 font-mono text-sm leading-relaxed bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
            <code className={`language-${language}`}>
              {codeLines.map((line, index) => {
                const lineNumber = index + 1
                const isHighlighted = isLineHighlighted(lineNumber)

                return (
                  <div
                    key={lineNumber}
                    className={cn(
                      'block px-2 py-0.5 -mx-2 rounded transition-colors duration-150',
                      isHighlighted && 'bg-[var(--bg-warning)]/20 border-l-2 border-[var(--border-warning)] pl-3'
                    )}
                  >
                    {/* 行号 */}
                    {showLineNumbers && (
                      <span className="inline-block w-10 text-right mr-4 text-[var(--text-tertiary)] select-none font-medium">
                        {lineNumber}
                      </span>
                    )}

                    {/* 代码内容 - 优化颜色对比 */}
                    <span className="text-[var(--text-primary)]">
                      {highlightSyntax(escapeHtml(line))}
                    </span>
                  </div>
                )
              })}
            </code>
          </pre>
        </div>
      </div>
    )
  }
)

CodeBlock.displayName = 'CodeBlock'

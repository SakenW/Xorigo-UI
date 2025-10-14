import React, { forwardRef, useState, useCallback } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// Code变体配置
const codeVariants = cva(
  'font-mono',
  {
    variants: {
      variant: {
        inline: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 rounded text-sm',
        block: 'block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto',
        multiline: 'block bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      language: {
        javascript: 'language-javascript',
        typescript: 'language-typescript',
        html: 'language-html',
        css: 'language-css',
        json: 'language-json',
        bash: 'language-bash',
        python: 'language-python',
        sql: 'language-sql',
      },
      theme: {
        light: 'bg-gray-50 text-gray-900 border border-gray-200',
        dark: 'bg-gray-900 text-gray-100 border border-gray-700',
        auto: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
      },
    },
    defaultVariants: {
      variant: 'inline',
      size: 'sm',
      language: 'javascript',
      theme: 'auto',
    },
  }
)

// 复制按钮样式
const copyButtonVariants = cva(
  'absolute top-2 right-2 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors',
  {
    variants: {
      variant: {
        default: 'opacity-0 group-hover:opacity-100',
        always: 'opacity-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// 行号样式
const lineNumbersVariants = cva(
  'select-none text-right border-r border-gray-700 pr-3 mr-3 text-gray-500',
  {
    variants: {
      size: {
        sm: 'text-xs leading-5',
        md: 'text-sm leading-6',
        lg: 'text-base leading-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

// 语言标识样式
const languageBadgeVariants = cva(
  'absolute top-2 left-2 px-2 py-1 text-xs rounded-md font-medium',
  {
    variants: {
      theme: {
        light: 'bg-gray-100 text-gray-700',
        dark: 'bg-gray-800 text-gray-300',
        auto: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      },
    },
    defaultVariants: {
      theme: 'auto',
    },
  }
)

// 语法高亮映射（简化版本）
const syntaxHighlightMap: Record<string, Record<string, string>> = {
  javascript: {
    keyword: 'text-purple-400',
    string: 'text-green-400',
    comment: 'text-gray-500 italic',
    function: 'text-blue-400',
    number: 'text-yellow-400',
    operator: 'text-pink-400',
  },
  typescript: {
    keyword: 'text-purple-400',
    string: 'text-green-400',
    comment: 'text-gray-500 italic',
    function: 'text-blue-400',
    number: 'text-yellow-400',
    operator: 'text-pink-400',
    type: 'text-cyan-400',
  },
  html: {
    tag: 'text-purple-400',
    attribute: 'text-blue-400',
    value: 'text-green-400',
    comment: 'text-gray-500 italic',
  },
  css: {
    selector: 'text-purple-400',
    property: 'text-blue-400',
    value: 'text-green-400',
    comment: 'text-gray-500 italic',
  },
}

export interface CodeProps
  extends Omit<HTMLMotionProps<'code'>, 'variant'>,
    VariantProps<typeof codeVariants> {
  /** 代码内容 */
  children: string
  /** 是否显示行号 */
  showLineNumbers?: boolean
  /** 起始行号 */
  startLineNumber?: number
  /** 是否显示复制按钮 */
  showCopyButton?: boolean
  /** 复制按钮变体 */
  copyButtonVariant?: VariantProps<typeof copyButtonVariants>['variant']
  /** 是否显示语言标识 */
  showLanguage?: boolean
  /** 自定义语言显示名称 */
  languageName?: string
  /** 是否高亮指定行 */
  highlightLines?: number[]
  /** 是否启用语法高亮 */
  syntaxHighlight?: boolean
  /** 最大高度 */
  maxHeight?: string
}

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({
    className,
    variant = 'inline',
    size = 'sm',
    language = 'javascript',
    theme = 'auto',
    children,
    showLineNumbers = false,
    startLineNumber = 1,
    showCopyButton = true,
    copyButtonVariant = 'default',
    showLanguage = true,
    languageName,
    highlightLines = [],
    syntaxHighlight = true,
    maxHeight,
    ...props
  }, ref) => {
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 简单的语法高亮函数
    const highlightSyntax = useCallback((code: string, lang: string) => {
      if (!syntaxHighlight) return code

      const rules = syntaxHighlightMap[lang]
      if (!rules) return code

      let highlighted = code

      // 简单的关键词替换（实际应用中应该使用专业的语法高亮库）
      Object.entries(rules).forEach(([type, className]) => {
        switch (type) {
          case 'keyword':
            highlighted = highlighted.replace(
              /\b(const|let|var|function|return|if|else|for|while|class|import|export|from)\b/g,
              `<span class="${className}">$1</span>`
            )
            break
          case 'string':
            highlighted = highlighted.replace(
              /(["'`])([^"'`]*)\1/g,
              `<span class="${className}">$1$2$1</span>`
            )
            break
          case 'comment':
            highlighted = highlighted.replace(
              /\/\/.*$/gm,
              `<span class="${className}">$&</span>`
            )
            break
          case 'number':
            highlighted = highlighted.replace(
              /\b(\d+)\b/g,
              `<span class="${className}">$1</span>`
            )
            break
        }
      })

      return highlighted
    }, [syntaxHighlight])

    // 复制到剪贴板
    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(children)
        setCopied(true)
        setError(null)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        setError('复制失败')
        setTimeout(() => setError(null), 2000)
      }
    }, [children])

    // 内联代码
    if (variant === 'inline') {
      return (
        <motion.code
          ref={ref}
          className={cn(codeVariants({ variant, size, language, theme, className }))}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {syntaxHighlight ? (
            <span dangerouslySetInnerHTML={{ __html: highlightSyntax(children, language) }} />
          ) : (
            children
          )}
        </motion.code>
      )
    }

    // 多行代码
    const lines = children.split('\n')
    const shouldShowLineNumbers = showLineNumbers && lines.length > 1

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative group',
          codeVariants({ variant, size, language, theme, className }),
          maxHeight && 'overflow-y-auto'
        )}
        style={{ maxHeight }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 语言标识 */}
        {showLanguage && (
          <span className={languageBadgeVariants({ theme })}>
            {languageName || language.toUpperCase()}
          </span>
        )}

        {/* 复制按钮 */}
        {showCopyButton && (
          <button
            onClick={copyToClipboard}
            className={copyButtonVariants({ variant: copyButtonVariant })}
            title={copied ? '已复制!' : error || '复制代码'}
            disabled={!!error}
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : error ? (
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        )}

        {/* 代码内容 */}
        <pre className="m-0 overflow-x-auto">
          <code className="block">
            {shouldShowLineNumbers ? (
              <div className="flex">
                {/* 行号 */}
                <div className={lineNumbersVariants({ size })}>
                  {lines.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'px-1',
                        highlightLines.includes(index + startLineNumber) && 'bg-blue-500/20'
                      )}
                    >
                      {index + startLineNumber}
                    </div>
                  ))}
                </div>

                {/* 代码内容 */}
                <div className="flex-1">
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className={cn(
                        highlightLines.includes(index + startLineNumber) && 'bg-blue-500/10 -mx-2 px-2'
                      )}
                    >
                      {syntaxHighlight ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightSyntax(line || ' ', language)
                          }}
                        />
                      ) : (
                        line || ' '
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : syntaxHighlight ? (
              <span dangerouslySetInnerHTML={{ __html: highlightSyntax(children, language) }} />
            ) : (
              children
            )}
          </code>
        </pre>
      </motion.div>
    )
  }
)

Code.displayName = 'Code'

// 内联代码快捷组件
export const InlineCode = forwardRef<HTMLElement, Omit<CodeProps, 'variant'>>(
  (props, ref) => <Code ref={ref} variant="inline" {...props} />
)

InlineCode.displayName = 'InlineCode'

// 代码块快捷组件
export const CodeBlock = forwardRef<HTMLElement, Omit<CodeProps, 'variant'>>(
  (props, ref) => <Code ref={ref} variant="block" {...props} />
)

CodeBlock.displayName = 'CodeBlock'

// 多行代码快捷组件
export const MultiLineCode = forwardRef<HTMLElement, Omit<CodeProps, 'variant'>>(
  (props, ref) => <Code ref={ref} variant="multiline" {...props} />
)

MultiLineCode.displayName = 'MultiLineCode'

export {
  codeVariants,
  copyButtonVariants,
  lineNumbersVariants,
  languageBadgeVariants,
}
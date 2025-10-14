import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// Kbd变体配置
const kbdVariants = cva(
  'inline-flex items-center justify-center font-mono font-medium border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200',
        outline: 'bg-transparent border-gray-400 text-gray-700 dark:border-gray-500 dark:text-gray-300',
        filled: 'bg-gray-900 border-gray-900 text-white dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs min-h-[20px]',
        md: 'px-2 py-1 text-sm min-h-[24px]',
        lg: 'px-3 py-1.5 text-base min-h-[28px]',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    compoundVariants: [
      // 组合变体：小尺寸时减少内边距
      {
        variant: 'default',
        size: 'sm',
        className: 'shadow-sm',
      },
      {
        variant: 'default',
        size: 'md',
        className: 'shadow-sm',
      },
      {
        variant: 'default',
        size: 'lg',
        className: 'shadow-md',
      },
      // 组合变体：填充样式
      {
        variant: 'filled',
        size: 'sm',
        className: 'shadow-sm',
      },
      {
        variant: 'filled',
        size: 'md',
        className: 'shadow-md',
      },
      {
        variant: 'filled',
        size: 'lg',
        className: 'shadow-lg',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'md',
    },
  }
)

// 修饰键映射
const modifierKeyMap: Record<string, string> = {
  ctrl: '⌃',
  control: '⌃',
  cmd: '⌘',
  command: '⌘',
  meta: '⌘',
  shift: '⇧',
  alt: '⌥',
  option: '⌥',
  enter: '↵',
  return: '↵',
  backspace: '⌫',
  delete: '⌦',
  escape: '⎋',
  tab: '⇥',
  space: '␣',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
  home: '⇱',
  end: '⇲',
  pageup: '⇞',
  pagedown: '⇟',
}

// 特殊键样式
const specialKeyVariants = cva(
  '',
  {
    variants: {
      type: {
        modifier: 'text-blue-600 dark:text-blue-400',
        action: 'text-green-600 dark:text-green-400',
        navigation: 'text-purple-600 dark:text-purple-400',
        delete: 'text-red-600 dark:text-red-400',
      },
    },
  }
)

export interface KbdProps
  extends Omit<HTMLMotionProps<'kbd'>, 'variant'>,
    VariantProps<typeof kbdVariants> {
  /** 键位显示文本 */
  children: React.ReactNode
  /** 是否显示为组合键 */
  combination?: boolean
  /** 分隔符 */
  separator?: string
  /** 是否使用符号映射 */
  useSymbols?: boolean
  /** 自定义键位映射 */
  keyMap?: Record<string, string>
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    rounded = 'md',
    children,
    combination = false,
    separator = '+',
    useSymbols = true,
    keyMap = modifierKeyMap,
    ...props
  }, ref) => {
    // 处理组合键
    const renderKey = useCallback((key: string): string => {
      const lowerKey = key.toLowerCase()

      // 如果使用符号映射且存在映射
      if (useSymbols && keyMap[lowerKey]) {
        return keyMap[lowerKey]
      }

      // 首字母大写
      return key.charAt(0).toUpperCase() + key.slice(1)
    }, [useSymbols, keyMap])

    // 获取特殊键类型
    const getKeyType = useCallback((key: string): VariantProps<typeof specialKeyVariants>['type'] => {
      const lowerKey = key.toLowerCase()

      if (['ctrl', 'control', 'cmd', 'command', 'meta', 'shift', 'alt', 'option'].includes(lowerKey)) {
        return 'modifier'
      }
      if (['enter', 'return', 'escape', 'tab', 'space'].includes(lowerKey)) {
        return 'action'
      }
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'home', 'end', 'pageup', 'pagedown'].includes(lowerKey)) {
        return 'navigation'
      }
      if (['backspace', 'delete'].includes(lowerKey)) {
        return 'delete'
      }

      return undefined
    }, [])

    // 渲染单个键位
    const renderSingleKey = useCallback((key: React.ReactNode) => {
      if (typeof key !== 'string') {
        return (
          <span className={cn(kbdVariants({ variant, size, rounded }))}>
            {key}
          </span>
        )
      }

      const keyType = getKeyType(key)
      const displayKey = renderKey(key)

      return (
        <span className={cn(kbdVariants({ variant, size, rounded }))}>
          <span className={cn(specialKeyVariants({ type: keyType }))}>
            {displayKey}
          </span>
        </span>
      )
    }, [variant, size, rounded, getKeyType, renderKey])

    // 渲染组合键
    if (combination && typeof children === 'string') {
      const keys = children.split(/[\s\+]+/).filter(Boolean)

      return (
        <span
          ref={ref}
          className={cn('inline-flex items-center gap-1', className)}
          {...props}
        >
          {keys.map((key, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="mx-1 text-gray-400 dark:text-gray-500 text-xs">
                  {separator}
                </span>
              )}
              {renderSingleKey(key)}
            </React.Fragment>
          ))}
        </span>
      )
    }

    // 普通渲染
    return (
      <motion.kbd
        ref={ref}
        className={cn(kbdVariants({ variant, size, rounded, className }))}
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95, y: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {typeof children === 'string' ? renderSingleKey(children) : children}
      </motion.kbd>
    )
  }
)

Kbd.displayName = 'Kbd'

// 组合键快捷组件
export interface KeyComboProps extends Omit<KbdProps, 'combination' | 'children'> {
  /** 键位组合 */
  keys: string[]
  /** 分隔符 */
  separator?: string
}

export const KeyCombo = forwardRef<HTMLElement, KeyComboProps>(
  ({ keys, separator = '+', className, ...props }, ref) => {
    return (
      <Kbd
        ref={ref}
        combination
        separator={separator}
        className={cn('inline-flex items-center gap-1', className)}
        {...props}
      >
        {keys.join(' ')}
      </Kbd>
    )
  }
)

KeyCombo.displayName = 'KeyCombo'

// 常用组合键预设
export const KeyShortcuts = {
  // 复制粘贴
  copy: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Ctrl', 'C']} {...props} />
  ),
  paste: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Ctrl', 'V']} {...props} />
  ),
  cut: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Ctrl', 'X']} {...props} />
  ),
  // 撤销重做
  undo: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Ctrl', 'Z']} {...props} />
  ),
  redo: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Ctrl', 'Y']} {...props} />
  ),
  // 全选
  selectAll: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Ctrl', 'A']} {...props} />
  ),
  // 保存
  save: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Ctrl', 'S']} {...props} />
  ),
  // 查找
  find: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Ctrl', 'F']} {...props} />
  ),
  // macOS 特定
  macCopy: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Cmd', 'C']} {...props} />
  ),
  macPaste: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Cmd', 'V']} {...props} />
  ),
  macUndo: (props?: Partial<KeyComboProps>) => (
    <KeyCombo keys={['Cmd', 'Z']} {...props} />
  ),
  // 导航
  home: (props?: Partial<KbdProps>) => (
    <Kbd>Home</Kbd>
  ),
  end: (props?: Partial<KbdProps>) => (
    <Kbd>End</Kbd>
  ),
  pageUp: (props?: Partial<KbdProps>) => (
    <Kbd>PageUp</Kbd>
  ),
  pageDown: (props?: Partial<KbdProps>) => (
    <Kbd>PageDown</Kbd>
  ),
}

export {
  kbdVariants,
  specialKeyVariants,
  modifierKeyMap,
}
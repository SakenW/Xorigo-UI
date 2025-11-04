import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { X, Check } from 'lucide-react'
import { cn } from '../../utils'

// Tag 变体配置
const tagVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        solid: 'bg-[var(--bg-primary-action)] text-[var(--text-inverse)]',
        outline: 'bg-transparent border border-[var(--border-primary)] text-[var(--text-primary)]',
        soft: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
        ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
        gradient: 'bg-gradient-to-r from-[var(--bg-primary-action)] to-[var(--bg-secondary-action)] text-[var(--text-inverse)]',
        neon: 'bg-[var(--bg-contrast-high)] text-[var(--text-info)] border border-[var(--border-info)] shadow-[0_0_10px_var(--border-info)]',
      },
      color: {
        primary: 'text-[var(--text-primary-action)]',
        secondary: 'text-[var(--text-secondary)]',
        success: 'text-[var(--text-success)]',
        warning: 'text-[var(--text-warning)]',
        error: 'text-[var(--text-error)]',
        info: 'text-[var(--text-info)]',
        gray: 'text-[var(--text-tertiary)]',
      },
      size: {
        xs: 'px-2 py-0.5 text-xs min-h-[20px]',
        sm: 'px-2.5 py-1 text-sm min-h-[24px]',
        md: 'px-3 py-1.5 text-sm min-h-[28px]',
        lg: 'px-4 py-2 text-base min-h-[32px]',
        xl: 'px-5 py-2.5 text-base min-h-[36px]',
      },
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'soft',
      color: 'primary',
      size: 'md',
      shape: 'rounded',
    },
  }
)

// 选中状态变体
const selectedVariants = {
  solid: 'ring-2 ring-offset-2 ring-[var(--border-primary-action)]',
  outline: 'ring-2 ring-offset-2 ring-[var(--border-primary)] bg-[var(--bg-secondary)]',
  soft: 'ring-2 ring-offset-2 ring-[var(--border-primary)] bg-[var(--bg-tertiary)]',
  ghost: 'ring-2 ring-offset-2 ring-[var(--border-primary)] bg-[var(--bg-tertiary)]',
  gradient: 'ring-2 ring-offset-2 ring-[var(--border-primary-action)]',
  neon: 'ring-2 ring-offset-2 ring-[var(--border-info)]',
}

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof tagVariants> {
  /** 子元素 */
  children?: React.ReactNode
  /** 是否可删除 */
  removable?: boolean
  /** 移除回调 */
  onRemove?: () => void
  /** 图标 */
  icon?: React.ReactNode
  /** 是否可选中 */
  selectable?: boolean
  /** 是否已选中 */
  selected?: boolean
  /** 选择状态变化回调 */
  onSelect?: (selected: boolean) => void
  /** 是否显示动画 */
  animated?: boolean
  /** 测试ID */
  testId?: string
}

export const Tag = React.forwardRef<HTMLButtonElement, TagProps>(({
  children,
  variant,
  color,
  size,
  shape,
  removable = false,
  onRemove,
  icon,
  selectable = false,
  selected = false,
  onSelect,
  animated = true,
  testId,
  className,
  disabled,
  onClick,
  ...props
}, ref) => {
  const [internalSelected, setInternalSelected] = useState(selected)

  // 同步外部selected状态
  React.useEffect(() => {
    setInternalSelected(selected)
  }, [selected])

  const isSelected = selectable ? internalSelected : false

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.()
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (selectable) {
      const newSelected = !internalSelected
      setInternalSelected(newSelected)
      onSelect?.(newSelected)
    }

    onClick?.(e)
  }

  // 计算最终样式
  const combinedClassName = cn(
    tagVariants({ variant, color, size, shape }),
    isSelected && selectedVariants[variant || 'soft'],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  // 关闭按钮组件
  const RemoveButton = (
    <button
      type="button"
      onClick={handleRemove}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'hover:bg-black/10 dark:hover:bg-white/10',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--border-primary)]',
        size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-5 h-5',
        disabled && 'pointer-events-none'
      )}
      aria-label="移除标签"
      disabled={disabled}
    >
      <X
        className={size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-4 h-4'}
      />
    </button>
  )

  // 选中图标
  const SelectedIcon = (
    <Check
      className={cn(
        'text-[var(--text-inverse)]',
        size === 'xs' ? 'w-2.5 h-2.5' : size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4 h-4' : 'w-4.5 h-4.5'
      )}
    />
  )

  const TagContent = (
    <button
      ref={ref}
      type="button"
      data-component="tag"
      data-testid={testId}
      className={combinedClassName}
      disabled={disabled}
      aria-pressed={selectable ? isSelected : undefined}
      aria-label={removable ? '可移除的标签' : undefined}
      onClick={handleClick}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {isSelected && SelectedIcon}
      {children}
      {removable && RemoveButton}
    </button>
  )

  if (animated) {
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        transition={{ duration: 0.2 }}
      >
        {TagContent}
      </motion.span>
    )
  }

  return TagContent
})

Tag.displayName = 'Tag'

// Tag Group 组件
export interface TagGroupProps {
  /** 标签元素 */
  children: React.ReactNode
  /** 最大显示数量 */
  max?: number
  /** 更多标签显示方式 */
  overflowType?: 'ellipsis' | 'dropdown' | 'hidden'
  /** 间距 */
  spacing?: 'tight' | 'normal' | 'loose'
  /** 类名 */
  className?: string
  /** 选择模式 */
  selectionMode?: 'none' | 'single' | 'multiple'
  /** 选中的标签 */
  selectedValues?: (string | number)[]
  /** 选择变化回调 */
  onSelectionChange?: (selected: (string | number)[]) => void
}

export const TagGroup: React.FC<TagGroupProps> = ({
  children,
  max,
  overflowType = 'ellipsis',
  spacing = 'normal',
  className,
  selectionMode = 'none',
  selectedValues = [],
  onSelectionChange,
}) => {
  const childrenArray = React.Children.toArray(children)
  const displayedTags = max ? childrenArray.slice(0, max) : childrenArray
  const remainingCount = max ? childrenArray.length - max : 0

  const spacingClasses = {
    tight: 'gap-1.5',
    normal: 'gap-2.5',
    loose: 'gap-3.5',
  }

  const handleTagSelect = (value: string | number) => {
    if (selectionMode === 'none') return

    let newSelected: (string | number)[]

    if (selectionMode === 'single') {
      newSelected = selectedValues.includes(value) ? [] : [value]
    } else {
      newSelected = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
    }

    onSelectionChange?.(newSelected)
  }

  // 为每个Tag添加选择功能
  const enhancedTags = displayedTags.map((child, index) => {
    if (React.isValidElement<TagProps>(child)) {
      const value = index // 使用索引作为值
      return React.cloneElement(child, {
        key: value,
        selectable: selectionMode !== 'none',
        selected: selectedValues.includes(value),
        onSelect: () => handleTagSelect(value),
      } as Partial<TagProps>)
    }
    return child
  })

  if (overflowType === 'hidden' && childrenArray.length > (max || childrenArray.length)) {
    return (
      <div className={cn('flex items-center flex-wrap', spacingClasses[spacing], className)}>
        {enhancedTags}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center flex-wrap', spacingClasses[spacing], className)}>
      <AnimatePresence>
        {enhancedTags}
      </AnimatePresence>
      {remainingCount > 0 && overflowType === 'ellipsis' && (
        <Tag variant="outline" size="sm">
          +{remainingCount}
        </Tag>
      )}
      {remainingCount > 0 && overflowType === 'dropdown' && (
        <Tag variant="outline" size="sm">
          查看全部 ({childrenArray.length})
        </Tag>
      )}
    </div>
  )
}

TagGroup.displayName = 'TagGroup'

// 导出变体类型
export type TagVariants = VariantProps<typeof tagVariants>

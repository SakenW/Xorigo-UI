import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@th-ui/core'

// ButtonGroup 变体配置
const buttonGroupVariants = cva('inline-flex', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    spacing: {
      none: '',
      sm: '',
      md: '',
    },
    attached: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // 水平排列时的间距
    {
      orientation: 'horizontal',
      spacing: 'sm',
      attached: false,
      className: 'gap-1',
    },
    {
      orientation: 'horizontal',
      spacing: 'md',
      attached: false,
      className: 'gap-2',
    },
    // 垂直排列时的间距
    {
      orientation: 'vertical',
      spacing: 'sm',
      attached: false,
      className: 'gap-1',
    },
    {
      orientation: 'vertical',
      spacing: 'md',
      attached: false,
      className: 'gap-2',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'none',
    attached: true,
  },
})

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  /** 子元素（通常是 Button 组件） */
  children: React.ReactNode
  /** 排列方向 */
  orientation?: 'horizontal' | 'vertical'
  /** 按钮之间的间距（仅在 attached=false 时生效） */
  spacing?: 'none' | 'sm' | 'md'
  /** 是否附加模式（去掉相邻按钮之间的圆角和间距） */
  attached?: boolean
  /** 是否显示分隔线 */
  divider?: boolean
}

/**
 * ButtonGroup 按钮组组件
 * 用于组合多个按钮，支持水平/垂直排列、附加模式、分隔线
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'none',
  attached = true,
  divider = false,
  className,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children)

  // 处理子元素样式
  const processedChildren = childrenArray.map((child, index) => {
    if (!React.isValidElement(child)) return child

    // 附加模式下的样式处理
    if (attached) {
      const isFirst = index === 0
      const isLast = index === childrenArray.length - 1
      const isMiddle = !isFirst && !isLast

      // 根据方向和位置添加圆角类名
      let attachedClass = ''
      if (orientation === 'horizontal') {
        if (isFirst) {
          attachedClass = 'rounded-r-none border-r-0'
        } else if (isLast) {
          attachedClass = 'rounded-l-none'
        } else if (isMiddle) {
          attachedClass = 'rounded-none border-r-0'
        }
      } else {
        if (isFirst) {
          attachedClass = 'rounded-b-none border-b-0'
        } else if (isLast) {
          attachedClass = 'rounded-t-none'
        } else if (isMiddle) {
          attachedClass = 'rounded-none border-b-0'
        }
      }

      // 克隆子元素并添加样式
      const childProps = child.props as { className?: string }
      return React.cloneElement(child, {
        ...child.props,
        className: cn(childProps.className, attachedClass),
      } as any)
    }

    return child
  })

  // 添加分隔线
  const childrenWithDivider = divider
    ? processedChildren.reduce((acc: React.ReactNode[], child, index) => {
        acc.push(child)
        if (index < processedChildren.length - 1) {
          const dividerClass =
            orientation === 'horizontal'
              ? 'w-px h-auto bg-gray-300 dark:bg-gray-600'
              : 'h-px w-auto bg-gray-300 dark:bg-gray-600'

          acc.push(
            <div
              key={`divider-${index}`}
              className={dividerClass}
              aria-hidden="true"
            />
          )
        }
        return acc
      }, [])
    : processedChildren

  return (
    <div
      className={cn(
        buttonGroupVariants({ orientation, spacing, attached }),
        className
      )}
      role="group"
      {...props}
    >
      {childrenWithDivider}
    </div>
  )
}

ButtonGroup.displayName = 'ButtonGroup'

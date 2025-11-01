import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

/**
 * ComponentNav 组件变体配置
 */
const componentNavVariants = cva(
  // 基础样式 - 使用主题令牌
  'flex flex-col gap-1 w-full',
  {
    variants: {
      variant: {
        default: '',
        compact: 'gap-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/**
 * 导航组定义
 */
export interface NavGroup {
  /** 分组名称 */
  name: string
  /** 分组图标（可选） */
  icon?: React.ReactNode
  /** 组件列表 */
  items: NavItem[]
}

/**
 * 导航项定义
 */
export interface NavItem {
  /** 组件ID（用于路由） */
  id: string
  /** 组件名称 */
  name: string
  /** 组件描述（可选） */
  description?: string
  /** 组件图标（可选） */
  icon?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
}

export interface ComponentNavProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentNavVariants> {
  /** 导航分组列表 */
  groups: NavGroup[]
  /** 当前激活的组件ID */
  activeId?: string
  /** 点击导航项回调 */
  onItemClick?: (item: NavItem) => void
  /** 是否显示分组图标 */
  showGroupIcons?: boolean
  /** 是否显示组件描述 */
  showDescriptions?: boolean
}

/**
 * ComponentNav - 组件导航侧边栏
 *
 * 功能特性：
 * - 分组展示组件列表
 * - 当前选中状态高亮
 * - 路由跳转支持
 * - 完整的键盘导航
 * - 无障碍支持
 *
 * @example
 * ```tsx
 * <ComponentNav
 *   groups={[
 *     {
 *       name: 'Base',
 *       items: [
 *         { id: 'button', name: 'Button' },
 *         { id: 'badge', name: 'Badge' },
 *       ],
 *     },
 *   ]}
 *   activeId="button"
 *   onItemClick={(item) => router.push(`/gallery/${item.id}`)}
 * />
 * ```
 */
export const ComponentNav = forwardRef<HTMLDivElement, ComponentNavProps>(
  (
    {
      className,
      variant,
      groups,
      activeId,
      onItemClick,
      showGroupIcons = false,
      showDescriptions = false,
      ...props
    },
    ref
  ) => {
    /**
     * 处理导航项点击
     */
    const handleItemClick = (item: NavItem) => {
      if (item.disabled) return
      onItemClick?.(item)
    }

    /**
     * 处理键盘导航
     */
    const handleKeyDown = (e: React.KeyboardEvent, item: NavItem) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleItemClick(item)
      }
    }

    return (
      <nav
        ref={ref}
        className={cn(componentNavVariants({ variant }), className)}
        aria-label="组件导航"
        {...props}
      >
        {groups.map((group, groupIndex) => (
          <div key={group.name} className="flex flex-col">
            {/* 分组标题 - 添加装饰效果 */}
            <div className="relative flex items-center gap-2 px-3 py-2 mb-2">
              {/* 装饰性渐变线 */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-gradient-to-b from-[var(--bg-primary-action)] to-[var(--bg-secondary-action)] rounded-full" />

              <div className="flex items-center gap-2 ml-3">
                {showGroupIcons && group.icon && (
                  <span className="text-[var(--text-tertiary)]">{group.icon}</span>
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] bg-gradient-to-r from-[var(--text-tertiary)] to-[var(--text-secondary)] bg-clip-text">
                  {group.name}
                </span>
              </div>
            </div>

            {/* 导航项列表 */}
            <ul className="flex flex-col gap-1 mb-4" role="list">
              {group.items.map((item) => {
                const isActive = item.id === activeId
                const isDisabled = item.disabled

                return (
                  <li key={item.id} role="listitem">
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      onKeyDown={(e) => handleKeyDown(e, item)}
                      disabled={isDisabled}
                      className={cn(
                        // 基础样式 - 优化圆角和过渡
                        'relative flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-left transition-all duration-200 group/item',
                        // 默认状态 - 优化悬浮效果
                        'text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                        'hover:bg-[var(--bg-secondary)] hover:shadow-sm hover:pl-4',
                        // 激活状态 - 添加渐变背景和光晕
                        isActive &&
                          'bg-gradient-to-r from-[var(--bg-primary-action)] to-[var(--bg-primary-action-hover)] text-[var(--text-inverse)] font-semibold shadow-lg shadow-[var(--shadow-primary)]/20 hover:shadow-xl hover:shadow-[var(--shadow-primary)]/30 pl-4 scale-[1.02]',
                        // 禁用状态
                        isDisabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:pl-3',
                        // 焦点状态
                        'focus:outline-hidden focus:ring-2 focus:ring-[var(--ring-primary-action)] focus:ring-offset-2'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      aria-disabled={isDisabled}
                    >
                      {/* 左侧装饰线 - 仅在激活时显示 */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[var(--text-inverse)] to-transparent rounded-r-full"
                          aria-hidden="true"
                        />
                      )}

                      {/* 组件图标 */}
                      {item.icon && (
                        <span className={cn('flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110', isActive ? 'text-[var(--text-inverse)]' : 'text-[var(--text-tertiary)]')}>
                          {item.icon}
                        </span>
                      )}

                      {/* 组件信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        {showDescriptions && item.description && (
                          <div className={cn(
                            "text-xs truncate mt-0.5 transition-colors duration-200",
                            isActive ? 'text-[var(--text-inverse)]/80' : 'text-[var(--text-tertiary)]'
                          )}>
                            {item.description}
                          </div>
                        )}
                      </div>

                      {/* 激活指示器 - 改为圆形徽章 */}
                      {isActive && (
                        <span
                          className="w-2 h-2 bg-[var(--text-inverse)] rounded-full shadow-lg shadow-[var(--text-inverse)]/50 animate-pulse"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* 分组分隔线 - 非最后一组时显示 */}
            {groupIndex < groups.length - 1 && (
              <div className="relative h-px my-2 bg-gradient-to-r from-transparent via-[var(--border-tertiary)] to-transparent" />
            )}
          </div>
        ))}
      </nav>
    )
  }
)

ComponentNav.displayName = 'ComponentNav'

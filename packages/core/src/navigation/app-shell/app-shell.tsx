/**
 * AppShell - 应用壳层组件
 *
 * 提供应用的整体布局结构，包含顶部导航、侧边栏、主内容区等。
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface AppShellProps {
  /**
   * 顶部导航组件
   */
  header?: React.ReactNode

  /**
   * 侧边导航组件
   */
  sidebar?: React.ReactNode

  /**
   * 主内容区
   */
  children: React.ReactNode

  /**
   * 布局类型
   */
  layout?: 'sidebar' | 'topbar' | 'both' | 'none'

  /**
   * 侧边栏位置
   */
  sidebarPosition?: 'left' | 'right'

  /**
   * 侧边栏宽度
   */
  sidebarWidth?: number | string

  /**
   * 头部高度
   */
  headerHeight?: number | string

  /**
   * 是否固定头部
   */
  fixedHeader?: boolean

  /**
   * 是否固定侧边栏
   */
  fixedSidebar?: boolean

  /**
   * 自定义类名
   */
  className?: string
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * AppShell 组件
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      header,
      sidebar,
      children,
      layout = 'sidebar',
      sidebarPosition = 'left',
      sidebarWidth = 256,
      headerHeight = 64,
      fixedHeader = true,
      fixedSidebar = true,
      className
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col h-screen bg-[var(--color-background)]', className)}
      >
        {/* Header */}
        {header && (
          <motion.header
            className={cn(
              'flex-shrink-0',
              fixedHeader && 'sticky top-0 z-40'
            )}
            style={{ height: headerHeight }}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {header}
          </motion.header>
        )}

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {sidebar && layout !== 'topbar' && layout !== 'none' && (
            <motion.aside
              className={cn(
                'flex-shrink-0',
                fixedSidebar && 'sticky top-0 h-full'
              )}
              style={{ width: sidebarWidth }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {sidebar}
            </motion.aside>
          )}

          {/* Main Content */}
          <motion.main
            className="flex-1 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    )
  }
)

AppShell.displayName = 'AppShell'

// ============================================================================
// Export
// ============================================================================

export type { AppShellProps }

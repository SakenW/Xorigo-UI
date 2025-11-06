'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../utils'

export interface ResponsiveLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
  sidebarWidth?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebar,
  header,
  className,
  sidebarWidth = 280,
  collapsible = true,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* 移动端遮罩 */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <AnimatePresence>
        {sidebar && (
          <>
            {/* 桌面端侧边栏 */}
            <motion.aside
              className={cn(
                'hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
                'fixed left-0 top-0 h-full z-30',
                !isMobile && 'block'
              )}
              style={{
                width: isCollapsed ? 60 : sidebarWidth
              }}
              initial={false}
              animate={{
                width: isCollapsed ? 60 : sidebarWidth
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut'
              }}
            >
              <motion.div
                className="flex-1 overflow-hidden"
                initial={false}
                animate={{
                  opacity: isCollapsed ? 0.8 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {sidebar}
              </motion.div>

              {collapsible && (
                <motion.button
                  className="p-2 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={toggleSidebar}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </motion.button>
              )}
            </motion.aside>

            {/* 移动端侧边栏 */}
            {isMobile && (
              <motion.aside
                className={cn(
                  'fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 md:hidden',
                  isMobileMenuOpen ? 'block' : 'hidden'
                )}
                initial={{ x: -288 }}
                animate={{
                  x: isMobileMenuOpen ? 0 : -288
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold">菜单</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {sidebar}
                  </div>
                </div>
              </motion.aside>
            )}
          </>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          sidebar && !isMobile && !isCollapsed && `ml-[${sidebarWidth}px]`,
          sidebar && !isMobile && isCollapsed && 'ml-[60px]'
        )}
      >
        {/* 顶部导航 */}
        {header && (
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {sidebar && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}
                {header}
              </div>
            </div>
          </header>
        )}

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto">
          <motion.div
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

// 响应式网格组件
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: number
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4
}) => {
  const gridClasses = cn(
    'grid',
    cols.sm && `grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
    `gap-${gap}`,
    className
  )

  return (
    <motion.div
      className={gridClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// 响应式容器组件
interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  size = 'lg',
  centered = true
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div
      className={cn(
        'w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

// 响应式间距组件
interface ResponsiveSpacingProps {
  children: React.ReactNode
  className?: string
  size?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
    x?: number
    y?: number
  }
  responsive?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  children,
  className,
  size = { y: 4 },
  responsive
}) => {
  const getSpacingClasses = () => {
    const classes = []

    if (size.top) classes.push(`pt-${size.top}`)
    if (size.bottom) classes.push(`pb-${size.bottom}`)
    if (size.left) classes.push(`pl-${size.left}`)
    if (size.right) classes.push(`pr-${size.right}`)
    if (size.x) {
      classes.push(`px-${size.x}`)
    }
    if (size.y) {
      classes.push(`py-${size.y}`)
    }

    if (responsive) {
      if (responsive.sm) classes.push(`sm:py-${responsive.sm}`)
      if (responsive.md) classes.push(`md:py-${responsive.md}`)
      if (responsive.lg) classes.push(`lg:py-${responsive.lg}`)
      if (responsive.xl) classes.push(`xl:py-${responsive.xl}`)
    }

    return classes.join(' ')
  }

  return (
    <div className={cn(getSpacingClasses(), className)}>
      {children}
    </div>
  )
}

export default {
  ResponsiveLayout,
  ResponsiveGrid,
  ResponsiveContainer,
  ResponsiveSpacing
}

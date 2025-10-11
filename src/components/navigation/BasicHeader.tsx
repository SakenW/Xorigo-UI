'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@th-ui/core'

export interface HeaderUser {
  name: string
  email: string
  avatar?: string
}

export interface HeaderProps {
  title?: string
  subtitle?: string
  user?: HeaderUser
  actions?: React.ReactNode
  breadcrumbs?: React.ReactNode
  className?: string
  showNotifications?: boolean
  notificationCount?: number
  onNotificationClick?: () => void
  onUserClick?: () => void
}

/**
 * Header - 顶部导航栏组件
 * 提供页面标题、面包屑、用户信息和操作按钮区域
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  user,
  actions,
  breadcrumbs,
  className = '',
  showNotifications = true,
  notificationCount = 0,
  onNotificationClick,
  onUserClick,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <motion.header
      className={cn(
        'bg-white dark:bg-gray-800 shadow-xs border-b border-gray-200 dark:border-gray-700',
        className
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 左侧：标题和面包屑 */}
          <div className="flex-1 min-w-0">
            {breadcrumbs && (
              <nav className="text-sm mb-1">{breadcrumbs}</nav>
            )}
            {(title || subtitle) && (
              <div>
                {title && (
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 右侧：操作按钮和用户信息 */}
          <div className="flex items-center space-x-4">
            {/* 操作按钮 */}
            {actions && (
              <div className="flex items-center space-x-2">{actions}</div>
            )}

            {/* 通知 */}
            {showNotifications && (
              <motion.button
                onClick={onNotificationClick}
                className="relative p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notificationCount > 0 && (
                  <motion.span
                    className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  />
                )}
              </motion.button>
            )}

            {/* 用户菜单 */}
            {user && (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu)
                      onUserClick?.()
                    }}
                    className="flex items-center text-sm rounded-full focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </motion.button>
                </div>

                {/* 用户下拉菜单 */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        个人资料
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        设置
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        退出登录
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

Header.displayName = 'Header'

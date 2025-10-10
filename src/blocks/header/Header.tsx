import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Bell, User, Settings, LogOut } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { DropdownMenu } from '../../components/radix/DropdownMenu'
import { cn } from '../../utils/cn'

interface HeaderProps {
  logo?: React.ReactNode
  navigation?: Array<{
    label: string
    href: string
    active?: boolean
  }>
  user?: {
    name: string
    email: string
    avatar?: string
  }
  notifications?: number
  showSearch?: boolean
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navigation = [],
  user,
  notifications = 0,
  showSearch = false,
  className
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700',
      'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg',
      className
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          {logo && (
            <div className="flex items-center space-x-2">
              {logo}
            </div>
          )}

          {/* Desktop Navigation */}
          {navigation.length > 0 && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'text-gray-700 dark:text-gray-300',
                    item.active && 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400'
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          {showSearch && (
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索..."
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <Badge
                  variant="danger"
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1"
                >
                  {notifications > 99 ? '99+' : notifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                  <User className="mr-2 h-4 w-4" />
                  个人资料
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Settings className="mr-2 h-4 w-4" />
                  设置
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                登录
              </Button>
              <Button size="sm">
                注册
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'text-gray-700 dark:text-gray-300',
                    item.active && 'bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {showSearch && (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="搜索..."
                      className="bg-transparent border-none outline-none text-sm flex-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
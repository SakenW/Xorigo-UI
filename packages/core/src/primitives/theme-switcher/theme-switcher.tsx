'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Theme {
  id: string
  name: string
  icon: string
  description: string
}

const themes: Theme[] = [
  { id: 'light', name: '浅色', icon: '☀️', description: '明亮清新的默认主题' },
  { id: 'dark', name: '深色', icon: '🌙', description: '深邃优雅的夜间模式' },
  { id: 'ocean', name: '海洋', icon: '🌊', description: '清新自然的海洋风格' },
  { id: 'forest', name: '森林', icon: '🌲', description: '生机勃勃的森林绿色' },
  { id: 'sunset', name: '晚霞', icon: '🌅', description: '温暖绚烂的夕阳色彩' },
]

export interface ThemeSwitcherProps {
  className?: string
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 从 localStorage 读取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'light'
    applyTheme(savedTheme)
    setCurrentTheme(savedTheme)
  }, [])

  const applyTheme = (themeId: string) => {
    const root = document.documentElement
    root.setAttribute('data-theme', themeId)
    localStorage.setItem('theme', themeId)
    setCurrentTheme(themeId)
    setIsOpen(false)
  }

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0]

  return (
    <div className={className}>
      {/* 主题切换按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentTheme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl"
          >
            {currentThemeData.icon}
          </motion.span>
        </AnimatePresence>

        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {currentThemeData.name}
        </span>

        <motion.svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--color-text-secondary)]"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.svg>
      </motion.button>

      {/* 主题选择面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-64 bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="p-2">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ backgroundColor: 'var(--color-surface-secondary)' }}
                  onClick={() => applyTheme(theme.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    currentTheme === theme.id
                      ? 'bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]'
                      : 'hover:bg-[var(--color-surface-secondary)]'
                  }`}
                >
                  <span className="text-xl">{theme.icon}</span>

                  <div className="flex-1 text-left">
                    <div className={`text-sm font-medium ${
                      currentTheme === theme.id
                        ? 'text-[var(--color-primary-700)]'
                        : 'text-[var(--color-text-primary)]'
                    }`}>
                      {theme.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      {theme.description}
                    </div>
                  </div>

                  {currentTheme === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 bg-[var(--color-primary-500)] rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
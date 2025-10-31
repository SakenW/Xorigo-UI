'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface ThemeSwitcherProps {
  className?: string
  children?: ReactNode
}

export function ThemeSwitcher({ className, children }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
      {children}
    </button>
  )
}
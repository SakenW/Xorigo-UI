'use client'

import * as React from 'react'

interface I18nContextType {
  locale: string
  t: (key: string) => string
  setLocale: (locale: string) => void
}

const I18nContext = React.createContext<I18nContextType | undefined>(undefined)

// 简单的翻译函数
const translations = {
  'zh-CN': {
    'playground.title': 'Xorigo UI Playground',
    'playground.run': '运行',
    'playground.copy': '复制',
    'playground.download': '下载',
    'playground.reset': '重置',
    'playground.running': '运行中...',
    'playground.code.editor': '代码编辑器',
    'playground.preview': '实时预览',
    'playground.theme.current': '主题',
  },
  'en-US': {
    'playground.title': 'Xorigo UI Playground',
    'playground.run': 'Run',
    'playground.copy': 'Copy',
    'playground.download': 'Download',
    'playground.reset': 'Reset',
    'playground.running': 'Running...',
    'playground.code.editor': 'Code Editor',
    'playground.preview': 'Live Preview',
    'playground.theme.current': 'Theme',
  },
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState('zh-CN')

  const t = React.useCallback((key: string) => {
    const messages = translations[locale as keyof typeof translations]
    return messages[key as keyof typeof messages] || key
  }, [locale])

  const value = React.useMemo(() => ({
    locale,
    t,
    setLocale,
  }), [locale, t])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = React.useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
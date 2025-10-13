import React, { createContext, useContext } from 'react'

interface ConfigContextValue {
  theme?: any
  locale?: string
  direction?: 'ltr' | 'rtl'
  size?: 'sm' | 'md' | 'lg'
  colorPrimary?: string
  borderRadius?: number
  [key: string]: any
}

const ConfigContext = createContext<ConfigContextValue>({})

export interface ConfigProviderProps {
  children: React.ReactNode
  theme?: any
  locale?: string
  direction?: 'ltr' | 'rtl'
  size?: 'sm' | 'md' | 'lg'
  colorPrimary?: string
  borderRadius?: number
  [key: string]: any
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  theme,
  locale = 'zh-CN',
  direction = 'ltr',
  size = 'md',
  colorPrimary,
  borderRadius,
  ...otherConfig
}) => {
  const configValue: ConfigContextValue = {
    theme,
    locale,
    direction,
    size,
    colorPrimary,
    borderRadius,
    ...otherConfig,
  }

  return (
    <ConfigContext.Provider value={configValue}>
      <div dir={direction} data-size={size} data-locale={locale}>
        {children}
      </div>
    </ConfigContext.Provider>
  )
}

export const useConfig = (): ConfigContextValue => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
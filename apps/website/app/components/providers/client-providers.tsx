'use client'

import { ThemeProvider } from '@xorigo-ui/system'
import { StyleRecipeProvider } from '@xorigo-ui/style-recipe'
// import { MotionThemeProvider } from '@xorigo-ui/core'
// MotionThemeProvider 暂时禁用，直到核心包构建完成

export function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <StyleRecipeProvider>
        <div id="root">
          {children}
        </div>
      </StyleRecipeProvider>
    </ThemeProvider>
  )
}
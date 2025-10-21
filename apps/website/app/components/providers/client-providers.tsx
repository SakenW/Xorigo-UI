'use client'

import { ThemeProvider } from '@xorigo-ui/system'
import { StyleRecipeProvider } from '@xorigo-ui/style-recipe'

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
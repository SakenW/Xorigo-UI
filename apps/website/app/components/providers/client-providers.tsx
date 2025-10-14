'use client'

import { ThemeProvider } from '@xorigo-ui/system'

export function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div id="root">
        {children}
      </div>
    </ThemeProvider>
  )
}
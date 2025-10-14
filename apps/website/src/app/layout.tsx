import { RootErrorBoundary } from '@/components/errors'
import { ThemeProvider } from '@/components/theme'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="xorigo-ui-theme">
          <RootErrorBoundary>
            {children}
          </RootErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}

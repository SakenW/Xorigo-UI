import { RootErrorBoundary } from '@/components/errors'
import { ThemeProvider } from '@/components/theme'
import { ErrorBoundary } from '@/components/monitoring/ErrorBoundary'
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="xorigo-ui-theme">
          <ErrorBoundary>
            <RootErrorBoundary>
              {children}
              <PerformanceMonitor />
            </RootErrorBoundary>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}

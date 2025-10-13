import { RootErrorBoundary } from '@/components/errors'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <RootErrorBoundary>
          {children}
        </RootErrorBoundary>
      </body>
    </html>
  )
}

import './globals.css'
import type { Metadata } from 'next'
import { ClientProviders } from './components/providers/client-providers'

export const metadata: Metadata = {
  title: 'Xorigo UI - 现代化 React UI 组件库',
  description: '基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 构建的现代化 React UI 组件库，提供丰富的组件、无障碍支持和灵活的主题系统',
  keywords: ['React', 'UI组件库', 'TypeScript', 'Tailwind CSS', '组件库', '前端', 'Xorigo UI'],
  authors: [{ name: 'Xorigo UI Team' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  },
  openGraph: {
    title: 'Xorigo UI - 现代化 React UI 组件库',
    description: '基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 构建的现代化 React UI 组件库',
    type: 'website',
    locale: 'zh_CN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

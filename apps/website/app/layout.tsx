import './globals.css'
import type { Metadata } from 'next'
import { ClientProviders } from './components/providers/client-providers'

export const metadata: Metadata = {
  title: 'Xorigo UI - 现代化 React UI 组件库',
  description: '基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 构建的现代化 React UI 组件库，提供丰富的组件、无障碍支持和灵活的主题系统',
  keywords: ['React', 'UI组件库', 'TypeScript', 'Tailwind CSS', '组件库', '前端', 'Xorigo UI'],
  authors: [{ name: 'Xorigo UI Team' }],
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
    <html lang="zh-CN" className="bg-black text-white" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      <body className="antialiased bg-black text-white" style={{ backgroundColor: '#000000', color: '#ffffff', margin: 0, padding: 0 }}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

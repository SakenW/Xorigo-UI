import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TH-UI - 现代化 React UI 组件库',
  description: '基于 TypeScript + Tailwind CSS 构建的现代化 React UI 组件库，提供丰富的组件、无障碍支持和灵活的主题系统',
  keywords: ['React', 'UI组件库', 'TypeScript', 'Tailwind CSS', '组件库', '前端'],
  authors: [{ name: 'TH-UI Team' }],
  openGraph: {
    title: 'TH-UI - 现代化 React UI 组件库',
    description: '基于 TypeScript + Tailwind CSS 构建的现代化 React UI 组件库',
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
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}

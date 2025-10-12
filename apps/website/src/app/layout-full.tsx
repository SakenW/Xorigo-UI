import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://th-ui.org'),
  title: {
    default: 'TH-UI - 现代化 React 组件库',
    template: '%s | TH-UI',
  },
  description: '基于 React 19 + TypeScript + Tailwind CSS 4 + Framer Motion 12 的现代化组件库。提供 39 个核心组件、七轴样式配方系统、OKLCH 色彩引擎和完整的可访问性支持。',
  keywords: [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'UI组件库',
    '设计系统',
    'Next.js',
    '组件库',
    '前端开发',
    'TH-UI',
  ],
  authors: [{ name: 'TH-UI Team', url: 'https://th-ui.org' }],
  creator: 'TH-UI Team',
  publisher: 'TH-UI Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://th-ui.org',
    title: 'TH-UI - 现代化 React 组件库',
    description: '基于 React 19 + TypeScript + Tailwind CSS 4 + Framer Motion 12 的现代化组件库',
    siteName: 'TH-UI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TH-UI 组件库',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TH-UI - 现代化 React 组件库',
    description: '基于 React 19 + TypeScript + Tailwind CSS 4 + Framer Motion 12 的现代化组件库',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
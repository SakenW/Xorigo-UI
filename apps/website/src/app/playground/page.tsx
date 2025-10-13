import { Suspense } from 'react'
import { PageErrorBoundary } from '@/components/errors'
import { PlaygroundClient } from '@/components/playground/playground-client'

export const metadata = {
  title: 'Playground | Xorigo UI',
  description: 'Xorigo UI 组件实时编辑器 - 在线体验 Xorigo UI 组件的强大功能，支持实时预览和七轴样式配方切换。',
}

export default function PlaygroundPage() {
  return (
    <PageErrorBoundary
      pageName="Playground"
      pagePath="/playground"
    >
      <div className="min-h-screen bg-background">
        <Suspense fallback={<PlaygroundSkeleton />}>
          <PlaygroundClient />
        </Suspense>
      </div>
    </PageErrorBoundary>
  )
}

function PlaygroundSkeleton() {
  return (
    <div className="flex h-screen">
      {/* 左侧编辑器区域骨架 */}
      <div className="w-1/2 border-r border-border">
        <div className="h-12 border-b border-border bg-muted px-4">
          <div className="h-6 w-32 mt-3 bg-muted animate-pulse rounded" />
        </div>
        <div className="p-4">
          <div className="h-full min-h-[600px] w-full bg-muted animate-pulse rounded" />
        </div>
      </div>

      {/* 右侧预览区域骨架 */}
      <div className="w-1/2">
        <div className="h-12 border-b border-border bg-muted px-4">
          <div className="h-6 w-24 mt-3 bg-muted animate-pulse rounded" />
        </div>
        <div className="p-4">
          <div className="h-full min-h-[600px] w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  )
}
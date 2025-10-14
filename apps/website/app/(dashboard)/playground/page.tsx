import { PlaygroundServer } from '@/components/playground/playground-server'

/**
 * Playground 页面 - RSC 优化版本
 * 使用动态导入和 Suspense 优化性能
 */
export default function Playground() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PlaygroundServer />
    </div>
  )
}
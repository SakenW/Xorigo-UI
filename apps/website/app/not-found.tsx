/**
 * 404 Not Found Page
 */
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        </div>
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            抱歉，您访问的页面不存在。
          </p>
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full"
            >
              返回首页
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full"
            >
              查看文档
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
/**
 * 404 Not Found Page
 */
import Link from 'next/link'
import { Button } from '@xorigo-ui/core'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        </div>
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            抱歉，您访问的页面不存在。
          </p>
          <div className="space-y-2">
            <Link href="/">
              <Button className="w-full">
                返回首页
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" className="w-full">
                查看文档
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
/**
 * 404 Not Found Page
 */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-gray-900">404</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
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
        </CardContent>
      </Card>
    </div>
  )
}
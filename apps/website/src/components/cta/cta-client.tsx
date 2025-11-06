'use client'

import { useState } from 'react'
import { Button } from "@xorigo-ui/core"
import { Card, CardContent } from "@xorigo-ui/core"
import { Input } from "@xorigo-ui/core"
import { Badge } from "@xorigo-ui/core"
import {
  ArrowRight,
  Github,
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  Sparkles
} from 'lucide-react'

interface CTAClientProps {
  showSubscription?: boolean
}

/**
 * CTA 客户端组件 - 处理所有交互逻辑
 * 包括按钮点击和表单提交
 */
export function CTAClient({ showSubscription = false }: CTAClientProps) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  if (showSubscription) {
    return (
      <div>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                加入社区
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                获取最新更新、技巧分享和社区资源
              </p>
            </div>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder="输入您的邮箱地址"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  订阅更新
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  订阅成功！
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  感谢您的关注，我们会定期向您发送最新动态
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                订阅即表示您同意接收我们的邮件通讯。您可以随时取消订阅。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <Button
        size="lg"
        className="text-base px-8 py-4 text-lg"
        onClick={() => window.location.href = '/docs'}
      >
        <BookOpen className="mr-2 h-5 w-5" />
        开始使用文档
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="text-base px-8 py-4 text-lg"
        onClick={() => window.open('https://github.com/xorigo-ui/xorigo-ui', '_blank')}
      >
        <Github className="mr-2 h-5 w-5" />
        查看 GitHub
      </Button>
    </div>
  )
}
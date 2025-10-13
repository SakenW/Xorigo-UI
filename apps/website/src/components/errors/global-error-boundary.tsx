'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo)

    // 在生产环境中，这里可以上报错误到监控服务
    if (process.env.NODE_ENV === 'production') {
      // 上报错误到监控服务
      // reportError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <html lang="zh-CN">
          <body>
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
              <Card className="w-full max-w-lg">
                <CardHeader>
                  <CardTitle className="text-center text-red-600">
                    应用程序错误
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    很抱歉，应用程序遇到了严重错误。
                  </p>

                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <div className="text-left p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="font-mono text-sm text-red-800 dark:text-red-200">
                        {this.state.error.message}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={() => window.location.reload()}
                      className="w-full"
                    >
                      重新加载应用
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      className="w-full"
                    >
                      返回首页
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </body>
        </html>
      )
    }

    return this.props.children
  }
}
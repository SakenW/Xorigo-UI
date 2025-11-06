'use client'

import { Button } from '@xorigo-ui/core'
import { ArrowRight, Github, BookOpen } from 'lucide-react'

/**
 * Hero 客户端组件 - 处理所有交互逻辑
 * 从服务端组件中分离出来的交互部分
 */
export function HeroClient() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        size="lg"
        className="text-base px-8 py-3"
        onClick={() => window.location.href = '/workbench?mode=gallery'}
      >
        开始探索
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="text-base px-8 py-3"
        onClick={() => window.open('https://github.com/xorigo-ui/xorigo-ui', '_blank')}
      >
        GitHub
      </Button>
    </div>
  )
}
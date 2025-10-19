/**
 * 测试客户端组件在其他路由是否工作
 */

'use client'

import { useState } from 'react'
import { Card } from '@xorigo-ui/core'

export default function TestClientPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl font-bold mb-4">🧪 客户端组件测试页面</h1>
      <p className="mb-6">这是一个独立的客户端组件测试页面。</p>

      <Card className="mb-6">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">客户端功能测试</h2>
          <button
            onClick={() => setCount(count + 1)}
            className="px-5 py-2.5 bg-blue-500 text-white border-0 rounded-md cursor-pointer mr-2.5 hover:bg-blue-600 transition-colors"
          >
            点击计数 (+1)
          </button>

          <div className="mt-2.5 p-2.5 bg-green-100 border border-green-300 rounded-md text-lg font-bold">
            计数器: {count}
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">测试目的</h2>
          <p className="mb-2">验证客户端组件在非 Workbench 路由下是否正常工作。</p>
          <p>如果这个页面正常显示，说明客户端组件本身是正常的，问题可能出在 Workbench 路由的特殊处理上。</p>
        </div>
      </Card>
    </div>
  )
}
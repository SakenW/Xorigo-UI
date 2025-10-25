/**
 * 组件测试页面
 * 用于验证修复后的组件是否能正常渲染
 */

import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'

export default function TestComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">组件测试页面</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Button 组件测试 */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Button 组件</h2>
              <div className="space-y-2">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </div>
          </Card>

          {/* Card 组件测试 */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Card 组件</h2>
              <p className="text-gray-600">这是一个测试卡片组件，用于验证主题系统修复是否生效。</p>
            </div>
          </Card>
        </div>

        {/* 组合测试 */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">组合测试</h2>
            <p className="text-gray-600 mb-4">在同一个页面中测试多个组件的主题系统兼容性。</p>
            <div className="flex gap-4">
              <Button variant="primary">按钮 1</Button>
              <Button variant="secondary">按钮 2</Button>
              <Button variant="outline">按钮 3</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
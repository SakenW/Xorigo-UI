'use client'

import { MasonryLayout } from '../../src/components/workbench/shared/masonry-layout'

export default function MasonryTestPage() {
  const testItems = [
    {
      id: 'item1',
      content: (
        <div className="p-4 bg-blue-100 rounded-lg">
          <h3>测试项目 1</h3>
          <p>高度: 180px</p>
        </div>
      ),
      height: 180
    },
    {
      id: 'item2',
      content: (
        <div className="p-4 bg-green-100 rounded-lg">
          <h3>测试项目 2</h3>
          <p>高度: 220px</p>
        </div>
      ),
      height: 220
    },
    {
      id: 'item3',
      content: (
        <div className="p-4 bg-yellow-100 rounded-lg">
          <h3>测试项目 3</h3>
          <p>高度: 160px</p>
        </div>
      ),
      height: 160
    },
    {
      id: 'item4',
      content: (
        <div className="p-4 bg-red-100 rounded-lg">
          <h3>测试项目 4</h3>
          <p>高度: 200px</p>
        </div>
      ),
      height: 200
    },
    {
      id: 'item5',
      content: (
        <div className="p-4 bg-purple-100 rounded-lg">
          <h3>测试项目 5</h3>
          <p>高度: 180px</p>
        </div>
      ),
      height: 180
    },
    {
      id: 'item6',
      content: (
        <div className="p-4 bg-pink-100 rounded-lg">
          <h3>测试项目 6</h3>
          <p>高度: 240px</p>
        </div>
      ),
      height: 240
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-8">瀑布流布局测试</h1>

      <div className="w-full max-w-6xl mx-auto">
        <MasonryLayout
          items={testItems}
          gap={16}
          enableAnimation={true}
        >
          {(item) => item.content}
        </MasonryLayout>
      </div>
    </div>
  )
}
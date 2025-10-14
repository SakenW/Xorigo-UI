/**
 * Components Module - 组件展示与获取
 * 核心职能：直观展示所有组件形态，快速复制使用
 * 不包含：编辑功能、组合器、项目模板
 */

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Components 组件库</h1>

        {/* 核心功能区 */}
        <div className="grid gap-6">
          {/* 搜索和筛选栏 */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">快速查找</h2>
            {/* TODO: 实现搜索和分类筛选 */}
          </section>

          {/* 组件展示网格 */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: 实现组件卡片展示 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Button 按钮</h3>
              <div className="space-y-4">
                {/* 展示所有变体 */}
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded">Primary</button>
                  <button className="px-4 py-2 border rounded">Secondary</button>
                </div>
                {/* 快速复制操作 */}
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600">复制代码</button>
                  <button className="text-sm text-blue-600">查看详情</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
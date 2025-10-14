/**
 * Tools Module - 独立开发辅助工具
 * 核心职能：专业工具集，每个工具完全独立运行
 * 不包含：组件编辑、项目管理、代码生成
 */

import Link from 'next/link'

const tools = [
  {
    id: 'matrix',
    name: '无障碍验证矩阵',
    description: 'WCAG 2.1 无障碍合规性验证',
    status: 'partial', // 40%已实现
    path: '/tools/matrix'
  },
  {
    id: 'color-contrast',
    name: '颜色对比度检查',
    description: '检查文本和背景色的对比度',
    status: 'planned',
    path: '/tools/color-contrast'
  },
  {
    id: 'theme-generator',
    name: '主题生成器',
    description: '创建自定义主题配色方案',
    status: 'planned',
    path: '/tools/theme-generator'
  },
  {
    id: 'spacing-scale',
    name: '间距计算器',
    description: '生成一致的间距系统',
    status: 'planned',
    path: '/tools/spacing-scale'
  },
  {
    id: 'a11y-checker',
    name: '无障碍检查器',
    description: '全面的无障碍性检查',
    status: 'planned',
    path: '/tools/a11y-checker'
  },
  {
    id: 'icon-maker',
    name: '图标制作器',
    description: '创建和编辑SVG图标',
    status: 'planned',
    path: '/tools/icon-maker'
  }
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tools 工具箱</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {tool.description}
              </p>

              <div className="flex items-center justify-between">
                {tool.status === 'partial' ? (
                  <Link
                    href={tool.path}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    打开工具 →
                  </Link>
                ) : (
                  <span className="text-gray-400">即将推出</span>
                )}

                <span className={`text-xs px-2 py-1 rounded ${
                  tool.status === 'partial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tool.status === 'partial' ? '部分完成' : '计划中'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
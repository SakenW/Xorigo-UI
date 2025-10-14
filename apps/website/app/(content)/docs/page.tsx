/**
 * Docs Module - 技术文档
 * 核心职能：技术参考和API文档
 * 不包含：交互式教程、视频内容、设计指南
 */

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex">
        {/* 侧边栏导航 */}
        <aside className="w-64 border-r min-h-screen p-6">
          <h2 className="font-bold text-lg mb-4">文档导航</h2>
          <nav className="space-y-2">
            <div className="font-semibold mt-4 mb-2">开始使用</div>
            <a href="/docs/getting-started" className="block pl-4 text-gray-600 hover:text-blue-600">
              快速开始
            </a>
            <a href="/docs/installation" className="block pl-4 text-gray-600 hover:text-blue-600">
              安装指南
            </a>
            <a href="/docs/configuration" className="block pl-4 text-gray-600 hover:text-blue-600">
              配置说明
            </a>

            <div className="font-semibold mt-4 mb-2">API参考</div>
            <a href="/docs/api/components" className="block pl-4 text-gray-600 hover:text-blue-600">
              组件API
            </a>
            <a href="/docs/api/hooks" className="block pl-4 text-gray-600 hover:text-blue-600">
              Hooks API
            </a>
            <a href="/docs/api/utils" className="block pl-4 text-gray-600 hover:text-blue-600">
              工具函数
            </a>

            <div className="font-semibold mt-4 mb-2">进阶</div>
            <a href="/docs/typescript" className="block pl-4 text-gray-600 hover:text-blue-600">
              TypeScript
            </a>
            <a href="/docs/migration" className="block pl-4 text-gray-600 hover:text-blue-600">
              迁移指南
            </a>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-4">Xorigo UI 文档</h1>
          <p className="text-lg text-gray-600 mb-8">
            完整的技术文档和API参考，帮助您快速集成和使用Xorigo UI组件库。
          </p>

          <div className="prose dark:prose-invert max-w-none">
            <h2>欢迎使用 Xorigo UI</h2>
            <p>
              Xorigo UI 是一个现代化的 React 组件库，提供了丰富的组件和工具，
              帮助您快速构建美观且功能强大的应用程序。
            </p>

            <h3>特性</h3>
            <ul>
              <li>基于 React 19 和 TypeScript 5.9</li>
              <li>完整的类型支持</li>
              <li>支持暗色模式</li>
              <li>高度可定制</li>
              <li>无障碍性支持</li>
            </ul>

            <h3>快速开始</h3>
            <p>请查看侧边栏的"快速开始"指南，了解如何在您的项目中使用 Xorigo UI。</p>
          </div>
        </main>
      </div>
    </div>
  )
}
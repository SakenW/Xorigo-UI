export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TH-UI 组件库</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            现代化的 React UI 组件库，基于 TypeScript + Tailwind CSS 构建
            <br />
            提供丰富的组件、无障碍支持和灵活的主题系统
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/gallery" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              查看组件
            </a>
            <a 
              href="/playground" 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              在线演示
            </a>
          </div>
        </div>
      </div>

      {/* 特性介绍 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">核心特性</h2>
          <p className="text-lg text-gray-600">为现代 Web 应用开发而生</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">现代化设计</h3>
            <p className="text-gray-600">
              基于设计系统构建，提供一致性和美观的界面组件
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">高性能</h3>
            <p className="text-gray-600">
              基于 React 19 和现代构建工具，确保最佳性能表现
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">♿</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">无障碍支持</h3>
            <p className="text-gray-600">
              遵循 WCAG 2.1 标准，为所有用户提供无障碍体验
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">TypeScript</h3>
            <p className="text-gray-600">
              完整的类型支持，提供出色的开发体验和代码质量
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">易于定制</h3>
            <p className="text-gray-600">
              灵活的主题系统，支持深度定制和品牌适配
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">响应式设计</h3>
            <p className="text-gray-600">
              移动优先的设计理念，适配各种设备和屏幕尺寸
            </p>
          </div>
        </div>
      </div>

      {/* 快速导航 */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">快速开始</h2>
            <p className="text-lg text-gray-600">探索组件库的主要功能</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧩</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">组件画廊</h3>
              <p className="text-gray-600 mb-4">
                浏览所有可用的 UI 组件和使用示例
              </p>
              <a 
                href="/gallery" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                查看组件 →
              </a>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">组件游乐场</h3>
              <p className="text-gray-600 mb-4">
                实时预览和编辑组件，体验交互式开发
              </p>
              <a 
                href="/playground" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                开始体验 →
              </a>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">无障碍矩阵</h3>
              <p className="text-gray-600 mb-4">
                验证组件的无障碍合规性和对比度检查
              </p>
              <a 
                href="/matrix" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                检查合规性 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

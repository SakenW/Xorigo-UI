import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* 404 头部 */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-gray-700">404</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            页面未找到
          </h1>
          <p className="text-gray-200 text-sm">
            您访问的页面可能不存在或已被移动
          </p>
        </div>

        {/* 内容区域 */}
        <div className="p-6 space-y-6">
          {/* 说明信息 */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              抱歉，我们找不到您要访问的页面。这可能是因为：
            </p>

            <ul className="text-sm text-gray-500 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>页面地址输入错误</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>页面已被移除或重命名</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>链接已过期或无效</span>
              </li>
            </ul>
          </div>

          {/* 搜索建议 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              建议操作
            </h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• 检查页面地址拼写</li>
              <li>• 返回上一页重新访问</li>
              <li>• 使用网站导航菜单</li>
              <li>• 搜索相关内容</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg text-center"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                返回首页
              </span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回上一页
              </span>
            </button>
          </div>

          {/* 热门链接 */}
          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            <p className="mb-3 font-medium">热门页面：</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/docs"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                文档
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/playground"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Playground
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/gallery"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                组件展示
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/matrix"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                配方矩阵
              </Link>
            </div>
          </div>

          {/* 帮助信息 */}
          <div className="text-center text-xs text-gray-500">
            <p>
              如果您认为这是一个错误，请{' '}
              <a
                href="https://github.com/yourusername/xorigo-ui/issues"
                className="text-gray-600 hover:text-gray-800 font-medium underline"
              >
                报告问题
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
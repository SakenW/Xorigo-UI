'use client'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Xorigo UI</h1>
        <p className="text-gray-600 mb-8">组件库开发中...</p>
        <a href="/error" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          测试错误页面
        </a>
      </div>
    </div>
  )
}

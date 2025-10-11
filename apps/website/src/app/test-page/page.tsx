'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">测试页面</h1>
        <p className="text-lg text-gray-600 mb-8">
          Next.js 15.5.4 + React 19.2.0
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800">✅ Next.js 版本已更新到 15.5.4</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-green-800">✅ 技术栈依赖已全面更新</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg">
            <p className="text-yellow-800">🔄 正在修复 TH-UI 组件导入问题</p>
          </div>
        </div>
      </div>
    </div>
  )
}
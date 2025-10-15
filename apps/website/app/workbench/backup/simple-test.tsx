/**
 * 简单测试页面 - 用于验证 Workbench 路由是否工作
 */

export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-4">Workbench 测试页面</h1>
      <p className="text-lg text-gray-600 mb-4">
        如果您能看到这个页面，说明 Workbench 路由正常工作。
      </p>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">路由测试成功！</h2>
        <p className="text-gray-600">
          Workbench 路由已经正确配置，Next.js 能够找到并渲染页面组件。
        </p>
      </div>
    </div>
  )
}
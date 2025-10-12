export default function Playground() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">组件游乐场</h1>
      <p className="text-lg text-gray-600 mb-8">
        实时预览和编辑 TH-UI 组件
      </p>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">按钮组件示例</h2>
        <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">主要按钮</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">次要按钮</button>
        </div>
      </div>
    </div>
  )
}

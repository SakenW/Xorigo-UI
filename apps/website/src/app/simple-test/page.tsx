export default function SimpleTestPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">
          🎨 Tailwind CSS 测试页面
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            如果你看到有样式，说明 Tailwind CSS 正常工作！
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold mb-2">蓝色卡片</h3>
              <p className="text-blue-600">这个卡片应该有蓝色背景</p>
            </div>

            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">绿色卡片</h3>
              <p className="text-green-600">这个卡片应该有绿色背景</p>
            </div>

            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">红色卡片</h3>
              <p className="text-red-600">这个卡片应该有红色背景</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
              主要按钮
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
              次要按钮
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
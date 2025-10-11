export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-2xl p-12 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          🎨 Tailwind CSS 测试
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          如果你看到这个页面有样式，说明 Tailwind CSS 正常工作！
        </p>

        <div className="space-y-4">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
            蓝色按钮
          </button>

          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
            绿色按钮
          </button>

          <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
            紫色按钮
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            渐变背景、阴影、圆角、过渡动画等 Tailwind 功能都已启用！
          </p>
        </div>
      </div>
    </div>
  )
}
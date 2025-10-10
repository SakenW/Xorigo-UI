import React from "react"

export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">
          TH-UI 简单测试页面
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">基础组件测试</h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-500 text-white rounded">
              <p>蓝色背景测试</p>
            </div>

            <div className="p-4 bg-green-500 text-white rounded">
              <p>绿色背景测试</p>
            </div>

            <div className="p-4 bg-red-500 text-white rounded">
              <p>红色背景测试</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">自定义变量测试</h2>
          <div className="p-4 rounded" style={{ backgroundColor: 'var(--color-primary)' }}>
            <p className="text-white font-semibold">Primary Color: var(--color-primary)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
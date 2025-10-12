'use client'

import { useState, useCallback } from 'react'

export default function Playground() {
  const [code, setCode] = useState('export default function ButtonExample() {\n  return (\n    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">\n      主要按钮\n    </button>\n  )\n}')
  const [activeTheme, setActiveTheme] = useState('light')

  // 复制代码
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code)
    alert('代码已复制到剪贴板!')
  }, [code])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧编辑器区域 */}
      <div className="w-1/2 flex flex-col border-r border-gray-200">
        {/* 编辑器头部 */}
        <div className="h-12 border-b border-gray-200 bg-gray-100 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-medium text-gray-900">代码编辑器</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              按钮组件
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCode('export default function ButtonExample() {\n  return (\n    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">\n      主要按钮\n    </button>\n  )\n}')}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            >
              重置
            </button>
            <button
              onClick={copyCode}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            >
              复制
            </button>
          </div>
        </div>

        {/* 示例选择器 */}
        <div className="border-b border-gray-200 bg-gray-100 px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setCode('export default function ButtonExample() {\n  return (\n    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">\n      主要按钮\n    </button>\n  )\n}')}
              className="px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap bg-blue-600 text-white"
            >
              按钮组件
            </button>
            <button
              onClick={() => setCode('export default function CardExample() {\n  return (\n    <div className="max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6">\n      <h3 className="text-lg font-semibold">卡片标题</h3>\n      <p className="text-gray-600">这是一个卡片组件示例。</p>\n    </div>\n  )\n}')}
              className="px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap bg-white text-gray-700 hover:bg-gray-200"
            >
              卡片组件
            </button>
            <button
              onClick={() => setCode('export default function FormExample() {\n  return (\n    <form className="space-y-4">\n      <input type="email" placeholder="邮箱" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />\n      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">提交</button>\n    </form>\n  )\n}')}
              className="px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap bg-white text-gray-700 hover:bg-gray-200"
            >
              表单组件
            </button>
          </div>
        </div>

        {/* 代码编辑器 */}
        <div className="flex-1 relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
            style={{ tabSize: 2 }}
            spellCheck={false}
          />
          <div className="absolute top-2 right-2 text-xs text-gray-500">
            {code.split('\n').length} 行
          </div>
        </div>
      </div>

      {/* 右侧预览区域 */}
      <div className="w-1/2 flex flex-col">
        {/* 预览头部 */}
        <div className="h-12 border-b border-gray-200 bg-gray-100 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-medium text-gray-900">实时预览</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              组件预览效果
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTheme(activeTheme === 'light' ? 'dark' : 'light')}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            >
              {activeTheme === 'light' ? '🌙 深色' : '☀️ 浅色'}
            </button>
          </div>
        </div>

        {/* 预览内容 */}
        <div className={activeTheme === 'dark' ? 'flex-1 p-6 overflow-auto bg-gray-900' : 'flex-1 p-6 overflow-auto bg-gray-50'}>
          <div className="min-h-full flex items-center justify-center">
            <div className={activeTheme === 'dark' ? 'w-full max-w-4xl rounded-lg shadow-sm border p-6 bg-gray-800 border-gray-700 text-white' : 'w-full max-w-4xl rounded-lg shadow-sm border p-6 bg-white border-gray-200 text-gray-900'}>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">组件预览</h3>
                <p className={activeTheme === 'dark' ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>
                  这是在 {activeTheme === 'dark' ? '深色' : '浅色'} 主题下的预览效果
                </p>
              </div>

              <div className={activeTheme === 'dark' ? 'border-2 border-dashed rounded-lg p-8 border-gray-600' : 'border-2 border-dashed rounded-lg p-8 border-gray-300'}>
                {/* 预览提示 */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <span>⚡</span>
                    <span>实时预览区域</span>
                  </div>
                </div>

                {/* 显示当前代码的缩略版本 */}
                <div className={activeTheme === 'dark' ? 'text-sm font-mono p-4 rounded-lg mb-4 bg-gray-700' : 'text-sm font-mono p-4 rounded-lg mb-4 bg-gray-100'}>
                  <div className="text-xs mb-2 opacity-60">当前代码片段：</div>
                  <div className="max-h-32 overflow-y-auto">
                    {code.split('\n').slice(0, 10).map((line, index) => (
                      <div key={index} className="leading-relaxed">
                        {line || <span>&nbsp;</span>}
                      </div>
                    ))}
                    {code.split('\n').length > 10 && (
                      <div className="text-xs opacity-40 mt-2">... 还有 {code.split('\n').length - 10} 行</div>
                    )}
                  </div>
                </div>

                {/* 简单的预览效果 */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      示例按钮
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      次要按钮
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

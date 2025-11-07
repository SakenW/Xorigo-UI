'use client'

import { useState } from 'react'

export default function ErrorTestPage() {
  const [copied, setCopied] = useState(false)
  const errorInfo = `Error: 测试错误信息
Stack: This is a mock error for testing copy functionality
Time: ${new Date().toISOString()}`

  const copyErrorInfo = async () => {
    try {
      await navigator.clipboard.writeText(errorInfo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    }
  }

  const triggerError = () => {
    throw new Error('这是一个测试错误')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          错误信息测试页面
        </h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">错误信息复制测试</h2>
            <div className="bg-gray-100 rounded-lg p-4 relative">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap mb-4">
                {errorInfo}
              </pre>
              <button
                onClick={copyErrorInfo}
                className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {copied ? '已复制!' : '复制'}
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">触发测试错误</h2>
            <button
              onClick={triggerError}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              触发一个错误 (测试错误边界)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { PageErrorBoundary } from '@/components/errors'
import { PlaygroundErrorBoundary } from '@/components/errors'
import { MDXErrorBoundary } from '@/components/errors'

export const metadata = {
  title: '错误边界测试 | Xorigo UI',
  description: '测试三层错误边界系统的功能',
}

function ComponentWithError() {
  throw new Error('这是一个测试错误！')
}

function AsyncComponentWithError() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('这是一个异步触发的错误！')
  }

  return (
    <div className="p-4 border border-gray-300 rounded">
      <p className="mb-2">这是一个可以触发错误的组件</p>
      <button
        onClick={() => setShouldError(true)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        触发错误
      </button>
    </div>
  )
}

export default function ErrorBoundaryTestPage() {
  const [testMode, setTestMode] = useState<'page' | 'playground' | 'mdx' | 'none'>('none')

  return (
    <PageErrorBoundary
      pageName="错误边界测试页面"
      pagePath="/test-error-boundaries"
    >
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              错误边界系统测试
            </h1>
            <p className="text-gray-600 mb-6">
              这个页面用于测试三层错误边界系统：RootErrorBoundary、PageErrorBoundary、PlaygroundErrorBoundary 和 MDXErrorBoundary。
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">测试说明：</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• <strong>页面级错误</strong>：整个页面的错误，会被 PageErrorBoundary 捕获</li>
                <li>• <strong>Playground 错误</strong>：Playground 区域的错误，会被 PlaygroundErrorBoundary 捕获</li>
                <li>• <strong>MDX 错误</strong>：MDX 渲染错误，会被 MDXErrorBoundary 捕获</li>
                <li>• <strong>应用级错误</strong>：严重的应用错误，会被 RootErrorBoundary 捕获</li>
              </ul>
            </div>

            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setTestMode('page')}
                className={`px-4 py-2 rounded font-medium ${
                  testMode === 'page'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                测试页面错误
              </button>
              <button
                onClick={() => setTestMode('playground')}
                className={`px-4 py-2 rounded font-medium ${
                  testMode === 'playground'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                测试 Playground 错误
              </button>
              <button
                onClick={() => setTestMode('mdx')}
                className={`px-4 py-2 rounded font-medium ${
                  testMode === 'mdx'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                测试 MDX 错误
              </button>
              <button
                onClick={() => setTestMode('none')}
                className={`px-4 py-2 rounded font-medium ${
                  testMode === 'none'
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                清除测试
              </button>
            </div>

            {testMode === 'page' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-900 mb-2">页面级错误测试</h3>
                <p className="text-red-800 mb-4">
                  点击下面的按钮触发一个页面级错误，这会被 PageErrorBoundary 捕获。
                </p>
                <ComponentWithError />
              </div>
            )}

            {testMode === 'playground' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-purple-900 mb-2">Playground 错误测试</h3>
                <p className="text-purple-800 mb-4">
                  下面的区域被 PlaygroundErrorBoundary 包裹，错误不会影响页面其他部分。
                </p>
                <PlaygroundErrorBoundary>
                  <AsyncComponentWithError />
                </PlaygroundErrorBoundary>
              </div>
            )}

            {testMode === 'mdx' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-amber-900 mb-2">MDX 错误测试</h3>
                <p className="text-amber-800 mb-4">
                  下面的区域被 MDXErrorBoundary 包裹，用于模拟 MDX 渲染错误。
                </p>
                <MDXErrorBoundary>
                  <div className="prose max-w-none">
                    <h2>模拟 MDX 内容</h2>
                    <p>这是一个模拟的 MDX 内容渲染区域。</p>
                    <div className="bg-gray-100 p-4 rounded">
                      <code>{`{this.will.causeError()}`}</code>
                    </div>
                    <ComponentWithError />
                  </div>
                </MDXErrorBoundary>
              </div>
            )}

            {testMode === 'none' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2">错误边界系统正常运行</h3>
                <p className="text-green-800">
                  选择上方的测试模式来测试不同层级的错误边界。
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">错误边界层级</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                    <span>RootErrorBoundary (应用级)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-indigo-500 rounded-full mr-2"></div>
                    <span>PageErrorBoundary (页面级)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                    <span>PlaygroundErrorBoundary (功能级)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
                    <span>MDXErrorBoundary (功能级)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">错误处理特性</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>✅ 错误捕获和分类</div>
                  <div>✅ 友好的错误提示</div>
                  <div>✅ 错误恢复机制</div>
                  <div>✅ 错误日志记录</div>
                  <div>✅ 开发/生产模式区分</div>
                  <div>✅ 响应式设计支持</div>
                  <div>✅ 键盘导航 (WCAG)</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                测试完成后，您可以查看浏览器控制台了解错误处理的详细信息。
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageErrorBoundary>
  )
}
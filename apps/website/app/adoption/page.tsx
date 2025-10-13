import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '快速开始 - Xorigo UI',
  description: '快速开始使用 Xorigo UI 组件库，包含安装指南和基础使用示例',
  keywords: ['快速开始', '安装指南', 'React', 'UI组件库'],
}

export default function AdoptionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              快速开始
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              三步即可在您的项目中使用 Xorigo UI 组件库
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 安装步骤 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            安装步骤
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute top-0 left-0 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-lg">
                1
              </div>
              <div className="ml-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  安装包
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-green-400">$</div>
                  <div>npm install @xorigo-ui/core</div>
                </div>
                <p className="text-gray-600">
                  使用 npm、yarn 或 pnpm 安装 Xorigo UI 核心包
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute top-0 left-0 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-lg">
                2
              </div>
              <div className="ml-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  配置 Tailwind CSS
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-green-400">// tailwind.config.js</div>
                  <div>module.exports = {'{}'}</div>
                  <div>  content: [</div>
                  <div>{`    "./src/**/*.{js,ts,jsx,tsx}",`}</div>
                  <div>{`    "./node_modules/@xorigo-ui/**/*.{js,ts,jsx,tsx}"`}</div>
                  <div>  ]</div>
                  <div>{'}'}</div>
                </div>
                <p className="text-gray-600">
                  在 Tailwind 配置中包含 Xorigo UI 组件路径
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute top-0 left-0 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-lg">
                3
              </div>
              <div className="ml-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  使用组件
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-green-400">// App.tsx</div>
                  <div>{`import { Button, Card } from '@xorigo-ui/core'`}</div>
                  <div className="mt-2"></div>
                  <div>{`export default function App() {`}</div>
                  <div>  return (</div>
                  <div>    &lt;Card&gt;</div>
                  <div>      &lt;Button variant="primary"&gt;Click me&lt;/Button&gt;</div>
                  <div>    &lt;/Card&gt;</div>
                  <div>  )</div>
                  <div>{'}'}</div>
                </div>
                <p className="text-gray-600">
                  直接导入并使用任何 Xorigo UI 组件
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            为什么选择 Xorigo UI？
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">性能优先</h3>
              <p className="text-gray-600 text-sm">
                优化的组件性能，确保应用流畅运行
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">设计令牌</h3>
              <p className="text-gray-600 text-sm">
                完整的设计令牌系统，确保视觉一致性
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">TypeScript</h3>
              <p className="text-gray-600 text-sm">
                完整的 TypeScript 支持，提供最佳开发体验
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">完整文档</h3>
              <p className="text-gray-600 text-sm">
                详细的文档和示例，快速上手开发
              </p>
            </div>
          </div>
        </div>

        {/* 示例代码 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            快速示例
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">基础组件</h3>
              <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm">
                <div className="text-green-400 mb-2">// 基础按钮组件</div>
                <div>{`import { Button, Badge, Input } from '@xorigo-ui/core'`}</div>
                <div className="mt-2"></div>
                <div>{`function Example() {`}</div>
                <div>  return (</div>
                <div>    &lt;div className="space-y-4"&gt;</div>
                <div>      &lt;Button variant="primary"&gt;主要按钮&lt;/Button&gt;</div>
                <div>      &lt;Button variant="secondary"&gt;次要按钮&lt;/Button&gt;</div>
                <div>      &lt;Input placeholder="输入内容..." /&gt;</div>
                <div>      &lt;Badge variant="success"&gt;成功&lt;/Badge&gt;</div>
                <div>    &lt;/div&gt;</div>
                <div>  )</div>
                <div>{'}'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">表单组件</h3>
              <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm">
                <div className="text-green-400 mb-2">// 表单布局组件</div>
                <div>{`import { Card, Form, Select, Textarea } from '@xorigo-ui/core'`}</div>
                <div className="mt-2"></div>
                <div>{`function ContactForm() {`}</div>
                <div>  return (</div>
                <div>    &lt;Card&gt;</div>
                <div>      &lt;Form&gt;</div>
                <div>        &lt;Select placeholder="选择类型" /&gt;</div>
                <div>        &lt;Textarea placeholder="留言..." /&gt;</div>
                <div>        &lt;Button type="submit"&gt;提交&lt;/Button&gt;</div>
                <div>      &lt;/Form&gt;</div>
                <div>    &lt;/Card&gt;</div>
                <div>  )</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 下一步 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            开始探索
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            现在您可以探索更多组件和功能
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              浏览组件文档
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              试用 Playground
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
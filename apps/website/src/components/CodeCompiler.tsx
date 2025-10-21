'use client'

/**
 * 在线代码编译器组件
 *
 * 功能：
 * - 实时代码编辑
 * - 一键编译
 * - 结果展示
 * - 错误处理
 */

import { useState } from 'react'
import type { CompileRequest, CompileResponse } from '../app/api/compile/types'

const defaultCode = `const greeting: string = "Hello, Xorigo UI!";
console.log(greeting);`

export default function CodeCompiler() {
  const [code, setCode] = useState<string>(defaultCode)
  const [result, setResult] = useState<CompileResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({
    loader: 'ts' as const,
    target: 'es2020' as const,
    minify: false,
    sourcemap: false,
  })

  const handleCompile = async () => {
    setLoading(true)
    setResult(null)

    try {
      const requestBody: CompileRequest = {
        code,
        config,
      }

      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data: CompileResponse = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: '网络错误',
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="code-compiler p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">在线代码编译器</h1>

      {/* 配置选项 */}
      <div className="config-panel mb-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">编译配置</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loader</label>
            <select
              value={config.loader}
              onChange={(e) => setConfig({ ...config, loader: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              <option value="tsx">TSX</option>
              <option value="ts">TypeScript</option>
              <option value="jsx">JSX</option>
              <option value="js">JavaScript</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target</label>
            <select
              value={config.target}
              onChange={(e) => setConfig({ ...config, target: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              <option value="es2020">ES2020</option>
              <option value="esnext">ESNext</option>
              <option value="es2015">ES2015</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.minify}
                onChange={(e) => setConfig({ ...config, minify: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">压缩代码</span>
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.sourcemap}
                onChange={(e) => setConfig({ ...config, sourcemap: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm">源码映射</span>
            </label>
          </div>
        </div>
      </div>

      {/* 代码编辑器 */}
      <div className="editor-panel mb-4">
        <h2 className="text-xl font-semibold mb-3">源代码</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入 TypeScript/TSX 代码..."
          spellCheck={false}
        />
        <div className="text-sm text-gray-600 mt-2">
          代码长度: {code.length} / 10000 字符
        </div>
      </div>

      {/* 编译按钮 */}
      <button
        onClick={handleCompile}
        disabled={loading || !code.trim()}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
          loading || !code.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {loading ? '编译中...' : '编译代码'}
      </button>

      {/* 结果展示 */}
      {result && (
        <div className="result-panel mt-6">
          {result.success ? (
            <>
              <h2 className="text-xl font-semibold mb-3 text-green-600">✓ 编译成功</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">编译后的 JavaScript:</h3>
                <pre className="bg-white p-4 rounded border overflow-x-auto text-sm">
                  <code>{result.code}</code>
                </pre>

                {result.map && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-semibold">
                      源码映射
                    </summary>
                    <pre className="bg-white p-4 rounded border overflow-x-auto text-xs mt-2">
                      <code>{result.map}</code>
                    </pre>
                  </details>
                )}

                {result.warnings && result.warnings.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-yellow-600">⚠️ 编译警告:</h3>
                    <ul className="list-disc list-inside text-yellow-700 mt-2">
                      {result.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-3 text-red-600">✗ 编译失败</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-700">{result.error}</h3>
                {result.details && (
                  <pre className="mt-2 p-3 bg-white rounded border text-sm text-red-600 overflow-x-auto">
                    {result.details}
                  </pre>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* 使用提示 */}
      <div className="tips-panel mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">💡 使用提示</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>支持 TypeScript、TSX、JSX、JavaScript 代码</li>
          <li>代码长度限制：10KB (10,000 字符)</li>
          <li>编译超时限制：5 秒</li>
          <li>出于安全考虑，禁止使用 Node.js 内置模块 (fs, child_process 等)</li>
          <li>支持代码压缩和 Source Map 生成</li>
        </ul>
      </div>
    </div>
  )
}

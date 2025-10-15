/**
 * Workbench 调试页面 - 服务器端组件
 * 用于测试不同的渲染策略
 */

'use client'

import { useState, Suspense } from 'react'
import HybridWrapper from './hybrid-wrapper'

export default function DebugWorkbenchPage() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>🔧 Workbench 客户端组件调试页面</h1>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h2>调试说明</h2>
        <p>这个页面用于测试不同类型的客户端组件是否能正常渲染：</p>
        <ol>
          <li><strong>混合包装器</strong>：服务器组件 + 动态导入的客户端组件</li>
          <li><strong>基础客户端组件</strong>：使用 React.createElement 的最简单组件</li>
          <li><strong>无钩子客户端组件</strong>：不使用任何 React Hooks 的组件</li>
        </ol>
        <p><em>如果某个组件显示 404 错误，说明该类型的客户端组件无法正常渲染。</em></p>
      </div>

      {/* 测试 1: 混合包装器 */}
      <section style={{ marginBottom: '30px' }}>
        <h3>🟢 测试 1: 混合包装器 (服务器 + 客户端)</h3>
        <HybridWrapper />
      </section>

      {/* 测试 2: 基础客户端组件 */}
      <section style={{ marginBottom: '30px' }}>
        <h3>🔵 测试 2: 基础客户端组件</h3>
        <Suspense fallback={
          <div style={{
            padding: '20px',
            backgroundColor: '#d1ecf1',
            border: '1px solid #bee5eb',
            borderRadius: '4px'
          }}>
            Suspense 加载基础客户端组件...
          </div>
        }>
          <BareClientComponent />
        </Suspense>
      </section>

      {/* 测试 3: 无钩子客户端组件 */}
      <section style={{ marginBottom: '30px' }}>
        <h3>🟡 测试 3: 无钩子客户端组件</h3>
        <Suspense fallback={
          <div style={{
            padding: '20px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px'
          }}>
            Suspense 加载无钩子客户端组件...
          </div>
        }>
          <NoHooksClientComponent />
        </Suspense>
      </section>

      {/* 调试信息 */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h3>🔍 调试信息</h3>
        <ul>
          <li><strong>当前页面类型</strong>: 服务器端组件</li>
          <li><strong>动态导入策略</strong>: ssr: false (仅客户端渲染)</li>
          <li><strong>Suspense 包装</strong>: 是 (提供加载状态)</li>
          <li><strong>Next.js 版本</strong>: 15 App Router</li>
        </ul>

        <div style={{ marginTop: '15px', fontSize: '14px', color: '#6c757d' }}>
          <p><strong>预期结果：</strong></p>
          <ul>
            <li>如果所有测试都正常显示 → 客户端组件可以正常工作</li>
            <li>如果只有测试1正常 → 需要使用动态导入策略</li>
            <li>如果所有测试都显示404 → Workbench 路由存在根本性问题</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
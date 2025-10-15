/**
 * 服务器端组件包装器
 * 动态导入客户端组件
 */

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 动态导入客户端组件，禁用 SSR
const SimpleClientComponent = dynamic(
  () => import('./hybrid-test').then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div style={{
        padding: '20px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        color: '#856404'
      }}>
        正在加载客户端组件...
      </div>
    )
  }
)

export default function HybridWrapper() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#e8f5e8',
      border: '2px solid #28a745',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h1>服务器端组件包装器</h1>
      <p>这个组件由服务器渲染，下面包装了一个客户端组件：</p>

      <Suspense fallback={
        <div style={{
          padding: '20px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '4px',
          color: '#0c5460'
        }}>
          Suspense 加载中...
        </div>
      }>
        <SimpleClientComponent />
      </Suspense>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>测试说明：</strong>
        <ul>
          <li>绿色边框：服务器端组件（应该总是可见）</li>
          <li>蓝色边框：客户端组件（测试是否正常渲染）</li>
          <li>黄色边框：加载状态（动态导入过程中）</li>
        </ul>
      </div>
    </div>
  )
}
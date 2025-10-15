/**
 * 在 (marketing) 路由组内测试客户端组件
 */

'use client'

import { useState } from 'react'

export default function ClientTestInMarketing() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 (marketing) 路由组内的客户端组件测试</h1>
      <p>测试客户端组件在 (marketing) 路由组内是否正常工作。</p>

      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h2>客户端功能测试</h2>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          点击计数 (+1)
        </button>

        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          计数器: {count}
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h2>测试结果分析</h2>
        <p><strong>如果这个页面正常显示：</strong></p>
        <ul>
          <li>✅ 客户端组件在 (marketing) 路由组内正常工作</li>
          <li>❌ 问题可能出在根级别路由上</li>
          <li>🔧 需要检查根级别路由的特殊配置</li>
        </ul>
        <p><strong>如果这个页面显示 404：</strong></p>
        <ul>
          <li>❌ 所有客户端组件都有问题</li>
          <li>🔧 首页的客户端组件可能也被服务器端渲染替代了</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: '#007bff', marginRight: '10px' }}>返回首页</a>
        <a href="/workbench" style={{ color: '#007bff' }}>前往 Workbench</a>
      </div>
    </div>
  )
}
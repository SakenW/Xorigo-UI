/**
 * 测试客户端组件在其他路由是否工作
 */

'use client'

import { useState } from 'react'

export default function TestClientPage() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 客户端组件测试页面</h1>
      <p>这是一个独立的客户端组件测试页面。</p>

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
        <h2>测试目的</h2>
        <p>验证客户端组件在非 Workbench 路由下是否正常工作。</p>
        <p>如果这个页面正常显示，说明客户端组件本身是正常的，问题可能出在 Workbench 路由的特殊处理上。</p>
      </div>
    </div>
  )
}
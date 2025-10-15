/**
 * 混合服务器/客户端组件测试
 * 使用服务器端组件包装客户端组件
 */

'use client'

import React, { useState } from 'react'

// 最简单的客户端组件，使用状态
function SimpleClientComponent() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      border: '2px solid #333',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h2>混合客户端组件测试</h2>
      <p>这个组件使用了 React useState Hook</p>
      <p>计数器: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        点击 +1
      </button>
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        如果能看到这个按钮并点击，说明客户端组件正常工作
      </div>
    </div>
  )
}

export default SimpleClientComponent
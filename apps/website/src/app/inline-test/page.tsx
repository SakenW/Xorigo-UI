export default function InlineTestPage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#2563eb',
          marginBottom: '24px'
        }}>
          🎨 内联样式测试页面
        </h1>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: '18px',
            color: '#374151',
            marginBottom: '16px'
          }}>
            如果你看到这个页面有颜色和布局，说明基础样式工作正常！
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: '#dbeafe',
              border: '2px solid #60a5fa',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ color: '#1e40af', fontWeight: '600', marginBottom: '8px' }}>
                蓝色卡片
              </h3>
              <p style={{ color: '#2563eb' }}>
                这个卡片应该有蓝色背景
              </p>
            </div>

            <div style={{
              backgroundColor: '#dcfce7',
              border: '2px solid #4ade80',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ color: '#166534', fontWeight: '600', marginBottom: '8px' }}>
                绿色卡片
              </h3>
              <p style={{ color: '#16a34a' }}>
                这个卡片应该有绿色背景
              </p>
            </div>

            <div style={{
              backgroundColor: '#fee2e2',
              border: '2px solid #f87171',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h3 style={{ color: '#991b1b', fontWeight: '600', marginBottom: '8px' }}>
                红色卡片
              </h3>
              <p style={{ color: '#dc2626' }}>
                这个卡片应该有红色背景
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}>
              主要按钮
            </button>
            <button style={{
              backgroundColor: '#e5e7eb',
              color: '#1f2937',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}>
              次要按钮
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
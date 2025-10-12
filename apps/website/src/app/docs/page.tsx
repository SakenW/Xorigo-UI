import Link from 'next/link'

export default function DocsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right bottom, #dbeafe, #ffffff, #f3e8ff)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          padding: '80px 0'
        }}>
          <Link
            href="/"
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '32px',
              display: 'inline-block'
            }}
          >
            ← 返回首页
          </Link>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px',
            lineHeight: 1.2
          }}>
            Xorigo UI 文档
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#4b5563',
            marginBottom: '32px',
            maxWidth: '900px',
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            完整的开发文档，帮助你快速上手 Xorigo UI 组件库
          </p>
        </div>

        {/* Quick Start */}
        <div style={{
          backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '32px',
            marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px'
          }}>
            🚀 快速开始
          </h2>
          <p style={{
            color: '#6b7280',
            lineHeight: 1.6,
            marginBottom: '24px'
          }}>
            通过简单的几个步骤，你就可以在项目中使用 Xorigo UI 组件库。
          </p>

          <div style={{
            display: 'grid',
            gap: '24px'
          }}>
            {/* Step 1 */}
            <div style={{
              borderLeft: '4px solid #2563eb',
              paddingLeft: '16px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                步骤 1: 安装依赖
              </h3>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                npm install @xorigo-ui/core framer-motion
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              borderLeft: '4px solid #2563eb',
              paddingLeft: '16px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                步骤 2: 配置主题
              </h3>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                {`import { ThemeProvider } from '@xorigo-ui/core'

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}`}
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              borderLeft: '4px solid #2563eb',
              paddingLeft: '16px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                步骤 3: 使用组件
              </h3>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                {`import { Button, Card } from '@xorigo-ui/core'

function Example() {
  return (
    <Card>
      <Button variant="primary">
        点击我
      </Button>
    </Card>
  )
}`}
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* API Reference */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📚</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              API 参考
            </h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '16px' }}>
              详细的组件 API 文档，包含所有 props 和用法示例
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {['Button 组件', 'Input 组件', 'Modal 组件', 'Table 组件'].map((item) => (
                <div key={item} style={{
                  padding: '8px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Guides */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🎯</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              使用指南
            </h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '16px' }}>
              从基础到高级的使用指南，帮助你快速掌握 Xorigo UI
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {['主题定制', '响应式设计', '动画效果', '可访问性'].map((item) => (
                <div key={item} style={{
                  padding: '8px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💡</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              示例代码
            </h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '16px' }}>
              实际应用场景的代码示例，直接复制使用
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {['登录表单', '数据表格', '导航菜单', '弹窗组件'].map((item) => (
                <div key={item} style={{
                  padding: '8px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support */}
        <div style={{
          background: 'linear-gradient(to right, #2563eb, #7c3aed)',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            需要帮助？
          </h2>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            如果你在使用过程中遇到问题，可以通过以下方式获得帮助
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              href="https://github.com/xorigo-ui/xorigo-ui/issues"
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              GitHub Issues
            </Link>
            <Link
              href="https://github.com/xorigo-ui/xorigo-ui/discussions"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Discussions
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
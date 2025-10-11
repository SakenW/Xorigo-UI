import Link from 'next/link'

export default function HomePage() {
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
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          padding: '80px 0'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '24px',
            lineHeight: 1.2
          }}>
            TH-UI
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#4b5563',
            marginBottom: '32px',
            maxWidth: '900px',
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            基于 React 19 + TypeScript + Tailwind CSS 4 + Framer Motion 12 的现代化组件库
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link
              href="/components"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background-color 0.2s ease'
              }}
            >
              查看组件
            </Link>
            <Link
              href="/docs"
              style={{
                backgroundColor: '#f3f4f6',
                color: '#111827',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background-color 0.2s ease'
              }}
            >
              文档
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          padding: '80px 0'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎨</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              现代化设计
            </h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
              基于现代设计理念，提供 39 个高质量组件
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              高性能
            </h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
              基于 React 19 和 Framer Motion 12，极致的性能优化
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px'
            }}>
              开发体验
            </h3>
            <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
              完整的 TypeScript 支持和开发工具
            </p>
          </div>
        </div>

        {/* Components Preview */}
        <div style={{ padding: '80px 0' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#111827',
            marginBottom: '48px'
          }}>
            核心组件预览
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Button */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Button
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Primary Button
                </button>
                <button style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  color: '#111827',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Secondary Button
                </button>
              </div>
            </div>

            {/* Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Card
              </h3>
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{
                  color: '#2563eb',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Card Title
                </div>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.5
                }}>
                  This is a card component with beautiful styling.
                </p>
              </div>
            </div>

            {/* Input */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Input
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter text here"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <input
                  type="email"
                  placeholder="Enter email"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Badge */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Badge
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Blue
                </span>
                <span style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Green
                </span>
                <span style={{
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Red
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(to right, #2563eb, #7c3aed)',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '80px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>
            开始使用 TH-UI
          </h2>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            立即在你的项目中集成 TH-UI，享受现代化的组件库带来的开发体验提升
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link
              href="/docs/installation"
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              快速开始
            </Link>
            <Link
              href="https://github.com/th-ui/th-ui"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
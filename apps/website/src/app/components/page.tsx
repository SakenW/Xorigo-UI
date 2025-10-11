import Link from 'next/link'

export default function ComponentsPage() {
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
            TH-UI 组件库
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#4b5563',
            marginBottom: '32px',
            maxWidth: '900px',
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            39 个高质量组件，涵盖现代应用开发所需的核心功能
          </p>
        </div>

        {/* Component Categories */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          padding: '40px 0'
        }}>
          {/* Core Components */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎯 核心组件
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              基础UI组件，构成所有界面的基础元素
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {['Button', 'Input', 'Card', 'Avatar', 'Badge'].map((component) => (
                <span
                  key={component}
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {component}
                </span>
              ))}
            </div>
          </div>

          {/* Layout Components */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📐 布局组件
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              用于页面布局和结构的高级组件
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {['Header', 'Sidebar', 'Container', 'Grid', 'Divider'].map((component) => (
                <span
                  key={component}
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {component}
                </span>
              ))}
            </div>
          </div>

          {/* Form Components */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📝 表单组件
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              完整的表单控件和数据输入组件
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {['Form', 'Field', 'Select', 'Checkbox', 'Radio'].map((component) => (
                <span
                  key={component}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {component}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback Components */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💬 反馈组件
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              用户反馈和状态指示组件
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {['Alert', 'Modal', 'Tooltip', 'Loading', 'Progress'].map((component) => (
                <span
                  key={component}
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {component}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Components */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🧭 导航组件
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              网站导航和路由相关组件
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {['Tabs', 'Breadcrumb', 'Pagination', 'Menu', 'Breadcrumb'].map((component) => (
                <span
                  key={component}
                  style={{
                    backgroundColor: '#e9d5ff',
                    color: '#6b21a8',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {component}
                </span>
              ))}
            </div>
          </div>

          {/* Data Display */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 数据展示
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              数据展示和表格相关组件
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {['Table', 'DataTable', 'List', 'Card', 'Chart'].map((component) => (
                <span
                  key={component}
                  style={{
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {component}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{
          padding: '80px 0',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '48px'
          }}>
            为什么选择 TH-UI？
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            <div>
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
                基于现代设计原则，提供美观一致的用户界面
              </p>
            </div>
            <div>
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
                基于 React 19 和 Framer Motion，确保极致性能
              </p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                TypeScript 支持
              </h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
                完整的 TypeScript 类型定义，提供优秀的开发体验
              </p>
            </div>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎭</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                主题系统
              </h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
                支持多主题切换，满足不同品牌和用户需求
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
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
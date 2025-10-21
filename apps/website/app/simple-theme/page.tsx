'use client'

import React, { useState } from 'react'

export default function SimpleThemePage() {
  const [theme, setTheme] = useState({
    mode: 'light',
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    surface: '#f3f4f6',
  })

  const themes = [
    {
      name: '企业蓝调',
      config: {
        mode: 'light',
        primary: '#3b82f6',
        secondary: '#6b7280',
        background: '#ffffff',
        surface: '#f3f4f6',
      }
    },
    {
      name: '暗色模式',
      config: {
        mode: 'dark',
        primary: '#60a5fa',
        secondary: '#9ca3af',
        background: '#111827',
        surface: '#374151',
      }
    },
    {
      name: '创意紫色',
      config: {
        mode: 'light',
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        background: '#faf5ff',
        surface: '#ede9fe',
      }
    },
    {
      name: '温暖橙色',
      config: {
        mode: 'light',
        primary: '#f97316',
        secondary: '#fb923c',
        background: '#fff7ed',
        surface: '#fed7aa',
      }
    },
    {
      name: '科技青色',
      config: {
        mode: 'dark',
        primary: '#06b6d4',
        secondary: '#22d3ee',
        background: '#083344',
        surface: '#164e63',
      }
    },
    {
      name: '自然绿色',
      config: {
        mode: 'light',
        primary: '#10b981',
        secondary: '#34d399',
        background: '#f0fdf4',
        surface: '#dcfce7',
      }
    }
  ]

  return (
    <div style={{ backgroundColor: theme.background, color: theme.mode === 'dark' ? '#ffffff' : '#000000', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      {/* 页面头部 */}
      <div style={{ borderBottom: `1px solid ${theme.secondary}20`, padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            🎨 七轴主题系统 - 简化演示
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
            点击下方按钮体验实时主题切换效果
          </p>
        </div>
      </div>

      {/* 主要内容 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* 当前主题信息 */}
        <div style={{
          backgroundColor: theme.surface,
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          border: `1px solid ${theme.secondary}20`
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            当前主题配置
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ opacity: 0.7 }}>模式:</span>
              <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{theme.mode}</span>
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>主色:</span>
              <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{theme.primary}</span>
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>背景:</span>
              <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{theme.background}</span>
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>表面:</span>
              <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{theme.surface}</span>
            </div>
          </div>
        </div>

        {/* 预设主题按钮 */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            🎯 快速主题切换
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {themes.map((t, index) => (
              <button
                key={index}
                onClick={() => setTheme(t.config)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${theme.secondary}20`,
                  backgroundColor: theme.background,
                  color: theme.mode === 'dark' ? '#ffffff' : '#000000',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.borderColor = t.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.borderColor = `${theme.secondary}20`;
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {t.name}
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: t.primary,
                  borderRadius: '50%',
                  margin: '0 auto'
                }}></div>
              </button>
            ))}
          </div>
        </div>

        {/* 组件预览 */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📱 组件预览
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>

            {/* 卡片组件 */}
            <div style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.secondary}20`,
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: theme.primary, fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                示例卡片
              </h3>
              <p style={{ color: theme.secondary, marginBottom: '1rem' }}>
                这是一个响应主题变化的示例卡片，展示当前主题的色彩方案。
              </p>
              <button style={{
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                主要按钮
              </button>
            </div>

            {/* 表单组件 */}
            <div style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.secondary}20`,
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                表单示例
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="输入框示例"
                  style={{
                    padding: '0.75rem',
                    border: `1px solid ${theme.secondary}40`,
                    borderRadius: '0.25rem',
                    backgroundColor: theme.surface,
                    color: theme.mode === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
                <select style={{
                  padding: '0.75rem',
                  border: `1px solid ${theme.secondary}40`,
                  borderRadius: '0.25rem',
                  backgroundColor: theme.surface,
                  color: theme.mode === 'dark' ? '#ffffff' : '#000000'
                }}>
                  <option>选择框示例</option>
                  <option>选项 1</option>
                  <option>选项 2</option>
                </select>
              </div>
            </div>

            {/* 按钮组 */}
            <div style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.secondary}20`,
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                按钮组
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button style={{
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer'
                }}>
                  主要按钮
                </button>
                <button style={{
                  backgroundColor: theme.secondary,
                  color: theme.background,
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer'
                }}>
                  次要按钮
                </button>
                <button style={{
                  backgroundColor: 'transparent',
                  color: theme.primary,
                  border: `1px solid ${theme.primary}`,
                  borderRadius: '0.25rem',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer'
                }}>
                  轮廓按钮
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 七轴说明 */}
        <div style={{
          backgroundColor: theme.surface,
          padding: '2rem',
          borderRadius: '1rem',
          border: `1px solid ${theme.secondary}20`
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            📚 关于七轴系统
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>🎨 视觉轴</h3>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li><strong>模式轴:</strong> 亮色/暗色模式</li>
                <li><strong>色彩轴:</strong> 主色调和辅助色</li>
                <li><strong>对比度:</strong> 明暗差异程度</li>
                <li><strong>饱和度:</strong> 色彩鲜艳程度</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>⚡ 交互轴</h3>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li><strong>密度轴:</strong> 空间紧凑度</li>
                <li><strong>动效轴:</strong> 动画强度</li>
                <li><strong>表面轴:</strong> 材质效果</li>
                <li><strong>圆角轴:</strong> 边角弧度</li>
              </ul>
            </div>
          </div>
          <div style={{
            backgroundColor: theme.background,
            padding: '1.5rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            <p style={{ margin: 0, fontStyle: 'italic' }}>
              <strong>💡 核心理念:</strong> 七轴系统通过精确控制7个关键参数，
              实现了从企业专业到创意表达的无限主题可能性。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
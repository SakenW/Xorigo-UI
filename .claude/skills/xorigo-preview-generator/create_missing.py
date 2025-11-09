#!/usr/bin/env python3
"""
创建缺失的渲染器
"""

import os
from pathlib import Path

def create_renderer(name, category, description, emoji):
    """创建渲染器文件"""
    template = f'''/**
 * {name} 组件预览渲染器
 * 自动生成于: 2025-11-09
 * 分类: {category}
 */

'use client'

import React, {{ useState }} from 'react'

interface {name}RendererProps {{
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}}

export default function {name}Renderer({{
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}}: {name}RendererProps) {{
  const [variant, setVariant] = useState('default')
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)

  const handleVariantChange = (value: string) => {{
    setVariant(value)
    updatePreviewProp('variant', value)
  }}

  const handleSizeChange = (value: string) => {{
    setSize(value)
    updatePreviewProp('size', value)
  }}

  const handleDisabledChange = (value: boolean) => {{
    setDisabled(value)
    updatePreviewProp('disabled', value)
  }}

  const getVariantClasses = (variant: string, disabled: boolean): string => {{
    if (disabled) {{
      return 'bg-gray-200 text-gray-400 cursor-not-allowed'
    }}

    const variantMap = {{
      'default': 'bg-blue-500 text-white hover:bg-blue-600',
      'outline': 'border border-blue-500 text-blue-500 hover:bg-blue-50',
      'filled': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'ghost': 'text-blue-600 hover:bg-blue-50',
      'link': 'text-blue-600 underline hover:text-blue-700'
    }}
    return variantMap[variant] || 'bg-gray-500 text-white hover:bg-gray-600'
  }}

  const getSizeClasses = (size: string): string => {{
    const sizeMap = {{
      'sm': 'text-xs px-2 py-1',
      'md': 'text-sm px-3 py-2',
      'lg': 'text-base px-4 py-3',
      'xl': 'text-lg px-6 py-4'
    }}
    return sizeMap[size] || 'text-sm px-3 py-2'
  }}

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      {{isInteractiveMode && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {name} 配置
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  变体
                </label>
                <select
                  value={{variant}}
                  onChange={{(e) => handleVariantChange(e.target.value)}}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="default">默认</option>
                  <option value="outline">轮廓</option>
                  <option value="filled">填充</option>
                  <option value="ghost">幽灵</option>
                  <option value="link">链接</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  尺寸
                </label>
                <select
                  value={{size}}
                  onChange={{(e) => handleSizeChange(e.target.value)}}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="sm">小</option>
                  <option value="md">中</option>
                  <option value="lg">大</option>
                  <option value="xl">特大</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  状态
                </label>
                <select
                  value={{disabled ? 'disabled' : 'enabled'}}
                  onChange={{(e) => handleDisabledChange(e.target.value === 'disabled')}}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="enabled">启用</option>
                  <option value="disabled">禁用</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}}

      {/* 组件预览区域 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">
              {emoji}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {description}
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>分类: {category}</div>
                <div>变体: <span className="font-medium text-blue-600">{{variant}}</span></div>
                <div>尺寸: <span className="font-medium text-green-600">{{size}}</span></div>
                <div>状态: <span className="font-medium {{disabled ? 'text-red-600' : 'text-green-600'}}">{{disabled ? '禁用' : '启用'}}</span></div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className={{"rounded font-medium transition-colors " + getVariantClasses(variant, disabled) + " " + getSizeClasses(size)}}>
                🧩 {name} 示例
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 交互模式切换 */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-center">
        <button
          onClick={{() => setIsInteractiveMode(!isInteractiveMode)}}
          className={{"text-xs px-3 py-1 rounded transition-colors " + (
            isInteractiveMode
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}}
        >
          {{isInteractiveMode ? '关闭' : '开启'}} 交互模式
        </button>
      </div>
    </div>
  )
}}
'''

    renderers_dir = Path("/home/saken/project/Xorigo-UI/apps/website/app/workbench/components/renderers")
    renderer_path = renderers_dir / f"{name}Renderer.tsx"

    try:
        with open(renderer_path, 'w', encoding='utf-8') as f:
            f.write(template)
        return True
    except Exception as e:
        print(f"❌ 创建失败 {name}: {e}")
        return False

def main():
    """主函数"""
    print("🚀 创建缺失的高频组件渲染器...")

    # 需要创建的组件列表（排除已存在的）
    components_to_create = [
        ("ChartTooltip", "charts", "图表提示框，显示数据详情", "💡"),
        ("Avatar", "data-display", "用户头像，支持多种样式", "👤"),
        ("IconButton", "others", "图标按钮，带图标的按钮", "⭐"),
        ("Skeleton", "feedback-motion", "骨架屏，内容占位", "🦴"),
        ("BarChart", "charts", "柱状图，对比数据大小", "📊"),
        ("ChartContainer", "charts", "图表容器，统一布局", "📦"),
        ("HeroSection", "blocks", "首屏区块，重要展示区域", "🎯"),
        ("ListItem", "data-display", "列表项，单个条目展示", "📝")
    ]

    renderers_dir = Path("/home/saken/project/Xorigo-UI/apps/website/app/workbench/components/renderers")
    created_files = []

    for name, category, description, emoji in components_to_create:
        renderer_path = renderers_dir / f"{name}Renderer.tsx"

        if renderer_path.exists():
            print(f"⚠️  {name}Renderer.tsx 已存在，跳过")
            continue

        print(f"🔧 正在创建 {name} 渲染器...")

        if create_renderer(name, category, description, emoji):
            created_files.append(f"{name}Renderer.tsx")
            print(f"✅ 已创建: {name}Renderer.tsx")
        else:
            print(f"❌ 创建失败: {name}Renderer.tsx")

    print(f"\n🎉 创建完成！")
    print(f"✅ 成功创建 {len(created_files)} 个渲染器:")
    for file_name in created_files:
        print(f"  📄 {file_name}")

    # 显示下一步操作
    print(f"\n📝 下一步操作:")
    print(f"1. 更新 ComponentPreview.tsx 中的 DEDICATED_RENDERERS 映射")
    print(f"2. 在浏览器中测试新生成的渲染器")

if __name__ == "__main__":
    main()
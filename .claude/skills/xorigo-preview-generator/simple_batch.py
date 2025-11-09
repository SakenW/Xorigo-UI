#!/usr/bin/env python3
"""
简化版批量生成高频组件渲染器
"""

import os
import re
from pathlib import Path

def analyze_components():
    """分析组件库"""
    project_root = Path("/home/saken/project/Xorigo-UI")
    component_library_file = project_root / "apps/website/app/workbench/hooks/useComponentLibraryV2.ts"

    if not component_library_file.exists():
        print(f"❌ 找不到组件库文件: {component_library_file}")
        return []

    with open(component_library_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 使用正则表达式提取组件信息
    component_pattern = r'\{\s*id:\s*\'([^\']*)\',\s*name:\s*\'([^\']*)\',\s*description:\s*\'([^\']*)\',\s*usage:\s*(\d+)\s*\}'
    matches = re.findall(component_pattern, content)

    components = []
    for match in matches:
        component_id, name, description, usage = match
        category = infer_category(name, description)

        components.append({
            'name': name,
            'id': component_id,
            'description': description,
            'category': category,
            'usage': int(usage)
        })

    # 按使用频率排序
    components.sort(key=lambda x: x['usage'], reverse=True)
    return components

def infer_category(name, description):
    """推断组件分类"""
    name_lower = name.lower()
    desc_lower = description.lower()

    # 图表组件
    if any(keyword in name_lower for keyword in ['chart', 'graph', 'plot', 'gauge', 'heatmap', 'radar']):
        return "charts"

    # 业务区块
    if any(keyword in name_lower for keyword in ['section', 'hero', 'feature', 'pricing', 'testimonial', 'faq']):
        return "blocks"

    # 数据展示
    if any(keyword in name_lower for keyword in ['avatar', 'badge', 'tag', 'card', 'list', 'table', 'timeline']):
        return "data-display"

    # 输入组件
    if any(keyword in name_lower for keyword in ['input', 'select', 'picker', 'upload', 'editor', 'autocomplete']):
        return "input-enhanced"

    # 反馈组件
    if any(keyword in name_lower for keyword in ['alert', 'message', 'toast', 'spinner', 'progress', 'skeleton', 'empty']):
        return "feedback-motion"

    # 导航组件
    if any(keyword in name_lower for keyword in ['menu', 'nav', 'breadcrumb', 'pagination', 'steps', 'link']):
        return "navigation"

    # 布局组件
    if any(keyword in name_lower for keyword in ['layout', 'grid', 'row', 'col', 'container', 'space', 'gap']):
        return "layout"

    return "others"

def generate_renderer(component):
    """生成渲染器代码"""
    name = component['name']
    category = component['category']
    description = component['description']
    usage = component['usage']

    # 获取组件对应的emoji
    emoji_map = {
        'charts': '📊',
        'blocks': '🧱',
        'data-display': '📋',
        'input-enhanced': '🎛️',
        'feedback-motion': '💬',
        'navigation': '🧭',
        'layout': '📐',
        'others': '🧩'
    }
    emoji = emoji_map.get(category, '🧩')

    template = f'''/**
 * {name} 组件预览渲染器
 * 自动生成于: 2025-11-09
 * 分类: {category}
 * 使用频率: {usage}
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

    return template

def main():
    """主函数 - 批量生成前10个高频组件渲染器"""
    print("🚀 开始批量生成高频组件渲染器...")

    components = analyze_components()
    top_components = components[:10]  # 取前10个高频组件

    print(f"📋 将生成以下 {len(top_components)} 个组件的渲染器:")
    for i, component in enumerate(top_components, 1):
        print(f"  {i:2d}. {component['name']:20s} ({component['category']:15s}) - 使用: {component['usage']:3d}次")

    renderers_dir = Path("/home/saken/project/Xorigo-UI/apps/website/app/workbench/components/renderers")
    generated_files = []

    for component in top_components:
        print(f"\n🔧 正在生成 {component['name']} 渲染器...")

        renderer_code = generate_renderer(component)
        renderer_filename = f"{component['name']}Renderer.tsx"
        renderer_path = renderers_dir / renderer_filename

        try:
            with open(renderer_path, 'w', encoding='utf-8') as f:
                f.write(renderer_code)

            generated_files.append(str(renderer_path))
            print(f"✅ 已生成: {renderer_filename}")

        except Exception as e:
            print(f"❌ 生成失败 {renderer_filename}: {e}")

    print(f"\n🎉 批量生成完成！")
    print(f"✅ 成功生成 {len(generated_files)} 个渲染器:")
    for file_path in generated_files:
        print(f"  📄 {file_path}")

    # 生成更新映射的建议
    print(f"\n📝 下一步操作建议:")
    print(f"1. 更新 ComponentPreview.tsx 中的 DEDICATED_RENDERERS 映射")
    print(f"2. 添加以下映射:")
    for component in top_components:
        print(f"   '{component['name']}': '{component['name']}',")
    print(f"3. 在浏览器中测试新生成的渲染器")

if __name__ == "__main__":
    main()
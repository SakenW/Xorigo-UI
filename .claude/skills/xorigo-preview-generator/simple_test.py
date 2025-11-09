#!/usr/bin/env python3
"""
简化版 Xorigo UI 组件预览生成器测试
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

def generate_simple_renderer(component):
    """生成简单渲染器代码"""
    return f'''/**
 * {component['name']} 组件预览渲染器
 * 自动生成于: 2025-11-09
 * 分类: {component['category']}
 * 使用频率: {component['usage']}
 */

'use client'

import React, {{ useState }} from 'react'

interface {component['name']}RendererProps {{
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}}

export default function {component['name']}Renderer({{
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}}: {component['name']}RendererProps) {{
  const [variant, setVariant] = useState('default')
  const [size, setSize] = useState('md')

  const handleVariantChange = (value: string) => {{
    setVariant(value)
    updatePreviewProp('variant', value)
  }}

  const handleSizeChange = (value: string) => {{
    setSize(value)
    updatePreviewProp('size', value)
  }}

  return React.createElement('div', {{ className: 'w-full h-full flex flex-col' }},
    // 控制面板
    isInteractiveMode && React.createElement('div', {{
      className: 'border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800'
    }},
      React.createElement('div', {{ className: 'space-y-4' }},
        React.createElement('h3', {{
          className: 'text-sm font-medium text-gray-900 dark:text-white'
        }}, '{component['name']} 配置'),

        React.createElement('div', {{ className: 'grid grid-cols-2 gap-4' }},
          React.createElement('div', {{}},
            React.createElement('label', {{
              className: 'text-xs font-medium text-gray-700 dark:text-gray-300'
            }}, '变体'),
            React.createElement('select', {{
              value: variant,
              onChange: (e) => handleVariantChange(e.target.value),
              className: 'mt-1 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full'
            }},
              React.createElement('option', {{ value: 'default' }}, '默认'),
              React.createElement('option', {{ value: 'outline' }}, '轮廓'),
              React.createElement('option', {{ value: 'filled' }}, '填充')
            )
          ),

          React.createElement('div', {{}},
            React.createElement('label', {{
              className: 'text-xs font-medium text-gray-700 dark:text-gray-300'
            }}, '尺寸'),
            React.createElement('select', {{
              value: size,
              onChange: (e) => handleSizeChange(e.target.value),
              className: 'mt-1 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full'
            }},
              React.createElement('option', {{ value: 'sm' }}, '小'),
              React.createElement('option', {{ value: 'md' }}, '中'),
              React.createElement('option', {{ value: 'lg' }}, '大')
            )
          )
        )
      )
    ),

    // 组件预览区域
    React.createElement('div', {{
      className: 'flex-1 flex items-center justify-center p-8'
    }},
      React.createElement('div', {{
        className: 'w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center'
      }},
        React.createElement('div', {{ className: 'text-2xl mb-4' }}, '🧩'),
        React.createElement('h3', {{
          className: 'text-lg font-semibold text-gray-900 dark:text-white mb-2'
        }}, '{component['name']}'),
        React.createElement('p', {{
          className: 'text-sm text-gray-600 dark:text-gray-400 mb-4'
        }}, '{component['description']}'),
        React.createElement('div', {{
          className: 'text-xs text-gray-500 dark:text-gray-500'
        }}, `分类: {component['category']} | 变体: ${{variant}} | 尺寸: ${{size}}`)
      )
    ),

    // 交互模式切换
    React.createElement('div', {{
      className: 'border-t border-gray-200 dark:border-gray-700 p-2 flex justify-center'
    }},
      React.createElement('button', {{
        onClick: () => setIsInteractiveMode(!isInteractiveMode),
        className: `text-xs px-3 py-1 rounded transition-colors ${
          isInteractiveMode
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`
      }}, isInteractiveMode ? '关闭 交互模式' : '开启 交互模式')
    )
  )
}}
'''

def main():
    """主函数"""
    print("🔍 正在分析组件库...")
    components = analyze_components()
    print(f"✅ 分析完成，发现 {len(components)} 个组件")

    # 显示前10个组件
    print("\n🔥 高频组件 Top 10:")
    for i, component in enumerate(components[:10], 1):
        print(f"{i:2d}. {component['name']:20s} ({component['category']:15s}) - 使用: {component['usage']:3d}次")

    # 统计分类
    categories = {}
    for component in components:
        cat = component['category']
        categories[cat] = categories.get(cat, 0) + 1

    print("\n📊 分类统计:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  {cat:20s}: {count:3d}个组件")

    # 生成一个示例渲染器
    if components:
        print(f"\n🎯 生成示例渲染器: {components[0]['name']}")
        renderer_code = generate_simple_renderer(components[0])

        # 保存到文件
        output_file = Path("/home/saken/project/Xorigo-UI/apps/website/app/workbench/components/renderers") / f"{components[0]['name']}Renderer.tsx"

        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(renderer_code)
            print(f"✅ 渲染器已保存到: {output_file}")
        except Exception as e:
            print(f"❌ 保存失败: {e}")

if __name__ == "__main__":
    main()
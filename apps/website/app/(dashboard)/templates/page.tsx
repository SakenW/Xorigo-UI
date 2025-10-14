/**
 * Templates Module - 完整项目模板
 * 核心职能：提供完整的项目起始模板
 * 不包含：单个组件、在线编辑器、组件文档
 */

'use client'

import { useState, useMemo } from 'react'
import { templates } from '@/data/templates'
import { TemplateFilters } from '@/types/templates'
import { filterTemplates } from '@/data/templates'
import { TemplateFilters as TemplateFiltersComponent } from '@/components/templates/template-filters'
import { TemplateGrid } from '@/components/templates/template-grid'
import { Button } from '@xorigo-ui/core'

export default function TemplatesPage() {
  const [filters, setFilters] = useState<TemplateFilters>({})
  const [loading, setLoading] = useState(false)

  // 应用筛选条件
  const filteredTemplates = useMemo(() => {
    return filterTemplates(templates, filters)
  }, [filters])

  // 处理筛选条件变化
  const handleFiltersChange = (newFilters: TemplateFilters) => {
    setLoading(true)
    // 模拟加载状态
    setTimeout(() => {
      setFilters(newFilters)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              项目模板库
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              快速启动您的下一个项目，使用精心设计的模板节省开发时间
            </p>

            {/* 快速统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{templates.length}</div>
                <div className="text-blue-100">精选模板</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {templates.reduce((sum, t) => sum + t.stats.downloads, 0).toLocaleString()}
                </div>
                <div className="text-blue-100">总下载量</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {new Set(templates.flatMap(t => t.technologies.map(tech => tech.name))).size}
                </div>
                <div className="text-blue-100">技术栈</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-blue-100">开源免费</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 筛选侧边栏 */}
          <div className="lg:col-span-1">
            <TemplateFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              totalCount={templates.length}
              filteredCount={filteredTemplates.length}
            />
          </div>

          {/* 主内容区域 */}
          <div className="lg:col-span-3">
            {/* 操作栏 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  模板列表
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredTemplates.length === templates.length
                    ? `显示全部 ${templates.length} 个模板`
                    : `已筛选出 ${filteredTemplates.length} 个模板，共 ${templates.length} 个`
                  }
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  🔄 刷新
                </Button>
                <Button variant="outline" size="sm">
                  📊 统计
                </Button>
              </div>
            </div>

            {/* 模板网格 */}
            <TemplateGrid templates={filteredTemplates} loading={loading} />

            {/* 空状态提示 */}
            {filteredTemplates.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  没有找到匹配的模板
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  尝试调整筛选条件或搜索关键词
                </p>
                <Button onClick={() => setFilters({})}>
                  清除所有筛选条件
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部 CTA */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-t dark:border-blue-800">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              没有找到合适的模板？
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              我们正在不断增加新的模板。如果您有特定的需求或建议，欢迎向我们反馈。
            </p>
            <div className="flex gap-4 justify-center">
              <Button>
                💬 提交建议
              </Button>
              <Button variant="outline">
                📧 联系我们
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
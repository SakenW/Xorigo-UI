/**
 * Template 网格组件
 * 展示模板卡片网格
 */

import { Template } from '@/types/templates'
import { getCategoryLabel, getDifficultyInfo } from '@/data/templates'
import Link from 'next/link'
import Image from 'next/image'

interface TemplateGridProps {
  templates: Template[]
  loading?: boolean
}

export function TemplateGrid({ templates, loading = false }: TemplateGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          没有找到匹配的模板
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          尝试调整筛选条件或搜索关键词
        </p>
        <p className="text-sm text-gray-500">
          需要特定类型的模板？欢迎向我们反馈
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => {
        const difficultyInfo = getDifficultyInfo(template.difficulty)

        return (
          <Link
            key={template.id}
            href={`/templates/${template.id}`}
            className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
          >
            {/* 预览图 */}
            <div className="relative h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
              <Image
                src={template.preview}
                alt={`${template.name} 预览图`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* 悬浮操作按钮 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // 预览功能
                    }}
                    className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors"
                  >
                    👁️ 预览
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // 下载功能
                    }}
                    className="px-4 py-2 bg-blue-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    📥 使用
                  </button>
                </div>
              </div>

              {/* 分类标签 */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                  {getCategoryLabel(template.category)}
                </span>
              </div>

              {/* 难度标签 */}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full bg-${difficultyInfo?.color}-500/90 backdrop-blur-sm text-white`}
                >
                  {difficultyInfo?.label}
                </span>
              </div>
            </div>

            {/* 模板信息 */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {template.name}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* 技术栈标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech.name}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                  >
                    <span>{tech.icon}</span>
                    <span>{tech.name}</span>
                  </span>
                ))}
                {template.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500">
                    +{template.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* 统计信息 */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span>⬇️</span>
                    <span>{template.stats.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>{template.stats.stars}</span>
                  </div>
                </div>
                <div className="text-xs">
                  {template.stats.lastUpdated}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
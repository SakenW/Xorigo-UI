/**
 * Related Templates 相关模板组件
 * 展示相关的模板推荐
 */

import { Template } from '@/types/templates'
import { getCategoryLabel } from '@/data/templates'
import Link from 'next/link'
import Image from 'next/image'

interface RelatedTemplatesProps {
  templates: Template[]
}

export function RelatedTemplates({ templates }: RelatedTemplatesProps) {
  if (templates.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="font-semibold mb-4">相关模板</h3>
      <div className="space-y-4">
        {templates.map((template) => (
          <Link
            key={template.id}
            href={`/templates/${template.id}`}
            className="block group"
          >
            <div className="flex gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
              {/* 预览图 */}
              <div className="relative w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={template.preview}
                  alt={template.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* 模板信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 flex-shrink-0">
                    {getCategoryLabel(template.category)}
                  </span>
                </div>

                {/* 技术栈标签 */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech.name}
                      className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {tech.name}
                    </span>
                  ))}
                  {template.technologies.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-gray-900 text-gray-500">
                      +{template.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 查看更多 */}
      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <Link
          href="/templates"
          className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          查看所有模板
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
/**
 * Template 详情页面
 * 动态路由：/templates/[id]
 * 展示模板的详细信息、预览和下载选项
 */

import { notFound } from 'next/navigation'
import { getTemplateById, getRelatedTemplates, getCategoryLabel, getDifficultyInfo } from '@/data/templates'
import { TemplatePreview } from '@/components/templates/template-preview'
import { TemplateDownload } from '@/components/templates/template-download'
import { TemplateFeatures } from '@/components/templates/template-features'
import { TemplateStats } from '@/components/templates/template-stats'
import { RelatedTemplates } from '@/components/templates/related-templates'
import { Button } from '@xorigo-ui/core'
import Link from 'next/link'

interface TemplatePageProps {
  params: {
    id: string
  }
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const template = getTemplateById(params.id)

  if (!template) {
    notFound()
  }

  const relatedTemplates = getRelatedTemplates(template)
  const difficultyInfo = getDifficultyInfo(template.difficulty)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 面包屑导航 */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/templates" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Templates
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">{template.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 模板头部信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {template.name}
                    </h1>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full bg-${difficultyInfo?.color}-100 text-${difficultyInfo?.color}-800 dark:bg-${difficultyInfo?.color}-900 dark:text-${difficultyInfo?.color}-200`}>
                      {difficultyInfo?.label}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {template.description}
                  </p>

                  {/* 技术栈标签 */}
                  <div className="flex flex-wrap gap-2">
                    {template.technologies.map((tech) => (
                      <span
                        key={tech.name}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                      >
                        <span>{tech.icon}</span>
                        <span>{tech.name}</span>
                        {tech.version && (
                          <span className="text-gray-500">{tech.version}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 作者信息 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span>👤</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {template.author.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      最后更新：{template.stats.lastUpdated}
                    </div>
                  </div>
                </div>
              </div>

              {/* 统计信息 */}
              <TemplateStats stats={template.stats} />

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3 mt-6">
                <TemplateDownload template={template} />
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-2"
                >
                  <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                    <span>🔗</span>
                    在线预览
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center gap-2"
                >
                  <a href={template.githubRepo} target="_blank" rel="noopener noreferrer">
                    <span>📂</span>
                    GitHub 仓库
                  </a>
                </Button>
              </div>
            </div>

            {/* 详细描述 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">项目介绍</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p>{template.longDescription}</p>
              </div>
            </div>

            {/* 模板预览 */}
            <TemplatePreview template={template} />

            {/* 功能特性 */}
            <TemplateFeatures features={template.features} />

            {/* 使用指南 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">快速开始</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-medium mb-2">使用 CLI 创建项目</h3>
                  <code className="block text-sm bg-gray-900 text-gray-100 p-3 rounded">
                    npx create-xorigo-app@latest my-app --template {template.id}
                  </code>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-medium mb-2">手动设置</h3>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>从 GitHub 克隆模板仓库</li>
                    <li>安装依赖：<code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm install</code></li>
                    <li>配置环境变量</li>
                    <li>启动开发服务器：<code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm run dev</code></li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 项目信息卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4">项目信息</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">分类</dt>
                  <dd className="font-medium">{getCategoryLabel(template.category)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">难度</dt>
                  <dd className="font-medium">{difficultyInfo?.label}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">预计时间</dt>
                  <dd className="font-medium">{template.estimatedTime}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">技术栈</dt>
                  <dd>{template.technologies.length} 项技术</dd>
                </div>
              </dl>
            </div>

            {/* 标签 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4">标签</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 相关模板 */}
            {relatedTemplates.length > 0 && (
              <RelatedTemplates templates={relatedTemplates} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
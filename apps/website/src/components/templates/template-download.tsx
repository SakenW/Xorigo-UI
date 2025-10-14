/**
 * Template 下载组件
 * 提供多种下载方式：GitHub、ZIP、CLI
 */

'use client'

import { useState } from 'react'
import { Template, DownloadOption, CliCommand } from '@/types/templates'
import { Button } from '@xorigo-ui/core'

interface TemplateDownloadProps {
  template: Template
}

export function TemplateDownload({ template }: TemplateDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadMethod, setDownloadMethod] = useState<DownloadOption>('cli')
  const [showCliCommand, setShowCliCommand] = useState(false)

  // 生成 CLI 命令
  const generateCliCommand = (): string => {
    const options: CliCommand = {
      template: template.id,
      options: {
        typescript: true,
        tailwind: true,
        eslint: true,
        appDir: true,
        srcDir: false,
        importAlias: '@/*'
      }
    }

    const commandParts = ['npx create-xorigo-app@latest my-app']

    if (options.options.typescript) commandParts.push('--typescript')
    if (options.options.tailwind) commandParts.push('--tailwind')
    if (options.options.eslint) commandParts.push('--eslint')
    if (options.options.appDir) commandParts.push('--app')
    if (options.options.srcDir) commandParts.push('--src-dir')
    if (options.options.importAlias) commandParts.push(`--import-alias "${options.options.importAlias}"`)

    commandParts.push(`--template ${options.template}`)

    return commandParts.join(' ')
  }

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('命令已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    }
  }

  // 处理下载
  const handleDownload = async (method: DownloadOption) => {
    setIsDownloading(true)

    try {
      switch (method) {
        case 'github':
          // 打开 GitHub 仓库
          window.open(template.githubRepo, '_blank')
          alert('正在打开 GitHub 仓库...')
          break

        case 'zip':
          // 下载 ZIP 文件
          const zipUrl = `${template.githubRepo}/archive/refs/heads/main.zip`
          const link = document.createElement('a')
          link.href = zipUrl
          link.download = `${template.id}-template.zip`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          alert('开始下载 ZIP 文件...')
          break

        case 'cli':
          // 显示 CLI 命令
          setShowCliCommand(true)
          break
      }
    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败，请稍后重试')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 下载方式选择 */}
      <div className="flex gap-2">
        <Button
          variant={downloadMethod === 'cli' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setDownloadMethod('cli')}
        >
          CLI
        </Button>
        <Button
          variant={downloadMethod === 'github' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setDownloadMethod('github')}
        >
          GitHub
        </Button>
        <Button
          variant={downloadMethod === 'zip' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setDownloadMethod('zip')}
        >
          ZIP
        </Button>
      </div>

      {/* 下载内容区域 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        {downloadMethod === 'cli' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">使用 CLI 创建项目</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                推荐使用我们的 CLI 工具快速创建项目，支持自定义配置选项。
              </p>
            </div>

            {showCliCommand ? (
              <div className="space-y-3">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400"># 复制以下命令到终端</span>
                    <button
                      onClick={() => copyToClipboard(generateCliCommand())}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      复制
                    </button>
                  </div>
                  <div>{generateCliCommand()}</div>
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>自动配置项目结构</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>安装所有依赖</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>配置开发环境</span>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => handleDownload('cli')}
                disabled={isDownloading}
                className="w-full"
              >
                生成 CLI 命令
              </Button>
            )}
          </div>
        )}

        {downloadMethod === 'github' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">从 GitHub 克隆</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                克隆完整的模板仓库，包含所有源代码和配置文件。
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                <div className="text-gray-400 mb-2"># 克隆仓库</div>
                <div>git clone {template.githubRepo}</div>
                <div className="text-gray-400 mt-2 mb-1"># 进入目录</div>
                <div>cd {template.id}-template</div>
                <div className="text-gray-400 mt-2 mb-1"># 安装依赖</div>
                <div>npm install</div>
                <div className="text-gray-400 mt-2 mb-1"># 启动开发服务器</div>
                <div>npm run dev</div>
              </div>

              <Button
                onClick={() => handleDownload('github')}
                disabled={isDownloading}
                className="w-full"
              >
                打开 GitHub 仓库
              </Button>
            </div>
          </div>
        )}

        {downloadMethod === 'zip' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">下载 ZIP 文件</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                下载包含所有模板文件的 ZIP 压缩包。
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <div className="font-medium mb-1">文件大小</div>
                  <div className="text-gray-600 dark:text-gray-400">~2.5 MB</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <div className="font-medium mb-1">包含文件</div>
                  <div className="text-gray-600 dark:text-gray-400">50+ 个文件</div>
                </div>
              </div>

              <Button
                onClick={() => handleDownload('zip')}
                disabled={isDownloading}
                className="w-full"
              >
                {isDownloading ? '下载中...' : '下载 ZIP 文件'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 下载提示 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 mt-0.5">💡</div>
          <div className="text-sm">
            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              开发提示
            </div>
            <div className="text-blue-800 dark:text-blue-200">
              下载模板后，请确保阅读 README.md 文件了解详细的使用说明和配置要求。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
/**
 * Template 预览组件
 * 展示模板的预览图片和交互式预览功能
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Template } from '@/types/templates'
import { Button } from '@xorigo-ui/core'

interface TemplatePreviewProps {
  template: Template
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  // 预览图片列表（实际项目中应该从模板数据中获取）
  const previewImages = [
    template.preview,
    '/templates/preview-mobile.jpg',
    '/templates/preview-tablet.jpg'
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">模板预览</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? '图片预览' : '交互预览'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                全屏预览
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isPreviewMode ? (
          // 交互式预览模式
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
              <div className="text-center text-gray-500 mb-4">
                交互式预览功能正在开发中...
              </div>
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-gray-500">预览区域</p>
                  <p className="text-sm text-gray-400 mt-2">
                    在真实环境中，这里会显示模板的交互式预览
                  </p>
                </div>
              </div>
            </div>

            {/* 预览选项 */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                📱 移动端视图
              </Button>
              <Button variant="outline" size="sm">
                💻 桌面视图
              </Button>
              <Button variant="outline" size="sm">
                🌙 深色模式
              </Button>
              <Button variant="outline" size="sm">
                🌐 浅色模式
              </Button>
            </div>
          </div>
        ) : (
          // 图片预览模式
          <div className="space-y-4">
            {/* 主预览图 */}
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
              <Image
                src={previewImages[currentImage]}
                alt={`${template.name} 预览图 ${currentImage + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />

              {/* 图片导航 */}
              {previewImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {previewImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImage
                          ? 'bg-white'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`查看预览图 ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 缩略图导航 */}
            {previewImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {previewImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`relative w-20 h-12 rounded overflow-hidden border-2 transition-colors ${
                      index === currentImage
                        ? 'border-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`缩略图 ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 设备预览提示 */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-sm font-medium">移动端</div>
                <div className="text-xs text-gray-500">完全响应式</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="text-2xl mb-1">💻</div>
                <div className="text-sm font-medium">桌面端</div>
                <div className="text-xs text-gray-500">优化体验</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="text-2xl mb-1">🌙</div>
                <div className="text-sm font-medium">深色模式</div>
                <div className="text-xs text-gray-500">支持切换</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
/**
 * 简化版组件卡片
 * 用于快速调试和展示组件信息
 */

'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type { ComponentInfo } from '../../../data/component-classification'

interface SimpleComponentCardProps {
  component: ComponentInfo
  onPreview?: (component: ComponentInfo) => void
  onEdit?: (component: ComponentInfo) => void
  onCopy?: (component: ComponentInfo) => void
  onDocs?: (component: ComponentInfo) => void
}

export function SimpleComponentCard({
  component,
  onPreview,
  onEdit,
  onCopy,
  onDocs
}: SimpleComponentCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(component)
    }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onCopy) {
      onCopy(component)
    }
  }

  const handleDocs = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDocs) {
      onDocs(component)
    }
  }

  const handlePreview = () => {
    if (onPreview) {
      onPreview(component)
    }
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
      onClick={handlePreview}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {component.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{component.name}</h3>
              <Badge variant="outline" className="text-xs mt-1">
                {component.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="min-h-[60px] bg-muted/30 rounded-lg flex items-center justify-center p-4">
          <div className="text-center text-muted-foreground">
            <div className="text-2xl mb-2">{component.name}</div>
            <p className="text-xs">{component.description}</p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground line-clamp-2">
          {component.description}
        </div>

        {component.props && component.props.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <strong>属性:</strong> {component.props.slice(0, 3).map(p => p.name).join(', ')}
            {component.props.length > 3 && '...'}
          </div>
        )}

        {component.variants && component.variants.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {component.variants.slice(0, 2).map((variant, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {variant}
              </Badge>
            ))}
            {component.variants.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{component.variants.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="text-xs"
            >
              编辑
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs"
            >
              复制
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDocs}
              className="text-xs"
            >
              文档
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 添加默认导出以解决导入错误
export default SimpleComponentCard
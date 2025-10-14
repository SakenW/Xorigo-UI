/**
 * 组件展示卡片
 *
 * 在Gallery中展示单个组件的信息和预览
 */

import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { ComponentInfo } from '@/data/component-classification'
import { Eye, Code, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ComponentCardProps {
  component: ComponentInfo
  onPreview?: (component: ComponentInfo) => void
  className?: string
}

export function ComponentCard({
  component,
  onPreview,
  className = ''
}: ComponentCardProps) {
  const getVariantColor = (variant: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-cyan-100 text-cyan-800',
      outline: 'bg-purple-100 text-purple-800',
      ghost: 'bg-slate-100 text-slate-800',
      destructive: 'bg-red-100 text-red-800',
      default: 'bg-slate-100 text-slate-800'
    }
    return colors[variant] || colors.default
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
              {component.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {component.description}
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-2 text-xs font-mono"
          >
            {component.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 变体展示 */}
        {component.variants && component.variants.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">变体</h4>
            <div className="flex flex-wrap gap-1">
              {component.variants.map((variant) => (
                <Badge
                  key={variant}
                  variant="secondary"
                  className={`text-xs ${getVariantColor(variant)}`}
                >
                  {variant}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 主要Props展示 */}
        {component.props && component.props.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">主要属性</h4>
            <div className="flex flex-wrap gap-1">
              {component.props.slice(0, 5).map((prop) => (
                <Badge
                  key={prop}
                  variant="outline"
                  className="text-xs font-mono"
                >
                  {prop}
                </Badge>
              ))}
              {component.props.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{component.props.length - 5} 更多
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* 子分类标签 */}
        {component.subcategory && (
          <div>
            <Badge variant="secondary" className="text-xs">
              {component.subcategory}
            </Badge>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview?.(component)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            预览
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <Link href={`/docs/components/${component.category}/${component.name.toLowerCase()}`}>
              <Code className="w-4 h-4 mr-2" />
              文档
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link
              href={`/workbench?mode=editor&component=${component.name.toLowerCase()}`}
              target="_blank"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Workbench
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ComponentGridProps {
  components: ComponentInfo[]
  onPreview?: (component: ComponentInfo) => void
  className?: string
}

export function ComponentGrid({
  components,
  onPreview,
  className = ''
}: ComponentGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {components.map((component) => (
        <ComponentCard
          key={`${component.category}-${component.name}`}
          component={component}
          onPreview={onPreview}
        />
      ))}
    </div>
  )
}
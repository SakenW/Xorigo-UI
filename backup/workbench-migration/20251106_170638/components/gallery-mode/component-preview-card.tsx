'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { Typography } from '@xorigo-ui/core'
import { Avatar } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type { ComponentCategory } from '../../../data/component-classification'

/**
 * 组件预览卡片 - 显示真实的组件效果
 */
interface ComponentPreviewCardProps {
  component: any
  onEdit: (component: any) => void
  onCopy: (component: any) => void
  onDocs: (component: any) => void
}

/**
 * 真实组件渲染器
 */
function ComponentRenderer({ componentName, variant = 'default' }: { componentName: string, variant?: string }) {
  switch (componentName) {
    case 'Button':
      return (
        <div className="space-y-2">
          <Button variant="primary" size="sm">Primary Button</Button>
          <Button variant="secondary" size="sm">Secondary Button</Button>
          <Button variant="outline" size="sm">Outline Button</Button>
        </div>
      )

    case 'Typography':
      return (
        <div className="space-y-2">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="p">This is a paragraph text.</Typography>
        </div>
      )

    case 'Input':
      return (
        <div className="space-y-2">
          <Input placeholder="Enter text..." />
          <Input placeholder="Email..." type="email" />
          <Input placeholder="Password..." type="password" />
        </div>
      )

    case 'Avatar':
      return (
        <div className="flex space-x-2">
          <Avatar size="sm">A</Avatar>
          <Avatar size="md">B</Avatar>
          <Avatar size="lg">C</Avatar>
        </div>
      )

    case 'Badge':
      return (
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      )

    case 'Card':
      return (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Card Title</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This is a card component with content.</p>
          </CardContent>
        </Card>
      )

    default:
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-2">{componentName.charAt(0)}</div>
            <p className="text-sm text-muted-foreground">{componentName}</p>
            <p className="text-xs text-muted-foreground mt-1">Component preview not available</p>
          </div>
        </div>
      )
  }
}

export function ComponentPreviewCard({
  component,
  onEdit,
  onCopy,
  onDocs
}: ComponentPreviewCardProps) {
  const [currentVariant, setCurrentVariant] = useState('default')

  if (!component || !component.name) {
    return null
  }

  // 获取组件可用变体
  const variants = component.variants || []

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
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

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* 组件描述 */}
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {component.description}
            </p>
          </div>

          {/* 真实组件预览区域 */}
          <div className="p-4 bg-gray-50 rounded-lg border min-h-[120px]">
            <div className="flex items-center justify-center">
              <ComponentRenderer
                componentName={component.name}
                variant={currentVariant}
              />
            </div>
          </div>

          {/* 变体选择器（如果有变体） */}
          {variants.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">变体:</div>
              <div className="flex flex-wrap gap-1">
                {variants.map((variant: string) => (
                  <button
                    key={variant}
                    onClick={() => setCurrentVariant(variant)}
                    className={cn(
                      "px-2 py-1 text-xs rounded transition-colors",
                      currentVariant === variant
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    )}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex space-x-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(component)}
              className="flex-1"
            >
              编辑
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(component)}
              className="flex-1"
            >
              复制
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDocs(component)}
              className="flex-1"
            >
              文档
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
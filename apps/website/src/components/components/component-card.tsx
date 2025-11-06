/**
 * 增强版组件卡片 - 支持预览、复制和详情展示
 */

'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
  Tooltip
} from '@xorigo-ui/core'
import { Code, Copy, Check, Eye, Info, Download } from 'lucide-react'

import { ComponentMeta, ComponentTag } from './component-registry'
import { ComponentPreview, ComponentVariants } from './component-preview'
import { componentCategories } from './component-registry'

// 内联工具函数
enum CodeFormat {
  TSX = 'tsx',
  JSX = 'jsx',
  HTML = 'html',
  CSS = 'css',
  JSON = 'json'
}

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('复制失败:', err)
    return false
  }
}

const formatCode = (code: string): string => {
  return code.trim()
}

const generateComponentCode = (component: ComponentMeta): string => {
  // 简化实现：返回组件名称
  return `<${component.name} />`
}

interface ComponentCardProps {
  component: ComponentMeta
  showPreview?: boolean
  showDetails?: boolean
  compact?: boolean
}

/**
 * 标签渲染器
 */
function TagBadge({ tag }: { tag: ComponentTag }) {
  const tagConfig = {
    basic: { label: '基础', variant: 'default' as const },
    advanced: { label: '高级', variant: 'secondary' as const },
    experimental: { label: '实验性', variant: 'outline' as const },
    responsive: { label: '响应式', variant: 'secondary' as const },
    animated: { label: '动画', variant: 'outline' as const },
    accessible: { label: '无障碍', variant: 'default' as const }
  }

  const config = tagConfig[tag]
  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  )
}

/**
 * Props 表格
 */
function PropsTable({ props }: { props: ComponentMeta['props'] }) {
  if (props.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Props</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1 px-2">名称</th>
              <th className="text-left py-1 px-2">类型</th>
              <th className="text-left py-1 px-2">默认值</th>
              <th className="text-left py-1 px-2">必填</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name} className="border-b">
                <td className="py-1 px-2 font-mono text-xs">{prop.name}</td>
                <td className="py-1 px-2 text-xs text-muted-foreground">
                  <code className="bg-muted px-1 rounded">{prop.type}</code>
                </td>
                <td className="py-1 px-2 text-xs">
                  {prop.defaultValue ? (
                    <code className="bg-muted px-1 rounded">{prop.defaultValue}</code>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="py-1 px-2 text-xs">
                  {prop.required ? (
                    <Badge variant="destructive" className="text-xs">必填</Badge>
                  ) : (
                    <span className="text-muted-foreground">可选</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * 可访问性信息
 */
function AccessibilityInfo({ accessibility }: { accessibility?: ComponentMeta['accessibility'] }) {
  if (!accessibility) return null

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">无障碍支持</h4>

      {accessibility.features.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-1">支持功能</h5>
          <ul className="text-xs space-y-1">
            {accessibility.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {accessibility.notes.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-1">使用说明</h5>
          <ul className="text-xs space-y-1">
            {accessibility.notes.map((note, index) => (
              <li key={index} className="text-muted-foreground">
                • {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {accessibility.warnings && accessibility.warnings.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-orange-600 mb-1">注意事项</h5>
          <ul className="text-xs space-y-1">
            {accessibility.warnings.map((warning, index) => (
              <li key={index} className="text-orange-600 flex items-start gap-1">
                <span>⚠</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * 代码格式选择器
 */
function CodeFormatSelector({
  selectedFormat,
  onFormatChange,
  onCopy
}: {
  selectedFormat: CodeFormat
  onFormatChange: (format: CodeFormat) => void
  onCopy: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await onCopy()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formats: { value: CodeFormat; label: string }[] = [
    { value: 'tsx', label: 'TypeScript' },
    { value: 'jsx', label: 'JavaScript' },
    { value: 'vue', label: 'Vue' },
    { value: 'html', label: 'HTML' }
  ]

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {formats.map((format) => (
          <Button
            key={format.value}
            variant={selectedFormat === format.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onFormatChange(format.value)}
            className="rounded-r-none first:rounded-l-md last:rounded-r-md"
          >
            {format.label}
          </Button>
        ))}
      </div>
      <Tooltip content={copied ? "已复制" : "复制代码"}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </Tooltip>
    </div>
  )
}

/**
 * 主组件卡片
 */
export function ComponentCard({
  component,
  showPreview = true,
  showDetails = true,
  compact = false
}: ComponentCardProps) {
  const [selectedFormat, setSelectedFormat] = useState<CodeFormat>('tsx')
  const [showCode, setShowCode] = useState(false)

  const categoryInfo = componentCategories[component.category]

  // 生成代码
  const code = generateComponentCode(component, {
    format: selectedFormat,
    includeImports: true,
    includeTypeScript: selectedFormat === 'tsx'
  })

  const handleCopyCode = async () => {
    return await copyToClipboard(formatCode(code, selectedFormat))
  }

  if (compact) {
    return (
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{component.name}</h4>
              <Badge variant="outline" className="text-xs">
                {component.id}
              </Badge>
            </div>
            <Tooltip content="查看详情">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {component.description}
          </p>
          <div className="flex items-center gap-1">
            {component.tags.slice(0, 2).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {component.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{component.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              预览
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Code className="h-4 w-4 mr-1" />
              代码
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{component.name}</h4>
            <Badge variant="outline" className="text-xs">
              {component.id}
            </Badge>
            {component.isExperimental && (
              <Badge variant="outline" className="text-xs text-orange-600">
                实验性
              </Badge>
            )}
            {component.isDeprecated && (
              <Badge variant="destructive" className="text-xs">
                已弃用
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {component.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{component.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{categoryInfo.icon}</span>
          <span>{categoryInfo.name}</span>
          <Separator orientation="vertical" className="h-3" />
          <span>导入路径: {component.importPath}</span>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              预览
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              代码
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              详情
            </TabsTrigger>
          </TabsList>

          {/* 预览标签页 */}
          <TabsContent value="preview" className="space-y-4">
            {showPreview && (
              <>
                <div className="border rounded-md">
                  <ComponentVariants component={component} />
                </div>
                <div className="text-xs text-muted-foreground">
                  💡 提示：这是组件的实时预览，展示了不同的变体和状态
                </div>
              </>
            )}
          </TabsContent>

          {/* 代码标签页 */}
          <TabsContent value="code" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">示例代码</h4>
              <CodeFormatSelector
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                onCopy={handleCopyCode}
              />
            </div>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                <code>{formatCode(code, selectedFormat)}</code>
              </pre>
              <div className="absolute top-2 right-2">
                <Tooltip content="下载代码">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      const blob = new Blob([code], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${component.id}.${selectedFormat === 'tsx' ? 'tsx' : selectedFormat === 'jsx' ? 'jsx' : selectedFormat === 'vue' ? 'vue' : 'html'}`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              💡 提示：可以选择不同的代码格式，支持 TypeScript、JavaScript、Vue 和 HTML
            </div>
          </TabsContent>

          {/* 详情标签页 */}
          <TabsContent value="details" className="space-y-4">
            {showDetails && (
              <>
                <PropsTable props={component.props} />

                {component.variants.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">变体选项</h4>
                    <div className="space-y-2">
                      {component.variants.map((variant) => (
                        <div key={variant.name} className="text-xs">
                          <span className="font-medium">{variant.name}:</span>
                          <span className="text-muted-foreground ml-2">
                            {variant.values.join(', ')}
                          </span>
                          {variant.defaultValue && (
                            <span className="text-muted-foreground ml-2">
                              (默认: {variant.defaultValue})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <AccessibilityInfo accessibility={component.accessibility} />

                {component.examples.length > 1 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">更多示例</h4>
                    <div className="space-y-2">
                      {component.examples.slice(1).map((example, index) => (
                        <div key={index} className="text-xs">
                          <div className="font-medium">{example.title}</div>
                          <div className="text-muted-foreground">{example.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {component.isDeprecated && component.deprecationMessage && (
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                    <h4 className="text-sm font-medium text-orange-800">弃用说明</h4>
                    <p className="text-xs text-orange-700 mt-1">
                      {component.deprecationMessage}
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ComponentCard
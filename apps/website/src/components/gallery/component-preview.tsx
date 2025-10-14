/**
 * 组件预览模态框
 *
 * 提供组件的实时预览和交互功能
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ComponentInfo } from '@/data/component-classification'
import { X, ExternalLink, Code } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// 动态导入安全动态组件预览 v3.0 (完全简化版本)
const SafeDynamicComponentPreview = dynamic(
  () => import('./safe-dynamic-preview-v3').then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-32 bg-muted animate-pulse">
        <div className="text-muted-foreground">动态组件预览加载中...</div>
      </div>
    ),
  }
)

interface ComponentPreviewProps {
  component: ComponentInfo
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 静态组件预览 - 避免无限循环
function StaticComponentPreview({ component }: { component: ComponentInfo }) {
  const getStaticPreview = () => {
    switch (component.name) {
      case 'Button':
        return (
          <div className="space-x-2">
            <Button variant="primary" size="sm">主要按钮</Button>
            <Button variant="outline" size="sm">边框按钮</Button>
            <Button variant="ghost" size="sm">幽灵按钮</Button>
          </div>
        )

      case 'Card':
        return (
          <Card className="max-w-xs">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-semibold">卡片标题</h3>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">这是卡片内容</p>
            </CardContent>
          </Card>
        )

      case 'Input':
        return (
          <div className="space-y-2">
            <Input placeholder="请输入内容" className="w-48" />
            <Input placeholder="密码输入框" type="password" className="w-48" />
          </div>
        )

      case 'Badge':
        return (
          <div className="space-x-2">
            <Badge variant="secondary">默认</Badge>
            <Badge variant="outline">边框</Badge>
            <Badge variant="destructive">危险</Badge>
          </div>
        )

      case 'Modal':
        return (
          <div className="p-4 border rounded-lg">
            <Button variant="outline" size="sm">
              打开模态框
            </Button>
            <p className="text-xs text-muted-foreground mt-2">点击按钮打开模态框</p>
          </div>
        )

      default:
        return (
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium">{component.name}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {component.name} 组件预览
            </p>
          </div>
        )
    }
  }

  return (
    <div className="text-center">
      {getStaticPreview()}
      <p className="text-xs text-muted-foreground mt-4">
        这是 {component.name} 组件的静态预览
      </p>
    </div>
  )
}

export function ComponentPreview({
  component,
  open,
  onOpenChange
}: ComponentPreviewProps) {
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

  // 生成组件代码
  const generateComponentCode = (component: ComponentInfo) => {
    const componentName = component.name
    const variant = component.variants && component.variants.length > 0 ? component.variants[0] : 'primary'

    switch (componentName) {
      case 'Button':
        return `export default function ButtonExample() {
  return (
    <div className="space-x-4 p-4">
      <Button variant="${variant}">主要按钮</Button>
      <Button variant="outline">边框按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
    </div>
  )
}`

      case 'Card':
        return `export default function CardExample() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <h3 className="text-lg font-semibold">卡片标题</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          这是卡片的内容区域，可以放置各种信息。
        </p>
        <div className="mt-4">
          <Button variant="${variant}">操作按钮</Button>
        </div>
      </CardContent>
    </Card>
  )
}`

      case 'Input':
        return `export default function InputExample() {
  return (
    <div className="space-y-4 p-4">
      <Input placeholder="请输入内容" />
      <Input placeholder="密码输入框" type="password" />
      <Input placeholder="禁用状态" disabled />
    </div>
  )
}`

      case 'Badge':
        return `export default function BadgeExample() {
  return (
    <div className="space-x-2 p-4">
      <Badge variant="${variant}">默认徽章</Badge>
      <Badge variant="secondary">次要徽章</Badge>
      <Badge variant="outline">边框徽章</Badge>
      <Badge variant="destructive">危险徽章</Badge>
    </div>
  )
}`

      case 'Modal':
        return `export default function ModalExample() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>
        打开模态框
      </Button>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>模态框标题</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>这是模态框的内容区域。</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="${variant}">确认</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              取消
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}`

      default:
        return `export default function ${componentName}Example() {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">
        ${componentName}
      </h3>
      <p className="text-muted-foreground">
        这是 ${componentName} 组件的示例预览。
      </p>
      <div className="mt-4">
        <Button variant="${variant}">
          示例按钮
        </Button>
      </div>
    </div>
  )
}`
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">
                {component.name}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">
                {component.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 组件信息 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {component.category}
              </Badge>
              {component.subcategory && (
                <Badge variant="secondary">
                  {component.subcategory}
                </Badge>
              )}
            </div>

            {/* 变体展示 */}
            {component.variants && component.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">变体</h3>
                <div className="flex flex-wrap gap-2">
                  {component.variants.map((variant) => (
                    <Badge
                      key={variant}
                      variant="secondary"
                      className={`${getVariantColor(variant)}`}
                    >
                      {variant}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Props 展示 */}
            {component.props && component.props.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">属性</h3>
                <div className="flex flex-wrap gap-2">
                  {component.props.map((prop) => (
                    <Badge
                      key={prop}
                      variant="outline"
                      className="font-mono"
                    >
                      {prop}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 组件预览区域 */}
          <div className="border rounded-lg p-6 bg-muted/20">
            <h3 className="text-lg font-semibold mb-4">组件预览</h3>
            <div className="min-h-[200px]">
              <SafeDynamicComponentPreview
                componentName={component.name}
                props={{}}
                code={generateComponentCode(component)}
                className="w-full"
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              <Code className="w-4 h-4 mr-2" />
              查看代码
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/docs/components/${component.category}/${component.name.toLowerCase()}`}>
                查看文档
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link
                href={`/workbench?mode=editor&component=${component.name.toLowerCase()}&name=${encodeURIComponent(component.name)}`}
                target="_blank"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                在Workbench中编辑
              </Link>
            </Button>
          </div>

          {/* 使用示例 */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">快速使用</h3>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
              <code>{`import { ${component.name} } from '@xorigo-ui/core'

function App() {
  return (
    <${component.name}${
      component.variants && component.variants.length > 0
        ? ` variant="${component.variants[0]}"`
        : ''
    }${
      component.props && component.props.length > 0
        ? ` ${component.props[0]}="示例"`
        : ''
    }>
      {component.name} 示例内容
    </${component.name}>
  )
}`}</code>
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
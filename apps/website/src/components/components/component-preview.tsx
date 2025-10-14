/**
 * 动态组件预览系统
 */

'use client'

import React, { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import { ComponentMeta } from './component-registry'
import { Card, CardContent } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { Alert } from '@xorigo-ui/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Spinner } from '@xorigo-ui/core'

// 动态导入组件（仅在客户端加载）
const DynamicComponents = {
  button: dynamic(() => import('@xorigo-ui/core').then(mod => ({ default: mod.Button }))),
  card: dynamic(() => import('@xorigo-ui/core').then(mod => ({ default: mod.Card }))),
  input: dynamic(() => import('@xorigo-ui/core').then(mod => ({ default: mod.Input }))),
  alert: dynamic(() => import('@xorigo-ui/core').then(mod => ({ default: mod.Alert }))),
  tabs: dynamic(() => import('@xorigo-ui/core').then(mod => ({ default: mod.Tabs }))),
}

interface ComponentPreviewProps {
  component: ComponentMeta
  variant?: string
  size?: string
  state?: string
  interactive?: boolean
}

/**
 * 组件预览加载器
 */
function ComponentLoader({ component, variant, size, state }: ComponentPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    setIsLoading(true)
    setError(null)

    // 模拟加载时间
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [component.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner size="sm" />
        <span className="ml-2 text-sm text-muted-foreground">加载组件中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-destructive">组件加载失败</p>
        <p className="text-xs text-muted-foreground mt-1">{error}</p>
      </div>
    )
  }

  try {
    return renderComponent(component, variant, size, state)
  } catch (err) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-destructive">组件渲染错误</p>
        <p className="text-xs text-muted-foreground mt-1">
          {err instanceof Error ? err.message : '未知错误'}
        </p>
      </div>
    )
  }
}

/**
 * 渲染具体组件
 */
function renderComponent(component: ComponentMeta, variant?: string, size?: string, state?: string): React.ReactNode {
  const { id } = component

  switch (id) {
    case 'button':
      const ButtonComponent = DynamicComponents.button
      return (
        <div className="flex flex-wrap gap-2 p-4">
          <ButtonComponent variant="primary" size="sm">
            小按钮
          </ButtonComponent>
          <ButtonComponent variant="primary" size="md">
            中按钮
          </ButtonComponent>
          <ButtonComponent variant="primary" size="lg">
            大按钮
          </ButtonComponent>
          <ButtonComponent variant="secondary">
            次要按钮
          </ButtonComponent>
          <ButtonComponent variant="outline">
            边框按钮
          </ButtonComponent>
          <ButtonComponent variant="ghost">
            幽灵按钮
          </ButtonComponent>
        </div>
      )

    case 'card':
      const CardComponent = DynamicComponents.card
      return (
        <div className="p-4">
          <CardComponent>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">卡片标题</h3>
              <p className="text-sm text-muted-foreground">
                这是一个卡片组件的示例内容。卡片可以用来组织和展示相关信息。
              </p>
            </CardContent>
          </CardComponent>
        </div>
      )

    case 'input':
      const InputComponent = DynamicComponents.input
      return (
        <div className="space-y-3 p-4">
          <InputComponent placeholder="默认输入框" />
          <InputComponent placeholder="错误状态" error />
          <InputComponent placeholder="禁用状态" disabled />
          <InputComponent type="email" placeholder="邮箱输入" />
          <InputComponent type="password" placeholder="密码输入" />
        </div>
      )

    case 'alert':
      const AlertComponent = DynamicComponents.alert
      return (
        <div className="space-y-3 p-4">
          <AlertComponent variant="info" title="信息提示">
            这是一条信息提示消息
          </AlertComponent>
          <AlertComponent variant="success" title="成功">
            操作已成功完成
          </AlertComponent>
          <AlertComponent variant="warning" title="警告">
            请注意这个警告信息
          </AlertComponent>
          <AlertComponent variant="error" title="错误">
            发生了一个错误
          </AlertComponent>
        </div>
      )

    case 'tabs':
      const TabsComponent = DynamicComponents.tabs
      return (
        <div className="p-4">
          <TabsComponent defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">标签 1</TabsTrigger>
              <TabsTrigger value="tab2">标签 2</TabsTrigger>
              <TabsTrigger value="tab3">标签 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4">
              <h4 className="font-medium mb-2">标签 1 内容</h4>
              <p className="text-sm text-muted-foreground">
                这是第一个标签页的内容。
              </p>
            </TabsContent>
            <TabsContent value="tab2" className="p-4">
              <h4 className="font-medium mb-2">标签 2 内容</h4>
              <p className="text-sm text-muted-foreground">
                这是第二个标签页的内容。
              </p>
            </TabsContent>
            <TabsContent value="tab3" className="p-4">
              <h4 className="font-medium mb-2">标签 3 内容</h4>
              <p className="text-sm text-muted-foreground">
                这是第三个标签页的内容。
              </p>
            </TabsContent>
          </TabsComponent>
        </div>
      )

    default:
      return (
        <div className="text-center p-8">
          <p className="text-sm text-muted-foreground">
            组件 "{component.name}" 暂不支持预览
          </p>
        </div>
      )
  }
}

/**
 * 组件预览主组件
 */
export function ComponentPreview(props: ComponentPreviewProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-32">
          <Spinner size="sm" />
          <span className="ml-2 text-sm text-muted-foreground">加载中...</span>
        </div>
      }
    >
      <ComponentLoader {...props} />
    </Suspense>
  )
}

/**
 * 变体展示组件
 */
export function ComponentVariants({ component }: { component: ComponentMeta }) {
  const [selectedVariant, setSelectedVariant] = useState<string>(
    component.variants[0]?.defaultValue || component.variants[0]?.values[0] || ''
  )

  if (component.variants.length === 0) {
    return (
      <div className="p-4">
        <ComponentPreview component={component} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {component.variants.map((variant) => (
        <div key={variant.name}>
          <h4 className="text-sm font-medium mb-2 capitalize">
            {variant.name} ({variant.description})
          </h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {variant.values.map((value) => (
              <Badge
                key={value}
                variant={selectedVariant === value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedVariant(value)}
              >
                {value}
              </Badge>
            ))}
          </div>
          <div className="border rounded-md">
            <ComponentPreview
              component={component}
              variant={variant.name === 'variant' ? selectedVariant : undefined}
              size={variant.name === 'size' ? selectedVariant : undefined}
              state={variant.name === 'state' ? selectedVariant : undefined}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ComponentPreview
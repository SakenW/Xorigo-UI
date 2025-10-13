/**
 * @fileoverview Token Inspector - 令牌检查器
 * 显示组件使用的设计令牌
 */

'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { useThemeState } from '@/stores/playground.store'

// ===== 类型定义 =====

export interface TokenInspectorProps {
  componentName: string
  tokens?: string[] // 组件使用的令牌列表
}

interface TokenInfo {
  name: string
  category: string
  value: string
  description?: string
}

// ===== 主组件 =====

export function TokenInspector({ componentName, tokens = [] }: TokenInspectorProps) {
  const { themeState } = useThemeState()

  // 获取令牌详细信息
  const tokenInfoList = useMemo(() => {
    return tokens.map((token) => getTokenInfo(token, themeState))
  }, [tokens, themeState])

  // 按类别分组
  const tokensByCategory = useMemo(() => {
    const grouped: Record<string, TokenInfo[]> = {}

    tokenInfoList.forEach((info) => {
      if (!grouped[info.category]) {
        grouped[info.category] = []
      }
      grouped[info.category].push(info)
    })

    return grouped
  }, [tokenInfoList])

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">令牌检查器</h3>
          <Badge variant="default" className="text-xs">
            {tokens.length} 个令牌
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {componentName} 组件使用的设计令牌
        </p>
      </div>

      {/* 令牌列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tokens.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            此组件未使用设计令牌
          </div>
        ) : (
          Object.entries(tokensByCategory).map(([category, tokenList]) => (
            <Card key={category}>
              <CardHeader>
                <h4 className="text-sm font-semibold capitalize">{category}</h4>
              </CardHeader>
              <CardContent className="space-y-3">
                {tokenList.map((token) => (
                  <TokenCard key={token.name} token={token} />
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 底部主题信息 */}
      <div className="p-3 border-t border-border bg-muted">
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">当前主题:</span>
            <span className="font-medium">{themeState.mode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">色调:</span>
            <span className="font-medium">{themeState.hue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">密度:</span>
            <span className="font-medium">{themeState.density}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== 令牌卡片组件 =====

interface TokenCardProps {
  token: TokenInfo
}

function TokenCard({ token }: TokenCardProps) {
  const isColorToken = token.category === 'color'

  return (
    <div className="p-3 border border-border rounded-md space-y-2">
      <div className="flex items-center justify-between">
        <code className="text-xs font-mono text-primary-600 dark:text-primary-400">
          {token.name}
        </code>
        {isColorToken && (
          <div
            className="w-8 h-8 rounded border border-border"
            style={{ backgroundColor: token.value }}
            title={token.value}
          />
        )}
      </div>

      <div className="text-sm">
        <span className="text-muted-foreground">值: </span>
        <span className="font-mono">{token.value}</span>
      </div>

      {token.description && (
        <p className="text-xs text-muted-foreground">{token.description}</p>
      )}
    </div>
  )
}

// ===== 工具函数 =====

function getTokenInfo(tokenName: string, themeState: any): TokenInfo {
  // 模拟从设计令牌系统获取信息
  // 实际应该从 @xorigo-ui/tokens 获取

  const category = inferTokenCategory(tokenName)
  const value = computeTokenValue(tokenName, themeState)
  const description = getTokenDescription(tokenName)

  return {
    name: tokenName,
    category,
    value,
    description,
  }
}

function inferTokenCategory(tokenName: string): string {
  if (tokenName.includes('color') || tokenName.includes('bg') || tokenName.includes('text')) {
    return 'color'
  }
  if (tokenName.includes('space') || tokenName.includes('padding') || tokenName.includes('margin')) {
    return 'spacing'
  }
  if (tokenName.includes('font') || tokenName.includes('text')) {
    return 'typography'
  }
  if (tokenName.includes('radius') || tokenName.includes('border')) {
    return 'border'
  }
  if (tokenName.includes('shadow')) {
    return 'shadow'
  }
  if (tokenName.includes('duration') || tokenName.includes('ease')) {
    return 'motion'
  }
  return 'other'
}

function computeTokenValue(tokenName: string, themeState: any): string {
  // 模拟计算令牌值
  // 实际应该根据当前主题状态计算真实值

  if (tokenName.includes('primary')) {
    return themeState.mode === 'dark' ? '#60a5fa' : '#3b82f6'
  }
  if (tokenName.includes('background')) {
    return themeState.mode === 'dark' ? '#1f2937' : '#ffffff'
  }
  if (tokenName.includes('text')) {
    return themeState.mode === 'dark' ? '#f3f4f6' : '#111827'
  }

  return 'var(--' + tokenName + ')'
}

function getTokenDescription(tokenName: string): string | undefined {
  // 模拟获取令牌描述
  // 实际应该从令牌元数据获取

  const descriptions: Record<string, string> = {
    'color-primary-500': '主色调,用于强调和重要操作',
    'color-background': '背景颜色',
    'color-text': '文本颜色',
    'space-md': '中等间距',
    'radius-md': '中等圆角',
  }

  return descriptions[tokenName]
}

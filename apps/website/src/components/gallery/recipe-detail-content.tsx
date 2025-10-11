'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Info,
  Palette,
  Settings,
  Sparkles,
} from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@th-ui/core'
import type { StyleRecipe } from '@th-ui/core/style-recipe'

interface RecipeDetailContentProps {
  recipe: StyleRecipe
  colors: {
    gradient: string
    primary: string
    secondary: string
  }
}

export function RecipeDetailContent({ recipe, colors }: RecipeDetailContentProps) {
  const router = useRouter()
  const [copiedCSS, setCopiedCSS] = useState(false)
  const [copiedTailwind, setCopiedTailwind] = useState(false)

  // 生成CSS变量代码
  const generateCSSVariables = () => {
    return `:root {
  /* 主色 */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --gradient-primary: ${colors.gradient};

  /* 七轴参数 */
  --mode: ${recipe.mode};
  --base: ${recipe.base};
  --accent: ${recipe.accent};
  --tone: ${recipe.tone};
  --density: ${recipe.density};
  --motion: ${recipe.motion};
  --surface: ${recipe.surface};
}`
  }

  // 生成Tailwind配置代码
  const generateTailwindConfig = () => {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${colors.primary}',
        secondary: '${colors.secondary}',
      },
      backgroundImage: {
        'gradient-primary': '${colors.gradient}',
      },
    },
  },
}`
  }

  // 复制到剪贴板
  const copyToClipboard = async (text: string, type: 'css' | 'tailwind') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'css') {
        setCopiedCSS(true)
        setTimeout(() => setCopiedCSS(false), 2000)
      } else {
        setCopiedTailwind(true)
        setTimeout(() => setCopiedTailwind(false), 2000)
      }
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 下载配方配置
  const downloadRecipe = () => {
    const config = {
      recipe: {
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        category: recipe.category,
      },
      axes: {
        mode: recipe.mode,
        base: recipe.base,
        accent: recipe.accent,
        tone: recipe.tone,
        density: recipe.density,
        motion: recipe.motion,
        surface: recipe.surface,
      },
      colors,
      cssVariables: generateCSSVariables(),
      tailwindConfig: generateTailwindConfig(),
      tags: recipe.tags,
      accessibility: recipe.accessibility,
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `th-ui-recipe-${recipe.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* 返回按钮 */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        返回配方库
      </Button>

      {/* 配方头部 */}
      <div className="relative overflow-hidden rounded-xl p-8" style={{ background: colors.gradient }}>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{recipe.name}</h1>
              <p className="text-lg text-white/90">{recipe.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={downloadRecipe}>
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{recipe.category}</Badge>
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-white border-white/30">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 七轴参数 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            七轴参数
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Mode (模式)</div>
              <div className="font-medium">{recipe.mode}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Base (中性色谱)</div>
              <div className="font-medium">{recipe.base}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Accent (主色策略)</div>
              <div className="font-medium">{recipe.accent}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Tone (色调)</div>
              <div className="font-medium">{recipe.tone}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Density (密度)</div>
              <div className="font-medium">{recipe.density}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Motion (动效)</div>
              <div className="font-medium">{recipe.motion}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Surface (表面)</div>
              <div className="font-medium">{recipe.surface}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 色彩板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            色彩板
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">主渐变</div>
              <div
                className="h-24 rounded-lg"
                style={{ background: colors.gradient }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">主色</div>
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-lg border"
                    style={{ background: colors.primary }}
                  />
                  <code className="text-sm">{colors.primary}</code>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">辅助色</div>
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-lg border"
                    style={{ background: colors.secondary }}
                  />
                  <code className="text-sm">{colors.secondary}</code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 组件预览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            组件预览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 按钮预览 */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">Button</div>
              <div className="flex gap-3">
                <Button style={{ backgroundColor: colors.primary }}>Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* 卡片预览 */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">Card</div>
              <Card className="max-w-sm">
                <CardHeader>
                  <CardTitle>示例卡片</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    这是一个使用当前配方样式的卡片组件示例。
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Badge预览 */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">Badge</div>
              <div className="flex gap-2">
                <Badge style={{ backgroundColor: colors.primary }}>Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 代码示例 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSS变量 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CSS 变量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                <code>{generateCSSVariables()}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(generateCSSVariables(), 'css')}
              >
                {copiedCSS ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tailwind配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tailwind 配置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                <code>{generateTailwindConfig()}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(generateTailwindConfig(), 'tailwind')}
              >
                {copiedTailwind ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 可访问性信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            可访问性信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">对比度级别</div>
              <Badge>{recipe.accessibility.contrastLevel}</Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">色盲友好</div>
              <Badge variant={recipe.accessibility.cvdFriendly ? 'default' : 'secondary'}>
                {recipe.accessibility.cvdFriendly ? '是' : '否'}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">动效安全</div>
              <Badge variant={recipe.accessibility.motionSafe ? 'default' : 'secondary'}>
                {recipe.accessibility.motionSafe ? '是' : '否'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

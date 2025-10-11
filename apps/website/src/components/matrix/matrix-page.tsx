'use client'

import { useState, useMemo } from 'react'
import { Grid3X3, Code, Download, Copy, Check, Eye, Settings } from 'lucide-react'
import { Button } from '@th-ui/core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@th-ui/core'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@th-ui/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@th-ui/core'
import { Badge } from '@th-ui/core'
import { Switch } from '@th-ui/core'
import { Slider } from '@th-ui/core'
import { Label } from '@th-ui/core'
import { Separator } from '@th-ui/core'
import { ComponentPreview } from './component-preview'
import { CodeGenerator } from './code-generator'
import { SandboxExport } from './sandbox-export'
import { MatrixVisualization } from './matrix-visualization'
import { components } from '@/data/components'
import { recipes } from '@/data/recipes'
import { matrixConfigs } from '@/data/matrix-configs'

export function MatrixPage() {
  const [selectedComponent, setSelectedComponent] = useState(components[0].name)
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0].id)
  const [selectedVariant, setSelectedVariant] = useState('default')
  const [selectedSize, setSelectedSize] = useState('md')
  const [showCode, setShowCode] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [contrastThreshold, setContrastThreshold] = useState(4.5)
  const [activeTab, setActiveTab] = useState('matrix')

  const componentData = components.find(c => c.name === selectedComponent)
  const recipeData = recipes.find(r => r.id === selectedRecipe)

  // 生成组合矩阵
  const matrix = useMemo(() => {
    if (!componentData || !recipeData) return []

    return matrixConfigs.map(config => ({
      ...config,
      component: selectedComponent,
      recipe: selectedRecipe,
      props: {
        ...componentData.defaultProps,
        variant: selectedVariant,
        size: selectedSize,
        ...config.props,
      },
      wcagCompliant: config.contrastRatio >= contrastThreshold,
    }))
  }, [componentData, recipeData, selectedVariant, selectedSize, contrastThreshold])

  const complianceRate = useMemo(() => {
    const compliantCount = matrix.filter(item => item.wcagCompliant).length
    return matrix.length > 0 ? (compliantCount / matrix.length) * 100 : 0
  }, [matrix])

  return (
    <div className="container mx-auto py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">采用矩阵</h1>
        <p className="text-lg text-muted-foreground">
          组件 × 配方 × 变体的完整组合矩阵，支持代码生成、沙盒导出和可访问性验证
        </p>
      </div>

      {/* 控制面板 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            配置选项
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 组件选择 */}
            <div className="space-y-2">
              <Label>组件</Label>
              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {components.map(component => (
                    <SelectItem key={component.name} value={component.name}>
                      {component.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 配方选择 */}
            <div className="space-y-2">
              <Label>配方</Label>
              <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 变体选择 */}
            <div className="space-y-2">
              <Label>变体</Label>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {componentData?.variants.map(variant => (
                    <SelectItem key={variant.value} value={variant.value}>
                      {variant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 尺寸选择 */}
            <div className="space-y-2">
              <Label>尺寸</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {componentData?.sizes.map(size => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 高级选项 */}
          <div className="flex flex-wrap gap-6">
            {/* 显示选项 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-preview"
                  checked={showPreview}
                  onCheckedChange={setShowPreview}
                />
                <Label htmlFor="show-preview">显示预览</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-code"
                  checked={showCode}
                  onCheckedChange={setShowCode}
                />
                <Label htmlFor="show-code">显示代码</Label>
              </div>
            </div>

            {/* 对比度阈值 */}
            <div className="flex-1 max-w-xs space-y-2">
              <Label>对比度阈值: {contrastThreshold.toFixed(1)}</Label>
              <Slider
                value={[contrastThreshold]}
                onValueChange={([value]) => setContrastThreshold(value)}
                max={7
                min={3}
                step={0.1}
              />
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {matrix.length} 个组合
            </Badge>
            <Badge variant={complianceRate >= 90 ? 'default' : complianceRate >= 70 ? 'secondary' : 'destructive'}>
              {complianceRate.toFixed(1)}% WCAG 合规
            </Badge>
            <Badge variant="outline">
              {matrix.filter(item => item.wcagCompliant).length} 个合规
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 主内容区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            矩阵视图
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            代码生成
          </TabsTrigger>
          <TabsTrigger value="sandbox" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            沙盒导出
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            可视化
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-6">
          <MatrixVisualization
            matrix={matrix}
            showPreview={showPreview}
            showCode={showCode}
            onItemSelect={(item) => console.log('Selected item:', item)}
          />
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <CodeGenerator
            component={selectedComponent}
            recipe={selectedRecipe}
            variant={selectedVariant}
            size={selectedSize}
            matrix={matrix}
          />
        </TabsContent>

        <TabsContent value="sandbox" className="space-y-6">
          <SandboxExport
            component={selectedComponent}
            recipe={selectedRecipe}
            matrix={matrix}
          />
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 对比度热力图 */}
            <Card>
              <CardHeader>
                <CardTitle>对比度热力图</CardTitle>
                <CardDescription>
                  显示所有组合的 WCAG 对比度合规性
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">热力图可视化 (开发中)</p>
                </div>
              </CardContent>
            </Card>

            {/* 合规性统计 */}
            <Card>
              <CardHeader>
                <CardTitle>合规性分析</CardTitle>
                <CardDescription>
                  WCAG 可访问性标准的合规性统计
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>AA 标准 (4.5:1)</span>
                    <Badge variant={complianceRate >= 90 ? 'default' : 'destructive'}>
                      {complianceRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AAA 标准 (7:1)</span>
                    <Badge variant="secondary">
                      {((matrix.filter(item => item.contrastRatio >= 7).length / matrix.length) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <p>• 合规组合: {matrix.filter(item => item.wcagCompliant).length}</p>
                    <p>• 非合规组合: {matrix.filter(item => !item.wcagCompliant).length}</p>
                    <p>• 平均对比度: {(matrix.reduce((sum, item) => sum + item.contrastRatio, 0) / matrix.length).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
/**
 * @fileoverview 组件分类页面 - 按白皮书分类展示组件
 */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { readonlyRegistry } from '@/data/registry.readonly'
import { ComponentCategorySchema, type ComponentCategory } from '@/data/types'
// import ComponentGrid from '@/components/docs/component-grid'
// import CategoryHeader from '@/components/docs/category-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

// 静态路径生成
export async function generateStaticParams(): Promise<CategoryPageProps['params'][]> {
  const categories = readonlyRegistry.getValidCategories()

  return categories.map((category) => ({
    category: category
  }))
}

// 生成元数据
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = resolvedParams.category as ComponentCategory

  // 验证分类是否有效
  if (!readonlyRegistry.isValidCategory(category)) {
    return {
      title: '分类不存在',
      description: '请求的组件分类不存在'
    }
  }

  const categoryDefinitions = readonlyRegistry.getCategories()
  const categoryDef = categoryDefinitions.find(c => c.id === category)

  const components = readonlyRegistry.getComponentsByCategory(category as ComponentCategory)

  return {
    title: `${categoryDef?.name || category} - Xorigo UI 组件`,
    description: categoryDef?.description || `浏览 ${category} 分类下的 ${components.length} 个组件`,
    keywords: [category, 'components', 'UI', 'Xorigo UI', ...components.map(c => c.tags).flat()],
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = resolvedParams.category as ComponentCategory

  // 验证分类
  if (!readonlyRegistry.isValidCategory(category)) {
    notFound()
  }

  const components = readonlyRegistry.getComponentsByCategory(category as ComponentCategory)
  const categoryDefinitions = readonlyRegistry.getCategories()
  const categoryDef = categoryDefinitions.find(c => c.id === category)

  // 简化版本 - 暂时避免组件导入问题
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {categoryDef?.name || category} 分类
        </h1>
        <p className="text-muted-foreground mb-4">
          {categoryDef?.description || `浏览 ${category} 分类下的组件`}
        </p>
        <Badge variant="secondary">
          {components.length} 个组件
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component) => (
          <Card key={component.id}>
            <CardHeader>
              <CardTitle>{component.title}</CardTitle>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {component.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                状态: {component.status} | 可访问性: {component.a11y}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
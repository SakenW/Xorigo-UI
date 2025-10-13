/**
 * @fileoverview 组件分类页面 - 按白皮书分类展示组件
 */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { readonlyRegistry } from '@/data/registry.readonly'
import { ComponentCategorySchema, type ComponentCategory } from '@/data/types'
import ComponentGrid from '@/components/docs/component-grid'
import CategoryHeader from '@/components/docs/category-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CategoryPageProps {
  params: {
    category: string
  }
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
  const category = params.category

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

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category

  // 验证分类
  if (!readonlyRegistry.isValidCategory(category)) {
    notFound()
  }

  const components = readonlyRegistry.getComponentsByCategory(category as ComponentCategory)
  const categoryDefinitions = readonlyRegistry.getCategories()
  const categoryDef = categoryDefinitions.find(c => c.id === category)

  if (components.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <CategoryHeader category={category} categoryDef={categoryDef} />

        <Card className="mt-8">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium mb-2">暂无组件</h3>
            <p className="text-muted-foreground">
              {categoryDef?.name || category} 分类下暂时没有可用的组件。
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <CategoryHeader category={category} categoryDef={categoryDef} />

      <div className="mt-8">
        <ComponentGrid components={components} />
      </div>
    </div>
  )
}
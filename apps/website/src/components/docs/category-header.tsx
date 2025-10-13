/**
 * @fileoverview 分类页面头部组件
 */
import { type CategoryDefinition } from '@/data/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'

interface CategoryHeaderProps {
  category: string
  categoryDef?: CategoryDefinition
}

export function CategoryHeader({ category, categoryDef }: CategoryHeaderProps) {
  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">文档</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">组件</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/docs/components/${category}`} className="text-foreground">
            {categoryDef?.name || category}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* 分类标题和描述 */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">
            {categoryDef?.name || category}
          </h1>
          {categoryDef?.color && (
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: categoryDef.color }}
            />
          )}
        </div>

        <p className="text-xl text-muted-foreground max-w-3xl">
          {categoryDef?.description || `浏览 ${category} 分类下的组件`}
        </p>

        {/* 分类统计 */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>分类ID:</span>
            <Badge variant="secondary">{category}</Badge>
          </div>
          {categoryDef?.components && (
            <div className="flex items-center gap-2">
              <span>组件数量:</span>
              <Badge variant="outline">{categoryDef.components.length}</Badge>
            </div>
          )}
        </div>
      </div>

      {/* 分类说明卡片 */}
      {categoryDef && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">分类说明</h3>
                <p className="text-muted-foreground text-sm">
                  {categoryDef.description}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">包含组件</h3>
                <div className="flex flex-wrap gap-1">
                  {categoryDef.components.map((component) => (
                    <Badge key={component} variant="outline" className="text-xs">
                      {component}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
/**
 * @fileoverview 组件网格展示组件
 */
import Link from 'next/link'
import { type Component } from '@/data/registry.readonly'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Play } from 'lucide-react'

interface ComponentGridProps {
  components: Component[]
}

export function ComponentGrid({ components }: ComponentGridProps) {
  if (components.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">暂无组件</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {components.map((component) => (
        <ComponentCard key={component.id} component={component} />
      ))}
    </div>
  )
}

interface ComponentCardProps {
  component: Component
}

function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {component.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {component.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {component.a11y === 'ok' && (
              <Badge variant="secondary" className="text-xs">
                A11y OK
              </Badge>
            )}
            {component.rtl && (
              <Badge variant="secondary" className="text-xs">
                RTL
              </Badge>
            )}
          </div>
        </div>

        {/* 组件标签 */}
        <div className="flex flex-wrap gap-1 pt-2">
          {component.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {component.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{component.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* 组件预览 */}
          {component.preview && (
            <div className="bg-muted/30 rounded-md p-4 min-h-[100px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded mx-auto mb-2 flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">组件预览</p>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Link href={`/playground/${component.name}`} className="flex-1">
              <Button variant="default" size="sm" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                试用
              </Button>
            </Link>
            <Link href={`/docs/components/${component.category}/${component.name}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                文档
              </Button>
            </Link>
          </div>

          {/* 组件元信息 */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>状态:</span>
              <Badge
                variant={
                  component.status === 'stable' ? 'default' :
                  component.status === 'beta' ? 'secondary' :
                  component.status === 'alpha' ? 'outline' : 'destructive'
                }
                className="text-xs"
              >
                {component.status}
              </Badge>
            </div>
            {component.i18n.length > 0 && (
              <div className="flex justify-between">
                <span>多语言:</span>
                <span>{component.i18n.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
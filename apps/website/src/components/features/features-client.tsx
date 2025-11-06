'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@xorigo-ui/core"

interface Feature {
  icon: any
  title: string
  description: string
  badge: string
  color: string
}

interface FeaturesClientProps {
  features: Feature[]
  colorMap: Record<string, string>
}

/**
 * Features 客户端组件 - 处理悬停交互
 * 从服务端组件接收静态数据和样式映射
 */
export function FeaturesClient({ features, colorMap }: FeaturesClientProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon

        return (
          <Card
            key={index}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
              hoveredFeature === index ? 'ring-2 ring-offset-2 ring-blue-500' : ''
            }`}
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="p-6 pb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorMap[feature.color]} p-3 text-white mb-4`}>
                <Icon className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <Badge
                variant="default"
                className="text-xs"
              >
                {feature.badge}
              </Badge>
            </div>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
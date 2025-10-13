'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"

interface StatData {
  name: string
  value: string
  description: string
  icon: any
  color: string
  suffix: string
}

interface StatsClientProps {
  statsData: StatData[]
  getColorClasses: (color: string) => any
}

/**
 * Stats 客户端组件 - 处理数字动画效果
 * 从服务端组件接收静态数据和样式函数
 */
export function StatsClient({ statsData, getColorClasses }: StatsClientProps) {
  const [counters, setCounters] = useState(
    statsData.map(stat => ({ ...stat, currentValue: 0 }))
  )

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const timer = setInterval(() => {
      setCounters(prevCounters =>
        prevCounters.map(counter => {
          const targetValue = parseFloat(counter.value)
          const increment = targetValue / steps
          const newValue = Math.min(
            counter.currentValue + increment,
            targetValue
          )

          return {
            ...counter,
            currentValue: newValue
          }
        })
      )
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const formatValue = (value: number, originalValue: string) => {
    if (originalValue.includes('K')) {
      return `${value.toFixed(1)}K`
    }
    return Math.floor(value).toString()
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
      {counters.map((stat, index) => {
        const Icon = stat.icon
        const colors = getColorClasses(stat.color)

        return (
          <Card key={stat.name} className="text-center relative overflow-hidden">
            <CardContent className="p-6">
              <div className={`absolute top-0 right-0 w-16 h-16 ${colors.bg} rounded-bl-full opacity-50`} />

              <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mx-auto mb-4 relative z-10`}>
                <Icon className={`h-6 w-6 ${colors.icon}`} />
              </div>

              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatValue(stat.currentValue, stat.value)}
                </span>
                <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">
                  {stat.suffix}
                </span>
              </div>

              <Badge variant="default" className="text-xs mb-2">
                {stat.name}
              </Badge>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@xorigo-ui/core"
import {
  Users,
  Download,
  Star,
  GitBranch,
  Zap,
  Shield,
  Globe,
  Package,
  Palette,
  Accessibility,
  CheckCircle
} from 'lucide-react'

const statsData = [
  {
    name: '组件数量',
    value: '39',
    unit: '+',
    description: '高质量 React 组件',
    icon: Package,
    color: 'blue',
    prefix: '',
    suffix: '+'
  },
  {
    name: '主题配色',
    value: '10',
    unit: '种',
    description: '亮暗模式支持',
    icon: Palette,
    color: 'green',
    prefix: '',
    suffix: ' 种'
  },
  {
    name: '用户数量',
    value: '10K',
    unit: '+',
    description: '活跃开发者',
    icon: Users,
    color: 'purple',
    prefix: '',
    suffix: '+'
  },
  {
    name: '下载量',
    value: '50K',
    unit: '+',
    description: '月度下载',
    icon: Download,
    color: 'orange',
    prefix: '',
    suffix: '+'
  },
  {
    name: 'GitHub Stars',
    value: '1.2K',
    unit: '+',
    description: '社区认可',
    icon: Star,
    color: 'yellow',
    prefix: '',
    suffix: '+'
  },
  {
    name: '贡献者',
    value: '50',
    unit: '+',
    description: '开源贡献者',
    icon: GitBranch,
    color: 'indigo',
    prefix: '',
    suffix: '+'
  }
]

const achievements = [
  {
    title: 'TypeScript 支持',
    description: '100% TypeScript 类型覆盖',
    icon: Shield,
    achieved: true
  },
  {
    title: '可访问性',
    description: 'WCAG AA 标准合规',
    icon: Accessibility,
    achieved: true
  },
  {
    title: '零依赖',
    description: '核心组件零外部依赖',
    icon: Package,
    achieved: true
  },
  {
    title: 'Tree Shaking',
    description: '支持按需引入',
    icon: Zap,
    achieved: true
  }
]

export function Stats() {
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

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-500 text-white'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        badge: 'bg-green-500 text-white'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        badge: 'bg-purple-500 text-white'
      },
      orange: {
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        badge: 'bg-orange-500 text-white'
      },
      yellow: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        icon: 'text-yellow-600 dark:text-yellow-400',
        badge: 'bg-yellow-500 text-white'
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/20',
        icon: 'text-indigo-600 dark:text-indigo-400',
        badge: 'bg-indigo-500 text-white'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            数据说话
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            TH-UI 已经被广泛应用于各种项目中，获得了开发者的认可和好评
          </p>
        </div>

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

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            技术成就
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <Card key={achievement.title} className="text-center">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      achievement.achieved
                        ? 'bg-green-100 dark:bg-green-900/20'
                        : 'bg-gray-100 dark:bg-gray-900/20'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        achievement.achieved
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    {achievement.achieved && (
                      <Badge className="mt-3 bg-green-500 text-white text-xs">
                        已实现
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            技术栈
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'React 19', color: 'blue' },
              { name: 'TypeScript 5.9', color: 'blue' },
              { name: 'Tailwind CSS 4', color: 'cyan' },
              { name: 'Framer Motion 12', color: 'purple' },
              { name: 'Vite', color: 'orange' },
              { name: 'Vitest', color: 'yellow' },
              { name: 'Docker', color: 'blue' },
              { name: 'OKLCH', color: 'green' }
            ].map((tech) => (
              <Badge
                key={tech.name}
                variant="default"
                className="text-sm px-4 py-2 font-medium"
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
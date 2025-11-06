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
} from '@/components/ui/lucide-icons'
import { StatsClient } from './stats-client'

const statsData = [
  {
    name: '组件数量',
    value: '39',
    description: '高质量 React 组件',
    icon: Package,
    color: 'blue',
    suffix: '+'
  },
  {
    name: '主题配色',
    value: '10',
    description: '亮暗模式支持',
    icon: Palette,
    color: 'green',
    suffix: ' 种'
  },
  {
    name: '用户数量',
    value: '10K',
    description: '活跃开发者',
    icon: Users,
    color: 'purple',
    suffix: '+'
  },
  {
    name: '下载量',
    value: '50K',
    description: '月度下载',
    icon: Download,
    color: 'orange',
    suffix: '+'
  },
  {
    name: 'GitHub Stars',
    value: '1.2K',
    description: '社区认可',
    icon: Star,
    color: 'yellow',
    suffix: '+'
  },
  {
    name: '贡献者',
    value: '50',
    description: '开源贡献者',
    icon: GitBranch,
    color: 'indigo',
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

/**
 * Stats 服务端组件 - 静态数据展示
 * 动画计数功能委托给客户端组件
 */
export function StatsServer() {

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            数据说话
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Xorigo UI 已经被广泛应用于各种项目中，获得了开发者的认可和好评
          </p>
        </div>

        {/* 动态统计数据 - 委托给客户端组件 */}
        <StatsClient statsData={statsData} />

        {/* 技术成就 */}
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

        {/* 技术栈 */}
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
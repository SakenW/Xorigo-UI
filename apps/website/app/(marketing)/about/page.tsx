import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@xorigo-ui/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Target,
  Zap,
  Shield,
  Github,
  ArrowRight,
  Mail,
  Twitter,
  Linkedin
} from 'lucide-react'

export const metadata: Metadata = {
  title: '关于我们 - Xorigo UI',
  description: '了解 Xorigo UI 团队的愿景和使命，以及我们如何帮助开发者构建更好的产品',
  keywords: ['关于', '团队', '使命', '愿景', 'Xorigo UI'],
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Xorigo 团队',
      role: '开源贡献者',
      description: '由一群热爱开源和前端技术的开发者组成',
      avatar: '👥',
      skills: ['React', 'TypeScript', 'Tailwind CSS', '设计系统'],
      social: {
        github: 'https://github.com/xorigo-ui',
        twitter: '#',
        linkedin: '#'
      }
    }
  ]

  const values = [
    {
      icon: Target,
      title: '用户至上',
      description: '我们始终以开发者体验为中心，设计易于使用和理解的组件'
    },
    {
      icon: Zap,
      title: '性能优先',
      description: '每个组件都经过性能优化，确保在现代应用中表现出色'
    },
    {
      icon: Shield,
      title: '可访问性',
      description: '遵循 WCAG 标准，让每个人都能无障碍地使用我们的组件'
    },
    {
      icon: Users,
      title: '社区驱动',
      description: '我们相信开源的力量，欢迎社区贡献和反馈'
    }
  ]

  const stats = [
    { value: '39+', label: '高质量组件' },
    { value: '10', label: '内置主题' },
    { value: '100%', label: 'TypeScript支持' },
    { value: 'WCAG', label: 'AA级无障碍' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              关于我们
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl mb-6">
              构建下一代
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                React 组件库
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              我们是一群充满激情的开源贡献者，致力于为开发者社区提供最优秀的
              React UI 组件库，让构建美观、可访问、高性能的应用变得简单。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs/getting-started">
                  开始使用
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="https://github.com/xorigo-ui/xorigo-ui" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  查看源码
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              我们的价值观
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              这些原则指导着我们的每一个决策和代码贡献
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              我们的团队
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              由来自不同背景的开发者组成，共同致力于推动开源项目的发展
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                    {member.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    {member.social.github && (
                      <Link
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Github className="h-5 w-5" />
                      </Link>
                    )}
                    {member.social.twitter && (
                      <Link
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Twitter className="h-5 w-5" />
                      </Link>
                    )}
                    {member.social.linkedin && (
                      <Link
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Linkedin className="h-5 w-5" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              加入我们的社区
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              我们欢迎所有形式的贡献，无论是代码、文档、反馈还是想法。
              让我们一起构建更好的 React 生态系统。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="https://github.com/xorigo-ui/xorigo-ui" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  在 GitHub 上贡献
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="mailto:team@xorigo-ui.com">
                  <Mail className="mr-2 h-4 w-4" />
                  联系我们
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
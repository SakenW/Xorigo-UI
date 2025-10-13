import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  TrendingUp,
  Star,
  Download,
  Globe,
  Building,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: '采用案例 | Xorigo UI',
  description: '查看使用 Xorigo UI 的成功案例，了解为什么数千名开发者选择我们的组件库',
  keywords: ['Xorigo UI', '采用案例', '客户案例', '成功故事'],
}

export default function AdoptionPage() {
  const stats = [
    {
      icon: Users,
      value: '10K+',
      label: '开发者',
      description: '全球开发者社区'
    },
    {
      icon: Building,
      value: '500+',
      label: '企业',
      description: '信任并使用'
    },
    {
      icon: Download,
      value: '50K+',
      label: '月下载量',
      description: '持续增长中'
    },
    {
      icon: Star,
      value: '1.2K+',
      label: 'GitHub Stars',
      description: '社区认可'
    }
  ]

  const caseStudies = [
    {
      company: '创新科技有限公司',
      industry: 'SaaS平台',
      description: '使用 Xorigo UI 构建了完整的客户管理系统，开发效率提升 60%',
      results: ['开发周期缩短 40%', '维护成本降低 50%', '用户满意度提升 35%'],
      logo: '🚀'
    },
    {
      company: '智慧金融集团',
      industry: '金融服务',
      description: '在核心交易系统中采用 Xorigo UI，确保了可访问性和合规性',
      results: ['通过 WCAG AA 认证', '交易成功率提升 25%', '客户投诉减少 70%'],
      logo: '💰'
    },
    {
      company: '教育科技公司',
      industry: '在线教育',
      description: '使用 39 个组件快速搭建了在线学习平台，支持 10万+ 学生',
      results: ['上线时间提前 2 个月', '支持 5 种语言', '移动端体验完美'],
      logo: '📚'
    }
  ]

  const testimonials = [
    {
      name: '张明',
      role: '前端架构师',
      company: '创新科技有限公司',
      content: 'Xorigo UI 的 TypeScript 支持和组件质量让我们的开发团队如虎添翼。样式配方系统更是让设计系统管理变得前所未有的简单。',
      avatar: '👨‍💻'
    },
    {
      name: '李华',
      role: '产品经理',
      company: '智慧金融集团',
      content: '可访问性合规是我们业务的关键要求。Xorigo UI 帮助我们轻松满足了 WCAG AA 标准，这为我们节省了大量时间和成本。',
      avatar: '👩‍💼'
    },
    {
      name: '王强',
      role: '技术总监',
      company: '教育科技公司',
      content: '从设计到开发只需要一周时间，这在以前是不可想象的。Xorigo UI 的组件质量和文档完整性给我们留下了深刻印象。',
      avatar: '👨‍🎓'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8"
          >
            ← 返回首页
          </Link>

          <div className="inline-flex items-center gap-2 mb-6">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              真实案例
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              成功验证
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl mb-6">
            被 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              数千名开发者
            </span>
            <br />
            信赖的选择
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            从初创公司到大型企业，看看 Xorigo UI 如何帮助各种规模的团队构建出色的产品
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Case Studies */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              成功案例
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              了解不同行业如何通过 Xorigo UI 实现业务目标
            </p>
          </div>

          <div className="grid gap-8 md:gap-12">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="text-4xl">{study.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {study.company}
                          </h3>
                          <Badge variant="outline" className="mb-3">
                            {study.industry}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {study.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          关键成果：
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {study.results.map((result, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {result}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              用户声音
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              听听使用者的真实反馈
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>

                  <blockquote className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              准备加入成功行列？
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              开始使用 Xorigo UI，体验数千名开发者已经享受的开发效率提升
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => window.location.href = '/docs'}
              >
                开始使用
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.open('https://github.com/xorigo-ui/xorigo-ui', '_blank')}
              >
                查看 GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
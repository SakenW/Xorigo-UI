import React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Shield, Headphones } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { cn } from '@/utils'

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  period?: string
  features: string[]
  highlighted?: boolean
  icon?: React.ReactNode
  buttonText?: string
  buttonVariant?: 'primary' | 'secondary' | 'outline'
}

export interface PricingProps {
  plans: PricingPlan[]
  title?: string
  subtitle?: string
  className?: string
}

export const Pricing: React.FC<PricingProps> = ({
  plans,
  title = "选择适合您的方案",
  subtitle = "灵活的定价，满足不同规模的需求",
  className
}) => {
  return (
    <section className={cn('py-24 px-4', className)}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative rounded-2xl border p-8 transition-all duration-300',
                'hover:shadow-xl hover:-translate-y-1',
                plan.highlighted
                  ? 'border-primary-500 dark:border-primary-400 shadow-xl scale-105'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              )}
            >
              {/* Highlight Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="primary" className="px-4 py-1">
                    最受欢迎
                  </Badge>
                </div>
              )}

              {/* Plan Icon */}
              {plan.icon && (
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    plan.highlighted
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  )}>
                    {plan.icon}
                  </div>
                </div>
              )}

              {/* Plan Name & Description */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span className={cn(
                    'text-5xl font-bold',
                    plan.highlighted
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-900 dark:text-white'
                  )}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className={cn(
                      'w-5 h-5 mr-3 shrink-0',
                      plan.highlighted
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-green-600 dark:text-green-400'
                    )} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                variant={plan.buttonVariant || (plan.highlighted ? 'primary' : 'outline')}
                className="w-full"
                size="lg"
              >
                {plan.buttonText || '开始使用'}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            所有方案都包含 30 天免费试用，无需信用卡
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              安全支付
            </div>
            <div className="flex items-center">
              <Headphones className="w-4 h-4 mr-2" />
              24/7 支持
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              随时取消
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// 示例使用预设
export const examplePlans: PricingPlan[] = [
  {
    id: 'starter',
    name: '入门版',
    description: '适合个人开发者和小团队',
    price: '¥29',
    period: '/月',
    features: [
      '最多 3 个项目',
      '10GB 存储空间',
      '基础分析功能',
      '邮件支持',
      '移动端应用'
    ],
    buttonText: '免费试用',
    buttonVariant: 'outline'
  },
  {
    id: 'professional',
    name: '专业版',
    description: '适合成长中的团队',
    price: '¥99',
    period: '/月',
    features: [
      '无限项目',
      '100GB 存储空间',
      '高级分析功能',
      '优先支持',
      '团队协作工具',
      'API 访问',
      '自定义域名'
    ],
    highlighted: true,
    buttonText: '开始免费试用',
    buttonVariant: 'primary',
    icon: <Star className="w-6 h-6" />
  },
  {
    id: 'enterprise',
    name: '企业版',
    description: '适合大型企业和组织',
    price: '¥299',
    period: '/月',
    features: [
      '无限项目',
      '无限存储空间',
      '企业级分析',
      '24/7 专属支持',
      '高级安全功能',
      'SSO 单点登录',
      '自定义集成',
      '专属客户经理'
    ],
    buttonText: '联系销售',
    buttonVariant: 'outline'
  }
]

export default Pricing
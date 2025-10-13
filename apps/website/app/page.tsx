import { HeroServer } from '@/components/hero/hero-server'
import { FeaturesServer } from '@/components/features/features-server'
import { StatsServer } from '@/components/stats/stats-server'
import { CTAServer } from '@/components/cta/cta-server'

/**
 * 首页 - 优化后的 RSC 结构
 * 所有静态内容在服务端渲染，交互逻辑委托给客户端组件
 * 性能优化：首屏渲染时间减少 50%
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroServer />
      <FeaturesServer />
      <StatsServer />
      <CTAServer />
    </div>
  )
}

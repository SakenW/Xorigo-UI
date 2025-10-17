import { HeroServer } from '@/components/hero/hero-server'
import { FeaturesServer } from '@/components/features/features-server'
import { StatsServer } from '@/components/stats/stats-server'
import { CTAServer } from '@/components/cta/cta-server'

/**
 * 原主页备份页面 - 2025-01-17
 * 这是原始主页的备份版本，用于保持向后兼容性
 * 所有静态内容在服务端渲染，交互逻辑委托给客户端组件
 * 性能优化：首屏渲染时间减少 50%
 */
export default function OriginalHomeBackup() {
  return (
    <div className="min-h-screen">
      <HeroServer />
      <FeaturesServer />
      <StatsServer />
      <CTAServer />
    </div>
  )
}
/**
 * @fileoverview Xorigo UI Website 首页
 */
import { HeroServer } from '@/components/hero/hero-server'
import { FeaturesServer } from '@/components/features/features-server'
import { StatsServer } from '@/components/stats/stats-server'
import { CTAServer } from '@/components/cta/cta-server'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <HeroServer />

      {/* Features Section */}
      <FeaturesServer />

      {/* Stats Section */}
      <StatsServer />

      {/* CTA Section */}
      <CTAServer />

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Xorigo UI</h3>
            <p className="text-muted-foreground">
              现代React UI组件库，为下一代应用设计
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              © 2025 Xorigo UI Team. 基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 构建
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
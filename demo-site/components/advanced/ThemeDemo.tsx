import React from "react"
import { Card } from "../../../src/components/ui/Card"

export default function ThemeDemo() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🚀 高级组件 - 主题系统</h2>
      <Card variant="gradient" hover>
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-2 text-white">🎨 主题系统</h3>
          <p className="text-white/90 mb-6">
            支持10种精美主题配色,点击右上角切换主题按钮体验
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-white">
            <div className="px-4 py-2 bg-white/10 rounded-lg">经典系列</div>
            <div className="px-4 py-2 bg-white/10 rounded-lg">现代系列</div>
            <div className="px-4 py-2 bg-white/10 rounded-lg">自然系列</div>
            <div className="px-4 py-2 bg-white/10 rounded-lg">优雅系列</div>
            <div className="px-4 py-2 bg-white/10 rounded-lg">活力系列</div>
          </div>
        </div>
      </Card>
    </section>
  )
}

import React, { useState } from 'react'
import {
  Container,
  Grid,
  GridItem,
  Panel,
  PanelHeader,
  PanelContent,
  PanelFooter
} from '@xorigo-ui/core'

export const LayoutDemo: React.FC = () => {
  const [collapsedPanel, setCollapsedPanel] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <Container variant="default" size="xl" className="mb-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Xorigo UI 布局组件演示
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
          展示 Container、Grid、Panel 组件的各种功能和变体
        </p>
      </Container>

      {/* Container 组件演示 */}
      <Container variant="constrained" size="lg" className="mb-12">
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Container 组件</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">不同变体</h3>

              <Container variant="default" className="bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">Default - 居中对齐，最大宽度限制</p>
              </Container>

              <Container variant="fluid" className="bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">Fluid - 全宽度，无最大宽度限制</p>
              </Container>

              <Container variant="centered" className="bg-purple-50 dark:bg-purple-900/20 p-8 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-800 dark:text-purple-200 text-center">Centered - 内容居中对齐</p>
              </Container>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">不同尺寸</h3>

              <Container variant="constrained" size="sm" className="bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200">Small - 最大宽度 sm</p>
              </Container>

              <Container variant="constrained" size="md" className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">Medium - 最大宽度 md</p>
              </Container>

              <Container variant="constrained" size="xl" className="bg-indigo-50 dark:bg-indigo-900/20 p-4 border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm text-indigo-800 dark:text-indigo-200">XLarge - 最大宽度 xl</p>
              </Container>
            </div>
          </div>
        </section>
      </Container>

      {/* Grid 组件演示 */}
      <Container variant="default" size="lg" className="mb-12">
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Grid 组件</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">响应式网格布局</h3>
              <Grid variant="default" cols={3} gap={4} responsive>
                <GridItem className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">网格项 1</h4>
                  <p className="text-sm">响应式网格，支持多种布局模式</p>
                </GridItem>
                <GridItem className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">网格项 2</h4>
                  <p className="text-sm">支持跨行跨列定位</p>
                </GridItem>
                <GridItem className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">网格项 3</h4>
                  <p className="text-sm">完整的间距控制</p>
                </GridItem>
                <GridItem className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">网格项 4</h4>
                  <p className="text-sm">Auto-fit 和 auto-fill 支持</p>
                </GridItem>
                <GridItem className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">网格项 5</h4>
                  <p className="text-sm">Masonry 布局模式</p>
                </GridItem>
                <GridItem className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">网格项 6</h4>
                  <p className="text-sm">完全响应式设计</p>
                </GridItem>
              </Grid>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Auto-fit 网格</h3>
              <Grid
                variant="auto-fit"
                gap={4}
                minColumnWidth="200px"
                maxColumnWidth="1fr"
              >
                <GridItem className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
                  <h4 className="font-medium mb-2">Auto-fit 项目 1</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">自适应列数</p>
                </GridItem>
                <GridItem className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
                  <h4 className="font-medium mb-2">Auto-fit 项目 2</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">最小宽度 200px</p>
                </GridItem>
                <GridItem className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
                  <h4 className="font-medium mb-2">Auto-fit 项目 3</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">智能空间分配</p>
                </GridItem>
                <GridItem className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
                  <h4 className="font-medium mb-2">Auto-fit 项目 4</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">响应式设计</p>
                </GridItem>
              </Grid>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">跨行跨列示例</h3>
              <Grid cols={4} gap={4}>
                <GridItem colSpan={2} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">跨2列</h4>
                  <p className="text-sm">占据两列空间</p>
                </GridItem>
                <GridItem className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">正常项</p>
                </GridItem>
                <GridItem className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">正常项</p>
                </GridItem>
                <GridItem className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">正常项</p>
                </GridItem>
                <GridItem rowSpan={2} colSpan={2} className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">跨2行2列</h4>
                  <p className="text-sm">占据更大的网格空间</p>
                </GridItem>
                <GridItem className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">正常项</p>
                </GridItem>
                <GridItem className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">正常项</p>
                </GridItem>
              </Grid>
            </div>
          </div>
        </section>
      </Container>

      {/* Panel 组件演示 */}
      <Container variant="default" size="lg" className="mb-12">
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Panel 组件</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel variant="default">
              <PanelHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Default Panel</h3>
              </PanelHeader>
              <PanelContent>
                <p className="text-gray-600 dark:text-gray-400">
                  这是一个默认样式的面板组件。Panel 组件支持复合组件模式，
                  可以通过 PanelHeader、PanelContent、PanelFooter 组合使用。
                </p>
              </PanelContent>
              <PanelFooter>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    确认
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors">
                    取消
                  </button>
                </div>
              </PanelFooter>
            </Panel>

            <Panel variant="elevated">
              <PanelHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Elevated Panel</h3>
              </PanelHeader>
              <PanelContent>
                <p className="text-gray-600 dark:text-gray-400">
                  这是一个提升样式的面板，具有阴影效果，适合需要突出显示的内容。
                </p>
              </PanelContent>
            </Panel>

            <Panel variant="outlined">
              <PanelHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Outlined Panel</h3>
              </PanelHeader>
              <PanelContent>
                <p className="text-gray-600 dark:text-gray-400">
                  这是一个轮廓样式的面板，具有更粗的边框，视觉上更加突出。
                </p>
              </PanelContent>
            </Panel>

            <Panel variant="ghost">
              <PanelHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ghost Panel</h3>
              </PanelHeader>
              <PanelContent>
                <p className="text-gray-600 dark:text-gray-400">
                  这是一个透明样式的面板，没有背景和边框，适合嵌入其他布局中。
                </p>
              </PanelContent>
            </Panel>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">可折叠面板</h3>
            <Panel
              variant="elevated"
              collapsible
              collapsed={collapsedPanel}
              onCollapseChange={setCollapsedPanel}
            >
              <PanelHeader showCollapseIcon>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">可折叠面板</h3>
              </PanelHeader>
              <PanelContent>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    这是一个可折叠的面板组件。点击头部可以展开或收起内容。
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">功能特性</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• 平滑的展开/收起动画</li>
                      <li>• 支持受控和非受控模式</li>
                      <li>• 完整的可访问性支持</li>
                      <li>• Framer Motion 动画集成</li>
                    </ul>
                  </div>
                </div>
              </PanelContent>
              <PanelFooter>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  当前状态: {collapsedPanel ? '已收起' : '已展开'}
                </p>
              </PanelFooter>
            </Panel>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">不同尺寸的面板</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Panel size="sm" variant="default">
                <PanelHeader>
                  <h4 className="font-semibold text-gray-900 dark:text-white">小尺寸面板</h4>
                </PanelHeader>
                <PanelContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    小尺寸的面板，适合紧凑型布局。
                  </p>
                </PanelContent>
              </Panel>

              <Panel size="md" variant="default">
                <PanelHeader>
                  <h4 className="font-semibold text-gray-900 dark:text-white">中等尺寸面板</h4>
                </PanelHeader>
                <PanelContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    中等尺寸的面板，适合大多数使用场景。
                  </p>
                </PanelContent>
              </Panel>

              <Panel size="lg" variant="default">
                <PanelHeader>
                  <h4 className="font-semibold text-gray-900 dark:text-white">大尺寸面板</h4>
                </PanelHeader>
                <PanelContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    大尺寸的面板，适合需要更多空间的内容展示。
                  </p>
                </PanelContent>
              </Panel>
            </div>
          </div>
        </section>
      </Container>

      {/* 实现总结 */}
      <Container variant="constrained" size="lg">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl border border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-6">✅ 实现完成总结</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-800 dark:text-green-200">
            <div>
              <h3 className="font-semibold text-lg mb-3">Container 组件</h3>
              <ul className="space-y-1 text-sm">
                <li>• 4种变体：default、fluid、constrained、centered</li>
                <li>• 5种尺寸：sm、md、lg、xl、2xl、full</li>
                <li>• 响应式设计支持</li>
                <li>• 内边距控制（none、sm、md、lg、xl）</li>
                <li>• 水平/垂直居中支持</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Grid 组件</h3>
              <ul className="space-y-1 text-sm">
                <li>• 3种变体：default、auto-fit、masonry</li>
                <li>• 1-12列响应式控制</li>
                <li>• 间距控制（gap、gapX、gapY）</li>
                <li>• Auto-fit 和 auto-fill 支持</li>
                <li>• 自定义最小/最大宽度</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">GridItem 组件</h3>
              <ul className="space-y-1 text-sm">
                <li>• 跨行跨列控制（colSpan、rowSpan）</li>
                <li>• 网格定位（colStart、colEnd、rowStart、rowEnd）</li>
                <li>• 自动布局支持</li>
                <li>• 完整的网格系统功能</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Panel 复合组件</h3>
              <ul className="space-y-1 text-sm">
                <li>• 4种变体：default、elevated、outlined、ghost</li>
                <li>• 3种尺寸：sm、md、lg</li>
                <li>• 可折叠状态支持</li>
                <li>• Framer Motion 动画集成</li>
                <li>• 完整的可访问性支持</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-green-300 dark:border-green-700">
            <h3 className="font-semibold text-lg mb-3 text-green-900 dark:text-green-100">技术特性</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-sm">Class Variance Authority</span>
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-sm">TypeScript 类型安全</span>
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-sm">forwardRef 支持</span>
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-sm">主题系统集成</span>
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-sm">Framer Motion 动画</span>
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-sm">响应式设计</span>
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-sm">可访问性支持</span>
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-sm">displayName 规范</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default LayoutDemo
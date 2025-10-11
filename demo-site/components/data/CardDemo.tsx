import React, { useState } from "react"
import { Card, CardHeader, CardContent, CardFooter, CardImage } from "../../../src/components/ui/Card"
import { Button } from "../../../src/components/ui/Button"

export default function CardDemo() {
  const [clickCount, setClickCount] = useState(0)
  const [loadingCards, setLoadingCards] = useState(true)

  // 模拟加载完成
  React.useEffect(() => {
    const timer = setTimeout(() => setLoadingCards(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📐 数据展示 - 增强卡片</h2>
      <div className="space-y-8">
        {/* 新变体 - Bordered 和 Filled */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">新增变体</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="bordered">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">边框卡片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                强调边框，无阴影，适合简洁设计
              </p>
            </Card>

            <Card variant="filled">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">填充卡片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                浅色背景填充，适合区分内容区域
              </p>
            </Card>

            <Card variant="elevated">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">提升卡片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                明显阴影效果，突出重点内容
              </p>
            </Card>
          </div>
        </div>

        {/* Hover 效果演示 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Hover 交互效果</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" hoverable>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">默认 Hover</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                悬停时上移并加深阴影
              </p>
            </Card>

            <Card variant="elevated" hoverable>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">提升 Hover</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                更强的阴影提升效果
              </p>
            </Card>

            <Card variant="neon" hoverable>
              <h4 className="font-semibold mb-2">霓虹 Hover</h4>
              <p className="text-sm text-cyan-300">
                霓虹光晕加强效果
              </p>
            </Card>
          </div>
        </div>

        {/* 可点击卡片 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">可点击卡片（带键盘支持）</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              variant="interactive"
              hoverable
              onClick={() => setClickCount(c => c + 1)}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">交互卡片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                点击这张卡片或按 Enter/Space 键
              </p>
              <p className="text-xs text-blue-500 font-medium">
                点击次数: {clickCount}
              </p>
            </Card>

            <Card
              variant="gradient"
              hoverable
              onClick={() => alert('渐变卡片被点击！')}
            >
              <h4 className="font-semibold text-white mb-2">渐变交互卡片</h4>
              <p className="text-sm text-white/90 mb-3">
                支持完整的键盘导航和可访问性
              </p>
              <p className="text-xs text-white/80 font-medium">
                点击或按键试试 →
              </p>
            </Card>
          </div>
        </div>

        {/* Loading 状态 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Loading 骨架屏</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" loading={loadingCards} />
            <Card variant="bordered" loading={loadingCards} />
            <Card variant="elevated" loading={loadingCards} />
          </div>
          {!loadingCards && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                setLoadingCards(true)
                setTimeout(() => setLoadingCards(false), 2000)
              }}
            >
              重新加载
            </Button>
          )}
        </div>

        {/* 卡片密度 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">密度选项</h3>
          <div className="space-y-4">
            <Card variant="default" density="compact">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">紧凑密度 (compact)</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                最小内边距，适合信息密集的界面
              </p>
            </Card>

            <Card variant="default" density="comfortable">
              <h4 className="font-semibold text-gray-900 dark:text-white">舒适密度 (comfortable) - 默认</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                标准内边距，平衡美观和空间利用
              </p>
            </Card>

            <Card variant="default" density="spacious">
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">宽松密度 (spacious)</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                更大内边距，突出内容，适合重要信息展示
              </p>
            </Card>
          </div>
        </div>

        {/* 图片卡片 - Top Position */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">图片卡片 - 顶部位置</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" hoverable density="compact">
              <CardImage
                src="https://picsum.photos/400/300?random=1"
                alt="示例图片 1"
                position="top"
                aspectRatio="16/9"
              />
              <CardHeader title="风景图片" subtitle="16:9 宽高比" />
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  顶部图片布局，适合博客文章、产品展示等场景。
                </p>
              </CardContent>
            </Card>

            <Card variant="default" hoverable density="compact">
              <CardImage
                src="https://picsum.photos/400/400?random=2"
                alt="示例图片 2"
                position="top"
                aspectRatio="1/1"
              />
              <CardHeader title="方形图片" subtitle="1:1 宽高比" />
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  正方形图片，适合头像、图标或对称构图。
                </p>
              </CardContent>
            </Card>

            <Card variant="default" hoverable density="compact">
              <CardImage
                src="https://picsum.photos/400/300?random=3"
                alt="示例图片 3"
                position="top"
                aspectRatio="4/3"
              />
              <CardHeader title="标准图片" subtitle="4:3 宽高比" />
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  传统 4:3 比例，经典的图片展示方式。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 图片卡片 - Left/Right Position */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">图片卡片 - 左右位置</h3>
          <div className="space-y-4">
            <Card variant="default" hoverable className="flex">
              <CardImage
                src="https://picsum.photos/300/400?random=4"
                alt="左侧图片"
                position="left"
                aspectRatio="4/3"
              />
              <div className="flex-1">
                <CardHeader title="左侧图片布局" subtitle="适合横向内容展示" />
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    图片在左侧，内容在右侧，适合列表项、文章摘要等场景。
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1 list-disc list-inside">
                    <li>响应式布局</li>
                    <li>图片懒加载</li>
                    <li>错误处理</li>
                  </ul>
                </CardContent>
              </div>
            </Card>

            <Card variant="default" hoverable className="flex">
              <div className="flex-1">
                <CardHeader title="右侧图片布局" subtitle="视觉平衡的另一种选择" />
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    图片在右侧，内容在左侧，提供不同的视觉焦点。
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1 list-disc list-inside">
                    <li>自动加载状态</li>
                    <li>骨架屏占位</li>
                    <li>流畅过渡动画</li>
                  </ul>
                </CardContent>
              </div>
              <CardImage
                src="https://picsum.photos/300/400?random=5"
                alt="右侧图片"
                position="right"
                aspectRatio="4/3"
              />
            </Card>
          </div>
        </div>

        {/* 图片卡片 - Cover Position */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">图片卡片 - 背景覆盖</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="default" hoverable className="relative min-h-[300px]">
              <CardImage
                src="https://picsum.photos/800/600?random=6"
                alt="背景图片"
                position="cover"
                aspectRatio="16/9"
              />
              <div className="relative z-10 bg-gradient-to-t from-black/70 to-transparent p-6 min-h-[300px] flex flex-col justify-end">
                <h4 className="font-bold text-white text-xl mb-2">背景覆盖模式</h4>
                <p className="text-sm text-white/90">
                  图片作为背景，内容叠加在上面，适合英雄区块和特色展示。
                </p>
              </div>
            </Card>

            <Card variant="gradient" hoverable className="relative min-h-[300px]">
              <CardImage
                src="https://picsum.photos/800/600?random=7"
                alt="背景图片"
                position="cover"
                aspectRatio="16/9"
              />
              <div className="relative z-10 p-6 min-h-[300px] flex flex-col justify-center items-center text-center">
                <h4 className="font-bold text-white text-2xl mb-3">渐变覆盖效果</h4>
                <p className="text-sm text-white/95 mb-4">
                  结合渐变和图片背景，创造视觉冲击力
                </p>
                <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-gray-900">
                  了解更多
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* 复合演示 - 完整卡片结构 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">完整卡片结构</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="elevated" hoverable density="comfortable">
              <CardImage
                src="https://picsum.photos/400/300?random=8"
                alt="产品图片"
                position="top"
                aspectRatio="16/9"
              />
              <CardHeader
                title="产品展示卡片"
                subtitle="完整的卡片组件示例"
                action={
                  <Button variant="ghost" size="sm">
                    编辑
                  </Button>
                }
              />
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  这是一个包含图片、标题、内容和操作按钮的完整卡片示例。展示了所有子组件的组合使用。
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
                    标签1
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full">
                    标签2
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                    标签3
                  </span>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">2024-10-11</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    取消
                  </Button>
                  <Button variant="primary" size="sm">
                    确认
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card
              variant="bordered"
              hoverable
              onClick={() => alert('整张卡片可点击')}
              density="comfortable"
            >
              <CardImage
                src="https://picsum.photos/400/300?random=9"
                alt="文章缩略图"
                position="top"
                aspectRatio="16/9"
              />
              <CardHeader
                title="可点击的文章卡片"
                subtitle="整张卡片都是可点击区域"
              />
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  适合文章列表、新闻流等场景。整张卡片都可以点击，提供更大的点击区域和更好的用户体验。
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    1.2K 阅读
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    89 点赞
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 向后兼容性演示 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">向后兼容（旧 API）</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            旧的 <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">size</code>、
            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">hover</code>、
            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">click</code> props
            仍然可以正常工作。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" size="sm" hover>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">size="sm"</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                自动映射到 density="compact"
              </p>
            </Card>

            <Card variant="default" size="md" hover click>
              <h4 className="font-semibold text-gray-900 dark:text-white">size="md"</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                自动映射到 density="comfortable"
              </p>
            </Card>

            <Card variant="default" size="lg" hover>
              <h4 className="font-semibold text-gray-900 dark:text-white text-base">size="lg"</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                自动映射到 density="spacious"
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

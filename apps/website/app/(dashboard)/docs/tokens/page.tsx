import { Metadata } from 'next'
import { readonlyTokens } from '@/data/tokens.readonly'

export const metadata: Metadata = {
  title: '设计令牌 - Xorigo UI',
  description: 'Xorigo UI 设计令牌系统，包含颜色、字体、间距等设计规范',
  keywords: ['设计令牌', 'Design Tokens', '设计系统', '设计规范'],
}

export default async function TokensPage() {
  // 使用 Data Layer 获取令牌数据
  const designTokens = readonlyTokens.getDesignTokens()
  const palettes = readonlyTokens.getPalettes()
  const foundations = readonlyTokens.getFoundations()
  const typography = readonlyTokens.getTypography()
  const spacing = readonlyTokens.getSpacing()
  const recipes = readonlyTokens.getRecipes()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              设计令牌
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Xorigo UI 的设计令牌系统，确保整个产品线的视觉一致性
            </p>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">总令牌数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">20+</div>
              <div className="text-sm text-gray-600">颜色令牌</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">10+</div>
              <div className="text-sm text-gray-600">字体令牌</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">15+</div>
              <div className="text-sm text-gray-600">间距令牌</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 颜色令牌 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">颜色令牌</h2>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {/* 主色系 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">主色系</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Primary</div>
                      <div className="text-xs text-gray-500">#3B82F6</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Primary Dark</div>
                      <div className="text-xs text-gray-500">#2563EB</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Primary Light</div>
                      <div className="text-xs text-gray-500">#DBEAFE</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 中性色系 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">中性色系</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-900 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Gray 900</div>
                      <div className="text-xs text-gray-500">#111827</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Gray 600</div>
                      <div className="text-xs text-gray-500">#4B5563</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Gray 100</div>
                      <div className="text-xs text-gray-500">#F3F4F6</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 功能色系 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">功能色系</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Success</div>
                      <div className="text-xs text-gray-500">#10B981</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Error</div>
                      <div className="text-xs text-gray-500">#EF4444</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded border"></div>
                    <div>
                      <div className="text-sm font-medium">Warning</div>
                      <div className="text-xs text-gray-500">#F59E0B</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 语义化颜色 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">语义化颜色</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded border border-blue-200"></div>
                    <div>
                      <div className="text-sm font-medium">Info Background</div>
                      <div className="text-xs text-gray-500">#EFF6FF</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-50 rounded border border-green-200"></div>
                    <div>
                      <div className="text-sm font-medium">Success Background</div>
                      <div className="text-xs text-gray-500">#F0FDF4</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-50 rounded border border-red-200"></div>
                    <div>
                      <div className="text-sm font-medium">Error Background</div>
                      <div className="text-xs text-gray-500">#FEF2F2</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 字体令牌 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">字体令牌</h2>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-8">
              {/* 字体族 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">字体族</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="font-sans text-lg mb-2">Sans Serif</div>
                    <div className="text-sm text-gray-600 font-mono">Inter, system-ui, sans-serif</div>
                    <div className="mt-2 text-sm">用于正文内容</div>
                  </div>
                  <div>
                    <div className="font-mono text-lg mb-2">Monospace</div>
                    <div className="text-sm text-gray-600 font-mono">JetBrains Mono, monospace</div>
                    <div className="mt-2 text-sm">用于代码展示</div>
                  </div>
                  <div>
                    <div className="font-serif text-lg mb-2">Serif</div>
                    <div className="text-sm text-gray-600 font-mono">Georgia, serif</div>
                    <div className="mt-2 text-sm">用于标题装饰</div>
                  </div>
                </div>
              </div>

              {/* 字体大小 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">字体大小</h3>
                <div className="space-y-4">
                  <div className="text-4xl font-light">Display (48px)</div>
                  <div className="text-3xl font-light">Heading 1 (36px)</div>
                  <div className="text-2xl font-light">Heading 2 (30px)</div>
                  <div className="text-xl font-light">Heading 3 (24px)</div>
                  <div className="text-lg font-light">Heading 4 (20px)</div>
                  <div className="text-base font-light">Body Large (18px)</div>
                  <div className="text-sm font-light">Body (16px)</div>
                  <div className="text-xs font-light">Caption (14px)</div>
                </div>
              </div>

              {/* 字体粗细 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">字体粗细</h3>
                <div className="space-y-4">
                  <div className="font-thin text-lg">Thin (100)</div>
                  <div className="font-light text-lg">Light (300)</div>
                  <div className="font-normal text-lg">Regular (400)</div>
                  <div className="font-medium text-lg">Medium (500)</div>
                  <div className="font-semibold text-lg">Semibold (600)</div>
                  <div className="font-bold text-lg">Bold (700)</div>
                  <div className="font-extrabold text-lg">Extra Bold (800)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 间距令牌 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">间距令牌</h2>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'xs', size: '4px', value: 1 },
                { name: 'sm', size: '8px', value: 2 },
                { name: 'md', size: '12px', value: 3 },
                { name: 'lg', size: '16px', value: 4 },
                { name: 'xl', size: '24px', value: 6 },
                { name: '2xl', size: '32px', value: 8 },
                { name: '3xl', size: '48px', value: 12 },
                { name: '4xl', size: '64px', value: 16 },
              ].map((token) => (
                <div key={token.name} className="text-center">
                  <div
                    className="bg-gray-200 rounded mx-auto mb-2"
                    style={{ width: token.size, height: token.size }}
                  ></div>
                  <div className="font-medium text-gray-900">{token.name}</div>
                  <div className="text-sm text-gray-600">{token.value} * 4px</div>
                  <div className="text-xs text-gray-500">{token.size}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 使用指南 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">使用指南</h2>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">在 CSS 中使用</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-6">
                <div className="text-green-400">/* Tailwind CSS 类名 */</div>
                <div>.text-primary {/* 主色文字 */}</div>
                <div>.bg-primary {/* 主色背景 */}</div>
                <div>.border-primary {/* 主色边框 */}</div>
                <div className="mt-2"></div>
                <div>.text-lg {/* 大字体 */}</div>
                <div>.font-semibold {/* 粗体字 */}</div>
                <div className="mt-2"></div>
                <div>.p-4 {/* 16px 内边距 */}</div>
                <div>.m-2 {/* 8px 外边距 */}</div>
              </div>

              <h3 className="text-lg font-semibold mb-4">在 JavaScript 中使用</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-6">
                <div className="text-green-400">// 使用设计令牌</div>
                <div>import {'{'} colors, spacing, typography {'}'} from '@/tokens'</div>
                <div className="mt-2"></div>
                <div>const styles = {'{'}</div>
                <div>  primaryColor: colors.primary[500],</div>
                <div>  largeText: typography.sizes.lg,</div>
                <div>  cardPadding: spacing.md,</div>
                <div>{'}'}</div>
              </div>

              <h3 className="text-lg font-semibold mb-4">最佳实践</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>优先使用语义化令牌名称，而非具体的数值</li>
                <li>保持颜色对比度符合 WCAG AA 标准（4.5:1）</li>
                <li>在组件中使用相对单位（rem）而非像素单位</li>
                <li>确保在不同设备和屏幕尺寸下的可读性</li>
                <li>定期检查设计令牌的使用一致性</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
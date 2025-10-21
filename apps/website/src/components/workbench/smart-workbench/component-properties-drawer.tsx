'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils'
import { Button } from '@xorigo-ui/core'
// Badge 组件不存在，已移除导入
import { Input } from '@xorigo-ui/core'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { EnhancedComponentRenderer } from '../gallery-mode/enhanced-component-card'

/**
 * 抽屉变体配置
 */
const drawerVariants = cva(
  'fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50',
  {
    variants: {
      open: {
        true: 'translate-x-0',
        false: 'translate-x-full'
      }
    }
  }
)

/**
 * 遮罩层变体配置
 */
const overlayVariants = cva(
  'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40',
  {
    variants: {
      open: {
        true: 'opacity-100',
        false: 'opacity-0 pointer-events-none'
      }
    }
  }
)

interface ComponentPropertiesDrawerProps {
  component: any
  isOpen: boolean
  onClose: () => void
}

export function ComponentPropertiesDrawer({
  component,
  isOpen,
  onClose
}: ComponentPropertiesDrawerProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'code' | 'preview'>('properties')

  if (!component) return null

  return (
    <>
      {/* 遮罩层 */}
      <motion.div
        className={overlayVariants({ open: isOpen })}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        onClick={onClose}
      />

      {/* 抽屉面板 */}
      <motion.div
        className={drawerVariants({ open: isOpen })}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="h-full flex flex-col">
          {/* 抽屉头部 */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center ring-1 ring-inset ring-black/5">
                  <span className="text-blue-600 font-bold text-lg">
                    {component.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{component.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                    {component.category}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 标签页导航 */}
            <div className="flex items-center space-x-1 mt-4">
              {[
                { id: 'properties', name: '属性', icon: '⚙️' },
                { id: 'code', name: '代码', icon: '💻' },
                { id: 'preview', name: '预览', icon: '👁️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 抽屉内容 */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'properties' && (
                <motion.div
                  key="properties"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  {/* 基础属性 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>🎨</span>
                      <span>基础属性</span>
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          文本内容
                        </label>
                        <Input
                          placeholder="输入组件文本内容"
                          defaultValue="按钮文本"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          组件变体
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>primary</option>
                          <option>secondary</option>
                          <option>outline</option>
                          <option>ghost</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          组件尺寸
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['sm', 'md', 'lg'].map((size) => (
                            <button
                              key={size}
                              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                            >
                              {size.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 样式属性 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>🎭</span>
                      <span>样式属性</span>
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          背景颜色
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            defaultValue="#3b82f6"
                            className="w-10 h-10 rounded border border-gray-300"
                          />
                          <Input
                            placeholder="#3b82f6"
                            defaultValue="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          文字颜色
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            defaultValue="#ffffff"
                            className="w-10 h-10 rounded border border-gray-300"
                          />
                          <Input
                            placeholder="#ffffff"
                            defaultValue="#ffffff"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          圆角大小
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="24"
                          defaultValue="8"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 交互属性 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>⚡</span>
                      <span>交互属性</span>
                    </h4>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                        <span className="text-sm text-gray-700">禁用状态</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                        <span className="text-sm text-gray-700">加载状态</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                        <span className="text-sm text-gray-700">全宽显示</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">组件代码</h4>
                      <Button variant="outline" size="sm">
                        📋 复制代码
                      </Button>
                    </div>

                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`<Button variant="primary" size="md">
  按钮文本
</Button>`}</pre>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">导入语句</h5>
                      <div className="bg-gray-100 text-gray-800 p-3 rounded-lg font-mono text-sm">
                        <pre>{`import { Button } from '@xorigo-ui/core'`}</pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">实时预览</h4>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 min-h-[200px] flex items-center justify-center">
                      <div className="scale-125">
                        <EnhancedComponentRenderer
                          componentName={component.name}
                          variant="default"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <h5 className="text-sm font-medium text-gray-900">浅色主题</h5>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-center">
                            <EnhancedComponentRenderer
                              componentName={component.name}
                              variant="default"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <h5 className="text-sm font-medium text-gray-900">深色主题</h5>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="bg-gray-800 text-white rounded p-4 flex items-center justify-center">
                            <EnhancedComponentRenderer
                              componentName={component.name}
                              variant="default"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 抽屉底部操作栏 */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                实时编辑中...
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={onClose}>
                  取消
                </Button>
                <Button variant="primary" size="sm">
                  应用更改
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
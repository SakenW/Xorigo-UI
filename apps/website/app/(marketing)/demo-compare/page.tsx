'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@xorigo-ui/core'
import { ArrowLeft, ArrowRight, Github } from 'lucide-react'

// 动态导入两个版本
const UltimateEnhanced = dynamic(() => import('../demo/ultimate-ultimate.tsx'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">加载中...</div>
})

const UltimateSafe = dynamic(() => import('../demo/ultimate-safe.tsx'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">加载中...</div>
})

export default function ComparePage() {
  const [showVersion, setShowVersion] = useState<'safe' | 'enhanced'>('safe')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部控制栏 */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">Xorigo UI 版本对比</h1>

              <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-700/50">
                <button
                  className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                    showVersion === 'safe'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setShowVersion('safe')}
                >
                  ✅ 安全稳定版
                </button>
                <button
                  className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                    showVersion === 'enhanced'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setShowVersion('enhanced')}
                >
                  🚀 极致增强版
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="http://localhost:3100/demo"
                className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
              >
                返回选择器
              </a>
              <a
                href="https://github.com/SakenW/Xorigo-UI"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 版本说明 */}
      <div className="pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm mb-4">
            {showVersion === 'safe' ? '✅ 安全稳定版' : '🚀 极致增强版'}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {showVersion === 'safe' ? '安全稳定版' : '极致增强版'}
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            {showVersion === 'safe'
              ? '完全无错误的安全版本，使用CSS动画确保稳定运行，适合生产环境部署。'
              : '终极升级版本，包含150个高级粒子系统、多语言代码雨、3D组件球体、超级统计卡片等震撼视觉效果，展现Xorigo UI的极致实力！'}
          </p>
        </div>
      </div>

      {/* 渲染选中的版本 */}
      <div className="relative">
        {showVersion === 'safe' ? <UltimateSafe /> : <UltimateEnhanced />}
      </div>

      {/* 快速切换按钮 */}
      <div className="fixed bottom-6 right-6 z-[9998]">
        <Button
          onClick={() => setShowVersion(showVersion === 'safe' ? 'enhanced' : 'safe')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-2xl shadow-purple-500/50 flex items-center gap-2 text-sm font-medium border border-purple-400/30 transform hover:scale-105 transition-all duration-200"
        >
          {showVersion === 'safe' ? (
            <>
              查看增强版
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" />
              查看安全版
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
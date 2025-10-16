'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Github, ArrowLeft, ArrowRight } from 'lucide-react'

// 动态导入多个版本
const UltimateEnhanced = dynamic(() => import('../demo/ultimate-ultimate-enhanced/page'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">加载中...</div>
})

const UltimateFeatures = dynamic(() => import('../demo/ultimate-features/page'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">加载中...</div>
})

const UltimateFinal = dynamic(() => import('../demo/ultimate-final/page'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black text-white flex items-center justify-center">加载中...</div>
})

export default function ComparePage() {
  const [showVersion, setShowVersion] = useState<'enhanced' | 'features' | 'final'>('enhanced')

  const versions = [
    {
      id: 'enhanced',
      title: '✨ 终极增强版',
      description: '顶级视觉效果 + 智能性能优化',
      color: 'from-purple-600 via-pink-500 to-cyan-500',
      features: ['鼠标交互粒子', '智能性能监控', '3D组件轮播', '流体动画', '增强代码雨', '沉浸式体验'],
      warning: '最新版本，最佳视觉效果和性能平衡'
    },
    {
      id: 'features',
      title: '🚀 极致效果版',
      description: '顶级视觉震撼效果，完整功能体验',
      color: 'from-purple-500 to-pink-500',
      features: ['3D组件轮播', '高级粒子系统', '代码雨效果', '流体动画', '鼠标轨迹', '丰富动效'],
      warning: '性能要求较高，建议在高性能设备上体验'
    },
    {
      id: 'final',
      title: '✅ 稳定优化版',
      description: '稳定运行，修复所有已知问题',
      color: 'from-green-500 to-cyan-500',
      features: ['性能监控系统', '质量调节', '稳定粒子', '简化代码雨', '优化性能', '无错误运行'],
      warning: '使用成熟库和方法，确保稳定流畅'
    }
  ]

  const currentVersion = versions.find(v => v.id === showVersion)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部控制栏 */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">Xorigo UI 版本对比</h1>

              {/* 版本切换按钮 */}
              <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-700/50">
                {versions.map((version) => (
                  <button
                    key={version.id}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                      showVersion === version.id
                        ? `bg-gradient-to-r ${version.color} text-white shadow-lg`
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => setShowVersion(version.id as 'enhanced' | 'features' | 'final')}
                  >
                    {version.title}
                  </button>
                ))}
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
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${
            showVersion === 'enhanced' ? 'bg-purple-600/20 border-purple-600/50' :
            showVersion === 'features' ? 'bg-purple-500/20 border-purple-500/50' : 'bg-green-500/20 border-green-500/50'
          } border rounded-full text-sm mb-4`}>
            {currentVersion?.title}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {currentVersion?.description}
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {currentVersion?.features.map((feature, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 ${
                    showVersion === 'enhanced' ? 'bg-purple-600/20 text-purple-400' :
                    showVersion === 'features' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                  } rounded-full text-sm`}
                >
                  {feature}
                </span>
              ))}
            </div>

            <p className={`text-sm ${
              showVersion === 'enhanced' ? 'text-purple-400' :
              showVersion === 'features' ? 'text-orange-400' : 'text-green-400'
            }`}>
              ⚠️ {currentVersion?.warning}
            </p>
          </div>
        </div>
      </div>

      {/* 渲染选中的版本 */}
      <div className="relative">
        {showVersion === 'enhanced' ? <UltimateEnhanced /> :
         showVersion === 'features' ? <UltimateFeatures /> : <UltimateFinal />}
      </div>

      {/* 快速切换按钮 */}
      <div className="fixed bottom-6 right-6 z-[9998]">
        <button
          onClick={() => {
            const nextVersion = showVersion === 'enhanced' ? 'features' :
                             showVersion === 'features' ? 'final' : 'enhanced'
            setShowVersion(nextVersion as 'enhanced' | 'features' | 'final')
          }}
          className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium transform hover:scale-105 transition-all duration-200 border ${
            showVersion === 'enhanced'
              ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-400/30 shadow-purple-500/50'
              : showVersion === 'features'
              ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-400/30 shadow-orange-500/50'
              : 'bg-green-600 hover:bg-green-700 text-white border-green-400/30 shadow-green-500/50'
          }`}
        >
          {showVersion === 'enhanced' ? (
            <>
              查看效果版
              <ArrowRight className="w-4 h-4" />
            </>
          ) : showVersion === 'features' ? (
            <>
              查看稳定版
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" />
              查看增强版
            </>
          )}
        </button>
      </div>
    </div>
  )
}
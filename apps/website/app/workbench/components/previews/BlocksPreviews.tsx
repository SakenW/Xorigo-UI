/**
 * 📦 业务区块组件预览系统
 *
 * 支持的组件：15个业务区块组件
 * - HeroSection, FeatureSection, PricingSection, TestimonialSection
 * - LoginSection, RegisterSection, AuthCard, ResetPasswordSection
 * - CallToActionSection, FAQSection, ChartPanel, KPOverview
 * - StatsGrid, FilterBar, ActivityFeed
 */

'use client'

import React from 'react'

interface BlockPreviewProps {
  componentName: string
}

export function BlockPreview({ componentName }: BlockPreviewProps) {
  const renderBlockPreview = () => {
    switch (componentName) {
      case 'HeroSection':
        return (
          <div className="w-full h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
            <div className="space-y-2">
              <div className="w-16 h-1 bg-white rounded"></div>
              <div className="w-24 h-3 bg-white/80 rounded"></div>
              <div className="w-20 h-2 bg-white/60 rounded"></div>
              <div className="flex space-x-2 mt-3">
                <div className="w-12 h-6 bg-white text-blue-600 rounded text-xs flex items-center justify-center">按钮</div>
                <div className="w-12 h-6 bg-white/20 border border-white/40 rounded text-xs flex items-center justify-center">链接</div>
              </div>
            </div>
            <p className="text-xs text-white/80 mt-2">HeroSection</p>
          </div>
        )

      case 'FeatureSection':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center space-y-1">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto"></div>
                  <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
                  <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">FeatureSection</p>
          </div>
        )

      case 'PricingSection':
        return (
          <div className="w-full h-32 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-gray-300 dark:border-gray-600 rounded p-2 text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">¥9</div>
                <div className="text-xs">基础版</div>
              </div>
              <div className="border-2 border-green-500 rounded p-2 text-center bg-green-50 dark:bg-green-900/20">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">¥29</div>
                <div className="text-xs">专业版</div>
              </div>
              <div className="border border-gray-300 dark:border-gray-600 rounded p-2 text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">¥99</div>
                <div className="text-xs">企业版</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">PricingSection</p>
          </div>
        )

      case 'TestimonialSection':
        return (
          <div className="w-full h-32 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                ))}
              </div>
              <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                <div className="text-xs text-gray-600 dark:text-gray-400">张三</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">TestimonialSection</p>
          </div>
        )

      case 'LoginSection':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-3">
              <div className="text-center font-semibold text-gray-800 dark:text-gray-200">登录</div>
              <div className="space-y-2">
                <div className="w-full h-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                <div className="w-full h-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                <div className="w-full h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center">登录</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">LoginSection</p>
          </div>
        )

      case 'RegisterSection':
        return (
          <div className="w-full h-32 bg-green-50 dark:bg-green-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="text-center font-semibold text-green-800 dark:text-green-200">注册</div>
              <div className="space-y-1">
                <div className="w-full h-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                <div className="w-full h-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                <div className="w-full h-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">RegisterSection</p>
          </div>
        )

      case 'AuthCard':
        return (
          <div className="w-full h-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4">
            <div className="space-y-3">
              <div className="text-center font-semibold text-gray-800 dark:text-gray-200">认证卡片</div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <div className="w-6 h-6 bg-red-600 rounded"></div>
                  <div className="w-6 h-6 bg-gray-800 rounded"></div>
                </div>
                <div className="w-full h-6 bg-gray-100 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">AuthCard</p>
          </div>
        )

      case 'ResetPasswordSection':
        return (
          <div className="w-full h-32 bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="text-center font-semibold text-orange-800 dark:text-orange-200">重置密码</div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                <div className="w-full h-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
                <div className="w-full h-4 bg-orange-600 text-white rounded text-xs flex items-center justify-center">发送</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ResetPasswordSection</p>
          </div>
        )

      case 'CallToActionSection':
        return (
          <div className="w-full h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
            <div className="text-center space-y-2">
              <div className="w-20 h-3 bg-white rounded mx-auto"></div>
              <div className="w-16 h-2 bg-white/80 rounded mx-auto"></div>
              <div className="flex justify-center space-x-2">
                <div className="w-12 h-5 bg-white text-purple-600 rounded text-xs flex items-center justify-center">开始</div>
                <div className="w-12 h-5 bg-white/20 border border-white/40 rounded text-xs flex items-center justify-center">了解</div>
              </div>
            </div>
            <p className="text-xs text-white/80 mt-2">CallToActionSection</p>
          </div>
        )

      case 'FAQSection':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="font-semibold text-indigo-800 dark:text-indigo-200 text-xs">常见问题</div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-indigo-200 dark:border-indigo-700 rounded p-2">
                  <div className="w-full h-2 bg-indigo-300 dark:bg-indigo-600 rounded"></div>
                  <div className="w-full h-1 bg-indigo-200 dark:bg-indigo-700 rounded mt-1"></div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">FAQSection</p>
          </div>
        )

      case 'ChartPanel':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="text-center font-semibold text-gray-800 dark:text-gray-200 text-xs">图表面板</div>
              <div className="w-full h-12 bg-gradient-to-r from-blue-200 to-green-200 dark:from-blue-800 dark:to-green-800 rounded"></div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>一月</span>
                <span>二月</span>
                <span>三月</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ChartPanel</p>
          </div>
        )

      case 'KPOverview':
        return (
          <div className="w-full h-32 bg-emerald-50 dark:bg-emerald-900 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">1.2K</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">用户</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">89%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">满意度</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">¥45K</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">收入</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">234</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">订单</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">KPOverview</p>
          </div>
        )

      case 'StatsGrid':
        return (
          <div className="w-full h-32 bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className={`w-6 h-6 rounded-full mx-auto ${
                    i === 0 ? 'bg-blue-500' :
                    i === 1 ? 'bg-green-500' :
                    i === 2 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {i === 0 ? '12' : i === 1 ? '24' : i === 2 ? '8' : '16'}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">StatsGrid</p>
          </div>
        )

      case 'FilterBar':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="w-12 h-5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"></div>
                <div className="w-12 h-5 bg-blue-600 text-white rounded text-xs flex items-center justify-center">筛选</div>
              </div>
              <div className="flex space-x-1">
                <div className="w-8 h-4 bg-blue-100 dark:bg-blue-900 rounded text-xs flex items-center justify-center">全部</div>
                <div className="w-8 h-4 bg-gray-100 dark:bg-gray-700 rounded text-xs flex items-center justify-center">活跃</div>
                <div className="w-8 h-4 bg-gray-100 dark:bg-gray-700 rounded text-xs flex items-center justify-center">待定</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">FilterBar</p>
          </div>
        )

      case 'ActivityFeed':
        return (
          <div className="w-full h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="font-semibold text-gray-800 dark:text-gray-200 text-xs">活动动态</div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">2小时前</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ActivityFeed</p>
          </div>
        )

      default:
        return (
          <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{componentName}</p>
          </div>
        )
    }
  }

  return (
    <div className="flex items-center justify-center">
      {renderBlockPreview()}
    </div>
  )
}
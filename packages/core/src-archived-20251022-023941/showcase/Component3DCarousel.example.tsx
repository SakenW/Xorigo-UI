/**
 * Component3DCarousel 使用示例
 */

import React from 'react'
import { Component3DCarousel } from '@xorigo-ui/core'

/**
 * 基础示例 - 展示如何使用 Component3DCarousel
 */
export const BasicExample = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <Component3DCarousel />
    </div>
  )
}

/**
 * 包装示例 - 在容器中使用 Component3DCarousel
 */
export const WrappedExample = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Xorigo UI 组件展示
        </h1>
        <div className="max-w-6xl mx-auto">
          <Component3DCarousel />
        </div>
      </div>
    </div>
  )
}

/**
 * 响应式示例 - 在响应式布局中使用 Component3DCarousel
 */
export const ResponsiveExample = () => {
  return (
    <div className="w-full bg-gray-800 p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-8">
          组件轮播展示
        </h2>
        <div className="relative w-full h-[400px] md:h-[450px] lg:h-[500px]">
          <Component3DCarousel />
        </div>
      </div>
    </div>
  )
}

export default {
  BasicExample,
  WrappedExample,
  ResponsiveExample,
}
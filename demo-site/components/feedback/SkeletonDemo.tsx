import React, { useState } from 'react'
import { Skeleton, SkeletonGroup } from '../../../src/components/Skeleton'
import { Button } from '../../../src/components/Button'
import { Card } from '../../../src/components/Card'

const SkeletonDemo: React.FC = () => {
  const [loading, setLoading] = useState(true)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Skeleton 骨架屏
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          在需要等待加载内容的位置提供一个占位图形组合
        </p>
      </div>

      {/* 基础用法 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础用法
        </h3>

        <div className="space-y-3">
          <Skeleton />
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </div>
      </div>

      {/* 不同形状 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          不同形状
        </h3>

        <div className="flex flex-wrap items-start gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">文本</p>
            <Skeleton variant="text" width="200px" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">圆形</p>
            <Skeleton variant="circular" width="60px" height="60px" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">矩形</p>
            <Skeleton variant="rectangular" width="200px" height="100px" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">圆角矩形</p>
            <Skeleton variant="rounded" width="200px" height="100px" />
          </div>
        </div>
      </div>

      {/* 动画效果 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          动画效果
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              脉冲 (Pulse)
            </p>
            <Skeleton animation="pulse" height="100px" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              波浪 (Wave)
            </p>
            <Skeleton animation="wave" height="100px" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              无动画 (None)
            </p>
            <Skeleton animation="none" height="100px" />
          </div>
        </div>
      </div>

      {/* 预设组合 - 卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          卡片骨架
        </h3>

        <SkeletonGroup type="card" count={3} />
      </div>

      {/* 预设组合 - 列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          列表骨架
        </h3>

        <SkeletonGroup type="list" count={4} />
      </div>

      {/* 预设组合 - 文章 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          文章骨架
        </h3>

        <SkeletonGroup type="article" count={1} />
      </div>

      {/* 预设组合 - 个人资料 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          个人资料骨架
        </h3>

        <SkeletonGroup type="profile" count={2} />
      </div>

      {/* 预设组合 - 表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          表格骨架
        </h3>

        <SkeletonGroup type="table" count={1} />
      </div>

      {/* 实际应用 - 加载状态切换 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            实际应用 - 内容加载
          </h3>
          <Button onClick={() => setLoading(!loading)}>
            {loading ? '显示内容' : '显示骨架屏'}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonGroup type="card" count={2} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              title="产品标题 1"
              description="这是产品的详细描述内容，介绍产品的主要特性和优势。"
              footer={
                <Button variant="primary" size="sm">
                  了解更多
                </Button>
              }
            />
            <Card
              title="产品标题 2"
              description="这是产品的详细描述内容，介绍产品的主要特性和优势。"
              footer={
                <Button variant="primary" size="sm">
                  了解更多
                </Button>
              }
            />
          </div>
        )}
      </div>

      {/* 自定义组合 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          自定义组合
        </h3>

        <div className="space-y-4">
          {/* 用户评论骨架 */}
          <div className="flex gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Skeleton variant="circular" width="48px" height="48px" />
            <div className="flex-1 space-y-2">
              <Skeleton width="30%" height="20px" />
              <Skeleton width="100%" />
              <Skeleton width="80%" />
              <div className="flex gap-2 mt-3">
                <Skeleton width="60px" height="32px" variant="rounded" />
                <Skeleton width="60px" height="32px" variant="rounded" />
              </div>
            </div>
          </div>

          {/* 产品卡片骨架 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Skeleton variant="rectangular" height="200px" />
                <div className="p-4 space-y-3">
                  <Skeleton width="80%" height="24px" />
                  <Skeleton width="50%" height="20px" />
                  <Skeleton width="100%" />
                  <Skeleton width="60%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonDemo

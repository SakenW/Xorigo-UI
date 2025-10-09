import React, { useState } from 'react'
import { Loading, Spinner, Skeleton } from '../../../src/components/Loading'
import { Card } from '../../../src/components/Card'
import { Button } from '../../../src/components/Button'

export default function LoadingDemo() {
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">💬 反馈组件 - 加载状态</h2>
        <Card>
          <div className="space-y-6">
            {/* 基础Loading */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Loading 组件</h3>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">小尺寸</p>
                  <Loading size="sm" text="加载中..." />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">中尺寸</p>
                  <Loading size="md" text="加载中..." />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">大尺寸</p>
                  <Loading size="lg" text="加载中..." />
                </div>
              </div>
            </div>

            {/* Spinner */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Spinner 旋转器</h3>
              <div className="flex items-center gap-6">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="md" color="border-t-green-600 dark:border-t-green-500" />
                <Spinner size="md" color="border-t-red-600 dark:border-t-red-500" />
              </div>
            </div>

            {/* Skeleton */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Skeleton 骨架屏</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">文本骨架</p>
                  <div className="space-y-2">
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">矩形骨架</p>
                  <Skeleton variant="rectangular" width={200} height={120} />
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">圆形骨架</p>
                  <div className="flex gap-4">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="circular" width={60} height={60} />
                    <Skeleton variant="circular" width={80} height={80} />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">用户卡片骨架</p>
                  <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Skeleton variant="circular" width={50} height={50} />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" width="40%" height={16} />
                      <Skeleton variant="text" width="60%" height={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Loading */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">遮罩层加载</h3>
              <Button onClick={() => setShowOverlay(true)} variant="primary">
                显示全屏加载
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                点击按钮显示全屏遮罩加载效果(3秒后自动关闭)
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Overlay Loading */}
      {showOverlay && (
        <Loading
          overlay
          size="lg"
          text="正在加载..."
        />
      )}

      {showOverlay && setTimeout(() => setShowOverlay(false), 3000)}
    </>
  )
}

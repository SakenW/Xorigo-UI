import React, { useState, useEffect } from 'react'
import { Progress, CircularProgress } from '../../../src/components/Progress'
import { Button } from '../../../src/components/Button'

const ProgressDemo: React.FC = () => {
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsRunning(false)
            return 100
          }
          return prev + 1
        })
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isRunning, progress])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleReset = () => {
    setProgress(0)
    setIsRunning(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Progress 进度条
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          用于展示操作进度，告知用户当前状态和预期
        </p>
      </div>

      {/* 基础进度条 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础用法
        </h3>

        <div className="space-y-4">
          <Progress value={25} />
          <Progress value={50} />
          <Progress value={75} />
          <Progress value={100} />
        </div>
      </div>

      {/* 不同尺寸 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          不同尺寸
        </h3>

        <div className="space-y-4">
          <Progress value={60} size="sm" showLabel label="小尺寸" />
          <Progress value={60} size="md" showLabel label="中等尺寸" />
          <Progress value={60} size="lg" showLabel label="大尺寸" />
        </div>
      </div>

      {/* 不同状态 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          不同状态
        </h3>

        <div className="space-y-4">
          <Progress value={30} variant="default" showLabel label="默认" />
          <Progress value={50} variant="success" showLabel label="成功" />
          <Progress value={70} variant="warning" showLabel label="警告" />
          <Progress value={90} variant="error" showLabel label="错误" />
          <Progress value={60} variant="info" showLabel label="信息" />
        </div>
      </div>

      {/* 条纹动画 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          条纹动画
        </h3>

        <div className="space-y-4">
          <Progress value={60} striped showLabel label="静态条纹" />
          <Progress value={60} striped animated showLabel label="动画条纹" />
        </div>
      </div>

      {/* 交互式进度 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          交互式进度
        </h3>

        <div className="space-y-4">
          <Progress
            value={progress}
            variant={progress === 100 ? 'success' : 'default'}
            showLabel
            label={progress === 100 ? '完成！' : '上传中...'}
            striped
            animated={progress < 100}
          />

          <div className="flex gap-2">
            <Button onClick={handleStart} disabled={isRunning || progress === 100}>
              开始
            </Button>
            <Button onClick={handleReset} variant="outline">
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 环形进度条 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          环形进度条
        </h3>

        <div className="flex flex-wrap gap-8">
          <CircularProgress value={25} variant="default" />
          <CircularProgress value={50} variant="success" />
          <CircularProgress value={75} variant="warning" />
          <CircularProgress value={100} variant="error" />
        </div>
      </div>

      {/* 不同尺寸的环形进度条 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          环形进度条尺寸
        </h3>

        <div className="flex flex-wrap items-end gap-8">
          <CircularProgress value={70} size={80} strokeWidth={6} />
          <CircularProgress value={70} size={120} strokeWidth={8} />
          <CircularProgress value={70} size={160} strokeWidth={10} />
        </div>
      </div>

      {/* 无标签环形进度条 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          无标签环形进度条
        </h3>

        <div className="flex flex-wrap gap-8">
          <CircularProgress value={30} showLabel={false} variant="info" />
          <CircularProgress value={60} showLabel={false} variant="success" />
          <CircularProgress value={90} showLabel={false} variant="warning" />
        </div>
      </div>
    </div>
  )
}

export default ProgressDemo

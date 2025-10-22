/**
 * 动画系统快速开始示例
 *
 * 展示如何在项目中快速使用 Xorigo UI 动画系统
 */

import React from 'react'
import {
  AnimatedCard,
  AnimatedButton,
  AnimatedAlert,
  AnimatedList,
  AnimatedPresence,
  fadeVariants,
  slideVariants
} from '@/motion'

// 基础用法示例
export function BasicUsage() {
  return (
    <div className="space-y-4 p-6">
      {/* 直接使用预设动画 */}
      <AnimatedCard animation="fade">
        <h3>淡入卡片</h3>
        <p>这是一个使用预设淡入动画的卡片</p>
      </AnimatedCard>

      {/* 自定义动画变体 */}
      <AnimatedCard variants={slideVariants} initial="hidden" animate="visible">
        <h3>滑入卡片</h3>
        <p>这是一个使用自定义变体的滑入卡片</p>
      </AnimatedCard>

      {/* 交互式动画 */}
      <AnimatedButton
        animation="tap"
        whileHover="hover"
        whileTap="tap"
      >
        点击我
      </AnimatedButton>
    </div>
  )
}

// 主题感知动画示例
export function ThemedAnimation() {
  return (
    <div className="space-y-4 p-6">
      {/* 不同强度的动画 */}
      <AnimatedCard
        animation="scale"
        motionIntensity="subtle"
        motionComplexity="simple"
      >
        微妙动画 - 适合阅读场景
      </AnimatedCard>

      <AnimatedCard
        animation="scale"
        motionIntensity="standard"
        motionComplexity="moderate"
      >
        标准动画 - 平衡的交互体验
      </AnimatedCard>

      <AnimatedCard
        animation="scale"
        motionIntensity="expressive"
        motionComplexity="complex"
      >
        表现力动画 - 丰富的视觉效果
      </AnimatedCard>
    </div>
  )
}

// 列表动画示例
export function ListAnimation() {
  const items = ['项目 1', '项目 2', '项目 3', '项目 4']

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">错位动画列表</h3>
      <AnimatedList staggerDelay={0.1} direction="up">
        {items.map((item, index) => (
          <div key={index} className="p-3 bg-gray-100 rounded mb-2">
            {item}
          </div>
        ))}
      </AnimatedList>
    </div>
  )
}

// 条件渲染动画示例
export function ConditionalAnimation() {
  const [isVisible, setIsVisible] = React.useState(true)

  return (
    <div className="space-y-4 p-6">
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? '隐藏' : '显示'}内容
      </button>

      <AnimatedPresence>
        {isVisible && (
          <AnimatedAlert variant="success">
            这是有动画效果的提示内容
          </AnimatedAlert>
        )}
      </AnimatedPresence>
    </div>
  )
}

// 可访问性动画示例
export function AccessibleAnimation() {
  return (
    <div className="space-y-4 p-6">
      {/* 尊重用户的减少动画偏好 */}
      <AnimatedCard
        animation="fade"
        respectReducedMotion={true}
        safeToAnimate={true}
      >
        这个动画会尊重用户的可访问性偏好设置
      </AnimatedCard>

      {/* 安全动画变体 */}
      <AnimatedCard
        animation="scale"
        motionIntensity="subtle"
        safeToAnimate={true}
      >
        使用经过验证的安全动画变体
      </AnimatedCard>
    </div>
  )
}

// 完整的页面示例
export function CompleteExample() {
  const [notifications, setNotifications] = React.useState<string[]>([])

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
    setTimeout(() => {
      setNotifications(prev => prev.slice(1))
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 头部 */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">
            动画系统完整示例
          </h1>
          <p className="text-gray-600 mt-2">
            展示各种动画效果的实际应用场景
          </p>
        </header>

        {/* 通知区域 */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          <AnimatedPresence>
            {notifications.map((notification, index) => (
              <AnimatedAlert
                key={index}
                variant="success"
                animation="slide"
              >
                {notification}
              </AnimatedAlert>
            ))}
          </AnimatedPresence>
        </div>

        {/* 主要内容 */}
        <main className="space-y-8">
          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedCard
              animation="fade"
              variant="interactive"
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                快速操作
              </h2>
              <div className="space-y-3">
                <AnimatedButton
                  variant="primary"
                  onClick={() => addNotification('操作成功完成！')}
                  animation="tap"
                >
                  执行操作
                </AnimatedButton>
                <AnimatedButton
                  variant="secondary"
                  onClick={() => addNotification('次要操作已执行')}
                  animation="tap"
                >
                  次要操作
                </AnimatedButton>
              </div>
            </AnimatedCard>

            <AnimatedCard
              animation="slide"
              className="p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                系统状态
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">系统运行状态</span>
                  <span className="text-green-600 font-medium">正常</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">动画性能</span>
                  <span className="text-blue-600 font-medium">优秀</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">可访问性</span>
                  <span className="text-purple-600 font-medium">已启用</span>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* 数据列表 */}
          <AnimatedCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              数据展示
            </h2>
            <AnimatedList
              staggerDelay={0.1}
              direction="up"
              className="space-y-3"
            >
              {[
                { title: '任务 1', status: '已完成', progress: 100 },
                { title: '任务 2', status: '进行中', progress: 65 },
                { title: '任务 3', status: '待开始', progress: 0 },
                { title: '任务 4', status: '已暂停', progress: 35 }
              ].map((task, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      task.status === '已完成' ? 'bg-green-100 text-green-800' :
                      task.status === '进行中' ? 'bg-blue-100 text-blue-800' :
                      task.status === '待开始' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </AnimatedList>
          </AnimatedCard>
        </main>
      </div>
    </div>
  )
}

export default {
  BasicUsage,
  ThemedAnimation,
  ListAnimation,
  ConditionalAnimation,
  AccessibleAnimation,
  CompleteExample
}
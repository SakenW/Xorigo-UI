'use client'

import React, { useState } from 'react'

interface StepItem {
  title: string
  description?: string
  status?: 'wait' | 'process' | 'finish' | 'error'
  icon?: string
}

interface StepsRendererProps {
  current?: number
  direction?: 'horizontal' | 'vertical'
  size?: 'default' | 'small'
  items?: StepItem[]
  updateProp?: (prop: string, value: any) => void
}

export default function StepsRenderer({
  current = 1,
  direction = 'horizontal',
  size = 'default',
  items = [
    { title: '开始', description: '开始阶段', status: 'finish' },
    { title: '进行中', description: '当前进行', status: 'process' },
    { title: '待处理', description: '等待处理', status: 'wait' },
    { title: '完成', description: '最后完成', status: 'wait' }
  ],
  updateProp
}: StepsRendererProps) {
  const [currentStep, setCurrentStep] = useState(current)

  const handleStepClick = (index: number) => {
    setCurrentStep(index)
    if (updateProp) updateProp('current', index)
  }

  const getStepStatus = (index: number): 'wait' | 'process' | 'finish' | 'error' => {
    if (items[index]?.status) {
      return items[index].status!
    }
    if (index < currentStep) return 'finish'
    if (index === currentStep) return 'process'
    return 'wait'
  }

  const getStepIcon = (step: StepItem, index: number) => {
    const status = getStepStatus(index)

    if (step.icon) {
      return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
          ${status === 'finish' ? 'bg-green-500 text-white' : ''}
          ${status === 'process' ? 'bg-blue-500 text-white' : ''}
          ${status === 'error' ? 'bg-red-500 text-white' : ''}
          ${status === 'wait' ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400' : ''}
        `}>
          {step.icon}
        </div>
      )
    }

    if (status === 'finish') {
      return (
        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
          ✓
        </div>
      )
    }

    if (status === 'error') {
      return (
        <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
          ✕
        </div>
      )
    }

    return (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
        ${status === 'process' ? 'border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
        ${status === 'wait' ? 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400' : ''}
      `}>
        {index + 1}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* 步骤条 */}
      <div className={`${direction === 'vertical' ? 'space-y-4' : ''}`}>
        {items.map((item, index) => {
          const status = getStepStatus(index)
          const isActive = index === currentStep
          const isLast = index === items.length - 1

          return (
            <div
              key={`step-${item.title}-${index}`}
              className={`
                ${direction === 'horizontal' ? 'flex-1' : 'flex items-start space-x-4'}
                ${isActive ? '' : ''}
              `}
            >
              {direction === 'horizontal' ? (
                <div className="flex items-center">
                  {/* 步骤图标 */}
                  <div
                    className={`cursor-pointer transition-all ${
                      size === 'small' ? 'scale-90' : ''
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    {getStepIcon(item, index)}
                  </div>

                  {/* 连接线 */}
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      status === 'finish' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              ) : (
                <>
                  {/* 步骤图标 */}
                  <div
                    className={`cursor-pointer transition-all ${
                      size === 'small' ? 'scale-90' : ''
                    } ${direction === 'vertical' ? 'mt-1' : ''}`}
                    onClick={() => handleStepClick(index)}
                  >
                    {getStepIcon(item, index)}
                  </div>

                  {/* 连接线 */}
                  {!isLast && (
                    <div className={`w-0.5 h-8 ml-3 ${
                      status === 'finish' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </>
              )}

              {/* 步骤内容 */}
              <div className={`${direction === 'horizontal' ? 'text-center' : 'flex-1'}`}
                onClick={() => handleStepClick(index)}
              >
                <h4 className={`font-medium ${
                  status === 'finish' ? 'text-green-600 dark:text-green-400' : ''
                } ${status === 'process' ? 'text-blue-600 dark:text-blue-400' : ''
                } ${status === 'error' ? 'text-red-600 dark:text-red-400' : ''
                } ${status === 'wait' ? 'text-gray-500 dark:text-gray-400' : ''
                } ${size === 'small' ? 'text-sm' : 'text-base'
                }`}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className={`text-xs mt-1 ${
                    status === 'wait' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 控制按钮 */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <button
          onClick={() => handleStepClick(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一步
        </button>
        <button
          onClick={() => handleStepClick(Math.min(items.length - 1, currentStep + 1))}
          disabled={currentStep === items.length - 1}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一步
        </button>
      </div>

      {/* 状态信息 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          步骤条配置
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>当前步骤: {items[currentStep]?.title}</div>
          <div>步骤索引: {currentStep}</div>
          <div>总步骤数: {items.length}</div>
          <div>方向: {direction === 'horizontal' ? '水平' : '垂直'}</div>
          <div>尺寸: {size === 'small' ? '小' : '默认'}</div>
          <div>完成进度: {items.filter((_, i) => getStepStatus(i) === 'finish').length}/{items.length}</div>
        </div>
      </div>
    </div>
  )
}
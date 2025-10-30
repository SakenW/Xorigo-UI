/**
 * 协作编辑功能演示页面
 * 展示 Phase 3.2 协作编辑功能的完整实现
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Users, GitBranch, Share2, MessageSquare, Code } from 'lucide-react'
import { cn } from '@/utils'
import CollaborationWorkbench from './collaboration-workbench'

// ============================================================================
// 演示状态管理
// ============================================================================

interface DemoState {
  isRunning: boolean
  currentStep: number
  completedSteps: number[]
  documentId: string
  userId: string
  organizationId: string
}

const demoSteps = [
  {
    id: 1,
    title: '初始化协作环境',
    description: '设置协作会话和用户连接',
    icon: Settings,
    duration: 2000
  },
  {
    id: 2,
    title: '用户加入协作',
    description: '模拟多用户加入协作会话',
    icon: Users,
    duration: 3000
  },
  {
    id: 3,
    title: '实时编辑演示',
    description: '展示实时协作编辑功能',
    icon: Code,
    duration: 4000
  },
  {
    id: 4,
    title: '版本控制操作',
    description: '演示Git风格的版本管理',
    icon: GitBranch,
    duration: 3000
  },
  {
    id: 5,
    title: '分享和评论',
    description: '展示文档分享和评论功能',
    icon: MessageSquare,
    duration: 3000
  },
  {
    id: 6,
    title: '团队模板库',
    description: '演示团队模板管理功能',
    icon: Share2,
    duration: 3000
  }
]

// ============================================================================
// 演示控制组件
// ============================================================================

interface DemoControlsProps {
  state: DemoState
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onStepComplete: (stepId: number) => void
}

function DemoControls({ state, onStart, onPause, onReset, onStepComplete }: DemoControlsProps) {
  const currentStepData = demoSteps.find(step => step.id === state.currentStep)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          协作编辑功能演示
        </h2>
        <div className="flex items-center gap-2">
          {state.isRunning ? (
            <Button
              onClick={onPause}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              暂停
            </Button>
          ) : (
            <Button
              onClick={onStart}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              开始
            </Button>
          )}
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </Button>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>演示进度</span>
          <span>{state.completedSteps.length} / {demoSteps.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(state.completedSteps.length / demoSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 步骤列表 */}
      <div className="space-y-3">
        {demoSteps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = state.completedSteps.includes(step.id)
          const isCurrent = state.currentStep === step.id
          const isPending = index > demoSteps.findIndex(s => s.id === state.currentStep)

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                isCompleted ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' :
                isCurrent ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950' :
                isPending ? 'border-gray-200 dark:border-gray-700 opacity-50' :
                'border-gray-200 dark:border-gray-700'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                isCompleted ? 'bg-green-600 text-white' :
                isCurrent ? 'bg-blue-600 text-white' :
                'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              )}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
              {isCurrent && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    进行中
                  </span>
                </div>
              )}
              {isCompleted && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    已完成
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* 当前步骤详情 */}
      {currentStepData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            当前步骤: {currentStepData.title}
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {currentStepData.description}
          </p>
        </motion.div>
      )}
    </div>
  )
}

// ============================================================================
// 主演示组件
// ============================================================================

export default function CollaborationDemo() {
  const [demoState, setDemoState] = useState<DemoState>({
    isRunning: false,
    currentStep: 1,
    completedSteps: [],
    documentId: `demo-doc-${Date.now()}`,
    userId: `demo-user-${Date.now()}`,
    organizationId: 'demo-org'
  })

  const [showWorkbench, setShowWorkbench] = useState(false)

  // 演示控制函数
  const startDemo = () => {
    setDemoState(prev => ({ ...prev, isRunning: true }))
    setShowWorkbench(true)
    runNextStep()
  }

  const pauseDemo = () => {
    setDemoState(prev => ({ ...prev, isRunning: false }))
  }

  const resetDemo = () => {
    setDemoState({
      isRunning: false,
      currentStep: 1,
      completedSteps: [],
      documentId: `demo-doc-${Date.now()}`,
      userId: `demo-user-${Date.now()}`,
      organizationId: 'demo-org'
    })
    setShowWorkbench(false)
  }

  const completeStep = (stepId: number) => {
    setDemoState(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, stepId]
    }))
  }

  // 运行下一步
  const runNextStep = () => {
    setDemoState(prev => {
      const nextStep = demoSteps.find(step =>
        !prev.completedSteps.includes(step.id) && step.id > prev.currentStep
      )

      if (nextStep) {
        setTimeout(() => {
          setDemoState(current => ({
            ...current,
            currentStep: nextStep.id,
            completedSteps: [...current.completedSteps, nextStep.id]
          }))

          // 自动继续下一步
          if (current.isRunning && nextStep.id < demoSteps.length) {
            setTimeout(() => runNextStep(), nextStep.duration)
          } else {
            // 演示完成
            setDemoState(current => ({ ...current, isRunning: false }))
          }
        }, 1000)
      }

      return prev
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 头部 */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Phase 3.2 协作编辑功能演示
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  完整的实时协作、版本控制和团队分享功能演示
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                demoState.isRunning
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              )}>
                {demoState.isRunning ? '运行中' : '已暂停'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1">
            <DemoControls
              state={demoState}
              onStart={startDemo}
              onPause={pauseDemo}
              onReset={resetDemo}
              onStepComplete={completeStep}
            />

            {/* 功能特性说明 */}
            <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                核心功能特性
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      实时协作编辑
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      多用户同时编辑、冲突检测和解决
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GitBranch className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Git风格版本控制
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      分支管理、版本比较、合并请求
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      分享和评论
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      文档分享、链接管理、实时评论
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      团队模板库
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      模板创建、分享、使用和管理
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧工作台 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ height: '800px' }}>
              {showWorkbench ? (
                <CollaborationWorkbench
                  documentId={demoState.documentId}
                  userId={demoState.userId}
                  organizationId={demoState.organizationId}
                  initialContent={`// 协作编辑演示文档
// Phase 3.2 协作编辑功能

import React from 'react'
import { RealTimeEditor } from './collaboration'

function DemoComponent() {
  const [content, setContent] = useState('')

  return (
    <div>
      <h1>实时协作编辑演示</h1>
      <p>这是一个支持多用户实时协作的编辑器演示。</p>

      <RealTimeEditor
        documentId="demo-doc"
        userId="demo-user"
        onContentChange={setContent}
      />
    </div>
  )
}

export default DemoComponent
`}
                  onContentChange={(content) => {
                    console.log('Content changed:', content)
                  }}
                  onError={(error) => {
                    console.error('Collaboration error:', error)
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      协作工作台
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      点击"开始"按钮启动协作编辑功能演示
                    </p>
                    <Button
                      onClick={startDemo}
                      variant="primary"
                      className="flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      开始演示
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
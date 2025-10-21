'use client'

import React, { useState } from 'react'
import { Toggle, ToggleGroup } from '@xorigo-ui/core'

export const ToggleExample: React.FC = () => {
  const [basicToggle, setBasicToggle] = useState(false)
  const [primaryToggle, setPrimaryToggle] = useState(true)
  const [successToggle, setSuccessToggle] = useState(false)
  const [loadingToggle, setLoadingToggle] = useState(false)
  const [disabledToggle, setDisabledToggle] = useState(true)

  return (
    <div className="p-8 space-y-8 bg-[var(--bg-primary)] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">
          Toggle 组件演示
        </h1>

        {/* 基础用法 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            基础用法
          </h2>

          <div className="flex items-center gap-4">
            <Toggle
              checked={basicToggle}
              onCheckedChange={setBasicToggle}
              label="基础开关"
              description="点击切换状态"
            />
            <span className="text-[var(--text-secondary)]">
              状态: {basicToggle ? '开启' : '关闭'}
            </span>
          </div>
        </div>

        {/* 不同尺寸 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            尺寸变化
          </h2>

          <div className="space-y-3">
            <Toggle
              size="sm"
              label="小尺寸开关"
              defaultChecked={true}
            />
            <Toggle
              size="md"
              label="中等尺寸开关"
            />
            <Toggle
              size="lg"
              label="大尺寸开关"
              defaultChecked={true}
            />
          </div>
        </div>

        {/* 颜色变体 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            颜色变体
          </h2>

          <ToggleGroup spacing="lg">
            <Toggle
              color="primary"
              label="主色"
              defaultChecked={true}
            />
            <Toggle
              color="secondary"
              label="次色"
            />
            <Toggle
              color="success"
              label="成功"
            />
            <Toggle
              color="warning"
              label="警告"
              defaultChecked={true}
            />
            <Toggle
              color="error"
              label="错误"
            />
            <Toggle
              color="info"
              label="信息"
              defaultChecked={true}
            />
          </ToggleGroup>
        </div>

        {/* 状态演示 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            状态演示
          </h2>

          <div className="space-y-3">
            <Toggle
              loading={true}
              label="加载状态"
              description="正在处理中..."
            />

            <Toggle
              disabled={true}
              label="禁用状态"
              description="不可点击"
              defaultChecked={true}
            />

            <Toggle
              variant="subtle"
              label="微妙变体"
              description="更低调的样式"
            />
          </div>
        </div>

        {/* 标签位置 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            标签位置
          </h2>

          <div className="space-y-3">
            <Toggle
              labelPosition="left"
              label="左标签"
              description="标签在左侧"
              defaultChecked={true}
            />
            <Toggle
              labelPosition="right"
              label="右标签"
              description="标签在右侧"
            />
          </div>
        </div>

        {/* 复杂示例 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            复杂示例
          </h2>

          <div className="p-6 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)]">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
              应用设置
            </h3>

            <div className="space-y-4">
              <Toggle
                checked={primaryToggle}
                onCheckedChange={setPrimaryToggle}
                color="primary"
                label="启用通知"
                description="接收系统推送和邮件通知"
              />

              <Toggle
                checked={successToggle}
                onCheckedChange={setSuccessToggle}
                color="success"
                label="自动保存"
                description="每30秒自动保存您的工作"
              />

              <Toggle
                checked={loadingToggle}
                onCheckedChange={(checked) => {
                  setLoadingToggle(true)
                  // 模拟异步操作
                  setTimeout(() => {
                    setLoadingToggle(checked)
                  }, 2000)
                }}
                loading={loadingToggle}
                label="高级模式"
                description="解锁更多专业功能"
              />

              <Toggle
                checked={disabledToggle}
                onCheckedChange={setDisabledToggle}
                disabled={loadingToggle}
                label="开发者选项"
                description="需要先启用高级模式"
              />
            </div>
          </div>
        </div>

        {/* 垂直布局 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            垂直布局
          </h2>

          <ToggleGroup orientation="vertical" spacing="md">
            <Toggle
              label="功能 A"
              description="第一个功能选项"
              defaultChecked={true}
            />
            <Toggle
              label="功能 B"
              description="第二个功能选项"
            />
            <Toggle
              label="功能 C"
              description="第三个功能选项"
              defaultChecked={true}
            />
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}

export default ToggleExample
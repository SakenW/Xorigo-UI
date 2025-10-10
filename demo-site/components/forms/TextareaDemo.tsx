import React, { useState } from "react"
import { Textarea } from "../../../src/components/ui/Textarea"

const TextareaDemo: React.FC = () => {
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('这是一段很长的文本内容，它会随着输入自动调整高度。继续输入更多内容，你会看到文本框会自动扩展。')
  const [value3, setValue3] = useState('')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Textarea 多行文本框
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          用于多行文本输入，支持自动调整高度和字符计数
        </p>
      </div>

      {/* 基础用法 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础用法
        </h3>

        <Textarea
          placeholder="请输入内容..."
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
        />
      </div>

      {/* 不同尺寸 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          不同尺寸
        </h3>

        <div className="space-y-4">
          <Textarea size="sm" placeholder="小尺寸 (sm)" />
          <Textarea size="md" placeholder="中等尺寸 (md)" />
          <Textarea size="lg" placeholder="大尺寸 (lg)" />
        </div>
      </div>

      {/* 带标签 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          带标签和帮助文本
        </h3>

        <div className="space-y-4">
          <Textarea
            label="评论内容"
            placeholder="请输入你的评论..."
            helperText="最少10个字符"
          />

          <Textarea
            label="产品描述"
            placeholder="请输入产品详细描述..."
            helperText="详细的描述有助于用户了解产品"
          />
        </div>
      </div>

      {/* 字符计数 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          字符计数
        </h3>

        <div className="space-y-4">
          <Textarea
            label="推文内容"
            placeholder="分享你的想法..."
            maxLength={280}
            showCount
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
          />

          <Textarea
            placeholder="无标签字符计数"
            maxLength={100}
            showCount
          />
        </div>
      </div>

      {/* 自动调整高度 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          自动调整高度
        </h3>

        <Textarea
          label="自动扩展"
          placeholder="输入内容时高度会自动调整..."
          autoResize
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          helperText="文本框会根据内容自动调整高度"
        />
      </div>

      {/* 可调整大小 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          调整大小选项
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            label="禁止调整 (none)"
            placeholder="不可调整大小"
            resize="none"
          />
          <Textarea
            label="垂直调整 (vertical)"
            placeholder="只能垂直调整大小"
            resize="vertical"
          />
          <Textarea
            label="水平调整 (horizontal)"
            placeholder="只能水平调整大小"
            resize="horizontal"
          />
          <Textarea
            label="自由调整 (both)"
            placeholder="可以自由调整大小"
            resize="both"
          />
        </div>
      </div>

      {/* 错误状态 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          错误状态
        </h3>

        <div className="space-y-4">
          <Textarea
            label="反馈内容"
            placeholder="请输入反馈..."
            error="内容不能少于10个字符"
          />

          <Textarea
            label="问题描述"
            placeholder="请描述你遇到的问题..."
            error="请提供更详细的描述"
          />
        </div>
      </div>

      {/* 禁用状态 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          禁用状态
        </h3>

        <Textarea
          label="已提交的评论"
          value="这是一个已提交的评论内容，不可修改。"
          disabled
          helperText="评论已提交，不可修改"
        />
      </div>

      {/* 实际应用 - 表单 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 反馈表单
        </h3>

        <div className="space-y-4">
          <Textarea
            label="标题"
            placeholder="简要概括你的问题..."
            maxLength={100}
            showCount
          />

          <Textarea
            label="详细描述"
            placeholder="请详细描述你遇到的问题，包括重现步骤..."
            autoResize
            maxLength={1000}
            showCount
            helperText="提供详细的信息有助于我们更快地解决问题"
          />

          <Textarea
            label="附加信息"
            placeholder="其他你认为相关的信息..."
            resize="vertical"
          />
        </div>
      </div>
    </div>
  )
}

export default TextareaDemo

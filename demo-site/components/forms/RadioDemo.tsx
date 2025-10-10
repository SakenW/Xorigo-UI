import React, { useState } from "react"
import { RadioGroup, Radio, RadioCard } from "../../../src/components/ui/Radio"
import { Zap, Shield, Rocket, Star } from "lucide-react"

const RadioDemo: React.FC = () => {
  const [value1, setValue1] = useState('option1')
  const [value2, setValue2] = useState('horizontal')
  const [value3, setValue3] = useState('')
  const [value4, setValue4] = useState('basic')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Radio 单选框
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          在一组选项中进行单项选择
        </p>
      </div>

      {/* 基础用法 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础用法
        </h3>

        <RadioGroup value={value1} onChange={setValue1}>
          <Radio value="option1" label="选项 1" />
          <Radio value="option2" label="选项 2" />
          <Radio value="option3" label="选项 3" />
        </RadioGroup>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          当前选择: {value1}
        </p>
      </div>

      {/* 水平方向 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          水平排列
        </h3>

        <RadioGroup value={value2} onChange={setValue2} direction="horizontal">
          <Radio value="horizontal" label="水平" />
          <Radio value="vertical" label="垂直" />
          <Radio value="grid" label="网格" />
        </RadioGroup>
      </div>

      {/* 带描述 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          带描述的单选框
        </h3>

        <RadioGroup value={value3} onChange={setValue3}>
          <Radio
            value="fast"
            label="快速模式"
            description="牺牲一些准确性以获得更快的处理速度"
          />
          <Radio
            value="balanced"
            label="平衡模式"
            description="在速度和准确性之间取得平衡"
          />
          <Radio
            value="accurate"
            label="准确模式"
            description="优先保证结果的准确性，可能需要更长时间"
          />
        </RadioGroup>
      </div>

      {/* 禁用状态 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          禁用状态
        </h3>

        <RadioGroup value="option1" disabled>
          <Radio value="option1" label="禁用的选中项" />
          <Radio value="option2" label="禁用的未选中项" />
        </RadioGroup>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <RadioGroup value="option1">
            <Radio value="option1" label="正常选项" />
            <Radio value="option2" label="单个禁用项" disabled />
            <Radio value="option3" label="正常选项" />
          </RadioGroup>
        </div>
      </div>

      {/* 卡片样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          卡片样式
        </h3>

        <RadioGroup value={value4} onChange={setValue4}>
          <RadioCard
            value="basic"
            label="基础版"
            description="适合个人用户和小团队使用"
            icon={<Zap className="w-6 h-6" />}
          />
          <RadioCard
            value="pro"
            label="专业版"
            description="适合中型团队，包含高级功能"
            icon={<Shield className="w-6 h-6" />}
          />
          <RadioCard
            value="enterprise"
            label="企业版"
            description="为大型组织提供完整的企业级支持"
            icon={<Rocket className="w-6 h-6" />}
          />
        </RadioGroup>
      </div>

      {/* 水平卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          水平卡片布局
        </h3>

        <RadioGroup value={value4} onChange={setValue4} direction="horizontal">
          <RadioCard
            value="basic"
            label="基础版"
            description="¥99/月"
            icon={<Star className="w-5 h-5" />}
          />
          <RadioCard
            value="pro"
            label="专业版"
            description="¥299/月"
            icon={<Shield className="w-5 h-5" />}
          />
          <RadioCard
            value="enterprise"
            label="企业版"
            description="¥999/月"
            icon={<Rocket className="w-5 h-5" />}
          />
        </RadioGroup>
      </div>

      {/* 实际应用 - 配送方式选择 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 配送方式
        </h3>

        <RadioGroup defaultValue="standard">
          <RadioCard
            value="standard"
            label="标准配送"
            description="5-7个工作日送达 · 免费"
          />
          <RadioCard
            value="express"
            label="快速配送"
            description="2-3个工作日送达 · ¥15"
          />
          <RadioCard
            value="overnight"
            label="次日达"
            description="第二天送达 · ¥35"
          />
        </RadioGroup>
      </div>
    </div>
  )
}

export default RadioDemo

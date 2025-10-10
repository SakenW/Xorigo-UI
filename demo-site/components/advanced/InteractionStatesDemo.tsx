import React, { useState } from "react"
import { ButtonStates, InputStates, CardStates, ProgressStates } from "../../../src/components/advanced/InteractionStates"
import { Card } from "../../../src/components/ui/Card"

export default function InteractionStatesDemo() {
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonSuccess, setButtonSuccess] = useState(false)
  const [buttonError, setButtonError] = useState(false)

  const [inputValue, setInputValue] = useState('')
  const [inputLoading, setInputLoading] = useState(false)
  const [inputSuccess, setInputSuccess] = useState(false)
  const [inputError, setInputError] = useState('')

  const [cardState, setCardState] = useState<'normal' | 'loading' | 'error' | 'empty'>('normal')

  const handleButtonClick = () => {
    setButtonLoading(true)
    setButtonSuccess(false)
    setButtonError(false)

    setTimeout(() => {
      setButtonLoading(false)
      // 随机成功或失败
      if (Math.random() > 0.5) {
        setButtonSuccess(true)
        setTimeout(() => setButtonSuccess(false), 2000)
      } else {
        setButtonError(true)
        setTimeout(() => setButtonError(false), 2000)
      }
    }, 2000)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setInputError('')
    setInputSuccess(false)

    if (value.length > 0) {
      setInputLoading(true)

      // 模拟验证
      setTimeout(() => {
        setInputLoading(false)
        if (value.includes('@')) {
          setInputSuccess(true)
        } else {
          setInputError('请输入有效的邮箱地址')
        }
      }, 1000)
    }
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">✨ 交互状态 - 高级状态组件</h2>

      {/* 按钮状态演示 */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">按钮状态 (ButtonStates)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          支持 loading、success、error 等多种状态的按钮组件
        </p>

        <div className="space-y-4">
          {/* 基础按钮 */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">基础按钮样式：</p>
            <div className="flex flex-wrap gap-4">
              <ButtonStates variant="primary">主要按钮</ButtonStates>
              <ButtonStates variant="secondary">次要按钮</ButtonStates>
              <ButtonStates variant="danger">危险按钮</ButtonStates>
              <ButtonStates variant="ghost">幽灵按钮</ButtonStates>
            </div>
          </div>

          {/* 状态按钮 */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">按钮状态（点击测试）：</p>
            <div className="flex flex-wrap gap-4">
              <ButtonStates
                variant="primary"
                loading={buttonLoading}
                success={buttonSuccess}
                error={buttonError}
                onClick={handleButtonClick}
              >
                {buttonLoading ? '加载中...' : buttonSuccess ? '成功！' : buttonError ? '失败！' : '点击测试'}
              </ButtonStates>

              <ButtonStates loading={true}>加载中</ButtonStates>
              <ButtonStates success={true}>成功</ButtonStates>
              <ButtonStates error={true}>错误</ButtonStates>
              <ButtonStates disabled={true}>禁用</ButtonStates>
            </div>
          </div>
        </div>
      </Card>

      {/* 输入框状态演示 */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">输入框状态 (InputStates)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          带实时验证反馈的输入框组件，支持 loading、success、error 状态
        </p>

        <div className="space-y-4 max-w-md">
          <InputStates
            label="邮箱地址"
            placeholder="输入邮箱地址测试验证"
            value={inputValue}
            onChange={handleInputChange}
            loading={inputLoading}
            success={inputSuccess ? '邮箱格式正确' : undefined}
            error={inputError}
          />

          <InputStates
            label="加载中状态"
            value="验证中..."
            loading={true}
          />

          <InputStates
            label="成功状态"
            value="validation@success.com"
            success="验证通过"
          />

          <InputStates
            label="错误状态"
            value="invalid-email"
            error="邮箱格式不正确"
          />

          <InputStates
            label="禁用状态"
            value="disabled@input.com"
            disabled={true}
          />
        </div>
      </Card>

      {/* 卡片状态演示 */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">卡片状态 (CardStates)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          支持 loading、error、empty 等状态的智能卡片组件
        </p>

        <div className="space-y-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCardState('normal')}
              className={`px-3 py-1 rounded-sm ${cardState === 'normal' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              正常
            </button>
            <button
              onClick={() => setCardState('loading')}
              className={`px-3 py-1 rounded-sm ${cardState === 'loading' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              加载中
            </button>
            <button
              onClick={() => setCardState('error')}
              className={`px-3 py-1 rounded-sm ${cardState === 'error' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              错误
            </button>
            <button
              onClick={() => setCardState('empty')}
              className={`px-3 py-1 rounded-sm ${cardState === 'empty' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              空状态
            </button>
          </div>
        </div>

        <CardStates
          title={cardState === 'normal' ? '卡片标题' : undefined}
          subtitle={cardState === 'normal' ? '这是卡片的副标题' : undefined}
          loading={cardState === 'loading'}
          error={cardState === 'error'}
          empty={cardState === 'empty'}
          hover={cardState === 'normal'}
        >
          <p className="text-gray-600 dark:text-gray-400">
            这是卡片的内容区域。卡片可以根据不同的状态显示不同的UI。
          </p>
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-sm">标签1</span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-sm">标签2</span>
          </div>
        </CardStates>
      </Card>

      {/* 进度条状态演示 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">进度条 (ProgressStates)</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          支持多种颜色和尺寸的进度条组件
        </p>

        <div className="space-y-6">
          <ProgressStates
            value={75}
            label="主色调进度"
            color="primary"
          />

          <ProgressStates
            value={100}
            label="成功进度"
            color="success"
          />

          <ProgressStates
            value={60}
            label="警告进度"
            color="warning"
          />

          <ProgressStates
            value={30}
            label="危险进度"
            color="danger"
          />

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">不同尺寸：</p>
            <div className="space-y-4">
              <ProgressStates value={50} size="sm" label="小尺寸" />
              <ProgressStates value={70} size="md" label="中等尺寸" />
              <ProgressStates value={90} size="lg" label="大尺寸" />
            </div>
          </div>

          <ProgressStates
            value={85}
            label="无动画进度"
            animated={false}
          />
        </div>
      </Card>
    </section>
  )
}

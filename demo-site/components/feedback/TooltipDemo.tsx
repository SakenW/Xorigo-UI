import React, { useState } from 'react'
import { Tooltip } from '../../../src/components/Tooltip'
import { Button } from '../../../src/components/Button'
import { Info, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react'

const TooltipDemo: React.FC = () => {
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tooltip 提示框
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          鼠标悬停时显示的提示信息组件，支持多种位置和延迟配置
        </p>
      </div>

      {/* 基础用法 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础用法
        </h3>
        <div className="flex items-center gap-6">
          <Tooltip content="这是一个基础提示框">
            <Button>悬停查看提示</Button>
          </Tooltip>

          <Tooltip content="这是一个较长的提示信息，用于演示多行文本的显示效果" maxWidth={200}>
            <Button variant="outline">长文本提示</Button>
          </Tooltip>

          <Tooltip content="禁用状态的提示" disabled>
            <Button variant="ghost">禁用的提示</Button>
          </Tooltip>
        </div>
      </div>

      {/* 位置方向 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          位置方向
        </h3>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="col-start-2 flex justify-center">
            <Tooltip content="顶部提示" placement="top">
              <Button variant="outline" size="sm">
                Top
              </Button>
            </Tooltip>
          </div>

          <div className="flex justify-start">
            <Tooltip content="左侧提示" placement="left">
              <Button variant="outline" size="sm">
                Left
              </Button>
            </Tooltip>
          </div>
          <div className="col-start-3 flex justify-end">
            <Tooltip content="右侧提示" placement="right">
              <Button variant="outline" size="sm">
                Right
              </Button>
            </Tooltip>
          </div>

          <div className="col-start-2 flex justify-center">
            <Tooltip content="底部提示" placement="bottom">
              <Button variant="outline" size="sm">
                Bottom
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* 带图标 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          带图标的提示
        </h3>
        <div className="flex items-center gap-6">
          <Tooltip content="信息提示">
            <button className="text-blue-500 hover:text-blue-600 transition-colors">
              <Info size={20} />
            </button>
          </Tooltip>

          <Tooltip content="帮助信息">
            <button className="text-gray-500 hover:text-gray-600 transition-colors">
              <HelpCircle size={20} />
            </button>
          </Tooltip>

          <Tooltip content="警告提示">
            <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
              <AlertCircle size={20} />
            </button>
          </Tooltip>

          <Tooltip content="成功提示">
            <button className="text-green-500 hover:text-green-600 transition-colors">
              <CheckCircle size={20} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 延迟显示 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          延迟配置
        </h3>
        <div className="flex items-center gap-6">
          <Tooltip content="无延迟" delay={0}>
            <Button variant="outline">无延迟</Button>
          </Tooltip>

          <Tooltip content="200ms 延迟" delay={200}>
            <Button variant="outline">默认延迟</Button>
          </Tooltip>

          <Tooltip content="500ms 延迟" delay={500}>
            <Button variant="outline">500ms</Button>
          </Tooltip>

          <Tooltip content="1000ms 延迟" delay={1000}>
            <Button variant="outline">1000ms</Button>
          </Tooltip>
        </div>
      </div>

      {/* 箭头配置 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          箭头显示
        </h3>
        <div className="flex items-center gap-6">
          <Tooltip content="带箭头的提示" arrow={true}>
            <Button variant="outline">带箭头</Button>
          </Tooltip>

          <Tooltip content="无箭头的提示" arrow={false}>
            <Button variant="outline">无箭头</Button>
          </Tooltip>
        </div>
      </div>

      {/* 受控模式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          受控模式
        </h3>
        <div className="flex items-center gap-6">
          <Tooltip
            content="受控的提示框，通过外部状态控制显示"
            open={controlledOpen}
            onOpenChange={setControlledOpen}
          >
            <Button variant="outline">受控提示框</Button>
          </Tooltip>

          <Button
            variant="primary"
            onClick={() => setControlledOpen(!controlledOpen)}
          >
            {controlledOpen ? '隐藏' : '显示'} 提示框
          </Button>
        </div>
      </div>

      {/* 偏移量配置 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          偏移量配置
        </h3>
        <div className="flex items-center gap-6">
          <Tooltip content="默认偏移 (8px)" offset={8}>
            <Button variant="outline">默认偏移</Button>
          </Tooltip>

          <Tooltip content="16px 偏移" offset={16}>
            <Button variant="outline">16px</Button>
          </Tooltip>

          <Tooltip content="24px 偏移" offset={24}>
            <Button variant="outline">24px</Button>
          </Tooltip>
        </div>
      </div>

      {/* 复杂内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          复杂内容
        </h3>
        <div className="flex items-center gap-6">
          <Tooltip
            content={
              <div className="space-y-2">
                <div className="font-semibold">用户信息</div>
                <div className="text-xs">
                  <div>姓名: 张三</div>
                  <div>邮箱: zhangsan@example.com</div>
                  <div>角色: 管理员</div>
                </div>
              </div>
            }
            maxWidth={250}
          >
            <Button variant="outline">用户详情</Button>
          </Tooltip>

          <Tooltip
            content={
              <div className="space-y-1">
                <div className="font-semibold text-yellow-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  警告提示
                </div>
                <div className="text-xs">
                  此操作不可撤销，请谨慎操作
                </div>
              </div>
            }
          >
            <Button variant="danger">危险操作</Button>
          </Tooltip>
        </div>
      </div>

      {/* 使用场景 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用场景
        </h3>
        <div className="space-y-4">
          {/* 表单字段帮助 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              用户名
            </label>
            <Tooltip content="用户名长度应在 3-20 个字符之间，仅支持字母、数字和下划线">
              <HelpCircle size={16} className="text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>

          {/* 操作按钮说明 */}
          <div className="flex items-center gap-4">
            <Tooltip content="保存当前更改">
              <Button size="sm">保存</Button>
            </Tooltip>
            <Tooltip content="取消所有更改并返回">
              <Button variant="outline" size="sm">
                取消
              </Button>
            </Tooltip>
            <Tooltip content="删除此项，此操作不可撤销">
              <Button variant="danger" size="sm">
                删除
              </Button>
            </Tooltip>
          </div>

          {/* 状态指示器 */}
          <div className="flex items-center gap-6">
            <Tooltip content="服务运行正常">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">在线</span>
              </div>
            </Tooltip>
            <Tooltip content="服务暂时离线，正在重连">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">离线</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TooltipDemo

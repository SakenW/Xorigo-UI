import React, { useState } from "react"
import { Switch } from "../../../src/components/ui/Switch"

const SwitchDemo: React.FC = () => {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleAsyncToggle = async () => {
    setLoading(true)
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)
    setEnabled(!enabled)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Switch 开关
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          用于在两个状态之间切换的开关组件，支持多种样式和加载状态
        </p>
      </div>

      {/* 基础用法 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础用法
        </h3>
        <div className="flex flex-col gap-4">
          <Switch
            label="默认开关"
            description="这是一个基础的开关组件"
          />
          <Switch
            label="默认开启"
            description="开关默认处于开启状态"
            defaultChecked
          />
          <Switch
            label="禁用状态"
            description="开关处于禁用状态，无法切换"
            disabled
          />
          <Switch
            label="禁用且开启"
            description="开关禁用并处于开启状态"
            disabled
            defaultChecked
          />
        </div>
      </div>

      {/* 尺寸 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          尺寸大小
        </h3>
        <div className="flex flex-col gap-4">
          <Switch size="sm" label="小号开关" defaultChecked />
          <Switch size="md" label="中号开关（默认）" defaultChecked />
          <Switch size="lg" label="大号开关" defaultChecked />
        </div>
      </div>

      {/* 变体样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          变体样式
        </h3>
        <div className="flex flex-col gap-4">
          <Switch
            variant="default"
            label="默认样式"
            defaultChecked
          />
          <Switch
            variant="primary"
            label="主要样式"
            defaultChecked
          />
          <Switch
            variant="success"
            label="成功样式"
            defaultChecked
          />
          <Switch
            variant="danger"
            label="危险样式"
            defaultChecked
          />
        </div>
      </div>

      {/* 加载状态 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          加载状态
        </h3>
        <div className="space-y-4">
          <Switch
            label="加载中的开关"
            description="开关处于加载状态时会显示加载动画"
            loading
          />
          <Switch
            label="加载中且开启"
            description="加载状态也可以与开启状态结合"
            loading
            checked
          />
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Switch
              label="异步操作开关"
              description="点击后会模拟2秒的异步操作"
              checked={enabled}
              loading={loading}
              onCheckedChange={handleAsyncToggle}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              状态: {enabled ? '开启' : '关闭'} {loading && '(处理中...)'}
            </p>
          </div>
        </div>
      </div>

      {/* 受控模式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          受控模式
        </h3>
        <div className="space-y-4">
          <Switch
            label="通知提醒"
            description="接收系统通知和消息提醒"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <Switch
            label="邮件提醒"
            description="通过邮件接收重要通知"
            checked={emailAlerts}
            onCheckedChange={setEmailAlerts}
            disabled={!notifications}
          />
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              当前设置: 通知 {notifications ? '✓' : '✗'} | 邮件 {emailAlerts ? '✓' : '✗'}
            </p>
          </div>
        </div>
      </div>

      {/* 组合样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          组合使用
        </h3>
        <div className="flex flex-col gap-4">
          <Switch
            size="sm"
            variant="success"
            label="小号成功样式"
            defaultChecked
          />
          <Switch
            size="md"
            variant="primary"
            label="中号主要样式"
            description="这是一个描述文本"
            defaultChecked
          />
          <Switch
            size="lg"
            variant="danger"
            label="大号危险样式"
            description="这是一个较长的描述文本，用于说明开关的具体功能和作用"
            defaultChecked
          />
        </div>
      </div>

      {/* 无标签 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          无标签开关
        </h3>
        <div className="flex items-center gap-4">
          <Switch size="sm" />
          <Switch size="md" />
          <Switch size="lg" />
          <Switch variant="primary" defaultChecked />
          <Switch variant="success" defaultChecked />
          <Switch variant="danger" defaultChecked />
        </div>
      </div>

      {/* 实际应用场景 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 用户设置
        </h3>
        <div className="space-y-6">
          {/* 隐私设置 */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              隐私设置
            </h4>
            <div className="space-y-3">
              <Switch
                label="公开个人资料"
                description="允许其他用户查看您的个人资料信息"
                variant="primary"
                defaultChecked
              />
              <Switch
                label="显示在线状态"
                description="向其他用户显示您的在线状态"
                variant="primary"
                defaultChecked
              />
              <Switch
                label="允许搜索"
                description="允许其他用户通过搜索找到您"
                variant="primary"
              />
            </div>
          </div>

          {/* 通知设置 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              通知设置
            </h4>
            <div className="space-y-3">
              <Switch
                label="推送通知"
                description="接收浏览器推送通知"
                variant="success"
                defaultChecked
              />
              <Switch
                label="邮件通知"
                description="通过邮件接收重要更新"
                variant="success"
                defaultChecked
              />
              <Switch
                label="短信通知"
                description="通过短信接收验证码和重要提醒"
                variant="success"
              />
            </div>
          </div>

          {/* 安全设置 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              安全设置
            </h4>
            <div className="space-y-3">
              <Switch
                label="双因素认证"
                description="启用双因素认证以提高账户安全性"
                variant="primary"
                defaultChecked
              />
              <Switch
                label="登录提醒"
                description="有新设备登录时发送提醒"
                variant="primary"
                defaultChecked
              />
              <Switch
                label="允许第三方登录"
                description="允许使用第三方账号登录"
                variant="primary"
              />
            </div>
          </div>

          {/* 外观设置 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              外观设置
            </h4>
            <div className="space-y-3">
              <Switch
                label="深色模式"
                description="启用深色主题以减少眼睛疲劳"
                variant="default"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Switch
                label="紧凑模式"
                description="使用更紧凑的界面布局"
                variant="default"
              />
              <Switch
                label="动画效果"
                description="启用界面动画和过渡效果"
                variant="default"
                defaultChecked
              />
            </div>
          </div>
        </div>
      </div>

      {/* 表单集成 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xs">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 表单集成
        </h3>
        <form className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              发布设置
            </h4>
            <Switch
              name="publish"
              label="立即发布"
              description="文章将立即对所有用户可见"
              variant="success"
            />
            <Switch
              name="featured"
              label="设为精选"
              description="在首页展示此文章"
              variant="primary"
            />
            <Switch
              name="comments"
              label="允许评论"
              description="用户可以对文章进行评论"
              variant="primary"
              defaultChecked
            />
            <Switch
              name="notifications"
              label="接收通知"
              description="有新评论时通知您"
              variant="primary"
              defaultChecked
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              保存设置
            </button>
            <button
              type="reset"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
            >
              重置
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SwitchDemo

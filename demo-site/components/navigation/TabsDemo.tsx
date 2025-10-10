import React, { useState } from "react"
import { Tabs } from "../../../src/components/navigation/Tabs"
import { Home, User, Settings, Bell, Mail, Calendar } from "lucide-react"

const TabsDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tabs 标签页
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          用于组织和切换不同内容区域的导航组件
        </p>
      </div>

      {/* 默认样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          默认样式
        </h3>
        <Tabs defaultValue="home" variant="default">
          <Tabs.List>
            <Tabs.Trigger value="home">首页</Tabs.Trigger>
            <Tabs.Trigger value="profile">个人资料</Tabs.Trigger>
            <Tabs.Trigger value="settings">设置</Tabs.Trigger>
            <Tabs.Trigger value="notifications">通知</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="home">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                欢迎回来
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                这是首页的内容区域，您可以在这里查看最新的动态和消息。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="profile">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                个人信息
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                在这里您可以查看和编辑您的个人资料信息。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="settings">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                系统设置
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                配置您的应用程序偏好设置和系统选项。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="notifications">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                通知中心
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                查看所有通知和消息更新。
              </p>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>

      {/* 药丸样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          药丸样式
        </h3>
        <Tabs defaultValue="overview" variant="pills">
          <Tabs.List>
            <Tabs.Trigger value="overview">概览</Tabs.Trigger>
            <Tabs.Trigger value="analytics">分析</Tabs.Trigger>
            <Tabs.Trigger value="reports">报告</Tabs.Trigger>
            <Tabs.Trigger value="team">团队</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                数据概览
              </h4>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,234</div>
                  <div className="text-xs text-gray-500">总用户</div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">567</div>
                  <div className="text-xs text-gray-500">活跃用户</div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">89%</div>
                  <div className="text-xs text-gray-500">转化率</div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="analytics">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                数据分析
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                深入分析您的业务数据和用户行为。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="reports">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                生成报告
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                创建和导出各类业务报告。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="team">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                团队管理
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                管理您的团队成员和权限设置。
              </p>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>

      {/* 下划线样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          下划线样式
        </h3>
        <Tabs defaultValue="all" variant="underline">
          <Tabs.List>
            <Tabs.Trigger value="all">全部</Tabs.Trigger>
            <Tabs.Trigger value="active">进行中</Tabs.Trigger>
            <Tabs.Trigger value="completed">已完成</Tabs.Trigger>
            <Tabs.Trigger value="archived">已归档</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="all">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                所有项目 (12)
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                  项目 A - 进行中
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                  项目 B - 已完成
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                  项目 C - 已归档
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="active">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                进行中的项目 (5)
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                  项目 A - 70% 完成
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                  项目 D - 40% 完成
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="completed">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                已完成的项目 (4)
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                  项目 B - 2024/01/15
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                  项目 E - 2024/01/10
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="archived">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                已归档的项目 (3)
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg text-sm">
                  项目 C - 已归档
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>

      {/* 带图标 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          带图标的标签页
        </h3>
        <Tabs defaultValue="home" variant="pills">
          <Tabs.List>
            <Tabs.Trigger value="home">
              <Home size={16} className="mr-2" />
              首页
            </Tabs.Trigger>
            <Tabs.Trigger value="profile">
              <User size={16} className="mr-2" />
              个人
            </Tabs.Trigger>
            <Tabs.Trigger value="mail">
              <Mail size={16} className="mr-2" />
              邮件
            </Tabs.Trigger>
            <Tabs.Trigger value="calendar">
              <Calendar size={16} className="mr-2" />
              日历
            </Tabs.Trigger>
            <Tabs.Trigger value="settings">
              <Settings size={16} className="mr-2" />
              设置
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="home">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Home size={20} className="text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  首页仪表板
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                查看您的主要数据和快速访问功能。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="profile">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User size={20} className="text-green-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  个人中心
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                管理您的个人信息和偏好设置。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="mail">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={20} className="text-purple-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  邮件管理
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                查看和管理您的邮件消息。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="calendar">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={20} className="text-orange-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  日程安排
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                管理您的日程和会议安排。
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="settings">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings size={20} className="text-gray-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  系统设置
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                配置您的应用程序设置。
              </p>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>

      {/* 受控模式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          受控模式
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>当前激活:</span>
            <span className="font-semibold text-blue-600">{activeTab}</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" defaultValue="tab1">
            <Tabs.List>
              <Tabs.Trigger value="tab1">标签 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">标签 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">标签 3</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="tab1">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  这是受控模式的标签内容 1，外部状态控制当前激活的标签。
                </p>
              </div>
            </Tabs.Content>

            <Tabs.Content value="tab2">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  这是受控模式的标签内容 2。
                </p>
              </div>
            </Tabs.Content>

            <Tabs.Content value="tab3">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  这是受控模式的标签内容 3。
                </p>
              </div>
            </Tabs.Content>
          </Tabs>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tab1')}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              切换到标签 1
            </button>
            <button
              onClick={() => setActiveTab('tab2')}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              切换到标签 2
            </button>
            <button
              onClick={() => setActiveTab('tab3')}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              切换到标签 3
            </button>
          </div>
        </div>
      </div>

      {/* 实际应用场景 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 用户设置页面
        </h3>
        <Tabs defaultValue="account" variant="pills">
          <Tabs.List>
            <Tabs.Trigger value="account">账户</Tabs.Trigger>
            <Tabs.Trigger value="security">安全</Tabs.Trigger>
            <Tabs.Trigger value="notifications">通知</Tabs.Trigger>
            <Tabs.Trigger value="privacy">隐私</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="account">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  defaultValue="zhangsan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  邮箱地址
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  defaultValue="zhangsan@example.com"
                />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="security">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  修改密码
                </h4>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  更新密码
                </button>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  双因素认证
                </h4>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  启用 2FA
                </button>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="notifications">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  邮件通知
                </span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  推送通知
                </span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  短信通知
                </span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="privacy">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  公开个人资料
                </span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  显示在线状态
                </span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  允许搜索
                </span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  )
}

export default TabsDemo

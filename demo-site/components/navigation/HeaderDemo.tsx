import React from 'react'
import { Header } from '../../../src/components/Header'
import { Card } from '../../../src/components/Card'
import { Button } from '../../../src/components/Button'
import { useToast } from '../../../src/components/Notification'

export default function HeaderDemo() {
  const { success, info } = useToast()

  const mockUser = {
    name: '张三',
    email: 'zhangsan@example.com',
  }

  const breadcrumbsExample = (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <a href="#" className="hover:text-blue-600">首页</a>
      <span>/</span>
      <a href="#" className="hover:text-blue-600">组件</a>
      <span>/</span>
      <span className="text-gray-900 dark:text-gray-300">Header</span>
    </div>
  )

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🧭 导航组件 - 顶部导航栏</h2>
      <div className="space-y-6">
        {/* 基础Header */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础样式</h3>
          <Card>
            <Header
              title="页面标题"
              subtitle="页面副标题或描述"
            />
          </Card>
        </div>

        {/* 带面包屑 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">带面包屑导航</h3>
          <Card>
            <Header
              title="组件文档"
              breadcrumbs={breadcrumbsExample}
            />
          </Card>
        </div>

        {/* 带用户信息 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">带用户信息</h3>
          <Card>
            <Header
              title="控制面板"
              subtitle="欢迎回来"
              user={mockUser}
              showNotifications
              notificationCount={3}
              onNotificationClick={() => info('通知', '您有3条未读消息')}
              onUserClick={() => success('用户菜单', '点击了用户头像')}
            />
          </Card>
        </div>

        {/* 带操作按钮 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">带操作按钮</h3>
          <Card>
            <Header
              title="项目管理"
              subtitle="管理您的所有项目"
              actions={
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    导出
                  </Button>
                  <Button variant="primary" size="sm">
                    新建项目
                  </Button>
                </div>
              }
            />
          </Card>
        </div>

        {/* 完整示例 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">完整功能示例</h3>
          <Card>
            <Header
              title="用户管理"
              subtitle="查看和管理所有用户"
              breadcrumbs={breadcrumbsExample}
              user={mockUser}
              showNotifications
              notificationCount={5}
              onNotificationClick={() => info('通知中心', '您有5条新通知')}
              onUserClick={() => success('个人中心', '跳转到个人设置页面')}
              actions={
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    筛选
                  </Button>
                  <Button variant="primary" size="sm">
                    添加用户
                  </Button>
                </div>
              }
            />
          </Card>
        </div>
      </div>
    </section>
  )
}

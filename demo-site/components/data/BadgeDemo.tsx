import React from "react"
import { Badge } from "../../../src/components/ui/Badge"
import { Bell, Mail, ShoppingCart, AlertCircle, CheckCircle, Info, Star, X } from "lucide-react"

const BadgeDemo: React.FC = () => {
  const [badges, setBadges] = React.useState([
    { id: 1, text: 'React', variant: 'primary' as const },
    { id: 2, text: 'TypeScript', variant: 'success' as const },
    { id: 3, text: 'Tailwind', variant: 'info' as const },
  ])

  const handleRemove = (id: number) => {
    setBadges(badges.filter(badge => badge.id !== id))
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Badge 徽标
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          用于显示状态、标签或数量的小型标记组件
        </p>
      </div>

      {/* 基础变体 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础变体
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>

      {/* 尺寸 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          尺寸大小
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Badge size="sm" variant="primary">
            Small
          </Badge>
          <Badge size="md" variant="primary">
            Medium
          </Badge>
          <Badge size="lg" variant="primary">
            Large
          </Badge>
        </div>
      </div>

      {/* 圆角样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          圆角样式
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="primary">Normal</Badge>
          <Badge variant="primary" rounded>
            Rounded
          </Badge>
          <Badge variant="success">Normal</Badge>
          <Badge variant="success" rounded>
            Rounded
          </Badge>
        </div>
      </div>

      {/* 带图标 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          带图标
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success" icon={<CheckCircle size={14} />}>
            Success
          </Badge>
          <Badge variant="warning" icon={<AlertCircle size={14} />}>
            Warning
          </Badge>
          <Badge variant="danger" icon={<X size={14} />}>
            Error
          </Badge>
          <Badge variant="info" icon={<Info size={14} />}>
            Information
          </Badge>
          <Badge variant="primary" icon={<Star size={14} />}>
            Featured
          </Badge>
        </div>
      </div>

      {/* 带点指示器 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          状态点指示器
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success" dot>
            在线
          </Badge>
          <Badge variant="danger" dot>
            离线
          </Badge>
          <Badge variant="warning" dot>
            离开
          </Badge>
          <Badge variant="info" dot>
            忙碌
          </Badge>
        </div>
      </div>

      {/* 可移除 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          可移除标签
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          {badges.map((badge) => (
            <Badge
              key={badge.id}
              variant={badge.variant}
              removable
              onRemove={() => handleRemove(badge.id)}
            >
              {badge.text}
            </Badge>
          ))}
          {badges.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              所有标签已移除
            </p>
          )}
        </div>
      </div>

      {/* 通知徽标 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          通知徽标
        </h3>
        <div className="flex flex-wrap items-center gap-8">
          <div className="relative inline-block">
            <Bell size={24} className="text-gray-700 dark:text-gray-300" />
            <Badge
              variant="danger"
              size="sm"
              rounded
              className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center"
            >
              5
            </Badge>
          </div>

          <div className="relative inline-block">
            <Mail size={24} className="text-gray-700 dark:text-gray-300" />
            <Badge
              variant="primary"
              size="sm"
              rounded
              className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center"
            >
              99+
            </Badge>
          </div>

          <div className="relative inline-block">
            <ShoppingCart size={24} className="text-gray-700 dark:text-gray-300" />
            <Badge
              variant="success"
              size="sm"
              rounded
              className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center"
            >
              3
            </Badge>
          </div>

          <div className="relative inline-block">
            <Bell size={24} className="text-gray-700 dark:text-gray-300" />
            <Badge
              variant="danger"
              dot
              className="absolute top-0 right-0"
            />
          </div>
        </div>
      </div>

      {/* 状态标签 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          状态标签
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300 w-24">
              已支付:
            </span>
            <Badge variant="success" icon={<CheckCircle size={14} />}>
              已完成
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300 w-24">
              待处理:
            </span>
            <Badge variant="warning" icon={<AlertCircle size={14} />}>
              处理中
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300 w-24">
              已取消:
            </span>
            <Badge variant="danger" icon={<X size={14} />}>
              已关闭
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300 w-24">
              草稿:
            </span>
            <Badge variant="default">
              未发布
            </Badge>
          </div>
        </div>
      </div>

      {/* 技术标签 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          技术栈标签
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">React 19</Badge>
          <Badge variant="info">TypeScript</Badge>
          <Badge variant="success">Tailwind CSS</Badge>
          <Badge variant="primary">Framer Motion</Badge>
          <Badge variant="warning">Vite</Badge>
          <Badge variant="info">Docker</Badge>
          <Badge variant="success">Node.js</Badge>
          <Badge variant="primary">ESLint</Badge>
          <Badge variant="info">Prettier</Badge>
        </div>
      </div>

      {/* 组合使用 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用场景
        </h3>
        <div className="space-y-4">
          {/* 用户卡片 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  张三
                </h4>
                <Badge variant="primary" size="sm">
                  管理员
                </Badge>
                <Badge variant="success" size="sm" dot>
                  在线
                </Badge>
              </div>
              <Badge variant="info" size="sm">
                高级会员
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              zhangsan@example.com
            </p>
          </div>

          {/* 项目卡片 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                TH-UI 组件库
              </h4>
              <Badge variant="success" icon={<CheckCircle size={14} />}>
                进行中
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge size="sm" variant="primary">
                React
              </Badge>
              <Badge size="sm" variant="info">
                TypeScript
              </Badge>
              <Badge size="sm" variant="success">
                UI Library
              </Badge>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  系统通知
                </span>
              </div>
              <Badge variant="danger" size="sm">
                5 新消息
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  待办事项
                </span>
              </div>
              <Badge variant="warning" size="sm">
                3 待处理
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  收藏夹
                </span>
              </div>
              <Badge variant="info" size="sm">
                12 项目
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgeDemo

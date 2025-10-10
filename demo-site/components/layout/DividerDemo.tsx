import React from 'react'
import { Divider } from '../../../src/components/Divider'

const DividerDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Divider 分割线
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          用于分隔内容区域的视觉元素，支持水平和垂直方向
        </p>
      </div>

      {/* 基础用法 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础水平分割线
        </h3>
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            这是第一段内容
          </p>
          <Divider />
          <p className="text-gray-600 dark:text-gray-400">
            这是第二段内容
          </p>
          <Divider />
          <p className="text-gray-600 dark:text-gray-400">
            这是第三段内容
          </p>
        </div>
      </div>

      {/* 带文字 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          带文字的分割线
        </h3>
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            这是上方的内容区域
          </p>
          <Divider>默认居中</Divider>
          <p className="text-gray-600 dark:text-gray-400">
            这是下方的内容区域
          </p>
        </div>
      </div>

      {/* 文字对齐 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          文字对齐方式
        </h3>
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            左对齐的内容
          </p>
          <Divider align="left">左对齐</Divider>
          <p className="text-gray-600 dark:text-gray-400">
            居中的内容
          </p>
          <Divider align="center">居中对齐</Divider>
          <p className="text-gray-600 dark:text-gray-400">
            右对齐的内容
          </p>
          <Divider align="right">右对齐</Divider>
          <p className="text-gray-600 dark:text-gray-400">
            最后的内容
          </p>
        </div>
      </div>

      {/* 分割线样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          分割线样式
        </h3>
        <div>
          <p className="text-gray-600 dark:text-gray-400">实线</p>
          <Divider variant="solid" />
          <p className="text-gray-600 dark:text-gray-400">虚线</p>
          <Divider variant="dashed" />
          <p className="text-gray-600 dark:text-gray-400">点线</p>
          <Divider variant="dotted" />
          <p className="text-gray-600 dark:text-gray-400">结束</p>
        </div>
      </div>

      {/* 间距控制 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          间距控制
        </h3>
        <div>
          <p className="text-gray-600 dark:text-gray-400">小间距</p>
          <Divider spacing="sm" />
          <p className="text-gray-600 dark:text-gray-400">中等间距（默认）</p>
          <Divider spacing="md" />
          <p className="text-gray-600 dark:text-gray-400">大间距</p>
          <Divider spacing="lg" />
          <p className="text-gray-600 dark:text-gray-400">结束</p>
        </div>
      </div>

      {/* 垂直分割线 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          垂直分割线
        </h3>
        <div className="flex items-center h-16">
          <span className="text-gray-600 dark:text-gray-400">文本1</span>
          <Divider orientation="vertical" spacing="md" />
          <span className="text-gray-600 dark:text-gray-400">文本2</span>
          <Divider orientation="vertical" spacing="md" />
          <span className="text-gray-600 dark:text-gray-400">文本3</span>
          <Divider orientation="vertical" spacing="md" />
          <span className="text-gray-600 dark:text-gray-400">文本4</span>
        </div>
      </div>

      {/* 垂直分割线样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          垂直分割线样式
        </h3>
        <div className="flex items-center h-16">
          <span className="text-gray-600 dark:text-gray-400">实线</span>
          <Divider orientation="vertical" variant="solid" />
          <span className="text-gray-600 dark:text-gray-400">虚线</span>
          <Divider orientation="vertical" variant="dashed" />
          <span className="text-gray-600 dark:text-gray-400">点线</span>
          <Divider orientation="vertical" variant="dotted" />
          <span className="text-gray-600 dark:text-gray-400">结束</span>
        </div>
      </div>

      {/* 组合样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          组合样式
        </h3>
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            这是一些内容
          </p>
          <Divider variant="dashed" spacing="lg">
            虚线 + 大间距 + 居中文字
          </Divider>
          <p className="text-gray-600 dark:text-gray-400">
            这是更多内容
          </p>
          <Divider variant="dotted" spacing="sm" align="left">
            点线 + 小间距 + 左对齐
          </Divider>
          <p className="text-gray-600 dark:text-gray-400">
            这是最后的内容
          </p>
        </div>
      </div>

      {/* 实际应用 - 文章内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 文章内容分割
        </h3>
        <div className="max-w-2xl">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            文章标题
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>作者: 张三</span>
            <Divider orientation="vertical" spacing="sm" className="h-4" />
            <span>发布时间: 2024-01-15</span>
            <Divider orientation="vertical" spacing="sm" className="h-4" />
            <span>阅读: 1,234</span>
          </div>

          <Divider spacing="lg" />

          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              这是文章的第一段内容。Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              这是文章的第二段内容。Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <Divider spacing="lg">相关内容</Divider>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                推荐文章 1
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                简短描述...
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                推荐文章 2
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                简短描述...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 实际应用 - 列表分组 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 列表分组
        </h3>
        <div className="max-w-md">
          <Divider align="left">今天</Divider>
          <div className="space-y-2">
            <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">新消息</span>
                <span className="text-xs text-gray-500">10:30</span>
              </div>
            </div>
            <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">系统通知</span>
                <span className="text-xs text-gray-500">09:15</span>
              </div>
            </div>
          </div>

          <Divider align="left" spacing="lg">
            昨天
          </Divider>
          <div className="space-y-2">
            <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">会议提醒</span>
                <span className="text-xs text-gray-500">昨天</span>
              </div>
            </div>
            <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">任务完成</span>
                <span className="text-xs text-gray-500">昨天</span>
              </div>
            </div>
          </div>

          <Divider align="left" spacing="lg">
            更早
          </Divider>
          <div className="space-y-2">
            <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">历史消息</span>
                <span className="text-xs text-gray-500">2天前</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 实际应用 - 表单分组 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 表单分组
        </h3>
        <form className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户名
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              邮箱
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <Divider spacing="lg">安全信息</Divider>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              确认密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <Divider spacing="lg" />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            提交
          </button>
        </form>
      </div>

      {/* 实际应用 - 菜单分隔 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用 - 菜单分隔
        </h3>
        <div className="max-w-xs border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
            <span className="text-sm text-gray-900 dark:text-white">个人资料</span>
          </div>
          <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
            <span className="text-sm text-gray-900 dark:text-white">账户设置</span>
          </div>

          <Divider spacing="sm" />

          <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
            <span className="text-sm text-gray-900 dark:text-white">帮助中心</span>
          </div>
          <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
            <span className="text-sm text-gray-900 dark:text-white">反馈建议</span>
          </div>

          <Divider spacing="sm" />

          <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
            <span className="text-sm text-red-600 dark:text-red-400">退出登录</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DividerDemo

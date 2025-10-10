import React from 'react'
import { Avatar, AvatarGroup } from '../../../src/components/Avatar'

const AvatarDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Avatar 头像
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          用于展示用户头像、状态和分组的组件
        </p>
      </div>

      {/* 基础用法 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          基础用法
        </h3>
        <div className="flex items-center gap-4">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="Felix"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
            alt="Aneka"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble"
            alt="Trouble"
          />
        </div>
      </div>

      {/* 尺寸 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          尺寸大小
        </h3>
        <div className="flex items-end gap-4">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=xs"
            alt="XS"
            size="xs"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=sm"
            alt="SM"
            size="sm"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=md"
            alt="MD"
            size="md"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=lg"
            alt="LG"
            size="lg"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=xl"
            alt="XL"
            size="xl"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=2xl"
            alt="2XL"
            size="2xl"
          />
        </div>
      </div>

      {/* 形状 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          形状样式
        </h3>
        <div className="flex items-center gap-4">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=circle"
            alt="Circle"
            shape="circle"
            size="lg"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=square"
            alt="Square"
            shape="square"
            size="lg"
          />
        </div>
      </div>

      {/* 状态指示器 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          状态指示器
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=online"
              alt="在线"
              size="lg"
              status="online"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">在线</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=offline"
              alt="离线"
              size="lg"
              status="offline"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">离线</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=away"
              alt="离开"
              size="lg"
              status="away"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">离开</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=busy"
              alt="忙碌"
              size="lg"
              status="busy"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">忙碌</p>
          </div>
        </div>
      </div>

      {/* 状态位置 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          状态指示器位置
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=tr"
              alt="右上"
              size="lg"
              status="online"
              statusPosition="top-right"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">右上</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=br"
              alt="右下"
              size="lg"
              status="online"
              statusPosition="bottom-right"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">右下</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=tl"
              alt="左上"
              size="lg"
              status="online"
              statusPosition="top-left"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">左上</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=bl"
              alt="左下"
              size="lg"
              status="online"
              statusPosition="bottom-left"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">左下</p>
          </div>
        </div>
      </div>

      {/* 边框 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          带边框
        </h3>
        <div className="flex items-center gap-4">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=border1"
            alt="边框"
            size="lg"
            bordered
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=border2"
            alt="边框+状态"
            size="lg"
            bordered
            status="online"
          />
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=border3"
            alt="方形+边框"
            size="lg"
            shape="square"
            bordered
          />
        </div>
      </div>

      {/* 后备方案 - 首字母 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          后备方案 - 首字母
        </h3>
        <div className="flex items-center gap-4">
          <Avatar alt="张三" size="lg" />
          <Avatar alt="李四" size="lg" />
          <Avatar alt="王五" size="lg" />
          <Avatar alt="John Doe" size="lg" />
          <Avatar alt="A" size="lg" />
        </div>
      </div>

      {/* 后备方案 - 自定义 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          后备方案 - 自定义
        </h3>
        <div className="flex items-center gap-4">
          <Avatar
            fallback={<span className="text-2xl">👤</span>}
            size="lg"
          />
          <Avatar
            fallback={<span className="text-2xl">🦊</span>}
            size="lg"
          />
          <Avatar
            fallback={<span className="text-2xl">🐱</span>}
            size="lg"
          />
        </div>
      </div>

      {/* 可点击 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          可点击头像
        </h3>
        <div className="flex items-center gap-4">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=click1"
            alt="点击我"
            size="lg"
            onClick={() => alert('头像被点击!')}
          />
          <Avatar
            alt="张三"
            size="lg"
            status="online"
            onClick={() => alert('张三的头像被点击!')}
          />
        </div>
      </div>

      {/* 头像组 - 基础 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          头像组 - 基础用法
        </h3>
        <AvatarGroup>
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=group1" alt="用户1" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=group2" alt="用户2" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=group3" alt="用户3" />
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=group4" alt="用户4" />
        </AvatarGroup>
      </div>

      {/* 头像组 - 限制数量 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          头像组 - 限制显示数量
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              最多显示 3 个头像
            </p>
            <AvatarGroup max={3}>
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=max1" alt="用户1" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=max2" alt="用户2" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=max3" alt="用户3" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=max4" alt="用户4" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=max5" alt="用户5" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=max6" alt="用户6" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=max7" alt="用户7" />
            </AvatarGroup>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              不同尺寸
            </p>
            <AvatarGroup max={4} size="sm">
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=size1" alt="用户1" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=size2" alt="用户2" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=size3" alt="用户3" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=size4" alt="用户4" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=size5" alt="用户5" />
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=size6" alt="用户6" />
            </AvatarGroup>
          </div>
        </div>
      </div>

      {/* 实际应用场景 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          实际应用场景
        </h3>
        <div className="space-y-6">
          {/* 用户卡片 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Avatar
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                alt="张三"
                size="lg"
                status="online"
                bordered
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  张三
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  高级开发工程师
                </p>
              </div>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                关注
              </button>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              最新评论
            </h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=comment1"
                  alt="用户1"
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      李四
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      2小时前
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    这个组件库真不错，设计很美观！
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=comment2"
                  alt="用户2"
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      王五
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      5小时前
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    期待更多组件的加入！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 团队成员 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                团队成员
              </h4>
              <AvatarGroup max={5} size="sm">
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=team1" alt="成员1" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=team2" alt="成员2" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=team3" alt="成员3" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=team4" alt="成员4" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=team5" alt="成员5" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=team6" alt="成员6" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=team7" alt="成员7" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=team8" alt="成员8" />
              </AvatarGroup>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=member1"
                  alt="张三"
                  size="sm"
                  status="online"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    张三
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    开发
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=member2"
                  alt="李四"
                  size="sm"
                  status="away"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    李四
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    设计
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvatarDemo

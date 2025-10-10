import React from "react"
import { useToast } from "../../../src/components/feedback/Notification"
import { Card } from "../../../src/components/ui/Card"
import { Button } from "../../../src/components/ui/Button"

export default function NotificationDemo() {
  const { success, error, warning, info } = useToast()

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">💬 反馈组件 - 通知提示</h2>
      <Card>
        <div className="space-y-6">
          {/* 基础通知 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础通知类型</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="success"
                onClick={() => success('操作成功', '您的数据已成功保存！')}
              >
                成功通知
              </Button>
              <Button
                variant="danger"
                onClick={() => error('操作失败', '保存数据时发生错误，请重试。')}
              >
                错误通知
              </Button>
              <Button
                variant="warning"
                onClick={() => warning('警告提示', '您的会话即将过期，请保存工作。')}
              >
                警告通知
              </Button>
              <Button
                variant="secondary"
                onClick={() => info('提示信息', '新版本已发布，点击更新。')}
              >
                信息通知
              </Button>
            </div>
          </div>

          {/* 只有标题 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">仅标题通知</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => success('操作成功')}
              >
                简短成功通知
              </Button>
              <Button
                variant="secondary"
                onClick={() => info('新消息')}
              >
                简短信息通知
              </Button>
            </div>
          </div>

          {/* 多个通知 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">多个通知</h3>
            <Button
              variant="primary"
              onClick={() => {
                success('第一条通知', '这是第一条成功通知')
                setTimeout(() => info('第二条通知', '这是第二条信息通知'), 300)
                setTimeout(() => warning('第三条通知', '这是第三条警告通知'), 600)
              }}
            >
              显示多个通知
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              点击按钮会依次显示3条不同类型的通知
            </p>
          </div>

          {/* 长文本通知 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">长文本通知</h3>
            <Button
              variant="secondary"
              onClick={() =>
                info(
                  '系统更新提示',
                  '我们已经发布了新版本 v2.0，包含了大量新功能和性能优化。建议您尽快更新以获得最佳体验。更新过程大约需要5分钟，期间系统将暂时不可用。'
                )
              }
            >
              显示长文本通知
            </Button>
          </div>

          {/* 使用场景示例 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">实际使用场景</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="success"
                onClick={() => success('文件上传成功', 'document.pdf 已成功上传')}
              >
                模拟文件上传
              </Button>
              <Button
                variant="danger"
                onClick={() => error('网络连接失败', '无法连接到服务器，请检查网络')}
              >
                模拟网络错误
              </Button>
              <Button
                variant="warning"
                onClick={() => warning('磁盘空间不足', '剩余空间少于10%，建议清理')}
              >
                模拟系统警告
              </Button>
              <Button
                variant="secondary"
                onClick={() => info('有新评论', '张三 回复了您的帖子')}
              >
                模拟消息通知
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

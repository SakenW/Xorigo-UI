import React, { useState } from 'react'
import { Button, ButtonGroup } from '../../../src/components/ui'
import { Card } from '../../../src/components/ui/Card'
import { Modal } from '../../../src/components/feedback/Modal'
import { useToast } from '../../../src/components/feedback/Notification'

// 图标组件示例
const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    />
  </svg>
)

const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
)

const IconDownload = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
  </svg>
)

const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
)

const IconHeart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
  </svg>
)

const IconArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
)

export default function ButtonDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { success, info } = useToast()

  const handleLoadingClick = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      success('加载完成', '数据已成功加载！')
    }, 2000)
  }

  return (
    <>
      {/* 基础变体 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          📝 按钮组件 - 基础变体
        </h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                默认变体
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">主要按钮</Button>
                <Button variant="secondary">次要按钮</Button>
                <Button variant="success">成功按钮</Button>
                <Button variant="warning">警告按钮</Button>
                <Button variant="danger">危险按钮</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                新增变体
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost">幽灵按钮</Button>
                <Button variant="link">链接按钮</Button>
                <Button variant="outline">轮廓按钮</Button>
                <Button variant="glass">玻璃按钮</Button>
                <Button variant="neon">霓虹按钮</Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 尺寸 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          📏 尺寸系统
        </h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                所有尺寸（xs 到 2xl）
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">超小按钮</Button>
                <Button size="sm">小按钮</Button>
                <Button size="md">中等按钮</Button>
                <Button size="lg">大按钮</Button>
                <Button size="xl">超大按钮</Button>
                <Button size="2xl">2XL按钮</Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Loading 状态 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          ⏳ Loading 状态
        </h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                基础 Loading
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading>
                  加载中...
                </Button>
                <Button variant="secondary" loading>
                  加载中...
                </Button>
                <Button variant="success" loading>
                  加载中...
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                自定义 Loading 文本
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading loadingText="正在处理">
                  提交表单
                </Button>
                <Button variant="primary" loading loadingText="数据加载中">
                  加载数据
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                交互演示
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  loading={loading}
                  loadingText="加载中"
                  onClick={handleLoadingClick}
                >
                  点击加载数据
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 图标按钮 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          🎨 图标按钮
        </h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                左侧图标
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={<IconSearch />}>
                  搜索
                </Button>
                <Button variant="success" leftIcon={<IconPlus />}>
                  新建
                </Button>
                <Button variant="secondary" leftIcon={<IconDownload />}>
                  下载
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                右侧图标
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" rightIcon={<IconArrowRight />}>
                  下一步
                </Button>
                <Button variant="ghost" rightIcon={<IconArrowRight />}>
                  了解更多
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                左右图标
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  leftIcon={<IconHeart />}
                  rightIcon={<IconArrowRight />}
                >
                  收藏并继续
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 仅图标按钮 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          🔘 仅图标按钮（Icon Only）
        </h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                不同变体
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" iconOnly>
                  <IconSearch />
                </Button>
                <Button variant="secondary" iconOnly>
                  <IconPlus />
                </Button>
                <Button variant="success" iconOnly>
                  <IconDownload />
                </Button>
                <Button variant="danger" iconOnly>
                  <IconTrash />
                </Button>
                <Button variant="ghost" iconOnly>
                  <IconHeart />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                不同尺寸
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" iconOnly size="xs">
                  <IconSearch />
                </Button>
                <Button variant="primary" iconOnly size="sm">
                  <IconSearch />
                </Button>
                <Button variant="primary" iconOnly size="md">
                  <IconSearch />
                </Button>
                <Button variant="primary" iconOnly size="lg">
                  <IconSearch />
                </Button>
                <Button variant="primary" iconOnly size="xl">
                  <IconSearch />
                </Button>
                <Button variant="primary" iconOnly size="2xl">
                  <IconSearch />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Loading 状态
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" iconOnly loading>
                  <IconSearch />
                </Button>
                <Button variant="secondary" iconOnly loading size="lg">
                  <IconPlus />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ButtonGroup */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          🎯 按钮组（ButtonGroup）
        </h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                水平附加模式
              </h3>
              <ButtonGroup orientation="horizontal">
                <Button variant="secondary">左侧</Button>
                <Button variant="secondary">中间</Button>
                <Button variant="secondary">右侧</Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                垂直附加模式
              </h3>
              <ButtonGroup orientation="vertical">
                <Button variant="secondary" className="min-w-[120px]">
                  选项一
                </Button>
                <Button variant="secondary" className="min-w-[120px]">
                  选项二
                </Button>
                <Button variant="secondary" className="min-w-[120px]">
                  选项三
                </Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                带间距模式
              </h3>
              <ButtonGroup orientation="horizontal" attached={false} spacing="md">
                <Button variant="primary">保存</Button>
                <Button variant="secondary">取消</Button>
                <Button variant="ghost">重置</Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                带分隔线
              </h3>
              <ButtonGroup orientation="horizontal" divider>
                <Button variant="ghost" leftIcon={<IconSearch />}>
                  搜索
                </Button>
                <Button variant="ghost" leftIcon={<IconPlus />}>
                  新建
                </Button>
                <Button variant="ghost" leftIcon={<IconDownload />}>
                  下载
                </Button>
              </ButtonGroup>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                图标按钮组
              </h3>
              <ButtonGroup orientation="horizontal">
                <Button variant="secondary" iconOnly>
                  <IconSearch />
                </Button>
                <Button variant="secondary" iconOnly>
                  <IconPlus />
                </Button>
                <Button variant="secondary" iconOnly>
                  <IconDownload />
                </Button>
                <Button variant="secondary" iconOnly>
                  <IconTrash />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </Card>
      </section>

      {/* 状态与交互 */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          🎮 状态与交互
        </h2>
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                禁用状态
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" disabled>
                  主要按钮
                </Button>
                <Button variant="secondary" disabled>
                  次要按钮
                </Button>
                <Button variant="success" disabled leftIcon={<IconPlus />}>
                  带图标
                </Button>
                <Button variant="primary" disabled iconOnly>
                  <IconSearch />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                全宽按钮
              </h3>
              <div className="space-y-2">
                <Button variant="primary" fullWidth>
                  全宽主要按钮
                </Button>
                <Button variant="secondary" fullWidth leftIcon={<IconDownload />}>
                  全宽带图标按钮
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                点击事件
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalOpen(true)
                    info('提示', '成功打开模态框!')
                  }}
                >
                  打开模态框
                </Button>
                <Button
                  variant="success"
                  onClick={() => success('成功', '操作已成功完成!')}
                >
                  显示成功提示
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="md">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">增强版按钮组件</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            按钮组件现在支持更多功能：
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6">
            <li>新增 xs 和 2xl 尺寸</li>
            <li>新增 ghost 和 link 变体</li>
            <li>支持 loadingText 自定义加载文本</li>
            <li>支持 leftIcon 和 rightIcon</li>
            <li>支持 iconOnly 仅图标模式</li>
            <li>新增 ButtonGroup 组件</li>
          </ul>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setModalOpen(false)
                success('确认成功', '模态框已确认!')
              }}
            >
              确认
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

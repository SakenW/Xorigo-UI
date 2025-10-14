/**
 * Overlays 组件测试示例
 * 验证所有覆盖层组件的基本功能和使用方式
 */

'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from './index'

// 测试组件示例
export const OverlaysTestExample = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Overlays 组件测试</h1>

      {/* Dialog 测试 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Dialog 对话框</h2>
        <button
          onClick={() => setDialogOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          打开对话框
        </button>

        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          variant="default"
          size="md"
        >
          <DialogHeader>
            <DialogTitle>对话框标题</DialogTitle>
            <DialogDescription>
              这是对话框的描述内容，用于解释当前操作的目的。
            </DialogDescription>
          </DialogHeader>

          <DialogContent>
            <p>这是对话框的主要内容区域。可以放置任何内容。</p>
          </DialogContent>

          <DialogFooter>
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              取消
            </button>
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              确认
            </button>
          </DialogFooter>
        </Dialog>
      </section>

      {/* Drawer 测试 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Drawer 抽屉</h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          打开抽屉
        </button>

        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          placement="right"
          size="md"
        >
          <DrawerHeader>
            <DrawerTitle>抽屉标题</DrawerTitle>
          </DrawerHeader>

          <DrawerContent>
            <p>这是抽屉的主要内容区域。</p>
            <div className="mt-4 space-y-2">
              <p>• 支持四个方向：top, bottom, left, right</p>
              <p>• 支持手势滑动关闭</p>
              <p>• 支持ESC键关闭</p>
              <p>• 支持点击遮罩关闭</p>
            </div>
          </DrawerContent>

          <DrawerFooter>
            <button
              onClick={() => setDrawerOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              关闭
            </button>
          </DrawerFooter>
        </Drawer>
      </section>

      {/* Popover 测试 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Popover 弹出框</h2>
        <Popover
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          position="top"
          variant="default"
          showArrow={true}
        >
          <PopoverTrigger>
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              悬停或点击我
            </button>
          </PopoverTrigger>

          <PopoverContent>
            <div className="p-4">
              <h3 className="font-semibold mb-2">弹出框标题</h3>
              <p className="text-sm text-gray-600">
                这是弹出框的内容，支持智能位置调整和箭头指示。
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      {/* 变体测试 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">组件变体测试</h2>
        <div className="flex gap-4 flex-wrap">
          {/* Dialog 变体 */}
          <button
            onClick={() => setDialogOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            危险对话框
          </button>

          {/* Drawer 方向 */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            底部抽屉
          </button>

          {/* Popover 变体 */}
          <Popover
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            position="bottom"
            variant="tooltip"
            showArrow={true}
          >
            <PopoverTrigger>
              <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
                提示框
              </button>
            </PopoverTrigger>

            <PopoverContent>
              这是一个提示框内容
            </PopoverContent>
          </Popover>
        </div>
      </section>
    </div>
  )
}

// 导出测试组件
export default OverlaysTestExample
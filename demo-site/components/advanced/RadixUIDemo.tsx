import React, { useState } from "react"
import Accordion, { AccordionItem, AccordionTrigger, AccordionContent } from "../../../src/components/radix/Accordion"
import DropdownMenu, { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuLabel } from "../../../src/components/radix/DropdownMenu";
import { Dialog } from "../../../src/components/advanced/Dialog"
import { Toast, useToast } from "../../../src/components/feedback/Toast"
import { Button } from "../../../src/components/ui/Button"
import { Card } from "../../../src/components/ui/Card"
import { ChevronDown, Plus, Settings, User, LogOut, Star, Info } from "lucide-react"

const RadixUIDemo: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const showToast = (variant: 'default' | 'success' | 'error' | 'warning' | 'info') => {
    toast({
      title: '通知消息',
      description: `这是一个${variant}类型的通知消息`,
      variant
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Radix UI 高级组件
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          基于 Radix UI 构建的高质量无障碍组件，提供优秀的用户体验
        </p>
      </div>

      {/* Accordion 手风琴组件 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Accordion 手风琴
        </h3>
        <div className="w-full max-w-md">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                TH-UI 的设计理念是什么？
              </AccordionTrigger>
              <AccordionContent>
                TH-UI 基于原子化设计原则，提供高度可组合、主题化、类型安全的 React 组件库，支持现代 Web 开发需求。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                如何使用 Radix UI 组件？
              </AccordionTrigger>
              <AccordionContent>
                Radix UI 组件提供了无障碍的原始组件，TH-UI 在此基础上添加了样式系统、动画效果和 TypeScript 类型支持。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                支持哪些浏览器？
              </AccordionTrigger>
              <AccordionContent>
                TH-UI 支持所有现代浏览器，包括 Chrome、Firefox、Safari、Edge 等最新版本，确保良好的兼容性体验。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>

      {/* Dropdown Menu 下拉菜单组件 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Dropdown Menu 下拉菜单
        </h3>
        <div className="flex flex-wrap gap-4">
          {/* 基础下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                基础菜单
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                新建项目
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 带复选框的下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                选择功能
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem>
                显示通知
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                自动保存
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                深色模式
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 分组下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                分组菜单
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>账户</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                个人资料
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                账户设置
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>项目</DropdownMenuLabel>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                新建项目
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                收藏夹
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Dialog 对话框组件 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Dialog 对话框
        </h3>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setIsDialogOpen(true)}>
            打开对话框
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>确认删除</Dialog.Title>
                <Dialog.Description>
                  此操作无法撤销。这将永久删除您的账户并从我们的服务器中移除您的数据。
                </Dialog.Description>
              </Dialog.Header>

              <div className="py-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  请确认您要继续执行此操作。
                </p>
              </div>

              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    showToast('warning')
                    setIsDialogOpen(false)
                  }}
                >
                  确认删除
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </div>
      </Card>

      {/* Toast 通知组件 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Toast 通知消息
        </h3>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => showToast('default')}>
            默认通知
          </Button>
          <Button onClick={() => showToast('success')} variant="success">
            成功通知
          </Button>
          <Button onClick={() => showToast('error')} variant="danger">
            错误通知
          </Button>
          <Button onClick={() => showToast('warning')} variant="warning">
            警告通知
          </Button>
          <Button onClick={() => showToast('info')} variant="outline">
            信息通知
          </Button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            通知消息会显示在页面右上角，自动消失或在用户操作后关闭。
          </p>
        </div>
      </Card>

      {/* 组合使用示例 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          组合使用示例
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          以下示例展示了如何组合使用多个 Radix UI 组件创建复杂的用户界面。
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                项目设置
              </h4>
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  自动保存已启用
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => showToast('info')}>
                  查看配置
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => showToast('success')}>
                  导出设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  重置所有设置
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="appearance">
              <AccordionTrigger>外观设置</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>主题模式</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          自动
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>亮色</DropdownMenuItem>
                        <DropdownMenuItem>暗色</DropdownMenuItem>
                        <DropdownMenuItem>自动</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notifications">
              <AccordionTrigger>通知设置</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <DropdownMenuCheckboxItem defaultChecked>
                    桌面通知
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem defaultChecked>
                    邮件通知
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    短信通知
                  </DropdownMenuCheckboxItem>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>
    </div>
  )
}

export default RadixUIDemo

import React, { useState, useEffect } from 'react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
} from '../../../src/components/ui/Command'
import { Button } from '../../../src/components/ui/Button'
import { Calendar, Calculator, Smile, User, CreditCard, Settings, Search } from 'lucide-react'

const CommandDemo: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState<string>('')

  // 全局快捷键 ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (value: string) => {
    setSelectedCommand(value)
    setOpen(false)
    // 这里可以添加实际的命令执行逻辑
    console.log('执行命令:', value)
  }

  return (
    <div className="space-y-8">
      {/* 标题和说明 */}
      <div>
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Command 命令面板</h2>
        <p className="text-gray-600 dark:text-gray-400">
          快速搜索和执行命令的面板组件，支持键盘导航和快捷键。
        </p>
      </div>

      {/* 快捷键提示 */}
      <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
          <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-blue-300 dark:border-blue-700 font-mono text-xs">
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
          </kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-blue-300 dark:border-blue-700 font-mono text-xs">
            K
          </kbd>
          <span>打开命令面板</span>
        </div>
        <div className="h-4 w-px bg-blue-300 dark:bg-blue-700" />
        <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
          <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-blue-300 dark:border-blue-700 font-mono text-xs">
            ↑ ↓
          </kbd>
          <span>导航</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
          <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-blue-300 dark:border-blue-700 font-mono text-xs">
            Enter
          </kbd>
          <span>选择</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100">
          <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded shadow-sm border border-blue-300 dark:border-blue-700 font-mono text-xs">
            Esc
          </kbd>
          <span>关闭</span>
        </div>
      </div>

      {/* 基础 Command 演示 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">基础 Command</h3>
        <div className="max-w-2xl">
          <Command className="shadow-lg">
            <CommandInput placeholder="搜索命令..." />
            <CommandList>
              <CommandEmpty>未找到结果</CommandEmpty>
              <CommandGroup heading="建议">
                <CommandItem value="日历" onSelect={handleSelect}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>日历</span>
                </CommandItem>
                <CommandItem value="搜索表情" onSelect={handleSelect}>
                  <Smile className="mr-2 h-4 w-4" />
                  <span>搜索表情</span>
                </CommandItem>
                <CommandItem value="计算器" onSelect={handleSelect}>
                  <Calculator className="mr-2 h-4 w-4" />
                  <span>计算器</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="设置">
                <CommandItem value="个人资料" onSelect={handleSelect}>
                  <User className="mr-2 h-4 w-4" />
                  <span>个人资料</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem value="账单" onSelect={handleSelect}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>账单</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem value="设置" onSelect={handleSelect}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>设置</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
        {selectedCommand && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-900 dark:text-green-100">
              已选择命令: <strong>{selectedCommand}</strong>
            </p>
          </div>
        )}
      </div>

      {/* CommandDialog 演示 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">CommandDialog（对话框模式）</h3>
        <div className="space-y-4">
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Search className="h-4 w-4" />
            打开命令面板
            <kbd className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
              {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
            </kbd>
          </Button>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            点击按钮或按 {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'} 打开命令面板
          </p>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command className="rounded-lg shadow-2xl">
            <CommandInput placeholder="输入命令或搜索..." />
            <CommandList>
              <CommandEmpty>未找到结果</CommandEmpty>
              <CommandGroup heading="建议">
                <CommandItem
                  value="日历"
                  onSelect={(value) => {
                    handleSelect(value)
                    setOpen(false)
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>日历</span>
                </CommandItem>
                <CommandItem
                  value="搜索表情"
                  onSelect={(value) => {
                    handleSelect(value)
                    setOpen(false)
                  }}
                >
                  <Smile className="mr-2 h-4 w-4" />
                  <span>搜索表情</span>
                </CommandItem>
                <CommandItem
                  value="计算器"
                  onSelect={(value) => {
                    handleSelect(value)
                    setOpen(false)
                  }}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  <span>计算器</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="设置">
                <CommandItem
                  value="个人资料"
                  onSelect={(value) => {
                    handleSelect(value)
                    setOpen(false)
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>个人资料</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem
                  value="账单"
                  onSelect={(value) => {
                    handleSelect(value)
                    setOpen(false)
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>账单</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem
                  value="设置"
                  onSelect={(value) => {
                    handleSelect(value)
                    setOpen(false)
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>设置</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>

      {/* 特性说明 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">核心特性</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">实时搜索</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              输入关键词即时过滤命令列表，支持中英文搜索。
            </p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">键盘导航</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              使用 ↑↓ 键选择，Enter 确认，Esc 关闭，完全键盘操作。
            </p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">分组展示</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              支持将命令分组显示，带标题和分隔线，结构清晰。
            </p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">快捷键提示</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              显示命令的快捷键，提升用户体验和操作效率。
            </p>
          </div>
        </div>
      </div>

      {/* 使用示例代码 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">使用示例</h3>
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
            {`import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
} from '@th-ui/core'

function App() {
  const [open, setOpen] = useState(false)

  // 全局快捷键
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="搜索命令..." />
        <CommandList>
          <CommandEmpty>未找到结果</CommandEmpty>
          <CommandGroup heading="建议">
            <CommandItem onSelect={() => console.log('日历')}>
              <CalendarIcon />
              <span>日历</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="设置">
            <CommandItem onSelect={() => console.log('设置')}>
              <SettingsIcon />
              <span>设置</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CommandDemo

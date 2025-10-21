/**
 * 组件代码示例生成器 - 修复版
 * 仅包含实际存在的组件示例
 */

interface ComponentCodeExampleProps {
  componentName: string
}

/**
 * 生成组件代码示例
 */
export function generateComponentCodeExample({ componentName }: ComponentCodeExampleProps): string {
  const codeExamples: Record<string, string> = {
    // ===== UI 基础组件 =====
    'Button': `import { Button } from '@xorigo-ui/core'

// 变体样式
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="success">成功按钮</Button>
<Button variant="warning">警告按钮</Button>
<Button variant="danger">危险按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="link">链接按钮</Button>
<Button variant="outline">边框按钮</Button>

// 尺寸规格
<Button size="xs">超小按钮</Button>
<Button size="sm">小型按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大型按钮</Button>

// 特殊状态
<Button variant="primary" disabled>禁用状态</Button>
<Button variant="primary" loading>加载状态</Button>`,

    'Card': `import { Card } from '@xorigo-ui/core'

// 基础卡片
<Card>
  <div>
    <h3>卡片标题</h3>
    <p>卡片内容描述</p>
  </div>
</Card>

// 带样式的卡片
<Card className="p-4">
  <h3 className="text-lg font-semibold">卡片标题</h3>
  <p className="text-sm text-gray-600 mt-2">这里是卡片的主要内容区域</p>
</Card>`,

    'Typography': `import { Typography } from '@xorigo-ui/core'

// 标题层级
<Typography variant="h1">H1 主标题</Typography>
<Typography variant="h3">H3 三级标题</Typography>
<Typography variant="p">段落文本内容</Typography>
<Typography variant="small">小号文本说明</Typography>`,

    'Skeleton': `import { Skeleton } from '@xorigo-ui/core'

// 文本骨架
<Skeleton className="h-4 w-3/4 mb-2" />
<Skeleton className="h-4 w-1/2" />

// 圆形骨架
<Skeleton className="w-10 h-10 rounded-full" />`,

    'Spinner': `import { Spinner } from '@xorigo-ui/core'

// 不同尺寸的加载器
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`,

    'AnimatedCard': `import { AnimatedCard } from '@xorigo-ui/core'

// 动画卡片
<AnimatedCard className="p-4">
  <h3>动画卡片</h3>
  <p>带有动画效果的卡片组件</p>
</AnimatedCard>`,

    'AvatarGroup': `import { AvatarGroup } from '@xorigo-ui/core'

// 头像组
<AvatarGroup
  avatars={[
    { name: "张三", src: "" },
    { name: "李四", src: "" },
    { name: "王五", src: "" },
    { name: "更多", src: "", count: 5 }
  ]}
  max={3}
/>`,

    // ===== 输入控件组件 =====
    'Input': `import { Input } from '@xorigo-ui/core'

// 基础输入框
<Input placeholder="请输入内容..." />

// 不同变体
<Input variant="outlined" placeholder="轮廓样式" />
<Input variant="filled" placeholder="填充样式" />

// 带图标
<Input leftIcon={<span>🔍</span>} placeholder="带图标输入框" />
<Input error="错误信息" placeholder="错误状态" />`,

    'Textarea': `import { Textarea } from '@xorigo-ui/core'

// 基础文本域
<Textarea placeholder="请输入多行文本内容..." rows={4} />

// 带标签的文本域
<Textarea
  placeholder="请输入详细描述..."
  rows={6}
  className="w-full"
/>`,

    'Select': `import { Select } from '@xorigo-ui/core'

// 基础选择器（静态示例）
<Select placeholder="请选择..." />

// 注意：Select 组件的具体API可能需要根据实际实现调整`,

    'Checkbox': `import { Checkbox } from '@xorigo-ui/core'

// 基础复选框
<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
  label="同意条款"
/>

// 不同状态
<Checkbox defaultChecked label="默认选中" />
<Checkbox disabled label="禁用状态" />`,

    'Radio': `import { Radio } from '@xorigo-ui/core'

// 注意：Radio 组件通常需要与 RadioGroup 一起使用
// 具体用法请参考组件文档`,

    'Switch': `import { Switch } from '@xorigo-ui/core'

// 注意：Switch 组件的具体API请参考组件文档
// 可能需要根据实际实现调整用法`,

    'Slider': `import { Slider } from '@xorigo-ui/core'

// 基础滑块
<Slider
  value={value}
  onChange={(newValue) => setValue(newValue)}
  min={0}
  max={100}
/>`,

    'ButtonGroup': `import { ButtonGroup, Button } from '@xorigo-ui/core'

// 基础按钮组
<ButtonGroup>
  <Button variant="outline">左</Button>
  <Button variant="outline">中</Button>
  <Button variant="outline">右</Button>
</ButtonGroup>`,

    'SearchInput': `import { SearchInput } from '@xorigo-ui/core'

// 搜索输入框
<SearchInput
  placeholder="搜索内容..."
  value={searchValue}
  onChange={(e) => setSearchValue(e.target.value)}
  onSearch={() => console.log('搜索:', searchValue)}
/>`,

    // ===== 导航组件 =====
    'Tabs': `import { Tabs } from '@xorigo-ui/core'

// 注意：Tabs 组件的具体API请参考组件文档
// 可能包含 TabsList, TabsTrigger, TabsContent 等子组件`,

    'Menu': `import { Menu } from '@xorigo-ui/core'

// 注意：Menu 组件的具体API请参考组件文档
// 可能包含 MenuItem, MenuSeparator 等子组件`,

    'Breadcrumb': `import { Breadcrumb } from '@xorigo-ui/core'

// 面包屑导航（静态示例）
<Breadcrumb>
  <span>首页</span>
  <span>/</span>
  <span>分类</span>
  <span>/</span>
  <span>当前页面</span>
</Breadcrumb>`,

    'Pagination': `import { Pagination } from '@xorigo-ui/core'

// 分页组件（静态示例）
<div className="flex items-center gap-1">
  <button className="px-2 py-1 text-sm border rounded">‹</button>
  <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded">1</button>
  <button className="px-2 py-1 text-sm border rounded">2</button>
  <button className="px-2 py-1 text-sm border rounded">3</button>
  <button className="px-2 py-1 text-sm border rounded">›</button>
</div>`,

    // ===== 数据展示组件 =====
    'Table': `import { Table } from '@xorigo-ui/core'

// 基础表格（静态示例）
<table className="w-full text-sm">
  <thead>
    <tr className="border-b">
      <th className="text-left py-2 px-2">姓名</th>
      <th className="text-left py-2 px-2">年龄</th>
      <th className="text-left py-2 px-2">城市</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b">
      <td className="py-2 px-2">张三</td>
      <td className="py-2 px-2">28</td>
      <td className="py-2 px-2">北京</td>
    </tr>
  </tbody>
</table>`,

    'List': `import { List } from '@xorigo-ui/core'

// 基础列表（静态示例）
<div className="space-y-2">
  <div className="flex items-center gap-3 p-2 border rounded">
    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">A</div>
    <div>
      <div className="text-sm font-medium">列表项 1</div>
      <div className="text-xs text-gray-600">描述信息</div>
    </div>
  </div>
</div>`,

    'Accordion': `import { Accordion } from '@xorigo-ui/core'

// 折叠面板（静态示例）
<div className="space-y-2">
  <div className="border rounded">
    <div className="p-3 bg-gray-50 text-sm font-medium">展开项 1</div>
    <div className="p-3 text-sm text-gray-600 border-t">
      展开内容区域 1
    </div>
  </div>
</div>`,

    // ===== 反馈组件 =====
    'Alert': `import { Alert } from '@xorigo-ui/core'

// 基础提示
<Alert variant="info">信息提示内容</Alert>
<Alert variant="success">成功操作提示</Alert>
<Alert variant="warning">警告信息提示</Alert>
<Alert variant="error">错误信息提示</Alert>`,

    'Loading': `import { Loading } from '@xorigo-ui/core'

// 基础加载器
<Loading />

// 不同变体
<Loading variant="spinner" />
<Loading variant="dots" />`,

    'Progress': `import { Progress } from '@xorigo-ui/core'

// 进度条（静态示例）
<div className="w-full bg-gray-200 rounded-full h-2">
  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
</div>`,

    // ===== 复合组件 =====
    'InputGroup': `import { InputGroup, Input, Button } from '@xorigo-ui/core'

// 输入组合
<div className="flex">
  <Input placeholder="输入内容..." className="rounded-r-none" />
  <Button variant="primary" className="rounded-l-none">搜索</Button>
</div>`
  }

  return codeExamples[componentName] || `import { ${componentName} } from '@xorigo-ui/core'

// 基础用法
<${componentName} />

// 更多示例请查看组件文档
// 该组件的具体API可能需要根据实际实现调整`
}

/**
 * 组件代码示例组件
 */
export function ComponentCodeExample({ componentName }: ComponentCodeExampleProps) {
  const code = generateComponentCodeExample({ componentName })

  return (
    <div className="w-full">
      <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default generateComponentCodeExample
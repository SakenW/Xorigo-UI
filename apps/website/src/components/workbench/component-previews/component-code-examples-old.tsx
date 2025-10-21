/**
 * 组件代码示例生成器
 * 为每个组件生成完整的使用示例代码
 */

interface ComponentCodeExampleProps {
  componentName: string
}

/**
 * 生成组件代码示例
 */
export function generateComponentCodeExample({ componentName }: ComponentCodeExampleProps): string {
  const codeExamples: Record<string, string> = {
    // ===== 实际存在的组件示例 =====
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
<Button size="xl">超大按钮</Button>
<Button size="2xl">特大按钮</Button>

// 特殊状态
<Button variant="primary" disabled>禁用状态</Button>
<Button variant="primary" loading>加载状态</Button>
<Button variant="primary" leftIcon={<span>→</span>}>左图标</Button>
<Button variant="primary" iconOnly ariaLabel="星标">☆</Button>
<Button variant="primary" fullWidth>全宽按钮</Button>`,

    'Input': `import { Input } from '@xorigo-ui/core'

// 变体样式
<Input variant="default" placeholder="默认样式" />
<Input variant="filled" placeholder="填充样式" />
<Input variant="outlined" placeholder="轮廓样式" />
<Input variant="underlined" placeholder="下划线样式" />
<Input variant="ghost" placeholder="幽灵样式" />
<Input variant="neon" placeholder="霓虹样式" />

// 尺寸规格
<Input size="sm" placeholder="小型输入框" />
<Input size="md" placeholder="中型输入框" />
<Input size="lg" placeholder="大型输入框" />

// 特殊功能
<Input label="标签文本" placeholder="带标签的输入框" />
<Input error="错误信息" placeholder="错误状态" />
<Input leftIcon={<span>🔍</span>} placeholder="左图标" />
<Input rightIcon={<span>👁️</span>} placeholder="右图标" />
<Input clearable placeholder="可清除" />
<Input showPasswordToggle type="password" placeholder="密码输入" />
<Input floatingLabel label="浮动标签" placeholder="" />`,

    'Typography': `import { Typography } from '@xorigo-ui/core'

// 标题层级
<Typography variant="h1">H1 主标题</Typography>
<Typography variant="h2">H2 副标题</Typography>
<Typography variant="h3">H3 三级标题</Typography>
<Typography variant="h4">H4 四级标题</Typography>
<Typography variant="h5">H5 五级标题</Typography>
<Typography variant="h6">H6 六级标题</Typography>

// 文本样式
<Typography variant="p">段落文本内容</Typography>
<Typography variant="span">内联文本</Typography>
<Typography variant="small">小号文本</Typography>
<Typography variant="strong">粗体文本</Typography>
<Typography variant="em">斜体文本</Typography>
<Typography variant="code">代码文本</Typography>

// 特殊样式
<Typography variant="p" color="primary">主要色文本</Typography>
<Typography variant="p" color="success">成功色文本</Typography>
<Typography variant="p" color="warning">警告色文本</Typography>
<Typography variant="p" color="danger">危险色文本</Typography>`,

    'Card': `import { Card, CardHeader, CardContent, CardFooter } from '@xorigo-ui/core'

// 基础卡片
<Card>
  <CardContent>
    <h3>卡片标题</h3>
    <p>卡片内容描述</p>
  </CardContent>
</Card>

// 完整卡片
<Card>
  <CardHeader>
    <h3>卡片标题</h3>
  </CardHeader>
  <CardContent>
    <p>这里是卡片的主要内容区域，可以包含各种信息和组件。</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">操作按钮</Button>
  </CardFooter>
</Card>

// 变体样式
<Card variant="outlined">
  <CardContent>边框卡片</CardContent>
</Card>

<Card variant="elevated">
  <CardContent>阴影卡片</CardContent>
</Card>

<Card variant="filled">
  <CardContent>填充卡片</CardContent>
</Card>`,

      // 注意：Badge 组件不存在，已移除示例

    'Alert': `import { Alert } from '@xorigo-ui/core'

// 基础用法
<Alert variant="info">信息提示内容</Alert>
<Alert variant="success">成功操作提示</Alert>
<Alert variant="warning">警告信息提示</Alert>
<Alert variant="error">错误信息提示</Alert>

// 带标题和关闭按钮
<Alert
  variant="info"
  title="提示标题"
  closable
  onClose={() => console.log('关闭')}
>
  这里是详细的提示信息内容，可以包含多行文本和其他组件。
</Alert>

// 带图标
<Alert
  variant="success"
  icon={<span>✓</span>}
  title="操作成功"
>
  数据保存成功！
</Alert>`,

    'Loading': `import { Loading } from '@xorigo-ui/core'

// 基础加载器
<Loading />

// 不同变体
<Loading variant="spinner" />
<Loading variant="dots" />
<Loading variant="pulse" />
<Loading variant="bars" />

// 带文本
<Loading text="加载中..." />

// 不同尺寸
<Loading size="sm" />
<Loading size="md" />
<Loading size="lg" />

// 自定义颜色
<Loading color="primary" />
<Loading color="success" />
<Loading color="warning" />`,

    // ===== 表单组件 =====
    'Textarea': `import { Textarea } from '@xorigo-ui/core'

// 基础用法
<Textarea placeholder="请输入内容..." />

// 带标签
<Textarea
  label="详细描述"
  placeholder="请输入详细描述..."
  rows={4}
/>

// 变体样式
<Textarea variant="outlined" placeholder="轮廓样式" />
<Textarea variant="filled" placeholder="填充样式" />
<Textarea variant="underlined" placeholder="下划线样式" />

// 状态
<Textarea
  placeholder="输入内容..."
  error="请输入有效内容"
  helpText="最多输入500个字符"
  maxLength={500}
/>

// 尺寸
<Textarea size="sm" placeholder="小型文本框" />
<Textarea size="md" placeholder="中型文本框" />
<Textarea size="lg" placeholder="大型文本框" />`,

    'Select': `import { Select, SelectOption } from '@xorigo-ui/core'

// 基础用法
<Select placeholder="请选择...">
  <SelectOption value="option1">选项 1</SelectOption>
  <SelectOption value="option2">选项 2</SelectOption>
  <SelectOption value="option3">选项 3</SelectOption>
</Select>

// 带标签
<Select label="选择分类" placeholder="请选择分类...">
  <SelectOption value="tech">技术</SelectOption>
  <SelectOption value="design">设计</SelectOption>
  <SelectOption value="product">产品</SelectOption>
</Select>

// 可搜索
<Select
  searchable
  placeholder="搜索并选择..."
>
  <SelectOption value="apple">苹果</SelectOption>
  <SelectOption value="banana">香蕉</SelectOption>
  <SelectOption value="orange">橙子</SelectOption>
</Select>

// 多选
<Select
  multiple
  placeholder="选择多个选项..."
>
  <SelectOption value="option1">选项 1</SelectOption>
  <SelectOption value="option2">选项 2</SelectOption>
  <SelectOption value="option3">选项 3</SelectOption>
</Select>`,

    'Checkbox': `import { Checkbox } from '@xorigo-ui/core'

// 基础用法
<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
  label="同意条款"
/>

// 不同状态
<Checkbox defaultChecked label="默认选中" />
<Checkbox disabled label="禁用状态" />
<Checkbox indeterminate label="部分选中" />

// 变体样式
<Checkbox variant="outlined" label="边框样式" />
<Checkbox variant="filled" label="填充样式" />

// 带描述
<Checkbox
  label="高级功能"
  description="启用高级功能和自定义选项"
/>

// 组合使用
<div>
  <Checkbox label="全选" />
  <div className="ml-6">
    <Checkbox label="选项 1" />
    <Checkbox label="选项 2" />
    <Checkbox label="选项 3" />
  </div>
</div>`,

    'Radio': `import { Radio, RadioGroup } from '@xorigo-ui/core'

// 基础用法
<RadioGroup value={selected} onChange={(value) => setSelected(value)}>
  <Radio value="option1" label="选项 1" />
  <Radio value="option2" label="选项 2" />
  <Radio value="option3" label="选项 3" />
</RadioGroup>

// 不同方向
<RadioGroup orientation="horizontal">
  <Radio value="a" label="选项 A" />
  <Radio value="b" label="选项 B" />
  <Radio value="c" label="选项 C" />
</RadioGroup>

// 带描述
<RadioGroup>
  <Radio
    value="basic"
    label="基础版"
    description="包含核心功能"
  />
  <Radio
    value="pro"
    label="专业版"
    description="包含所有功能和技术支持"
  />
</RadioGroup>

// 不同样式
<Radio variant="button">
  <Radio value="small" label="小号" />
  <Radio value="medium" label="中号" />
  <Radio value="large" label="大号" />
</Radio>`,

    'Switch': `import { Switch } from '@xorigo-ui/core'

// 基础用法
<Switch
  checked={enabled}
  onChange={(checked) => setEnabled(checked)}
  label="启用通知"
/>

// 不同状态
<Switch defaultChecked label="默认开启" />
<Switch disabled label="禁用状态" />

// 带描述
<Switch
  label="自动保存"
  description="每30秒自动保存您的更改"
/>

// 不同尺寸
<Switch size="sm" label="小号开关" />
<Switch size="md" label="中号开关" />
<Switch size="lg" label="大号开关" />

// 不同颜色
<Switch color="primary" label="主题色" />
<Switch color="success" label="成功色" />
<Switch color="warning" label="警告色" />`,

    'Slider': `import { Slider } from '@xorigo-ui/core'

// 基础用法
<Slider
  value={value}
  onChange={(newValue) => setValue(newValue)}
  min={0}
  max={100}
/>

// 带标签
<Slider
  label="音量"
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  showValue
/>

// 范围选择
<Slider
  range
  value={[min, max]}
  onChange={([newMin, newMax]) => {
    setMin(newMin)
    setMax(newMax)
  }}
  min={0}
  max={1000}
  step={10}
/>

// 带标记
<Slider
  value={progress}
  onChange={setProgress}
  min={0}
  max={100}
  marks={[
    { value: 0, label: '0%' },
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' }
  ]}
/>`,

    // ===== 导航组件 =====
    'Tabs': `import { Tabs, TabList, TabPanel } from '@xorigo-ui/core'

// 基础用法
<Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
  <TabList>
    <Tab>标签 1</Tab>
    <Tab>标签 2</Tab>
    <Tab>标签 3</Tab>
  </TabList>
  <TabPanel>
    <h3>标签 1 的内容</h3>
    <p>这里是标签 1 的详细内容。</p>
  </TabPanel>
  <TabPanel>
    <h3>标签 2 的内容</h3>
    <p>这里是标签 2 的详细内容。</p>
  </TabPanel>
  <TabPanel>
    <h3>标签 3 的内容</h3>
    <p>这里是标签 3 的详细内容。</p>
  </TabPanel>
</Tabs>

// 不同方向
<Tabs orientation="vertical">
  <TabList>
    <Tab>垂直标签 1</Tab>
    <Tab>垂直标签 2</Tab>
  </TabList>
  <TabPanel>垂直内容区域</TabPanel>
  <TabPanel>垂直内容区域</TabPanel>
</Tabs>

// 可关闭标签
<Tabs>
  <TabList>
    <Tab closable onClose={() => console.log('关闭标签1')}>标签 1</Tab>
    <Tab closable onClose={() => console.log('关闭标签2')}>标签 2</Tab>
    <Tab>+ 新标签</Tab>
  </TabList>
</Tabs>`,

    'Menu': `import { Menu, MenuItem, MenuSeparator } from '@xorigo-ui/core'

// 基础菜单
<Menu>
  <MenuItem onClick={() => console.log('新建')}>新建</MenuItem>
  <MenuItem onClick={() => console.log('打开')}>打开</MenuItem>
  <MenuItem onClick={() => console.log('保存')}>保存</MenuItem>
  <MenuSeparator />
  <MenuItem onClick={() => console.log('退出')}>退出</MenuItem>
</Menu>

// 带图标菜单
<Menu>
  <MenuItem icon={<span>📄</span>} onClick={handleNew}>新建文件</MenuItem>
  <MenuItem icon={<span>📁</span>} onClick={handleOpen}>打开文件夹</MenuItem>
  <MenuItem icon={<span>💾</span>} onClick={handleSave}>保存</MenuItem>
  <MenuSeparator />
  <MenuItem icon={<span>⚙️</span>} onClick={handleSettings}>设置</MenuItem>
</Menu>

// 子菜单
<Menu>
  <MenuItem>文件</MenuItem>
  <MenuItem>
    编辑
    <Menu>
      <MenuItem>撤销</MenuItem>
      <MenuItem>重做</MenuItem>
      <MenuSeparator />
      <MenuItem>剪切</MenuItem>
      <MenuItem>复制</MenuItem>
      <MenuItem>粘贴</MenuItem>
    </Menu>
  </MenuItem>
  <MenuItem>视图</MenuItem>
</Menu>

// 不同样式
<Menu variant="card">
  <MenuItem>卡片菜单项</MenuItem>
  <MenuItem>另一个菜单项</MenuItem>
</Menu>`,

    'Breadcrumb': `import { Breadcrumb, BreadcrumbItem } from '@xorigo-ui/core'

// 基础用法
<Breadcrumb>
  <BreadcrumbItem href="/">首页</BreadcrumbItem>
  <BreadcrumbItem href="/products">产品</BreadcrumbItem>
  <BreadcrumbItem>详情</BreadcrumbItem>
</Breadcrumb>

// 自定义分隔符
<Breadcrumb separator=">">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Documentation</BreadcrumbItem>
  <BreadcrumbItem>Getting Started</BreadcrumbItem>
</Breadcrumb>

// 带图标
<Breadcrumb>
  <BreadcrumbItem href="/" icon={<span>🏠</span>}>首页</BreadcrumbItem>
  <BreadcrumbItem href="/products" icon={<span>📦</span>}>产品</BreadcrumbItem>
  <BreadcrumbItem icon={<span>📋</span>}>详情</BreadcrumbItem>
</Breadcrumb>

// 可点击的当前项
<Breadcrumb>
  <BreadcrumbItem href="/">首页</BreadcrumbItem>
  <BreadcrumbItem href="/category">分类</BreadcrumbItem>
  <BreadcrumbItem href="/category/item" current>当前页面</BreadcrumbItem>
</Breadcrumb>`,

    'Pagination': `import { Pagination } from '@xorigo-ui/core'

// 基础分页
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onChange={handlePageChange}
/>

// 带信息显示
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onChange={handlePageChange}
  showInfo
  showFirstLast
/>

// 自定义每页数量
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  pageSize={pageSize}
  totalItems={totalItems}
  onPageSizeChange={handlePageSizeChange}
  onChange={handlePageChange}
/>

// 紧凑模式
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onChange={handlePageChange}
  compact
/>

// 跳转输入
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onChange={handlePageChange}
  showJumpInput
/>`,

    // ===== 数据展示组件 =====
    'Table': `import { Table, TableHeader, TableBody, TableRow, TableCell } from '@xorigo-ui/core'

// 基础表格
<Table>
  <TableHeader>
    <TableRow>
      <TableCell>姓名</TableCell>
      <TableCell>年龄</TableCell>
      <TableCell>城市</TableCell>
      <TableCell>操作</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>张三</TableCell>
      <TableCell>28</TableCell>
      <TableCell>北京</TableCell>
      <TableCell>
        <Button size="sm" variant="ghost">编辑</Button>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>李四</TableCell>
      <TableCell>32</TableCell>
      <TableCell>上海</TableCell>
      <TableCell>
        <Button size="sm" variant="ghost">编辑</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

// 带排序
<Table>
  <TableHeader>
    <TableRow>
      <TableCell sortable onSort={handleSort}>姓名</TableCell>
      <TableCell sortable onSort={handleSort}>年龄</TableCell>
      <TableCell>城市</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* 表格内容 */}
  </TableBody>
</Table>

// 带选择
<Table>
  <TableHeader>
    <TableRow>
      <TableCell>
        <Checkbox onChange={handleSelectAll} />
      </TableCell>
      <TableCell>姓名</TableCell>
      <TableCell>邮箱</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>
          <Checkbox checked={selected.includes(item.id)} />
        </TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,

    'List': `import { List, ListItem, ListHeader } from '@xorigo-ui/core'

// 基础列表
<List>
  <ListItem>列表项 1</ListItem>
  <ListItem>列表项 2</ListItem>
  <ListItem>列表项 3</ListItem>
</List>

// 带标题和描述
<List>
  <ListHeader>任务列表</ListHeader>
  <ListItem
    title="完成项目文档"
    description="编写详细的API文档和用户指南"
    meta="今天到期"
  />
  <ListItem
    title="代码审查"
    description="审查团队提交的拉取请求"
    meta="明天到期"
  />
  <ListItem
    title="性能优化"
    description="优化首页加载速度"
    meta="本周到期"
  />
</List>

// 带操作按钮
<List>
  <ListItem
    title="系统更新"
    description="更新到最新版本"
    action={<Button size="sm">更新</Button>}
  />
  <ListItem
    title="数据备份"
    description="创建系统备份"
    action={<Button size="sm" variant="outline">备份</Button>}
  />
</List>

// 不同样式
<List variant="bordered">
  <ListItem>边框列表项</ListItem>
  <ListItem>另一个列表项</ListItem>
</List>`,

    'Accordion': `import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from '@xorigo-ui/core'

// 基础用法
<Accordion>
  <AccordionItem>
    <AccordionHeader>什么是 React？</AccordionHeader>
    <AccordionContent>
      React 是一个用于构建用户界面的 JavaScript 库。
    </AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionHeader>如何使用组件？</AccordionHeader>
    <AccordionContent>
      组件是 React 应用的基本构建块，可以通过函数或类来定义。
    </AccordionContent>
  </AccordionItem>
</Accordion>

// 可多选
<Accordion allowMultiple>
  <AccordionItem>
    <AccordionHeader>可以同时展开多个项目</AccordionHeader>
    <AccordionContent>
      这是一个可以同时展开多个内容的折叠面板。
    </AccordionContent>
  </AccordionItem>
</Accordion>

// 默认展开
<Accordion defaultIndex={[0]}>
  <AccordionItem>
    <AccordionHeader>默认展开的项目</AccordionHeader>
    <AccordionContent>
      这个项目在初始状态下就是展开的。
    </AccordionContent>
  </AccordionItem>
</Accordion>`,

    'Avatar': `import { Avatar, AvatarGroup } from '@xorigo-ui/core'

// 基础头像
<Avatar name="张三" />
<Avatar name="李四" />
<Avatar name="王五" />

// 不同尺寸
<Avatar size="xs" name="小" />
<Avatar size="sm" name="小号" />
<Avatar size="md" name="中号" />
<Avatar size="lg" name="大号" />
<Avatar size="xl" name="超大" />

// 图片头像
<Avatar src="/path/to/image.jpg" alt="用户头像" />
<Avatar src="/path/to/image.jpg" name="备用文本" />

// 头像组
<AvatarGroup>
  <Avatar name="张三" />
  <Avatar name="李四" />
  <Avatar name="王五" />
  <Avatar name="赵六" />
  <Avatar name="+3" /> {/* 超出数量 */}
</AvatarGroup>

// 带状态
<Avatar name="在线" status="online" />
<Avatar name="忙碌" status="busy" />
<Avatar name="离线" status="offline" />`,

    // ===== 布局组件 =====
    'Flex': `import { Flex } from '@xorigo-ui/core'

// 基础用法
<Flex>
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</Flex>

// 不同方向
<Flex direction="column">
  <div>垂直项目 1</div>
  <div>垂直项目 2</div>
</Flex>

// 对齐方式
<Flex justify="center" align="center">
  <div>居中对齐</div>
</Flex>

<Flex justify="space-between">
  <div>左侧项目</div>
  <div>右侧项目</div>
</Flex>

// 响应式
<Flex direction={{ base: 'column', md: 'row' }}>
  <div>移动端垂直，桌面端水平</div>
</Flex>

// 间距
<Flex gap={4}>
  <div>间距 4</div>
  <div>间距 4</div>
</Flex>`,

    'Grid': `import { Grid, GridItem } from '@xorigo-ui/core'

// 基础网格
<Grid columns={3} gap={4}>
  <GridItem>网格项 1</GridItem>
  <GridItem>网格项 2</GridItem>
  <GridItem>网格项 3</GridItem>
  <GridItem>网格项 4</GridItem>
  <GridItem>网格项 5</GridItem>
  <GridItem>网格项 6</GridItem>
</Grid>

// 响应式网格
<Grid
  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
  gap={4}
>
  <GridItem>响应式项 1</GridItem>
  <GridItem>响应式项 2</GridItem>
  <GridItem>响应式项 3</GridItem>
  <GridItem>响应式项 4</GridItem>
</Grid>

// 跨列跨行
<Grid columns={4} gap={4}>
  <GridItem colSpan={2}>跨两列</GridItem>
  <GridItem>常规项</GridItem>
  <GridItem>常规项</GridItem>
  <GridItem rowSpan={2}>跨两行</GridItem>
  <GridItem>常规项</GridItem>
  <GridItem>常规项</GridItem>
</Grid>

// 自动布局
<Grid gap={4}>
  <GridItem>自动调整大小</GridItem>
  <GridItem>自动调整大小</GridItem>
  <GridItem>自动调整大小</GridItem>
</Grid>`,

    // ===== 反馈组件 =====
    'Toast': `import { Toast, useToast } from '@xorigo-ui/core'

// 在组件中使用
function MyComponent() {
  const toast = useToast()

  const showToast = () => {
    toast({
      title: "操作成功",
      description: "数据已成功保存",
      status: "success",
      duration: 3000,
    })
  }

  return <Button onClick={showToast}>显示提示</Button>
}

// 不同类型的提示
toast({ title: "成功", status: "success" })
toast({ title: "错误", status: "error" })
toast({ title: "警告", status: "warning" })
toast({ title: "信息", status: "info" })

// 带操作按钮
toast({
  title: "删除确认",
  description: "确定要删除这个项目吗？",
  status: "warning",
  action: {
    label: "确认",
    onClick: () => handleDelete()
  }
})`,

    'Progress': `import { Progress } from '@xorigo-ui/core'

// 基础进度条
<Progress value={30} />

// 带标签
<Progress
  value={75}
  label="上传进度"
  showValue
/>

// 不同颜色
<Progress value={60} color="primary" />
<Progress value={80} color="success" />
<Progress value={40} color="warning" />
<Progress value={20} color="danger" />

// 不同尺寸
<Progress value={50} size="sm" />
<Progress value={50} size="md" />
<Progress value={50} size="lg" />

// 条纹动画
<Progress
  value={45}
  striped
  animated
/>

// 环形进度条
<Progress
  value={70}
  type="circle"
  size={120}
/>

// 自定义样式
<Progress
  value={85}
  height={8}
  borderRadius={4}
  backgroundColor="#f0f0f0"
  fillColor="#3b82f6"
/>`,

    'Skeleton': `import { Skeleton } from '@xorigo-ui/core'

// 文本骨架
<Skeleton height={20} width="60%" />
<Skeleton height={16} width="40%" />
<Skeleton height={16} width="80%" />

// 圆形骨架
<Skeleton borderRadius="50%" width={40} height={40} />

// 卡片骨架
<div>
  <Skeleton height={20} width={120} mb={3} />
  <Skeleton height={16} width="100%" mb={2} />
  <Skeleton height={16} width="100%" mb={2} />
  <Skeleton height={16} width="60%" />
</div>

// 列表骨架
<Skeleton height={60} mb={2} />
<Skeleton height={60} mb={2} />
<Skeleton height={60} />

// 动画骨架
<Skeleton height={20} animated />
<Skeleton height={16} width="80%" animated />

// 不同变体
<Skeleton variant="text" />
<Skeleton variant="rectangular" />
<Skeleton variant="circular" />`,

    // ===== 复合组件 =====
    'InputGroup': `import { InputGroup, Input, Button } from '@xorigo-ui/core'

// 基础组合
<InputGroup>
  <Input placeholder="搜索内容..." />
  <Button variant="primary">搜索</Button>
</InputGroup>

// 带前后缀
<InputGroup>
  <InputGroup.Addon>https://</InputGroup.Addon>
  <Input placeholder="example.com" />
  <InputGroup.Addon>.com</InputGroup.Addon>
</InputGroup>

// 带图标
<InputGroup>
  <Input leftIcon={<span>👤</span>} placeholder="用户名" />
</InputGroup>

<InputGroup>
  <Input rightIcon={<span>🔍</span>} placeholder="搜索" />
</InputGroup>

// 多个按钮
<InputGroup>
  <Input placeholder="输入内容..." />
  <Button variant="outline">取消</Button>
  <Button variant="primary">确认</Button>
</InputGroup>`,

    'ButtonGroup': `import { ButtonGroup, Button } from '@xorigo-ui/core'

// 基础按钮组
<ButtonGroup>
  <Button variant="outline">左</Button>
  <Button variant="outline">中</Button>
  <Button variant="outline">右</Button>
</ButtonGroup>

// 垂直按钮组
<ButtonGroup orientation="vertical">
  <Button variant="outline">选项 1</Button>
  <Button variant="outline">选项 2</Button>
  <Button variant="outline">选项 3</Button>
</ButtonGroup>

// 附加样式
<ButtonGroup attached>
  <Button variant="primary">主要</Button>
  <Button variant="secondary">次要</Button>
  <Button variant="success">成功</Button>
</ButtonGroup>

// 单选按钮组
<ButtonGroup>
  <Button variant="outline" selected>选中项</Button>
  <Button variant="outline">未选中项</Button>
  <Button variant="outline">未选中项</Button>
</ButtonGroup>`
  }

  return codeExamples[componentName] || `import { ${componentName} } from '@xorigo-ui/core'

// 基础用法
<${componentName} />

// 更多示例请查看文档
// 该组件支持多种配置选项和样式定制`
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
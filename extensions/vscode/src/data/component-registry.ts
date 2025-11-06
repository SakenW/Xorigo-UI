/**
 * 组件注册表
 *
 * 存储所有 Xorigo UI 组件的元数据
 */

export interface ComponentProp {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
}

export interface ComponentMetadata {
  name: string
  category: string
  description: string
  variants: string[]
  sizes: string[]
  props: ComponentProp[]
  usageExample: string
  insertionSnippet: string
}

export class ComponentRegistry {
  private components: Map<string, ComponentMetadata> = new Map()
  private loaded: boolean = false

  /**
   * 加载组件数据
   */
  async loadComponents(): Promise<void> {
    if (this.loaded) {
      return
    }

    // 注册所有组件
    this.registerComponents()
    this.loaded = true
  }

  /**
   * 注册所有组件
   */
  private registerComponents(): void {
    // Input Components
    this.registerComponent({
      name: 'Button',
      category: 'Inputs',
      description: '多功能按钮组件，支持多种变体和尺寸',
      variants: ['primary', 'secondary', 'outline', 'ghost'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'variant', type: 'ButtonVariant', required: false, default: 'primary', description: '按钮变体' },
        { name: 'size', type: 'ButtonSize', required: false, default: 'md', description: '按钮尺寸' },
        { name: 'loading', type: 'boolean', required: false, description: '加载状态' },
        { name: 'disabled', type: 'boolean', required: false, description: '禁用状态' },
        { name: 'onClick', type: 'function', required: false, description: '点击处理函数' },
        { name: 'children', type: 'ReactNode', required: true, description: '按钮内容' }
      ],
      usageExample: `<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>`,
      insertionSnippet: 'Click me'
    })

    this.registerComponent({
      name: 'Input',
      category: 'Inputs',
      description: '多功能输入框组件，支持多种变体和状态',
      variants: ['default', 'filled', 'outlined', 'underlined', 'ghost', 'neon'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'variant', type: 'InputVariant', required: false, default: 'default', description: '输入框变体' },
        { name: 'size', type: 'InputSize', required: false, default: 'md', description: '输入框尺寸' },
        { name: 'status', type: 'InputStatus', required: false, default: 'default', description: '输入框状态' },
        { name: 'error', type: 'string', required: false, description: '错误信息' },
        { name: 'helperText', type: 'string', required: false, description: '帮助文本' },
        { name: 'leftIcon', type: 'ReactNode', required: false, description: '左侧图标' },
        { name: 'rightIcon', type: 'ReactNode', required: false, description: '右侧图标' },
        { name: 'clearable', type: 'boolean', required: false, description: '是否可清空' },
        { name: 'value', type: 'string', required: false, description: '输入值' },
        { name: 'onChange', type: 'function', required: false, description: '值变化处理' },
        { name: 'placeholder', type: 'string', required: false, description: '占位符' }
      ],
      usageExample: `<Input
  label="Email"
  variant="default"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
/>`,
      insertionSnippet: 'Enter your email'
    })

    this.registerComponent({
      name: 'Select',
      category: 'Inputs',
      description: '下拉选择组件，支持单选和多选',
      variants: ['default', 'filled', 'outlined'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'placeholder', type: 'string', required: false, description: '占位符' },
        { name: 'value', type: 'string', required: false, description: '选中值' },
        { name: 'onValueChange', type: 'function', required: false, description: '选择变化处理' },
        { name: 'options', type: 'SelectOption[]', required: false, description: '选项列表' },
        { name: 'multiple', type: 'boolean', required: false, description: '是否多选' },
        { name: 'searchable', type: 'boolean', required: false, description: '是否可搜索' },
        { name: 'clearable', type: 'boolean', required: false, description: '是否可清空' },
        { name: 'disabled', type: 'boolean', required: false, description: '禁用状态' }
      ],
      usageExample: `<Select
  label="Country"
  placeholder="Select a country"
  value={country}
  onValueChange={setCountry}
  options={[
    { label: 'USA', value: 'usa' },
    { label: 'China', value: 'china' }
  ]}
/>`,
      insertionSnippet: 'Select an option'
    })

    this.registerComponent({
      name: 'Textarea',
      category: 'Inputs',
      description: '多行文本输入组件',
      variants: ['default', 'filled', 'outlined', 'underlined'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'variant', type: 'TextareaVariant', required: false, default: 'default', description: '文本域变体' },
        { name: 'size', type: 'TextareaSize', required: false, default: 'md', description: '文本域尺寸' },
        { name: 'rows', type: 'number', required: false, default: '4', description: '行数' },
        { name: 'resize', type: 'ResizeMode', required: false, default: 'vertical', description: '调整大小模式' },
        { name: 'error', type: 'string', required: false, description: '错误信息' },
        { name: 'helperText', type: 'string', required: false, description: '帮助文本' },
        { name: 'value', type: 'string', required: false, description: '输入值' },
        { name: 'onChange', type: 'function', required: false, description: '值变化处理' }
      ],
      usageExample: `<Textarea
  label="Message"
  placeholder="Enter your message"
  rows={4}
  value={message}
  onChange={setMessage}
/>`,
      insertionSnippet: 'Enter your message'
    })

    this.registerComponent({
      name: 'Checkbox',
      category: 'Inputs',
      description: '复选框组件',
      variants: ['default', 'filled'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'description', type: 'string', required: false, description: '描述文本' },
        { name: 'checked', type: 'boolean', required: false, description: '选中状态' },
        { name: 'onCheckedChange', type: 'function', required: false, description: '状态变化处理' },
        { name: 'disabled', type: 'boolean', required: false, description: '禁用状态' },
        { name: 'indeterminate', type: 'boolean', required: false, description: '不确定状态' }
      ],
      usageExample: `<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onCheckedChange={setAgreed}
/>`,
      insertionSnippet: 'Check this box'
    })

    this.registerComponent({
      name: 'RadioGroup',
      category: 'Inputs',
      description: '单选框组组件',
      variants: ['default', 'filled'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'description', type: 'string', required: false, description: '描述文本' },
        { name: 'value', type: 'string', required: false, description: '选中值' },
        { name: 'onValueChange', type: 'function', required: false, description: '选择变化处理' },
        { name: 'orientation', type: 'Orientation', required: false, default: 'vertical', description: '排列方向' },
        { name: 'disabled', type: 'boolean', required: false, description: '禁用状态' }
      ],
      usageExample: `<RadioGroup
  label="Choose an option"
  value={option}
  onValueChange={setOption}
>
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
</RadioGroup>`,
      insertionSnippet: 'Choose option'
    })

    this.registerComponent({
      name: 'Switch',
      category: 'Inputs',
      description: '开关切换组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'description', type: 'string', required: false, description: '描述文本' },
        { name: 'checked', type: 'boolean', required: false, description: '选中状态' },
        { name: 'onCheckedChange', type: 'function', required: false, description: '状态变化处理' },
        { name: 'disabled', type: 'boolean', required: false, description: '禁用状态' }
      ],
      usageExample: `<Switch
  label="Enable notifications"
  checked={enabled}
  onCheckedChange={setEnabled}
/>`,
      insertionSnippet: 'Toggle switch'
    })

    this.registerComponent({
      name: 'Slider',
      category: 'Inputs',
      description: '滑块选择组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'description', type: 'string', required: false, description: '描述文本' },
        { name: 'value', type: 'number[]', required: false, description: '当前值' },
        { name: 'onValueChange', type: 'function', required: false, description: '值变化处理' },
        { name: 'min', type: 'number', required: false, default: '0', description: '最小值' },
        { name: 'max', type: 'number', required: false, default: '100', description: '最大值' },
        { name: 'step', type: 'number', required: false, default: '1', description: '步长' },
        { name: 'orientation', type: 'Orientation', required: false, default: 'horizontal', description: '排列方向' }
      ],
      usageExample: `<Slider
  label="Volume"
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  step={1}
/>`,
      insertionSnippet: 'Adjust slider'
    })

    this.registerComponent({
      name: 'InputNumber',
      category: 'Inputs',
      description: '数字输入框组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'value', type: 'number', required: false, description: '当前值' },
        { name: 'onChange', type: 'function', required: false, description: '值变化处理' },
        { name: 'min', type: 'number', required: false, description: '最小值' },
        { name: 'max', type: 'number', required: false, description: '最大值' },
        { name: 'step', type: 'number', required: false, default: '1', description: '步长' },
        { name: 'precision', type: 'number', required: false, description: '小数位数' },
        { name: 'controls', type: 'boolean', required: false, default: 'true', description: '显示增减按钮' },
        { name: 'addonBefore', type: 'string', required: false, description: '前缀文本' },
        { name: 'addonAfter', type: 'string', required: false, description: '后缀文本' }
      ],
      usageExample: `<InputNumber
  label="Quantity"
  value={quantity}
  onChange={setQuantity}
  min={0}
  max={100}
  step={1}
/>`,
      insertionSnippet: '0'
    })

    this.registerComponent({
      name: 'PasswordInput',
      category: 'Inputs',
      description: '密码输入框组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'value', type: 'string', required: false, description: '输入值' },
        { name: 'onChange', type: 'function', required: false, description: '值变化处理' },
        { name: 'showPassword', type: 'boolean', required: false, description: '是否显示密码' },
        { name: 'onToggleVisibility', type: 'function', required: false, description: '显示/隐藏切换' },
        { name: 'strengthMeter', type: 'boolean', required: false, description: '显示强度指示' },
        { name: 'error', type: 'string', required: false, description: '错误信息' },
        { name: 'helperText', type: 'string', required: false, description: '帮助文本' }
      ],
      usageExample: `<PasswordInput
  label="Password"
  value={password}
  onChange={setPassword}
  showPassword={showPassword}
  onToggleVisibility={setShowPassword}
/>`,
      insertionSnippet: 'Enter your password'
    })

    this.registerComponent({
      name: 'DateTimePicker',
      category: 'Inputs',
      description: '日期时间选择器组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'value', type: 'Date', required: false, description: '当前值' },
        { name: 'onChange', type: 'function', required: false, description: '值变化处理' },
        { name: 'format', type: 'string', required: false, default: 'YYYY-MM-DD', description: '日期格式' },
        { name: 'timeFormat', type: 'string', required: false, default: '24h', description: '时间格式' },
        { name: 'showTime', type: 'boolean', required: false, default: 'false', description: '显示时间' },
        { name: 'showSeconds', type: 'boolean', required: false, default: 'false', description: '显示秒' },
        { name: 'minDate', type: 'Date', required: false, description: '最小日期' },
        { name: 'maxDate', type: 'Date', required: false, description: '最大日期' },
        { name: 'clearable', type: 'boolean', required: false, description: '是否可清空' }
      ],
      usageExample: `<DateTimePicker
  label="Select date"
  value={date}
  onChange={setDate}
  format="YYYY-MM-DD"
/>`,
      insertionSnippet: 'Select date'
    })

    this.registerComponent({
      name: 'ColorPicker',
      category: 'Inputs',
      description: '颜色选择器组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'value', type: 'string', required: false, description: '当前值' },
        { name: 'onChange', type: 'function', required: false, description: '值变化处理' },
        { name: 'format', type: 'string', required: false, default: 'hex', description: '颜色格式' },
        { name: 'swatches', type: 'string[]', required: false, description: '预设颜色' },
        { name: 'alpha', type: 'boolean', required: false, description: '支持透明度' },
        { name: 'gradient', type: 'boolean', required: false, description: '显示渐变' }
      ],
      usageExample: `<ColorPicker
  label="Select color"
  value={color}
  onChange={setColor}
  format="hex"
  swatches={['#000000', '#ffffff', '#ff0000']}
/>`,
      insertionSnippet: 'Select color'
    })

    this.registerComponent({
      name: 'FileUpload',
      category: 'Inputs',
      description: '文件上传组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'accept', type: 'string', required: false, description: '接受的文件类型' },
        { name: 'multiple', type: 'boolean', required: false, description: '是否多选' },
        { name: 'maxSize', type: 'number', required: false, description: '最大文件大小' },
        { name: 'maxFiles', type: 'number', required: false, description: '最大文件数' },
        { name: 'value', type: 'File[]', required: false, description: '当前值' },
        { name: 'onChange', type: 'function', required: false, description: '值变化处理' },
        { name: 'preview', type: 'boolean', required: false, description: '显示预览' },
        { name: 'draggable', type: 'boolean', required: false, description: '支持拖拽' },
        { name: 'uploadUrl', type: 'string', required: false, description: '上传地址' },
        { name: 'autoUpload', type: 'boolean', required: false, description: '自动上传' }
      ],
      usageExample: `<FileUpload
  accept="image/*"
  multiple
  value={files}
  onChange={setFiles}
  draggable
  preview
/>`,
      insertionSnippet: 'Upload files'
    })

    this.registerComponent({
      name: 'UploadButton',
      category: 'Inputs',
      description: '上传按钮组件',
      variants: ['primary', 'secondary', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'variant', type: 'ButtonVariant', required: false, default: 'primary', description: '按钮变体' },
        { name: 'size', type: 'ButtonSize', required: false, default: 'md', description: '按钮尺寸' },
        { name: 'accept', type: 'string', required: false, description: '接受的文件类型' },
        { name: 'multiple', type: 'boolean', required: false, description: '是否多选' },
        { name: 'maxSize', type: 'number', required: false, description: '最大文件大小' },
        { name: 'onUpload', type: 'function', required: false, description: '上传处理' },
        { name: 'uploading', type: 'boolean', required: false, description: '上传中' },
        { name: 'progress', type: 'number', required: false, description: '上传进度' },
        { name: 'showProgress', type: 'boolean', required: false, description: '显示进度' }
      ],
      usageExample: `<UploadButton
  variant="primary"
  accept="image/*"
  onUpload={handleUpload}
  uploading={uploading}
  progress={progress}
  showProgress
>
  Upload File
</UploadButton>`,
      insertionSnippet: 'Upload File'
    })

    // Data Display Components
    this.registerComponent({
      name: 'Card',
      category: 'Data Display',
      description: '卡片容器组件',
      variants: ['default', 'filled', 'outlined'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'variant', type: 'CardVariant', required: false, default: 'default', description: '卡片变体' },
        { name: 'padding', type: 'PaddingSize', required: false, default: 'md', description: '内边距' },
        { name: 'hoverable', type: 'boolean', required: false, description: '悬停效果' },
        { name: 'interactive', type: 'boolean', required: false, description: '交互效果' },
        { name: 'clickable', type: 'boolean', required: false, description: '可点击' },
        { name: 'onClick', type: 'function', required: false, description: '点击处理' }
      ],
      usageExample: `<Card variant="default" padding="md" hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content
  </CardContent>
  <CardFooter>
    Card footer
  </CardFooter>
</Card>`,
      insertionSnippet: 'Card content'
    })

    this.registerComponent({
      name: 'Avatar',
      category: 'Data Display',
      description: '头像组件',
      variants: ['circular', 'rounded', 'square'],
      sizes: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      props: [
        { name: 'src', type: 'string', required: false, description: '头像图片' },
        { name: 'alt', type: 'string', required: false, description: '图片说明' },
        { name: 'name', type: 'string', required: false, description: '名称' },
        { name: 'size', type: 'AvatarSize', required: false, default: 'md', description: '头像尺寸' },
        { name: 'variant', type: 'AvatarVariant', required: false, default: 'circular', description: '头像变体' },
        { name: 'status', type: 'Status', required: false, description: '在线状态' },
        { name: 'grouped', type: 'boolean', required: false, description: '组模式' },
        { name: 'srcset', type: 'string', required: false, description: '高分辨率图片' }
      ],
      usageExample: `<Avatar
  src="https://example.com/avatar.jpg"
  alt="Avatar"
  name="User Name"
  size="md"
  variant="circular"
  status="online"
/>`,
      insertionSnippet: 'Avatar'
    })

    this.registerComponent({
      name: 'Badge',
      category: 'Data Display',
      description: '徽章组件',
      variants: ['solid', 'outline', 'soft', 'ghost'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'variant', type: 'BadgeVariant', required: false, default: 'solid', description: '徽章变体' },
        { name: 'color', type: 'ColorScheme', required: false, default: 'primary', description: '颜色' },
        { name: 'size', type: 'BadgeSize', required: false, default: 'md', description: '徽章尺寸' },
        { name: 'dot', type: 'boolean', required: false, description: '显示圆点' },
        { name: 'pulse', type: 'boolean', required: false, description: '脉冲动画' },
        { name: 'rounded', type: 'boolean', required: false, description: '圆角' }
      ],
      usageExample: `<Badge variant="solid" color="primary">
  Badge
</Badge>`,
      insertionSnippet: 'Badge'
    })

    this.registerComponent({
      name: 'Alert',
      category: 'Feedback',
      description: '警告提示组件',
      variants: ['solid', 'outline', 'soft', 'ghost'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'variant', type: 'AlertVariant', required: false, default: 'outline', description: '警告框变体' },
        { name: 'color', type: 'ColorScheme', required: false, default: 'primary', description: '颜色' },
        { name: 'title', type: 'string', required: false, description: '标题' },
        { name: 'icon', type: 'ReactNode', required: false, description: '图标' },
        { name: 'dismissible', type: 'boolean', required: false, description: '可关闭' },
        { name: 'onDismiss', type: 'function', required: false, description: '关闭处理' }
      ],
      usageExample: `<Alert
  variant="outline"
  color="success"
  title="Success!"
  icon={<CheckCircle />}
>
  Operation completed successfully
</Alert>`,
      insertionSnippet: 'Alert content'
    })

    this.registerComponent({
      name: 'Tabs',
      category: 'Navigation',
      description: '标签页组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'defaultValue', type: 'string', required: false, description: '默认选中值' },
        { name: 'value', type: 'string', required: false, description: '当前值' },
        { name: 'onValueChange', type: 'function', required: false, description: '值变化处理' },
        { name: 'orientation', type: 'Orientation', required: false, default: 'horizontal', description: '排列方向' }
      ],
      usageExample: `<Tabs defaultValue="tab1">
  <TabList>
    <Tab value="tab1">Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
  </TabList>
  <TabContent value="tab1">
    Tab 1 content
  </TabContent>
  <TabContent value="tab2">
    Tab 2 content
  </TabContent>
</Tabs>`,
      insertionSnippet: 'Tab content'
    })

    this.registerComponent({
      name: 'Modal',
      category: 'Overlays',
      description: '模态框组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg', 'xl', 'full'],
      props: [
        { name: 'open', type: 'boolean', required: true, description: '是否打开' },
        { name: 'onOpenChange', type: 'function', required: true, description: '打开状态变化' },
        { name: 'title', type: 'string', required: false, description: '标题' },
        { name: 'description', type: 'string', required: false, description: '描述' },
        { name: 'size', type: 'ModalSize', required: false, default: 'md', description: '模态框尺寸' },
        { name: 'closable', type: 'boolean', required: false, default: 'true', description: '可关闭' },
        { name: 'closeOnOverlayClick', type: 'boolean', required: false, default: 'true', description: '点击遮罩关闭' },
        { name: 'closeOnEscape', type: 'boolean', required: false, default: 'true', description: 'ESC 键关闭' },
        { name: 'centered', type: 'boolean', required: false, description: '居中显示' },
        { name: 'trapFocus', type: 'boolean', required: false, default: 'true', description: '焦点陷阱' }
      ],
      usageExample: `<Modal
  open={open}
  onOpenChange={setOpen}
  title="Modal Title"
  size="md"
>
  Modal content
</Modal>`,
      insertionSnippet: 'Modal content'
    })

    this.registerComponent({
      name: 'Tooltip',
      category: 'Overlays',
      description: '工具提示组件',
      variants: ['default', 'filled', 'outline'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'content', type: 'string', required: true, description: '提示内容' },
        { name: 'side', type: 'Placement', required: false, default: 'top', description: '显示位置' },
        { name: 'align', type: 'Alignment', required: false, default: 'center', description: '对齐方式' },
        { name: 'delayDuration', type: 'number', required: false, default: '0', description: '显示延迟' },
        { name: 'arrow', type: 'boolean', required: false, default: 'true', description: '显示箭头' }
      ],
      usageExample: `<Tooltip
  content="Tooltip content"
  side="top"
  delayDuration={0}
  arrow
>
  <Button>Hover me</Button>
</Tooltip>`,
      insertionSnippet: 'Tooltip content'
    })

    this.registerComponent({
      name: 'Skeleton',
      category: 'Feedback',
      description: '骨架屏组件',
      variants: ['text', 'circular', 'rectangular'],
      sizes: ['sm', 'md', 'lg'],
      props: [
        { name: 'width', type: 'string', required: false, default: '100%', description: '宽度' },
        { name: 'height', type: 'string', required: false, default: '1rem', description: '高度' },
        { name: 'variant', type: 'SkeletonVariant', required: false, default: 'text', description: '骨架屏变体' },
        { name: 'count', type: 'number', required: false, description: '数量' },
        { name: 'rows', type: 'number', required: false, description: '行数' },
        { name: 'gap', type: 'string', required: false, default: '0.5rem', description: '间距' },
        { name: 'animate', type: 'boolean', required: false, default: 'true', description: '动画' }
      ],
      usageExample: `<Skeleton width="100%" height="1rem" variant="text" count={3} />`,
      insertionSnippet: 'Loading...'
    })

    this.registerComponent({
      name: 'Spinner',
      category: 'Feedback',
      description: '加载动画组件',
      variants: ['default', 'dots', 'pulse'],
      sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
      props: [
        { name: 'size', type: 'SpinnerSize', required: false, default: 'md', description: '尺寸' },
        { name: 'color', type: 'ColorScheme', required: false, default: 'primary', description: '颜色' },
        { name: 'speed', type: 'Speed', required: false, default: 'normal', description: '速度' },
        { name: 'thickness', type: 'number', required: false, default: '4', description: '线条粗细' },
        { name: 'label', type: 'string', required: false, description: '加载文本' }
      ],
      usageExample: `<Spinner size="md" color="primary" label="Loading..." />`,
      insertionSnippet: 'Loading...'
    })

    this.registerComponent({
      name: 'Icon',
      category: 'Media',
      description: '图标组件',
      variants: ['outline', 'filled', 'duotone'],
      sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
      props: [
        { name: 'name', type: 'IconName', required: true, description: '图标名称' },
        { name: 'size', type: 'IconSize', required: false, default: 'md', description: '图标尺寸' },
        { name: 'color', type: 'ColorScheme', required: false, default: 'default', description: '图标颜色' },
        { name: 'variant', type: 'IconVariant', required: false, default: 'outline', description: '图标变体' },
        { name: 'strokeWidth', type: 'number', required: false, default: '1.5', description: '线条粗细' },
        { name: 'mirror', type: 'boolean', required: false, description: '水平镜像' },
        { name: 'flip', type: 'string', required: false, description: '翻转方向' },
        { name: 'rotate', type: 'number', required: false, description: '旋转角度' }
      ],
      usageExample: `<Icon name="plus" size="md" color="primary" />`,
      insertionSnippet: 'Icon'
    })
  }

  /**
   * 注册单个组件
   */
  private registerComponent(component: ComponentMetadata): void {
    this.components.set(component.name, component)
  }

  /**
   * 获取所有组件
   */
  getAllComponents(): ComponentMetadata[] {
    return Array.from(this.components.values())
  }

  /**
   * 根据名称获取组件
   */
  getComponent(name: string): ComponentMetadata | undefined {
    return this.components.get(name)
  }

  /**
   * 根据分类获取组件
   */
  getComponentsByCategory(category: string): ComponentMetadata[] {
    return Array.from(this.components.values()).filter(
      (component) => component.category === category
    )
  }

  /**
   * 搜索组件
   */
  searchComponents(query: string): ComponentMetadata[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.components.values()).filter(
      (component) =>
        component.name.toLowerCase().includes(lowerQuery) ||
        component.description.toLowerCase().includes(lowerQuery) ||
        component.category.toLowerCase().includes(lowerQuery)
    )
  }
}

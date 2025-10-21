import React from 'react'

// 标准变体定义
export interface ComponentVariants {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  colorScheme?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'pink' | 'orange'
}

// 标准尺寸配置
export const sizeClasses: Record<NonNullable<ComponentVariants['size']>, string> = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
  xl: 'text-xl px-8 py-4'
}

// 标准变体配置
export const variantClasses: Record<NonNullable<ComponentVariants['variant']>, string> = {
  default: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600',
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  info: 'bg-blue-500 text-white hover:bg-blue-600',
  outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
}

// 标准基础 Props
export interface BaseComponentProps {
  /**
   * 自定义样式类名
   */
  className?: string
  /**
   * 组件 ID
   */
  id?: string
  /**
   * 测试 ID，用于测试
   */
  testId?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 加载状态
   */
  loading?: boolean
  /**
   * 额外的 HTML 属性
   */
  [key: string]: any
}

// 标准布局 Props
export interface LayoutProps extends BaseComponentProps {
  /**
   * 子元素
   */
  children: React.ReactNode
}

// 标准事件处理 Props
export interface EventHandlers {
  onClick?: (event: React.MouseEvent) => void
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
  onChange?: (event: React.ChangeEvent) => void
  onSubmit?: (event: React.FormEvent) => void
  onMouseEnter?: (event: React.MouseEvent) => void
  onMouseLeave?: (event: React.MouseEvent) => void
  onKeyPress?: (event: React.KeyboardEvent) => void
}

// 表单组件 Props
export interface FormComponentProps extends BaseComponentProps {
  /**
   * 表单名称
   */
  name?: string
  /**
   * 是否必填
   */
  required?: boolean
  /**
   * 只读状态
   */
  readOnly?: boolean
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 值
   */
  value?: string | number | readonly string[]
  /**
   * 默认值
   */
  defaultValue?: string | number | readonly string[]
  /**
   * 错误状态
   */
  error?: boolean | string
  /**
   * 帮助文本
   */
  helperText?: string
  /**
   * 标签文本
   */
  label?: string
  /**
   * 自动完成
   */
  autoComplete?: string
}

// 按钮组件标准 Props
export interface ButtonProps extends BaseComponentProps, EventHandlers {
  /**
   * 按钮变体
   */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline-solid' | 'ghost' | 'link'
  /**
   * 按钮尺寸
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * 按钮类型
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * 是否全宽
   */
  fullWidth?: boolean
  /**
   * 图标
   */
  icon?: React.ReactNode
  /**
   * 图标位置
   */
  iconPosition?: 'left' | 'right'
  /**
   * 是否为加载状态
   */
  loading?: boolean
  /**
   * 是否为禁用状态
   */
  disabled?: boolean
  /**
   * 子元素
   */
  children?: React.ReactNode
  /**
   * 按钮形状
   */
  shape?: 'default' | 'circle' | 'round'
}

// 输入组件标准 Props
export interface InputProps extends FormComponentProps, EventHandlers {
  /**
   * 输入类型
   */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  /**
   * 最大长度
   */
  maxLength?: number
  /**
   * 最小长度
   */
  minLength?: number
  /**
   * 输入框前缀
   */
  prefix?: React.ReactNode
  /**
   * 输入框后缀
   */
  suffix?: React.ReactNode
  /**
   * 是否自动聚焦
   */
  autoFocus?: boolean
  /**
   * 是否允许清除
   */
  allowClear?: boolean
}

// 选择组件标准 Props
export interface SelectProps extends FormComponentProps {
  /**
   * 选项列表
   */
  options: Array<{
    value: string | number
    label: string
    disabled?: boolean
    group?: string
  }>
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 是否多选
   */
  multiple?: boolean
  /**
   * 是否可搜索
   */
  searchable?: boolean
  /**
   * 是否可清除
   */
  clearable?: boolean
  /**
   * 最大选择数量
   */
  maxCount?: number
}

// 模态框组件标准 Props
export interface ModalProps extends BaseComponentProps {
  /**
   * 是否显示
   */
  open: boolean
  /**
   * 标题
   */
  title?: React.ReactNode
  /**
   * 子元素
   */
  children: React.ReactNode
  /**
   * 底部内容
   */
  footer?: React.ReactNode
  /**
   * 宽度
   */
  width?: string | number
  /**
   * 是否显示关闭按钮
   */
  closable?: boolean
  /**
   * 点击遮罩是否关闭
   */
  maskClosable?: boolean
  /**
   * 关闭回调
   */
  onClose?: () => void
  /**
   * 确认回调
   */
  onOk?: () => void
  /**
   * 取消回调
   */
  onCancel?: () => void
  /**
   * 确认按钮文本
   */
  okText?: string
  /**
   * 取消按钮文本
   */
  cancelText?: string
  /**
   * 确认按钮加载状态
   */
  okButtonProps?: ButtonProps
  /**
   * 取消按钮属性
   */
  cancelButtonProps?: ButtonProps
  /**
   * 是否居中
   */
  centered?: boolean
}

// 表格组件标准 Props
export interface TableColumnProps<T = any> {
  /**
   * 列标题
   */
  title: React.ReactNode
  /**
   * 数据键
   */
  dataIndex: string
  /**
   * 自定义渲染
   */
  render?: (value: any, record: T, index: number) => React.ReactNode
  /**
   * 列宽
   */
  width?: string | number
  /**
   * 固定位置
   */
  fixed?: 'left' | 'right'
  /**
   * 排序
   */
  sorter?: (a: T, b: T) => number
  /**
   * 过滤
   */
  filters?: Array<{ text: string; value: any }>
  /**
   * 对齐方式
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 是否显示
   */
  hidden?: boolean
}

export interface TableProps<T = any> extends BaseComponentProps {
  /**
   * 数据源
   */
  dataSource: T[]
  /**
   * 列配置
   */
  columns: TableColumnProps<T>[]
  /**
   * 是否显示边框
   */
  bordered?: boolean
  /**
   * 是否显示表头
   */
  showHeader?: boolean
  /**
   * 是否显示行选择
   */
  rowSelection?: {
    selectedRowKeys: React.Key[]
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
    getCheckboxProps?: (record: T) => any
  }
  /**
   * 是否显示分页
   */
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
    showSizeChanger?: boolean
    showQuickJumper?: boolean
  }
  /**
   * 加载状态
   */
  loading?: boolean
  /**
   * 是否显示斑马纹
   */
  striped?: boolean
  /**
   * 是否悬停高亮
   */
  hoverable?: boolean
  /**
   * 空数据时的文本
   */
  emptyText?: React.ReactNode
  /**
   * 行类名
   */
  rowClassName?: (record: T, index: number) => string
}

// 导航组件标准 Props
export interface NavigationItem {
  /**
   * 标签
   */
  label: React.ReactNode
  /**
   * 键值
   */
  key: string
  /**
   * 子菜单
   */
  children?: NavigationItem[]
  /**
   * 图标
   */
  icon?: React.ReactNode
  /**
   * 链接
   */
  href?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否激活
   */
  active?: boolean
}

export interface NavigationProps extends BaseComponentProps {
  /**
   * 导航项
   */
  items: NavigationItem[]
  /**
   * 模式
   */
  mode?: 'horizontal' | 'vertical'
  /**
   * 当前选中项
   */
  selectedKey?: string
  /**
   * 默认选中项
   */
  defaultSelectedKey?: string
  /**
   * 选中回调
   */
  onSelect?: (key: string) => void
  /**
   * 子菜单展开回调
   */
  onExpand?: (key: string) => void
}

// 动画组件标准 Props
export interface AnimationProps {
  /**
   * 动画类型
   */
  animation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'spin'
  /**
   * 动画持续时间
   */
  duration?: number
  /**
   * 延迟时间
   */
  delay?: number
  /**
   * 缓动函数
   */
  easing?: string
  /**
   * 是否循环
   */
  loop?: boolean
  /**
   * 是否自动播放
   */
  autoplay?: boolean
}

// 复合组件类型定义
export interface CompoundComponent<T> extends React.FC<T> {
  /**
   * 子组件
   */
  [key: string]: any
}

// 主题相关 Props
export interface ThemeProps {
  /**
   * 主题模式
   */
  theme?: 'light' | 'dark' | 'system'
  /**
   * 颜色主题
   */
  colorScheme?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'pink' | 'orange'
}

// 响应式 Props
export interface ResponsiveProps {
  /**
   * 响应式断点
   */
  responsive?: {
    xs?: any
    sm?: any
    md?: any
    lg?: any
    xl?: any
    '2xl'?: any
  }
}

// 可访问性 Props
export interface AccessibilityProps {
  /**
   * ARIA 标签
   */
  'aria-label'?: string
  /**
   * ARIA 描述
   */
  'aria-describedby'?: string
  /**
   * 角色
   */
  role?: string
  /**
   * Tab 键索引
   */
  tabIndex?: number
  /**
   * 标题
   */
  title?: string
}
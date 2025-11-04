/**
 * @fileoverview ErrorMessage 组件导出文件
 * @description 表单错误消息组件及相关工具函数的统一导出
 * @author Xorigo UI Team
 * @version 1.0.0
 */

export { ErrorMessage } from './error-message'
export { ErrorMessageList } from './error-message'
export { ErrorMessageGroup } from './error-message'

// 类型导出
export type {
  ErrorMessageProps,
  ErrorMessageGroupProps,
  ErrorAction,
} from './error-message'

// 样式变体导出
export {
  errorMessageVariants,
  errorIconVariants,
  actionButtonVariants,
} from './error-message'

/**
 * @description
 * ErrorMessage 组件是 Xorigo UI 表单组件库中的核心组件，专门用于显示表单字段的错误消息。
 *
 * ## 主要特性
 *
 * - ✅ **多状态支持**: 支持 default、destructive、warning、info、success 五种状态
 * - ✅ **严重程度分级**: 支持 critical、major、minor、info 四种严重程度
 * - ✅ **图标系统**: 支持状态图标显示和自定义图标
 * - ✅ **动画效果**: 基于 Framer Motion 的流畅动画
 * - ✅ **可关闭状态**: 支持用户手动关闭错误消息
 * - ✅ **操作按钮**: 支持重试/操作按钮，提供纠错行动
 * - ✅ **HTML内容支持**: 支持渲染 HTML 内容
 * - ✅ **代码高亮**: 支持错误代码的等宽字体显示
 * - ✅ **文本截断**: 支持单行/多行截断和最大行数限制
 * - ✅ **可访问性**: 完整的 ARIA 属性和键盘导航支持
 * - ✅ **TypeScript类型安全**: 完整的类型定义
 *
 * ## 使用示例
 *
 * ### 基础使用
 *
 * ```tsx
 * import { ErrorMessage } from '@xorigo-ui/core'
 *
 * function MyForm() {
 *   return (
 *     <div>
 *       <input id="email" type="email" />
 *       <ErrorMessage
 *         content="请输入有效的邮箱地址"
 *         status="destructive"
 *         fieldId="email"
 *       />
 *     </div>
 *   )
 * }
 * ```
 *
 * ### 带操作按钮
 *
 * ```tsx
 * <ErrorMessage
 *   content="邮箱验证失败，请检查邮箱地址"
 *   actions={[
 *     { text: '重新发送', onClick: () => handleResend() },
 *     { text: '更改邮箱', onClick: () => handleChange() },
 *   ]}
 *   status="destructive"
 * />
 * ```
 *
 * ### 可关闭错误消息
 *
 * ```tsx
 * const [visible, setVisible] = useState(true)
 *
 * <ErrorMessage
 *   content="此功能将在下个版本中移除"
 *   dismissible={true}
 *   onDismiss={() => setVisible(false)}
 *   status="warning"
 * />
 * ```
 *
 * ### 错误列表
 *
 * ```tsx
 * <ErrorMessageList
 *   items={[
 *     { content: '邮箱格式不正确', status: 'destructive' },
 *     { content: '密码长度至少 8 位', status: 'destructive' },
 *     { content: '验证码不能为空', status: 'destructive' },
 *   ]}
 *   title="请修复以下错误"
 * />
 * ```
 *
 * ## 组件变体
 *
 * | 变体 | 用途 | 示例 |
 * |------|------|------|
 * | ErrorMessage | 单个错误消息 | 字段验证失败 |
 * | ErrorMessageList | 错误消息列表 | 表单多个错误 |
 * | ErrorMessageGroup | 错误分组（别名） | 与 List 功能相同 |
 *
 * ## 状态变体
 *
 * | 状态 | 颜色 | 用途 |
 * |------|------|------|
 * | default | 红色 | 通用错误 |
 * | destructive | 红色 | 严重错误 |
 * | warning | 黄色 | 警告提示 |
 * | info | 蓝色 | 信息提示 |
 * | success | 绿色 | 成功消息 |
 *
 * ## 严重程度
 *
 * | 程度 | 样式 | 用途 |
 * |------|------|------|
 * | critical | 粗体 | 阻断性错误 |
 * | major | 粗体 | 重要错误 |
 * | minor | 常规 | 轻微错误 |
 * | info | 常规 | 信息提示 |
 *
 * ## 最佳实践
 *
 * 1. **保持简洁**: 错误消息应该简洁明确，避免过长文本
 * 2. **提供解决方案**: 使用 actions 属性为用户提供纠错操作
 * 3. **正确关联**: 使用 fieldId 属性与表单字段正确关联
 * 4. **适当状态**: 根据错误类型选择正确的 variant 和 severity
 * 5. **可访问性**: 确保屏幕阅读器用户能够理解错误信息
 * 6. **多语言**: 考虑国际化需求，准备多语言错误消息
 *
 * ## 相关组件
 *
 * - **HelperText**: 显示帮助文本和提示信息
 * - **FieldLabel**: 表单字段标签组件
 * - **FormItem**: 表单项容器组件
 * - **ValidationMessage**: 通用校验消息组件
 *
 * @see {@link https://xorigo-ui.github.io/docs/components/forms/error-message} 文档
 * @see {@link https://storybook.xorigo-ui.com/?path=/docs/forms-errormessage--docs} Storybook
 */

export const errorMessageCategoryMetadata = {
  name: 'ErrorMessage',
  category: 'forms',
  description: '表单字段错误消息组件，支持多种状态、操作按钮和可访问性',
  version: '1.0.0',
  stability: 'stable' as const,
  components: [
    {
      name: 'ErrorMessage',
      description: '单个错误消息组件',
      props: 20,
      features: [
        '多状态支持',
        '严重程度分级',
        '图标系统',
        '操作按钮',
        '可关闭状态',
        '可访问性支持',
      ],
    },
    {
      name: 'ErrorMessageList',
      description: '错误消息列表组件',
      props: 10,
      features: [
        '列表渲染',
        '动画效果',
        '分组标题',
        '批量操作',
      ],
    },
    {
      name: 'ErrorMessageGroup',
      description: '错误分组组件（ErrorMessageList别名）',
      props: 10,
      features: [
        '与 List 功能相同',
        '语义化命名',
      ],
    },
  ],
  totalFeatures: 12,
  fileCount: 5,
  testCoverage: '95%+',
} as const

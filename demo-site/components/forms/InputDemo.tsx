import React, { useState } from "react"
import { Input } from "../../../src/components/ui/Input"
import { PasswordInput } from "../../../src/components/ui/PasswordInput"
import { SearchInput } from "../../../src/components/ui/SearchInput"
import { InputNumber } from "../../../src/components/ui/InputNumber"
import { Card } from "../../../src/components/ui/Card"
import { Mail, User, DollarSign, Globe } from "lucide-react"

export default function InputDemo() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remarks, setRemarks] = useState('')
  const [website, setWebsite] = useState('')
  const [price, setPrice] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [weight, setWeight] = useState('0')

  const handleSearch = (value: string) => {
    console.log('搜索:', value)
    alert(`搜索: ${value}`)
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          📝 表单组件 - 输入框增强版
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          全新增强的输入框组件，包含图标、前缀/后缀、清除按钮、状态提示等丰富功能
        </p>
      </section>

      {/* 基础功能 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          基础输入框
        </h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="用户名"
            placeholder="请输入用户名"
            variant="default"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="邮箱"
            type="email"
            variant="outlined"
            floatingLabel
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="备注"
            placeholder="最多100字"
            maxLength={100}
            showCharCount
            error="这是一个错误提示示例"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </Card>

      {/* 图标和清除按钮 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          图标和清除按钮
        </h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="邮箱地址"
            placeholder="your@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            clearable
            helperText="带左侧图标和清除按钮"
          />
          <Input
            label="用户名"
            placeholder="输入用户名"
            leftIcon={<User className="w-4 h-4" />}
            rightIcon={<span className="text-xs text-gray-400">可用</span>}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText="左侧图标 + 右侧自定义内容"
          />
          <Input
            label="清除测试"
            placeholder="输入内容测试清除功能"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            clearable
            onClear={() => console.log('已清除')}
            helperText="输入内容后会显示清除按钮"
          />
        </div>
      </Card>

      {/* 前缀和后缀 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          前缀和后缀文本
        </h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="价格"
            placeholder="0.00"
            prefix="$"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            helperText="货币符号前缀"
          />
          <Input
            label="网站地址"
            placeholder="yoursite"
            prefix="https://"
            suffix=".com"
            leftIcon={<Globe className="w-4 h-4" />}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            clearable
            helperText="URL 前缀和后缀"
          />
          <Input
            label="重量"
            placeholder="0"
            suffix="kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            helperText="单位后缀"
          />
        </div>
      </Card>

      {/* 状态提示 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          状态提示
        </h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="成功状态"
            placeholder="输入正确"
            status="success"
            value="输入正确的内容"
            helperText="验证通过"
          />
          <Input
            label="警告状态"
            placeholder="需要注意"
            status="warning"
            value="可能有问题的内容"
            helperText="请检查输入内容"
          />
          <Input
            label="错误状态"
            placeholder="输入错误"
            status="error"
            value="错误的内容"
            error="这个字段是必填的"
          />
        </div>
      </Card>

      {/* 密码输入框 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          密码输入框 (PasswordInput)
        </h3>
        <div className="space-y-4 max-w-md">
          <PasswordInput
            label="密码"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="点击眼睛图标显示/隐藏密码"
          />
          <PasswordInput
            label="带强度提示的密码"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showStrength
          />
        </div>
      </Card>

      {/* 搜索输入框 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          搜索输入框 (SearchInput)
        </h3>
        <div className="space-y-4 max-w-md">
          <SearchInput
            label="简单搜索"
            placeholder="输入关键词搜索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            helperText="按回车键搜索"
          />
          <SearchInput
            label="带按钮的搜索"
            placeholder="输入关键词"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            showSearchButton
            searchButtonText="搜索"
            helperText="点击按钮或按回车搜索"
          />
        </div>
      </Card>

      {/* 数字输入框 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          数字输入框 (InputNumber)
        </h3>
        <div className="space-y-4 max-w-md">
          <InputNumber
            label="数量"
            placeholder="0"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            helperText="最小 1，最大 100，使用上下键或按钮调整"
          />
          <InputNumber
            label="价格"
            placeholder="0.00"
            min={0}
            step={0.01}
            precision={2}
            prefix="$"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            helperText="支持小数，步长 0.01"
          />
          <InputNumber
            label="重量"
            placeholder="0"
            min={0}
            max={1000}
            step={5}
            suffix="kg"
            leftIcon={<DollarSign className="w-4 h-4" />}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            helperText="步长 5kg，最大 1000kg"
          />
        </div>
      </Card>

      {/* 变体演示 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          输入框变体
        </h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="默认变体"
            placeholder="default"
            variant="default"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="填充变体"
            placeholder="filled"
            variant="filled"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="描边变体"
            placeholder="outlined"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="下划线变体"
            placeholder="underlined"
            variant="underlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="幽灵变体"
            placeholder="ghost"
            variant="ghost"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="霓虹变体"
            placeholder="neon"
            variant="neon"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </Card>

      {/* 尺寸演示 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          输入框尺寸
        </h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="小尺寸"
            placeholder="Small"
            inputSize="sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="中等尺寸"
            placeholder="Medium (默认)"
            inputSize="md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="大尺寸"
            placeholder="Large"
            inputSize="lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </Card>

      {/* 禁用状态 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          禁用状态
        </h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="禁用的输入框"
            placeholder="不可编辑"
            value="禁用状态"
            disabled
          />
          <SearchInput
            label="禁用的搜索框"
            placeholder="不可搜索"
            disabled
          />
          <InputNumber
            label="禁用的数字输入"
            value="100"
            disabled
          />
        </div>
      </Card>
    </div>
  )
}

import React, { useState } from "react"
import { Input } from "../../../src/components/ui/Input"
import { Card } from "../../../src/components/ui/Card"

export default function InputDemo() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remarks, setRemarks] = useState('')

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📝 表单组件 - 输入框</h2>
      <Card>
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
            label="密码"
            type="password"
            placeholder="请输入密码"
            variant="filled"
            showPasswordToggle
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
    </section>
  )
}

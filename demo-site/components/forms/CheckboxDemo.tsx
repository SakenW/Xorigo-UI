import React, { useState } from 'react'
import { Checkbox } from '../../../src/components/Checkbox'
import { Card } from '../../../src/components/Card'

export default function CheckboxDemo() {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [checked3, setChecked3] = useState(false)

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📝 表单组件 - 复选框</h2>
      <Card>
        <div className="space-y-6">
          {/* 基础复选框 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">基础样式</h3>
            <div className="space-y-3">
              <Checkbox
                label="默认复选框"
                checked={checked1}
                onChange={(e) => setChecked1(e.target.checked)}
              />
              <Checkbox
                label="预选中状态"
                checked={checked2}
                onChange={(e) => setChecked2(e.target.checked)}
              />
              <Checkbox label="禁用状态" disabled />
              <Checkbox label="禁用并选中" disabled checked />
            </div>
          </div>

          {/* 不同尺寸 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">尺寸变体</h3>
            <div className="space-y-3">
              <Checkbox checkboxSize="sm" label="小尺寸复选框" />
              <Checkbox checkboxSize="md" label="中尺寸复选框 (默认)" />
              <Checkbox checkboxSize="lg" label="大尺寸复选框" />
            </div>
          </div>

          {/* 不同变体 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">样式变体</h3>
            <div className="space-y-3">
              <Checkbox variant="default" label="默认样式" />
              <Checkbox variant="filled" label="填充样式" />
              <Checkbox variant="outlined" label="描边样式" />
            </div>
          </div>

          {/* 带帮助文本和错误 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">帮助文本与错误</h3>
            <div className="space-y-3">
              <Checkbox
                label="带帮助文本"
                helperText="这是一段帮助文本，用于解释复选框的用途"
              />
              <Checkbox
                label="必填项"
                required
                helperText="此项为必填"
              />
              <Checkbox
                label="带错误提示"
                error="您必须同意此条款才能继续"
                checked={checked3}
                onChange={(e) => setChecked3(e.target.checked)}
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

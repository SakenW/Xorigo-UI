'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@th-ui/core'
import { Button } from '@th-ui/core'
import { Badge } from '@th-ui/core'
import {
  validateMatrix,
  calculateContrastRatio,
  simulateCVD,
  validateContrast,
  validateReadability,
  generateMarkdownReport,
  generateJSONReport,
  DEFAULT_MATRIX_CONFIG,
  STRICT_MATRIX_CONFIG,
  type MatrixConfig,
  type ValidationResult,
  type ValidationIssue,
} from '@th-ui/core'

// 示例测试数据
const exampleTestData = {
  recipeName: 'TH-UI 默认主题',
  colors: {
    'text-primary': '#000000',
    'text-secondary': '#666666',
    'surface-primary': '#FFFFFF',
    'surface-secondary': '#F5F5F5',
    'color-primary': '#3B82F6',
    'color-secondary': '#10B981',
    'color-error': '#EF4444',
    'color-warning': '#F59E0B',
    'success': '#10B981',
    'error': '#EF4444',
    'warning': '#F59E0B',
    'info': '#3B82F6',
  },
  textStyles: [
    { fontSize: 16, lineHeight: 1.5, letterSpacing: 0, lineLength: 70 },
    { fontSize: 14, lineHeight: 1.4, letterSpacing: 0, lineLength: 80 },
    { fontSize: 12, lineHeight: 1.3, letterSpacing: -0.1, lineLength: 90 },
  ],
  focusStyles: [
    {
      outlineColor: '#3B82F6',
      outlineWidth: 2,
      outlineOffset: 2,
      outlineStyle: 'solid',
      backgroundColor: '#FFFFFF',
    },
  ],
  elements: [
    {
      type: 'button',
      aria: { role: 'button', ariaLabel: '示例按钮' },
      hasTextContent: true,
    },
    {
      type: 'custom',
      aria: { role: 'button', ariaLabel: '自定义按钮', tabIndex: 0 },
    },
  ],
}

// 对比度测试颜色对
const contrastTestPairs = [
  { foreground: '#000000', background: '#FFFFFF', label: '黑白对比' },
  { foreground: '#3B82F6', background: '#FFFFFF', label: '蓝色主调' },
  { foreground: '#FFFFFF', background: '#3B82F6', label: '白字蓝底' },
  { foreground: '#666666', background: '#F5F5F5', label: '灰色组合' },
  { foreground: '#10B981', background: '#FFFFFF', label: '绿色强调' },
  { foreground: '#FFFFFF', background: '#10B981', label: '白字绿底' },
]

export function MatrixPage() {
  const [selectedConfig, setSelectedConfig] = useState<'AA' | 'AAA'>('AA')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'contrast' | 'cvd' | 'readability' | 'report'>('overview')

  const currentConfig = selectedConfig === 'AA' ? DEFAULT_MATRIX_CONFIG : STRICT_MATRIX_CONFIG

  const runValidation = useCallback(async () => {
    setIsRunning(true)
    try {
      const result = validateMatrix(exampleTestData, currentConfig)
      setValidationResult(result)
    } catch (error) {
      console.error('Matrix验证失败:', error)
    } finally {
      setIsRunning(false)
    }
  }, [currentConfig])

  const downloadReport = useCallback((format: 'markdown' | 'json') => {
    if (!validationResult) return

    const report = format === 'markdown'
      ? generateMarkdownReport(validationResult)
      : JSON.stringify(generateJSONReport(validationResult), null, 2)

    const blob = new Blob([report], {
      type: format === 'markdown' ? 'text/markdown' : 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `matrix-report-${validationResult.recipeName}-${Date.now()}.${format === 'markdown' ? 'md' : 'json'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [validationResult])

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Matrix 可访问性验证</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          基于 WCAG 2.1 标准的综合性可访问性验证系统，确保 TH-UI 组件库符合国际可访问性标准
        </p>
      </div>

      {/* 控制面板 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>验证配置</span>
            <Badge variant={selectedConfig === 'AA' ? 'secondary' : 'outline'}>
              WCAG {selectedConfig}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={selectedConfig === 'AA' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedConfig('AA')}
              >
                AA 标准
              </Button>
              <Button
                variant={selectedConfig === 'AAA' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedConfig('AAA')}
              >
                AAA 标准
              </Button>
            </div>
            <Button
              onClick={runValidation}
              disabled={isRunning}
              className="ml-auto"
            >
              {isRunning ? '验证中...' : '开始验证'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 验证结果概览 */}
      {validationResult && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${validationResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {validationResult.passed ? '✅ 通过' : '❌ 失败'}
                </div>
                <p className="text-sm text-muted-foreground">总体状态</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {validationResult.issues.filter(i => i.severity === 'error').length}
                </div>
                <p className="text-sm text-muted-foreground">错误</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {validationResult.issues.filter(i => i.severity === 'warning').length}
                </div>
                <p className="text-sm text-muted-foreground">警告</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {validationResult.issues.filter(i => i.severity === 'info').length}
                </div>
                <p className="text-sm text-muted-foreground">信息</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 标签页导航 */}
      {validationResult && (
        <Card>
          <CardContent className="p-0">
            <div className="border-b">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {[
                  { id: 'overview', label: '概览' },
                  { id: 'contrast', label: '对比度' },
                  { id: 'cvd', label: '色盲模拟' },
                  { id: 'readability', label: '可读性' },
                  { id: 'report', label: '报告' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* 概览标签页 */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">验证概览</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">测试项目</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• 颜色对比度验证</li>
                        <li>• 色盲可区分性检查</li>
                        <li>• 文本可读性评估</li>
                        <li>• 焦点状态验证</li>
                        <li>• 键盘导航检查</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">配置详情</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">标准:</span> WCAG {currentConfig.strictness}</p>
                        <p><span className="text-muted-foreground">正常文本:</span> {currentConfig.contrast.normalTextAA}:1</p>
                        <p><span className="text-muted-foreground">大文本:</span> {currentConfig.contrast.largeTextAA}:1</p>
                        <p><span className="text-muted-foreground">UI组件:</span> {currentConfig.contrast.uiComponent}:1</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 对比度标签页 */}
              {activeTab === 'contrast' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">对比度测试</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contrastTestPairs.map((pair, index) => {
                      const ratio = calculateContrastRatio(pair.foreground, pair.background)
                      const validation = validateContrast(
                        pair.foreground,
                        pair.background,
                        'normal',
                        currentConfig
                      )
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{pair.label}</span>
                            <Badge variant={validation.passed ? 'secondary' : 'destructive'}>
                              {ratio.toFixed(2)}:1
                            </Badge>
                          </div>
                          <div
                            className="h-12 rounded flex items-center justify-center font-medium"
                            style={{
                              backgroundColor: pair.background,
                              color: pair.foreground
                            }}
                          >
                            示例文本
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            要求: {validation.requiredRatio}:1 - {validation.passed ? '✅ 通过' : '❌ 失败'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 色盲模拟标签页 */}
              {activeTab === 'cvd' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">色盲模拟测试</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'].map((cvdType) => {
                      const originalColor = '#3B82F6'
                      const simulatedColor = simulateCVD(originalColor, cvdType as any)
                      return (
                        <div key={cvdType} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2 capitalize">
                            {cvdType === 'protanopia' && '红色盲'}
                            {cvdType === 'deuteranopia' && '绿色盲'}
                            {cvdType === 'tritanopia' && '蓝色盲'}
                            {cvdType === 'achromatopsia' && '全色盲'}
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground">原始</p>
                              <div
                                className="h-8 rounded border"
                                style={{ backgroundColor: originalColor }}
                              />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">模拟</p>
                              <div
                                className="h-8 rounded border"
                                style={{ backgroundColor: simulatedColor }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 可读性标签页 */}
              {activeTab === 'readability' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">文本可读性测试</h3>
                  <div className="space-y-4">
                    {exampleTestData.textStyles.map((style, index) => {
                      const validation = validateReadability(style, currentConfig)
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">文本样式 {index + 1}</span>
                            <Badge variant={validation.length === 0 ? 'secondary' : 'destructive'}>
                              {validation.length === 0 ? '通过' : `${validation.length} 个问题`}
                            </Badge>
                          </div>
                          <div
                            className="mb-2 p-2 border rounded"
                            style={{
                              fontSize: `${style.fontSize}px`,
                              lineHeight: style.lineHeight,
                              letterSpacing: `${style.letterSpacing}em`,
                            }}
                          >
                            这是用于测试可读性的示例文本。Matrix 系统会验证字体大小、行高、字母间距等参数是否符合 WCAG 标准。
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span>字体大小: {style.fontSize}px</span> •
                            <span> 行高: {style.lineHeight}</span> •
                            <span> 字间距: {style.letterSpacing}em</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 报告标签页 */}
              {activeTab === 'report' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">验证报告</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReport('markdown')}
                      >
                        下载 Markdown
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReport('json')}
                      >
                        下载 JSON
                      </Button>
                    </div>
                  </div>
                  {validationResult.issues.length > 0 ? (
                    <div className="space-y-2">
                      {validationResult.issues.map((issue, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={issue.severity === 'error' ? 'destructive' : 'secondary'}>
                              {issue.severity}
                            </Badge>
                            <span className="font-medium">{issue.type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-sm text-blue-600 mt-1">💡 {issue.suggestion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>🎉 所有测试都通过了！</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

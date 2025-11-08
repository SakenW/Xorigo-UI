/**
 * ⚡ 输入增强组件预览系统
 *
 * 支持的组件：15个输入增强组件
 * - Autocomplete, ButtonGroup, CheckboxGroup, Chip, ColorPicker
 * - DatePicker, DateTimePicker, TimePicker, FileUpload
 * - IconButton, RadioGroup, RangeSlider, Rating, Toggle
 * - UploadButton（DatePicker, ColorPicker, Upload已在现有39个中）
 */

'use client'

import React from 'react'

interface EnhancedInputsPreviewProps {
  componentName: string
}

export function EnhancedInputsPreview({ componentName }: EnhancedInputsPreviewProps) {
  const renderEnhancedInputsPreview = () => {
    switch (componentName) {
      case 'Autocomplete':
        return (
          <div className="w-full h-32 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="relative">
                <div className="w-full h-8 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded px-2 text-xs">搜索项目...</div>
                <div className="absolute top-8 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 rounded">苹果</div>
                    <div className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded">应用</div>
                    <div className="px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded">香蕉</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Autocomplete</p>
          </div>
        )

      case 'ButtonGroup':
        return (
          <div className="w-full h-32 bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex space-x-1">
                <div className="px-3 py-1 bg-purple-600 text-white rounded-l text-xs">选项1</div>
                <div className="px-3 py-1 bg-white dark:bg-gray-700 border border-purple-600 text-xs">选项2</div>
                <div className="px-3 py-1 bg-white dark:bg-gray-700 border border-purple-600 rounded-r text-xs">选项3</div>
              </div>
              <div className="flex space-x-1">
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800 rounded text-xs">A</div>
                <div className="px-2 py-1 bg-purple-600 text-white rounded text-xs">B</div>
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800 rounded text-xs">C</div>
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-800 rounded text-xs">D</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ButtonGroup</p>
          </div>
        )

      case 'CheckboxGroup':
        return (
          <div className="w-full h-32 bg-green-50 dark:bg-green-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded text-xs">选项1</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded text-xs">选项2</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-gray-400 dark:border-gray-600 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded text-xs">选项3</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-gray-400 dark:border-gray-600 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded text-xs">全选</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">CheckboxGroup</p>
          </div>
        )

      case 'Chip':
        return (
          <div className="w-full h-32 bg-orange-50 dark:bg-orange-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200 rounded-full text-xs">可删除×</div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 rounded-full text-xs">选择✓</div>
                <div className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 rounded-full text-xs">标准</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">小</div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">中</div>
                <div className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">大</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Chip</p>
          </div>
        )

      case 'ColorPicker':
        return (
          <div className="w-full h-32 bg-pink-50 dark:bg-pink-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded border-2 border-white shadow"></div>
                <div className="w-8 h-8 bg-blue-500 rounded border-2 border-white shadow"></div>
                <div className="w-8 h-8 bg-green-500 rounded border-2 border-white shadow"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded border-2 border-white shadow"></div>
                <div className="w-8 h-8 bg-purple-500 rounded border-2 border-white shadow"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded"></div>
                <div className="w-6 h-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs flex items-center justify-center">↓</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">ColorPicker</p>
          </div>
        )

      case 'DateTimePicker':
        return (
          <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="w-full h-6 bg-white dark:bg-gray-700 border border-indigo-300 dark:border-indigo-600 rounded px-2 text-xs">2024-01-15 14:30</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">日期</div>
                  <div className="grid grid-cols-7 gap-0.5 text-xs">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 ${i === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'} rounded flex items-center justify-center`}>
                        {i + 10}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">时间</div>
                  <div className="text-xs space-y-1">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded px-1">14</div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded px-1">30</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">DateTimePicker</p>
          </div>
        )

      case 'TimePicker':
        return (
          <div className="w-full h-32 bg-cyan-50 dark:bg-cyan-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">小时</div>
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 border border-cyan-300 dark:border-cyan-600 rounded flex items-center justify-center text-xs font-bold">14</div>
                </div>
                <div className="text-2xl text-gray-600 dark:text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">分钟</div>
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 border border-cyan-300 dark:border-cyan-600 rounded flex items-center justify-center text-xs font-bold">30</div>
                </div>
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-6 h-6 bg-cyan-600 text-white rounded text-xs flex items-center justify-center">AM</div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded text-xs flex items-center justify-center">PM</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">TimePicker</p>
          </div>
        )

      case 'IconButton':
        return (
          <div className="w-full h-32 bg-teal-50 dark:bg-teal-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center text-xs">+</div>
                <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center text-xs">×</div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs">🔍</div>
                <div className="w-8 h-8 bg-gray-600 text-white rounded-lg flex items-center justify-center text-xs">⚙</div>
              </div>
              <div className="flex justify-center space-x-2">
                <div className="w-6 h-6 bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-200 rounded-full flex items-center justify-center text-xs">♥</div>
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-xs">★</div>
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-xs">⇅</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">IconButton</p>
          </div>
        )

      case 'RadioGroup':
        return (
          <div className="w-full h-32 bg-rose-50 dark:bg-rose-900 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-600 rounded-full border-2 border-white shadow"></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded text-xs">选项A</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-gray-400 dark:border-gray-600 rounded-full"></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded text-xs">选项B</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-gray-400 dark:border-gray-600 rounded-full"></div>
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded text-xs">选项C</div>
              </div>
              <div className="flex space-x-1">
                <div className="w-4 h-4 bg-rose-100 dark:bg-rose-800 rounded-full text-xs"></div>
                <div className="w-4 h-4 bg-rose-600 rounded-full text-xs"></div>
                <div className="w-4 h-4 bg-rose-100 dark:bg-rose-800 rounded-full text-xs"></div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">RadioGroup</p>
          </div>
        )

      case 'RangeSlider':
        return (
          <div className="w-full h-32 bg-amber-50 dark:bg-amber-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="relative">
                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-1/3 h-1 bg-amber-600 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-3 h-3 bg-amber-600 rounded-full border-2 border-white shadow"></div>
                </div>
                <div className="text-center text-xs text-gray-600 dark:text-gray-400">33%</div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-blue-600 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow"></div>
                  <div className="absolute top-1/2 left-3/4 transform -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>25</span>
                  <span>75</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">RangeSlider</p>
          </div>
        )

      case 'Rating':
        return (
          <div className="w-full h-32 bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-center space-x-1">
                <div className="w-4 h-4 text-yellow-400 text-xs">★</div>
                <div className="w-4 h-4 text-yellow-400 text-xs">★</div>
                <div className="w-4 h-4 text-yellow-400 text-xs">★</div>
                <div className="w-4 h-4 text-yellow-400 text-xs">★</div>
                <div className="w-4 h-4 text-gray-300 dark:text-gray-600 text-xs">★</div>
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-4 h-4 text-yellow-400 text-xs">♥</div>
                <div className="w-4 h-4 text-yellow-400 text-xs">♥</div>
                <div className="w-4 h-4 text-yellow-400 text-xs">♥</div>
                <div className="w-4 h-4 text-gray-300 dark:text-gray-600 text-xs">♥</div>
                <div className="w-4 h-4 text-gray-300 dark:text-gray-600 text-xs">♥</div>
              </div>
              <div className="text-center text-xs text-gray-600 dark:text-gray-400">4.0 / 5.0</div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Rating</p>
          </div>
        )

      case 'Toggle':
        return (
          <div className="w-full h-32 bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 bg-slate-700 rounded-full relative">
                    <div className="absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">关闭</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                    <div className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">开启</span>
                </div>
              </div>
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="w-8 h-4 bg-green-600 rounded-full relative">
                  <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                  <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Toggle</p>
          </div>
        )

      case 'UploadButton':
        return (
          <div className="w-full h-32 bg-emerald-50 dark:bg-emerald-900 rounded-lg p-4">
            <div className="space-y-3">
              <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-600 rounded-lg p-3 text-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-xs">↑</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">点击上传或拖拽文件</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">支持 JPG, PNG, PDF</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">UploadButton</p>
          </div>
        )

      default:
        return (
          <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{componentName}</p>
          </div>
        )
    }
  }

  return (
    <div className="flex items-center justify-center">
      {renderEnhancedInputsPreview()}
    </div>
  )
}
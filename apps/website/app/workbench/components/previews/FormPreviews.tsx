'use client'

import React from 'react'

// 表单组件预览缩略图
export function FormPreviews({ componentName }: { componentName: string }) {
  switch (componentName) {
    case 'TextInput':
      return (
        <div className="w-full max-w-xs">
          <input
            type="text"
            placeholder="请输入文本..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>
      )

    case 'PasswordInput':
      return (
        <div className="w-full max-w-xs">
          <div className="relative">
            <input
              type="password"
              placeholder="请输入密码..."
              className="w-full px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <span className="absolute right-2 top-2 text-gray-400">👁</span>
          </div>
        </div>
      )

    case 'NumberInput':
      return (
        <div className="w-full max-w-xs">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
            <input
              type="number"
              value="0"
              className="w-16 text-center text-sm border-0 focus:outline-none"
              disabled
            />
            <button className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
          </div>
        </div>
      )

    case 'EmailInput':
      return (
        <div className="w-full max-w-xs">
          <div className="relative">
            <input
              type="email"
              placeholder="请输入邮箱..."
              className="w-full px-3 py-2 pr-16 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <span className="absolute right-2 top-2 text-xs text-gray-400">@example.com</span>
          </div>
        </div>
      )

    case 'PhoneInput':
      return (
        <div className="w-full max-w-xs">
          <div className="flex items-center border border-gray-300 rounded-md">
            <span className="px-2 py-2 text-sm text-gray-600 border-r border-gray-300">+86</span>
            <input
              type="tel"
              placeholder="请输入手机号..."
              className="flex-1 px-3 py-2 text-sm border-0 focus:outline-none"
              disabled
            />
          </div>
        </div>
      )

    case 'Select':
      return (
        <div className="w-full max-w-xs">
          <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
            <option>请选择选项...</option>
            <option>选项一</option>
            <option>选项二</option>
          </select>
        </div>
      )

    case 'Checkbox':
      return (
        <div className="space-y-2">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" disabled />
            选项一
          </label>
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" defaultChecked disabled />
            选项二
          </label>
        </div>
      )

    case 'Radio':
      return (
        <div className="space-y-2">
          <label className="flex items-center text-sm">
            <input type="radio" name="radio-thumb" className="mr-2" defaultChecked />
            选项一
          </label>
          <label className="flex items-center text-sm">
            <input type="radio" name="radio-thumb" className="mr-2" />
            选项二
          </label>
        </div>
      )

    case 'Switch':
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm">关闭</span>
          <button className="w-10 h-6 bg-gray-300 rounded-full relative transition-colors">
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
          </button>
          <span className="text-sm">开启</span>
        </div>
      )

    case 'Button':
      return (
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            主要按钮
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            次要按钮
          </button>
        </div>
      )

    default:
      return null
  }
}
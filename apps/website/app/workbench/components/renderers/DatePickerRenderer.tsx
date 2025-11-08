'use client'

import React, { useState } from 'react'

interface DatePickerRendererProps {
  value?: string
  onChange?: (value: string) => void
  format?: string
  disabled?: boolean
  updateProp?: (prop: string, value: any) => void
}

export default function DatePickerRenderer({
  value = '',
  onChange,
  format = 'YYYY-MM-DD',
  disabled = false,
  updateProp
}: DatePickerRendererProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value || new Date().toISOString().split('T')[0])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const dateStr = date.toISOString().split('T')[0]
    setSelectedDate(dateStr)
    if (onChange) onChange(dateStr)
    if (updateProp) updateProp('value', dateStr)
    setIsOpen(false)
  }

  const handleToday = () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    setSelectedDate(dateStr)
    if (onChange) onChange(dateStr)
    if (updateProp) updateProp('value', dateStr)
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedDate('')
    if (onChange) onChange('')
    if (updateProp) updateProp('value', '')
    setIsOpen(false)
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '请选择日期'
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // 星期标题
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const weekHeader = weekDays.map(day => (
      <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
        {day}
      </div>
    ))

    // 空白天数
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // 月份天数
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0]
      const isSelected = dateStr === selectedDate
      const isToday = dateStr === new Date().toISOString().split('T')[0]

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`
            p-2 text-sm rounded-md transition-colors
            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
            ${isToday && !isSelected ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
            ${!isSelected && !isToday ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
          `}
        >
          {day}
        </button>
      )
    }

    return [...weekHeader, ...days]
  }

  const changeMonth = (increment: number) => {
    setCurrentMonth(prev => {
      const newMonth = prev + increment
      if (newMonth < 0) {
        setCurrentYear(year => year - 1)
        return 11
      }
      if (newMonth > 11) {
        setCurrentYear(year => year + 1)
        return 0
      }
      return newMonth
    })
  }

  return (
    <div className="w-full">
      {/* 日期选择器输入框 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between px-3 py-2 border rounded-md
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            border-gray-300 dark:border-gray-600
            ${disabled
              ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700'
              : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
        >
          <span className={selectedDate ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
            {formatDisplayDate(selectedDate)}
          </span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* 日历弹窗 */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 z-50 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            {/* 日历头部 */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {currentYear}年{currentMonth + 1}月
              </div>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 日历主体 */}
            <div className="grid grid-cols-7 gap-1 p-3">
              {renderCalendar()}
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-between p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                今天
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                清空
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 状态信息 */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        选中日期: {selectedDate || '未选择'} | 格式: {format} | 状态: {disabled ? '禁用' : '可用'}
      </div>
    </div>
  )
}
'use client'

import React, { useState, useRef, useEffect } from 'react'

interface SelectRendererProps {
  options?: Array<{ value: string; label: string }>
  multiple?: boolean
  searchable?: boolean
  selected?: string | string[]
  onChange?: (value: string | string[]) => void
  updateProp?: (prop: string, value: any) => void
}

export default function SelectRenderer({
  options = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' },
    { value: 'option4', label: '选项 4' }
  ],
  multiple = false,
  searchable = false,
  selected = multiple ? [] : '',
  onChange,
  updateProp
}: SelectRendererProps) {
  // 确保 options 是数组格式
  const safeOptions = Array.isArray(options) ? options :
    (typeof options === 'string' ?
      (options.startsWith('[') ? JSON.parse(options) : []) : []
    )

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [localSelected, setLocalSelected] = useState(selected)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = safeOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (value: string) => {
    let newSelected: string | string[]

    if (multiple) {
      const currentSelected = Array.isArray(localSelected) ? localSelected : []
      if (currentSelected.includes(value)) {
        newSelected = currentSelected.filter(item => item !== value)
      } else {
        newSelected = [...currentSelected, value]
      }
    } else {
      newSelected = value
      setIsOpen(false)
    }

    setLocalSelected(newSelected)
    if (onChange) onChange(newSelected)
    if (updateProp) updateProp('selected', newSelected)
  }

  const removeSelected = (value: string) => {
    const newSelected = (Array.isArray(localSelected) ? localSelected : []).filter(item => item !== value)
    setLocalSelected(newSelected)
    if (onChange) onChange(newSelected)
    if (updateProp) updateProp('selected', newSelected)
  }

  const getSelectedLabels = () => {
    if (multiple && Array.isArray(localSelected)) {
      return localSelected.map(value =>
        safeOptions.find(opt => opt.value === value)?.label || value
      )
    }
    const option = safeOptions.find(opt => opt.value === localSelected)
    return option ? [option.label] : []
  }

  return (
    <div className="w-full" ref={dropdownRef}>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          {multiple && Array.isArray(localSelected) && localSelected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {getSelectedLabels().map((label, index) => (
                <span
                  key={`select-option-${index}`}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                >
                  {label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSelected(Array.isArray(localSelected) ? localSelected[index] : '')
                    }}
                    className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          ) : localSelected ? (
            <div>{getSelectedLabels()[0]}</div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">请选择...</div>
          )}
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                <input
                  type="text"
                  placeholder="搜索选项..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {filteredOptions.map(option => {
              const isSelected = multiple
                ? Array.isArray(localSelected) && localSelected.includes(option.value)
                : localSelected === option.value

              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mr-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {option.label}
                </div>
              )
            })}

            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
                没有找到匹配的选项
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
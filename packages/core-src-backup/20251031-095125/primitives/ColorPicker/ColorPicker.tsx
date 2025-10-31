'use client'

import { forwardRef, useState, useEffect, useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../foundations/utils/cn'
import {
  generateAriaProps,
  generateKeyboardNavigation,
  type ComponentAriaAttributes
} from '../../utils/accessibility'

export const colorPickerVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]",
        minimal: "bg-transparent text-[var(--color-text-primary)]",
        elevated: "bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] shadow-md hover:shadow-lg"
      },
      size: {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
        xl: "w-16 h-16 text-xl"
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface ColorPickerProps extends React.ButtonHTMLAttributes<HTMLDivElement>, VariantProps<typeof colorPickerVariants> {
  value?: string
  defaultValue?: string
  onChange?: (color: string) => void
  presetColors?: string[]
  showAlpha?: boolean
  disabled?: boolean
  placeholder?: string
}

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  ({
    className,
    variant,
    size,
    value,
    defaultValue = '#000000',
    onChange,
    presetColors = [
      '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
      '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
    ],
    showAlpha = false,
    disabled = false,
    placeholder = 'Select color',
    onClick,
    ...props
  },
  ref
) => {
  const [selectedColor, setSelectedColor] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  // 同步外部 value
  useEffect(() => {
    if (value !== undefined) {
      setSelectedColor(value)
    }
  }, [value])

  // 处理颜色选择
  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    onChange?.(color)
    setIsOpen(false)
  }

  // 生成 ARIA 属性
  const ariaProps = generateAriaProps('ColorPicker', {
    disabled,
    'aria-label': placeholder,
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox'
  })

  // 生成键盘导航处理
  const keyboardHandlers = generateKeyboardNavigation('ColorPicker', {
    onClick,
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen(!isOpen)
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
        setShowCustomPicker(false)
      }
    }
  })

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowCustomPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={pickerRef}>
      <motion.div
        ref={ref}
        className={cn(colorPickerVariants({ variant, size }), className)}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        {...ariaProps}
        {...keyboardHandlers}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="w-full h-full rounded-md border-2 border-[var(--color-border-default)]"
          style={{ backgroundColor: selectedColor }}
        />
        {selectedColor && (
          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white border border-[var(--color-border-default)]" />
        )}
      </motion.div>

      {/* 颜色选择面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] rounded-lg shadow-lg p-4 min-w-[200px]"
          >
            {/* 预设颜色 */}
            <div className="mb-4">
              <div className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                预设颜色
              </div>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((color, index) => (
                  <motion.button
                    key={index}
                    className="w-8 h-8 rounded-md border-2 border-[var(--color-border-default)] hover:border-[var(--color-primary-500)] transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`选择颜色 ${color}`}
                  />
                ))}
              </div>
            </div>

            {/* 自定义颜色选择器 */}
            <div className="border-t border-[var(--color-border-default)] pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-[var(--color-text-primary)]">
                  自定义颜色
                </div>
                <button
                  className="text-xs text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
                  onClick={() => setShowCustomPicker(!showCustomPicker)}
                >
                  {showCustomPicker ? '隐藏' : '显示'}
                </button>
              </div>

              {/* 简化的颜色输入 */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                  aria-label="自定义颜色选择器"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm bg-[var(--color-surface-secondary)] border border-[var(--color-border-default)] rounded text-[var(--color-text-primary)]"
                  placeholder="#000000"
                  aria-label="颜色值输入"
                />
              </div>

              {/* Alpha 通道控制 */}
              {showAlpha && (
                <div className="mt-3 pt-3 border-t border-[var(--color-border-default)]">
                  <div className="text-xs text-[var(--color-text-secondary)] mb-1">
                    透明度: {Math.round((parseInt(selectedColor.slice(1, 3), 16) / 255) * 100)}%
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={100}
                    className="w-full"
                    aria-label="透明度控制"
                  />
                </div>
              )}
            </div>

            {/* 当前颜色预览 */}
            <div className="mt-4 pt-3 border-t border-[var(--color-border-default)]">
              <div className="flex items-center gap-3">
                <div className="text-sm text-[var(--color-text-secondary)]">
                  当前颜色:
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-[var(--color-border-default)]"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <code className="text-xs text-[var(--color-text-primary)]">
                    {selectedColor}
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }
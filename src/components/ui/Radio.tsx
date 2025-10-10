import React, { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// RadioGroup Context
interface RadioGroupContextValue {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  name?: string
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined)

const useRadioGroup = () => {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error('Radio must be used within RadioGroup')
  }
  return context
}

// RadioGroup Props
export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  name?: string
  direction?: 'horizontal' | 'vertical'
  children: React.ReactNode
  className?: string
}

// Radio Props
export interface RadioProps {
  value: string
  label?: React.ReactNode
  description?: string
  disabled?: boolean
  className?: string
}

// RadioGroup Component
export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  defaultValue,
  onChange,
  disabled = false,
  name,
  direction = 'vertical',
  children,
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <RadioGroupContext.Provider
      value={{
        value: currentValue,
        onChange: handleChange,
        disabled,
        name,
      }}
    >
      <div
        className={cn(
          'flex gap-4',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
          className
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

// Radio Component
export const Radio: React.FC<RadioProps> = ({
  value,
  label,
  description,
  disabled: disabledProp,
  className,
}) => {
  const { value: groupValue, onChange, disabled: groupDisabled, name } = useRadioGroup()
  const disabled = disabledProp || groupDisabled
  const isChecked = value === groupValue

  const handleChange = () => {
    if (!disabled) {
      onChange(value)
    }
  }

  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer group',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
        />

        {/* 外圈 */}
        <div
          className={cn(
            'w-5 h-5 rounded-full border-2 transition-all',
            isChecked
              ? 'border-blue-500 bg-white dark:bg-gray-800'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
            !disabled && 'group-hover:border-blue-400'
          )}
        />

        {/* 内圈（选中状态） */}
        {isChecked && (
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-blue-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </div>

      {/* 标签和描述 */}
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </div>
          )}
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </div>
          )}
        </div>
      )}
    </label>
  )
}

// RadioCard Component (卡片样式的 Radio)
export interface RadioCardProps extends RadioProps {
  icon?: React.ReactNode
}

export const RadioCard: React.FC<RadioCardProps> = ({
  value,
  label,
  description,
  icon,
  disabled: disabledProp,
  className,
}) => {
  const { value: groupValue, onChange, disabled: groupDisabled } = useRadioGroup()
  const disabled = disabledProp || groupDisabled
  const isChecked = value === groupValue

  const handleClick = () => {
    if (!disabled) {
      onChange(value)
    }
  }

  return (
    <motion.div
      onClick={handleClick}
      className={cn(
        'relative p-4 border-2 rounded-lg cursor-pointer transition-all',
        isChecked
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {/* 选中指示器 */}
      {isChecked && (
        <div className="absolute top-3 right-3">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        {icon && (
          <div className="text-gray-600 dark:text-gray-400 mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex-1">
          {label && (
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {label}
            </div>
          )}
          {description && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default { RadioGroup, Radio, RadioCard }

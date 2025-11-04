import React, { forwardRef } from 'react'
import { Input, type InputProps } from './input'
import { Lock } from 'lucide-react'

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'showPasswordToggle'> {
  showStrength?: boolean
}

/**
 * PasswordInput - 密码输入组件
 *
 * 基于 Input 组件的专门密码输入框，自动包含：
 * - 密码显示/隐藏切换
 * - 锁图标
 * - 可选的密码强度提示
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, leftIcon, value = '', helperText, ...props }, ref) => {
    // 计算密码强度
    const calculateStrength = (password: string): { level: number; text: string; color: string } => {
      if (!password) return { level: 0, text: '', color: '' }

      let strength = 0
      const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      }

      strength += checks.length ? 1 : 0
      strength += checks.lowercase ? 1 : 0
      strength += checks.uppercase ? 1 : 0
      strength += checks.number ? 1 : 0
      strength += checks.special ? 1 : 0

      if (strength <= 2) return { level: 1, text: '弱', color: 'text-red-500' }
      if (strength <= 3) return { level: 2, text: '中等', color: 'text-yellow-500' }
      if (strength <= 4) return { level: 3, text: '强', color: 'text-green-500' }
      return { level: 4, text: '非常强', color: 'text-emerald-500' }
    }

    const strength = showStrength ? calculateStrength(String(value)) : null

    const strengthHelperText = strength && strength.level > 0
      ? `密码强度：${strength.text}`
      : helperText

    return (
      <Input
        ref={ref}
        type="password"
        showPasswordToggle
        leftIcon={leftIcon || <Lock className="w-4 h-4" />}
        value={value}
        helperText={strengthHelperText}
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

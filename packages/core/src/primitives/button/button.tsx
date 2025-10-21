// Button 原子组件（示例）
import React from 'react'
import { useTheme } from '../../system/theme-provider'
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary'|'secondary'|'ghost'
}
export const Button: React.FC<ButtonProps> = ({ variant='primary', style, ...rest }) => {
  const { tokens } = useTheme()
  const base: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: String(tokens.radius || 8) + 'px',
    border: '1px solid transparent',
    cursor: 'pointer'
  }
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--xor-accent)', color: 'var(--xor-foreground)' },
    secondary:{ background: 'transparent', color: 'var(--xor-accent)', borderColor:'var(--xor-accent)' },
    ghost:   { background: 'transparent', color: 'inherit' }
  }
  return <button style={{ ...base, ...(variants[variant]||{}), ...style }} {...rest} />
}

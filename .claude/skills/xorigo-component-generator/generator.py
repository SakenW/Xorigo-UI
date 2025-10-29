#!/usr/bin/env python3
"""
Xorigo UI 组件生成器
用于快速创建符合 Xorigo UI 标准的 React 组件
"""

import os
import sys
from pathlib import Path

class ComponentGenerator:
    def __init__(self, base_path: str = "/home/saken/project/Xorigo-UI/packages/core/src"):
        self.base_path = Path(base_path)
        self.components = ["select", "checkbox", "switch"]
        self.typography_components = ["heading", "text", "caption"]

    def ensure_directory(self, directory: Path):
        """确保目录存在"""
        directory.mkdir(parents=True, exist_ok=True)

    def create_component(self, component_name: str, component_type: str = "form"):
        """创建单个组件"""
        name_kebab = component_name.lower()
        name_pascal = component_name.capitalize()

        if component_type == "form":
            component_dir = self.base_path / "form"
            file_path = component_dir / f"{name_kebab}.tsx"
        else:
            component_dir = self.base_path / "typography"
            file_path = component_dir / f"{name_kebab}.tsx"

        self.ensure_directory(component_dir)

        if component_type == "form":
            content = self.get_form_component_content(name_pascal, name_kebab)
        else:
            content = self.get_typography_component_content(name_pascal, name_kebab)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✅ Created {component_type} component: {file_path}")

    def get_form_component_content(self, name_pascal: str, name_kebab: str) -> str:
        """生成表单组件内容"""
        if name_kebab == "select":
            return self.get_select_component_content(name_pascal)
        elif name_kebab == "checkbox":
            return self.get_checkbox_component_content(name_pascal)
        elif name_kebab == "switch":
            return self.get_switch_component_content(name_pascal)
        else:
            return self.get_generic_form_component_content(name_pascal, name_kebab)

    def get_typography_component_content(self, name_pascal: str, name_kebab: str) -> str:
        """生成排版组件内容"""
        if name_kebab == "heading":
            return self.get_heading_component_content(name_pascal)
        elif name_kebab == "text":
            return self.get_text_component_content(name_pascal)
        elif name_kebab == "caption":
            return self.get_caption_component_content(name_pascal)
        else:
            return self.get_generic_typography_component_content(name_pascal, name_kebab)

    def get_select_component_content(self, name_pascal: str) -> str:
        return """'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Select 变体定义
export const selectVariants = cva(
  "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-[var(--color-primary-300)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)] focus:ring-[var(--color-primary-500)]",
        secondary: "border-[var(--color-secondary-300)] bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] focus:ring-[var(--color-secondary-500)]",
        outline: "border-[var(--color-neutral-300)] bg-transparent text-[var(--color-text-primary)] focus:ring-[var(--color-primary-500)]",
        ghost: "border-transparent bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-background-hover)]"
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-2 text-base",
        lg: "px-4 py-3 text-lg"
      },
      state: {
        default: "",
        error: "border-[var(--color-error-500)] focus:ring-[var(--color-error-500)]",
        success: "border-[var(--color-success-500)] focus:ring-[var(--color-success-500)]"
      }
    }
  }
)

// Select 属性接口
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  placeholder?: string
  error?: boolean
  helperText?: string
  onValueChange?: (value: string) => void
}

// Select 组件
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    state = "default",
    disabled = false,
    children,
    error,
    helperText,
    onValueChange,
    onChange,
    ...props
  }, ref) => {
    // 处理值变化
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onValueChange?.(e.target.value)
      onChange?.(e)
    }

    return (
      <motion.select
        ref={ref}
        className={cn(selectVariants({ variant, size, state, className }))}
        disabled={disabled}
        aria-disabled={disabled}
        aria-invalid={error || state === 'error'}
        aria-describedby={helperText ? `${props.id || 'select'}-helper` : undefined}
        {...props}
        onChange={handleChange}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.select>
    )
  }
)

Select.displayName = 'Select'
"""

    def get_checkbox_component_content(self, name_pascal: str) -> str:
        return """'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Checkbox 变体定义
export const checkboxVariants = cva(
  "relative inline-flex items-center justify-center rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-[var(--color-primary-300)] bg-[var(--color-background-primary)] focus:ring-[var(--color-primary-500)]",
        secondary: "border-[var(--color-secondary-300)] bg-[var(--color-background-secondary)] focus:ring-[var(--color-secondary-500)]",
        success: "border-[var(--color-success-300)] bg-[var(--color-background-primary)] focus:ring-[var(--color-success-500)]",
        warning: "border-[var(--color-warning-300)] bg-[var(--color-background-primary)] focus:ring-[var(--color-warning-500)]",
        error: "border-[var(--color-error-300)] bg-[var(--color-background-primary)] focus:ring-[var(--color-error-500)]"
      },
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
      },
      state: {
        default: "",
        error: "border-[var(--color-error-500)]"
      }
    }
  }
)

// Checkbox 属性接口
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  error?: boolean
  helperText?: string
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

// Checkbox 组件
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    state = "default",
    disabled = false,
    checked,
    defaultChecked,
    label,
    error,
    helperText,
    indeterminate,
    onCheckedChange,
    onChange,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false)
    const internalRef = React.useRef<HTMLInputElement>(null)
    const mergedRef = (ref || internalRef) as React.RefObject<HTMLInputElement>

    // 处理 indeterminate 状态
    React.useEffect(() => {
      if (mergedRef.current && indeterminate !== undefined) {
        mergedRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, mergedRef])

    // 处理选中状态变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
      onChange?.(e)
    }

    const checkbox = (
      <motion.input
        type="checkbox"
        ref={mergedRef}
        className={cn(checkboxVariants({ variant, size, state, className }))}
        disabled={disabled}
        checked={checked !== undefined ? checked : isChecked}
        aria-disabled={disabled}
        aria-invalid={error || state === 'error'}
        aria-describedby={helperText ? `${props.id || 'checkbox'}-helper` : undefined}
        {...props}
        onChange={handleChange}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        transition={{ duration: 0.15 }}
      />
    )

    if (label) {
      return (
        <motion.label
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          transition={{ duration: 0.15 }}
        >
          {checkbox}
          <span className={cn(
            "text-sm select-none",
            disabled ? "text-[var(--color-text-disabled)]" : "text-[var(--color-text-primary)]"
          )}>
            {label}
          </span>
        </motion.label>
      )
    }

    return checkbox
  }
)

Checkbox.displayName = 'Checkbox'
"""

    def get_switch_component_content(self, name_pascal: str) -> str:
        return """'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Switch 变体定义
export const switchVariants = cva(
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-primary-500)]",
        secondary: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-secondary-500)]",
        success: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-success-500)]",
        warning: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-warning-500)]",
        error: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-error-500)]"
      },
      size: {
        sm: "h-4 w-7",
        md: "h-6 w-11",
        lg: "h-8 w-15"
      },
      state: {
        default: "",
        error: "bg-[var(--color-error-300)]"
      }
    }
  }
)

// Switch Thumb 变体定义
export const switchThumbVariants = cva(
  "inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200",
  {
    variants: {
      variant: {
        primary: "bg-white",
        secondary: "bg-white",
        success: "bg-white",
        warning: "bg-white",
        error: "bg-white"
      },
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
      }
    }
  }
)

// Switch 属性接口
export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof switchVariants> {
  label?: string
  error?: boolean
  helperText?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

// Switch 组件
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    state = "default",
    disabled = false,
    checked,
    defaultChecked = false,
    label,
    error,
    helperText,
    onCheckedChange,
    onChange,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked)
    const internalRef = React.useRef<HTMLInputElement>(null)
    const mergedRef = (ref || internalRef) as React.RefObject<HTMLInputElement>

    // 处理选中状态变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
      onChange?.(e)
    }

    const isActuallyChecked = checked !== undefined ? checked : isChecked

    const switchElement = (
      <motion.button
        type="button"
        role="switch"
        ref={mergedRef}
        className={cn(
          switchVariants({ variant, size, state, className }),
          isActuallyChecked && "bg-[var(--color-primary-500)]"
        )}
        disabled={disabled}
        aria-disabled={disabled}
        aria-invalid={error || state === 'error'}
        aria-checked={isActuallyChecked}
        aria-describedby={helperText ? `${props.id || 'switch'}-helper` : undefined}
        onClick={() => {
          const newChecked = !isActuallyChecked
          setIsChecked(newChecked)
          onCheckedChange?.(newChecked)
          if (mergedRef.current) {
            mergedRef.current.checked = newChecked
          }
        }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <motion.span
          className={switchThumbVariants({ variant, size })}
          animate={{
            x: isActuallyChecked
              ? (size === 'sm' ? 12 : size === 'md' ? 20 : 28)
              : (size === 'sm' ? 1 : size === 'md' ? 2 : 3)
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    )

    if (label) {
      return (
        <motion.label
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          transition={{ duration: 0.15 }}
        >
          {switchElement}
          <span className={cn(
            "text-sm select-none",
            disabled ? "text-[var(--color-text-disabled)]" : "text-[var(--color-text-primary)]"
          )}>
            {label}
          </span>
        </motion.label>
      )
    }

    return switchElement
  }
)

Switch.displayName = 'Switch'
"""

    def get_heading_component_content(self, name_pascal: str) -> str:
        return """'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Heading 变体定义
export const headingVariants = cva(
  "font-bold tracking-tight",
  {
    variants: {
      level: {
        h1: "text-4xl md:text-5xl lg:text-6xl",
        h2: "text-3xl md:text-4xl lg:text-5xl",
        h3: "text-2xl md:text-3xl lg:text-4xl",
        h4: "text-xl md:text-2xl lg:text-3xl",
        h5: "text-lg md:text-xl lg:text-2xl",
        h6: "text-base md:text-lg lg:text-xl"
      },
      variant: {
        primary: "text-[var(--color-text-primary)]",
        secondary: "text-[var(--color-text-secondary)]",
        muted: "text-[var(--color-text-muted)]",
        accent: "text-[var(--color-primary-600)]"
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold"
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify"
      }
    }
  }
)

// Heading 属性接口
export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

// Heading 组件
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({
    className,
    level = 'h2',
    variant = "primary",
    weight = "bold",
    align = "left",
    as,
    children,
    ...props
  }, ref) => {
    const Component = as || level

    return (
      <motion(Component
        ref={ref}
        className={cn(headingVariants({ level, variant, weight, align, className }))}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.Component>
    )
  }
)

Heading.displayName = 'Heading'
"""

    def get_text_component_content(self, name_pascal: str) -> str:
        return """'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Text 变体定义
export const textVariants = cva(
  "leading-normal",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        '2xl': "text-2xl",
        '3xl': "text-3xl",
        '4xl': "text-4xl"
      },
      variant: {
        primary: "text-[var(--color-text-primary)]",
        secondary: "text-[var(--color-text-secondary)]",
        muted: "text-[var(--color-text-muted)]",
        accent: "text-[var(--color-primary-600)]",
        success: "text-[var(--color-success-600)]",
        warning: "text-[var(--color-warning-600)]",
        error: "text-[var(--color-error-600)]"
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold"
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify"
      }
    }
  }
)

// Text 属性接口
export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div'
}

// Text 组件
export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({
    className,
    size = "base",
    variant = "primary",
    weight = "normal",
    align = "left",
    as = "p",
    children,
    ...props
  }, ref) => {
    const Component = as

    return (
      <motion(Component
        ref={ref}
        className={cn(textVariants({ size, variant, weight, align, className }))}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.Component>
    )
  }
)

Text.displayName = 'Text'
"""

    def get_caption_component_content(self, name_pascal: str) -> str:
        return """'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Caption 变体定义
export const captionVariants = cva(
  "text-xs leading-relaxed",
  {
    variants: {
      variant: {
        primary: "text-[var(--color-text-primary)]",
        secondary: "text-[var(--color-text-secondary)]",
        muted: "text-[var(--color-text-muted)]",
        accent: "text-[var(--color-primary-600)]",
        success: "text-[var(--color-success-600)]",
        warning: "text-[var(--color-warning-600)]",
        error: "text-[var(--color-error-600)]"
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold"
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right"
      }
    }
  }
)

// Caption 属性接口
export interface CaptionProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof captionVariants> {
  as?: 'span' | 'p' | 'div'
}

// Caption 组件
export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(
  ({
    className,
    variant = "secondary",
    weight = "normal",
    align = "left",
    as = "span",
    children,
    ...props
  }, ref) => {
    const Component = as

    return (
      <motion(Component
        ref={ref}
        className={cn(captionVariants({ variant, weight, align, className }))}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.Component>
    )
  }
)

Caption.displayName = 'Caption'
"""

    def update_index_files(self):
        """更新 index 文件以导出新组件"""
        # 更新 form/index.ts
        form_index_path = self.base_path / "form" / "index.ts"
        if form_index_path.exists():
            with open(form_index_path, 'r', encoding='utf-8') as f:
                content = f.read()

            if 'select' not in content.lower():
                new_exports = "// Form components\nexport { Select } from './select'\nexport type { SelectProps } from './select'\nexport { Checkbox } from './checkbox'\nexport type { CheckboxProps } from './checkbox'\nexport { Switch } from './switch'\nexport type { SwitchProps } from './switch'\n\n"
                content = new_exports + content
                with open(form_index_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Updated {form_index_path}")

        # 更新 typography/index.ts
        typo_index_path = self.base_path / "typography" / "index.ts"
        if typo_index_path.exists():
            with open(typo_index_path, 'r', encoding='utf-8') as f:
                content = f.read()

            if 'heading' not in content.lower():
                new_exports = "// Typography components\nexport { Heading } from './heading'\nexport type { HeadingProps } from './heading'\nexport { Text } from './text'\nexport type { TextProps } from './text'\nexport { Caption } from './caption'\nexport type { CaptionProps } from './caption'\n\n"
                content = new_exports + content
                with open(typo_index_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Updated {typo_index_path}")

    def generate_all(self):
        """生成所有缺失的组件"""
        print("🚀 Starting Xorigo UI component generation...")

        # 创建表单组件
        for component in self.components:
            try:
                self.create_component(component, "form")
            except Exception as e:
                print(f"❌ Error creating {component}: {e}")

        # 创建排版组件
        for component in self.typography_components:
            try:
                self.create_component(component, "typography")
            except Exception as e:
                print(f"❌ Error creating {component}: {e}")

        # 更新 index 文件
        try:
            self.update_index_files()
        except Exception as e:
            print(f"❌ Error updating index files: {e}")

        print("✅ Component generation completed!")

def main():
    generator = ComponentGenerator()
    generator.generate_all()

if __name__ == "__main__":
    main()
'use client'

import React, { useState, ChangeEvent } from 'react'

export interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  className?: string
}

export function ColorPicker({ value = '#000000', onChange, className }: ColorPickerProps) {
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <input
      type="color"
      value={value}
      onChange={handleColorChange}
      className={className}
    />
  )
}
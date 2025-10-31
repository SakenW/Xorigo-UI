/**
 * Accessibility utilities
 * Provides helper functions for accessibility checks and improvements
 */

/**
 * Checks if a color combination meets WCAG AA standards
 */
export function checkWCAGAA(foreground: string, background: string): boolean {
  const contrast = getContrastRatio(foreground, background)
  return contrast >= 4.5
}

/**
 * Checks if a color combination meets WCAG AAA standards
 */
export function checkWCAGAAA(foreground: string, background: string): boolean {
  const contrast = getContrastRatio(foreground, background)
  return contrast >= 7
}

/**
 * Generates accessible color combinations
 */
export function generateAccessibleColors(baseColor: string): {
  background: string
  foreground: string
  foregroundSecondary: string
  accent: string
} {
  // This is a simplified implementation
  // In a real implementation, you'd want more sophisticated color generation
  return {
    background: '#ffffff',
    foreground: '#000000',
    foregroundSecondary: '#666666',
    accent: baseColor
  }
}

/**
 * Generates ARIA attributes for screen readers
 */
export function generateAriaAttributes(options: {
  label?: string
  description?: string
  required?: boolean
  invalid?: boolean
  expanded?: boolean
}): Record<string, string | boolean> {
  const attributes: Record<string, string | boolean> = {}

  if (options.label) attributes['aria-label'] = options.label
  if (options.description) attributes['aria-describedby'] = options.description
  if (options.required) attributes['aria-required'] = true
  if (options.invalid) attributes['aria-invalid'] = true
  if (options.expanded !== undefined) attributes['aria-expanded'] = options.expanded

  return attributes
}

// Import from container-aware-colors
import { getContrastRatio } from './container-aware-colors'
/**
 * Container-aware color utilities
 * Adjusts colors based on container background for better contrast
 */

import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from './theme-converter'

/**
 * Calculates relative luminance of a color
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculates contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)

  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
}

/**
 * Adjusts a color to ensure minimum contrast against background
 */
export function ensureContrast(
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string {
  const currentRatio = getContrastRatio(foreground, background)

  if (currentRatio >= targetRatio) {
    return foreground
  }

  const rgb = hexToRgb(foreground)
  if (!rgb) return foreground

  const bgRgb = hexToRgb(background)
  if (!bgRgb) return foreground

  // Determine if foreground is lighter than background
  const fgLuminance = getLuminance(foreground)
  const bgLuminance = getLuminance(background)
  const isLighter = fgLuminance > bgLuminance

  let { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)

  // Adjust lightness to achieve target contrast
  while (getContrastRatio(rgbToHex(hslToRgb(h, s, l).r, hslToRgb(h, s, l).g, hslToRgb(h, s, l).b), background) < targetRatio) {
    if (isLighter) {
      l = Math.min(100, l + 5)
    } else {
      l = Math.max(0, l - 5)
    }

    if (l === 0 || l === 100) break
  }

  const adjustedRgb = hslToRgb(h, s, l)
  return rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b)
}

/**
 * Generates a color palette based on a base color
 */
export function generateColorPalette(baseColor: string): {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
} {
  const rgb = hexToRgb(baseColor)
  if (!rgb) {
    // Return default palette if color is invalid
    return {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: baseColor,
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    }
  }

  let { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)

  return {
    50: rgbToHex(...Object.values(hslToRgb(h, Math.max(0, s - 40), Math.min(100, l + 45)))),
    100: rgbToHex(...Object.values(hslToRgb(h, Math.max(0, s - 30), Math.min(100, l + 35)))),
    200: rgbToHex(...Object.values(hslToRgb(h, Math.max(0, s - 20), Math.min(100, l + 25)))),
    300: rgbToHex(...Object.values(hslToRgb(h, Math.max(0, s - 10), Math.min(100, l + 15)))),
    400: rgbToHex(...Object.values(hslToRgb(h, s, Math.min(100, l + 5)))),
    500: baseColor,
    600: rgbToHex(...Object.values(hslToRgb(h, Math.min(100, s + 10), Math.max(0, l - 10)))),
    700: rgbToHex(...Object.values(hslToRgb(h, Math.min(100, s + 20), Math.max(0, l - 20)))),
    800: rgbToHex(...Object.values(hslToRgb(h, Math.min(100, s + 30), Math.max(0, l - 30)))),
    900: rgbToHex(...Object.values(hslToRgb(h, Math.min(100, s + 40), Math.max(0, l - 40)))),
  }
}